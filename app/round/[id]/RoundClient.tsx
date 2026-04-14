"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { useActiveRound, type ActiveRoundInit } from "@/lib/useActiveRound";
import HoleLogger from "./HoleLogger";
import SkipHoleDialog from "@/components/round/SkipHoleDialog";
import PickUpDialog from "@/components/round/PickUpDialog";
import RoundSummary from "./RoundSummary";

type Mode = "preview" | "logging" | "summary";

export default function RoundClient({ init }: { init: ActiveRoundInit }) {
  const router = useRouter();
  const ar = useActiveRound(init);
  const [mode, setMode] = useState<Mode>(
    init.round.status === "complete" ? "summary" : "preview",
  );
  const [skipOpen, setSkipOpen] = useState(false);
  const [pickUpOpen, setPickUpOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (mode === "summary" || ar.round.status === "complete") {
    return <RoundSummary round={ar.round} holes={ar.playedHoles} scores={ar.scores} parForTee={ar.parForRoundTee} />;
  }

  const hole = ar.currentHole;
  if (!hole) {
    return <Alert severity="info">No holes loaded for this round.</Alert>;
  }

  const par = ar.parForRoundTee(hole);
  const yardage =
    ar.round.tee_colour === "white"
      ? hole.yardage_white
      : ar.round.tee_colour === "yellow"
        ? hole.yardage_yellow
        : hole.yardage_red;

  const existingScore = ar.scoreForHole(hole.hole_number);
  const holeIndex = ar.currentIndex + 1;
  const holesTotal = ar.playedHoles.length;
  const isLastHole = ar.currentIndex === holesTotal - 1;

  async function handleSaved() {
    setError(null);
    if (isLastHole) {
      try {
        await ar.completeRound();
        setMode("summary");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to complete round");
      }
    } else {
      ar.goToNext();
      setMode("preview");
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
      await handleSaved();
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
      await handleSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to pick up");
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Button size="small" onClick={() => router.push("/")}>
          ← Home
        </Button>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Hole {holeIndex} of {holesTotal}
        </Typography>
      </Stack>

      {mode === "preview" && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="overline" sx={{ color: "text.secondary" }}>
                  Hole {hole.hole_number}
                </Typography>
                <Chip size="small" label={`SI ${hole.stroke_index}`} />
              </Stack>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {hole.name ?? `Hole ${hole.hole_number}`}
              </Typography>
              <Stack direction="row" spacing={3}>
                <Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Par
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {par}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Yardage ({ar.round.tee_colour})
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {yardage ?? "—"}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setMode("logging")}
                >
                  Start Hole
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => setSkipOpen(true)}
                >
                  Skip
                </Button>
              </Stack>
              {ar.currentIndex > 0 && (
                <Button size="small" onClick={ar.goToPrev}>
                  ← Previous hole
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {mode === "logging" && (
        <HoleLogger
          hole={hole}
          par={par}
          existing={existingScore}
          roundId={ar.round.id}
          onCancel={() => setMode("preview")}
          onPickUp={() => setPickUpOpen(true)}
          onSaved={async (payload) => {
            await ar.upsertScore(payload);
            await handleSaved();
          }}
        />
      )}

      {error && <Alert severity="error">{error}</Alert>}

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
