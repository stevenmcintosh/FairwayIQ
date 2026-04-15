"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useActiveRound, type ActiveRoundInit } from "@/lib/useActiveRound";
import HoleMapView from "./HoleMapView";
import SkipHoleDialog from "@/components/round/SkipHoleDialog";
import PickUpDialog from "@/components/round/PickUpDialog";
import RoundSummary from "./RoundSummary";
import type { HoleScore, TeeColour } from "@/types";
import type { HoleInsightMap } from "@/lib/holeInsights";
import type { HoleLoggerSnapshot } from "./HoleLoggerBody";

type Props = {
  init: ActiveRoundInit;
  insights: HoleInsightMap;
  mapsApiKey: string | null;
};

export default function RoundClient({ init, insights, mapsApiKey }: Props) {
  const ar = useActiveRound(init);
  const [summaryOpen, setSummaryOpen] = useState(init.round.status === "complete");
  const [skipOpen, setSkipOpen] = useState(false);
  const [pickUpOpen, setPickUpOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (summaryOpen || ar.round.status === "complete") {
    return (
      <Box sx={{ minHeight: "100dvh", py: 3 }}>
        <Box sx={{ maxWidth: 640, mx: "auto", px: 1 }}>
          <RoundSummary
            round={ar.round}
            holes={ar.playedHoles}
            scores={ar.scores}
            parForTee={ar.parForRoundTee}
          />
        </Box>
      </Box>
    );
  }

  const hole = ar.currentHole;
  if (!hole) {
    return (
      <Box sx={{ px: 2, pt: 3 }}>
        <Alert severity="info">No holes loaded for this round.</Alert>
      </Box>
    );
  }

  const holesTotal = ar.playedHoles.length;
  const isFirstHole = ar.currentIndex === 0;
  const isLastHole = ar.currentIndex === holesTotal - 1;
  const existingScore = ar.scoreForHole(hole.hole_number);
  const par = ar.parForRoundTee(hole);

  function goNext() {
    if (isLastHole) void finishRound();
    else ar.goToNext();
  }

  function goPrev() {
    if (isFirstHole) ar.jumpTo(ar.playedHoles[holesTotal - 1].hole_number);
    else ar.goToPrev();
  }

  async function finishRound() {
    setError(null);
    try {
      await ar.completeRound();
      setSummaryOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to complete round");
    }
  }

  async function handleSave(payload: HoleLoggerSnapshot, advance: boolean) {
    setError(null);
    try {
      await ar.upsertScore(payload);
      if (advance) goNext();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save hole");
      throw e;
    }
  }

  async function handleSkip(reason: string | null) {
    try {
      await ar.upsertScore({
        round_id: ar.round.id,
        hole_id: hole!.id,
        hole_number: hole!.hole_number,
        strokes: null,
        putts: null,
        fairway_direction: null,
        green_in_reg: null,
        penalties: 0,
        penalty_type: null,
        chip_ins: 0,
        sand_save: null,
        hole_status: "skipped",
        notes: reason,
      });
      setSkipOpen(false);
      goNext();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to skip hole");
    }
  }

  async function handlePickUp(strokesTaken: number, reason: string | null) {
    try {
      await ar.upsertScore({
        round_id: ar.round.id,
        hole_id: hole!.id,
        hole_number: hole!.hole_number,
        strokes: strokesTaken,
        putts: null,
        fairway_direction: null,
        green_in_reg: false,
        penalties: 0,
        penalty_type: null,
        chip_ins: 0,
        sand_save: null,
        hole_status: "picked_up",
        notes: reason,
      });
      setPickUpOpen(false);
      goNext();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to pick up");
    }
  }

  const content = (
    <>
      <HoleMapView
        hole={hole}
        par={par}
        tee={ar.round.tee_colour as TeeColour}
        roundId={ar.round.id}
        existing={existingScore}
        currentIndex={ar.currentIndex}
        totalHoles={holesTotal}
        isFirstHole={isFirstHole}
        isLastHole={isLastHole}
        insights={insights}
        onPrev={goPrev}
        onNext={goNext}
        onShowCard={() => setSummaryOpen(true)}
        onSkip={() => setSkipOpen(true)}
        onPickUp={() => setPickUpOpen(true)}
        onSave={handleSave}
      />
      {error && (
        <Box
          sx={{
            position: "fixed",
            left: 16,
            right: 16,
            top: "calc(env(safe-area-inset-top) + 72px)",
            zIndex: 1400,
          }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}
      <SkipHoleDialog
        open={skipOpen}
        holeNumber={hole.hole_number}
        onCancel={() => setSkipOpen(false)}
        onConfirm={handleSkip}
      />
      <PickUpDialog
        open={pickUpOpen}
        holeNumber={hole.hole_number}
        maxStrokes={par + 4}
        onCancel={() => setPickUpOpen(false)}
        onConfirm={handlePickUp}
      />
    </>
  );

  if (!mapsApiKey) {
    return (
      <>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, #1C1C1E 0%, #000000 100%)",
            px: 3,
            textAlign: "center",
          }}
        >
          <Box sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 320 }}>
            <Box sx={{ fontSize: "1.125rem", fontWeight: 700, mb: 1 }}>
              Maps not configured
            </Box>
            <Box sx={{ fontSize: "0.9375rem", opacity: 0.7 }}>
              Set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code> and
              restart the dev server.
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  return <APIProvider apiKey={mapsApiKey}>{content}</APIProvider>;
}
