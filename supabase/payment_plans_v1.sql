-- MiLink payment plans (safe to re-run). Run once in the Supabase SQL editor of project atsgrlvpulkaacezcnos.
-- Adds an optional plan per project: full up front (default, same as before), a deposit and a balance,
-- or everything at launch. Payments now add up in amount_paid_cents, and a project with part of the
-- amount paid has payment_status 'partially_paid'. Existing projects keep working unchanged (plan 'full').

alter table public.project_briefs
  add column if not exists payment_plan text not null default 'full',
  add column if not exists deposit_percent integer not null default 50;

alter table public.project_briefs drop constraint if exists project_briefs_payment_plan_check;
alter table public.project_briefs add constraint project_briefs_payment_plan_check
  check (payment_plan in ('full', 'split', 'on_launch'));

alter table public.project_briefs drop constraint if exists project_briefs_deposit_percent_check;
alter table public.project_briefs add constraint project_briefs_deposit_percent_check
  check (deposit_percent between 10 and 90);

alter table public.project_briefs drop constraint if exists project_briefs_payment_status_check;
alter table public.project_briefs add constraint project_briefs_payment_status_check
  check (payment_status in (
    'not_requested', 'pending_review', 'e_transfer_submitted', 'approved', 'rejected',
    'checkout_pending', 'partially_paid', 'paid'
  ));

-- Clients still cannot touch payment fields, and now also not the plan; they may only declare an e-Transfer sent.
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
    if new.payment_plan is distinct from old.payment_plan
       or new.deposit_percent is distinct from old.deposit_percent then
      raise exception 'Only MiLink can change how a project is paid';
    end if;
    if new.stripe_customer_id is distinct from old.stripe_customer_id
       or new.stripe_payment_intent_id is distinct from old.stripe_payment_intent_id
       or new.stripe_checkout_session_id is distinct from old.stripe_checkout_session_id
       or new.stripe_checkout_attempt_key is distinct from old.stripe_checkout_attempt_key
       or new.stripe_checkout_attempt_created_at is distinct from old.stripe_checkout_attempt_created_at
       or new.stripe_paid_at is distinct from old.stripe_paid_at
       or new.amount_paid_cents is distinct from old.amount_paid_cents
       or new.e_transfer_confirmed_at is distinct from old.e_transfer_confirmed_at
       or new.payment_method is distinct from old.payment_method
       or new.payment_status is distinct from old.payment_status
       or new.e_transfer_submitted_at is distinct from old.e_transfer_submitted_at then
      if old.payment_status in ('not_requested', 'pending_review', 'rejected', 'checkout_pending', 'partially_paid')
         and new.payment_status = 'e_transfer_submitted'
         and new.payment_method = 'e_transfer'
         and new.amount_paid_cents is not distinct from old.amount_paid_cents
         and new.e_transfer_confirmed_at is not distinct from old.e_transfer_confirmed_at then
        new.e_transfer_submitted_at := now();
      else
        raise exception 'Clients can only mark their own e-Transfer as sent; MiLink must confirm payment receipt';
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_project_brief_payment_fields on public.project_briefs;
create trigger guard_project_brief_payment_fields
  before update on public.project_briefs
  for each row execute function public.guard_project_brief_payment_fields();

-- Stripe payments now add to what was already paid (a deposit, then the balance).
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
  v_brief public.project_briefs%rowtype;
  v_total integer;
begin
  select * into v_brief from public.project_briefs where id = p_project_brief_id for update;
  if not found then
    raise exception 'Project brief % does not exist', p_project_brief_id;
  end if;
  if v_brief.payment_status = 'paid' then
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

  v_total := coalesce(v_brief.amount_paid_cents, 0) + p_amount_paid_cents;
  update public.project_briefs
  set stripe_customer_id = coalesce(p_stripe_customer_id, stripe_customer_id),
      stripe_payment_intent_id = p_payment_intent_id,
      stripe_checkout_session_id = p_checkout_session_id,
      stripe_paid_at = now(),
      payment_method = 'stripe',
      amount_paid_cents = v_total,
      payment_status = case when v_total >= coalesce(v_brief.proposal_amount_cents, 0) then 'paid' else 'partially_paid' end,
      updated_at = now()
  where id = p_project_brief_id;
  return true;
end;
$$;

revoke all on function public.record_stripe_checkout_payment(text, text, text, uuid, integer, text) from public;
grant execute on function public.record_stripe_checkout_payment(text, text, text, uuid, integer, text) to service_role;
