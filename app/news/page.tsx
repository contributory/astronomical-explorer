"use client";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Newspaper, Rss, Search, ExternalLink, Loader2, Clock, Radio } from "lucide-react";

type Snapi = { title: string; link: string; published: string; summary: string; image_url?: string; news_site: string };
type RssItem = { title: string; link: string; published: string; summary: string };

export default function NewsPage() {
  const { lang } = useApp();
  const [tab, setTab] = useState<"snapi" | "rss">("snapi");
  const [snapi, setSnapi] = useState<Snapi[]>([]);
  const [snapiQ, setSnapiQ] = useState("");
  const [rss, setRss] = useState<RssItem[]>([]);
  const [rssSource, setRssSource] = useState("Space.com");
  const [loadingSnapi, setLoadingSnapi] = useState(true);
  const [loadingRss, setLoadingRss] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const loadSnapi = async () => {
    setLoadingSnapi(true);
    try {
      const res = await fetch("/api/news");
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "SNAPI error");
      setSnapi(j.articles || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoadingSnapi(false);
    }
  };

  const loadRss = async (src: string) => {
    setLoadingRss(true);
    try {
      const res = await fetch(`/api/rss?source=${encodeURIComponent(src)}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "RSS error");
      setRss(j.articles || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoadingRss(false);
    }
  };

  useEffect(() => {
    loadSnapi();
    loadRss(rssSource);
  }, []);

  useEffect(() => {
    if (tab === "rss") loadRss(rssSource);
  }, [rssSource]);

  const filteredSnapi = useMemo(() => {
    if (!snapiQ.trim()) return snapi;
    const q = snapiQ.toLowerCase();
    return snapi.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
  }, [snapi, snapiQ]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Newspaper className="text-white" size={20} />}
        title={lang === "vi" ? "Tin Tức & Khám Phá Thiên Văn Mới Nhất" : "Space News & Discovery Feed"}
        desc={
          lang === "vi"
            ? "Cập nhật tự động và cào dữ liệu bài báo, phát hiện vũ trụ mới nhất từ các nguồn uy tín hàng đầu thế giới."
            : "Auto-updated feed of the latest space discoveries from trusted sources worldwide."
        }
        gradient="from-pink-400 to-fuchsia-600"
      />

      <div className="flex gap-2 p-1 rounded-full bg-white/[0.06] border border-white/10 w-fit">
        <button
          onClick={() => setTab("snapi")}
          className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition ${tab === "snapi" ? "bg-white text-slate-900 shadow" : "text-white/70 hover:text-white"}`}
        >
          <Radio size={14} /> 🚀 SNAPI • Spaceflight News
        </button>
        <button
          onClick={() => setTab("rss")}
          className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition ${tab === "rss" ? "bg-white text-slate-900 shadow" : "text-white/70 hover:text-white"}`}
        >
          <Rss size={14} /> 📡 RSS • Space.com / NASA
        </button>
      </div>

      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      {tab === "snapi" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[260px] max-w-[560px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={snapiQ}
                onChange={(e) => setSnapiQ(e.target.value)}
                placeholder={lang === "vi" ? "🔍 Tìm kiếm bài viết (SNAPI)..." : "🔍 Search articles (SNAPI)..."}
                className="w-full pl-9 pr-3 py-3 rounded-full bg-white/5 border border-white/10 text-sm placeholder:text-white/40 focus:outline-none focus:border-sky-400/40"
              />
            </div>
            <span className="text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/60">{filteredSnapi.length} / {snapi.length} articles</span>
            {loadingSnapi && <span className="inline-flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin" /> Loading SNAPI…</span>}
          </div>

          {!loadingSnapi && filteredSnapi.length === 0 && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-white/60 text-sm">
              {snapiQ ? (lang === "vi" ? "Không tìm thấy bài viết phù hợp." : "No matching articles found.") : (lang === "vi" ? "Chưa có bài viết nào." : "No articles yet.")}
            </div>
          )}

          <div className="space-y-4">
            {filteredSnapi.map((a, i) => (
              <div key={a.link + i} className="rounded-[18px] border border-white/10 bg-white/[0.04] backdrop-blur overflow-hidden card-hover">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  <div className="sm:w-[200px] shrink-0">
                    {a.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.image_url} alt={a.title} className="w-full h-[140px] object-cover rounded-xl border border-white/10" />
                    ) : (
                      <div className="w-full h-[140px] rounded-xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-white/10 grid place-items-center text-3xl">🌌</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={a.link} target="_blank" rel="noreferrer" className="font-bold leading-tight hover:text-sky-300 hover:underline line-clamp-2">
                      {a.title}
                    </a>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/20 text-sky-300 font-semibold">{a.news_site}</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1"><Clock size={12} /> {a.published ? a.published.slice(0, 10) : "—"}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/60 line-clamp-3">{a.summary}</p>
                    <a href={a.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:underline">
                      {lang === "vi" ? "Đọc bài gốc" : "Read original"} <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "rss" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs font-bold text-white/60">{lang === "vi" ? "Nguồn RSS" : "RSS Source"}</span>
              <select value={rssSource} onChange={(e) => setRssSource(e.target.value)} className="bg-transparent text-sm font-semibold outline-none">
                <option className="bg-[#0F172A]" value="Space.com">Space.com</option>
                <option className="bg-[#0F172A]" value="NASA News">NASA News</option>
                <option className="bg-[#0F172A]" value="SciTechDaily Space">SciTechDaily Space</option>
              </select>
            </label>
            {loadingRss && <span className="inline-flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin" /> {lang === "vi" ? "Đang đọc RSS…" : "Reading RSS…"}</span>}
            <span className="text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/60">{rss.length} articles</span>
          </div>

          <div className="space-y-3">
            {rss.map((a, i) => (
              <details key={a.link + i} className="group rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
                <summary className="list-none px-4 py-3 cursor-pointer flex items-start justify-between gap-3">
                  <span className="font-semibold text-sm leading-snug">📌 {a.title}</span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-white/10 grid place-items-center group-open:rotate-180 transition">⌄</span>
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <div className="text-xs text-white/50 flex items-center gap-1.5"><Clock size={12} /> {a.published || "—"}</div>
                  <p className="text-sm leading-relaxed text-white/70">{a.summary || "—"}</p>
                  <a href={a.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-500 text-white text-xs font-bold">
                    {lang === "vi" ? "Đọc toàn bộ bài viết" : "Read full article"} <ExternalLink size={12} />
                  </a>
                </div>
              </details>
            ))}
            {!loadingRss && rss.length === 0 && <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-white/60 text-sm">{lang === "vi" ? "Không tải được RSS lúc này." : "Could not load RSS right now."}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
