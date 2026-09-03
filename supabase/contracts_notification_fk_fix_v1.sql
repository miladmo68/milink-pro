-- MIlink Contracts notification foreign-key repair v1
--
-- Safe to run after contracts_v1.sql. The active project model uses
-- project_briefs, while this database's legacy notifications.project_id FK
-- still references public.projects. Contract notifications keep the exact
-- project context in their href/link query string instead of writing an
-- incompatible project_briefs UUID into that legacy FK.

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
    insert into public.notifications (
      user_id, recipient_id, sender_id, title, body, message, href, link, type
    ) values (
      contract_client_id,
      contract_client_id,
      new.created_by,
      'Contract ready to sign',
      coalesce(new.title, 'A project agreement is ready for your review.'),
      coalesce(new.title, 'A project agreement is ready for your review.'),
      client_destination,
      client_destination,
      'contract'
    );
  elsif tg_op = 'UPDATE'
    and new.status is distinct from old.status
    and new.status in ('signed'::public.contract_status, 'declined'::public.contract_status) then
    insert into public.notifications (
      user_id, recipient_id, sender_id, title, body, message, href, link, type
    )
    select
      id,
      id,
      contract_client_id,
      case when new.status = 'signed'::public.contract_status then 'Contract signed' else 'Contract declined' end,
      case when new.status = 'signed'::public.contract_status
        then coalesce(new.signer_name, 'The client') || ' signed ' || new.title
        else coalesce(new.decline_reason, 'The client declined ' || new.title)
      end,
      case when new.status = 'signed'::public.contract_status
        then coalesce(new.signer_name, 'The client') || ' signed ' || new.title
        else coalesce(new.decline_reason, 'The client declined ' || new.title)
      end,
      admin_destination,
      admin_destination,
      'contract'
    from public.profiles
    where role in ('admin', 'super_admin');
  end if;

  return new;
end;
$$;

-- The trigger stays intact; replacing its function body is immediate and
-- rerunnable. Refresh PostgREST after the function is updated.
notify pgrst, 'reload schema';
