-- Production hardening: reconcile notification schema and expose narrow trusted write RPCs.

alter table public.notifications
  add column if not exists priority text not null default 'normal';

alter table public.notifications
  add column if not exists read_at timestamptz;

update public.notifications
set read_at = created_at
where read_at is null
  and coalesce(is_read, false) = true;

alter table public.notifications
  drop column if exists is_read;

alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check check (type in (
    'incident_created',
    'incident_verified',
    'incident_assigned',
    'incident_status_changed',
    'incident_escalated',
    'system'
  ));

alter table public.notifications
  drop constraint if exists notifications_priority_check;

alter table public.notifications
  add constraint notifications_priority_check check (priority in ('critical', 'high', 'normal'));

create or replace function public.create_notification(
  p_user_id uuid,
  p_incident_id uuid,
  p_type text,
  p_priority text,
  p_title text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  notification_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if p_type not in ('incident_created','incident_verified','incident_assigned','incident_status_changed','incident_escalated','system') then
    raise exception 'Invalid notification type.' using errcode = '22023';
  end if;

  if p_priority not in ('critical','high','normal') then
    raise exception 'Invalid notification priority.' using errcode = '22023';
  end if;

  insert into public.notifications (user_id, incident_id, type, priority, title, message)
  values (p_user_id, p_incident_id, p_type, p_priority, p_title, p_message)
  returning id into notification_id;

  return notification_id;
end;
$$;

revoke all on function public.create_notification(uuid,uuid,text,text,text,text) from public;
grant execute on function public.create_notification(uuid,uuid,text,text,text,text) to authenticated;

create or replace function public.append_audit_log(
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  audit_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, metadata)
  values (auth.uid(), p_action, p_resource_type, p_resource_id, coalesce(p_metadata, '{}'::jsonb))
  returning id into audit_id;

  return audit_id;
end;
$$;

revoke all on function public.append_audit_log(text,text,uuid,jsonb) from public;
grant execute on function public.append_audit_log(text,text,uuid,jsonb) to authenticated;

create index if not exists notifications_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;
