-- BConnect initial relational schema.
-- Apply in a fresh Supabase/PostgreSQL project.

create extension if not exists pgcrypto;

create type public.app_role as enum (
  'super_admin',
  'lgu_admin',
  'barangay_admin',
  'official',
  'responder',
  'resident',
  'auditor'
);

create type public.incident_priority as enum ('critical', 'high', 'medium', 'low');

create type public.incident_status as enum (
  'draft',
  'queued_offline',
  'submitted',
  'ai_processing',
  'pending_verification',
  'verified',
  'assigned',
  'accepted',
  'responding',
  'on_site',
  'resolved',
  'closed',
  'rejected',
  'duplicate',
  'cancelled'
);

create type public.media_type as enum ('image', 'video', 'audio');

create table public.barangays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  municipality text not null,
  province text not null,
  region text,
  latitude double precision,
  longitude double precision,
  boundary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  role public.app_role not null default 'resident',
  barangay_id uuid references public.barangays(id) on delete set null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  barangay_id uuid not null references public.barangays(id) on delete restrict,
  reporter_id uuid references public.profiles(id) on delete set null,
  category text not null,
  subcategory text,
  description text not null,
  latitude double precision,
  longitude double precision,
  location_text text,
  landmark text,
  priority public.incident_priority,
  ai_priority public.incident_priority,
  ai_confidence text,
  status public.incident_status not null default 'submitted',
  verified_by uuid references public.profiles(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  verified_at timestamptz,
  assigned_at timestamptz,
  responding_at timestamptz,
  on_site_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz
);

create index incidents_barangay_status_idx on public.incidents (barangay_id, status);
create index incidents_priority_idx on public.incidents (priority);
create index incidents_created_at_idx on public.incidents (created_at desc);

create table public.incident_media (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  media_type public.media_type not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create table public.incident_updates (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  previous_status public.incident_status,
  new_status public.incident_status,
  note text,
  created_at timestamptz not null default now()
);

create index incident_updates_incident_created_idx on public.incident_updates (incident_id, created_at);

create table public.ai_analyses (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  model text,
  model_version text,
  category text,
  subcategory text,
  extracted_data jsonb not null default '{}'::jsonb,
  priority_recommendation public.incident_priority,
  confidence text,
  summary text,
  missing_information jsonb not null default '[]'::jsonb,
  safety_flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index ai_analyses_incident_created_idx on public.ai_analyses (incident_id, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  incident_id uuid references public.incidents(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_created_idx on public.notifications (user_id, created_at desc);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_resource_idx on public.audit_logs (resource_type, resource_id, created_at desc);

-- Initial reference number generator. The application should call this function
-- inside the same transaction that inserts an incident.
create or replace function public.next_incident_reference()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  seq bigint;
begin
  select coalesce(max((regexp_match(reference_number, '^BC-[0-9]{4}-([0-9]+)$'))[1]::bigint), 0) + 1
    into seq
  from public.incidents;
  return 'BC-' || to_char(current_date, 'YYYY') || '-' || lpad(seq::text, 6, '0');
end;
$$;
