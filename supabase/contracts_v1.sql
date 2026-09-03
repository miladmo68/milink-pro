-- MIlink Project Contracts v1
-- Safe to re-run after schema.sql, fix_rls_recursion.sql, notifications_v6.sql,
-- and notification_deep_links_v1.sql.  This stores a lightweight typed-signature
-- agreement record only; it never stores payment card data or third-party e-sign data.

do $$
begin
  create type public.contract_status as enum ('pending', 'signed', 'declined');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_briefs(id) on delete cascade,
  title text not null,
  body text not null,
  status public.contract_status not null default 'pending',
  created_at timestamptz not null default now(),
  signed_at timestamptz,
  signer_name text,
  -- A typed full name is the deliberate signature mechanism for this v1 flow.
  signer_signature text,
  decline_reason text,
  ip_address inet,
  created_by uuid not null references public.profiles(id) on delete restrict
);

-- These ALTERs keep the migration safe should an earlier partial prototype table exist.
alter table public.contracts
  add column if not exists signed_at timestamptz,
  add column if not exists signer_name text,
  add column if not exists signer_signature text,
  add column if not exists decline_reason text,
  add column if not exists ip_address inet,
  add column if not exists created_by uuid references public.profiles(id) on delete restrict;

create index if not exists contracts_project_created_idx
  on public.contracts (project_id, created_at desc);

create index if not exists contracts_project_status_idx
  on public.contracts (project_id, status, created_at desc);

alter table public.contracts enable row level security;

drop policy if exists "Clients can view own project contracts" on public.contracts;
drop policy if exists "Clients can decide own pending contracts" on public.contracts;
drop policy if exists "Admins have full access on contracts" on public.contracts;

-- This joins through the project only. It never queries profiles from a
-- profiles/payment-adjacent policy, so it preserves the non-recursive RLS model.
create policy "Clients can view own project contracts"
  on public.contracts
  for select
  to authenticated
  using (
    exists (
      select 1 from public.project_briefs brief
      where brief.id = contracts.project_id
        and brief.client_id = auth.uid()
    )
  );

create policy "Clients can decide own pending contracts"
  on public.contracts
  for update
  to authenticated
  using (
    exists (
      select 1 from public.project_briefs brief
      where brief.id = contracts.project_id
        and brief.client_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.project_briefs brief
      where brief.id = contracts.project_id
        and brief.client_id = auth.uid()
    )
  );

create policy "Admins have full access on contracts"
  on public.contracts
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS protects the row scope. This trigger protects agency-authored contract
-- text and limits clients to a one-time signed/declined decision.
create or replace function public.guard_client_contract_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  project_owner uuid;
begin
  if auth.uid() is not null and not public.is_admin() then
    select client_id into project_owner
    from public.project_briefs
    where id = old.project_id;

    if project_owner is distinct from auth.uid() then
      raise exception 'You may only decide contracts for your own project';
    end if;

    if old.status is distinct from 'pending'::public.contract_status then
      raise exception 'A completed contract decision cannot be changed';
    end if;

    if new.id is distinct from old.id
      or new.project_id is distinct from old.project_id
      or new.title is distinct from old.title
      or new.body is distinct from old.body
      or new.created_at is distinct from old.created_at
      or new.created_by is distinct from old.created_by
      or new.ip_address is distinct from old.ip_address then
      raise exception 'Clients may only sign or decline a contract';
    end if;

    if new.status = 'signed'::public.contract_status then
      if nullif(trim(coalesce(new.signer_name, '')), '') is null
        or nullif(trim(coalesce(new.signer_signature, '')), '') is null then
        raise exception 'A full typed name is required to sign this contract';
      end if;
      if trim(new.signer_signature) is distinct from trim(new.signer_name) then
        raise exception 'The typed signature must match the signer name';
      end if;
      new.signed_at = now();
      new.decline_reason = null;
    elsif new.status = 'declined'::public.contract_status then
      if nullif(trim(coalesce(new.decline_reason, '')), '') is null then
        raise exception 'A reason is required to decline this contract';
      end if;
      new.signed_at = null;
      new.signer_name = null;
      new.signer_signature = null;
    else
      raise exception 'Clients may only sign or decline a pending contract';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists contracts_guard_client_decision on public.contracts;
create trigger contracts_guard_client_decision
before update on public.contracts
for each row execute procedure public.guard_client_contract_decision();

-- Project-specific deep links match the shared notification navigation contract.
create or replace function public.notify_contract_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  contract_client_id uuid;
  client_destination text;
  admin_destination text;
begin
  select client_id into contract_client_id
  from public.project_briefs
  where id = new.project_id;

  client_destination := '/portal?tab=contracts&project=' || new.project_id::text;
  admin_destination := '/admin?tab=projects&project=' || new.project_id::text;

  if tg_op = 'INSERT' then
    -- `notifications.project_id` is a legacy foreign key to public.projects in
    -- this installation. The canonical project id is carried safely in the
    -- deep-link below, so do not write project_briefs.id into that FK column.
    insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link, type)
    values (
      contract_client_id, contract_client_id, new.created_by,
      'Contract ready to sign', coalesce(new.title, 'A project agreement is ready for your review.'),
      coalesce(new.title, 'A project agreement is ready for your review.'),
      client_destination, client_destination, 'contract'
    );
  elsif tg_op = 'UPDATE'
    and new.status is distinct from old.status
    and new.status in ('signed'::public.contract_status, 'declined'::public.contract_status) then
    insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link, type)
    select id, id, contract_client_id,
      case when new.status = 'signed'::public.contract_status then 'Contract signed' else 'Contract declined' end,
      case when new.status = 'signed'::public.contract_status
        then coalesce(new.signer_name, 'The client') || ' signed ' || new.title
        else coalesce(new.decline_reason, 'The client declined ' || new.title)
      end,
      case when new.status = 'signed'::public.contract_status
        then coalesce(new.signer_name, 'The client') || ' signed ' || new.title
        else coalesce(new.decline_reason, 'The client declined ' || new.title)
      end,
      admin_destination, admin_destination, 'contract'
    from public.profiles
    where role in ('admin', 'super_admin');
  end if;
  return new;
end;
$$;

drop trigger if exists contracts_notify_activity on public.contracts;
create trigger contracts_notify_activity
after insert or update of status on public.contracts
for each row execute procedure public.notify_contract_activity();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'contracts'
  ) then
    alter publication supabase_realtime add table public.contracts;
  end if;
end $$;

notify pgrst, 'reload schema';
