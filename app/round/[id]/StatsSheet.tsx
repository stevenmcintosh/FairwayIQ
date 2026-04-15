"use client";

import { useRef, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import type { Hole, HoleScore } from "@/types";
import HoleLoggerBody, {
  type HoleLoggerHandle,
  type HoleLoggerSnapshot,
} from "./HoleLoggerBody";

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  hole: Hole;
  par: number;
  roundId: string;
  existing: HoleScore | null;
  isLastHole: boolean;
  onSkip: () => void;
  onPickUp: () => void;
  onSave: (payload: HoleLoggerSnapshot, advance: boolean) => Promise<void>;
};

export default function StatsSheet({
  open,
  onOpen,
  onClose,
  hole,
  par,
  roundId,
  existing,
  isLastHole,
  onSkip,
  onPickUp,
  onSave,
}: Props) {
  const bodyRef = useRef<HoleLoggerHandle>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(advance: boolean) {
    if (!bodyRef.current) return;
    setSaving(true);
    try {
      await onSave(bodyRef.current.getPayload(), advance);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableSwipeToOpen
      ModalProps={{ keepMounted: false }}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "92dvh",
            backgroundColor: "#F2F2F7",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", pt: 1, pb: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 5,
            borderRadius: 999,
            backgroundColor: "rgba(60,60,67,0.30)",
          }}
        />
      </Box>

      <Stack
        direction="row"
        sx={{ px: 2, pt: 1, pb: 1.5, alignItems: "baseline", justifyContent: "space-between" }}
      >
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
            Hole {hole.hole_number} · Par {par}
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
          Cancel
        </Button>
      </Stack>

      <Box sx={{ overflowY: "auto", flex: 1 }}>
        <HoleLoggerBody
          ref={bodyRef}
          hole={hole}
          par={par}
          roundId={roundId}
          existing={existing}
        />
      </Box>

      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: "calc(env(safe-area-inset-bottom) + 12px)",
          borderTop: "1px solid rgba(60,60,67,0.14)",
          backgroundColor: "#F2F2F7",
        }}
      >
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={saving}
            onClick={() => handleSave(true)}
          >
            {saving ? "Saving…" : isLastHole ? "Save & finish round" : "Save & next hole"}
          </Button>
          <Stack direction="row" spacing={1}>
            <Button fullWidth variant="outlined" size="large" onClick={() => handleSave(false)} disabled={saving}>
              Save & stay
            </Button>
            <Button fullWidth variant="outlined" size="large" onClick={onSkip}>
              Skip
            </Button>
            <Button fullWidth variant="outlined" size="large" onClick={onPickUp}>
              Pick up
            </Button>
          </Stack>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );
}
