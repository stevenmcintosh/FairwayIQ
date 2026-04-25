import Link from "next/link";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HomeActiveRound from "./HomeActiveRound";

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
    <Box sx={{ minHeight: "100dvh" }}>
      <Box sx={{ px: 2, pt: 3 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "rgba(60,60,67,0.60)",
            mb: 0.5,
          }}
        >
          {data.user.email}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: "2.125rem",
            fontWeight: 700,
            letterSpacing: "-0.022em",
            lineHeight: 1.12,
            color: "#000",
          }}
        >
          FairwayIQ
        </Typography>
      </Box>

      <Box sx={{ px: 2, pt: 3 }}>
        <Card>
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
              Ready to play
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
              Start a new round
            </Typography>
            <Link href="/setup" style={{ textDecoration: "none" }}>
              <Button fullWidth variant="contained" size="large">
                Start a Round
              </Button>
            </Link>
          </Box>
        </Card>
      </Box>

      {activeRound && (
        <Box sx={{ px: 2, pt: 2 }}>
          <HomeActiveRound roundId={activeRound.id} />
        </Box>
      )}

      <Box sx={{ px: 2, pt: 2 }}>
        <Link href="/rounds" style={{ textDecoration: "none" }}>
          <Button fullWidth variant="outlined" size="large">
            View Round History
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
