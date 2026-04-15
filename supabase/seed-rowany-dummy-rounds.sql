-- FairwayIQ — Rowany dummy rounds seed
--
-- Creates 20 x 18-hole rounds (totals 85–95) and 20 x 9-hole rounds (totals 40–50)
-- for the first user in auth.users. Each round has per-hole scores with a realistic
-- mix of birdies, pars, bogeys, doubles, triples, plus putts / fairway / GIR /
-- penalties / chip-ins / sand saves.
--
-- Idempotent: re-running deletes prior dummy-seed rounds for the same user and
-- re-creates them. Uses notes = '[seed:dummy]' as the marker so real rounds are
-- never touched.
--
-- Run from the Supabase SQL editor, or:
--   psql "$DATABASE_URL" -f supabase/seed-rowany-dummy-rounds.sql
--
-- To target a specific user instead of the first one, set TARGET_EMAIL below.

do $$
declare
  target_email       text    := null;      -- set to 'you@example.com' to force a user
  course_uuid        uuid    := '11111111-1111-1111-1111-111111111111';
  cv_id              uuid    := '22222222-2222-2222-2222-222222222222';
  seed_marker        text    := '[seed:dummy]';
  nine_hole_numbers  int[]   := array[1,2,3,4,5,15,16,17,18];

  target_user_id     uuid;
  round_idx          int;
  round_id           uuid;
  hole_count         int;
  target_min         int;
  target_max         int;
  attempt            int;

  hole_ids           uuid[];
  hole_numbers       int[];
  hole_pars          int[];
  hole_strokes       int[];
  total_par          int;
  total_strokes      int;
  n_holes            int;
  i                  int;

  roll               float;
  delta              int;
  played_date        date;

  putts_val          int;
  fairway_val        text;
  gir_val            boolean;
  penalties_val      int;
  penalty_type_val   text;
  chip_ins_val       int;
  sand_save_val      boolean;
  weather_val        text;
