import { NextRequest, NextResponse } from "next/server";

// NASA EONET v3 — Earth Observatory Natural Event Tracker (no key required)
// Docs: https://eonet.gsfc.nasa.gov/docs/v3
const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category"); // e.g. wildfires, volcanoes, severeStorms, seaLakeIce ...
  const status = searchParams.get("status") || "open";
  const limit = Math.min(Number(searchParams.get("limit") || 50), 200);
  const days = searchParams.get("days"); // optional

  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (status) qs.set("status", status);
  if (limit) qs.set("limit", String(limit));
  if (days) qs.set("days", days);

  const url = `${EONET_BASE}/events${qs.toString() ? `?${qs.toString()}` : ""}`;
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `EONET ${res.status}: ${txt.slice(0, 400)}` }, { status: res.status });
    }
    const data = await res.json();
    // also fetch categories for filter UI (cache separately, but inline for single fetch)
    return NextResponse.json({
      title: data.title,
      description: data.description,
      count: data.events?.length ?? 0,
      events: (data.events || []).map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        description: ev.description,
        link: ev.link,
        categories: ev.categories,
        sources: ev.sources,
        geometry: ev.geometry,
        closed: ev.closed ?? null,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "EONET error" }, { status: 500 });
  }
}
