"use client";

import { useCallback, useMemo, useState } from "react";
import type { Hole, HoleScore, Round, TeeColour } from "@/types";
import { parForTee } from "@/types";

export type ActiveRoundInit = {
  round: Round;
  holes: Hole[];
  scores: HoleScore[];
};

export function useActiveRound(init: ActiveRoundInit) {
  const [round, setRound] = useState<Round>(init.round);
  const [scores, setScores] = useState<HoleScore[]>(init.scores);

  // Restrict hole list for 9-hole rounds using course_version.nine_hole_config if relevant.
  // For now, if hole_count is 9 we take the course-specific config via Rowany's known mapping;
  // without the config hydrated client-side we fall back to front-9. Server hands us the full
  // course holes so we filter here.
  const playedHoles = useMemo<Hole[]>(() => {
    if (round.hole_count === 18) return init.holes;
    // Rowany 9-hole config: 1-5 then 15-18. Falls back to first 9 if hole list differs.
    const rowanyNine = [1, 2, 3, 4, 5, 15, 16, 17, 18];
    const filtered = init.holes.filter((h) => rowanyNine.includes(h.hole_number));
    return filtered.length === 9 ? filtered : init.holes.slice(0, 9);
  }, [init.holes, round.hole_count]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const lastLogged = init.scores.reduce((max, s) => Math.max(max, s.hole_number), 0);
    const idx = playedHoles.findIndex((h) => h.hole_number > lastLogged);
    return idx === -1 ? 0 : idx;
  });

  const currentHole = playedHoles[currentIndex] ?? null;

  const scoreForHole = useCallback(
    (holeNumber: number) => scores.find((s) => s.hole_number === holeNumber) ?? null,
    [scores],
  );

  const parForRoundTee = useCallback(
    (hole: Hole) => parForTee(hole, round.tee_colour as TeeColour),
    [round.tee_colour],
  );

  const totalPar = useMemo(
    () => playedHoles.reduce((sum, h) => sum + parForRoundTee(h), 0),
    [playedHoles, parForRoundTee],
  );

  const totalStrokes = useMemo(
    () => scores.reduce((sum, s) => sum + (s.strokes ?? 0), 0),
    [scores],
  );

  const upsertScore = useCallback(
    async (payload: Omit<HoleScore, "id" | "created_at">) => {
      const res = await fetch("/api/hole-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "failed_to_save");
      const saved = json.hole_score as HoleScore;
      setScores((prev) => {
        const idx = prev.findIndex((s) => s.hole_number === saved.hole_number);
        if (idx === -1) return [...prev, saved].sort((a, b) => a.hole_number - b.hole_number);
        const next = [...prev];
        next[idx] = saved;
        return next;
      });
      return saved;
    },
    [],
  );

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, playedHoles.length - 1));
  }, [playedHoles.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const jumpTo = useCallback((holeNumber: number) => {
    const idx = playedHoles.findIndex((h) => h.hole_number === holeNumber);
    if (idx !== -1) setCurrentIndex(idx);
  }, [playedHoles]);

  const completeRound = useCallback(async () => {
    const score_vs_par = totalStrokes - totalPar;
    const res = await fetch(`/api/rounds/${round.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "complete",
        total_strokes: totalStrokes,
        total_par: totalPar,
        score_vs_par,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "failed_to_complete");
    setRound(json.round as Round);
    return json.round as Round;
  }, [round.id, totalStrokes, totalPar]);

  return {
    round,
    playedHoles,
    scores,
    currentIndex,
    currentHole,
    scoreForHole,
    parForRoundTee,
    totalPar,
    totalStrokes,
    upsertScore,
    goToNext,
    goToPrev,
    jumpTo,
    completeRound,
  };
}
