"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function HomeActiveRound({ roundId }: { roundId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    await fetch(`/api/rounds/${roundId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Card variant="outlined">
      <Box sx={{ p: 2.5 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "rgba(60,60,67,0.60)",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          In progress
        </Typography>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.018em",
            color: "#000",
            mb: 2,
          }}
        >
          Resume your round
        </Typography>

        {!confirming ? (
          <Stack direction="row" spacing={1.5}>
            <Link href={`/round/${roundId}`} style={{ textDecoration: "none", flex: 1 }}>
              <Button fullWidth variant="contained" size="large">
                Resume
              </Button>
            </Link>
            <Button
              variant="outlined"
              size="large"
              color="error"
              sx={{ flex: 1 }}
              onClick={() => setConfirming(true)}
            >
              Cancel Round
            </Button>
          </Stack>
        ) : (
          <Box>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "rgba(60,60,67,0.80)",
                mb: 1.5,
              }}
            >
              This will permanently delete your in-progress round.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="large"
                disabled={loading}
                onClick={handleCancel}
              >
                {loading ? "Deleting…" : "Yes, delete it"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                disabled={loading}
                onClick={() => setConfirming(false)}
              >
                Keep it
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Card>
  );
}
