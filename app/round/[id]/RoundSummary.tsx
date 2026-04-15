"use client";

import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import type { Hole, HoleScore, Round } from "@/types";
import { scoreToken } from "@/lib/scoreColor";

type Props = {
  round: Round;
  holes: Hole[];
  scores: HoleScore[];
  parForTee: (hole: Hole) => number;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

function scoreColor(strokes: number | null, par: number) {
  const t = scoreToken(strokes, par);
  if (t === "eagle") return "#AF52DE";
  if (t === "birdie") return "#FF3B30";
  if (t === "bogey") return "#FF9500";
  if (t === "double") return "#8E8E93";
  return "#000";
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 3.5,
        py: 2,
        px: 1.5,
        textAlign: "center",
      }}
    >
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          color: "rgba(60,60,67,0.60)",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1,
          color: color ?? "#000",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function HoleRow({
  hole,
  par,
  score,
  isLast,
}: {
  hole: Hole;
  par: number;
  score: HoleScore | undefined;
  isLast: boolean;
}) {
  const strokes = score?.strokes ?? null;
  const isSkipped = score?.hole_status === "skipped";
  const isPicked = score?.hole_status === "picked_up";
  const display = isSkipped ? "—" : strokes?.toString() ?? "—";
  const color = strokes == null ? "rgba(60,60,67,0.40)" : scoreColor(strokes, par);
  const vs = strokes != null ? strokes - par : null;
  const vsLabel =
    vs == null ? "" : vs === 0 ? "E" : vs > 0 ? `+${vs}` : vs.toString();

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          px: 2,
          py: 1.25,
          gap: 2,
        }}
      >
        <Typography
          component="span"
          sx={{
            width: 28,
            fontSize: "1.0625rem",
            fontWeight: 600,
            color: "rgba(60,60,67,0.60)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {hole.hole_number}
        </Typography>
        <Typography
          component="span"
          sx={{
            flex: 1,
            fontSize: "1.0625rem",
            fontWeight: 400,
            color: "#000",
          }}
        >
          {hole.name ?? `Hole ${hole.hole_number}`}
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: "0.9375rem",
            fontWeight: 400,
            color: "rgba(60,60,67,0.60)",
            fontVariantNumeric: "tabular-nums",
            minWidth: 40,
            textAlign: "right",
          }}
        >
          Par {par}
        </Typography>
        <Box sx={{ minWidth: 56, textAlign: "right" }}>
          <Typography
            component="span"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.01em",
            }}
          >
            {display}
            {isPicked && (
              <Box component="span" sx={{ fontSize: "0.75rem", ml: 0.25, opacity: 0.7 }}>
                *
              </Box>
            )}
          </Typography>
          {vsLabel && (
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: "0.6875rem",
                fontWeight: 600,
                color,
                opacity: 0.85,
                mt: -0.25,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {vsLabel}
            </Typography>
          )}
        </Box>
      </Stack>
      {!isLast && <Divider sx={{ ml: 6 }} />}
    </Box>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <Typography
      component="span"
      sx={{
        display: "block",
        px: 2,
        pt: 3,
        pb: 1,
        fontSize: "0.8125rem",
        fontWeight: 400,
        letterSpacing: 0,
        color: "rgba(60,60,67,0.60)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </Typography>
  );
}

function HoleGroup({
  holes,
  scores,
  parForTee,
}: {
  holes: Hole[];
  scores: HoleScore[];
  parForTee: (h: Hole) => number;
}) {
  return (
    <Card>
      <Box>
        {holes.map((h, i) => (
          <HoleRow
            key={h.id}
            hole={h}
            par={parForTee(h)}
            score={scores.find((s) => s.hole_number === h.hole_number)}
            isLast={i === holes.length - 1}
          />
        ))}
      </Box>
    </Card>
  );
}

export default function RoundSummary({ round, holes, scores, parForTee }: Props) {
  const totalPar = holes.reduce((sum, h) => sum + parForTee(h), 0);
  const totalStrokes = scores.reduce((sum, s) => sum + (s.strokes ?? 0), 0);
  const vsPar = totalStrokes - totalPar;
  const vsColor = vsPar > 0 ? "#FF3B30" : vsPar < 0 ? "#34C759" : "#000";

  const front = holes.filter((h) => h.hole_number <= 9);
  const back = holes.filter((h) => h.hole_number >= 10);

  const frontPar = front.reduce((s, h) => s + parForTee(h), 0);
  const frontStrokes = front.reduce((sum, h) => {
    const sc = scores.find((x) => x.hole_number === h.hole_number);
    return sum + (sc?.strokes ?? 0);
  }, 0);
  const backPar = back.reduce((s, h) => s + parForTee(h), 0);
  const backStrokes = back.reduce((sum, h) => {
    const sc = scores.find((x) => x.hole_number === h.hole_number);
    return sum + (sc?.strokes ?? 0);
  }, 0);

  return (
    <Stack spacing={0} sx={{ pb: 3 }}>
      {/* Large title */}
      <Box sx={{ px: 2, pt: 2, pb: 2.5 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "rgba(60,60,67,0.60)",
            mb: 0.5,
          }}
        >
          {formatDate(round.played_at)} · {round.tee_colour} tees · {round.hole_count} holes
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: "2.125rem",
            fontWeight: 700,
            letterSpacing: "-0.022em",
            lineHeight: 1.12,
            color: "#000",
          }}
        >
          Scorecard
        </Typography>
      </Box>

      {/* Stat tiles */}
      <Stack direction="row" spacing={1} sx={{ px: 2, mb: 1 }}>
        <StatTile label="Strokes" value={totalStrokes.toString()} />
        <StatTile label="Par" value={totalPar.toString()} />
        <StatTile
          label="vs Par"
          value={vsPar === 0 ? "E" : vsPar > 0 ? `+${vsPar}` : vsPar.toString()}
          color={vsColor}
        />
      </Stack>

      {/* Front 9 */}
      {front.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", px: 2, pt: 3, pb: 1 }}>
            <Typography
              component="span"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 400,
                color: "rgba(60,60,67,0.60)",
                textTransform: "uppercase",
              }}
            >
              Front 9
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "rgba(60,60,67,0.60)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {frontStrokes || "—"} / {frontPar}
            </Typography>
          </Box>
          <Box sx={{ px: 2 }}>
            <HoleGroup holes={front} scores={scores} parForTee={parForTee} />
          </Box>
        </>
      )}

      {/* Back 9 */}
      {back.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", px: 2, pt: 3, pb: 1 }}>
            <Typography
              component="span"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 400,
                color: "rgba(60,60,67,0.60)",
                textTransform: "uppercase",
              }}
            >
              Back 9
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "rgba(60,60,67,0.60)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {backStrokes || "—"} / {backPar}
            </Typography>
          </Box>
          <Box sx={{ px: 2 }}>
            <HoleGroup holes={back} scores={scores} parForTee={parForTee} />
          </Box>
        </>
      )}

      {/* Actions */}
      <Box sx={{ px: 2, pt: 4 }}>
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href="/rounds"
            size="large"
          >
            History
          </Button>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href="/setup"
            size="large"
          >
            New Round
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
