import type { Course, Hole, HoleScore, Round } from "@/types";
import type { HoleInsight } from "./holeInsights";

export const MOCK_COURSE_VERSION_ID = "preview-cv-1";
export const MOCK_ROUND_ACTIVE_ID = "preview-round-active";
export const MOCK_ROUND_COMPLETE_ID = "preview-round-complete";

export const MOCK_COURSE: Course = {
  id: "preview-course-1",
  name: "Rowany Golf Club",
  location: "Port Erin, Isle of Man",
  country: "GB",
  active_version_id: MOCK_COURSE_VERSION_ID,
  created_at: "2024-01-01T00:00:00Z",
};

export const MOCK_HOLES: Hole[] = [
  { id: "h1", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 1, name: "The Drive", par_white: 4, par_yellow: 4, par_red: 5, stroke_index: 7, yardage_white: 388, yardage_yellow: 362, yardage_red: 322, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h2", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 2, name: "The Ridge", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 11, yardage_white: 332, yardage_yellow: 312, yardage_red: 290, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h3", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 3, name: "Bradda Head", par_white: 3, par_yellow: 3, par_red: 3, stroke_index: 15, yardage_white: 178, yardage_yellow: 162, yardage_red: 138, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h4", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 4, name: "The Valley", par_white: 5, par_yellow: 5, par_red: 5, stroke_index: 1, yardage_white: 510, yardage_yellow: 488, yardage_red: 446, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h5", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 5, name: "Sloc", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 5, yardage_white: 378, yardage_yellow: 354, yardage_red: 318, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h6", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 6, name: "Iron Gates", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 9, yardage_white: 352, yardage_yellow: 330, yardage_red: 298, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h7", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 7, name: "Mull Hill", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 3, yardage_white: 404, yardage_yellow: 382, yardage_red: 344, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h8", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 8, name: "The Punch Bowl", par_white: 3, par_yellow: 3, par_red: 3, stroke_index: 17, yardage_white: 158, yardage_yellow: 142, yardage_red: 118, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h9", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 9, name: "Home Turn", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 13, yardage_white: 342, yardage_yellow: 322, yardage_red: 288, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h10", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 10, name: "The Bay", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 6, yardage_white: 368, yardage_yellow: 346, yardage_red: 308, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h11", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 11, name: "Calf Rock", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 2, yardage_white: 408, yardage_yellow: 388, yardage_red: 352, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h12", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 12, name: "The Long", par_white: 5, par_yellow: 5, par_red: 5, stroke_index: 8, yardage_white: 492, yardage_yellow: 468, yardage_red: 428, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h13", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 13, name: "The Lighthouse", par_white: 3, par_yellow: 3, par_red: 3, stroke_index: 16, yardage_white: 182, yardage_yellow: 165, yardage_red: 142, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h14", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 14, name: "The Meadow", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 10, yardage_white: 358, yardage_yellow: 336, yardage_red: 302, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h15", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 15, name: "Stretchfield", par_white: 5, par_yellow: 5, par_red: 5, stroke_index: 4, yardage_white: 482, yardage_yellow: 458, yardage_red: 416, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h16", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 16, name: "The Gorse", par_white: 4, par_yellow: 4, par_red: 4, stroke_index: 12, yardage_white: 338, yardage_yellow: 318, yardage_red: 286, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h17", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 17, name: "The Short", par_white: 3, par_yellow: 3, par_red: 3, stroke_index: 18, yardage_white: 162, yardage_yellow: 148, yardage_red: 122, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "h18", course_version_id: MOCK_COURSE_VERSION_ID, hole_number: 18, name: "Home", par_white: 5, par_yellow: 5, par_red: 5, stroke_index: 14, yardage_white: 504, yardage_yellow: 480, yardage_red: 438, gps_tee_white: null, gps_tee_yellow: null, gps_tee_red: null, gps_green: null, notes: null, created_at: "2024-01-01T00:00:00Z" },
];

export const MOCK_ROUND_ACTIVE: Round = {
  id: MOCK_ROUND_ACTIVE_ID,
  user_id: "preview-user-1",
  course_id: MOCK_COURSE.id,
  course_version_id: MOCK_COURSE_VERSION_ID,
  played_at: "2026-04-25T09:30:00Z",
  tee_colour: "yellow",
  hole_count: 18,
  status: "active",
  data_source: "real",
  total_strokes: null,
  total_par: null,
  score_vs_par: null,
  stableford_points: null,
  weather: "sunny",
  notes: null,
  created_at: "2026-04-25T09:30:00Z",
};

export const MOCK_ROUND_COMPLETE: Round = {
  id: MOCK_ROUND_COMPLETE_ID,
  user_id: "preview-user-1",
  course_id: MOCK_COURSE.id,
  course_version_id: MOCK_COURSE_VERSION_ID,
  played_at: "2026-04-18T09:00:00Z",
  tee_colour: "yellow",
  hole_count: 18,
  status: "complete",
  data_source: "real",
  total_strokes: 82,
  total_par: 72,
  score_vs_par: 10,
  stableford_points: null,
  weather: "overcast",
  notes: null,
  created_at: "2026-04-18T09:00:00Z",
};

