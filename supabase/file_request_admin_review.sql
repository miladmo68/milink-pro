-- MIlink: admin review fields for client file-request responses.
-- Safe to re-run. Run after portal_v5_features.sql and file_request_client_responses.sql.

alter table public.file_requests
  add column if not exists client_note text,
  add column if not exists file_url text,
  add column if not exists file_name text,
  add column if not exists file_size bigint,
  add column if not exists admin_decision text not null default 'pending';

-- Keep the workflow predictable even when older partial migrations already exist.
alter table public.file_requests
  drop constraint if exists file_requests_admin_decision_check;
alter table public.file_requests
  add constraint file_requests_admin_decision_check
  check (admin_decision in ('pending', 'accepted', 'dismissed'));

update public.file_requests
set file_url = coalesce(file_url, uploaded_file_url),
    admin_decision = coalesce(admin_decision, 'pending')
where file_url is null or admin_decision is null;

create index if not exists file_requests_review_queue_idx
on public.file_requests (client_id, admin_decision, status, completed_at desc);

alter table public.file_requests enable row level security;
alter table public.project_files enable row level security;

drop policy if exists "Admins can review all file requests v6" on public.file_requests;
create policy "Admins can review all file requests v6"
on public.file_requests for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can save accepted project files v6" on public.project_files;
create policy "Admins can save accepted project files v6"
on public.project_files for all to authenticated
using (public.is_admin()) with check (public.is_admin());
