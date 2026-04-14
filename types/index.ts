export type TeeColour = "white" | "yellow" | "red";
export type HoleCount = 9 | 18;
export type RoundStatus = "active" | "complete" | "partial";
export type DataSource = "real" | "seed";
export type Weather = "sunny" | "windy" | "wet" | "overcast";
export type FairwayDirection = "left" | "centre" | "right";
export type PenaltyType = "ob" | "water" | "unplayable";
export type HoleStatus = "complete" | "skipped" | "picked_up";

export type LatLng = { lat: number; lng: number };

export type NineHoleConfig = {
  holes: number[];
  par_men: number;
  par_women: number;
  stroke_indices_men?: Record<string, number>;
  stroke_indices_women?: Record<string, number>;
};

export type Course = {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  active_version_id: string | null;
  created_at: string;
};

export type CourseVersion = {
  id: string;
  course_id: string;
  version_number: number;
  label: string | null;
  effective_from: string;
  notes: string | null;
  nine_hole_config: NineHoleConfig | null;
  created_by: string | null;
  created_at: string;
};

export type Hole = {
  id: string;
  course_version_id: string;
  hole_number: number;
  name: string | null;
  par_white: number;
  par_yellow: number;
  par_red: number;
  stroke_index: number;
  yardage_white: number | null;
  yardage_yellow: number | null;
  yardage_red: number | null;
  gps_tee_white: LatLng | null;
  gps_tee_yellow: LatLng | null;
  gps_tee_red: LatLng | null;
  gps_green: LatLng | null;
  notes: string | null;
  created_at: string;
};

export type Round = {
  id: string;
  user_id: string;
  course_id: string;
  course_version_id: string;
  played_at: string;
  tee_colour: TeeColour;
  hole_count: HoleCount;
  status: RoundStatus;
  data_source: DataSource;
  total_strokes: number | null;
  total_par: number | null;
  score_vs_par: number | null;
  stableford_points: number | null;
  weather: Weather | null;
  notes: string | null;
  created_at: string;
};

export type HoleScore = {
  id: string;
  round_id: string;
  hole_id: string;
  hole_number: number;
  strokes: number | null;
  putts: number | null;
  fairway_direction: FairwayDirection | null;
  green_in_reg: boolean | null;
  penalties: number;
  penalty_type: PenaltyType | null;
  chip_ins: number;
  sand_save: boolean | null;
  hole_status: HoleStatus;
  notes: string | null;
  created_at: string;
};

export function parForTee(hole: Pick<Hole, "par_white" | "par_yellow" | "par_red">, tee: TeeColour): number {
  if (tee === "yellow") return hole.par_yellow;
  if (tee === "red") return hole.par_red;
  return hole.par_white;
}

export function yardageForTee(hole: Hole, tee: TeeColour): number | null {
  if (tee === "yellow") return hole.yardage_yellow;
  if (tee === "red") return hole.yardage_red;
  return hole.yardage_white;
}
