"use client";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Flame, Loader2, Search, MapPin, Calendar, ExternalLink, Filter } from "lucide-react";
import dynamic from "next/dynamic";

const EventsMap = dynamic(() => import("@/components/events-map"), {
  ssr: false,
  loading: () => <div className="h-[360px] rounded-2xl bg-white/5 border border-white/10 animate-pulse grid place-items-center text-white/40 text-sm">Loading map…</div>,
});

type EonetEvent = {
  id: string;
  title: string;
  description: string;
  link: string;
  categories: { id: string; title: string }[];
  sources: { id: string; url: string }[];
  geometry: { date: string; type: string; coordinates: any }[];
  closed: string | null;
};

export default function EventsPage() {
  const { lang } = useApp();
  const [events, setEvents] = useState<EonetEvent[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("open");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadCats = async () => {
    try {
      const res = await fetch("/api/eonet/categories");
      const j = await res.json();
      if (j.categories) setCategories(j.categories);
      else if (j.title) setCategories([]);
    } catch {}
  };

  const loadEvents = async () => {
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      if (cat) qs.set("category", cat);
      qs.set("status", status);
      qs.set("limit", "80");
      const res = await fetch(`/api/eonet?${qs.toString()}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "EONET error");
      setEvents(j.events || []);
      if (j.events?.length) setSelectedId((prev) => prev || j.events[0].id);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCats();
  }, []);
  useEffect(() => {
    loadEvents();
  }, [cat, status]);

  const filtered = useMemo(() => {
    if (!q.trim()) return events;
    const s = q.toLowerCase();
    return events.filter((e) => e.title.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s) || e.categories.some((c) => c.title.toLowerCase().includes(s)));
  }, [events, q]);

  const selected = filtered.find((e) => e.id === selectedId) || filtered[0] || null;

  // map points
  const points = filtered
    .map((e) => {
      const g = e.geometry?.[e.geometry.length - 1];
      if (!g) return null;
      let lat: number | null = null;
      let lon: number | null = null;
      if (g.type === "Point" && Array.isArray(g.coordinates)) {
        lon = g.coordinates[0];
        lat = g.coordinates[1];
      } else if (g.type === "Polygon" && Array.isArray(g.coordinates?.[0]?.[0])) {
        lon = g.coordinates[0][0][0];
        lat = g.coordinates[0][0][1];
      }
      if (lat == null || lon == null) return null;
      return { id: e.id, title: e.title, lat, lon, cat: e.categories[0]?.title || "" };
    })
    .filter(Boolean) as { id: string; title: string; lat: number; lon: number; cat: string }[];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Flame className="text-white" size={20} />}
        title={lang === "vi" ? "Thiên Tai Toàn Cầu" : "Natural Events"}
        desc={
          lang === "vi"
            ? "Cháy rừng, núi lửa, bão, băng tan — đang diễn ra ở đâu, ngay trên bản đồ."
            : "Wildfires, volcanoes and storms — happening right now, live on the map."
        }
        gradient="from-amber-400 to-orange-600"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold min-w-[180px]">
          <option value="" className="bg-[#0F172A]">{lang === "vi" ? "Tất cả danh mục" : "All categories"}</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id} className="bg-[#0F172A]">{c.title} ({c.id})</option>
          ))}
          {/* fallback if categories fetch failed */}
          {!categories.length && (
            <>
              <option value="wildfires" className="bg-[#0F172A]">Wildfires</option>
              <option value="volcanoes" className="bg-[#0F172A]">Volcanoes</option>
              <option value="severeStorms" className="bg-[#0F172A]">Severe Storms</option>
              <option value="seaLakeIce" className="bg-[#0F172A]">Sea & Lake Ice</option>
              <option value="floods" className="bg-[#0F172A]">Floods</option>
              <option value="earthquakes" className="bg-[#0F172A]">Earthquakes</option>
            </>
          )}
        </select>

        <div className="flex p-1 rounded-full bg-white/[0.06] border border-white/10">
          <button onClick={() => setStatus("open")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${status === "open" ? "bg-white text-slate-900" : "text-white/60"}`}>Open</button>
          <button onClick={() => setStatus("closed")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${status === "closed" ? "bg-white text-slate-900" : "text-white/60"}`}>Closed</button>
          <button onClick={() => setStatus("")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${status === "" ? "bg-white text-slate-900" : "text-white/60"}`}>All</button>
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "vi" ? "Tìm cháy rừng, bão..." : "Search wildfires, storms..."} className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-400/40" />
        </div>

        {loading && <span className="inline-flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin" /> {lang === "vi" ? "Đang tải…" : "Loading…"}</span>}
        {!loading && <span className="text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/50">{filtered.length} {lang === "vi" ? "sự kiện" : "events"} • {points.length} {lang === "vi" ? "trên bản đồ" : "on map"}</span>}
      </div>

      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      <div className="rounded-[20px] overflow-hidden border border-white/10 bg-[#0F172A]">
        <EventsMap points={points} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <div className="rounded-[20px] border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col max-h-[560px]">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-white/60">{lang === "vi" ? "DANH SÁCH" : "LIST"} • {filtered.length}</span>
            <Filter size={14} className="text-white/30" />
          </div>
          <div className="overflow-auto divide-y divide-white/5 flex-1">
            {filtered.map((e) => (
              <button key={e.id} onClick={() => setSelectedId(e.id)} className={`w-full text-left px-4 py-3 hover:bg-white/[0.04] transition ${selectedId === e.id ? "bg-amber-500/10" : ""}`}>
                <div className="text-sm font-semibold line-clamp-2 leading-tight">{e.title}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {e.categories.map((c) => (
                    <span key={c.id} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px]">{c.title}</span>
                  ))}
                  {e.closed ? <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px]">closed</span> : <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-[11px]">open</span>}
                </div>
                <div className="text-xs text-white/40 mt-1 flex items-center gap-1"><Calendar size={10} /> {e.geometry?.[0]?.date ? new Date(e.geometry[0].date).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US") : "—"}</div>
              </button>
            ))}
            {!filtered.length && !loading && <div className="p-8 text-center text-sm text-white/40">{lang === "vi" ? "Không có sự kiện phù hợp." : "No matching events."}</div>}
          </div>
        </div>

        <div className="min-w-0">
          {selected ? (
            <div className="rounded-[20px] border border-white/10 bg-[#0F172A]/70 backdrop-blur p-5">
              <div className="font-display font-extrabold text-lg leading-tight">{selected.title}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selected.categories.map((c) => (
                  <span key={c.id} className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-200 text-xs font-semibold">{c.title}</span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{selected.description || "—"}</p>

              <div className="mt-4 space-y-2 text-xs">
                {selected.geometry?.slice(-3).reverse().map((g, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10">
                    <MapPin size={12} className="text-sky-400" />
                    <span className="font-mono">{Array.isArray(g.coordinates) ? JSON.stringify(g.coordinates).slice(0, 80) : String(g.coordinates).slice(0, 80)}</span>
                    <span className="ml-auto text-white/40">{g.date ? new Date(g.date).toLocaleString(lang === "vi" ? "vi-VN" : "en-US") : ""}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.sources?.slice(0, 3).map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-slate-900 text-xs font-bold">
                    <ExternalLink size={12} /> {s.id}
                  </a>
                ))}
                <a href={selected.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-semibold">
                  <ExternalLink size={12} /> EONET
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-10 text-center text-sm text-white/40">{lang === "vi" ? "Chọn một sự kiện để xem chi tiết." : "Select an event to see details."}</div>
          )}
        </div>
      </div>
    </div>
  );
}
