import Link from "next/link";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
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

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

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
    <Box sx={{ minHeight: "100dvh", pb: 4 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          pt: 1,
          pb: 0.5,
          minHeight: 44,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button
            size="small"
            variant="text"
            sx={{ minHeight: 36, px: 1.25, color: "primary.main", fontSize: "1.0625rem", fontWeight: 400 }}
          >
            ‹ Home
          </Button>
        </Link>
        <Box sx={{ width: 60 }} />
      </Stack>

      <Box sx={{ px: 2, pt: 2, pb: 2.5 }}>
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
          Rounds
        </Typography>
      </Box>

      {rounds.length === 0 && (
        <Box sx={{ px: 2 }}>
          <Card>
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography component="span" sx={{ display: "block", fontSize: "1.0625rem", color: "rgba(60,60,67,0.60)", mb: 2 }}>
                No rounds yet
              </Typography>
              <Link href="/setup" style={{ textDecoration: "none" }}>
                <Button variant="contained" size="large">Start your first round</Button>
              </Link>
            </Box>
          </Card>
        </Box>
      )}

      {rounds.length > 0 && (
        <Box sx={{ px: 2 }}>
          <Card>
            <Box>
              {rounds.map((r, i) => {
                const vsPar = r.score_vs_par;
                const vsParLabel =
                  vsPar == null ? null : vsPar === 0 ? "E" : vsPar > 0 ? `+${vsPar}` : vsPar.toString();
                const vsColor =
                  vsPar == null ? "#000" : vsPar > 0 ? "#FF3B30" : vsPar < 0 ? "#34C759" : "#000";
                return (
                  <Box key={r.id}>
                    <Link
                      href={`/round/${r.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          px: 2,
                          py: 1.75,
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              fontSize: "1.0625rem",
                              fontWeight: 600,
                              color: "#000",
                              letterSpacing: "-0.004em",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {r.courses?.name ?? "Unknown course"}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              fontSize: "0.8125rem",
                              fontWeight: 400,
                              color: "rgba(60,60,67,0.60)",
                              mt: 0.25,
                            }}
                          >
                            {formatDate(r.played_at)} · {r.hole_count} holes · {r.tee_colour}
                          </Typography>
                        </Box>
                        {r.total_strokes != null && (
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              component="span"
                              sx={{
                                display: "block",
                                fontSize: "1.25rem",
                                fontWeight: 700,
                                color: "#000",
                                fontVariantNumeric: "tabular-nums",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {r.total_strokes}
                            </Typography>
                            {vsParLabel && (
                              <Typography
                                component="span"
                                sx={{
                                  display: "block",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  color: vsColor,
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {vsParLabel}
                              </Typography>
                            )}
                          </Box>
                        )}
                        <Box
                          component="span"
                          sx={{
                            color: "rgba(60,60,67,0.30)",
                            fontSize: "1.25rem",
                            fontWeight: 400,
                            lineHeight: 1,
                            ml: 0.5,
                          }}
                        >
                          ›
                        </Box>
                      </Stack>
                    </Link>
                    {i < rounds.length - 1 && <Divider sx={{ ml: 2 }} />}
                  </Box>
                );
              })}
            </Box>
          </Card>
          <Box sx={{ pt: 3 }}>
            <Link href="/setup" style={{ textDecoration: "none" }}>
              <Button fullWidth variant="contained" size="large">
                New Round
              </Button>
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
}
