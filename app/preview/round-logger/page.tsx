import RoundClient from "@/app/round/[id]/RoundClient";
import { buildHoleInsights } from "@/lib/holeInsights";
import { MOCK_HOLES, MOCK_ROUND_ACTIVE, MOCK_SCORES_PARTIAL } from "@/lib/mockData";

export default function PreviewRoundLogger() {
  const insights = buildHoleInsights(MOCK_HOLES, [], "yellow");
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null;

  return (
    <RoundClient
      init={{ round: MOCK_ROUND_ACTIVE, holes: MOCK_HOLES, scores: MOCK_SCORES_PARTIAL }}
      insights={insights}
      mapsApiKey={mapsApiKey}
    />
  );
}
