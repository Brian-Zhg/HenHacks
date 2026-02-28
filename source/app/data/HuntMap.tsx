"use client";

import { useEffect, useRef, useState } from "react";
import { Hunt } from "@/data/hunts";

interface MapProps {
  hunts: Hunt[];
  selectedHunt?: Hunt | null;
  onHuntSelect?: (hunt: Hunt) => void;
  completedHuntIds?: string[];
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export default function HuntMap({
  hunts,
  selectedHunt,
  onHuntSelect,
  completedHuntIds = [],
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.006 }, // NYC center
      zoom: 12,
      styles: mapStyles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add markers
    markersRef.current = hunts.map((hunt) => {
      const isCompleted = completedHuntIds.includes(hunt.id);

      const marker = new window.google.maps.Marker({
        position: hunt.coordinates,
        map: mapInstanceRef.current!,
        title: hunt.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: isCompleted ? "#22c55e" : "#f97316",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        animation: window.google.maps.Animation.DROP,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
            <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: bold;">${hunt.title}</h3>
            <p style="margin: 0 0 4px; font-size: 12px; color: #666;">${hunt.borough}</p>
            <span style="
              display: inline-block;
              background: ${isCompleted ? "#22c55e" : "#f97316"};
              color: white;
              font-size: 11px;
              padding: 2px 8px;
              border-radius: 999px;
            ">${isCompleted ? "✓ Completed" : `${hunt.points} pts`}</span>
          </div>
        `,
      });

      marker.addListener("click", () => {
        // Close all other info windows
        markersRef.current.forEach((m) =>
          (m as any)._infoWindow?.close()
        );
        infoWindow.open(mapInstanceRef.current!, marker);
        (marker as any)._infoWindow = infoWindow;
        onHuntSelect?.(hunt);
      });

      (marker as any)._infoWindow = infoWindow;
      return marker;
    });
  }, [mapLoaded, hunts, completedHuntIds]);

  // Pan to selected hunt
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedHunt) return;
    mapInstanceRef.current.panTo(selectedHunt.coordinates);
    mapInstanceRef.current.setZoom(15);
  }, [selectedHunt]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

// Dark map style
const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2d2d44" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3d3d5c" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0e1626" }],
  },
];