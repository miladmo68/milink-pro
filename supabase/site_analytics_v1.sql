-- MiLink site analytics and push notifications (safe to re-run). Run once in the Supabase SQL editor.
--
-- 1) site_events: anonymous, cookieless visit counting for the public site. No names, emails or IP
--    addresses are stored; a visit is a random id kept in the visitor's sessionStorage for one tab session.
--    Rows are written only by the server (/api/track, service role) and read only by admins.
create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('pageview', 'contact_submit', 'whatsapp_click', 'portal_signup')),
  path text not null default '/',
  referrer_host text,
  visit_id text,
  device text check (device in ('mobile', 'tablet', 'desktop')),
  country text
);
create index if not exists site_events_created_at_idx on public.site_events (created_at desc);
alter table public.site_events enable row level security;
drop policy if exists "Admins read site events" on public.site_events;
create policy "Admins read site events" on public.site_events for select to authenticated using (public.is_admin());

-- 2) push_subscriptions: one row per browser or phone that turned on notifications.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);
alter table public.push_subscriptions enable row level security;
drop policy if exists "Users manage own push subscriptions" on public.push_subscriptions;
create policy "Users manage own push subscriptions" on public.push_subscriptions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
