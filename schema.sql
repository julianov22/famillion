-- Paste this into Supabase → SQL Editor → Run.

create table players (
  id uuid primary key default auth.uid() references auth.users on delete cascade,
  name text not null check (length(trim(name)) between 1 and 30)
);
create unique index players_name on players (lower(name));

create table answers (
  player_id uuid not null default auth.uid() references players on delete cascade,
  day date not null,
  idx smallint not null check (idx between 0 and 6),
  prompt text not null,
  answer text not null check (length(answer) between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (player_id, day, idx)
);

alter table players enable row level security;
alter table answers enable row level security;

-- The family's "today". Keep the timezone in sync with TZ in index.html.
create function family_today() returns date language sql stable
as $$ select (now() at time zone 'Europe/Amsterdam')::date $$;

-- Security definer so the answers policy can check answers without recursing into itself.
create function has_played(d date) returns boolean language sql stable security definer set search_path = public
as $$ select count(*) >= 7 from answers where player_id = auth.uid() and day = d $$;

create policy "Signed-in players see all names" on players
  for select to authenticated using (true);
create policy "You create your own player" on players
  for insert to authenticated with check (id = auth.uid());

-- Today's answers stay hidden until you've played. Past days are open to everyone.
create policy "See answers once you've played" on answers
  for select to authenticated using (player_id = auth.uid() or day < family_today() or has_played(day));
create policy "Answer today, as yourself" on answers
  for insert to authenticated with check (player_id = auth.uid() and day = family_today());
-- No update or delete policies: answers are final. The referee deletes made-up ones in the Table Editor.
