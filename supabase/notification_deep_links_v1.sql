-- MIlink notification deep links v1.
-- Safe to run repeatedly after notifications_v6.sql and portal_v5_features.sql.
-- Keeps account-wide messages unified while making project-specific events open
-- the correct project and dashboard section.

alter table public.notifications
  add column if not exists project_id uuid references public.project_briefs(id) on delete cascade;

create index if not exists notifications_recipient_project_created_idx
  on public.notifications (recipient_id, project_id, created_at desc);

create or replace function public.notify_admins_on_brief_submission()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'submitted' and (tg_op = 'INSERT' or old.status is distinct from 'submitted') then
    insert into public.notifications (user_id, recipient_id, sender_id, project_id, title, body, message, href, link, type)
    select id, id, new.client_id, new.id,
      'New project brief submitted', coalesce(new.business_name, 'A client'), coalesce(new.business_name, 'A client'),
      '/admin?tab=projects&project=' || new.id::text,
      '/admin?tab=projects&project=' || new.id::text,
      'brief'
    from public.profiles where role in ('admin', 'super_admin');
  end if;
  return new;
end;
$$;

create or replace function public.notify_status_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare destination text;
begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    destination := '/portal?tab=overview&project=' || new.id::text;
    insert into public.notifications (user_id, recipient_id, sender_id, project_id, title, body, message, href, link, type)
    values (
      new.client_id, new.client_id, auth.uid(), new.id,
      'Project Status Updated',
      'Your project is now in ' || replace(initcap(replace(new.status, '_', ' ')), '_', ' ') || ' stage.',
      'Your project is now in ' || replace(initcap(replace(new.status, '_', ' ')), '_', ' ') || ' stage.',
      destination, destination, 'status_update'
    );
  end if;
  return new;
end;
$$;

create or replace function public.notify_message_recipient()
returns trigger language plpgsql security definer set search_path = public as $$
declare destination text;
begin
  select case when role in ('admin', 'super_admin') then '/admin?tab=messages' else '/portal?tab=messages' end
  into destination
  from public.profiles where id = new.recipient_id;
  destination := coalesce(destination, '/portal?tab=messages');
  insert into public.notifications (user_id, recipient_id, sender_id, project_id, title, body, message, href, link, type)
  values (
    new.recipient_id, new.recipient_id, new.sender_id, new.project_id,
    'New message', left(new.content, 140), left(new.content, 140),
    destination, destination, 'message'
  );
  return new;
end;
$$;

create or replace function public.notify_file_request_client()
returns trigger language plpgsql security definer set search_path = public as $$
declare client_destination text;
declare admin_destination text;
begin
  client_destination := '/portal?tab=assets' || case when new.project_id is null then '' else '&project=' || new.project_id::text end;
  admin_destination := '/admin?tab=projects' || case when new.project_id is null then '' else '&project=' || new.project_id::text end;
  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, recipient_id, sender_id, project_id, title, body, message, href, link, type)
    values (
      new.client_id, new.client_id, new.created_by, new.project_id,
      'Action required: ' || new.title,
      coalesce(new.description, 'Please upload the requested file.'),
      coalesce(new.description, 'Please upload the requested file.'),
      client_destination, client_destination, 'file_request'
    );
  elsif tg_op = 'UPDATE' and new.status = 'completed' and old.status is distinct from 'completed' then
    insert into public.notifications (user_id, recipient_id, sender_id, project_id, title, body, message, href, link, type)
    select id, id, new.client_id, new.project_id,
      'Requested file received', new.title, new.title,
      admin_destination, admin_destination, 'file_request'
    from public.profiles where role in ('admin', 'super_admin');
  end if;
  return new;
end;
$$;

-- Recreate the existing triggers so each active environment uses the updated
-- function definitions immediately.
drop trigger if exists project_briefs_notify_admins on public.project_briefs;
create trigger project_briefs_notify_admins after insert or update of status on public.project_briefs
for each row execute procedure public.notify_admins_on_brief_submission();

drop trigger if exists project_briefs_status_notification on public.project_briefs;
create trigger project_briefs_status_notification after update of status on public.project_briefs
for each row execute procedure public.notify_status_change();

drop trigger if exists messages_notify_recipient on public.messages;
create trigger messages_notify_recipient after insert on public.messages
for each row execute procedure public.notify_message_recipient();

drop trigger if exists file_requests_notify on public.file_requests;
create trigger file_requests_notify after insert or update of status on public.file_requests
for each row execute procedure public.notify_file_request_client();

-- Deliverable reviews are project-scoped. Clients receive a direct link to
-- decide; the team receives a direct link when the client submits a decision.
create or replace function public.notify_approval_activity()
returns trigger language plpgsql security definer set search_path = public as $$
declare client_destination text;
declare admin_destination text;
begin
  client_destination := '/portal?tab=approvals&project=' || new.project_id::text;
  admin_destination := '/admin?tab=projects&project=' || new.project_id::text;
  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, recipient_id, sender_id, project_id, title, body, message, href, link, type)
    values (
      new.client_id, new.client_id, auth.uid(), new.project_id,
      'Deliverable ready for review', coalesce(new.title, 'A new deliverable is ready for your feedback.'),
      coalesce(new.title, 'A new deliverable is ready for your feedback.'),
      client_destination, client_destination, 'approval'
    );
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status and new.status in ('approved', 'changes_requested') then
    insert into public.notifications (user_id, recipient_id, sender_id, project_id, title, body, message, href, link, type)
    select id, id, new.client_id, new.project_id,
      case when new.status = 'approved' then 'Deliverable approved' else 'Changes requested on deliverable' end,
      coalesce(new.title, 'Deliverable review updated.'), coalesce(new.title, 'Deliverable review updated.'),
      admin_destination, admin_destination, 'approval'
    from public.profiles where role in ('admin', 'super_admin');
  end if;
  return new;
end;
$$;

drop trigger if exists approvals_notify_activity on public.approvals;
create trigger approvals_notify_activity after insert or update of status on public.approvals
for each row execute procedure public.notify_approval_activity();
