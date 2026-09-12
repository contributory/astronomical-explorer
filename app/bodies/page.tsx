"use client";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Orbit, Search, Loader2, Ruler, Weight, Thermometer, Wind, Droplets, Star } from "lucide-react";

type Body = {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  moons: { moon: string; rel: string }[] | null;
  semimajorAxis: number;
  perihelion: number;
  aphelion: number;
  eccentricity: number;
  inclination: number;
  mass: { massValue: number; massExponent: number } | null;
  vol: { volValue: number; volExponent: number } | null;
  density: number;
  gravity: number;
  escape: number;
  meanRadius: number;
  equaRadius: number;
  polarRadius: number;
  flattening: number;
  dimension: string;
  sideralOrbit: number;
  sideralRotation: number;
  aroundPlanet: { planet: string; rel: string } | null;
  discoveredBy: string;
  discoveryDate: string;
  alternativeName: string;
  axialTilt: number;
  avgTemp: number;
  mainAnomaly: number;
  argPeriapsis: number;
  longAscNode: number;
  bodyType: string;
};

const FILTERS = [
  { label: "Hành tinh", en: "Planets", value: "isPlanet,eq,true", icon: "🪐" },
  { label: "Vệ tinh", en: "Moons", value: "bodyType,eq,Moon", icon: "🌙" },
  { label: "Tiểu hành tinh", en: "Asteroids", value: "bodyType,eq,Asteroid", icon: "☄️" },
  { label: "Sao chổi", en: "Comets", value: "bodyType,eq,Comet", icon: "☄️" },
  { label: "Sao lùn", en: "Dwarf Planets", value: "bodyType,eq,Dwarf Planet", icon: "⭐" },
];

