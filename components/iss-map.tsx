"use client";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const issIcon = L.divIcon({
  html: `<div style="width:36px;height:36px;border-radius:999px;background:linear-gradient(135deg,#38BDF8,#6366F1);display:grid;place-items:center;border:2px solid white;box-shadow:0 6px 20px rgba(56,189,248,0.5);font-size:16px">🛰️</div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function ISSMap({ lat, lon, alt, velocity }: { lat: number; lon: number; alt: number; velocity: number }) {
  // fix leaflet default icon issue on client
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer center={[lat, lon]} zoom={3} scrollWheelZoom style={{ height: 400, width: "100%" }} key={`${lat}-${lon}`}>
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <CircleMarker center={[lat, lon]} radius={18} pathOptions={{ color: "#38BDF8", fillColor: "#38BDF8", fillOpacity: 0.15, weight: 1 }} />
      <Marker position={[lat, lon]} icon={issIcon}>
        <Popup>
          <div style={{ fontSize: 12, lineHeight: 1.4 }}>
            <b>ISS</b> — {alt.toFixed(1)} km • {velocity.toFixed(0)} km/h<br />
            {lat.toFixed(4)}, {lon.toFixed(4)}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
