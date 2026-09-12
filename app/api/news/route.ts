import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=15", {
      next: { revalidate: 1800 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const articles = (data.results || []).map((item: any) => ({
      title: item.title,
      link: item.url,
      published: item.published_at,
      summary: item.summary,
      image_url: item.image_url,
      news_site: item.news_site,
    }));
    return NextResponse.json({ articles });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, articles: [] }, { status: 500 });
  }
}
