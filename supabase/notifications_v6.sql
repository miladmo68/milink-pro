-- MIlink notification centre v6.
-- Safe to re-run. Run after supabase/fix_rls_recursion.sql.
-- This changes policies only; it never deletes notification records.

alter table public.notifications add column if not exists type text not null default 'general';
alter table public.notifications add column if not exists recipient_id uuid references public.profiles(id) on delete cascade;
alter table public.notifications add column if not exists message text;
alter table public.notifications add column if not exists link text;
alter table public.notifications add column if not exists is_read boolean not null default false;

update public.notifications
set recipient_id = coalesce(recipient_id, user_id),
    message = coalesce(message, body),
    link = coalesce(link, href),
    is_read = coalesce(is_read, read_at is not null),
    type = case
      when lower(coalesce(title, '') || ' ' || coalesce(message, body, '')) like '%message%' then 'message'
      when lower(coalesce(title, '') || ' ' || coalesce(message, body, '')) like '%file%' then 'file_request'
      when lower(coalesce(title, '') || ' ' || coalesce(message, body, '')) like '%payment%' then 'payment'
      when lower(coalesce(title, '') || ' ' || coalesce(message, body, '')) like '%brief%' then 'brief'
      when type = 'general' then 'status_update'
      else type
    end
where recipient_id is null or message is null or link is null or type = 'general';

create index if not exists notifications_recipient_created_idx
on public.notifications (recipient_id, created_at desc);
create index if not exists notifications_recipient_read_idx
on public.notifications (recipient_id, is_read, created_at desc);

alter table public.notifications enable row level security;

do $$
declare policy_name text;
begin
  for policy_name in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'notifications'
  loop
    execute format('drop policy if exists %I on public.notifications', policy_name);
  end loop;
end $$;

create policy "Notifications: recipients and admins can read"
on public.notifications for select to authenticated
using (recipient_id = auth.uid() or public.is_admin());

create policy "Notifications: recipients and admins can update"
on public.notifications for update to authenticated
using (recipient_id = auth.uid() or public.is_admin())
with check (recipient_id = auth.uid() or public.is_admin());

create policy "Notifications: recipients and admins can delete"
on public.notifications for delete to authenticated
using (recipient_id = auth.uid() or public.is_admin());

create policy "Notifications: admins can create"
on public.notifications for insert to authenticated
with check (public.is_admin());

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;
