import { NextRequest, NextResponse } from "next/server";

// NASA Image and Video Library — https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
// No key required, public search
const NASA_IMG_BASE = "https://images-api.nasa.gov";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "galaxy";
  const media = searchParams.get("media_type") || "image"; // image | video | audio
  const year_start = searchParams.get("year_start");
  const year_end = searchParams.get("year_end");
  const page = searchParams.get("page") || "1";

  const qs = new URLSearchParams();
  qs.set("q", q);
  qs.set("media_type", media);
  qs.set("page", page);
  if (year_start) qs.set("year_start", year_start);
  if (year_end) qs.set("year_end", year_end);

  const url = `${NASA_IMG_BASE}/search?${qs.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `NASA Images ${res.status}: ${txt.slice(0, 400)}` }, { status: res.status });
    }
    const data = await res.json();
    const items = (data.collection?.items || []).slice(0, 24).map((it: any) => {
      const d = it.data?.[0];
      const link = it.links?.[0];
      return {
        nasa_id: d?.nasa_id,
        title: d?.title,
        description: d?.description,
        keywords: d?.keywords || [],
        date_created: d?.date_created,
        center: d?.center,
        media_type: d?.media_type,
        href: it.href, // asset manifest
        preview: link?.href || null,
      };
    });
    return NextResponse.json({
      q,
      media_type: media,
      page: Number(page),
      total_hits: data.collection?.metadata?.total_hits ?? items.length,
      items,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "NASA Images error" }, { status: 500 });
  }
}
