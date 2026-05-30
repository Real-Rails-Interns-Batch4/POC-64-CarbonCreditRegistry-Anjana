"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface Project {
  id: string;
  name: string;
  registry: string;
  status: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  projects: Project[];
}

export default function MapComponent({ projects }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre GL using a stable, high-performance dark vector style
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [20, 15], // Strategic global coordinates to center the viewer layout
      zoom: 1.6,
      fadeDuration: 0, // Prevents layout flashing on updates
    });

    // Add standard navigation anchor elements (+/- zoom buttons)
    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Force an immediate width/height layout calculation on canvas load
    mapRef.current.on("load", () => {
      mapRef.current?.resize();
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Update data markers instantly whenever the filtered project array updates
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous operational data nodes
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Map out the coordinates from the FastAPI data layer stream
    projects.forEach((project) => {
      if (!project.latitude || !project.longitude) return;

      // Real Rails cyan/indigo/amber data pulse color mappings
      const markerColor = project.registry === "Verra" ? "#818cf8" : "#fbbf24";

      // Create a clean data dot matching the high-density asset design
      const el = document.createElement("div");
      el.className = "w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-125 relative";
      el.style.backgroundColor = markerColor;
      el.style.boxShadow = `0 0 10px ${markerColor}`;

      // Build a minimal monospace tooltip popup box
      const popupHtml = `
        <div style="background-color: #0b1117; color: #f4f4f5; font-family: monospace; font-size: 11px; padding: 10px; border: 1px solid #1f2937; border-radius: 4px; max-width: 220px;">
          <div style="font-weight: bold; color: ${markerColor}; margin-bottom: 3px;">[${project.id}]</div>
          <div style="font-weight: 600; margin-bottom: 4px; line-height: 1.2;">${project.name}</div>
          <div style="color: #9ca3af; margin-top: 4px;">Region: ${project.country}</div>
          <div style="color: #6b7280; font-size: 10px; margin-top: 2px;">Status: ${project.status}</div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 10,
        closeButton: false,
      }).setHTML(popupHtml);

      // Lock down marker to its geographic projection parameters
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([project.longitude, project.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [projects]);

  return (
    <div 
      ref={mapContainerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ height: "100%", width: "100%" }}
    />
  );
}