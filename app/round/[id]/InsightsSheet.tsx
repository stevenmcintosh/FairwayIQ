"use client";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import type { Hole } from "@/types";
import type { HoleInsight } from "@/lib/holeInsights";

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  hole: Hole;
  par: number;
  insight: HoleInsight | null;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ flex: 1, textAlign: "center", py: 2 }}>
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "rgba(60,60,67,0.60)",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: "1.625rem",
          fontWeight: 700,
          color: "#000",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function InsightsSheet({ open, onOpen, onClose, hole, par, insight }: Props) {
  const hasData = insight && insight.timesPlayed > 0;
  const vsPar = insight?.avgVsPar ?? null;
  const vsParColor = vsPar == null ? "#000" : vsPar > 0.2 ? "#FF3B30" : vsPar < -0.2 ? "#34C759" : "#000";
  const vsParLabel =
    vsPar == null
      ? "—"
      : vsPar === 0
        ? "E"
        : vsPar > 0
          ? `+${vsPar.toFixed(1)}`
          : vsPar.toFixed(1);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableSwipeToOpen
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "82dvh",
            backgroundColor: "#F2F2F7",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", pt: 1, pb: 0.5 }}>
        <Box sx={{ width: 36, height: 5, borderRadius: 999, backgroundColor: "rgba(60,60,67,0.30)" }} />
      </Box>

      <Stack direction="row" sx={{ px: 2, pt: 1, pb: 2, alignItems: "baseline", justifyContent: "space-between" }}>
        <Box>
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "rgba(60,60,67,0.60)",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            Hole {hole.hole_number} insights · Par {par}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: "1.625rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#000",
              lineHeight: 1.15,
            }}
          >
            {hole.name ?? `Hole ${hole.hole_number}`}
          </Typography>
        </Box>
        <Button onClick={onClose} size="small" sx={{ fontSize: "1rem", fontWeight: 400 }}>
          Done
        </Button>
      </Stack>

      <Box sx={{ px: 2, pb: "calc(env(safe-area-inset-bottom) + 20px)" }}>
        {!hasData && (
          <Card>
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography sx={{ fontSize: "1rem", color: "rgba(60,60,67,0.60)" }}>
                Play a few rounds to unlock insights for this hole.
              </Typography>
            </Box>
          </Card>
        )}

        {hasData && insight && (
          <Stack spacing={2}>
            <Card>
              <Box sx={{ px: 2, pt: 2, pb: 2 }}>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "rgba(60,60,67,0.60)",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    mb: 0.5,
                  }}
                >
                  Insight
                </Typography>
                <Typography sx={{ fontSize: "1.0625rem", color: "#000", lineHeight: 1.4 }}>
                  {insight.narrative}
                </Typography>
              </Box>
            </Card>

            <Card>
              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
                <Stat label="Played" value={insight.timesPlayed.toString()} />
                <Stat
                  label="Avg"
                  value={insight.avgStrokes ? insight.avgStrokes.toFixed(1) : "—"}
                />
                <Box sx={{ flex: 1, textAlign: "center", py: 2 }}>
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "rgba(60,60,67,0.60)",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      mb: 0.5,
                    }}
                  >
                    vs Par
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: "1.625rem",
                      fontWeight: 700,
                      color: vsParColor,
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {vsParLabel}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <Card>
              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
                <Stat label="Best" value={insight.bestStrokes?.toString() ?? "—"} />
                <Stat label="Worst" value={insight.worstStrokes?.toString() ?? "—"} />
                <Stat
                  label="Rank"
                  value={insight.rank ? `${insight.rank}/${insight.totalHoles}` : "—"}
                />
              </Stack>
            </Card>
          </Stack>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
