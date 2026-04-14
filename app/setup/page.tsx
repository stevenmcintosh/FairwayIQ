import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SetupForm from "./SetupForm";
import type { Course } from "@/types";

export default async function SetupPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, location, country, active_version_id, created_at")
    .order("name", { ascending: true });

  return (
    <Box sx={{ minHeight: "100dvh", py: 4 }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Start a Round
          </Typography>
          <SetupForm courses={(courses ?? []) as Course[]} />
        </Stack>
      </Container>
    </Box>
  );
}
