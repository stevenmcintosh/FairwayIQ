export type ScoreToken = "eagle" | "birdie" | "par" | "bogey" | "double" | "none";

export function scoreToken(strokes: number | null | undefined, par: number): ScoreToken {
  if (strokes == null || strokes <= 0) return "none";
  const vs = strokes - par;
  if (vs <= -2) return "eagle";
  if (vs === -1) return "birdie";
  if (vs === 0) return "par";
  if (vs === 1) return "bogey";
  return "double";
}

export const SCORE_COLORS: Record<ScoreToken, { bg: string; fg: string; border: string; label: string }> = {
  eagle:  { bg: "#C8963E", fg: "#FFFEF9", border: "#9C6E20", label: "Eagle" },
  birdie: { bg: "#0B3D2E", fg: "#FFFEF9", border: "#072418", label: "Birdie" },
  par:    { bg: "#EFEAD8", fg: "#0E1A14", border: "#D8D1B8", label: "Par" },
  bogey:  { bg: "#E7C48A", fg: "#3A2410", border: "#C8963E", label: "Bogey" },
  double: { bg: "#8C2F2F", fg: "#FFFEF9", border: "#5C1717", label: "Double+" },
  none:   { bg: "transparent", fg: "#4A5A50", border: "rgba(14,26,20,0.18)", label: "—" },
};
