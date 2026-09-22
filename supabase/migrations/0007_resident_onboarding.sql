-- Resident onboarding: automatically create a scoped profile after Supabase Auth signup.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_barangay uuid;
  requested_name text;
begin
  requested_barangay := nullif(new.raw_user_meta_data ->> 'barangay_id', '')::uuid;
  requested_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1));

  if requested_barangay is null or not exists (
    select 1 from public.barangays where id = requested_barangay
  ) then
    raise exception 'A valid barangay is required for resident registration.' using errcode = '22023';
  end if;

  insert into public.profiles (id, full_name, email, role, barangay_id, is_active)
  values (new.id, requested_name, new.email, 'resident', requested_barangay, true)
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        barangay_id = excluded.barangay_id,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

revoke all on function public.handle_new_user() from public;
