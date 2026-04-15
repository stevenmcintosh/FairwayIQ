"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
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
} from "@/types";
import { scoreToken } from "@/lib/scoreColor";

export type HoleLoggerSnapshot = Omit<HoleScore, "id" | "created_at">;

export type HoleLoggerHandle = {
  getPayload: () => HoleLoggerSnapshot;
};

type Props = {
  hole: Hole;
  par: number;
  roundId: string;
  existing: HoleScore | null;
};

function scoreTint(strokes: number, par: number) {
  const t = scoreToken(strokes, par);
  if (t === "eagle") return { bg: "rgba(175,82,222,0.12)", fg: "#AF52DE", label: "Eagle" };
  if (t === "birdie") return { bg: "rgba(255,59,48,0.12)", fg: "#FF3B30", label: "Birdie" };
  if (t === "par") return { bg: "rgba(30,110,79,0.12)", fg: "#1E6E4F", label: "Par" };
  if (t === "bogey") return { bg: "rgba(255,149,0,0.14)", fg: "#FF9500", label: "Bogey" };
  if (t === "double") return { bg: "rgba(142,142,147,0.18)", fg: "#636366", label: "Double+" };
  return null;
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
    width: 44,
    height: 44,
    backgroundColor: "#F2F2F7",
    color: "#000",
    border: "none",
    "&:hover": { backgroundColor: "#E5E5EA" },
    "&.Mui-disabled": { opacity: 0.3, color: "rgba(60,60,67,0.40)" },
  } as const;
  return (
    <Stack direction="row" spacing={2.5} sx={{ alignItems: "center", justifyContent: "center" }}>
      <IconButton
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        sx={btnSx}
      >
        <Box component="span" sx={{ fontSize: "1.5rem", fontWeight: 400, lineHeight: 1 }}>−</Box>
      </IconButton>
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: "3rem",
          lineHeight: 1,
          minWidth: 72,
          textAlign: "center",
          color: "#000",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </Typography>
      <IconButton
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        sx={btnSx}
      >
        <Box component="span" sx={{ fontSize: "1.5rem", fontWeight: 400, lineHeight: 1 }}>+</Box>
      </IconButton>
    </Stack>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="span"
      sx={{
        display: "block",
        px: 2,
        pt: 2.5,
        pb: 1,
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "rgba(60,60,67,0.60)",
        textTransform: "uppercase",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </Typography>
  );
}

function ListRow({
  label,
  children,
  isLast = false,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 44,
          px: 2,
          py: 1.25,
        }}
      >
        <Typography component="span" sx={{ fontSize: "1.0625rem", fontWeight: 400, color: "#000" }}>
          {label}
        </Typography>
        <Box>{children}</Box>
      </Stack>
      {!isLast && <Divider sx={{ ml: 2 }} />}
    </Box>
  );
}

