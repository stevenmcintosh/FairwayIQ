"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InsightsIcon from "@mui/icons-material/InsightsRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightIcon from "@mui/icons-material/ChevronRightRounded";
import HomeIcon from "@mui/icons-material/HomeRounded";
import HoleMap from "./HoleMap";
import StatsSheet from "./StatsSheet";
import InsightsSheet from "./InsightsSheet";
import { useGeolocation } from "@/lib/useGeolocation";
import { distanceYards } from "@/lib/geo";
import type { Hole, HoleScore, TeeColour } from "@/types";
import { yardageForTee } from "@/types";
import type { HoleInsightMap } from "@/lib/holeInsights";
import type { HoleLoggerSnapshot } from "./HoleLoggerBody";

type Props = {
  hole: Hole;
  par: number;
  tee: TeeColour;
  roundId: string;
  existing: HoleScore | null;
  currentIndex: number;
  totalHoles: number;
  isFirstHole: boolean;
  isLastHole: boolean;
  insights: HoleInsightMap;
  onPrev: () => void;
  onNext: () => void;
  onShowCard: () => void;
  onSkip: () => void;
  onPickUp: () => void;
  onSave: (payload: HoleLoggerSnapshot, advance: boolean) => Promise<void>;
};

const chipSx = {
  backgroundColor: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
  borderRadius: 999,
};

export default function HoleMapView({
  hole,
  par,
  tee,
  roundId,
  existing,
  currentIndex,
  totalHoles,
  isFirstHole,
  isLastHole,
  insights,
  onPrev,
  onNext,
  onShowCard,
  onSkip,
  onPickUp,
  onSave,
}: Props) {
  const [statsOpen, setStatsOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const geo = useGeolocation();

  const green = hole.gps_green;
  const distance = useMemo(() => {
    if (!green) return null;
    if (geo.status === "granted" && geo.coords) {
      return distanceYards(geo.coords, green);
    }
    return yardageForTee(hole, tee);
  }, [green, geo.status, geo.coords, hole, tee]);

  const distanceLabel =
    geo.status === "granted" && geo.coords ? "to green" : "yardage";

  const hasMap = green != null;
  const insight = insights[hole.id] ?? null;

  async function handleSaveAndMaybeNext(payload: HoleLoggerSnapshot, advance: boolean) {
    await onSave(payload, advance);
    if (advance) {
      setStatsOpen(false);
    }
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {hasMap ? (
        <HoleMap green={green} user={geo.coords} accuracy={geo.accuracy} />
      ) : (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, #1C1C1E 0%, #000000 100%)",
          }}
        >
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>
            No map data for this hole
          </Typography>
        </Box>
      )}

      {/* Top bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pt: "calc(env(safe-area-inset-top) + 10px)",
          px: 1.25,
          pb: 1,
          pointerEvents: "none",
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
        >
          <Box sx={{ pointerEvents: "auto" }}>
            <IconButton
              component={Link}
              href="/"
              sx={{
                ...chipSx,
                width: 40,
                height: 40,
                color: "#1E6E4F",
              }}
            >
              <HomeIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            sx={{
              ...chipSx,
              pointerEvents: "auto",
              px: 2,
              py: 0.875,
              textAlign: "center",
              minWidth: 150,
            }}
          >
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "rgba(60,60,67,0.60)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              Hole {hole.hole_number} · Par {par} · {currentIndex + 1}/{totalHoles}
            </Typography>
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "#000",
                letterSpacing: "-0.01em",
                mt: 0.25,
              }}
            >
              {hole.name ?? `Hole ${hole.hole_number}`}
            </Typography>
          </Box>

          <Box sx={{ pointerEvents: "auto" }}>
            <IconButton
              onClick={() => setInsightsOpen(true)}
              sx={{
                ...chipSx,
                width: 40,
                height: 40,
                color: "#1E6E4F",
              }}
            >
              <InsightsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "center", mt: 1.5 }}>
          <Button
            onClick={onShowCard}
            sx={{
              ...chipSx,
              pointerEvents: "auto",
              px: 2,
              py: 0.5,
              minHeight: 32,
              color: "#1E6E4F",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            View scorecard
          </Button>
        </Stack>
      </Box>

      {/* Distance pill */}
      {distance != null && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(env(safe-area-inset-top) + 130px)",
            right: 14,
            ...chipSx,
            px: 2,
            py: 1.25,
            textAlign: "center",
            minWidth: 88,
          }}
        >
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: "1.875rem",
              fontWeight: 800,
              color: "#000",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.03em",
            }}
          >
            {distance}
          </Typography>
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: "0.625rem",
              fontWeight: 700,
              color: "rgba(60,60,67,0.60)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mt: 0.25,
            }}
          >
            yd {distanceLabel}
          </Typography>
        </Box>
      )}

      {/* Geolocation status pill (only when not granted) */}
      {hasMap && geo.status !== "granted" && geo.status !== "idle" && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "calc(env(safe-area-inset-top) + 152px)",
            ...chipSx,
            px: 1.5,
            py: 0.5,
          }}
        >
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(60,60,67,0.75)" }}>
            {geo.status === "prompt"
              ? "Finding your location…"
              : geo.status === "denied"
                ? "Enable location for live yardages"
                : geo.status === "unsupported"
                  ? "GPS not supported"
                  : "Location unavailable"}
          </Typography>
        </Box>
      )}

      {/* Sticky footer */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          pb: "calc(env(safe-area-inset-bottom) + 14px)",
          pt: 1.5,
          px: 1.25,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", pointerEvents: "auto" }}>
          <IconButton
            onClick={onPrev}
            sx={{
              ...chipSx,
              width: 52,
              height: 52,
              color: "#1E6E4F",
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Button
            onClick={() => setStatsOpen(true)}
            fullWidth
            variant="contained"
            sx={{
              height: 52,
              borderRadius: 999,
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 6px 20px rgba(30,110,79,0.45)",
            }}
          >
            {existing ? `Edit score · ${existing.strokes ?? "—"}` : "Enter score"}
          </Button>

          <IconButton
            onClick={onNext}
            sx={{
              ...chipSx,
              width: 52,
              height: 52,
              color: "#1E6E4F",
            }}
            disabled={isLastHole}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Box>

      <StatsSheet
        open={statsOpen}
        onOpen={() => setStatsOpen(true)}
        onClose={() => setStatsOpen(false)}
        hole={hole}
        par={par}
        roundId={roundId}
        existing={existing}
        isLastHole={isLastHole}
        onSkip={onSkip}
        onPickUp={onPickUp}
        onSave={handleSaveAndMaybeNext}
      />
      <InsightsSheet
        open={insightsOpen}
        onOpen={() => setInsightsOpen(true)}
        onClose={() => setInsightsOpen(false)}
        hole={hole}
        par={par}
        insight={insight}
      />
    </Box>
  );
}
