-- MIlink: optional client response notes for requested files.
-- Safe to run repeatedly. Run after portal_v5_features.sql.

alter table public.file_requests
  add column if not exists client_note text;

comment on column public.file_requests.client_note is
  'Optional client explanation submitted with or instead of an uploaded requested file.';

-- Existing client/admin UPDATE policy from portal_v5_features.sql already covers this column.
-- Realtime is already enabled for public.file_requests there as well.
