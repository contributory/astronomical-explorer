"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Rocket, Camera, Calendar, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROVER_INFO: Record<string, { name: string; status: string; landing: string }> = {
  perseverance: { name: "Perseverance (Mars 2020)", status: "Active 🟢", landing: "2021-02-18" },
  curiosity: { name: "Curiosity (MSL)", status: "Active 🟢", landing: "2012-08-06" },
};

type Photo = { id: string; img_src: string; title: string; camera: string; sol: number; date_taken: string };

export default function MarsPage() {
  const { lang } = useApp();
  const [rover, setRover] = useState<"perseverance" | "curiosity">("perseverance");
  const [num, setNum] = useState(18);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/mars?rover=${rover}&num=${num}`);
      const j = await res.json();
      if (!res.ok && !j.photos) throw new Error(j.error || "Mars API error");
      setPhotos(j.photos || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [rover, num]);

  const info = ROVER_INFO[rover];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Rocket className="text-white" size={20} />}
        title={lang === "vi" ? "Khám Phá Bề Mặt Sao Hỏa (Mars Rovers)" : "Mars Rovers — Direct from the Red Planet"}
        desc={
          lang === "vi"
            ? "Xem các hình ảnh gốc chất lượng cao từ các xe thám hiểm Perseverance và Curiosity đang hoạt động trên bề mặt Sao Hỏa."
            : "Browse raw high-res images relayed directly from Perseverance and Curiosity on the Martian surface."
        }
        gradient="from-red-400 to-rose-600"
      />

      <div className="flex flex-wrap gap-4 items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-widest text-white/60">{lang === "vi" ? "ROBOT THÁM HIỂM" : "ROVER"}</span>
          <select
            value={rover}
            onChange={(e) => setRover(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium min-w-[220px]"
          >
            <option value="perseverance" className="bg-[#0F172A]">Perseverance (Mars 2020)</option>
            <option value="curiosity" className="bg-[#0F172A]">Curiosity (MSL)</option>
          </select>
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-widest text-white/60">{lang === "vi" ? "SỐ ẢNH HIỂN THỊ" : "IMAGES TO SHOW"}: {num}</span>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <input type="range" min={6} max={48} step={6} value={num} onChange={(e) => setNum(Number(e.target.value))} className="w-[160px] accent-red-500" />
            <span className="text-sm font-bold min-w-[32px] text-center">{num}</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {info.status} • {lang === "vi" ? "Hạ cánh" : "Landed"} {info.landing}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-bold text-white/70">
        <ImageIcon size={16} className="text-red-400" />
        {loading ? (
          <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> {lang === "vi" ? "Đang tải ảnh từ Sao Hỏa…" : "Loading images from Mars…"}</span>
        ) : (
          <span>📷 {lang === "vi" ? `Tải thành công ${photos.length} bức ảnh mới nhất` : `Loaded ${photos.length} latest images`} — {info.name}</span>
        )}
      </div>

      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      <AnimatePresence mode="wait">
        <motion.div
          key={rover + num}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {photos.map((p, i) => (
            <motion.div
              key={p.id + i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group rounded-[18px] overflow-hidden border border-white/10 bg-[#0F172A]/70 backdrop-blur card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img_src}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-white/15 text-[11px] font-bold flex items-center gap-1">
                    <Camera size={12} /> {p.camera?.slice(0, 18) || "—"}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="text-xs font-semibold text-white/90 line-clamp-1">{p.title}</div>
                  <div className="text-[11px] text-white/60 flex gap-2 mt-1">
                    <span className="inline-flex items-center gap-1"><Calendar size={10} /> Sol {p.sol ?? "—"}</span>
                    <span>• {p.date_taken}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-white/50 truncate pr-2">{p.title}</span>
                <a href={p.img_src} target="_blank" rel="noreferrer" className="shrink-0 px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-white/90">
                  HD
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {!loading && photos.length === 0 && <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-white/60 text-sm">{lang === "vi" ? "Chưa có ảnh mới nào được ghi nhận." : "No new images recorded yet."}</div>}
    </div>
  );
}
