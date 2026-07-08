import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

export default function PreviewHomeNoRound() {
  return (
    <Box sx={{ minHeight: "100dvh" }}>
      <Box sx={{ px: 2, pt: 3 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "rgba(60,60,67,0.60)",
            mb: 0.5,
          }}
        >
          ste.mcintosh@gmail.com
        </Typography>
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
          FairwayIQ
        </Typography>
      </Box>

      <Box sx={{ px: 2, pt: 3 }}>
        <Card>
          <Box sx={{ p: 2.5 }}>
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "rgba(60,60,67,0.60)",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Ready to play
            </Typography>
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: "1.375rem",
                fontWeight: 700,
                letterSpacing: "-0.018em",
                color: "#000",
                mb: 2,
              }}
            >
              Start a new round
            </Typography>
            <Link href="/preview/setup" style={{ textDecoration: "none" }}>
              <Button fullWidth variant="contained" size="large">
                Start a Round
              </Button>
            </Link>
          </Box>
        </Card>
      </Box>

      <Box sx={{ px: 2, pt: 2 }}>
        <Link href="/preview/rounds" style={{ textDecoration: "none" }}>
          <Button fullWidth variant="outlined" size="large">
            View Round History
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
