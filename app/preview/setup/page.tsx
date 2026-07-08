import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SetupForm from "@/app/setup/SetupForm";
import { MOCK_COURSE } from "@/lib/mockData";

export default function PreviewSetup() {
  return (
    <Box sx={{ minHeight: "100dvh", py: 4 }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Start a Round
          </Typography>
          <SetupForm courses={[MOCK_COURSE]} />
        </Stack>
      </Container>
    </Box>
  );
}
