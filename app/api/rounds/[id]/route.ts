import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const UpdateRoundSchema = z.object({
  status: z.enum(["active", "complete", "partial"]).optional(),
  total_strokes: z.number().int().nullable().optional(),
  total_par: z.number().int().nullable().optional(),
  score_vs_par: z.number().int().nullable().optional(),
  stableford_points: z.number().int().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: round, error } = await supabase
    .from("rounds")
    .select("*, courses(name, location)")
    .eq("id", id)
    .single();

  if (error || !round) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { data: holes } = await supabase
    .from("holes")
    .select("*")
    .eq("course_version_id", round.course_version_id)
    .order("hole_number", { ascending: true });

  const { data: scores } = await supabase
    .from("hole_scores")
    .select("*")
    .eq("round_id", id)
    .order("hole_number", { ascending: true });

  return NextResponse.json({ round, holes: holes ?? [], scores: scores ?? [] });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = UpdateRoundSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("rounds")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ round: data });
}
