import type { Hole, HoleScore, TeeColour } from "@/types";
import { parForTee } from "@/types";

export type HoleInsight = {
  holeId: string;
  timesPlayed: number;
  avgStrokes: number | null;
  avgVsPar: number | null;
  bestStrokes: number | null;
  worstStrokes: number | null;
  rank: number | null;
  totalHoles: number;
  narrative: string;
};

export type HoleInsightMap = Record<string, HoleInsight>;

export function buildHoleInsights(
  holes: Hole[],
  priorScores: Pick<HoleScore, "hole_id" | "strokes" | "hole_status">[],
  tee: TeeColour,
): HoleInsightMap {
  const byHole = new Map<string, number[]>();
  for (const s of priorScores) {
    if (s.hole_status !== "complete") continue;
    if (s.strokes == null) continue;
    const arr = byHole.get(s.hole_id) ?? [];
    arr.push(s.strokes);
    byHole.set(s.hole_id, arr);
  }

  const avgVsParEntries: { holeId: string; avgVsPar: number }[] = [];
  for (const hole of holes) {
    const strokes = byHole.get(hole.id);
    if (!strokes || strokes.length === 0) continue;
    const par = parForTee(hole, tee);
    const avg = strokes.reduce((a, b) => a + b, 0) / strokes.length;
    avgVsParEntries.push({ holeId: hole.id, avgVsPar: avg - par });
  }
  avgVsParEntries.sort((a, b) => b.avgVsPar - a.avgVsPar);
  const rankMap = new Map(avgVsParEntries.map((e, i) => [e.holeId, i + 1]));

  const result: HoleInsightMap = {};
  for (const hole of holes) {
    const strokes = byHole.get(hole.id) ?? [];
    const par = parForTee(hole, tee);
    const timesPlayed = strokes.length;

    if (timesPlayed === 0) {
      result[hole.id] = {
        holeId: hole.id,
        timesPlayed: 0,
        avgStrokes: null,
        avgVsPar: null,
        bestStrokes: null,
        worstStrokes: null,
        rank: null,
        totalHoles: holes.length,
        narrative: "No prior data yet — play this hole to unlock insights.",
      };
      continue;
    }

    const avg = strokes.reduce((a, b) => a + b, 0) / timesPlayed;
    const avgVsPar = avg - par;
    const best = Math.min(...strokes);
    const worst = Math.max(...strokes);
    const rank = rankMap.get(hole.id) ?? null;

    let narrative: string;
    if (rank === 1 && avgVsPar >= 0.5) {
      narrative = `Your toughest hole — avg ${avgVsPar >= 0 ? "+" : ""}${avgVsPar.toFixed(1)} over par. Play it safe.`;
    } else if (rank && rank <= 3 && avgVsPar >= 0.3) {
      narrative = `Top ${rank} hardest hole for you (avg ${avgVsPar >= 0 ? "+" : ""}${avgVsPar.toFixed(1)}). Manage your miss.`;
    } else if (avgVsPar <= -0.2) {
      narrative = `You score well here — avg ${avgVsPar.toFixed(1)} under par. Stay aggressive.`;
    } else if (Math.abs(avgVsPar) < 0.3) {
      narrative = `You tend to play this one even (avg ${avgVsPar >= 0 ? "+" : ""}${avgVsPar.toFixed(1)}).`;
    } else {
      narrative = `Avg ${avgVsPar >= 0 ? "+" : ""}${avgVsPar.toFixed(1)} over ${timesPlayed} round${timesPlayed === 1 ? "" : "s"}.`;
    }

    result[hole.id] = {
      holeId: hole.id,
      timesPlayed,
      avgStrokes: avg,
      avgVsPar,
      bestStrokes: best,
      worstStrokes: worst,
      rank,
      totalHoles: avgVsParEntries.length,
      narrative,
    };
  }

  return result;
}
