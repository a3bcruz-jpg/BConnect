-- Responder availability for dispatch and assignment.
alter table public.profiles
  add column if not exists responder_availability text not null default 'available';

alter table public.profiles
  drop constraint if exists profiles_responder_availability_check;

alter table public.profiles
  add constraint profiles_responder_availability_check
  check (responder_availability in ('available', 'busy', 'offline'));

create index if not exists profiles_responder_dispatch_idx
  on public.profiles (barangay_id, role, is_active, responder_availability);
