import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import RoundClient from "./RoundClient";
import { buildHoleInsights } from "@/lib/holeInsights";
import type { Hole, HoleScore, Round, TeeColour } from "@/types";

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

  const [holesRes, scoresRes, priorScoresRes] = await Promise.all([
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
    supabase
      .from("hole_scores")
      .select("hole_id, strokes, hole_status, round_id, rounds!inner(user_id, course_version_id)")
      .neq("round_id", id)
      .eq("rounds.user_id", userData.user.id)
      .eq("rounds.course_version_id", round.course_version_id),
  ]);

  const holes = (holesRes.data ?? []) as Hole[];
  const insights = buildHoleInsights(
    holes,
    (priorScoresRes.data ?? []) as Pick<HoleScore, "hole_id" | "strokes" | "hole_status">[],
    round.tee_colour as TeeColour,
  );

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null;

  return (
    <RoundClient
      init={{
        round: round as Round,
        holes,
        scores: (scoresRes.data ?? []) as HoleScore[],
      }}
      insights={insights}
      mapsApiKey={mapsApiKey}
    />
  );
}
