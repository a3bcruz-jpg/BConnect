-- BConnect notification persistence
-- RLS keeps notification records scoped to their recipient.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in (
    'incident_created',
    'incident_verified',
    'incident_assigned',
    'incident_status_changed',
    'incident_escalated',
    'system'
  )),
  priority text not null default 'normal' check (priority in ('critical', 'high', 'normal')),
  title text not null,
  message text not null,
  incident_id uuid references public.incidents(id) on delete set null,
  read_at timestamptz null,
  created_at timestamptz not null default now()
);

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

-- Inserts are performed by trusted server-side incident workflows.
-- No client insert policy is intentionally exposed.
