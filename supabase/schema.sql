-- Run once in Supabase SQL editor. This is the security boundary for MIlink.
create type public.app_role as enum ('client', 'admin', 'super_admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'client',
  created_at timestamptz not null default now()
);

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
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
create policy "Profiles are private" on public.profiles for select using (auth.uid() = id);
create policy "Super admin can manage profiles" on public.profiles for all using (
  (select role from public.profiles where id = auth.uid()) = 'super_admin'
);

create or replace function public.is_milink_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  client_email text not null,
  status text not null default 'new',
  stage text not null default 'Discovery',
  progress smallint not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  reference text not null unique,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'CAD',
  status text not null default 'draft',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.invoices enable row level security;
create policy "Clients read their own projects" on public.projects for select using (client_id = auth.uid());
create policy "Admins manage all projects" on public.projects for all using (public.is_milink_admin()) with check (public.is_milink_admin());
create policy "Clients read their own invoices" on public.invoices for select using (
  exists (select 1 from public.projects where projects.id = invoices.project_id and projects.client_id = auth.uid())
);
create policy "Admins manage all invoices" on public.invoices for all using (public.is_milink_admin()) with check (public.is_milink_admin());
