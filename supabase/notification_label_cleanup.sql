-- Safe, rerunnable cleanup for the client-facing message notification label.
-- Run once in the Supabase SQL Editor for existing environments.

update public.notifications
set title = 'New message'
where lower(coalesce(title, '')) = 'new project message';

create or replace function public.notify_message_recipient()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, recipient_id, sender_id, title, body, message, href, link)
  values (
    new.recipient_id,
    new.recipient_id,
    new.sender_id,
    'New message',
    left(new.content, 140),
    left(new.content, 140),
    '/portal',
    '/portal'
  );
  return new;
end;
$$;

drop trigger if exists messages_notify_recipient on public.messages;
create trigger messages_notify_recipient
after insert on public.messages
for each row execute procedure public.notify_message_recipient();
