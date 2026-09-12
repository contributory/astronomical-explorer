import { NextRequest, NextResponse } from "next/server";

// The Space Devs — Launch Library 2 (free, no key required)
// Docs: https://thespacedevs.com/llapi
// Endpoint: https://ll.thespacedevs.com/2.2.0/launch/?limit=20&ordering=-net

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "upcoming"; // upcoming | previous
  const limit = Math.min(Number(searchParams.get("limit") || 12), 50);
  const offset = Number(searchParams.get("offset") || 0);
  const search = searchParams.get("search") || "";

  const base =
    mode === "previous"
      ? "https://ll.thespacedevs.com/2.2.0/launch/previous/"
      : "https://ll.thespacedevs.com/2.2.0/launch/upcoming/";

  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  qs.set("offset", String(offset));
  qs.set("ordering", mode === "previous" ? "-net" : "net");
  if (search) qs.set("search", search);

  const url = `${base}?${qs.toString()}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: mode === "previous" ? 3600 : 300 },
      headers: { "User-Agent": "cosmic-explorer-next/1.0" },
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `Launches ${res.status}: ${txt.slice(0, 400)}` }, { status: res.status });
    }
    const data = await res.json();
    const launches = (data.results || []).map((l: any) => ({
      id: l.id,
      url: l.url,
      slug: l.slug,
      name: l.name,
      status: l.status, // { id, name, abbrev, description }
      net: l.net, // launch window
      window_start: l.window_start,
      window_end: l.window_end,
      image: l.image,
      infographic: l.infographic,
      webcast_live: l.webcast_live,
      rocket: l.rocket, // { configuration: { name, family, full_name, variant } }
      mission: l.mission, // { name, description, type, orbit }
      launch_service_provider: l.launch_service_provider,
      pad: l.pad, // { name, location: { name, country_code } }
      vidURLs: l.vidURLs,
      infoURLs: l.infoURLs,
    }));
    return NextResponse.json({ count: data.count, next: data.next, previous: data.previous, mode, launches });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Launches error" }, { status: 500 });
  }
}
