import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const HoleScoreSchema = z.object({
  round_id: z.string().uuid(),
  hole_id: z.string().uuid(),
  hole_number: z.number().int().min(1).max(18),
  strokes: z.number().int().min(1).max(20).nullable().optional(),
  putts: z.number().int().min(0).max(10).nullable().optional(),
  fairway_direction: z.enum(["left", "centre", "right"]).nullable().optional(),
  green_in_reg: z.boolean().nullable().optional(),
  penalties: z.number().int().min(0).max(5).optional(),
  penalty_type: z.enum(["ob", "water", "unplayable"]).nullable().optional(),
  chip_ins: z.number().int().min(0).max(5).optional(),
  sand_save: z.boolean().nullable().optional(),
  hole_status: z.enum(["complete", "skipped", "picked_up"]).optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = HoleScoreSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  const payload = {
    ...parsed.data,
    penalties: parsed.data.penalties ?? 0,
    chip_ins: parsed.data.chip_ins ?? 0,
    hole_status: parsed.data.hole_status ?? "complete",
  };

  const { data, error } = await supabase
    .from("hole_scores")
    .upsert(payload, { onConflict: "round_id,hole_number" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hole_score: data });
}
