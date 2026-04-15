"use client";

import { useEffect, useState } from "react";
import type { LatLng } from "@/types";

export type GeoStatus = "idle" | "prompt" | "granted" | "denied" | "unsupported" | "error";

export type GeoState = {
  status: GeoStatus;
  coords: LatLng | null;
  accuracy: number | null;
  error: string | null;
};

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>({
    status: "idle",
    coords: null,
    accuracy: null,
    error: null,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState((s) => ({ ...s, status: "unsupported" }));
      return;
    }

    let watchId: number | null = null;
    setState((s) => ({ ...s, status: "prompt" }));

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          status: "granted",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracy: pos.coords.accuracy,
          error: null,
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          status: err.code === err.PERMISSION_DENIED ? "denied" : "error",
          error: err.message,
        }));
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
