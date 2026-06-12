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
  issuances: number;
  retirements: number;
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

    // Initialize map engine with explicit viewport dimension checks
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [10, 10], // Centered globally to view all new nodes
      zoom: 1.8,       // Pulled back slightly for full global perspective
      fadeDuration: 0,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Force map canvas container to calculate 100% bounds on structural load
    mapRef.current.on("load", () => {
      mapRef.current?.resize();
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Sync active markers whenever incoming project properties update
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing marker nodes
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create a bounding box instance to track coordinate geometry
    const bounds = new maplibregl.LngLatBounds();
    let validCoordinatesCount = 0;

    // Inject fresh nodes into the 100% viewport view
    projects.forEach((project) => {
      // Skip placeholders or values failing parsing constraints
      if (isNaN(project.longitude) || isNaN(project.latitude) || (project.longitude === 0 && project.latitude === 0)) return;

      const el = document.createElement("div");
      el.className = "maplibregl-marker";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid #ffffff"; // Adds a crisp white border around the dot
      
      const isVerra = project.registry === "Verra Registry";
      el.style.backgroundColor = isVerra ? "#818cf8" : "#fbbf24";
      el.style.cursor = "pointer";

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="
          background-color: #0b1117 !important; 
          color: #f4f4f5 !important; 
          font-family: monospace; 
          font-size: 11px; 
          padding: 4px;
          border-radius: 4px;
        ">
          <strong style="color: ${isVerra ? "#818cf8" : "#fbbf24"}; font-size: 12px;">
            [${project.id}]
          </strong><br/>
          <div style="font-size: 13px; font-weight: bold; margin-top: 4px; margin-bottom: 4px; color: #ffffff !important;">
            ${project.name}
          </div>
          <span style="color: #a1a1aa !important;">Country: ${project.country}</span><br/>
          <span style="color: #34d399 !important; font-weight: bold;">Issuances: ${(project.issuances / 1000000).toFixed(1)}M t</span>
        </div>
      `);
      
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([project.longitude, project.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);

      // Extend boundaries dynamically
      bounds.extend([project.longitude, project.latitude]);
      validCoordinatesCount++;
    });

    // DYNAMIC VIEWPORT RESIZING: Pans map canvas automatically to center all parsed dots
    if (validCoordinatesCount > 0) {
      mapRef.current.fitBounds(bounds,{
        padding: 60,         // Margin padding so pins don't hit edge bounds
        maxZoom: 3.5,        // Restricts view from zooming in too tight on isolated pins
        duration: 800        // Linear smooth pan animation time metric
      });
    }
  }, [projects]);

  return (
    <div 
      ref={mapContainerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ minHeight: "100%", minWidth: "100%" }}
    />
  );
}