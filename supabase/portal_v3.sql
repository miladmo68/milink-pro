-- MIlink Portal v3 — production-safe client brief, CRM, assets and notifications.
-- Run this AFTER schema.sql and portal_v2.sql. It is safe to re-run and does not delete data.

-- Keep roles and every existing Auth user synchronized with the CRM profile table.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when lower(new.email) = 'miladmo68@gmail.com' then 'super_admin'::public.app_role
      when lower(new.email) = 'info@milink.ca' then 'admin'::public.app_role
      else 'client'::public.app_role
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
    role = case
      when excluded.email = 'miladmo68@gmail.com' then 'super_admin'::public.app_role
      when excluded.email = 'info@milink.ca' then 'admin'::public.app_role
      else public.profiles.role
    end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email, full_name, role)
select u.id, lower(u.email), coalesce(u.raw_user_meta_data ->> 'full_name', ''),
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

-- Replace every earlier profile policy with a non-recursive role-aware policy set.
drop policy if exists "Profiles are private" on public.profiles;
drop policy if exists "Users read their own profile or admins read all profiles" on public.profiles;
drop policy if exists "Super admin can manage profiles" on public.profiles;
drop policy if exists "Clients update own profile" on public.profiles;
create policy "Users read own profile or admins read all profiles" on public.profiles
for select using (id = auth.uid() or public.is_milink_admin());
create policy "Users update own profile or admins manage all profiles" on public.profiles
for update using (id = auth.uid() or public.is_milink_admin())
with check (id = auth.uid() or public.is_milink_admin());

drop policy if exists "Clients update own profile" on public.profiles;
create policy "Clients update own profile" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

-- Rich intake data is separated from the legacy projects table, which remains untouched.
create table if not exists public.project_briefs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  business_name text,
  industry text,
  current_website text,
  business_description text,
  main_goals jsonb not null default '[]'::jsonb,
  site_type text not null default 'multi_page' check (site_type in ('single_page', 'multi_page')),
  page_structure jsonb not null default '[]'::jsonb,
  custom_pages jsonb not null default '[]'::jsonb,
  required_features jsonb not null default '[]'::jsonb,
  design_style text,
  brand_colors jsonb not null default '[]'::jsonb,
  reference_sites jsonb not null default '[]'::jsonb,
  domain_status text not null default 'not_sure' check (domain_status in ('have_domain', 'need_domain', 'not_sure')),
  hosting_status text not null default 'not_sure' check (hosting_status in ('have_hosting', 'need_hosting', 'not_sure')),
  budget_range text,
  target_launch_date date,
  additional_notes text,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'reviewing', 'proposal_sent', 'in_progress', 'client_review', 'completed')),
  proposal_amount_cents integer check (proposal_amount_cents is null or proposal_amount_cents >= 0),
  proposal_summary text,
  proposal_delivery_days integer check (proposal_delivery_days is null or proposal_delivery_days > 0),
  payment_status text not null default 'not_requested' check (payment_status in ('not_requested', 'pending_review', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_briefs_client_idx on public.project_briefs(client_id, updated_at desc);
create index if not exists project_briefs_status_idx on public.project_briefs(status, updated_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists project_briefs_set_updated_at on public.project_briefs;
create trigger project_briefs_set_updated_at before update on public.project_briefs
for each row execute procedure public.set_updated_at();

alter table public.project_briefs enable row level security;
drop policy if exists "Clients manage own briefs" on public.project_briefs;
create policy "Clients manage own briefs" on public.project_briefs
for all using (client_id = auth.uid()) with check (client_id = auth.uid());
drop policy if exists "Admins manage all briefs" on public.project_briefs;
create policy "Admins manage all briefs" on public.project_briefs
for all using (public.is_milink_admin()) with check (public.is_milink_admin());

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.project_briefs(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint,
  file_kind text not null default 'asset' check (file_kind in ('logo', 'brand_asset', 'photo', 'document', 'mockup', 'receipt', 'asset')),
  status text not null default 'uploaded' check (status in ('requested', 'uploaded', 'approved', 'needs_revision')),
  created_at timestamptz not null default now()
);
create index if not exists project_files_brief_idx on public.project_files(brief_id, created_at desc);
alter table public.project_files enable row level security;
drop policy if exists "Clients manage own project files" on public.project_files;
create policy "Clients manage own project files" on public.project_files
for all using (client_id = auth.uid()) with check (client_id = auth.uid());
drop policy if exists "Admins manage all project files" on public.project_files;
create policy "Admins manage all project files" on public.project_files
for all using (public.is_milink_admin()) with check (public.is_milink_admin());

insert into storage.buckets (id, name, public) values ('project-assets', 'project-assets', false)
on conflict (id) do nothing;
drop policy if exists "Clients upload own project assets" on storage.objects;
create policy "Clients upload own project assets" on storage.objects for insert to authenticated
with check (bucket_id = 'project-assets' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Clients read own project assets" on storage.objects;
create policy "Clients read own project assets" on storage.objects for select to authenticated
using (bucket_id = 'project-assets' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_milink_admin()));
drop policy if exists "Admins manage project assets storage" on storage.objects;
create policy "Admins manage project assets storage" on storage.objects for all to authenticated
using (bucket_id = 'project-assets' and public.is_milink_admin())
with check (bucket_id = 'project-assets' and public.is_milink_admin());

-- Extend the original notifications table without losing v2 records.
alter table public.notifications add column if not exists sender_id uuid references public.profiles(id) on delete set null;
alter table public.notifications add column if not exists recipient_id uuid references public.profiles(id) on delete cascade;
alter table public.notifications add column if not exists message text;
alter table public.notifications add column if not exists link text;
alter table public.notifications add column if not exists is_read boolean not null default false;
update public.notifications set recipient_id = coalesce(recipient_id, user_id), message = coalesce(message, body), link = coalesce(link, href), is_read = coalesce(is_read, read_at is not null);
create index if not exists notifications_recipient_idx on public.notifications(recipient_id, is_read, created_at desc);
drop policy if exists "Clients manage own notifications" on public.notifications;
create policy "Clients manage own notifications" on public.notifications
for all using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
drop policy if exists "Admins manage all rich notifications" on public.notifications;
create policy "Admins manage all rich notifications" on public.notifications
for all using (public.is_milink_admin()) with check (public.is_milink_admin());

create or replace function public.notify_admins_on_brief_submission()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'submitted' and (tg_op = 'INSERT' or old.status is distinct from 'submitted') then
    insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link)
    select id, id, new.client_id, 'New project brief submitted', coalesce(new.business_name, 'A client'), coalesce(new.business_name, 'A client'), '/admin', '/admin'
    from public.profiles where role in ('admin', 'super_admin');
  end if;
  return new;
end;
$$;
drop trigger if exists project_briefs_notify_admins on public.project_briefs;
create trigger project_briefs_notify_admins after insert or update of status on public.project_briefs
for each row execute procedure public.notify_admins_on_brief_submission();

-- Email foundation: invoke an Edge Function / Resend worker from this outbox later.
create table if not exists public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete set null,
  template text not null check (template in ('welcome', 'brief_submitted', 'action_required')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
alter table public.email_outbox enable row level security;
drop policy if exists "Admins manage email outbox" on public.email_outbox;
create policy "Admins manage email outbox" on public.email_outbox for all using (public.is_milink_admin()) with check (public.is_milink_admin());
