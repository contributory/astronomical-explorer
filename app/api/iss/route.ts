import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544", {
      next: { revalidate: 10 },
      headers: { "User-Agent": "cosmic-explorer-next/1.0" },
    });
    if (!res.ok) throw new Error(`ISS API ${res.status}`);
    const data = await res.json();
    return NextResponse.json({
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      altitude: Math.round(Number(data.altitude) * 100) / 100,
      velocity: Math.round(Number(data.velocity) * 100) / 100,
      visibility: data.visibility ?? "unknown",
      timestamp: data.timestamp,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
