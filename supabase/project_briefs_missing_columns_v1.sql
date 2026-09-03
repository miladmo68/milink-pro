-- MiLink project brief timeline and handoff contracts (safe to re-run).
--
-- timeline_updates is a JSONB array of:
-- { id, message, category: 'Development' | 'Design' | 'Milestone' | 'Note', created_at }
--
-- handoff_specs is a JSONB object of:
-- { admin_login_url, dns_provider, training_video_url, documentation_notes }

alter table public.project_briefs
  add column if not exists timeline_updates jsonb not null default '[]'::jsonb,
  add column if not exists handoff_specs jsonb not null default '{}'::jsonb;

-- Make the new columns available to the PostgREST API without waiting for
-- its normal schema-cache refresh interval.
notify pgrst, 'reload schema';
