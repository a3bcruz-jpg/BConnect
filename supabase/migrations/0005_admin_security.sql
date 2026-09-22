-- BConnect admin access hardening.
-- Extends the MVP RLS model for organization administration.

create or replace function public.is_admin_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in ('super_admin','lgu_admin','barangay_admin','auditor');
$$;

revoke all on function public.is_admin_role() from public;
grant execute on function public.is_admin_role() to authenticated;

drop policy if exists profiles_staff_read_barangay on public.profiles;
create policy profiles_admin_read on public.profiles
for select to authenticated
using (
  public.current_app_role() in ('super_admin','lgu_admin','auditor')
  or (
    public.current_app_role() = 'barangay_admin'
    and barangay_id = (select barangay_id from public.profiles where id = auth.uid())
  )
  or id = auth.uid()
);

drop policy if exists barangays_read_authenticated on public.barangays;
create policy barangays_read_authenticated on public.barangays
for select to authenticated using (true);

drop policy if exists audit_logs_staff_read on public.audit_logs;
create policy audit_logs_admin_read on public.audit_logs
for select to authenticated
using (
  public.current_app_role() in ('super_admin','lgu_admin','auditor')
  or (
    public.current_app_role() = 'barangay_admin'
    and actor_id in (
      select p.id
      from public.profiles p
      where p.barangay_id = (select barangay_id from public.profiles where id = auth.uid())
    )
  )
);

create index if not exists profiles_barangay_role_idx
  on public.profiles (barangay_id, role, is_active);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);
