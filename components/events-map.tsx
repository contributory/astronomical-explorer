"use client";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function EventsMap({
  points,
  selectedId,
  onSelect,
}: {
  points: { id: string; title: string; lat: number; lon: number; cat: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const center: [number, number] = points.length
    ? [points[Math.floor(points.length / 2)].lat, points[Math.floor(points.length / 2)].lon]
    : [15, 30];

  return (
    <MapContainer center={center} zoom={2} scrollWheelZoom style={{ height: 360, width: "100%" }}>
      <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      {points.map((p) => {
        const isSel = p.id === selectedId;
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lon]}
            radius={isSel ? 9 : 6}
            pathOptions={{
              color: isSel ? "#F59E0B" : "#38BDF8",
              fillColor: isSel ? "#F59E0B" : "#38BDF8",
              fillOpacity: isSel ? 0.95 : 0.6,
              weight: 2,
            }}
            eventHandlers={{ click: () => onSelect(p.id) }}
          >
            <Tooltip>{p.title} • {p.cat}</Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