const HoleLoggerBody = forwardRef<HoleLoggerHandle, Props>(function HoleLoggerBody(
  { hole, par, roundId, existing },
  ref,
) {
  const [strokes, setStrokes] = useState(existing?.strokes ?? par);
  const [putts, setPutts] = useState(existing?.putts ?? 2);
  const [fairway, setFairway] = useState<FairwayDirection | null>(existing?.fairway_direction ?? null);
  const [gir, setGir] = useState<boolean>(existing?.green_in_reg ?? false);
  const [penalties, setPenalties] = useState(existing?.penalties ?? 0);
  const [penaltyType, setPenaltyType] = useState<PenaltyType | null>(existing?.penalty_type ?? null);
  const [chipIns, setChipIns] = useState(existing?.chip_ins ?? 0);
  const [sandSave, setSandSave] = useState<boolean>(existing?.sand_save ?? false);

  useEffect(() => {
    setStrokes(existing?.strokes ?? par);
    setPutts(existing?.putts ?? 2);
    setFairway(existing?.fairway_direction ?? null);
    setGir(existing?.green_in_reg ?? false);
    setPenalties(existing?.penalties ?? 0);
    setPenaltyType(existing?.penalty_type ?? null);
    setChipIns(existing?.chip_ins ?? 0);
    setSandSave(existing?.sand_save ?? false);
  }, [existing, hole.id, par]);

  const isPar3 = par === 3;
  const tint = scoreTint(strokes, par);

  useImperativeHandle(
    ref,
    () => ({
      getPayload: (): HoleLoggerSnapshot => ({
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
      }),
    }),
    [roundId, hole.id, hole.hole_number, strokes, putts, isPar3, fairway, gir, penalties, penaltyType, chipIns, sandSave],
  );

  return (
    <Stack spacing={0} sx={{ pb: 1 }}>
      <SectionHeader>Strokes</SectionHeader>
      <Box sx={{ px: 2 }}>
        <Card>
          <Stack spacing={1.5} sx={{ alignItems: "center", py: 2.5 }}>
            <Stepper value={strokes} onChange={setStrokes} min={1} max={15} />
            {tint && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  backgroundColor: tint.bg,
                  color: tint.fg,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                {tint.label}
              </Box>
            )}
          </Stack>
        </Card>
      </Box>

      <SectionHeader>Shot detail</SectionHeader>
      <Box sx={{ px: 2 }}>
        <Card>
          <Box>
            {!isPar3 && (
              <>
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography
                    component="span"
                    sx={{ display: "block", fontSize: "1.0625rem", color: "#000", mb: 1 }}
                  >
                    Fairway
                  </Typography>
                  <ToggleButtonGroup exclusive value={fairway} onChange={(_e, v) => setFairway(v)}>
                    <ToggleButton value="left">Left</ToggleButton>
                    <ToggleButton value="centre">Fairway</ToggleButton>
                    <ToggleButton value="right">Right</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Divider sx={{ ml: 2 }} />
              </>
            )}
            <ListRow label="Green in regulation">
              <Switch checked={gir} onChange={(_e, v) => setGir(v)} />
            </ListRow>
            <Box sx={{ px: 2, py: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography component="span" sx={{ fontSize: "1.0625rem", color: "#000" }}>
                  Putts
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    color: "rgba(60,60,67,0.60)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {putts}
                </Typography>
              </Stack>
              <Stepper value={putts} onChange={setPutts} min={0} max={10} />
            </Box>
          </Box>
        </Card>
      </Box>

      <SectionHeader>Penalties & scrambles</SectionHeader>
      <Box sx={{ px: 2 }}>
        <Card>
          <Box>
            <Box sx={{ px: 2, py: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography component="span" sx={{ fontSize: "1.0625rem", color: "#000" }}>
                  Penalties
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    color: "rgba(60,60,67,0.60)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {penalties}
                </Typography>
              </Stack>
              <Stepper value={penalties} onChange={setPenalties} min={0} max={5} />
              {penalties > 0 && (
                <Box sx={{ mt: 2 }}>
                  <ToggleButtonGroup exclusive value={penaltyType} onChange={(_e, v) => setPenaltyType(v)}>
                    <ToggleButton value="ob">OB</ToggleButton>
                    <ToggleButton value="water">Water</ToggleButton>
                    <ToggleButton value="unplayable">Unplayable</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}
            </Box>
            <Divider sx={{ ml: 2 }} />
            <Box sx={{ px: 2, py: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography component="span" sx={{ fontSize: "1.0625rem", color: "#000" }}>
                  Chip-ins
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    color: "rgba(60,60,67,0.60)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {chipIns}
                </Typography>
              </Stack>
              <Stepper value={chipIns} onChange={setChipIns} min={0} max={3} />
            </Box>
            <Divider sx={{ ml: 2 }} />
            <ListRow label="Sand save" isLast>
              <Switch checked={sandSave} onChange={(_e, v) => setSandSave(v)} />
            </ListRow>
          </Box>
        </Card>
      </Box>
    </Stack>
  );
});

export default HoleLoggerBody;
