"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import type { Course, TeeColour, HoleCount, Weather } from "@/types";

export default function SetupForm({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [teeColour, setTeeColour] = useState<TeeColour>("yellow");
  const [holeCount, setHoleCount] = useState<HoleCount>(18);
  const [weather, setWeather] = useState<Weather | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    if (!courseId) {
      setError("Pick a course first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          tee_colour: teeColour,
          hole_count: holeCount,
          weather: weather || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to start round");
        setSubmitting(false);
        return;
      }
      router.push(`/round/${json.round.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setSubmitting(false);
    }
  }

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <InputLabel id="course-label">Course</InputLabel>
        <Select
          labelId="course-label"
          label="Course"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          {courses.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
              {c.location ? ` — ${c.location}` : ""}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          Tee
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={teeColour}
          onChange={(_e, v) => v && setTeeColour(v)}
        >
          <ToggleButton value="white">White</ToggleButton>
          <ToggleButton value="yellow">Yellow</ToggleButton>
          <ToggleButton value="red">Red</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          Holes
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={holeCount}
          onChange={(_e, v) => v && setHoleCount(v)}
        >
          <ToggleButton value={9}>9 holes</ToggleButton>
          <ToggleButton value={18}>18 holes</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          Weather
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={weather}
          onChange={(_e, v) => setWeather(v ?? "")}
        >
          <ToggleButton value="sunny">Sunny</ToggleButton>
          <ToggleButton value="windy">Windy</ToggleButton>
          <ToggleButton value="wet">Wet</ToggleButton>
          <ToggleButton value="overcast">Overcast</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={submitting || !courseId}
        onClick={handleStart}
      >
        {submitting ? "Starting…" : "Start Round"}
      </Button>
    </Stack>
  );
}
