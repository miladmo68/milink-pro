-- MIlink Notifications project context foreign-key repair v1
--
-- The active dashboard stores project context in public.project_briefs.
-- Older installations created public.notifications.project_id against the
-- inactive legacy public.projects table. `ADD COLUMN IF NOT EXISTS` in a
-- later migration cannot replace an already-existing foreign key, which made
-- any project-scoped notification (notably messages) fail at insert time.
--
-- Safe to re-run. Existing legacy notification rows are retained. Only an
-- orphaned legacy project_id is cleared because it cannot validly reference
-- an active project_briefs row; no notification records are deleted.

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.notifications'::regclass
      and conname = 'notifications_project_id_fkey'
      and contype = 'f'
  ) then
    alter table public.notifications
      drop constraint notifications_project_id_fkey;
  end if;
end
$$;

update public.notifications as notification
set project_id = null
where notification.project_id is not null
  and not exists (
    select 1
    from public.project_briefs as brief
    where brief.id = notification.project_id
  );

alter table public.notifications
  add constraint notifications_project_id_fkey
  foreign key (project_id)
  references public.project_briefs(id)
  on delete cascade;

create index if not exists notifications_recipient_project_created_idx
  on public.notifications (recipient_id, project_id, created_at desc);

notify pgrst, 'reload schema';
