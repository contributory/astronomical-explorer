import { NextRequest, NextResponse } from "next/server";
import { getNasaKey } from "@/lib/env";

const EPIC_BASE = "https://api.nasa.gov/EPIC/api";

// EPIC natural & enhanced + archive image URL builder
// Docs: https://api.nasa.gov/#epic
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") === "enhanced" ? "enhanced" : "natural";
  const date = searchParams.get("date"); // YYYY-MM-DD — if omitted, returns latest
  const apiKey = getNasaKey();

  // EPIC endpoint: /EPIC/api/natural?api_key=...  or  /natural/date/YYYY-MM-DD
  let url: string;
  if (date) {
    url = `${EPIC_BASE}/${kind}/date/${date}?api_key=${apiKey}`;
  } else {
    url = `${EPIC_BASE}/${kind}?api_key=${apiKey}`;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 21600 } }); // 6h
    if (!res.ok) {
      if (res.status === 429) {
        // Return a fallback EPIC image instead of 429 so the UI still shows something
        const fallbackDate = date || new Date().toISOString().slice(0, 10);
        const [y, m, day] = fallbackDate.split("-");
        const base = `https://epic.gsfc.nasa.gov/archive/${kind}/${y}/${m}/${day}/png`;
        const fallbackImages = [
          {
            identifier: "20241001_000000",
            caption: "EPIC demo — Earth seen from DSCOVR (fallback due to rate limit)",
            image: "epic_1b_20241001000000",
            date: `${fallbackDate} 00:00:00`,
            centroid_coordinates: { lat: 0, lon: 0 },
            image_url: "https://epic.gsfc.nasa.gov/archive/natural/2015/10/31/png/epic_1b_20151031074844.png",
            thumb_url: "https://epic.gsfc.nasa.gov/archive/natural/2015/10/31/thumbs/epic_1b_20151031074844.jpg",
          },
        ];
        return NextResponse.json({ kind, date: fallbackDate, count: fallbackImages.length, images: fallbackImages, fallback: true, demo: true });
      }
      const txt = await res.text();
      return NextResponse.json({ error: `EPIC ${res.status}: ${txt.slice(0, 400)}` }, { status: res.status });
    }
    const data = await res.json();
    // enrich with image URLs (EPIC archive pattern)
    const enriched = (data as any[]).map((item) => {
      const d = (item.date as string)?.slice(0, 10) || date || "";
      const [y, m, day] = d.split("-");
      const archiveBase = `https://epic.gsfc.nasa.gov/archive/${kind}/${y}/${m}/${day}/png`;
      return {
        identifier: item.identifier,
        caption: item.caption,
        image: item.image,
        date: item.date,
        centroid_coordinates: item.centroid_coordinates,
        dscovr_j2000_position: item.dscovr_j2000_position,
        image_url: item.image ? `${archiveBase}/${item.image}.png` : null,
        thumb_url: item.image ? `${archiveBase}/thumbs/${item.image}.jpg` : null,
      };
    });
    return NextResponse.json({ kind, date: date || "latest", count: enriched.length, images: enriched });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "EPIC fetch error" }, { status: 500 });
  }
}
