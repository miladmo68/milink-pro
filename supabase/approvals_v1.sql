-- MIlink Project Approvals v1
-- Non-destructive and safe to re-run. Run after schema.sql, portal_v3.sql,
-- and fix_rls_recursion.sql in the Supabase SQL Editor.

-- Approval state for client-facing design, staging, Figma, or document reviews.
do $$
begin
  create type public.approval_status as enum ('pending', 'approved', 'changes_requested');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_briefs(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  deliverable_type text not null default 'link'
    check (deliverable_type in ('link', 'figma', 'staging', 'document')),
  deliverable_url text,
  status public.approval_status not null default 'pending',
  client_feedback text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index if not exists approvals_client_status_created_idx
  on public.approvals (client_id, status, created_at desc);

create index if not exists approvals_project_created_idx
  on public.approvals (project_id, created_at desc);

alter table public.approvals enable row level security;

-- Remove only policies owned by this migration so the patch remains rerunnable.
drop policy if exists "Clients can view own approvals" on public.approvals;
drop policy if exists "Clients can update feedback and status of own approvals" on public.approvals;
drop policy if exists "Admins have full access on approvals" on public.approvals;

create policy "Clients can view own approvals"
  on public.approvals
  for select
  to authenticated
  using (auth.uid() = client_id);

create policy "Clients can update feedback and status of own approvals"
  on public.approvals
  for update
  to authenticated
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

create policy "Admins have full access on approvals"
  on public.approvals
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS restricts rows, not columns. This trigger keeps client updates limited
-- to approval decision/feedback and protects agency-owned deliverable metadata.
create or replace function public.guard_client_approval_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.client_id and not public.is_admin() then
    if new.id is distinct from old.id
      or new.project_id is distinct from old.project_id
      or new.client_id is distinct from old.client_id
      or new.title is distinct from old.title
      or new.description is distinct from old.description
      or new.deliverable_type is distinct from old.deliverable_type
      or new.deliverable_url is distinct from old.deliverable_url
      or new.created_at is distinct from old.created_at then
      raise exception 'Clients may only submit approval feedback and a decision';
    end if;

    if new.status = 'pending'::public.approval_status and new.status is distinct from old.status then
      raise exception 'Clients cannot reset an approval to pending';
    end if;

    if new.status is distinct from old.status and new.status in ('approved'::public.approval_status, 'changes_requested'::public.approval_status) then
      new.decided_at = now();
    elsif new.decided_at is distinct from old.decided_at then
      raise exception 'Clients cannot set the approval decision timestamp';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists approvals_guard_client_update on public.approvals;
create trigger approvals_guard_client_update
before update on public.approvals
for each row execute procedure public.guard_client_approval_update();

-- Realtime publication setup is safe on repeat runs and does not alter rows.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'approvals'
  ) then
    alter publication supabase_realtime add table public.approvals;
  end if;
end $$;
