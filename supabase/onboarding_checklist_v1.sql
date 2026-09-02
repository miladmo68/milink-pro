-- MiLink onboarding readiness checklist (safe to re-run).
-- Adds the project_briefs JSONB contract used by the Portal/Admin checklist.
-- This migration preserves any existing "ready" choices while normalizing the
-- records and labels to the shared product contract.

alter table public.project_briefs
  add column if not exists onboarding_checklist jsonb;

with source as (
  select
    id,
    case
      when jsonb_typeof(onboarding_checklist) = 'array' then onboarding_checklist
      else '[]'::jsonb
    end as current_items
  from public.project_briefs
), normalized as (
  select
    id,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'brand_assets',
        'label', 'Vector Logo & Brand Assets',
        'status', case when exists (
          select 1 from jsonb_array_elements(current_items) as item
          where item ->> 'id' = 'brand_assets' and item ->> 'status' = 'ready'
        ) then 'ready' else 'pending' end
      ),
      jsonb_build_object(
        'id', 'copywriting',
        'label', 'Page Content & Copywriting',
        'status', case when exists (
          select 1 from jsonb_array_elements(current_items) as item
          where item ->> 'id' = 'copywriting' and item ->> 'status' = 'ready'
        ) then 'ready' else 'pending' end
      ),
      jsonb_build_object(
        'id', 'domain_dns',
        'label', 'Domain & DNS Access Details',
        'status', case when exists (
          select 1 from jsonb_array_elements(current_items) as item
          where item ->> 'id' = 'domain_dns' and item ->> 'status' = 'ready'
        ) then 'ready' else 'pending' end
      ),
      jsonb_build_object(
        'id', 'color_palette',
        'label', 'Color Preferences & Typography Approved',
        'status', case when exists (
          select 1 from jsonb_array_elements(current_items) as item
          where item ->> 'id' = 'color_palette' and item ->> 'status' = 'ready'
        ) then 'ready' else 'pending' end
      )
    ) as checklist
  from source
)
update public.project_briefs as brief
set onboarding_checklist = normalized.checklist
from normalized
where brief.id = normalized.id
  and brief.onboarding_checklist is distinct from normalized.checklist;

alter table public.project_briefs
  alter column onboarding_checklist set default '[
    {"id":"brand_assets","label":"Vector Logo & Brand Assets","status":"pending"},
    {"id":"copywriting","label":"Page Content & Copywriting","status":"pending"},
    {"id":"domain_dns","label":"Domain & DNS Access Details","status":"pending"},
    {"id":"color_palette","label":"Color Preferences & Typography Approved","status":"pending"}
  ]'::jsonb,
  alter column onboarding_checklist set not null;

-- Makes the new column visible to PostgREST immediately after this migration.
notify pgrst, 'reload schema';
