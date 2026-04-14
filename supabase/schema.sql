-- FairwayIQ — Initial Schema
-- Source of truth: BLUEPRINT.md §3. Run in Supabase SQL editor or via `supabase db push`.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT where possible.

begin;

create extension if not exists "pgcrypto";

-- ─── courses ───────────────────────────────────────────────────────────
create table if not exists public.courses (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  location          text,
  country           text,
  active_version_id uuid,
  created_at        timestamptz not null default now()
);

-- ─── course_versions ───────────────────────────────────────────────────
create table if not exists public.course_versions (
  id                uuid primary key default gen_random_uuid(),
  course_id         uuid not null references public.courses(id) on delete cascade,
  version_number    integer not null,
  label             text,
  effective_from    date not null,
  notes             text,
  nine_hole_config  jsonb,
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  unique (course_id, version_number)
);

-- Deferred FK: courses.active_version_id → course_versions.id
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'courses_active_version_id_fkey'
  ) then
    alter table public.courses
      add constraint courses_active_version_id_fkey
      foreign key (active_version_id) references public.course_versions(id);
  end if;
end $$;

-- ─── holes ─────────────────────────────────────────────────────────────
create table if not exists public.holes (
  id                uuid primary key default gen_random_uuid(),
  course_version_id uuid not null references public.course_versions(id) on delete cascade,
  hole_number       integer not null check (hole_number between 1 and 18),
  name              text,
  par_white         integer not null,
  par_yellow        integer not null,
  par_red           integer not null,
  stroke_index      integer not null check (stroke_index between 1 and 18),
  yardage_white     integer,
  yardage_yellow    integer,
  yardage_red       integer,
  gps_tee_white     jsonb,
  gps_tee_yellow    jsonb,
  gps_tee_red       jsonb,
  gps_green         jsonb,
  notes             text,
  created_at        timestamptz not null default now(),
  unique (course_version_id, hole_number)
);

-- ─── rounds ────────────────────────────────────────────────────────────
create table if not exists public.rounds (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  course_id         uuid not null references public.courses(id),
  course_version_id uuid not null references public.course_versions(id),
  played_at         date not null,
  tee_colour        text not null check (tee_colour in ('white','yellow','red')),
  hole_count        integer not null check (hole_count in (9, 18)),
  status            text not null default 'active' check (status in ('active','complete','partial')),
  data_source       text not null default 'real' check (data_source in ('real','seed')),
  total_strokes     integer,
  total_par         integer,
  score_vs_par      integer,
  stableford_points integer,
  weather           text check (weather in ('sunny','windy','wet','overcast') or weather is null),
  notes             text,
  created_at        timestamptz not null default now()
);

create index if not exists rounds_user_played_idx on public.rounds (user_id, played_at desc);
create index if not exists rounds_source_idx on public.rounds (data_source);

-- ─── hole_scores ───────────────────────────────────────────────────────
create table if not exists public.hole_scores (
  id                uuid primary key default gen_random_uuid(),
  round_id          uuid not null references public.rounds(id) on delete cascade,
  hole_id           uuid not null references public.holes(id),
  hole_number       integer not null,
  strokes           integer,
  putts             integer,
  fairway_direction text check (fairway_direction in ('left','centre','right') or fairway_direction is null),
  green_in_reg      boolean,
  penalties         integer not null default 0,
  penalty_type      text check (penalty_type in ('ob','water','unplayable') or penalty_type is null),
  chip_ins          integer not null default 0,
  sand_save         boolean,
  hole_status       text not null default 'complete' check (hole_status in ('complete','skipped','picked_up')),
  notes             text,
  created_at        timestamptz not null default now(),
  unique (round_id, hole_number)
);

create index if not exists hole_scores_round_idx on public.hole_scores (round_id);

-- ─── practice_sessions ─────────────────────────────────────────────────
create table if not exists public.practice_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  session_date    date not null,
  duration_mins   integer not null default 30,
  focus_area      text check (focus_area in ('putting','chipping','driving','approach','bunker')),
  drill_assigned  text,
  drill_completed boolean not null default false,
  notes           text,
  created_at      timestamptz not null default now()
);

-- ─── user_profiles ─────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  display_name   text,
  handicap_index numeric(4,1),
  home_course_id uuid references public.courses(id),
  is_operator    boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Auto-create user_profiles row on new auth.users signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security ────────────────────────────────────────────────
alter table public.courses           enable row level security;
alter table public.course_versions   enable row level security;
alter table public.holes             enable row level security;
alter table public.rounds            enable row level security;
alter table public.hole_scores       enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.user_profiles     enable row level security;

-- Courses / versions / holes — everyone signed in can read; only operators write (checked server-side)
drop policy if exists "courses_read" on public.courses;
create policy "courses_read" on public.courses
  for select to authenticated using (true);

drop policy if exists "course_versions_read" on public.course_versions;
create policy "course_versions_read" on public.course_versions
  for select to authenticated using (true);

drop policy if exists "holes_read" on public.holes;
create policy "holes_read" on public.holes
  for select to authenticated using (true);

-- Rounds — user sees/writes only their own
drop policy if exists "rounds_owner_read" on public.rounds;
create policy "rounds_owner_read" on public.rounds
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "rounds_owner_write" on public.rounds;
create policy "rounds_owner_write" on public.rounds
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Hole scores — tied to round ownership
drop policy if exists "hole_scores_owner_read" on public.hole_scores;
create policy "hole_scores_owner_read" on public.hole_scores
  for select to authenticated using (
    exists (select 1 from public.rounds r where r.id = round_id and r.user_id = auth.uid())
  );

drop policy if exists "hole_scores_owner_write" on public.hole_scores;
create policy "hole_scores_owner_write" on public.hole_scores
  for all to authenticated using (
    exists (select 1 from public.rounds r where r.id = round_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.rounds r where r.id = round_id and r.user_id = auth.uid())
  );

-- Practice sessions
drop policy if exists "practice_owner_read" on public.practice_sessions;
create policy "practice_owner_read" on public.practice_sessions
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "practice_owner_write" on public.practice_sessions;
create policy "practice_owner_write" on public.practice_sessions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User profiles — user can read/update their own
drop policy if exists "profiles_owner_read" on public.user_profiles;
create policy "profiles_owner_read" on public.user_profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_owner_update" on public.user_profiles;
create policy "profiles_owner_update" on public.user_profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

commit;
