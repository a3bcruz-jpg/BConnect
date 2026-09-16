-- Reconcile the original notification table with the current notification API contract.
-- Migration 0001 creates notifications with is_read and without priority/read_at.
-- Migration 002 used CREATE TABLE IF NOT EXISTS, so it cannot alter that existing table.
-- This migration is intentionally additive and preserves existing notification rows.

alter table public.notifications
  add column if not exists priority text;

alter table public.notifications
  add column if not exists read_at timestamptz;

-- Preserve the original read state when introducing read_at.
update public.notifications
set read_at = created_at
where is_read = true
  and read_at is null;

update public.notifications
set priority = 'normal'
where priority is null;

alter table public.notifications
  alter column priority set default 'normal',
  alter column priority set not null;

alter table public.notifications
  drop constraint if exists notifications_priority_check;

alter table public.notifications
  add constraint notifications_priority_check
  check (priority in ('critical', 'high', 'normal'));

alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type in (
    'incident_created',
    'incident_verified',
    'incident_assigned',
    'incident_status_changed',
    'incident_escalated',
    'system'
  ));

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_incident_idx
  on public.notifications (incident_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- is_read remains for backward compatibility with the original schema.
-- Application code uses read_at as the canonical read-state field.
