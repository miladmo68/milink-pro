-- MIlink Portal v4: self-contained profile sync + admin CRM access repair.
-- Safe to re-run. Run after schema.sql / portal_v3.sql. It does not delete data.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, created_at)
  values (
    new.id,
    lower(new.email),
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    case
      when lower(new.email) = 'miladmo68@gmail.com' then 'super_admin'::public.app_role
      when lower(new.email) = 'info@milink.ca' then 'admin'::public.app_role
      else 'client'::public.app_role
    end,
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    role = case
      when excluded.email = 'miladmo68@gmail.com' then 'super_admin'::public.app_role
      when excluded.email = 'info@milink.ca' then 'admin'::public.app_role
      else public.profiles.role
    end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Backfill all accounts created before the trigger existed.
insert into public.profiles (id, email, full_name, role, created_at)
select
  u.id,
  lower(u.email),
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), split_part(u.email, '@', 1)),
  case
    when lower(u.email) = 'miladmo68@gmail.com' then 'super_admin'::public.app_role
    when lower(u.email) = 'info@milink.ca' then 'admin'::public.app_role
    else 'client'::public.app_role
  end,
  coalesce(u.created_at, now())
from auth.users u
where u.email is not null
on conflict (id) do update set
  email = excluded.email,
  full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);

-- Replace old/conflicting policies with role-aware policies. is_milink_admin()
-- is SECURITY DEFINER, so these policies do not recurse into profiles RLS.
drop policy if exists "Profiles are private" on public.profiles;
drop policy if exists "Users read their own profile or admins read all profiles" on public.profiles;
drop policy if exists "Users read own profile or admins read all profiles" on public.profiles;
drop policy if exists "Super admin can manage profiles" on public.profiles;
drop policy if exists "Clients update own profile" on public.profiles;
drop policy if exists "Users update own profile or admins manage all profiles" on public.profiles;
drop policy if exists "Profiles visible to owner or MIlink admins" on public.profiles;
drop policy if exists "Profiles editable by owner or MIlink admins" on public.profiles;
create policy "Profiles visible to owner or MIlink admins" on public.profiles
for select using (id = auth.uid() or public.is_milink_admin());
create policy "Profiles editable by owner or MIlink admins" on public.profiles
for update using (id = auth.uid() or public.is_milink_admin())
with check (id = auth.uid() or public.is_milink_admin());

drop policy if exists "Admins manage all briefs" on public.project_briefs;
create policy "Admins manage all briefs" on public.project_briefs
for all using (public.is_milink_admin()) with check (public.is_milink_admin());

drop policy if exists "Admins manage all project files" on public.project_files;
create policy "Admins manage all project files" on public.project_files
for all using (public.is_milink_admin()) with check (public.is_milink_admin());

drop policy if exists "Admins manage all projects v4" on public.projects;
create policy "Admins manage all projects v4" on public.projects
for all using (public.is_milink_admin()) with check (public.is_milink_admin());

-- Realtime publication may already include these tables; ADD is non-destructive.
do $$ begin
  alter publication supabase_realtime add table public.profiles;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.project_briefs;
exception when duplicate_object then null;
end $$;
