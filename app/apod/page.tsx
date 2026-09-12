"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { PageHeader } from "@/components/page-header";
import { Image as ImageIcon, Shuffle, Calendar, ExternalLink, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Apod = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
};

function randomDate() {
  const start = new Date(1995, 5, 16).getTime();
  const end = new Date().getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().slice(0, 10);
}

export default function ApodPage() {
  const { lang } = useApp();
  const todayStr = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(todayStr);
  const [data, setData] = useState<Apod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApod = async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/apod?date=${d}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "API error");
      setData(j);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApod(date);
  }, [date]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ImageIcon className="text-white" size={20} />}
        title={lang === "vi" ? "Ảnh Thiên Văn Trong Ngày (NASA APOD)" : "Astronomy Picture of the Day (NASA APOD)"}
        desc={
          lang === "vi"
            ? "Khám phá bức ảnh vũ trụ tuyệt đẹp được các nhà thiên văn NASA lựa chọn mỗi ngày kèm phần thuyết minh chuyên sâu."
            : "Discover the stunning cosmic image chosen by NASA astronomers every day with in-depth explanation."
        }
        gradient="from-sky-400 to-cyan-400"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.06] border border-white/10">
          <Calendar size={16} className="text-white/50" />
          <input
            type="date"
            value={date}
            min="1995-06-16"
            max={todayStr}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
          />
        </div>
        <button
          onClick={() => setDate(randomDate())}
          className="px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-sm font-semibold hover:bg-white/10 flex items-center gap-2"
        >
          <Shuffle size={16} /> {lang === "vi" ? "Bức ảnh ngẫu nhiên" : "Random"}
        </button>
        <button
          onClick={() => setDate(todayStr)}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-white text-sm font-bold shadow"
        >
          {lang === "vi" ? "Hôm nay" : "Today"}
        </button>
        {loading && <span className="inline-flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin" /> {lang === "vi" ? "Đang tải…" : "Loading…"}</span>}
      </div>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 flex gap-3">
          <AlertCircle className="text-red-400 shrink-0" size={20} />
          <div>
            <div className="font-semibold text-red-300 text-sm">{error}</div>
            <div className="text-xs text-white/60 mt-1">{lang === "vi" ? "Thử chọn ngày khác hoặc tải lại trang." : "Try another date or reload the page."}</div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {data && !error && (
          <motion.div
            key={data.date + data.url}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="rounded-[22px] overflow-hidden border border-white/10 bg-[#0F172A]/70 backdrop-blur"
          >
            <div className="p-5 sm:p-6">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl leading-tight">{data.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10">📅 {data.date}</span>
                {data.copyright && <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10">📸 {data.copyright}</span>}
                <span className="px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/20 text-sky-300">🛰️ {data.media_type.toUpperCase()}</span>
              </div>
            </div>

            <div className="px-3 sm:px-6 pb-6">
              {data.media_type === "image" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden bg-black/30 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.url} alt={data.title} className="w-full h-auto max-h-[720px] object-contain mx-auto" />
                  </div>
                  {data.hdurl && data.hdurl !== data.url && (
                    <a
                      href={data.hdurl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-bold hover:bg-sky-600"
                    >
                      <ExternalLink size={16} /> {lang === "vi" ? "Xem ảnh chất lượng cao (HD)" : "View HD image"} <Sparkles size={14} />
                    </a>
                  )}
                </div>
              ) : data.media_type === "video" ? (
                <div className="space-y-3">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
                    <iframe src={data.url} className="w-full h-full" allowFullScreen title={data.title} />
                  </div>
                  <a href={data.url} target="_blank" rel="noreferrer" className="text-sm text-sky-300 hover:underline inline-flex gap-2 items-center">
                    <ExternalLink size={14} /> {data.url}
                  </a>
                </div>
              ) : (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-200">
                  Media type “{data.media_type}” — <a href={data.url} target="_blank" rel="noreferrer" className="underline"> {data.url}</a>
                </div>
              )}

              <details open className="mt-6 rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
                <summary className="px-4 py-3 font-semibold text-sm cursor-pointer list-none flex items-center justify-between">
                  <span>📖 {lang === "vi" ? "Đọc phần giải thích khoa học" : "Scientific explanation"}</span>
                  <span className="text-white/40 text-xs">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm leading-relaxed text-white/70 whitespace-pre-wrap">{data.explanation}</div>
              </details>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
