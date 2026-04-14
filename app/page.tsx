import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            FairwayIQ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {data.user.email}. Phase 1 scaffold in place — round logging coming next.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large" disabled>
              Start a Round
            </Button>
            <Button variant="outlined" size="large" disabled>
              View Stats
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
