-- MIlink admin activity log v1
-- Safe to re-run after portal_v3.sql, approvals_v1.sql, contracts_v1.sql,
-- stripe_payments_v1.sql and e_transfer_payments_v1.sql.
-- Writes are intentionally trigger-owned; dashboard users only read this audit trail.

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_briefs(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  actor_role text not null check (actor_role in ('client', 'admin', 'system')),
  action text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_project_created_idx
  on public.activity_log (project_id, created_at desc);

create index if not exists activity_log_created_idx
  on public.activity_log (created_at desc);

alter table public.activity_log enable row level security;

drop policy if exists "Admins can read activity log" on public.activity_log;
create policy "Admins can read activity log"
  on public.activity_log
  for select
  to authenticated
  using (public.is_admin());

-- There are deliberately no INSERT, UPDATE, or DELETE policies. The trigger
-- functions below run as SECURITY DEFINER and provide the only write path.
create or replace function public.activity_log_actor_role()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return 'system';
  end if;

  if public.is_admin() then
    return 'admin';
  end if;

  return 'client';
end;
$$;

create or replace function public.log_project_brief_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_role text := public.activity_log_actor_role();
  v_project_name text := coalesce(new.business_name, 'Project');
begin
  if tg_op = 'INSERT' and new.status = 'submitted' then
    insert into public.activity_log (project_id, actor_id, actor_role, action, description)
    values (new.id, auth.uid(), v_actor_role, 'brief_submitted', v_project_name || ' project brief was submitted.');
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      insert into public.activity_log (project_id, actor_id, actor_role, action, description)
      values (
        new.id,
        auth.uid(),
        v_actor_role,
        case when new.status = 'submitted' then 'brief_submitted' else 'stage_changed' end,
        case
          when new.status = 'submitted' then v_project_name || ' project brief was submitted.'
          else v_project_name || ' moved to ' || replace(initcap(replace(new.status, '_', ' ')), '_', ' ') || '.'
        end
      );
    end if;

    if new.payment_status is distinct from old.payment_status then
      if new.payment_status in ('paid', 'approved') then
        insert into public.activity_log (project_id, actor_id, actor_role, action, description)
        values (new.id, auth.uid(), v_actor_role, 'payment_confirmed', 'Payment was confirmed for ' || v_project_name || '.');
      elsif new.payment_status = 'rejected' then
        insert into public.activity_log (project_id, actor_id, actor_role, action, description)
        values (new.id, auth.uid(), v_actor_role, 'payment_rejected', 'Payment was marked not received for ' || v_project_name || '.');
      elsif new.payment_status = 'e_transfer_submitted' then
        insert into public.activity_log (project_id, actor_id, actor_role, action, description)
        values (new.id, auth.uid(), v_actor_role, 'e_transfer_submitted', 'Client marked an e-Transfer as sent for ' || v_project_name || '.');
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists project_briefs_activity_log on public.project_briefs;
create trigger project_briefs_activity_log
after insert or update of status, payment_status on public.project_briefs
for each row execute procedure public.log_project_brief_activity();

create or replace function public.log_approval_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and new.status is distinct from old.status
     and new.status in ('approved', 'changes_requested') then
    insert into public.activity_log (project_id, actor_id, actor_role, action, description)
    values (
      new.project_id,
      auth.uid(),
      public.activity_log_actor_role(),
      'approval_decided',
      case
        when new.status = 'approved' then 'Client approved deliverable: ' || coalesce(new.title, 'Untitled deliverable') || '.'
        else 'Changes were requested for deliverable: ' || coalesce(new.title, 'Untitled deliverable') || '.'
      end
    );
  end if;
  return new;
end;
$$;

drop trigger if exists approvals_activity_log on public.approvals;
create trigger approvals_activity_log
after update of status on public.approvals
for each row execute procedure public.log_approval_activity();

create or replace function public.log_contract_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and new.status is distinct from old.status
     and new.status in ('signed'::public.contract_status, 'declined'::public.contract_status) then
    insert into public.activity_log (project_id, actor_id, actor_role, action, description)
    values (
      new.project_id,
      auth.uid(),
      public.activity_log_actor_role(),
      case when new.status = 'signed'::public.contract_status then 'contract_signed' else 'contract_declined' end,
      case
        when new.status = 'signed'::public.contract_status then coalesce(new.signer_name, 'Client') || ' signed ' || new.title || '.'
        else 'Client declined ' || new.title || '.'
      end
    );
  end if;
  return new;
end;
$$;

drop trigger if exists contracts_activity_log on public.contracts;
create trigger contracts_activity_log
after update of status on public.contracts
for each row execute procedure public.log_contract_activity();

create or replace function public.log_file_request_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.project_id is not null then
    insert into public.activity_log (project_id, actor_id, actor_role, action, description)
    values (
      new.project_id,
      coalesce(new.created_by, auth.uid()),
      public.activity_log_actor_role(),
      'file_request_created',
      'Requested file or information: ' || coalesce(new.title, 'Project asset') || '.'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists file_requests_activity_log on public.file_requests;
create trigger file_requests_activity_log
after insert on public.file_requests
for each row execute procedure public.log_file_request_activity();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'activity_log'
  ) then
    alter publication supabase_realtime add table public.activity_log;
  end if;
end $$;

notify pgrst, 'reload schema';
