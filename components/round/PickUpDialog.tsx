"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type Props = {
  open: boolean;
  holeNumber: number;
  maxStrokes: number;
  onCancel: () => void;
  onConfirm: (strokes: number, reason: string | null) => void | Promise<void>;
};

export default function PickUpDialog({
  open,
  holeNumber,
  maxStrokes,
  onCancel,
  onConfirm,
}: Props) {
  const [strokes, setStrokes] = useState(maxStrokes);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm(strokes, reason.trim() || null);
      setReason("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Pick up hole {holeNumber}?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Records a max-score for stats. Stableford-style net double bogey recommended.
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Strokes taken (max)"
          value={strokes}
          onChange={(e) => setStrokes(Number(e.target.value))}
          slotProps={{ htmlInput: { min: 1, max: 15 } }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          size="small"
          label="Note (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. gave up after 3rd shot OB"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Saving…" : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
