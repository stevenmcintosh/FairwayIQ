import Link from "next/link";
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

  const { data: activeRound } = await supabase
    .from("rounds")
    .select("id")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            FairwayIQ
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Welcome back, {data.user.email}.
          </Typography>
          <Stack direction="row" spacing={2}>
            {activeRound ? (
              <Button variant="contained" size="large" component={Link} href={`/round/${activeRound.id}`}>
                Resume Round
              </Button>
            ) : (
              <Button variant="contained" size="large" component={Link} href="/setup">
                Start a Round
              </Button>
            )}
            <Button variant="outlined" size="large" component={Link} href="/rounds">
              View Rounds
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
