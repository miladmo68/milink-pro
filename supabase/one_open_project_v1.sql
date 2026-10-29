-- A client may add another project only once every earlier project has a proposal
-- (status beyond draft / submitted / reviewing). Mirrors the rule in the client UI
-- so it cannot be bypassed by calling the API directly. Run once in the Supabase SQL editor.
create or replace function public.enforce_one_open_project()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.project_briefs
    where client_id = new.client_id
      and coalesce(status, 'draft') in ('draft', 'submitted', 'reviewing')
  ) then
    raise exception 'Finish your current project brief first. You can add another project once we have sent its proposal.';
  end if;
  return new;
end $$;

drop trigger if exists project_briefs_one_open on public.project_briefs;
create trigger project_briefs_one_open
  before insert on public.project_briefs
  for each row execute function public.enforce_one_open_project();
