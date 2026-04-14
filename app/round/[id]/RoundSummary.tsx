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
import { scoreToken, SCORE_COLORS } from "@/lib/scoreColor";

type Props = {
  round: Round;
  holes: Hole[];
  scores: HoleScore[];
  parForTee: (hole: Hole) => number;
};

function HoleTile({
  hole,
  par,
  score,
}: {
  hole: Hole;
  par: number;
  score: HoleScore | undefined;
}) {
  const strokes = score?.strokes ?? null;
  const token = score?.hole_status === "skipped" ? "none" : scoreToken(strokes, par);
  const style = SCORE_COLORS[token];
  const isPicked = score?.hole_status === "picked_up";

  return (
    <Box
      sx={{
        position: "relative",
        aspectRatio: "1 / 1",
        borderRadius: 2,
        border: "1px solid",
        borderColor: token === "none" ? "rgba(14,26,20,0.14)" : style.border,
        backgroundColor: style.bg,
        color: style.fg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 1,
        overflow: "hidden",
        transition: "transform 0.15s ease",
      }}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-jakarta)",
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.75,
          lineHeight: 1,
        }}
      >
        {hole.hole_number.toString().padStart(2, "0")}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-mono)",
          fontSize: "1.5rem",
          fontWeight: 700,
          textAlign: "right",
          alignSelf: "flex-end",
          lineHeight: 1,
          fontFeatureSettings: "'tnum'",
        }}
      >
        {strokes ?? "—"}
        {isPicked && (
          <Box component="span" sx={{ fontSize: "0.7rem", ml: 0.25, opacity: 0.8 }}>
            *
          </Box>
        )}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-jakarta)",
          fontSize: "0.52rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          opacity: 0.65,
          lineHeight: 1,
        }}
      >
        par {par}
      </Typography>
    </Box>
  );
}

function NineRow({
  label,
  holes,
  scores,
  parForTee,
}: {
  label: string;
  holes: Hole[];
  scores: HoleScore[];
  parForTee: (h: Hole) => number;
}) {
  const totalPar = holes.reduce((s, h) => s + parForTee(h), 0);
  const totalStrokes = holes.reduce((sum, h) => {
    const sc = scores.find((x) => x.hole_number === h.hole_number);
    return sum + (sc?.strokes ?? 0);
  }, 0);

  return (
    <Stack spacing={1.25}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "baseline", px: 0.5 }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: "var(--font-jakarta)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "secondary.dark",
          }}
        >
          {label}
        </Typography>
        <Typography
          component="span"
          sx={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "text.secondary",
            fontFeatureSettings: "'tnum'",
          }}
        >
          {totalStrokes || "—"} / {totalPar}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${holes.length}, 1fr)`,
          gap: 0.75,
        }}
      >
        {holes.map((h) => (
          <HoleTile
            key={h.id}
            hole={h}
            par={parForTee(h)}
            score={scores.find((s) => s.hole_number === h.hole_number)}
          />
        ))}
      </Box>
    </Stack>
  );
}

export default function RoundSummary({ round, holes, scores, parForTee }: Props) {
  const totalPar = holes.reduce((sum, h) => sum + parForTee(h), 0);
  const totalStrokes = scores.reduce((sum, s) => sum + (s.strokes ?? 0), 0);
  const vsPar = totalStrokes - totalPar;

  const front = holes.filter((h) => h.hole_number <= 9);
  const back = holes.filter((h) => h.hole_number >= 10);

  const vsColor =
    vsPar > 0 ? "error.main" : vsPar < 0 ? "success.main" : "text.primary";

  return (
    <Stack spacing={3}>
      {/* Hero totals */}
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.5}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "baseline" }}
            >
              <Box>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "secondary.dark",
                    display: "block",
                  }}
                >
                  Round · {round.played_at}
                </Typography>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1,
                    fontSize: { xs: "2.3rem", sm: "2.8rem" },
                    mt: 0.5,
                  }}
                >
                  Scorecard
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: "rgba(14,26,20,0.14)",
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                {round.tee_colour} · {round.hole_count}
              </Box>
            </Stack>

            <Divider />

            <Stack direction="row" sx={{ justifyContent: "space-around", alignItems: "baseline" }}>
              <TotalStat label="Strokes" value={totalStrokes.toString()} />
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <TotalStat label="Par" value={totalPar.toString()} />
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <TotalStat
                label="vs Par"
                value={vsPar === 0 ? "E" : vsPar > 0 ? `+${vsPar}` : vsPar.toString()}
                color={vsColor}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Scorecard grid */}
      <Card>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack spacing={2.5}>
            {front.length > 0 && (
              <NineRow label="Front 9" holes={front} scores={scores} parForTee={parForTee} />
            )}
            {back.length > 0 && (
              <NineRow label={front.length > 0 ? "Back 9" : "Back 9"} holes={back} scores={scores} parForTee={parForTee} />
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack direction="row" spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          component={Link}
          href="/rounds"
          sx={{ color: "text.primary", borderColor: "rgba(14,26,20,0.18)" }}
        >
          History
        </Button>
        <Button fullWidth variant="contained" component={Link} href="/setup" sx={{ color: "#FAF7F0" }}>
          New Round
        </Button>
      </Stack>
    </Stack>
  );
}

function TotalStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Stack sx={{ alignItems: "center", flex: 1 }}>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-jakarta)",
          fontSize: "0.58rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "text.secondary",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-fraunces)",
          fontSize: { xs: "2.4rem", sm: "2.9rem" },
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: color ?? "text.primary",
          fontFeatureSettings: "'tnum'",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
