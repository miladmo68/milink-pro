-- MIlink Portal v5: realtime status, messages, attachments and file requests.
-- Run after fix_rls_recursion.sql. Safe to re-run; does not delete customer data.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.project_briefs(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 8000),
  attachments jsonb not null default '[]'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_participants_idx on public.messages(sender_id, recipient_id, created_at desc);
create index if not exists messages_project_idx on public.messages(project_id, created_at desc);

create or replace function public.primary_milink_admin_id()
returns uuid language sql security definer set search_path=public stable as $$
  select id from public.profiles where role in ('super_admin','admin') order by case role when 'super_admin' then 0 else 1 end limit 1;
$$;
grant execute on function public.primary_milink_admin_id() to authenticated;

create table if not exists public.file_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.project_briefs(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(title) between 1 and 180),
  description text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  uploaded_file_url text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists file_requests_client_idx on public.file_requests(client_id, status, created_at desc);

alter table public.messages enable row level security;
alter table public.file_requests enable row level security;

do $$ declare p text; begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='messages' loop
    execute format('drop policy if exists %I on public.messages', p);
  end loop;
  for p in select policyname from pg_policies where schemaname='public' and tablename='file_requests' loop
    execute format('drop policy if exists %I on public.file_requests', p);
  end loop;
end $$;

create policy "Messages: participants or admins can read" on public.messages for select
using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());
create policy "Messages: participants or admins can send" on public.messages for insert to authenticated
with check (sender_id = auth.uid() or public.is_admin());
create policy "Messages: recipients or admins can update" on public.messages for update
using (recipient_id = auth.uid() or public.is_admin()) with check (recipient_id = auth.uid() or public.is_admin());

create policy "File requests: client or admin can read" on public.file_requests for select
using (client_id = auth.uid() or public.is_admin());
create policy "File requests: admins can create" on public.file_requests for insert to authenticated
with check (public.is_admin());
create policy "File requests: client or admin can update" on public.file_requests for update
using (client_id = auth.uid() or public.is_admin()) with check (client_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public) values ('portal-files', 'portal-files', false)
on conflict (id) do nothing;
drop policy if exists "Portal files: participants upload" on storage.objects;
create policy "Portal files: participants upload" on storage.objects for insert to authenticated
with check (bucket_id='portal-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Portal files: participants read" on storage.objects;
create policy "Portal files: participants read" on storage.objects for select to authenticated
using (bucket_id='portal-files' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

create or replace function public.notify_status_change()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op='UPDATE' and new.status is distinct from old.status then
    insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link)
    values (new.client_id, new.client_id, auth.uid(), 'Project Status Updated', 'Your project is now in ' || replace(initcap(replace(new.status,'_',' ')), '_', ' ') || ' stage.', 'Your project is now in ' || replace(initcap(replace(new.status,'_',' ')), '_', ' ') || ' stage.', '/portal', '/portal');
  end if;
  return new;
end; $$;
drop trigger if exists project_briefs_status_notification on public.project_briefs;
create trigger project_briefs_status_notification after update of status on public.project_briefs
for each row execute procedure public.notify_status_change();

create or replace function public.notify_message_recipient()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link)
  values (new.recipient_id, new.recipient_id, new.sender_id, 'New message', left(new.content, 140), left(new.content, 140), '/portal', '/portal');
  return new;
end; $$;
drop trigger if exists messages_notify_recipient on public.messages;
create trigger messages_notify_recipient after insert on public.messages
for each row execute procedure public.notify_message_recipient();

create or replace function public.notify_file_request_client()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op='INSERT' then
    insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link)
    values (new.client_id, new.client_id, new.created_by, 'Action required: ' || new.title, coalesce(new.description, 'Please upload the requested file.'), coalesce(new.description, 'Please upload the requested file.'), '/portal', '/portal');
  elsif tg_op='UPDATE' and new.status='completed' and old.status is distinct from 'completed' then
    insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link)
    select id, id, new.client_id, 'Requested file received', new.title, new.title, '/admin', '/admin' from public.profiles where role in ('admin','super_admin');
  end if;
  return new;
end; $$;
drop trigger if exists file_requests_notify on public.file_requests;
create trigger file_requests_notify after insert or update of status on public.file_requests
for each row execute procedure public.notify_file_request_client();

do $$ begin alter publication supabase_realtime add table public.messages; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.file_requests; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end $$;