function score(
  id: string,
  roundId: string,
  holeId: string,
  holeNumber: number,
  strokes: number,
  putts: number,
  extra?: Partial<HoleScore>,
): HoleScore {
  return {
    id,
    round_id: roundId,
    hole_id: holeId,
    hole_number: holeNumber,
    strokes,
    putts,
    fairway_direction: null,
    green_in_reg: strokes <= (MOCK_HOLES[holeNumber - 1].par_yellow - 2),
    penalties: 0,
    penalty_type: null,
    chip_ins: 0,
    sand_save: null,
    hole_status: "complete",
    notes: null,
    created_at: "2026-04-25T10:00:00Z",
    ...extra,
  };
}

// Holes 1-6 complete, currently on hole 7
export const MOCK_SCORES_PARTIAL: HoleScore[] = [
  score("s1", MOCK_ROUND_ACTIVE_ID, "h1", 1, 5, 2),  // +1
  score("s2", MOCK_ROUND_ACTIVE_ID, "h2", 2, 4, 2),  // E
  score("s3", MOCK_ROUND_ACTIVE_ID, "h3", 3, 3, 1),  // E (par 3 one-putt)
  score("s4", MOCK_ROUND_ACTIVE_ID, "h4", 4, 6, 2),  // +1
  score("s5", MOCK_ROUND_ACTIVE_ID, "h5", 5, 5, 2),  // +1
  score("s6", MOCK_ROUND_ACTIVE_ID, "h6", 6, 4, 2),  // E
];

// Full 18-hole completed round (+10 overall)
export const MOCK_SCORES_COMPLETE: HoleScore[] = [
  score("c1",  MOCK_ROUND_COMPLETE_ID, "h1",  1,  5, 2),
  score("c2",  MOCK_ROUND_COMPLETE_ID, "h2",  2,  5, 3),
  score("c3",  MOCK_ROUND_COMPLETE_ID, "h3",  3,  4, 2),
  score("c4",  MOCK_ROUND_COMPLETE_ID, "h4",  4,  6, 2),
  score("c5",  MOCK_ROUND_COMPLETE_ID, "h5",  5,  4, 2),
  score("c6",  MOCK_ROUND_COMPLETE_ID, "h6",  6,  4, 2),
  score("c7",  MOCK_ROUND_COMPLETE_ID, "h7",  7,  5, 2),
  score("c8",  MOCK_ROUND_COMPLETE_ID, "h8",  8,  3, 1),
  score("c9",  MOCK_ROUND_COMPLETE_ID, "h9",  9,  4, 2),
  score("c10", MOCK_ROUND_COMPLETE_ID, "h10", 10, 5, 3),
  score("c11", MOCK_ROUND_COMPLETE_ID, "h11", 11, 5, 2),
  score("c12", MOCK_ROUND_COMPLETE_ID, "h12", 12, 6, 2),
  score("c13", MOCK_ROUND_COMPLETE_ID, "h13", 13, 3, 1),
  score("c14", MOCK_ROUND_COMPLETE_ID, "h14", 14, 5, 2),
  score("c15", MOCK_ROUND_COMPLETE_ID, "h15", 15, 6, 2),
  score("c16", MOCK_ROUND_COMPLETE_ID, "h16", 16, 4, 2),
  score("c17", MOCK_ROUND_COMPLETE_ID, "h17", 17, 3, 1),
  score("c18", MOCK_ROUND_COMPLETE_ID, "h18", 18, 5, 2),
];

export const MOCK_INSIGHT_7: HoleInsight = {
  holeId: "h7",
  timesPlayed: 8,
  avgStrokes: 4.75,
  avgVsPar: 0.75,
  bestStrokes: 4,
  worstStrokes: 7,
  rank: 2,
  totalHoles: 18,
  narrative: "Top 2 hardest hole for you (avg +0.8). Manage your miss.",
};

export const MOCK_ROUNDS_HISTORY = [
  {
    id: MOCK_ROUND_COMPLETE_ID,
    played_at: "2026-04-18T09:00:00Z",
    tee_colour: "yellow",
    hole_count: 18,
    status: "complete",
    total_strokes: 82,
    total_par: 72,
    score_vs_par: 10,
    courses: { name: "Rowany Golf Club", location: "Port Erin, Isle of Man" },
  },
  {
    id: "preview-round-2",
    played_at: "2026-04-11T10:15:00Z",
    tee_colour: "yellow",
    hole_count: 18,
    status: "complete",
    total_strokes: 79,
    total_par: 72,
    score_vs_par: 7,
    courses: { name: "Rowany Golf Club", location: "Port Erin, Isle of Man" },
  },
  {
    id: "preview-round-3",
    played_at: "2026-04-04T08:45:00Z",
    tee_colour: "yellow",
    hole_count: 18,
    status: "complete",
    total_strokes: 85,
    total_par: 72,
    score_vs_par: 13,
    courses: { name: "Rowany Golf Club", location: "Port Erin, Isle of Man" },
  },
  {
    id: "preview-round-4",
    played_at: "2026-03-28T09:30:00Z",
    tee_colour: "red",
    hole_count: 9,
    status: "complete",
    total_strokes: 43,
    total_par: 36,
    score_vs_par: 7,
    courses: { name: "Rowany Golf Club", location: "Port Erin, Isle of Man" },
  },
];
