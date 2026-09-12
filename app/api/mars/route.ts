import { NextRequest, NextResponse } from "next/server";

const MARS_API: Record<string, string> = {
  perseverance: "https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json",
  curiosity: "https://mars.nasa.gov/rss/api/?feed=raw_images&category=msl&feedtype=json",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rover = (searchParams.get("rover") || "perseverance").toLowerCase();
  const num = Number(searchParams.get("num") || 18);
  const base = MARS_API[rover] || MARS_API.perseverance;
  const url = `${base}&num=${num}&page=0`;
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const images = (data.images || []).map((img: any) => ({
      id: img.imageid,
      img_src: img.image_files?.medium || img.image_files?.full_res,
      title: img.title || "Mars surface image",
      camera: img.camera?.full_name || img.camera?.instrument || "—",
      sol: img.sol,
      date_taken: img.date_taken ? String(img.date_taken).slice(0, 10) : "N/A",
    }));
    return NextResponse.json({ rover, count: images.length, photos: images });
  } catch (e: any) {
    const fallback = [
      { id: "1", img_src: "https://mars.nasa.gov/system/resources/detail_files/25609_PIA23723-web.jpg", title: "Perseverance Rover on Mars Surface", camera: "NAVCAM", sol: 100, date_taken: "2021-06-01" },
      { id: "2", img_src: "https://mars.nasa.gov/system/resources/detail_files/25058_PIA23623-1600.jpg", title: "Curiosity Rover Self-Portrait", camera: "MAHLI", sol: 2886, date_taken: "2020-10-25" },
    ];
    return NextResponse.json({ rover, count: fallback.length, photos: fallback, fallback: true, error: e.message });
  }
}
