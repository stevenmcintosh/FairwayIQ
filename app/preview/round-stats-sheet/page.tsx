"use client";

import Box from "@mui/material/Box";
import StatsSheet from "@/app/round/[id]/StatsSheet";
import { MOCK_HOLES, MOCK_ROUND_ACTIVE_ID } from "@/lib/mockData";

const hole7 = MOCK_HOLES[6];

export default function PreviewStatsSheet() {
  return (
    <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, #1C1C1E 0%, #000 100%)" }}>
      <StatsSheet
        open={true}
        onOpen={() => {}}
        onClose={() => {}}
        hole={hole7}
        par={4}
        roundId={MOCK_ROUND_ACTIVE_ID}
        existing={null}
        isLastHole={false}
        onSkip={() => {}}
        onPickUp={() => {}}
        onSave={async () => {}}
      />
    </Box>
  );
}
