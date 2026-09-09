-- Security and concurrency hardening for the BConnect MVP.

create sequence if not exists public.incident_reference_seq;

create or replace function public.next_incident_reference()
returns text
language sql
security definer
set search_path = public
as $$
  select 'BC-' || to_char(current_date, 'YYYY') || '-' || lpad(nextval('public.incident_reference_seq')::text, 6, '0');
$$;

revoke all on function public.next_incident_reference() from public;
grant execute on function public.next_incident_reference() to authenticated;

alter sequence public.incident_reference_seq owner to postgres;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active = true limit 1;
$$;

revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to authenticated;

alter table public.barangays enable row level security;
alter table public.profiles enable row level security;
alter table public.incidents enable row level security;
alter table public.incident_media enable row level security;
alter table public.incident_updates enable row level security;
alter table public.ai_analyses enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy barangays_read_authenticated on public.barangays
for select to authenticated using (true);

create policy profiles_self_read on public.profiles
for select to authenticated using (id = auth.uid());

create policy profiles_staff_read_barangay on public.profiles
for select to authenticated
using (
  barangay_id = (select barangay_id from public.profiles where id = auth.uid())
  and public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','official','responder','auditor')
);

create policy incidents_resident_read_own on public.incidents
for select to authenticated
using (reporter_id = auth.uid());

create policy incidents_staff_read_barangay on public.incidents
for select to authenticated
using (
  barangay_id = (select barangay_id from public.profiles where id = auth.uid())
  and public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','official','responder','auditor')
);

create policy incidents_resident_insert_own on public.incidents
for insert to authenticated
with check (
  reporter_id = auth.uid()
  and barangay_id = (select barangay_id from public.profiles where id = auth.uid())
  and status = 'submitted'
);

create policy incidents_staff_update_barangay on public.incidents
for update to authenticated
using (
  barangay_id = (select barangay_id from public.profiles where id = auth.uid())
  and public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','official','responder')
)
with check (
  barangay_id = (select barangay_id from public.profiles where id = auth.uid())
);

create policy incident_media_read_related on public.incident_media
for select to authenticated
using (
  exists (
    select 1 from public.incidents i
    where i.id = incident_media.incident_id
      and (i.reporter_id = auth.uid()
        or (i.barangay_id = (select barangay_id from public.profiles where id = auth.uid())
            and public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','official','responder','auditor')))
  )
);

create policy incident_media_insert_related on public.incident_media
for insert to authenticated
with check (
  uploaded_by = auth.uid()
  and exists (select 1 from public.incidents i where i.id = incident_id and i.reporter_id = auth.uid())
);

create policy incident_updates_read_related on public.incident_updates
for select to authenticated
using (
  exists (
    select 1 from public.incidents i
    where i.id = incident_updates.incident_id
      and (i.reporter_id = auth.uid()
        or (i.barangay_id = (select barangay_id from public.profiles where id = auth.uid())
            and public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','official','responder','auditor')))
  )
);

create policy incident_updates_staff_insert on public.incident_updates
for insert to authenticated
with check (
  user_id = auth.uid()
  and public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','official','responder')
  and exists (
    select 1 from public.incidents i
    where i.id = incident_id
      and i.barangay_id = (select barangay_id from public.profiles where id = auth.uid())
  )
);

create policy ai_analyses_staff_read on public.ai_analyses
for select to authenticated
using (
  exists (
    select 1 from public.incidents i
    where i.id = ai_analyses.incident_id
      and i.barangay_id = (select barangay_id from public.profiles where id = auth.uid())
      and public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','official','responder','auditor')
  )
);

create policy notifications_self_read on public.notifications
for select to authenticated using (user_id = auth.uid());

create policy notifications_self_update on public.notifications
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy audit_logs_staff_read on public.audit_logs
for select to authenticated
using (public.current_app_role() in ('super_admin','lgu_admin','auditor'));
