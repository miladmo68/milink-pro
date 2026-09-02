-- MiLink Stripe Checkout payments (safe to re-run)
-- Stores Stripe identifiers only. Card data is never written to Supabase.

alter table public.project_briefs
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_checkout_attempt_key uuid,
  add column if not exists stripe_checkout_attempt_created_at timestamptz,
  add column if not exists stripe_paid_at timestamptz,
  add column if not exists payment_method text,
  add column if not exists amount_paid_cents integer;

-- Preserve the existing e-Transfer lifecycle while allowing Stripe Checkout states.
alter table public.project_briefs
  drop constraint if exists project_briefs_payment_status_check;

alter table public.project_briefs
  add constraint project_briefs_payment_status_check
  check (payment_status in (
    'not_requested', 'pending_review', 'approved', 'rejected',
    'checkout_pending', 'paid'
  ));

alter table public.project_briefs
  drop constraint if exists project_briefs_payment_method_check;

alter table public.project_briefs
  add constraint project_briefs_payment_method_check
  check (payment_method is null or payment_method in ('stripe', 'e_transfer'));

alter table public.project_briefs
  drop constraint if exists project_briefs_amount_paid_cents_check;

alter table public.project_briefs
  add constraint project_briefs_amount_paid_cents_check
  check (amount_paid_cents is null or amount_paid_cents >= 0);

-- Existing manual review records remain explicitly classified as e-Transfers.
update public.project_briefs
set payment_method = 'e_transfer'
where payment_method is null
  and payment_status in ('pending_review', 'approved', 'rejected');

create unique index if not exists project_briefs_stripe_payment_intent_id_key
  on public.project_briefs (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create unique index if not exists project_briefs_stripe_checkout_session_id_key
  on public.project_briefs (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

-- Dedicated ledger for webhook idempotency. It contains no sensitive card data.
create table if not exists public.stripe_webhook_events (
  stripe_event_id text primary key,
  checkout_session_id text not null unique,
  payment_intent_id text,
  project_brief_id uuid not null references public.project_briefs(id) on delete cascade,
  amount_paid_cents integer not null check (amount_paid_cents >= 0),
  processed_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Admins can read Stripe webhook events" on public.stripe_webhook_events;
create policy "Admins can read Stripe webhook events"
  on public.stripe_webhook_events
  for select
  to authenticated
  using (public.is_admin());

-- Existing project_briefs owner/admin policies continue to protect all brief data.
-- These named policies document and enforce the payment read/admin-update contract.
drop policy if exists "Clients read own project payment records" on public.project_briefs;
create policy "Clients read own project payment records"
  on public.project_briefs
  for select
  to authenticated
  using (client_id = auth.uid() or public.is_admin());

drop policy if exists "Admins update project payment records" on public.project_briefs;
create policy "Admins update project payment records"
  on public.project_briefs
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Do not let a client forge a paid Stripe state through the general brief update policy.
create or replace function public.guard_project_brief_payment_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and auth.uid() = old.client_id
     and not public.is_admin() then
    if new.stripe_customer_id is distinct from old.stripe_customer_id
       or new.stripe_payment_intent_id is distinct from old.stripe_payment_intent_id
       or new.stripe_checkout_session_id is distinct from old.stripe_checkout_session_id
       or new.stripe_checkout_attempt_key is distinct from old.stripe_checkout_attempt_key
       or new.stripe_checkout_attempt_created_at is distinct from old.stripe_checkout_attempt_created_at
       or new.stripe_paid_at is distinct from old.stripe_paid_at
       or new.payment_method is distinct from old.payment_method
       or new.amount_paid_cents is distinct from old.amount_paid_cents
       or new.payment_status is distinct from old.payment_status then
      raise exception 'Payment fields can only be changed by MiLink or a verified payment webhook';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_project_brief_payment_fields on public.project_briefs;
create trigger guard_project_brief_payment_fields
  before update on public.project_briefs
  for each row execute function public.guard_project_brief_payment_fields();

-- An atomic, rerun-safe webhook recorder. service_role calls this from the route handler.
create or replace function public.record_stripe_checkout_payment(
  p_stripe_event_id text,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_project_brief_id uuid,
  p_amount_paid_cents integer,
  p_stripe_customer_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_status text;
begin
  -- Lock first: concurrent different Checkout sessions can never both mark a brief paid.
  select payment_status into v_payment_status
  from public.project_briefs
  where id = p_project_brief_id
  for update;

  if not found then
    raise exception 'Project brief % does not exist', p_project_brief_id;
  end if;

  if v_payment_status = 'paid' then
    return false;
  end if;

  insert into public.stripe_webhook_events (
    stripe_event_id, checkout_session_id, payment_intent_id, project_brief_id, amount_paid_cents
  ) values (
    p_stripe_event_id, p_checkout_session_id, p_payment_intent_id, p_project_brief_id, p_amount_paid_cents
  ) on conflict do nothing;

  if not found then
    return false;
  end if;

  update public.project_briefs
  set stripe_customer_id = coalesce(p_stripe_customer_id, stripe_customer_id),
      stripe_payment_intent_id = p_payment_intent_id,
      stripe_checkout_session_id = p_checkout_session_id,
      stripe_paid_at = now(),
      payment_method = 'stripe',
      amount_paid_cents = p_amount_paid_cents,
      payment_status = 'paid',
      updated_at = now()
  where id = p_project_brief_id;

  return true;
end;
$$;

revoke all on function public.record_stripe_checkout_payment(text, text, text, uuid, integer, text) from public;
grant execute on function public.record_stripe_checkout_payment(text, text, text, uuid, integer, text) to service_role;

-- Atomically reserve one Checkout attempt for a brief. Concurrent clicks receive
-- the same attempt key, which is then used as Stripe's idempotency key.
create or replace function public.prepare_stripe_checkout(
  p_project_brief_id uuid,
  p_force_new boolean default false
)
returns table(checkout_session_id text, checkout_attempt_key uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_brief public.project_briefs%rowtype;
  v_key uuid;
begin
  select * into v_brief
  from public.project_briefs
  where id = p_project_brief_id
  for update;

  if not found then
    raise exception 'Project brief % does not exist', p_project_brief_id;
  end if;

  if v_brief.payment_status in ('paid', 'approved') then
    raise exception 'This project payment has already been completed';
  end if;

  if not p_force_new and v_brief.stripe_checkout_session_id is not null then
    return query select v_brief.stripe_checkout_session_id, v_brief.stripe_checkout_attempt_key;
    return;
  end if;

  if not p_force_new
     and v_brief.stripe_checkout_attempt_key is not null
     and v_brief.stripe_checkout_attempt_created_at > now() - interval '15 minutes' then
    return query select null::text, v_brief.stripe_checkout_attempt_key;
    return;
  end if;

  v_key := gen_random_uuid();
  update public.project_briefs
  set payment_method = 'stripe',
      payment_status = 'checkout_pending',
      stripe_checkout_session_id = null,
      stripe_checkout_attempt_key = v_key,
      stripe_checkout_attempt_created_at = now(),
      updated_at = now()
  where id = p_project_brief_id;

  return query select null::text, v_key;
end;
$$;

revoke all on function public.prepare_stripe_checkout(uuid, boolean) from public;
grant execute on function public.prepare_stripe_checkout(uuid, boolean) to service_role;
