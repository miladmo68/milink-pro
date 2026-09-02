-- MiLink manual e-Transfer lifecycle (safe to re-run).
-- This extends the existing payment flow without changing the Stripe workflow.

alter table public.project_briefs
  add column if not exists e_transfer_submitted_at timestamptz,
  add column if not exists e_transfer_confirmed_at timestamptz;

-- Keep legacy manual-review values and add a distinct client-declared state.
alter table public.project_briefs
  drop constraint if exists project_briefs_payment_status_check;

alter table public.project_briefs
  add constraint project_briefs_payment_status_check
  check (payment_status in (
    'not_requested', 'pending_review', 'e_transfer_submitted', 'approved', 'rejected',
    'checkout_pending', 'paid'
  ));

create index if not exists project_briefs_e_transfer_review_idx
  on public.project_briefs (payment_status, e_transfer_submitted_at desc)
  where payment_status = 'e_transfer_submitted';

-- The existing owner/admin update policy continues to authorize a client to update
-- only their own brief and public.is_admin() to manage every brief. This explicit
-- policy documents the manual-payment ownership boundary without querying profiles.
drop policy if exists "Clients may submit own e-Transfer payment notice" on public.project_briefs;
create policy "Clients may submit own e-Transfer payment notice"
  on public.project_briefs
  for update
  to authenticated
  using (client_id = auth.uid() or public.is_admin())
  with check (client_id = auth.uid() or public.is_admin());

-- RLS cannot safely enforce a column-level transition while preserving the normal
-- client brief editor. This SECURITY DEFINER trigger is the final state gate:
-- a client may only declare an e-Transfer sent; paid/approved remains admin-only.
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
       or new.amount_paid_cents is distinct from old.amount_paid_cents
       or new.e_transfer_confirmed_at is distinct from old.e_transfer_confirmed_at
       or new.payment_method is distinct from old.payment_method
       or new.payment_status is distinct from old.payment_status
       or new.e_transfer_submitted_at is distinct from old.e_transfer_submitted_at then
      if old.payment_status in ('not_requested', 'pending_review', 'rejected', 'checkout_pending')
         and new.payment_status = 'e_transfer_submitted'
         and new.payment_method = 'e_transfer'
         and new.amount_paid_cents is not distinct from old.amount_paid_cents
         and new.e_transfer_confirmed_at is not distinct from old.e_transfer_confirmed_at then
        -- Use database time rather than a client-provided timestamp.
        new.e_transfer_submitted_at := now();
      else
        raise exception 'Clients can only mark their own e-Transfer as sent; MiLink must confirm payment receipt';
      end if;
    end if;
  end if;
  return new;
end;
$$;

