import { NextResponse } from "next/server";
import { getNasaKey, isDemoKey } from "@/lib/env";

export async function GET() {
  const key = getNasaKey();
  return NextResponse.json({
    nasaConfigured: !isDemoKey(key),
    // returns status only — never the key value
    nasaDemo: isDemoKey(key),
    apis: {
      nasa: "NASA Open APIs (APOD, NeoWS, EPIC, DONKI)",
      eonet: "NASA EONET — natural events (no key required)",
      launches: "The Space Devs / Launch Library 2 (no key required)",
      bodies: "le-systeme-solaire.net — planetary data (no key required)",
      iss: "WhereTheISS + Open-Notify (no key required)",
      snapi: "Spaceflight News API (no key required)",
    },
  });
}
