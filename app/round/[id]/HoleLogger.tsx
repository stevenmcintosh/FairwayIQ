"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import type {
  FairwayDirection,
  Hole,
  HoleScore,
  PenaltyType,
  TeeColour,
} from "@/types";
import { scoreToken, SCORE_COLORS } from "@/lib/scoreColor";

type Props = {
  hole: Hole;
  par: number;
  teeColour: TeeColour;
  roundId: string;
  existing: HoleScore | null;
  isFirstHole: boolean;
  isLastHole: boolean;
  onPrev: () => void;
  onSkip: () => void;
  onPickUp: () => void;
  onSavedAndNext: (payload: Omit<HoleScore, "id" | "created_at">) => Promise<void>;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{
        color: "text.secondary",
        fontSize: "0.68rem",
        fontFamily: "var(--font-jakarta)",
      }}
    >
      {children}
    </Typography>
  );
}

function Stepper({
  value,
  onChange,
  min = 0,
  max = 15,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const btnSx = {
    width: 52,
    height: 52,
    border: "1.5px solid rgba(14,26,20,0.16)",
    borderRadius: "50%",
    color: "text.primary",
    backgroundColor: "rgba(255,254,249,0.6)",
    "&:hover": { backgroundColor: "rgba(200,150,62,0.15)", borderColor: "secondary.main" },
    "&.Mui-disabled": { opacity: 0.35 },
  } as const;
  return (
    <Stack direction="row" spacing={3} sx={{ alignItems: "center", justifyContent: "center" }}>
      <IconButton
        size="large"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        sx={btnSx}
      >
        <Box component="span" sx={{ fontSize: "1.6rem", fontWeight: 300, lineHeight: 1 }}>−</Box>
      </IconButton>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "2.75rem",
          lineHeight: 1,
          minWidth: 64,
          textAlign: "center",
          color: "text.primary",
          fontFeatureSettings: "'tnum'",
        }}
      >
        {value}
      </Typography>
      <IconButton
        size="large"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        sx={btnSx}
      >
        <Box component="span" sx={{ fontSize: "1.6rem", fontWeight: 300, lineHeight: 1 }}>+</Box>
      </IconButton>
    </Stack>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "center", py: 0.5 }}
    >
      <SectionLabel>{label}</SectionLabel>
      <Switch checked={checked} onChange={(_e, v) => onChange(v)} />
    </Stack>
  );
}

