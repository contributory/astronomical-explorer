"use client";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Asterisk, AlertTriangle, Filter, Calendar, Loader2 } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type NeoRow = {
  Tên: string;
  "Ngày tiếp cận": string;
  "Đường kính TB (m)": number;
  "Đường kính min-max (m)": string;
  "Vận tốc (km/h)": number;
  "Khoảng cách (km)": number;
  "Khoảng cách (Lần Mặt Trăng)": number;
  "Nguy hiểm tiềm tàng": string;
  is_hazardous_bool: boolean;
  "JPL URL": string;
};

function processNeo(data: any): { count: number; rows: NeoRow[] } {
  const count = data.element_count ?? 0;
  const neos = data.near_earth_objects || {};
  const rows: NeoRow[] = [];
  for (const day of Object.keys(neos)) {
    for (const ast of neos[day]) {
      const diam_min = ast.estimated_diameter?.meters?.estimated_diameter_min ?? 0;
      const diam_max = ast.estimated_diameter?.meters?.estimated_diameter_max ?? 0;
      const avg = (diam_min + diam_max) / 2;
      const app = ast.close_approach_data?.[0];
      const vel = app ? Number(app.relative_velocity?.kilometers_per_hour ?? 0) : 0;
      const missKm = app ? Number(app.miss_distance?.kilometers ?? 0) : 0;
      const missLD = app ? Number(app.miss_distance?.lunar ?? 0) : 0;
      rows.push({
        Tên: ast.name,
        "Ngày tiếp cận": app?.close_approach_date ?? day,
        "Đường kính TB (m)": Math.round(avg * 10) / 10,
        "Đường kính min-max (m)": `${Math.round(diam_min * 10) / 10} - ${Math.round(diam_max * 10) / 10}`,
        "Vận tốc (km/h)": Math.round(vel * 10) / 10,
        "Khoảng cách (km)": Math.round(missKm * 10) / 10,
        "Khoảng cách (Lần Mặt Trăng)": Math.round(missLD * 100) / 100,
        "Nguy hiểm tiềm tàng": ast.is_potentially_hazardous_asteroid ? "⚠️ CÓ" : "🟢 KHÔNG",
        is_hazardous_bool: !!ast.is_potentially_hazardous_asteroid,
        "JPL URL": ast.nasa_jpl_url || "",
      });
    }
  }
  return { count, rows };
}

