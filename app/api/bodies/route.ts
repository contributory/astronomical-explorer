import { NextRequest, NextResponse } from "next/server";

// le-systeme-solaire.net — REST API for planets, moons, asteroids… (no key required)
// Docs: https://api.le-systeme-solaire.net/en/
const BASE = "https://api.le-systeme-solaire.net/rest";

function authHeaders(): Record<string, string> {
  const k = process.env.SOLAR_SYSTEM_API_KEY?.trim() || process.env.BODIES_API_KEY?.trim();
  if (k) return { Authorization: `Bearer ${k}` };
  return {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // e.g. earth, mars, jupiter
  const filter = searchParams.get("filter"); // e.g. isPlanet,eq,true

  try {
    let url: string;
    if (id) {
      url = `${BASE}/bodies/${encodeURIComponent(id)}`;
    } else if (filter) {
      url = `${BASE}/bodies?filter[]=${encodeURIComponent(filter)}`;
    } else {
      // default: planets only
      url = `${BASE}/bodies?filter[]=isPlanet,eq,true`;
    }
    const res = await fetch(url, { next: { revalidate: 86400 }, headers: { ...authHeaders() } });
    if (!res.ok) {
      // Fallback for environments without BODIES_API_KEY
      if (res.status === 401 || res.status === 403) {
        const { FALLBACK_PLANETS } = await import("@/lib/bodies-fallback");
        if (id) {
          const one = FALLBACK_PLANETS.find((p: any) => p.id === id || p.englishName?.toLowerCase() === id.toLowerCase());
          if (one) return NextResponse.json(one);
        }
        // filter isPlanet fallback
        return NextResponse.json({ bodies: FALLBACK_PLANETS });
      }
      const txt = await res.text();
      return NextResponse.json({ error: `Bodies ${res.status}: ${txt.slice(0, 400)}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    // network error → fallback planets
    try {
      const { FALLBACK_PLANETS } = await import("@/lib/bodies-fallback");
      return NextResponse.json({ bodies: FALLBACK_PLANETS, fallback: true });
    } catch {}
    return NextResponse.json({ error: e.message || "Bodies error" }, { status: 500 });
  }
}
