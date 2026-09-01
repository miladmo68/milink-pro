-- MIlink Portal v2: client intake, CRM, files, messages and notifications.
-- Run AFTER schema.sql in the Supabase SQL editor.

-- Admins need a read-only CRM view of registrations. Clients still see only themselves.
drop policy if exists "Profiles are private" on public.profiles;
drop policy if exists "Users read their own profile or admins read all profiles" on public.profiles;
create policy "Users read their own profile or admins read all profiles"
on public.profiles for select using (auth.uid() = id or public.is_milink_admin());

-- Backfill accounts created before the profile trigger was installed. This is safe
-- to run repeatedly and is what makes "registered but no project yet" visible.
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  lower(u.email),
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  case
    when lower(u.email) = 'miladmo68@gmail.com' then 'super_admin'::public.app_role
    when lower(u.email) = 'info@milink.ca' then 'admin'::public.app_role
    else 'client'::public.app_role
  end
from auth.users u
where u.email is not null
on conflict (id) do update set
  email = excluded.email,
  full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
  role = case
    when excluded.email = 'miladmo68@gmail.com' then 'super_admin'::public.app_role
    when excluded.email = 'info@milink.ca' then 'admin'::public.app_role
    else public.profiles.role
  end;

-- A client can create and edit only their own brief. Admins retain full access.
drop policy if exists "Clients create their own projects" on public.projects;
create policy "Clients create their own projects"
on public.projects for insert with check (client_id = auth.uid());

drop policy if exists "Clients update their own projects" on public.projects;
create policy "Clients update their own projects"
on public.projects for update using (client_id = auth.uid()) with check (client_id = auth.uid());

alter table public.projects
  add column if not exists brief_status text not null default 'draft'
    check (brief_status in ('draft','submitted','reviewed','needs_information')),
  add column if not exists project_type text,
  add column if not exists target_launch_date date,
  add column if not exists domain_status text
    check (domain_status in ('have_domain','need_domain','not_sure')),
  add column if not exists hosting_status text
    check (hosting_status in ('have_hosting','need_hosting','not_sure')),
  add column if not exists details jsonb not null default '{}'::jsonb;

create index if not exists projects_client_id_idx on public.projects(client_id);
create index if not exists projects_brief_status_idx on public.projects(brief_status, created_at desc);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  storage_path text not null unique,
  file_kind text not null default 'other'
    check (file_kind in ('logo','brand_guide','photo','copy','reference','document','receipt','other')),
  review_status text not null default 'received'
    check (review_status in ('requested','received','approved','needs_revision')),
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 8000),
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.project_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  request_type text not null check (request_type in ('file','answer','approval','payment','access')),
  title text not null,
  instructions text,
  due_at timestamptz,
  status text not null default 'open' check (status in ('open','complete','cancelled')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.project_assets enable row level security;
alter table public.project_messages enable row level security;
alter table public.project_requests enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Admins manage project assets" on public.project_assets;
create policy "Admins manage project assets" on public.project_assets for all using (public.is_milink_admin()) with check (public.is_milink_admin());
drop policy if exists "Clients manage their project assets" on public.project_assets;
create policy "Clients manage their project assets" on public.project_assets for all using (
  exists (select 1 from public.projects where projects.id = project_assets.project_id and projects.client_id = auth.uid())
) with check (
  exists (select 1 from public.projects where projects.id = project_assets.project_id and projects.client_id = auth.uid())
);

drop policy if exists "Admins manage project messages" on public.project_messages;
create policy "Admins manage project messages" on public.project_messages for all using (public.is_milink_admin()) with check (public.is_milink_admin());
drop policy if exists "Clients read visible project messages" on public.project_messages;
create policy "Clients read visible project messages" on public.project_messages for select using (
  client_visible and exists (select 1 from public.projects where projects.id = project_messages.project_id and projects.client_id = auth.uid())
);
drop policy if exists "Clients send visible project messages" on public.project_messages;
create policy "Clients send visible project messages" on public.project_messages for insert with check (
  client_visible and author_id = auth.uid() and exists (select 1 from public.projects where projects.id = project_messages.project_id and projects.client_id = auth.uid())
);

drop policy if exists "Admins manage project requests" on public.project_requests;
create policy "Admins manage project requests" on public.project_requests for all using (public.is_milink_admin()) with check (public.is_milink_admin());
drop policy if exists "Clients read their project requests" on public.project_requests;
create policy "Clients read their project requests" on public.project_requests for select using (
  exists (select 1 from public.projects where projects.id = project_requests.project_id and projects.client_id = auth.uid())
);

drop policy if exists "Users read their notifications" on public.notifications;
create policy "Users read their notifications" on public.notifications for select using (user_id = auth.uid());
drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications" on public.notifications for all using (public.is_milink_admin()) with check (public.is_milink_admin());

-- Storage bucket and policies: create this bucket in Storage UI as private, then run:
-- insert into storage.buckets (id, name, public) values ('project-assets', 'project-assets', false)
-- on conflict (id) do nothing;
-- Storage path convention: {project_id}/{uuid}-{safe_filename}

-- Notifications for the two-way intake workflow.
create or replace function public.notify_milink_admins_about_brief()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT' and new.brief_status = 'submitted')
     or (tg_op = 'UPDATE' and new.brief_status = 'submitted' and old.brief_status is distinct from new.brief_status) then
    insert into public.notifications (user_id, project_id, title, body, href)
    select id, new.id, 'New project brief submitted', coalesce(new.title, new.client_email), '/admin'
    from public.profiles where role in ('admin','super_admin');
  end if;
  return new;
end;
$$;

drop trigger if exists projects_notify_milink_admins on public.projects;
create trigger projects_notify_milink_admins
after insert or update of brief_status on public.projects
for each row execute procedure public.notify_milink_admins_about_brief();

create or replace function public.notify_client_about_request()
returns trigger language plpgsql security definer set search_path = public as $$
declare client_user uuid;
begin
  select client_id into client_user from public.projects where id = new.project_id;
  insert into public.notifications (user_id, project_id, title, body, href)
  values (client_user, new.project_id, new.title, new.instructions, '/portal');
  return new;
end;
$$;

drop trigger if exists project_requests_notify_client on public.project_requests;
create trigger project_requests_notify_client
after insert on public.project_requests
for each row execute procedure public.notify_client_about_request();