export default function HoleLogger({
  hole,
  par,
  teeColour,
  roundId,
  existing,
  isFirstHole,
  isLastHole,
  onPrev,
  onSkip,
  onPickUp,
  onSavedAndNext,
}: Props) {
  const [strokes, setStrokes] = useState(existing?.strokes ?? par);
  const [putts, setPutts] = useState(existing?.putts ?? 2);
  const [fairway, setFairway] = useState<FairwayDirection | null>(existing?.fairway_direction ?? null);
  const [gir, setGir] = useState<boolean>(existing?.green_in_reg ?? false);
  const [penalties, setPenalties] = useState(existing?.penalties ?? 0);
  const [penaltyType, setPenaltyType] = useState<PenaltyType | null>(existing?.penalty_type ?? null);
  const [chipIns, setChipIns] = useState(existing?.chip_ins ?? 0);
  const [sandSave, setSandSave] = useState<boolean>(existing?.sand_save ?? false);
  const [saving, setSaving] = useState(false);

  const isPar3 = par === 3;
  const yardage =
    teeColour === "white"
      ? hole.yardage_white
      : teeColour === "yellow"
        ? hole.yardage_yellow
        : hole.yardage_red;

  const token = scoreToken(strokes, par);
  const tokenStyle = SCORE_COLORS[token];
  const wasEdited = existing != null;

  async function handleSaveAndNext() {
    setSaving(true);
    try {
      await onSavedAndNext({
        round_id: roundId,
        hole_id: hole.id,
        hole_number: hole.hole_number,
        strokes,
        putts,
        fairway_direction: isPar3 ? null : fairway,
        green_in_reg: gir,
        penalties,
        penalty_type: penalties > 0 ? penaltyType : null,
        chip_ins: chipIns,
        sand_save: sandSave,
        hole_status: "complete",
        notes: null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3.5}>
          {/* HERO HEADER */}
          <Box sx={{ position: "relative" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "secondary.dark",
                  textTransform: "uppercase",
                }}
              >
                Hole · {hole.hole_number.toString().padStart(2, "0")}
              </Typography>
              {wasEdited && (
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.25,
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: "secondary.main",
                    color: "secondary.dark",
                    fontFamily: "var(--font-jakarta)",
                    fontSize: "0.64rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Editing
                </Box>
              )}
            </Stack>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 0.95,
                fontSize: { xs: "2.6rem", sm: "3.1rem" },
                color: "text.primary",
                mb: 1.5,
              }}
            >
              {hole.name ?? `Hole ${hole.hole_number}`}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "baseline", flexWrap: "wrap" }}>
              <MetaStat label="Par" value={par.toString()} />
              <MetaDot />
              <MetaStat label={`${teeColour} yds`} value={yardage?.toString() ?? "—"} />
              <MetaDot />
              <MetaStat label="SI" value={hole.stroke_index.toString()} />
            </Stack>
          </Box>

          <Divider />

          {/* STROKES — hero field */}
          <Stack spacing={1.5} sx={{ alignItems: "center" }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <SectionLabel>Strokes</SectionLabel>
              {token !== "none" && token !== "par" && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 999,
                    backgroundColor: tokenStyle.bg,
                    color: tokenStyle.fg,
                    fontFamily: "var(--font-jakarta)",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {tokenStyle.label}
                </Box>
              )}
            </Stack>
            <Stepper value={strokes} onChange={setStrokes} min={1} max={15} />
          </Stack>

          {/* FAIRWAY */}
          {!isPar3 && (
            <Stack spacing={1.25} sx={{ alignItems: "center" }}>
              <SectionLabel>Fairway</SectionLabel>
              <ToggleButtonGroup
                exclusive
                value={fairway}
                onChange={(_e, v) => setFairway(v)}
                sx={{ width: "100%" }}
              >
                <ToggleButton value="left" sx={{ flex: 1 }}>Left</ToggleButton>
                <ToggleButton value="centre" sx={{ flex: 1 }}>Fairway</ToggleButton>
                <ToggleButton value="right" sx={{ flex: 1 }}>Right</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}

          {/* GIR */}
          <ToggleRow label="Green in regulation" checked={gir} onChange={setGir} />

          {/* PUTTS */}
          <Stack spacing={1.5} sx={{ alignItems: "center" }}>
            <SectionLabel>Putts</SectionLabel>
            <Stepper value={putts} onChange={setPutts} min={0} max={10} />
          </Stack>

          <Divider sx={{ opacity: 0.6 }} />

          {/* PENALTIES */}
          <Stack spacing={1.5} sx={{ alignItems: "center" }}>
            <SectionLabel>Penalties</SectionLabel>
            <Stepper value={penalties} onChange={setPenalties} min={0} max={5} />
            {penalties > 0 && (
              <ToggleButtonGroup
                exclusive
                value={penaltyType}
                onChange={(_e, v) => setPenaltyType(v)}
                sx={{ width: "100%", mt: 0.5 }}
              >
                <ToggleButton value="ob" sx={{ flex: 1 }}>OB</ToggleButton>
                <ToggleButton value="water" sx={{ flex: 1 }}>Water</ToggleButton>
                <ToggleButton value="unplayable" sx={{ flex: 1 }}>Unplayable</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Stack>

          {/* CHIP-INS */}
          <Stack spacing={1.5} sx={{ alignItems: "center" }}>
            <SectionLabel>Chip-ins</SectionLabel>
            <Stepper value={chipIns} onChange={setChipIns} min={0} max={3} />
          </Stack>

          {/* SAND SAVE */}
          <ToggleRow label="Sand save" checked={sandSave} onChange={setSandSave} />

          <Divider />

          {/* NAV FOOTER */}
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={onPrev}
                sx={{ color: "text.primary", borderColor: "rgba(14,26,20,0.18)" }}
              >
                {isFirstHole ? "← Hole 18" : "← Prev Hole"}
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSaveAndNext}
                disabled={saving}
                sx={{ color: "#FAF7F0" }}
              >
                {saving ? "Saving…" : isLastHole ? "Finish Round" : "Next Hole →"}
              </Button>
            </Stack>
            <Stack
              direction="row"
              spacing={3}
              sx={{ justifyContent: "center", pt: 0.5 }}
            >
              <Button
                size="small"
                onClick={onSkip}
                sx={{
                  minHeight: 32,
                  color: "text.secondary",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Skip hole
              </Button>
              <Box sx={{ color: "text.secondary", alignSelf: "center", opacity: 0.4 }}>·</Box>
              <Button
                size="small"
                onClick={onPickUp}
                sx={{
                  minHeight: 32,
                  color: "text.secondary",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Pick up
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0}>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-jakarta)",
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "text.secondary",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-mono)",
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "text.primary",
          fontFeatureSettings: "'tnum'",
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function MetaDot() {
  return (
    <Box
      sx={{
        width: 3,
        height: 3,
        borderRadius: "50%",
        backgroundColor: "secondary.main",
        mx: 0.5,
        alignSelf: "center",
        opacity: 0.6,
      }}
    />
  );
}