export default function BodiesPage() {
  const { lang } = useApp();
  const [filter, setFilter] = useState("isPlanet,eq,true");
  const [bodies, setBodies] = useState<Body[]>([]);
  const [selected, setSelected] = useState<Body | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async (f: string) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/bodies?filter=${encodeURIComponent(f)}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Bodies error");
      const list: Body[] = j.bodies || [];
      setBodies(list);
      if (list.length && !selected) setSelected(list.find((b) => b.id === "earth") || list[0]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const filtered = useMemo(() => {
    if (!q.trim()) return bodies;
    const s = q.toLowerCase();
    return bodies.filter((b) => b.name.toLowerCase().includes(s) || b.englishName.toLowerCase().includes(s) || b.id.toLowerCase().includes(s));
  }, [bodies, q]);

  const detailCard = (b: Body | null) => {
    if (!b) return null;
    return (
      <div className="rounded-[20px] border border-white/10 bg-[#0F172A]/70 backdrop-blur overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-display font-extrabold text-xl leading-tight">{b.englishName || b.name}</div>
              <div className="text-xs text-white/50">{b.id} • {b.bodyType} {b.aroundPlanet ? (lang === "vi" ? `• quanh ${b.aroundPlanet.planet}` : `• orbits ${b.aroundPlanet.planet}`) : ""}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/20 text-sky-300 text-xs font-bold">{b.isPlanet ? "Planet" : b.bodyType}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
              <div className="text-[11px] tracking-widest font-bold text-white/40 flex items-center gap-1"><Ruler size={12} /> {lang === "vi" ? "BÁN KÍNH TB" : "MEAN RADIUS"}</div>
              <div className="font-bold mt-1">{b.meanRadius?.toLocaleString() ?? "—"} km</div>
              <div className="text-xs text-white/40">{lang === "vi" ? "dẹt" : "flattening"} {b.flattening ?? 0}</div>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
              <div className="text-[11px] tracking-widest font-bold text-white/40 flex items-center gap-1"><Weight size={12} /> {lang === "vi" ? "KHỐI LƯỢNG" : "MASS"}</div>
              <div className="font-bold mt-1">{b.mass ? `${b.mass.massValue} ×10^${b.mass.massExponent} kg` : "—"}</div>
              <div className="text-xs text-white/40">ρ {b.density ?? "—"} g/cm³</div>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
              <div className="text-[11px] tracking-widest font-bold text-white/40 flex items-center gap-1"><Thermometer size={12} /> {lang === "vi" ? "NHIỆT ĐỘ TB" : "MEAN TEMP"}</div>
              <div className="font-bold mt-1">{b.avgTemp ? `${b.avgTemp} K` : "—"}</div>
              <div className="text-xs text-white/40">{b.avgTemp ? `${(b.avgTemp - 273.15).toFixed(1)} °C` : ""}</div>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
              <div className="text-[11px] tracking-widest font-bold text-white/40 flex items-center gap-1"><Wind size={12} /> {lang === "vi" ? "TRỌNG LỰC" : "GRAVITY"}</div>
              <div className="font-bold mt-1">{b.gravity ?? "—"} m/s²</div>
              <div className="text-xs text-white/40">{lang === "vi" ? "thoát" : "escape"} {b.escape ?? "—"} m/s</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
              <div className="font-semibold text-white/70">{lang === "vi" ? "Quỹ đạo" : "Orbit"}</div>
              <div className="mt-1 space-y-1 text-white/60">
                <div>a = {(b.semimajorAxis / 1e6).toFixed(2)} M km</div>
                <div>e = {b.eccentricity ?? "—"} • i = {b.inclination ?? "—"}°</div>
                <div>{lang === "vi" ? "Chu kỳ" : "Period"} {b.sideralOrbit ? `${(b.sideralOrbit).toFixed(1)} ${lang === "vi" ? "ngày" : "days"}` : "—"}</div>
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
              <div className="font-semibold text-white/70">{lang === "vi" ? "Tự quay" : "Rotation"}</div>
              <div className="mt-1 space-y-1 text-white/60">
                <div>{b.sideralRotation ? `${b.sideralRotation} ${lang === "vi" ? "giờ" : "hours"}` : "—"}</div>
                <div>{lang === "vi" ? "Nghiêng trục" : "Axial tilt"} {b.axialTilt ?? "—"}°</div>
                <div>{b.moons?.length ? `${b.moons.length} ${lang === "vi" ? "vệ tinh" : "moons"}` : b.aroundPlanet ? (lang === "vi" ? `Vệ tinh của ${b.aroundPlanet.planet}` : `Moon of ${b.aroundPlanet.planet}`) : (lang === "vi" ? "Không có vệ tinh" : "No moons")}</div>
              </div>
            </div>
          </div>

          {(b.discoveredBy || b.discoveryDate) && (
            <div className="mt-3 text-xs text-white/40">
              {lang === "vi" ? "Phát hiện:" : "Discovered by:"} {b.discoveredBy || "—"} {b.discoveryDate ? `• ${b.discoveryDate}` : ""}
            </div>
          )}
          {b.moons && b.moons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {b.moons.slice(0, 12).map((m) => (
                <span key={m.moon} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs">{m.moon}</span>
              ))}
              {b.moons.length > 12 && <span className="px-2 py-1 text-xs text-white/40">+{b.moons.length - 12} {lang === "vi" ? "nữa" : "more"}</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Orbit className="text-white" size={20} />}
        title={lang === "vi" ? "Hồ Sơ Hành Tinh" : "Planet Profiles"}
        desc={
          lang === "vi"
            ? "Mọi con số về hành tinh — lớn cỡ nào, nặng bao nhiêu, có bao nhiêu vệ tinh."
            : "Every planet by the numbers — size, mass, orbit and moons."
        }
        gradient="from-sky-400 to-violet-600"
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition ${filter === f.value ? "bg-white text-slate-900 border-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}
          >
            <span className="mr-1">{f.icon}</span> {lang === "vi" ? f.label : f.en}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-[420px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "vi" ? "Tìm earth, mars, titan..." : "Search earth, mars, titan..."} className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-400/40" />
        </div>
        {loading && <span className="inline-flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin" /> Loading…</span>}
        {!loading && <span className="text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/50">{filtered.length} bodies</span>}
      </div>

      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        <div className="rounded-[20px] border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col max-h-[640px]">
          <div className="px-4 py-3 border-b border-white/10 text-xs font-bold tracking-widest text-white/60">{lang === "vi" ? "DANH SÁCH" : "LIST"} • {filtered.length}</div>
          <div className="overflow-auto divide-y divide-white/5 flex-1">
            {filtered.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/[0.04] transition ${selected?.id === b.id ? "bg-sky-500/10" : ""}`}
              >
                <span className="text-lg">{b.isPlanet ? "🪐" : b.bodyType === "Moon" ? "🌙" : b.bodyType === "Star" ? "☀️" : "☄️"}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold truncate">{b.englishName || b.name}</span>
                  <span className="block text-xs text-white/40 truncate">{b.id} • {b.bodyType}</span>
                </span>
                {selected?.id === b.id && <span className="w-2 h-2 rounded-full bg-sky-400 shadow shadow-sky-400/50" />}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0">{detailCard(selected)}</div>
      </div>
    </div>
  );
}
