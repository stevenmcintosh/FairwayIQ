"use client";

import Box from "@mui/material/Box";
import PickUpDialog from "@/components/round/PickUpDialog";

export default function PreviewPickUpDialog() {
  return (
    <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, #1C1C1E 0%, #000 100%)" }}>
      <PickUpDialog
        open={true}
        holeNumber={7}
        maxStrokes={8}
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    </Box>
  );
}
