"use client";

import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { Hole, HoleScore, Round } from "@/types";

type Props = {
  round: Round;
  holes: Hole[];
  scores: HoleScore[];
  parForTee: (hole: Hole) => number;
};

export default function RoundSummary({ round, holes, scores, parForTee }: Props) {
  const totalPar = holes.reduce((sum, h) => sum + parForTee(h), 0);
  const totalStrokes = scores.reduce((sum, s) => sum + (s.strokes ?? 0), 0);
  const vsPar = totalStrokes - totalPar;

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Round complete
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" spacing={4} sx={{ justifyContent: "space-around" }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Total
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {totalStrokes}
              </Typography>
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Par
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {totalPar}
              </Typography>
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                vs Par
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: vsPar > 0 ? "error.main" : vsPar < 0 ? "success.main" : "text.primary" }}
              >
                {vsPar > 0 ? `+${vsPar}` : vsPar}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ px: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Hole</TableCell>
                <TableCell align="right">Par</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Putts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holes.map((h) => {
                const s = scores.find((sc) => sc.hole_number === h.hole_number);
                const par = parForTee(h);
                return (
                  <TableRow key={h.id}>
                    <TableCell>{h.hole_number}</TableCell>
                    <TableCell>{h.name}</TableCell>
                    <TableCell align="right">{par}</TableCell>
                    <TableCell align="right">
                      {s?.hole_status === "skipped"
                        ? "—"
                        : s?.hole_status === "picked_up"
                          ? `${s.strokes ?? "—"}*`
                          : (s?.strokes ?? "—")}
                    </TableCell>
                    <TableCell align="right">{s?.putts ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        * = picked up · played {round.hole_count} holes from {round.tee_colour} tees
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button fullWidth variant="outlined" component={Link} href="/rounds">
          View history
        </Button>
        <Button fullWidth variant="contained" component={Link} href="/setup">
          New round
        </Button>
      </Stack>
    </Stack>
  );
}
