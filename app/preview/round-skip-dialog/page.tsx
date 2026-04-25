"use client";

import Box from "@mui/material/Box";
import SkipHoleDialog from "@/components/round/SkipHoleDialog";

export default function PreviewSkipDialog() {
  return (
    <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, #1C1C1E 0%, #000 100%)" }}>
      <SkipHoleDialog
        open={true}
        holeNumber={7}
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    </Box>
  );
}
