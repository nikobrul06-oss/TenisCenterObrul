-- Prilepi v Supabase → SQL Editor → Run

create table if not exists public.bookings (
  id          text primary key,              -- npr. 2026-11-20_c1_h18
  date        date not null,
  court       int  not null check (court in (1, 2)),
  hour        int  not null check (hour between 7 and 23),
  name        text not null check (char_length(name) between 2 and 60),
  phone       text not null check (char_length(phone) between 6 and 20),
  players     int  not null default 2 check (players between 1 and 4),
  note        text check (char_length(note) <= 120),
  cancel_token uuid not null default gen_random_uuid(),
  created_at  timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- obiskovalci (anon) do tabele nimajo neposrednega dostopa
revoke all on public.bookings from anon;

-- prijavljen skrbnik (authenticated) vidi in briše vse
grant select, delete on public.bookings to authenticated;
drop policy if exists admin_read on public.bookings;
drop policy if exists admin_delete on public.bookings;
create policy admin_read   on public.bookings for select to authenticated using (true);
create policy admin_delete on public.bookings for delete to authenticated using (true);

-- seznam zasedenih terminov (brez osebnih podatkov)
create or replace function public.taken_slots(p_from date, p_to date)
returns table (id text) language sql security definer set search_path = public as $$
  select b.id from bookings b where b.date between p_from and p_to;
$$;

-- rezervacija termina; vrne žeton za preklic
create or replace function public.book_slot(
  p_date date, p_court int, p_hour int, p_name text, p_phone text, p_players int, p_note text
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id text := to_char(p_date, 'YYYY-MM-DD') || '_c' || p_court || '_h' || lpad(p_hour::text, 2, '0');
  v_token uuid;
  v_start timestamp := p_date + make_interval(hours => p_hour);
begin
  if v_start < (now() at time zone 'Europe/Ljubljana') then
    raise exception 'Termin je že mimo';
  end if;
  if p_date > (now() at time zone 'Europe/Ljubljana')::date + 14 then
    raise exception 'Rezervacija je možna največ 14 dni vnaprej';
  end if;
  insert into bookings (id, date, court, hour, name, phone, players, note)
  values (v_id, p_date, p_court, p_hour, trim(p_name), trim(p_phone), coalesce(p_players, 2), nullif(trim(p_note), ''))
  returning cancel_token into v_token;
  return v_token;
exception when unique_violation then
  raise exception 'Termin je zaseden';
end;
$$;

-- preklic s žetonom
create or replace function public.cancel_slot(p_id text, p_token uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  delete from bookings where id = p_id and cancel_token = p_token;
  return found;
end;
$$;

revoke all on function public.taken_slots(date, date) from public;
revoke all on function public.book_slot(date, int, int, text, text, int, text) from public;
revoke all on function public.cancel_slot(text, uuid) from public;
grant execute on function public.taken_slots(date, date) to anon, authenticated;
grant execute on function public.book_slot(date, int, int, text, text, int, text) to anon, authenticated;
grant execute on function public.cancel_slot(text, uuid) to anon, authenticated;
