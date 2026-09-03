-- MiLink notification email preferences
-- Safe to re-run. In-app notification delivery remains unchanged; these fields
-- only control when outbound email is sent by trusted server routes.

alter table public.profiles
  add column if not exists notification_email_mode text not null default 'instant',
  add column if not exists last_digest_sent_at timestamptz;

-- Normalize any legacy/null value before adding the guard constraint.
update public.profiles
set notification_email_mode = 'instant'
where notification_email_mode is null
   or notification_email_mode not in ('instant', 'daily_digest', 'weekly_digest', 'off');

alter table public.profiles
  drop constraint if exists profiles_notification_email_mode_check;

alter table public.profiles
  add constraint profiles_notification_email_mode_check
  check (notification_email_mode in ('instant', 'daily_digest', 'weekly_digest', 'off'));

-- Existing owner/admin profile UPDATE policies already cover these preference
-- fields and use public.is_admin(); no new profile policy is required here.
create index if not exists profiles_notification_digest_due_idx
  on public.profiles (notification_email_mode, last_digest_sent_at);

notify pgrst, 'reload schema';
