import { NextRequest, NextResponse } from "next/server";
import { getNasaKey } from "@/lib/env";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const apiKey = getNasaKey();
  const today = new Date().toISOString().slice(0,10);
  const useDate = date || today;

  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}${date ? `&date=${date}` : ""}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    if (res.status === 429 || res.status === 404) {
      const fallback = {
        title: "M31: The Andromeda Galaxy",
        date: useDate,
        copyright: "Subaru Telescope (NAOJ)",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2108/M31_Subaru_1080.jpg",
        hdurl: "https://apod.nasa.gov/apod/image/2108/M31_Subaru_3422.jpg",
        explanation:
          "The Andromeda Galaxy (M31) is the largest spiral galaxy closest to our Solar System, located about 2.5 million light-years from Earth. This image captures the intricate cosmic dust structure and billions of stars in our nearest galactic neighbor.",
        _fallback: true,
        _reason: res.status === 429 ? "rate_limited" : "future_or_missing_date",
      };
      return NextResponse.json(fallback);
    }
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.msg || err.error?.message || `API error ${res.status}` }, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Connection error" }, { status: 500 });
  }
}