begin
  -- ─── 1. Resolve target user ────────────────────────────────────────────
  if target_email is not null then
    select id into target_user_id from auth.users where email = target_email;
  else
    select id into target_user_id from auth.users order by created_at limit 1;
  end if;

  if target_user_id is null then
    raise exception 'No user found in auth.users. Sign in to the app at least once before seeding.';
  end if;

  -- ─── 2. Clear prior dummy-seed rounds for this user ────────────────────
  delete from public.rounds
   where user_id = target_user_id
     and data_source = 'seed'
     and notes = seed_marker;

  -- Stable pseudo-random so re-runs look similar (but not identical across users).
  perform setseed(0.4242);

  -- ─── 3. Generate 40 rounds (20 x 18-hole, 20 x 9-hole) ─────────────────
  for round_idx in 1..40 loop
    if round_idx <= 20 then
      hole_count := 18;
      target_min := 85;
      target_max := 95;
      select array_agg(id          order by hole_number),
             array_agg(hole_number order by hole_number),
             array_agg(par_white   order by hole_number),
             sum(par_white)::int
        into hole_ids, hole_numbers, hole_pars, total_par
        from public.holes
       where course_version_id = cv_id;
    else
      hole_count := 9;
      target_min := 40;
      target_max := 50;
      select array_agg(id          order by hole_number),
             array_agg(hole_number order by hole_number),
             array_agg(par_white   order by hole_number),
             sum(par_white)::int
        into hole_ids, hole_numbers, hole_pars, total_par
        from public.holes
       where course_version_id = cv_id
         and hole_number = any(nine_hole_numbers);
    end if;

    n_holes := array_length(hole_ids, 1);
    if n_holes <> hole_count then
      raise exception 'Expected % holes for course_version %, got %', hole_count, cv_id, n_holes;
    end if;

    -- ─── 3a. Roll per-hole scores until total lands in target range ─────
    -- Per-hole delta distribution (vs par):
    --   -1 birdie   8%
    --    0 par      28%
    --   +1 bogey    38%
    --   +2 double   18%
    --   +3 triple    6%
    --   +4 quad      2%
    total_strokes := 0;
    for attempt in 1..40 loop
      hole_strokes := array_fill(0, array[n_holes]);
      total_strokes := 0;
      for i in 1..n_holes loop
        roll := random();
        if    roll < 0.08 then delta := -1;
        elsif roll < 0.36 then delta :=  0;
        elsif roll < 0.74 then delta :=  1;
        elsif roll < 0.92 then delta :=  2;
        elsif roll < 0.98 then delta :=  3;
        else                   delta :=  4;
        end if;
        -- No par-3 birdies lower than 2 strokes; no ace handling for simplicity.
        if hole_pars[i] + delta < 2 then
          delta := 2 - hole_pars[i];
        end if;
        hole_strokes[i] := hole_pars[i] + delta;
        total_strokes := total_strokes + hole_strokes[i];
      end loop;
      exit when total_strokes between target_min and target_max;
    end loop;

    -- If still outside range, nudge random holes by ±1 until inside.
    while total_strokes > target_max loop
      i := 1 + floor(random() * n_holes)::int;
      if hole_strokes[i] > hole_pars[i] then
        hole_strokes[i] := hole_strokes[i] - 1;
        total_strokes   := total_strokes - 1;
      end if;
    end loop;
    while total_strokes < target_min loop
      i := 1 + floor(random() * n_holes)::int;
      if hole_strokes[i] < hole_pars[i] + 4 then
        hole_strokes[i] := hole_strokes[i] + 1;
        total_strokes   := total_strokes + 1;
      end if;
    end loop;

    -- ─── 3b. Insert round ───────────────────────────────────────────────
    round_id    := gen_random_uuid();
    played_date := current_date - ((round_idx * 5) + floor(random() * 4)::int);
    weather_val := (array['sunny','windy','overcast','wet'])[1 + floor(random() * 4)::int];

    insert into public.rounds (
      id, user_id, course_id, course_version_id, played_at,
      tee_colour, hole_count, status, data_source,
      total_strokes, total_par, score_vs_par, weather, notes
    ) values (
      round_id, target_user_id, course_uuid, cv_id, played_date,
      'white', hole_count, 'complete', 'seed',
      total_strokes, total_par, total_strokes - total_par, weather_val, seed_marker
    );

    -- ─── 3c. Insert per-hole scores with correlated stats ──────────────
    for i in 1..n_holes loop
      delta := hole_strokes[i] - hole_pars[i];

      -- Putts: correlate with score delta
      if delta <= -1 then
        putts_val := case when random() < 0.55 then 1 else 2 end;             -- birdie: often 1-putt
      elsif delta = 0 then
        roll := random();
        putts_val := case when roll < 0.15 then 1
                          when roll < 0.85 then 2
                          else 3 end;
      elsif delta = 1 then
        roll := random();
        putts_val := case when roll < 0.55 then 2
                          when roll < 0.90 then 3
                          else 1 end;                                          -- rare up-and-down miss
      else
        putts_val := case when random() < 0.65 then 2 else 3 end;
      end if;
      -- Cap putts so they don't exceed strokes
      if putts_val > hole_strokes[i] then putts_val := hole_strokes[i]; end if;

      -- Fairway direction (null on par-3s — no driver)
      if hole_pars[i] = 3 then
        fairway_val := null;
      else
        roll := random();
        fairway_val := case when roll < 0.45 then 'centre'
                            when roll < 0.72 then 'left'
                            else 'right' end;
      end if;

      -- Green in regulation (more likely when delta <= 0)
      if delta <= 0 then
        gir_val := random() < 0.70;
      elsif delta = 1 then
        gir_val := random() < 0.20;
      else
        gir_val := false;
      end if;

      -- Penalties (more likely on bigger blow-ups)
      if delta >= 2 and random() < 0.45 then
        penalties_val := case when random() < 0.80 then 1 else 2 end;
        penalty_type_val := (array['ob','water','unplayable'])[1 + floor(random() * 3)::int];
      else
        penalties_val := 0;
        penalty_type_val := null;
      end if;

      -- Chip-ins (rare, usually when delta <= 0)
      chip_ins_val := case when delta <= 0 and random() < 0.05 then 1 else 0 end;

      -- Sand save (rare, slight correlation with good scores)
      sand_save_val := case when delta <= 1 and random() < 0.08 then true else false end;

      insert into public.hole_scores (
        round_id, hole_id, hole_number, strokes, putts,
        fairway_direction, green_in_reg,
        penalties, penalty_type, chip_ins, sand_save,
        hole_status, notes
      ) values (
        round_id, hole_ids[i], hole_numbers[i], hole_strokes[i], putts_val,
        fairway_val, gir_val,
        penalties_val, penalty_type_val, chip_ins_val, sand_save_val,
        'complete', null
      );
    end loop;
  end loop;

  raise notice 'Seeded 40 dummy rounds (20x18h, 20x9h) for user %', target_user_id;
end;
$$;
