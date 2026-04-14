"use client";

import { useState } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useActiveRound, type ActiveRoundInit } from "@/lib/useActiveRound";
import HoleLogger from "./HoleLogger";
import SkipHoleDialog from "@/components/round/SkipHoleDialog";
import PickUpDialog from "@/components/round/PickUpDialog";
import RoundSummary from "./RoundSummary";
import type { HoleScore } from "@/types";

export default function RoundClient({ init }: { init: ActiveRoundInit }) {
  const ar = useActiveRound(init);
  const [summaryOpen, setSummaryOpen] = useState(init.round.status === "complete");
  const [skipOpen, setSkipOpen] = useState(false);
  const [pickUpOpen, setPickUpOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (summaryOpen || ar.round.status === "complete") {
    return (
      <RoundSummary
        round={ar.round}
        holes={ar.playedHoles}
        scores={ar.scores}
        parForTee={ar.parForRoundTee}
      />
    );
  }

  const hole = ar.currentHole;
  if (!hole) {
    return <Alert severity="info">No holes loaded for this round.</Alert>;
  }

  const par = ar.parForRoundTee(hole);
  const existingScore = ar.scoreForHole(hole.hole_number);
  const holeIndex = ar.currentIndex + 1;
  const holesTotal = ar.playedHoles.length;
  const isFirstHole = ar.currentIndex === 0;
  const isLastHole = ar.currentIndex === holesTotal - 1;

  function goNext() {
    if (isLastHole) {
      void finishRound();
    } else {
      ar.goToNext();
    }
  }

  function goPrev() {
    if (isFirstHole) {
      ar.jumpTo(ar.playedHoles[holesTotal - 1].hole_number);
    } else {
      ar.goToPrev();
    }
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

  async function handleSavedAndNext(payload: Omit<HoleScore, "id" | "created_at">) {
    setError(null);
    try {
      await ar.upsertScore(payload);
      goNext();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save hole");
    }
  }

  async function handleSkip(reason: string | null) {
    try {
      await ar.upsertScore({
        round_id: ar.round.id,
        hole_id: hole.id,
        hole_number: hole.hole_number,
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
        hole_id: hole.id,
        hole_number: hole.hole_number,
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

  return (
    <Stack spacing={2.5}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", px: 0.5 }}
      >
        <Button
          component={Link}
          href="/"
          size="small"
          sx={{
            minHeight: 36,
            px: 1.5,
            color: "primary.main",
            fontFamily: "var(--font-jakarta)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.72rem",
          }}
        >
          ← Home
        </Button>
        <Box
          sx={{
            px: 1.75,
            py: 0.75,
            borderRadius: 999,
            background: "linear-gradient(180deg, #0E4A38, #072418)",
            color: "#FAF7F0",
            fontFamily: "var(--font-mono)",
            fontSize: "0.74rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            boxShadow: "0 4px 14px -8px rgba(7,36,24,0.6)",
          }}
        >
          Hole {holeIndex.toString().padStart(2, "0")} / {holesTotal}
        </Box>
      </Stack>

      <HoleLogger
        key={hole.id}
        hole={hole}
        par={par}
        teeColour={ar.round.tee_colour}
        existing={existingScore}
        roundId={ar.round.id}
        isFirstHole={isFirstHole}
        isLastHole={isLastHole}
        onPrev={goPrev}
        onSkip={() => setSkipOpen(true)}
        onPickUp={() => setPickUpOpen(true)}
        onSavedAndNext={handleSavedAndNext}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", pt: 0.5 }}
      >
        <Typography
          variant="caption"
          onClick={() => setSummaryOpen(true)}
          sx={{
            cursor: "pointer",
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            "&:hover": { color: "primary.main" },
          }}
        >
          View scorecard
        </Typography>
      </Stack>

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
    </Stack>
  );
}
