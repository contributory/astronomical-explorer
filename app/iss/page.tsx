"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader, StatCard } from "@/components/page-header";
import { Satellite, RefreshCw, Users, MapPinned, Gauge, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

const ISSMap = dynamic(() => import("@/components/iss-map"), { ssr: false, loading: () => <div className="h-[400px] rounded-2xl bg-white/5 border border-white/10 animate-pulse grid place-items-center text-white/40 text-sm">Loading map…</div> });

type ISS = { latitude: number; longitude: number; altitude: number; velocity: number; visibility: string; timestamp?: number };
type Astros = { number: number; people: { name: string; craft: string }[] };

export default function ISSPage() {
  const { lang } = useApp();
  const [iss, setIss] = useState<ISS | null>(null);
  const [astros, setAstros] = useState<Astros | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [a, b] = await Promise.all([fetch("/api/iss").then((r) => r.json()), fetch("/api/astros").then((r) => r.json())]);
      if (a.error) throw new Error(a.error);
      setIss(a);
      setAstros(b);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Satellite className="text-white" size={20} />}
        title={lang === "vi" ? "Theo Dõi Trạm Vũ Trụ Quốc Tế (ISS)" : "Live ISS Tracker"}
        desc={
          lang === "vi"
            ? "Cập nhật vị trí thời gian thực của trạm ISS đang bay quanh Trái Đất cùng thông số độ cao, vận tốc và phi hành đoàn."
            : "Real-time ISS position orbiting Earth with altitude, velocity and crew manifest."
        }
        gradient="from-violet-400 to-purple-600"
        actions={
          <button onClick={load} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-white/90">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> {lang === "vi" ? "Cập nhật ngay" : "Refresh"}
          </button>
        }
      />

      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-white/70">
            <MapPinned size={16} className="text-violet-400" /> {lang === "vi" ? "BẢN ĐỒ VỊ TRÍ ISS TRỰC TUYẾN" : "LIVE ISS MAP"}
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE • 15s
            </span>
          </div>

          {iss ? (
            <div className="grid grid-cols-3 gap-3">
              <StatCard label={lang === "vi" ? "VĨ ĐỘ" : "LAT"} value={`${iss.latitude.toFixed(4)}°`} accent="text-sky-300" />
              <StatCard label={lang === "vi" ? "KINH ĐỘ" : "LON"} value={`${iss.longitude.toFixed(4)}°`} accent="text-violet-300" />
              <StatCard label={lang === "vi" ? "VẬN TỐC" : "VELOCITY"} value={`${iss.velocity.toLocaleString()} km/h`} />
              <div className="col-span-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 grid place-items-center"><Navigation size={16} className="text-sky-400" /></div>
                  <div><div className="text-[11px] tracking-widest text-white/40">ALTITUDE</div><div className="font-bold">{iss.altitude.toLocaleString()} km</div></div>
                </div>
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 grid place-items-center"><Gauge size={16} className="text-amber-400" /></div>
                  <div><div className="text-[11px] tracking-widest text-white/40">VISIBILITY</div><div className="font-bold capitalize">{iss.visibility}</div></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-white/50 text-sm">Loading ISS data…</div>
          )}

          <div className="rounded-[20px] overflow-hidden border border-white/10 bg-[#0F172A]">
            {iss ? <ISSMap lat={iss.latitude} lon={iss.longitude} alt={iss.altitude} velocity={iss.velocity} /> : <div className="h-[400px] grid place-items-center text-white/40">Waiting for coordinates…</div>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-white/70">
            <Users size={16} className="text-sky-400" /> {lang === "vi" ? "PHI HÀNH GIA TRONG VŨ TRỤ" : "HUMANS IN SPACE"}
          </div>

          {astros && (
            <>
              <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 p-5 text-white">
                <div className="text-xs tracking-widest opacity-80">{lang === "vi" ? "TỔNG SỐ NGƯỜI NGOÀI VŨ TRỤ" : "TOTAL HUMANS IN SPACE"}</div>
                <div className="font-display font-extrabold text-4xl mt-1">{astros.number} <span className="text-base font-semibold opacity-90">{lang === "vi" ? "người" : "people"}</span></div>
                <div className="text-xs opacity-80 mt-2">Open-Notify • Updated every 5 min</div>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-white/60">CREW MANIFEST</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10">{astros.people.length}</span>
                </div>
                <div className="divide-y divide-white/5 max-h-[380px] overflow-auto">
                  {astros.people.map((p) => (
                    <div key={p.name} className="px-4 py-3 flex items-center justify-between">
                      <span className="text-sm font-medium">{p.name}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/20 text-sky-300 font-semibold">{p.craft}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-sky-500/10 border border-sky-500/20 p-4 text-sm leading-relaxed text-sky-100">
                <div className="font-bold">💡 {lang === "vi" ? "Thông tin thú vị:" : "Did you know?"}</div>
                <ul className="list-disc ml-5 mt-2 space-y-1 text-sky-200/80 text-xs">
                  <li>{lang === "vi" ? "ISS quay quanh Trái Đất mỗi 90 phút (16 lần bình minh/ngày)." : "ISS orbits Earth every 90 minutes (16 sunrises/day)."}</li>
                  <li>{lang === "vi" ? "Độ cao quỹ đạo trung bình ~400 km." : "Average orbital altitude ~400 km."}</li>
                  <li>{lang === "vi" ? "Vận tốc ~28.000 km/h." : "Velocity ~28,000 km/h."}</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
