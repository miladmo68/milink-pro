-- MIlink Project Asset Hub — safe, re-runnable extension for portal-files.
-- Run after portal_v3.sql, portal_v5_features.sql, and fix_rls_recursion.sql.

alter table public.project_files add column if not exists file_name text;
alter table public.project_files add column if not exists file_url text;
alter table public.project_files add column if not exists file_type text;
alter table public.project_files add column if not exists file_size bigint;
alter table public.project_files add column if not exists category text not null default 'other';
alter table public.project_files add column if not exists description text;
alter table public.project_files add column if not exists uploaded_by uuid references public.profiles(id) on delete set null;
alter table public.project_files add column if not exists storage_bucket text not null default 'project-assets';

update public.project_files
set file_name = coalesce(file_name, name),
    file_url = coalesce(file_url, storage_path),
    file_type = coalesce(file_type, mime_type),
    file_size = coalesce(file_size, size_bytes),
    uploaded_by = coalesce(uploaded_by, client_id)
where file_name is null or file_url is null or file_type is null or file_size is null or uploaded_by is null;

create index if not exists project_files_client_category_idx
  on public.project_files (client_id, category, created_at desc);

alter table public.project_files enable row level security;
drop policy if exists "Asset hub clients manage their files" on public.project_files;
create policy "Asset hub clients manage their files" on public.project_files
  for all to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
drop policy if exists "Asset hub admins manage all files" on public.project_files;
create policy "Asset hub admins manage all files" on public.project_files
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('portal-files', 'portal-files', false)
on conflict (id) do nothing;

drop policy if exists "Asset hub clients upload portal files" on storage.objects;
create policy "Asset hub clients upload portal files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portal-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Asset hub clients read portal files" on storage.objects;
create policy "Asset hub clients read portal files" on storage.objects
  for select to authenticated
  using (bucket_id = 'portal-files' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
drop policy if exists "Asset hub clients delete portal files" on storage.objects;
create policy "Asset hub clients delete portal files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portal-files' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
drop policy if exists "Asset hub admins manage portal files" on storage.objects;
create policy "Asset hub admins manage portal files" on storage.objects
  for all to authenticated
  using (bucket_id = 'portal-files' and public.is_admin())
  with check (bucket_id = 'portal-files' and public.is_admin());

do $$ begin
  alter publication supabase_realtime add table public.project_files;
exception when duplicate_object then null;
end $$;
