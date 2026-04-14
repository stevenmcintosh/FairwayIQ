import { redirect, notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import RoundClient from "./RoundClient";
import type { Hole, HoleScore, Round } from "@/types";

export default async function RoundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: round, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !round) notFound();

  const [holesRes, scoresRes] = await Promise.all([
    supabase
      .from("holes")
      .select("*")
      .eq("course_version_id", round.course_version_id)
      .order("hole_number", { ascending: true }),
    supabase
      .from("hole_scores")
      .select("*")
      .eq("round_id", id)
      .order("hole_number", { ascending: true }),
  ]);

  return (
    <Box sx={{ minHeight: "100dvh", py: 3 }}>
      <Container maxWidth="sm">
        <RoundClient
          init={{
            round: round as Round,
            holes: (holesRes.data ?? []) as Hole[],
            scores: (scoresRes.data ?? []) as HoleScore[],
          }}
        />
      </Container>
    </Box>
  );
}