export default function NeoPage() {
  const { lang } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const threeAgo = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
  const [start, setStart] = useState(threeAgo);
  const [end, setEnd] = useState(today);
  const [onlyHaz, setOnlyHaz] = useState(false);
  const [rows, setRows] = useState<NeoRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    // clamp 7 days
    const s = new Date(start);
    const e = new Date(end);
    let endClamped = end;
    if ((e.getTime() - s.getTime()) / 86400000 > 7) {
      const nc = new Date(s.getTime() + 7 * 86400000).toISOString().slice(0, 10);
      setEnd(nc);
      endClamped = nc;
    }
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/neo?start_date=${start}&end_date=${endClamped}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "NEO error");
      const { count, rows } = processNeo(j);
      setCount(count);
      setRows(rows);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [start, end]);

  const filtered = useMemo(() => (onlyHaz ? rows.filter((r) => r.is_hazardous_bool) : rows), [rows, onlyHaz]);
  const hazCount = rows.filter((r) => r.is_hazardous_bool).length;
  const maxRow = rows.length ? rows.reduce((a, b) => (a["Đường kính TB (m)"] > b["Đường kính TB (m)"] ? a : b)) : null;
  const closeRow = rows.length ? rows.reduce((a, b) => (a["Khoảng cách (km)"] < b["Khoảng cách (km)"] ? a : b)) : null;

  const chartDataSafe = filtered.filter((r) => !r.is_hazardous_bool).map((r) => ({ x: r["Khoảng cách (Lần Mặt Trăng)"], y: r["Vận tốc (km/h)"], z: r["Đường kính TB (m)"], name: r.Tên }));
  const chartDataHaz = filtered.filter((r) => r.is_hazardous_bool).map((r) => ({ x: r["Khoảng cách (Lần Mặt Trăng)"], y: r["Vận tốc (km/h)"], z: r["Đường kính TB (m)"], name: r.Tên }));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Asterisk className="text-white" size={20} />}
        title={lang === "vi" ? "Theo Dõi Tiểu Hành Tinh Gần Trái Đất (NASA NeoWS)" : "Near Earth Objects (NASA NeoWS)"}
        desc={lang === "vi" ? "Giám sát và phân tích các tiểu hành tinh đi qua gần quỹ đạo Trái Đất theo thời gian thực." : "Monitor asteroids passing near Earth orbit in real time."}
        gradient="from-amber-400 to-orange-500"
      />

      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5"><Calendar size={14} /> {lang === "vi" ? "Từ ngày" : "Start"}</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm [color-scheme:dark]" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5"><Calendar size={14} /> {lang === "vi" ? "Đến ngày" : "End"}</span>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm [color-scheme:dark]" />
        </label>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 cursor-pointer select-none">
          <input type="checkbox" checked={onlyHaz} onChange={(e) => setOnlyHaz(e.target.checked)} className="accent-amber-500" />
          <span className="text-sm font-medium flex items-center gap-1.5"><AlertTriangle size={14} className="text-amber-400" /> {lang === "vi" ? "Chỉ xem nguy hiểm ⚠️" : "Hazardous only"}</span>
        </label>
        {loading && <span className="inline-flex items-center gap-2 text-sm text-white/60 pb-2"><Loader2 size={16} className="animate-spin" /> {lang === "vi" ? "Đang tải…" : "Loading…"}</span>}
      </div>

      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      {!loading && !err && rows.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
              <div className="text-[11px] tracking-widest font-bold text-white/40">{lang === "vi" ? "TỔNG SỐ TIỂU HÀNH TINH" : "TOTAL NEOs"}</div>
              <div className="font-display font-extrabold text-2xl mt-1">{count}</div>
              <div className="text-xs text-white/50">{rows.length} {lang === "vi" ? "bản ghi" : "records in range"}</div>
            </div>
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
              <div className="text-[11px] tracking-widest font-bold text-amber-300/70">{lang === "vi" ? "PHA • NGUY HIỂM TIỀM TÀNG" : "PHA • POTENTIALLY HAZARDOUS"}</div>
              <div className="font-display font-extrabold text-2xl mt-1 text-amber-300">{hazCount}</div>
              <div className="text-xs text-amber-200/60">{count ? ((hazCount / count) * 100).toFixed(1) : "0"}% {lang === "vi" ? "trong tổng số" : "of total"}</div>
            </div>
            {maxRow && (
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                <div className="text-[11px] tracking-widest font-bold text-white/40">{lang === "vi" ? "LỚN NHẤT" : "LARGEST"}</div>
                <div className="font-display font-extrabold text-xl mt-1 text-sky-300">{maxRow["Đường kính TB (m)"]} m</div>
                <div className="text-xs text-white/50 truncate">{maxRow.Tên}</div>
              </div>
            )}
            {closeRow && (
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                <div className="text-[11px] tracking-widest font-bold text-white/40">{lang === "vi" ? "GẦN NHẤT" : "CLOSEST APPROACH"}</div>
                <div className="font-display font-extrabold text-xl mt-1 text-emerald-300">{closeRow["Khoảng cách (Lần Mặt Trăng)"]} LD</div>
                <div className="text-xs text-white/50">{closeRow["Khoảng cách (km)"].toLocaleString()} km</div>
              </div>
            )}
          </div>

          <div className="rounded-[20px] border border-white/10 bg-[#0F172A]/60 backdrop-blur p-4 sm:p-6">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Filter size={16} className="text-sky-400" /> {lang === "vi" ? "Biểu Đồ: Khoảng Cách vs Vận Tốc vs Đường Kính" : "Chart: Distance vs Velocity vs Diameter"}
            </div>
            <div className="h-[380px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 10, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" dataKey="x" name="LD" unit=" LD" stroke="#94A3B8" tick={{ fontSize: 12 }} label={{ value: lang === "vi" ? "Khoảng cách (LD)" : "Distance (LD)", position: "insideBottom", offset: -10, fill: "#94A3B8", fontSize: 12 }} />
                  <YAxis type="number" dataKey="y" name="Vận tốc" unit=" km/h" stroke="#94A3B8" tick={{ fontSize: 12 }} label={{ value: lang === "vi" ? "Vận tốc (km/h)" : "Velocity (km/h)", angle: -90, position: "insideLeft", fill: "#94A3B8", fontSize: 12 }} />
                  <ZAxis type="number" dataKey="z" range={[60, 600]} name="Đường kính" unit=" m" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
                  <Legend />
                  <Scatter name={lang === "vi" ? "🟢 An toàn" : "🟢 Safe"} data={chartDataSafe} fill="#22C55E" />
                  <Scatter name={lang === "vi" ? "⚠️ Nguy hiểm" : "⚠️ Hazardous"} data={chartDataHaz} fill="#EF4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-white/60">{lang === "vi" ? "DANH SÁCH CHI TIẾT" : "DETAILED LIST"} • {filtered.length}</span>
              <span className="text-xs text-white/40">{lang === "vi" ? "Sắp xếp theo khoảng cách gần nhất" : "Sorted by closest approach"}</span>
            </div>
            <div className="overflow-auto max-h-[560px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#0F172A] border-b border-white/10 text-xs tracking-widest text-white/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">{lang === "vi" ? "Tên" : "Name"}</th>
                    <th className="text-left px-4 py-3 font-semibold">{lang === "vi" ? "Ngày" : "Date"}</th>
                    <th className="text-right px-4 py-3 font-semibold">{lang === "vi" ? "Ø TB (m)" : "Avg Ø (m)"}</th>
                    <th className="text-right px-4 py-3 font-semibold">{lang === "vi" ? "Vận tốc" : "Velocity"}</th>
                    <th className="text-right px-4 py-3 font-semibold">{lang === "vi" ? "Khoảng cách" : "Distance"}</th>
                    <th className="text-center px-4 py-3 font-semibold">PHA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[...filtered].sort((a, b) => a["Khoảng cách (km)"] - b["Khoảng cách (km)"]).map((r) => (
                    <tr key={r.Tên + r["Ngày tiếp cận"]} className="hover:bg-white/[0.04]">
                      <td className="px-4 py-3 font-medium">
                        <a href={r["JPL URL"]} target="_blank" rel="noreferrer" className="hover:text-sky-300 hover:underline">
                          {r.Tên}
                        </a>
                        <div className="text-[11px] text-white/40">{r["Đường kính min-max (m)"]} m</div>
                      </td>
                      <td className="px-4 py-3 text-white/70">{r["Ngày tiếp cận"]}</td>
                      <td className="px-4 py-3 text-right font-semibold">{r["Đường kính TB (m)"]}</td>
                      <td className="px-4 py-3 text-right">{r["Vận tốc (km/h)"].toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div>{r["Khoảng cách (Lần Mặt Trăng)"]} LD</div>
                        <div className="text-[11px] text-white/40">{r["Khoảng cách (km)"].toLocaleString()} km</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${r.is_hazardous_bool ? "bg-red-500/15 border-red-500/30 text-red-300" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"}`}>
                          {r["Nguy hiểm tiềm tàng"]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && !err && rows.length === 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-white/60 text-sm">{lang === "vi" ? "Không có dữ liệu trong khoảng thời gian đã chọn." : "No data for the selected date range."}</div>
      )}
    </div>
  );
}
