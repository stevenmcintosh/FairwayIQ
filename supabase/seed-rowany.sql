-- FairwayIQ — Rowany Golf Club seed
-- Idempotent: re-runnable via ON CONFLICT. Fixed UUIDs so app code can reference them.
-- Source: club scorecard + iOS Compass GPS captures (centre of each green).
-- Note: `stroke_index` column stores men's SI. Women's SI and red-tee par differences
-- are captured inline in `notes` where they diverge (holes 7, 15).

begin;

-- Course + version (deterministic UUIDs)
insert into public.courses (id, name, location, country)
values ('11111111-1111-1111-1111-111111111111', 'Rowany Golf Club', 'Port Erin', 'Isle of Man')
on conflict (id) do update set name = excluded.name, location = excluded.location, country = excluded.country;

insert into public.course_versions (id, course_id, version_number, label, effective_from, notes, nine_hole_config)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  1,
  '2026 scorecard',
  '2026-01-01',
  'Par 70 men (W/Y) · Par 71 women (R). Slopes: White 122, Yellow 118, Red 127.',
  '{"holes": [1,2,3,4,5,15,16,17,18], "par_men": 35, "par_women": 35, "stroke_indices_men": {"1":6,"2":3,"3":4,"4":8,"5":1,"15":7,"16":2,"17":9,"18":5}, "stroke_indices_women": {"1":7,"2":6,"3":2,"4":4,"5":1,"15":3,"16":5,"17":8,"18":9}}'::jsonb
)
on conflict (course_id, version_number) do update
  set label = excluded.label,
      notes = excluded.notes,
      nine_hole_config = excluded.nine_hole_config;

update public.courses
  set active_version_id = '22222222-2222-2222-2222-222222222222'
  where id = '11111111-1111-1111-1111-111111111111';

-- Holes
-- GPS green coords are decimal degrees converted from iOS Compass DMS captures.
insert into public.holes
  (id, course_version_id, hole_number, name, par_white, par_yellow, par_red, stroke_index,
   yardage_white, yardage_yellow, yardage_red, gps_green, notes)
values
  ('33333333-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',  1, 'Rowany Drive',      4, 4, 4, 16, 278, 257, 268, '{"lat":54.09139,"lng":-4.75528}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',  2, 'The Paddock',       3, 3, 3,  8, 185, 185, 184, '{"lat":54.08917,"lng":-4.75444}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',  3, 'Bunker Hill',       4, 4, 4, 12, 301, 297, 293, '{"lat":54.09167,"lng":-4.75472}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222',  4, 'Landfall',          4, 4, 4, 14, 334, 324, 319, '{"lat":54.08972,"lng":-4.75167}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222',  5, 'The Bell',          5, 5, 5,  6, 497, 473, 402, '{"lat":54.09278,"lng":-4.75444}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222',  6, 'Bayr-Ny-Carricky', 4, 4, 4, 10, 417, 395, 416, '{"lat":54.09000,"lng":-4.75000}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222',  7, 'Doillee',           4, 4, 5,  2, 388, 383, 380, '{"lat":54.09333,"lng":-4.75167}'::jsonb, 'Red tee plays as par 5 (women''s card).'),
  ('33333333-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222',  8, 'Fleshwick',         3, 3, 3, 18, 164, 144, 134, '{"lat":54.09389,"lng":-4.75250}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222',  9, 'The Ridge',         4, 4, 4,  4, 387, 382, 332, '{"lat":54.09083,"lng":-4.74861}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 10, 'The Barracks',      5, 5, 5,  3, 505, 469, 431, '{"lat":54.09417,"lng":-4.75278}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000011', '22222222-2222-2222-2222-222222222222', 11, 'Zion',              4, 4, 4,  7, 362, 353, 287, '{"lat":54.09444,"lng":-4.75306}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000012', '22222222-2222-2222-2222-222222222222', 12, 'The Quarry',        4, 4, 4,  1, 339, 332, 251, '{"lat":54.09306,"lng":-4.75750}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000013', '22222222-2222-2222-2222-222222222222', 13, 'Garden of Eden',    3, 3, 3, 11, 183, 161, 183, '{"lat":54.09417,"lng":-4.75444}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000014', '22222222-2222-2222-2222-222222222222', 14, 'The Plateau',       4, 4, 4,  5, 283, 254, 244, '{"lat":54.09361,"lng":-4.75722}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000015', '22222222-2222-2222-2222-222222222222', 15, 'Keggins',           4, 4, 5, 15, 300, 283, 300, '{"lat":54.09250,"lng":-4.76194}'::jsonb, 'Red tee plays as par 5 (women''s card).'),
  ('33333333-0000-0000-0000-000000000016', '22222222-2222-2222-2222-222222222222', 16, 'Gorse Craig',       3, 3, 3,  9, 149, 149, 149, '{"lat":54.09278,"lng":-4.76111}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000017', '22222222-2222-2222-2222-222222222222', 17, 'Thie Beg',          4, 4, 4, 17, 288, 288, 287, '{"lat":54.09250,"lng":-4.75556}'::jsonb, null),
  ('33333333-0000-0000-0000-000000000018', '22222222-2222-2222-2222-222222222222', 18, 'Bradda',            4, 4, 4, 13, 317, 309, 274, '{"lat":54.09028,"lng":-4.75833}'::jsonb, null)
on conflict (course_version_id, hole_number) do update
  set name = excluded.name,
      par_white = excluded.par_white,
      par_yellow = excluded.par_yellow,
      par_red = excluded.par_red,
      stroke_index = excluded.stroke_index,
      yardage_white = excluded.yardage_white,
      yardage_yellow = excluded.yardage_yellow,
      yardage_red = excluded.yardage_red,
      gps_green = excluded.gps_green,
      notes = excluded.notes;

commit;
