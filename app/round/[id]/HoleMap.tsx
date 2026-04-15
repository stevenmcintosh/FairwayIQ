"use client";

import { useEffect, useMemo } from "react";
import {
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import Box from "@mui/material/Box";
import type { LatLng } from "@/types";

type Props = {
  green: LatLng;
  user: LatLng | null;
  accuracy: number | null;
};

const MAP_ID = "fairwayiq-hole-map";

function FitBounds({ green, user }: { green: LatLng; user: LatLng | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.google) return;

    if (!user) {
      map.panTo(green);
      map.setZoom(18);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(green);
    bounds.extend(user);
    map.fitBounds(bounds, { top: 120, right: 60, bottom: 200, left: 60 });
  }, [map, green, user]);

  return null;
}

function UserDot({ position }: { position: LatLng; accuracy: number | null }) {
  return (
    <AdvancedMarker position={position}>
      <Box
        sx={{
          position: "relative",
          width: 22,
          height: 22,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundColor: "#007AFF",
            border: "3px solid #FFFFFF",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.15), 0 2px 8px rgba(0,122,255,0.5)",
          }}
        />
      </Box>
    </AdvancedMarker>
  );
}

export default function HoleMap({ green, user, accuracy }: Props) {
  const initialCenter = useMemo(() => green, [green]);

  return (
    <Map
      mapId={MAP_ID}
      defaultCenter={initialCenter}
      defaultZoom={18}
      mapTypeId="hybrid"
      disableDefaultUI
      gestureHandling="greedy"
      clickableIcons={false}
      tilt={0}
      style={{ width: "100%", height: "100%" }}
    >
      <AdvancedMarker position={green}>
        <Pin background="#34C759" borderColor="#FFFFFF" glyphColor="#FFFFFF" scale={1.1} />
      </AdvancedMarker>
      {user && <UserDot position={user} accuracy={accuracy} />}
      <FitBounds green={green} user={user} />
    </Map>
  );
}
