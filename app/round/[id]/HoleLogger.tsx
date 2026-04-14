"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import type {
  FairwayDirection,
  Hole,
  HoleScore,
  PenaltyType,
} from "@/types";

type Props = {
  hole: Hole;
  par: number;
  roundId: string;
  existing: HoleScore | null;
  onCancel: () => void;
  onPickUp: () => void;
  onSaved: (payload: Omit<HoleScore, "id" | "created_at">) => Promise<void>;
};

function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 15,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <IconButton
          size="large"
          onClick={() => onChange(Math.max(min, value - 1))}
          sx={{ minWidth: 48, minHeight: 48, border: "1px solid", borderColor: "divider" }}
        >
          −
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700, minWidth: 48, textAlign: "center" }}>
          {value}
        </Typography>
        <IconButton
          size="large"
          onClick={() => onChange(Math.min(max, value + 1))}
          sx={{ minWidth: 48, minHeight: 48, border: "1px solid", borderColor: "divider" }}
        >
          +
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default function HoleLogger({
  hole,
  par,
  roundId,
  existing,
  onCancel,
  onPickUp,
  onSaved,
}: Props) {
  const [strokes, setStrokes] = useState(existing?.strokes ?? par);
  const [putts, setPutts] = useState(existing?.putts ?? 2);
  const [fairway, setFairway] = useState<FairwayDirection | null>(
    existing?.fairway_direction ?? null,
  );
  const [gir, setGir] = useState<boolean>(existing?.green_in_reg ?? false);
  const [penalties, setPenalties] = useState(existing?.penalties ?? 0);
  const [penaltyType, setPenaltyType] = useState<PenaltyType | null>(
    existing?.penalty_type ?? null,
  );
  const [chipIns, setChipIns] = useState(existing?.chip_ins ?? 0);
  const [sandSave, setSandSave] = useState<boolean>(existing?.sand_save ?? false);
  const [saving, setSaving] = useState(false);

  const isPar3 = par === 3;

  async function handleSave() {
    setSaving(true);
    try {
      await onSaved({
        round_id: roundId,
        hole_id: hole.id,
        hole_number: hole.hole_number,
        strokes,
        putts,
        fairway_direction: isPar3 ? null : fairway,
        green_in_reg: gir,
        penalties,
        penalty_type: penalties > 0 ? penaltyType : null,
        chip_ins: chipIns,
        sand_save: sandSave,
        hole_status: "complete",
        notes: null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {hole.name ?? `Hole ${hole.hole_number}`}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Par {par}
            </Typography>
          </Stack>

          <Stepper label="Strokes" value={strokes} onChange={setStrokes} min={1} max={15} />
          <Stepper label="Putts" value={putts} onChange={setPutts} min={0} max={10} />

          {!isPar3 && (
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Fairway
              </Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={fairway}
                onChange={(_e, v) => setFairway(v)}
              >
                <ToggleButton value="left">Left</ToggleButton>
                <ToggleButton value="centre">Fairway</ToggleButton>
                <ToggleButton value="right">Right</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}

          <FormControlLabel
            control={<Switch checked={gir} onChange={(_e, v) => setGir(v)} />}
            label="Green in regulation"
          />

          <Divider />

          <Stepper label="Penalties" value={penalties} onChange={setPenalties} min={0} max={5} />
          {penalties > 0 && (
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Penalty type
              </Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={penaltyType}
                onChange={(_e, v) => setPenaltyType(v)}
              >
                <ToggleButton value="ob">OB</ToggleButton>
                <ToggleButton value="water">Water</ToggleButton>
                <ToggleButton value="unplayable">Unplayable</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}

          <Stepper label="Chip-ins" value={chipIns} onChange={setChipIns} min={0} max={3} />

          <FormControlLabel
            control={<Switch checked={sandSave} onChange={(_e, v) => setSandSave(v)} />}
            label="Sand save"
          />

          <Divider />

          <Stack direction="row" spacing={2}>
            <Button fullWidth variant="outlined" size="large" onClick={onCancel}>
              Back
            </Button>
            <Button fullWidth variant="contained" size="large" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </Stack>
          <Button size="small" onClick={onPickUp} sx={{ color: "text.secondary" }}>
            Pick up this hole
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
