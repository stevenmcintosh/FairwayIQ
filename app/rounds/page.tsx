import Link from "next/link";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RoundRow = {
  id: string;
  played_at: string;
  tee_colour: string;
  hole_count: number;
  status: string;
  total_strokes: number | null;
  total_par: number | null;
  score_vs_par: number | null;
  courses: { name: string | null; location: string | null } | null;
};

export default async function RoundsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data } = await supabase
    .from("rounds")
    .select("id, played_at, tee_colour, hole_count, status, total_strokes, total_par, score_vs_par, courses(name, location)")
    .order("played_at", { ascending: false })
    .limit(50);

  const rounds = (data ?? []) as unknown as RoundRow[];

  return (
    <Box sx={{ minHeight: "100dvh", py: 4 }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Rounds
            </Typography>
            <Button variant="contained" component={Link} href="/setup">
              New round
            </Button>
          </Stack>

          {rounds.length === 0 && (
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              No rounds yet. Start your first one.
            </Typography>
          )}

          {rounds.map((r) => {
            const vsPar = r.score_vs_par;
            const vsParLabel =
              vsPar == null ? null : vsPar > 0 ? `+${vsPar}` : vsPar.toString();
            return (
              <Card key={r.id} component={Link} href={`/round/${r.id}`} sx={{ textDecoration: "none" }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {r.courses?.name ?? "Unknown course"}
                      </Typography>
                      <Chip
                        size="small"
                        label={r.status}
                        color={r.status === "complete" ? "success" : r.status === "active" ? "primary" : "default"}
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {r.played_at} · {r.hole_count} holes · {r.tee_colour}
                    </Typography>
                    {r.total_strokes != null && (
                      <Typography variant="body1">
                        {r.total_strokes} strokes{vsParLabel ? ` · ${vsParLabel}` : ""}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
