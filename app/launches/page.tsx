"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Rocket, Search, Calendar, MapPin, Loader2, ExternalLink, Play, Clock, Building2 } from "lucide-react";
import { motion } from "framer-motion";

type Launch = {
  id: string;
  name: string;
  status: { name: string; abbrev: string; description: string };
  net: string;
  image: string;
  webcast_live: boolean;
  rocket: { configuration: { name: string; family: string; full_name: string } };
  mission: { name: string; description: string; type: string; orbit?: { name: string; abbrev: string } } | null;
  launch_service_provider: { name: string; abbrev: string; type: string };
  pad: { name: string; location: { name: string; country_code: string } };
  vidURLs: { url: string }[];
};

export default function LaunchesPage() {
  const { lang } = useApp();
  const [mode, setMode] = useState<"upcoming" | "previous">("upcoming");
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async (opts?: { mode?: string; search?: string }) => {
    const m = opts?.mode ?? mode;
    const s = opts?.search ?? q;
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      qs.set("mode", m);
      qs.set("limit", "12");
      if (s) qs.set("search", s);
      const res = await fetch(`/api/launches?${qs.toString()}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Launches error");
      setLaunches(j.launches || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [mode]);

  const onSearch = () => {
    setQ(search);
    load({ search });
  };

  const statusColor = (abbrev: string) => {
    if (abbrev === "Go") return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
    if (abbrev === "TBC" || abbrev === "TBD") return "bg-amber-500/15 border-amber-500/30 text-amber-300";
    if (abbrev === "Success") return "bg-sky-500/15 border-sky-400/30 text-sky-300";
    if (abbrev === "Failure") return "bg-red-500/15 border-red-500/30 text-red-300";
    return "bg-white/5 border-white/10 text-white/60";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Rocket className="text-white" size={20} />}
        title={lang === "vi" ? "Lịch Phóng Tên Lửa" : "Rocket Launches"}
        desc={
          lang === "vi"
            ? "Tên lửa nào sắp phóng, đã phóng và kết quả ra sao — cập nhật liên tục."
            : "Which rockets are launching next and how past ones went — updated live."
        }
        gradient="from-orange-400 to-red-600"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex p-1 rounded-full bg-white/[0.06] border border-white/10">
          <button onClick={() => setMode("upcoming")} className={`px-5 py-2 rounded-full text-xs font-bold transition ${mode === "upcoming" ? "bg-white text-slate-900" : "text-white/60"}`}>
            🚀 {lang === "vi" ? "Sắp phóng" : "Upcoming"}
          </button>
          <button onClick={() => setMode("previous")} className={`px-5 py-2 rounded-full text-xs font-bold transition ${mode === "previous" ? "bg-white text-slate-900" : "text-white/60"}`}>
            ✅ {lang === "vi" ? "Đã phóng" : "Previous"}
          </button>
        </div>

        <div className="flex gap-2 flex-1 min-w-[220px] max-w-[420px]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder={lang === "vi" ? "Tìm SpaceX, Falcon 9, NASA..." : "Search SpaceX, Falcon 9, NASA..."}
              className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-400/40"
            />
          </div>
          <button onClick={onSearch} className="px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-white/90">{lang === "vi" ? "Tìm" : "Search"}</button>
        </div>

        {loading && <span className="inline-flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin" /> {lang === "vi" ? "Đang tải…" : "Loading…"}</span>}
        {!loading && !err && <span className="text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/50">{launches.length} {lang === "vi" ? "vụ phóng" : "launches"}</span>}
      </div>

      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {launches.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-[18px] overflow-hidden border border-white/10 bg-[#0F172A]/70 backdrop-blur flex flex-col card-hover"
          >
            <div className="relative h-[180px] overflow-hidden bg-black">
              {l.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center bg-gradient-to-br from-slate-800 to-slate-900 text-4xl">🚀</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur ${statusColor(l.status?.abbrev)}`}>{l.status?.abbrev || "—"} • {l.status?.name || "—"}</span>
                {l.webcast_live && <span className="px-2 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold animate-pulse">● LIVE</span>}
              </div>
              <div className="absolute bottom-0 p-3">
                <div className="font-bold text-white leading-tight line-clamp-2 text-sm">{l.name}</div>
                <div className="text-xs text-white/70 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1"><Building2 size={12} /> {l.launch_service_provider?.name || "—"}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1"><Rocket size={12} /> {l.rocket?.configuration?.name || "—"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-3">
              <div className="flex items-start gap-2 text-xs">
                <Calendar size={14} className="text-sky-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold">{l.net ? new Date(l.net).toLocaleString(lang === "vi" ? "vi-VN" : "en-US") : "TBD"}</div>
                  <div className="text-white/50">NET • {l.mission?.orbit?.name || l.mission?.type || "—"}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <MapPin size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">{l.pad?.name || "—"}</div>
                  <div className="text-white/50">{l.pad?.location?.name || ""} {l.pad?.location?.country_code ? `• ${l.pad.location.country_code}` : ""}</div>
                </div>
              </div>
              {l.mission?.description && <p className="text-xs leading-relaxed text-white/60 line-clamp-3">{l.mission.description}</p>}

              <div className="mt-auto flex gap-2 pt-2">
                {l.vidURLs?.[0]?.url && (
                  <a href={l.vidURLs[0].url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600">
                    <Play size={12} className="fill-white" /> {lang === "vi" ? "Xem" : "Watch"}
                  </a>
                )}
                <a href={`https://ll.thespacedevs.com/2.2.0/launch/${l.id}/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-semibold hover:bg-white/15">
                  <ExternalLink size={12} /> {lang === "vi" ? "Chi tiết" : "Details"}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && !err && launches.length === 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center text-sm text-white/60">{lang === "vi" ? "Không tìm thấy vụ phóng nào. Thử từ khóa khác." : "No launches found. Try a different keyword."}</div>
      )}
    </div>
  );
}
