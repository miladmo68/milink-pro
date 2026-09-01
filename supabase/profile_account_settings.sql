-- MIlink Client Portal: Profile & Account Settings
-- Safe to run repeatedly in the Supabase SQL Editor. This only extends
-- public.profiles and preserves all existing client/admin records.

alter table public.profiles
  add column if not exists company_name text,
  add column if not exists job_title text,
  add column if not exists phone text,
  add column if not exists company_website text,
  add column if not exists timezone text not null default 'America/Toronto',
  add column if not exists preferred_contact text not null default 'email';

update public.profiles
set timezone = 'America/Toronto'
where timezone is null or btrim(timezone) = '';

update public.profiles
set preferred_contact = 'email'
where preferred_contact is null
   or preferred_contact not in ('email', 'portal', 'whatsapp');

alter table public.profiles
  drop constraint if exists profiles_preferred_contact_check;

alter table public.profiles
  add constraint profiles_preferred_contact_check
  check (preferred_contact in ('email', 'portal', 'whatsapp'));

-- The portal only needs the authenticated owner's own row. These policies are
-- additive and work safely with the existing admin policies from
-- fix_rls_recursion.sql; they do not query profiles recursively.
alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Profiles: client reads own account settings'
  ) then
    create policy "Profiles: client reads own account settings"
      on public.profiles for select to authenticated
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Profiles: client updates own account settings'
  ) then
    create policy "Profiles: client updates own account settings"
      on public.profiles for update to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end
$$;

-- A client may edit their own settings, but never elevate their account role
-- or alter the email identity maintained by Supabase Auth.
create or replace function public.guard_profile_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'Profile role cannot be changed by the account owner';
    end if;
    if new.email is distinct from old.email then
      raise exception 'Profile email is managed by your sign-in account';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_identity on public.profiles;
create trigger profiles_guard_identity
before update on public.profiles
for each row execute procedure public.guard_profile_identity();
