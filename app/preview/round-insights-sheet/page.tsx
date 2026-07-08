"use client";

import Box from "@mui/material/Box";
import InsightsSheet from "@/app/round/[id]/InsightsSheet";
import { MOCK_HOLES, MOCK_INSIGHT_7 } from "@/lib/mockData";

const hole7 = MOCK_HOLES[6];

export default function PreviewInsightsSheet() {
  return (
    <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, #1C1C1E 0%, #000 100%)" }}>
      <InsightsSheet
        open={true}
        onOpen={() => {}}
        onClose={() => {}}
        hole={hole7}
        par={4}
        insight={MOCK_INSIGHT_7}
      />
    </Box>
  );
}
