-- Secure responder availability changes through a narrow RPC.
-- Responders can change only their own availability; no profile fields are exposed for update.

create or replace function public.set_responder_availability(p_availability text)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_availability not in ('available', 'busy', 'offline') then
    raise exception 'Invalid responder availability.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'responder'
      and is_active = true
  ) then
    raise exception 'Active responder profile required.' using errcode = '42501';
  end if;

  update public.profiles
  set responder_availability = p_availability,
      updated_at = now()
  where id = auth.uid();

  return p_availability;
end;
$$;

revoke all on function public.set_responder_availability(text) from public;
grant execute on function public.set_responder_availability(text) to authenticated;
