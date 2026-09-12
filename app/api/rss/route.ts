import { NextRequest, NextResponse } from "next/server";

const FEEDS: Record<string, string> = {
  "Space.com": "https://www.space.com/feeds/all",
  "NASA News": "https://www.nasa.gov/news-release/feed/",
  "SciTechDaily Space": "https://scitechdaily.com/news/space/feed/",
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseRSS(xml: string) {
  const items: any[] = [];
  const entryRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = entryRegex.exec(xml)) !== null) {
    const block = m[1];
    const get = (tag: string) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
      const mm = block.match(r);
      if (!mm) return "";
      let v = mm[1].trim();
      v = v.replace("<![CDATA[", "").replace("]]>", "");
      return v.trim();
    };
    const title = get("title") || "Untitled";
    const link = get("link") || "#";
    const pubDate = get("pubDate") || get("published") || get("updated") || "";
    const desc = get("description") || get("summary") || "";
    items.push({
      title,
      link,
      published: pubDate,
      summary: stripHtml(desc).slice(0, 280),
    });
  }
  // Atom fallback
  if (items.length === 0) {
    const atomRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let mm;
    while ((mm = atomRegex.exec(xml)) !== null) {
      const block = mm[1];
      const get = (tag: string) => {
        const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
        const res = block.match(r);
        return res ? res[1].replace("<![CDATA[", "").replace("]]>", "").trim() : "";
      };
      const title = get("title") || "Untitled";
      let link = "#";
      const linkMatch = block.match(/<link[^>]*href="([^"]+)"[^>]*>/i);
      if (linkMatch) link = linkMatch[1];
      else link = get("link") || "#";
      const pubDate = get("published") || get("updated") || "";
      const desc = get("summary") || get("content") || "";
      items.push({ title, link, published: pubDate, summary: stripHtml(desc).slice(0, 280) });
    }
  }
  return items;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source") || "Space.com";
  const url = FEEDS[source] || FEEDS["Space.com"];
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "cosmic-explorer-next/1.0" },
    });
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    const articles = parseRSS(xml);
    return NextResponse.json({ source, url, articles });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, articles: [] }, { status: 500 });
  }
}
