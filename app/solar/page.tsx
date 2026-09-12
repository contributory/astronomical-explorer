"use client";
import { useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Orbit, Calendar, LocateFixed } from "lucide-react";
import { calculatePlanetPositions, ORBIT_DISTANCES, PLANET_COLORS } from "@/lib/space";

export default function SolarPage() {
  const { lang } = useApp();
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeStr, setTimeStr] = useState(() => new Date().toTimeString().slice(0, 5));

  const dateTime = `${dateStr} ${timeStr}:00`;
  const positions = useMemo(() => calculatePlanetPositions(dateTime), [dateTime]);

  // SVG orbital viz (lightweight, no heavy 3D lib needed — preserves original orbit rings concept)
  const size = 560;
  const cx = size / 2;
  const cy = size / 2;
  const scale = 9.2; // px per AU — Neptune ~30AU fits within 560

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Orbit className="text-white" size={20} />}
        title={lang === "vi" ? "Mô Phỏng Hệ Mặt Trời & Tọa Độ Các Hành Tinh" : "3D Solar System & Planet Coordinates"}
        desc={
          lang === "vi"
            ? "Mô phỏng mô hình 3D quỹ đạo chuyển động của các hành tinh trong Hệ Mặt Trời theo mốc thời gian thực tế."
            : "Interactive orbital model of the Solar System — positions update with the selected date."
        }
        gradient="from-teal-400 to-emerald-600"
      />

      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-widest text-white/60 flex items-center gap-1.5"><Calendar size={14} /> {lang === "vi" ? "NGÀY MÔ PHỎNG" : "DATE"}</span>
          <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm [color-scheme:dark]" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-widest text-white/60">⏰ {lang === "vi" ? "GIỜ" : "TIME"}</span>
          <input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm [color-scheme:dark]" />
        </label>
        <button onClick={() => { const n = new Date(); setDateStr(n.toISOString().slice(0, 10)); setTimeStr(n.toTimeString().slice(0,5)); }} className="px-4 py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold">
          {lang === "vi" ? "Về hiện tại" : "Now"}
        </button>
        <span className="ml-auto text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/50">
          {lang === "vi" ? "Đơn vị AU • Quỹ đạo mô phỏng" : "Units in AU • Simulated orbits"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_0.85fr] gap-6">
        <div className="rounded-[20px] border border-white/10 bg-[#050816] p-3 sm:p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> {lang === "vi" ? "MÔ HÌNH QUỸ ĐẠO TƯƠNG TÁC" : "INTERACTIVE ORBITAL MODEL"}</div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">{dateTime}</span>
          </div>
          <div className="rounded-2xl overflow-hidden bg-black border border-white/10">
            <div className="w-full overflow-auto">
              <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-h-[560px] block" style={{ minWidth: 520 }}>
                <rect width={size} height={size} fill="#030412" />
                {/* grid */}
                <g opacity={0.06} stroke="#fff" strokeWidth={0.5}>
                  {Array.from({ length: 9 }).map((_, i) => {
                    const off = 40 + i * 60;
                    return <g key={i}><line x1={off} y1={0} x2={off} y2={size} /><line x1={0} y1={off} x2={size} y2={off} /></g>;
                  })}
                </g>
                {/* orbit rings */}
                {Object.entries(ORBIT_DISTANCES).map(([name, r]) => (
                  <circle key={name} cx={cx} cy={cy} r={r * scale} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth={r > 5 ? 1 : 1.2} strokeDasharray={r > 5 ? "4 6" : undefined} />
                ))}
                {/* sun glow */}
                <circle cx={cx} cy={cy} r={22} fill="rgba(255,215,0,0.18)" />
                <circle cx={cx} cy={cy} r={14} fill="rgba(255,215,0,0.35)" />
                {/* planets */}
                {positions.map((p) => {
                  const x = cx + p.x * scale;
                  const y = cy + p.y * scale;
                  const isSun = p.planet === "Sun";
                  return (
                    <g key={p.planet}>
                      {!isSun && <line x1={cx} y1={cy} x2={x} y2={y} stroke={p.color} opacity={0.12} strokeWidth={1} />}
                      <circle cx={x} cy={y} r={isSun ? 11 : Math.max(4, p.size * 0.55)} fill={p.color} stroke="rgba(255,255,255,0.85)" strokeWidth={isSun ? 1.5 : 1} />
                      {!isSun && (
                        <text x={x + 10} y={y - 8} fontSize={10} fontWeight={700} fill="#E2E8F0" paintOrder="stroke" stroke="#030412" strokeWidth={3} strokeLinejoin="round">
                          {p.name}
                        </text>
                      )}
                      {isSun && (
                        <text x={cx} y={cy - 18} textAnchor="middle" fontSize={11} fontWeight={800} fill="#FFD700">☀️ SUN</text>
                      )}
                    </g>
                  );
                })}
                {/* center cross */}
                <g stroke="rgba(255,255,255,0.1)" strokeWidth={0.5}><line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} /><line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} /></g>
              </svg>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Object.entries(PLANET_COLORS).map(([n, c]) => (
              <span key={n} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
                <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ background: c }} /> {n}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-white/60">📌 {lang === "vi" ? "TỌA ĐỘ TƯƠNG ĐỐI (AU)" : "RELATIVE COORDS (AU)"}</span>
              <span className="text-xs text-white/40">{positions.length} bodies</span>
            </div>
            <div className="overflow-auto max-h-[420px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#0F172A] text-xs tracking-widest text-white/50">
                  <tr><th className="text-left px-4 py-2">Body</th><th className="text-right px-3 py-2">X</th><th className="text-right px-3 py-2">Y</th><th className="text-right px-3 py-2">Z</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {positions.map((p) => (
                    <tr key={p.planet} className="hover:bg-white/[0.04]">
                      <td className="px-4 py-2.5 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ background: p.color }} />
                        <span className="font-medium">{p.name}</span>
                        {p.planet === "Sun" && <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">STAR</span>}
                      </td>
                      <td className="text-right px-3 py-2 font-mono text-xs">{p.x.toFixed(3)}</td>
                      <td className="text-right px-3 py-2 font-mono text-xs">{p.y.toFixed(3)}</td>
                      <td className="text-right px-3 py-2 font-mono text-xs">{p.z.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-teal-500/10 border border-teal-500/20 p-4">
            <div className="text-sm font-bold text-teal-200">ℹ️ {lang === "vi" ? "Về mô phỏng" : "About this simulation"}</div>
            <p className="text-xs leading-relaxed text-teal-100/70 mt-2">
              {lang === "vi"
                ? "Vị trí hành tinh được tính bằng xấp xỉ định luật Kepler 3 (chu kỳ ∝ r^1.5). Đây là mô hình trực quan hóa quỹ đạo, không phải ephemeris chính xác của NASA/JPL. Độ nghiêng quỹ đạo được mô phỏng nhẹ để tạo chiều sâu 3D."
                : "Planet positions use a Kepler 3rd-law approximation (period ∝ r^1.5). This is a visual orbital model, not a precise NASA/JPL ephemeris. Slight inclination is simulated for 3D depth."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
