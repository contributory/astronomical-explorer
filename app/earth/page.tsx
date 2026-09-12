"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Globe2, Calendar, Image as ImageIcon, Loader2, ExternalLink, Layers, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type EpicImage = {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  centroid_coordinates: { lat: number; lon: number };
  image_url: string | null;
  thumb_url: string | null;
};

export default function EarthPage() {
  const { lang } = useApp();
  const [kind, setKind] = useState<"natural" | "enhanced">("natural");
  const [date, setDate] = useState(""); // empty = latest
  const [images, setImages] = useState<EpicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<EpicImage | null>(null);
  const [nasaDemo, setNasaDemo] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    setNasaDemo(false);
    try {
      const qs = new URLSearchParams();
      qs.set("kind", kind);
      if (date) qs.set("date", date);
      const res = await fetch(`/api/epic?${qs.toString()}`);
      const j = await res.json();
      if (!res.ok) {
        if (res.status === 429) setNasaDemo(true);
        throw new Error(j.error || "EPIC error");
      }
      setImages(j.images || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [kind, date]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Globe2 className="text-white" size={20} />}
        title={lang === "vi" ? "Trái Đất Nhìn Từ Vũ Trụ (NASA EPIC)" : "Earth From Space (NASA EPIC)"}
        desc={
          lang === "vi"
            ? "Ảnh toàn cảnh Trái Đất chụp bởi vệ tinh DSCOVR/EPIC ở điểm Lagrange L1 — cách 1,5 triệu km, cập nhật mỗi ngày."
            : "Full-disk Earth images from DSCOVR/EPIC at Lagrange point L1 — 1.5 million km away, updated daily."
        }
        gradient="from-emerald-400 to-teal-600"
      />

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
          <button onClick={() => setKind("natural")} className={`px-4 py-2 rounded-full text-xs font-bold transition ${kind === "natural" ? "bg-white text-slate-900" : "text-white/60"}`}>
            <Layers size={12} className="inline mr-1" /> {lang === "vi" ? "Tự nhiên" : "Natural"}
          </button>
          <button onClick={() => setKind("enhanced")} className={`px-4 py-2 rounded-full text-xs font-bold transition ${kind === "enhanced" ? "bg-white text-slate-900" : "text-white/60"}`}>
            <Sparkles size={12} className="inline mr-1" /> {lang === "vi" ? "Tăng cường" : "Enhanced"}
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-widest text-white/60 flex items-center gap-1"><Calendar size={12} /> {lang === "vi" ? "CHỌN NGÀY" : "DATE"}</span>
          <div className="flex gap-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm [color-scheme:dark]" />
            {date && (
              <button onClick={() => setDate("")} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10">{lang === "vi" ? "Mới nhất" : "Latest"}</button>
            )}
          </div>
        </label>

        {loading && <span className="inline-flex items-center gap-2 text-sm text-white/60 pb-2"><Loader2 size={16} className="animate-spin" /> {lang === "vi" ? "Đang tải..." : "Loading..."}</span>}
        {!loading && !err && <span className="text-xs px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/50">{images.length} {lang === "vi" ? "ảnh" : "photos"}</span>}
      </div>
      {err && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{err}</div>}

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div key={`${kind}-${date}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.button
              key={img.identifier + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelected(img)}
              className="group text-left rounded-[18px] overflow-hidden border border-white/10 bg-[#0F172A]/70 backdrop-blur card-hover"
            >
              <div className="relative aspect-square overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url || img.thumb_url || ""} alt={img.caption || img.identifier} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-3">
                  <div className="text-xs font-bold text-white line-clamp-2">{img.caption || img.identifier}</div>
                  <div className="text-[11px] text-white/60 mt-1">{new Date(img.date).toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}</div>
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-white/15 text-[11px] font-bold flex items-center gap-1">
                  <ImageIcon size={12} /> {img.image}
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[11px] text-white/40">lat {img.centroid_coordinates?.lat?.toFixed(1) ?? "—"} • lon {img.centroid_coordinates?.lon?.toFixed(1) ?? "—"}</span>
                <span className="text-xs font-bold text-sky-300">{lang === "vi" ? "Xem →" : "View →"}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {!loading && !err && images.length === 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center">
          <div className="text-4xl mb-3">🌍</div>
          <div className="text-sm text-white/60">{lang === "vi" ? "Không có ảnh EPIC cho ngày này. Thử chọn ngày khác hoặc để trống để xem ảnh mới nhất." : "No EPIC images for this date. Try another date, or leave it empty for the latest."}</div>
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[720px] rounded-[20px] overflow-hidden border border-white/15 bg-[#0B1020] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image_url || ""} alt={selected.caption} className="w-full h-auto" />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/20 grid place-items-center text-white hover:bg-black/80">✕</button>
            </div>
            <div className="p-5 space-y-3">
              <div className="font-bold leading-tight">{selected.caption}</div>
              <div className="text-xs text-white/50">{new Date(selected.date).toLocaleString(lang === "vi" ? "vi-VN" : "en-US")} • {selected.identifier}</div>
              <div className="flex flex-wrap gap-2">
                <a href={selected.image_url || ""} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold">
                  <ExternalLink size={14} /> {lang === "vi" ? "Mở ảnh gốc (PNG)" : "Open original (PNG)"}
                </a>
                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs">DSCOVR • L1 • ~1.5M km</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
