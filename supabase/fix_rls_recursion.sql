-- MIlink: repair recursive RLS policies safely.
-- Run this once in Supabase SQL Editor. It removes policies only, never rows.
-- This project uses project_briefs.client_id (not user_id).

-- SECURITY DEFINER executes as the database-function owner, so this role lookup
-- bypasses profiles RLS and cannot recurse into a profiles policy.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin'::public.app_role, 'super_admin'::public.app_role)
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Remove every legacy policy on profiles. This avoids hidden policy names from
-- previous partial migrations continuing to cause recursion.
do $$
declare policy_name text;
begin
  for policy_name in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', policy_name);
  end loop;
end $$;

alter table public.profiles enable row level security;

create policy "Profiles: owner or MIlink admin can read"
on public.profiles for select
using (
  auth.uid() = id
  or public.is_admin()
  or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca')
);

create policy "Profiles: owner or MIlink admin can update"
on public.profiles for update
using (
  auth.uid() = id
  or public.is_admin()
  or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca')
)
with check (
  auth.uid() = id
  or public.is_admin()
  or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca')
);

create policy "Profiles: authenticated users can create own row"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

-- Do the same policy reset for project briefs, using the actual client_id FK.
do $$
declare policy_name text;
begin
  for policy_name in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'project_briefs'
  loop
    execute format('drop policy if exists %I on public.project_briefs', policy_name);
  end loop;
end $$;

alter table public.project_briefs enable row level security;

create policy "Briefs: owner or MIlink admin can read"
on public.project_briefs for select
using (client_id = auth.uid() or public.is_admin() or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca'));

create policy "Briefs: owner or MIlink admin can create"
on public.project_briefs for insert to authenticated
with check (client_id = auth.uid() or public.is_admin() or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca'));

create policy "Briefs: owner or MIlink admin can update"
on public.project_briefs for update
using (client_id = auth.uid() or public.is_admin() or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca'))
with check (client_id = auth.uid() or public.is_admin() or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca'));

create policy "Briefs: owner or MIlink admin can delete"
on public.project_briefs for delete
using (client_id = auth.uid() or public.is_admin() or lower(coalesce(auth.jwt() ->> 'email', '')) in ('miladmo68@gmail.com', 'info@milink.ca'));

-- Keep older helper calls safe too; they now share the non-recursive check.
create or replace function public.is_milink_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$ select public.is_admin(); $$;

grant execute on function public.is_milink_admin() to authenticated;
