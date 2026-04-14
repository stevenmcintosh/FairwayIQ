import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CreateRoundSchema = z.object({
  course_id: z.string().uuid(),
  tee_colour: z.enum(["white", "yellow", "red"]),
  hole_count: z.union([z.literal(9), z.literal(18)]),
  weather: z.enum(["sunny", "windy", "wet", "overcast"]).nullable().optional(),
  played_at: z.string().optional(),
});

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("rounds")
    .select("*, courses(name, location)")
    .order("played_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rounds: data });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = CreateRoundSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  const { course_id, tee_colour, hole_count, weather, played_at } = parsed.data;

  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("active_version_id")
    .eq("id", course_id)
    .single();

  if (courseErr || !course?.active_version_id) {
    return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  }

  const { data: round, error: insertErr } = await supabase
    .from("rounds")
    .insert({
      user_id: userData.user.id,
      course_id,
      course_version_id: course.active_version_id,
      played_at: played_at ?? new Date().toISOString().slice(0, 10),
      tee_colour,
      hole_count,
      weather: weather ?? null,
      status: "active",
      data_source: "real",
    })
    .select()
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ round });
}
