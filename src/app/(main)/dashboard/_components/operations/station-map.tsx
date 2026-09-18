"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";

import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";

import type { StationSnapshot } from "@/app/(main)/dashboard/stations/_components/types";
import { cn } from "@/lib/utils";

import { stationStatus } from "./station-status";

type Leaflet = typeof import("leaflet");

interface StationMapProps {
  stations: StationSnapshot[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  /** Overview mode: no zoom control, wheel zoom off, tighter fit. */
  compact?: boolean;
}

// Esri's light-gray canvas needs no API key; the reference layer adds town labels on top.
const TILES_BASE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const TILES_LABELS =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}";
const ATTRIBUTION = "Tiles &copy; Esri";
const BOSTON: [number, number] = [42.36, -71.12];

function markerHtml(s: StationSnapshot, selected: boolean): string {
  const st = stationStatus(s);
  const classes = ["st-marker"];
  if (selected) classes.push("st-marker--selected");
  if (st.key === "charging") classes.push("st-marker--pulse");
  return `<span class="${classes.join(" ")}" style="--st:${st.color}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg></span>`;
}

/**
 * Leaflet map of the fleet over greater Boston. Markers carry the station status in their ring
 * (charging pulses), the selected one is enlarged with a gold ring, and a click reports the id up.
 * The map is created once per mount; markers are updated in place on every fleet read.
 */
export function StationMap({ stations, selectedId, onSelect, className, compact = false }: StationMapProps) {
  const host = useRef<HTMLDivElement>(null);
  const leaflet = useRef<Leaflet | null>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const markers = useRef<Map<string, Marker>>(new Map());
  const fitted = useRef(false);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !host.current) return;
      leaflet.current = L;
      const m = L.map(el, {
        zoomControl: !compact,
        scrollWheelZoom: !compact,
        attributionControl: true,
        zoomSnap: 0.5,
      });
      L.tileLayer(TILES_BASE, { attribution: ATTRIBUTION, maxZoom: 16 }).addTo(m);
      L.tileLayer(TILES_LABELS, { maxZoom: 16, pane: "overlayPane" }).addTo(m);
      m.setView(BOSTON, compact ? 9 : 9.5);
      layer.current = L.layerGroup().addTo(m);
      map.current = m;
      setReady(true);
    });
    const ro = new ResizeObserver(() => map.current?.invalidateSize());
    ro.observe(el);
    return () => {
      cancelled = true;
      ro.disconnect();
      map.current?.remove();
      map.current = null;
      layer.current = null;
      markers.current.clear();
      fitted.current = false;
      setReady(false);
    };
  }, [compact]);

  useEffect(() => {
    const L = leaflet.current;
    const m = map.current;
    const g = layer.current;
    if (!ready || !L || !m || !g) return;
    const seen = new Set<string>();
    for (const s of stations) {
      seen.add(s.id);
      const selected = s.id === selectedId;
      const icon = L.divIcon({
        className: "st-marker-wrap",
        html: markerHtml(s, selected),
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      let mk = markers.current.get(s.id);
      if (!mk) {
        mk = L.marker([s.lat, s.lng], { icon, title: s.name, keyboard: true, riseOnHover: true }).addTo(g);
        mk.bindTooltip(s.name, { direction: "top", offset: [0, -16], opacity: 0.95 });
        mk.on("click", () => onSelectRef.current?.(s.id));
        markers.current.set(s.id, mk);
      } else {
        mk.setIcon(icon);
        mk.setLatLng([s.lat, s.lng]);
      }
      mk.setZIndexOffset(selected ? 1000 : 0);
    }
    for (const [id, mk] of markers.current) {
      if (!seen.has(id)) {
        mk.remove();
        markers.current.delete(id);
      }
    }
    if (!fitted.current && stations.length) {
      const bounds = L.latLngBounds(stations.map((s) => [s.lat, s.lng] as [number, number]));
      m.fitBounds(bounds, { padding: compact ? [24, 24] : [40, 40], maxZoom: 11 });
      fitted.current = true;
    }
  }, [stations, selectedId, ready, compact]);

  return (
    <div
      ref={host}
      role="application"
      aria-label="Map of SuryaTech stations across greater Boston"
      className={cn("isolate h-full w-full overflow-hidden rounded-xl bg-muted", className)}
    />
  );
}
