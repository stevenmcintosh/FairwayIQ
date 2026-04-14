"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="xs">
        <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            FairwayIQ
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Sign in to log rounds, track stats, and get AI caddy advice.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
