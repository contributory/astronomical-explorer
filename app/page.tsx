"use client";
import Link from "next/link";
import { useApp } from "@/components/providers";
import { t } from "@/lib/translations";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Satellite,
  Asterisk,
  Rocket,
  Orbit,
  Newspaper,
  ArrowRight,
  Sparkles,
  Play,
  Moon,
  Sun,
  Globe2,
  Atom,
  Flame,
  RocketIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = { href: string; icon: any; gradient: string; key: string; stats: { vi: string; en: string } };

const features: Feature[] = [
  { href: "/apod", icon: ImageIcon, gradient: "from-sky-400 to-cyan-400", key: "apod", stats: { vi: "Kho ảnh 1995 → nay", en: "Archive since 1995" } },
  { href: "/iss", icon: Satellite, gradient: "from-violet-400 to-purple-500", key: "iss", stats: { vi: "Cập nhật mỗi 15 giây", en: "Updates every 15s" } },
  { href: "/neo", icon: Asterisk, gradient: "from-amber-400 to-orange-500", key: "neo", stats: { vi: "Cảnh báo va chạm", en: "Impact watch" } },
  { href: "/mars", icon: Rocket, gradient: "from-red-400 to-rose-600", key: "mars", stats: { vi: "Ảnh mới mỗi ngày", en: "New photos daily" } },
  { href: "/solar", icon: Orbit, gradient: "from-teal-400 to-emerald-500", key: "stargazing", stats: { vi: "8 hành tinh • 3D", en: "8 planets • 3D" } },
  { href: "/news", icon: Newspaper, gradient: "from-pink-400 to-fuchsia-500", key: "news", stats: { vi: "Tin mới mỗi giờ", en: "Fresh every hour" } },
  { href: "/earth", icon: Globe2, gradient: "from-emerald-400 to-teal-600", key: "earth", stats: { vi: "Trái Đất mỗi ngày", en: "Earth, every day" } },
  { href: "/launches", icon: RocketIcon, gradient: "from-orange-400 to-red-500", key: "launches", stats: { vi: "Lịch phóng trực tiếp", en: "Live schedule" } },
  { href: "/bodies", icon: Atom, gradient: "from-sky-400 to-violet-500", key: "bodies", stats: { vi: "Hồ sơ từng hành tinh", en: "Planet profiles" } },
  { href: "/events", icon: Flame, gradient: "from-amber-400 to-orange-600", key: "events", stats: { vi: "Theo dõi thiên tai", en: "Disaster tracking" } },
];

function labelFor(key: string, lang: string) {
  if (lang === "vi") {
    if (key === "apod") return "Ảnh Vũ Trụ Mỗi Ngày";
    if (key === "iss") return "Trạm Vũ Trụ ISS";
    if (key === "neo") return "Tiểu Hành Tinh Gần Trái Đất";
    if (key === "mars") return "Khám Phá Sao Hỏa";
    if (key === "stargazing") return "Hệ Mặt Trời 3D";
    if (key === "news") return "Tin Tức Không Gian";
    if (key === "earth") return "Trái Đất Từ Vũ Trụ";
    if (key === "launches") return "Lịch Phóng Tên Lửa";
    if (key === "bodies") return "Hồ Sơ Hành Tinh";
    return "Thiên Tai Toàn Cầu";
  }
  if (key === "apod") return "Picture of the Day";
  if (key === "iss") return "Space Station Live";
  if (key === "neo") return "Asteroids Near Earth";
  if (key === "mars") return "Life on Mars";
  if (key === "stargazing") return "Solar System in 3D";
  if (key === "news") return "Space News";
  if (key === "earth") return "Earth From Space";
  if (key === "launches") return "Rocket Launches";
  if (key === "bodies") return "Planet Profiles";
  return "Natural Events";
}

function descFor(key: string, lang: string) {
  if (lang === "vi") {
    if (key === "apod") return "Bức ảnh vũ trụ đẹp nhất mỗi ngày do NASA chọn, kèm lời giải thích.";
    if (key === "iss") return "Xem trạm ISS đang bay ở đâu, cao bao nhiêu và ai đang ở trên đó.";
    if (key === "neo") return "Những tiểu hành tinh đang bay gần Trái Đất — cái nào đáng chú ý.";
    if (key === "mars") return "Ảnh thật từ hai xe tự hành đang lăn bánh trên Sao Hỏa.";
    if (key === "stargazing") return "Mô hình 3D cho thấy các hành tinh đang ở đâu hôm nay.";
    if (key === "news") return "Tin mới nhất về vũ trụ, tên lửa và khám phá.";
    if (key === "earth") return "Trái Đất tròn đầy nhìn từ vệ tinh cách 1,5 triệu km.";
    if (key === "launches") return "Tên lửa nào sắp phóng, đã phóng, và kết quả ra sao.";
    if (key === "bodies") return "Mọi con số về hành tinh: lớn cỡ nào, nặng bao nhiêu, quay ra sao.";
    return "Cháy rừng, núi lửa, bão — đang diễn ra ở đâu trên bản đồ.";
  }
  if (key === "apod") return "NASA's most beautiful space photo each day, with the story behind it.";
  if (key === "iss") return "Where the station is right now, how high, and who's on board.";
  if (key === "neo") return "Asteroids passing near Earth — and which ones to watch.";
  if (key === "mars") return "Real photos from two rovers driving on Mars right now.";
  if (key === "stargazing") return "A 3D view of where every planet is today.";
  if (key === "news") return "The latest stories about space, rockets and discovery.";
  if (key === "earth") return "The whole Earth, seen from a satellite 1.5 million km away.";
  if (key === "launches") return "Which rockets are launching next, and how past ones went.";
  if (key === "bodies") return "Every planet by the numbers: size, mass, orbit and moons.";
  return "Wildfires, volcanoes and storms — live on the map.";
}

export default function LandingPage() {
  const { lang, setLang, theme, setTheme } = useApp();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080B14]/60 border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 grid place-items-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold tracking-tight text-sm">COSMIC EXPLORER</div>
              <div className="text-[11px] tracking-[0.2em] text-white/50">{lang === "vi" ? "KHÁM PHÁ VŨ TRỤ" : "EXPLORE THE COSMOS"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-full bg-white/5 border border-white/10 p-1">
              <button onClick={() => setLang("vi")} className={cn("px-3 py-1.5 rounded-full text-xs font-bold", lang === "vi" ? "bg-white text-slate-900" : "text-white/60")}>VI</button>
              <button onClick={() => setLang("en")} className={cn("px-3 py-1.5 rounded-full text-xs font-bold", lang === "en" ? "bg-white text-slate-900" : "text-white/60")}>EN</button>
            </div>
            <div className="flex items-center rounded-full bg-white/5 border border-white/10 p-1">
              <button onClick={() => setTheme("dark")} className={cn("p-1.5 rounded-full", theme === "dark" ? "bg-white text-slate-900" : "text-white/60")}><Moon size={14} /></button>
              <button onClick={() => setTheme("light")} className={cn("p-1.5 rounded-full", theme === "light" ? "bg-white text-slate-900" : "text-white/60")}><Sun size={14} /></button>
            </div>
            <Link href="/apod" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-white/90 transition">
              {lang === "vi" ? "Khám phá" : "Explore"} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.04] to-transparent" />
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-[120px] right-[10%] w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pt-12 sm:pt-20 pb-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold tracking-wide text-white/70">
                  {lang === "vi" ? "DỮ LIỆU TRỰC TIẾP • CẬP NHẬT MỖI NGÀY" : "LIVE DATA • UPDATED DAILY"}
                </span>
              </div>

              <h1 className="mt-6 font-display font-extrabold tracking-tight leading-[0.9] text-[40px] sm:text-[56px] lg:text-[64px]">
                <span className="gradient-text block">{t("landingTitle", lang)}</span>
                <span className="block text-white mt-1 text-[34px] sm:text-[48px] lg:text-[52px] font-extrabold leading-none">
                  {lang === "vi" ? "Thám Hiểm" : "Explore"}
                  <span className="font-light text-white/60"> {lang === "vi" ? "Thiên Văn" : "the Universe"}</span>
                </span>
              </h1>

              <p className="mt-5 text-[16px] sm:text-[18px] leading-relaxed text-white/60 max-w-[560px]">
                {t("subtitle", lang)}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/earth" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 text-white font-bold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition">
                  <Play size={18} className="fill-white" /> {t("cta", lang)} <ArrowRight size={18} />
                </Link>
                <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="px-7 py-3.5 rounded-full bg-white/10 border border-white/15 text-white font-semibold backdrop-blur hover:bg-white/15 transition">
                  {lang === "vi" ? "Xem tất cả" : "See all"}
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-[520px]">
                {[
                  { v: "10", l: lang === "vi" ? "Góc nhìn vũ trụ" : "Ways to explore" },
                  { v: "∞", l: lang === "vi" ? "Ảnh & câu chuyện" : "Photos & stories" },
                  { v: "Live", l: lang === "vi" ? "Dữ liệu trực tiếp" : "Live tracking" },
                ].map((s) => (
                  <div key={s.v} className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                    <div className="font-display font-extrabold text-xl gradient-text">{s.v}</div>
                    <div className="text-xs text-white/60 leading-tight mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-white/20 via-sky-400/20 to-violet-500/20">
                <div className="rounded-[27px] overflow-hidden bg-[#0B1020] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/15 pointer-events-none" />
                  <img
                    src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=900&q=80&auto=format&fit=crop"
                    alt="Earth from space"
                    className="w-full h-[360px] sm:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-3">
                      <div className="text-[11px] tracking-widest text-white/50">{lang === "vi" ? "TRÁI ĐẤT" : "EARTH"}</div>
                      <div className="font-bold text-white mt-1">{lang === "vi" ? "Toàn cảnh" : "Full disk"}</div>
                      <div className="text-[11px] text-emerald-300">● {lang === "vi" ? "Mỗi ngày" : "Every day"}</div>
                    </div>
                    <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-3">
                      <div className="text-[11px] tracking-widest text-white/50">{lang === "vi" ? "TÊN LỬA" : "ROCKETS"}</div>
                      <div className="font-bold text-white mt-1">{lang === "vi" ? "Sắp phóng" : "Launching soon"}</div>
                      <div className="text-[11px] text-sky-300">{lang === "vi" ? "Trực tiếp" : "Live"}</div>
                    </div>
                    <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-3">
                      <div className="text-[11px] tracking-widest text-white/50">{lang === "vi" ? "THIÊN TAI" : "NATURAL EVENTS"}</div>
                      <div className="font-bold text-white mt-1">{lang === "vi" ? "Trên bản đồ" : "On the map"}</div>
                      <div className="text-[11px] text-amber-300">● {lang === "vi" ? "Trực tiếp" : "Live"}</div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/15 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {lang === "vi" ? "10 GÓC NHÌN ĐANG MỞ" : "10 VIEWS LIVE"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1200px] px-6 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
              <span className="gradient-text">{lang === "vi" ? "10 Góc Nhìn" : "10 Ways In"}</span>
              <span className="text-white"> {lang === "vi" ? "Về Vũ Trụ" : "to the Universe"}</span>
            </h2>
            <p className="text-white/60 mt-2 max-w-[600px]">
              {lang === "vi"
                ? "Từ bức ảnh mỗi ngày đến lịch phóng tên lửa — mỗi góc nhìn là một cách khác để ngắm vũ trụ."
                : "From a daily photo to the next rocket launch — ten different windows onto the same cosmos."}
            </p>
          </div>
          <Link href="/events" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-sm font-semibold hover:bg-white/10">
            {lang === "vi" ? "Xem thiên tai" : "See natural events"} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={f.href}
                className="group relative rounded-[22px] p-[1px] bg-gradient-to-br from-white/10 to-white/5 hover:from-sky-400/30 hover:to-violet-500/30 transition block h-full"
              >
                <div className="rounded-[21px] bg-[#0F172A]/80 backdrop-blur border border-white/5 p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br grid place-items-center shadow", f.gradient)}>
                      <f.icon size={18} className="text-white" />
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 font-medium">{lang === "vi" ? f.stats.vi : f.stats.en}</span>
                  </div>
                  <div className="mt-3 font-bold text-sm text-white group-hover:text-sky-200 transition line-clamp-2">{labelFor(f.key, lang)}</div>
                  <div className="text-xs leading-relaxed text-white/55 mt-1.5 flex-1">{descFor(f.key, lang)}</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 group-hover:gap-2 transition-all">
                    {lang === "vi" ? "Mở" : "Open"} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] p-[1px] bg-gradient-to-r from-sky-500/20 via-violet-500/20 to-fuchsia-500/20">
          <div className="rounded-[23px] bg-gradient-to-br from-[#0B1020] to-[#111A33] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-display font-extrabold text-lg text-white">{lang === "vi" ? "Sẵn sàng ngắm vũ trụ?" : "Ready to look up?"}</div>
              <div className="text-sm text-white/60 mt-1 max-w-[520px]">
                {lang === "vi" ? "Bắt đầu từ Trái Đất nhìn từ vũ trụ — bức ảnh toàn cảnh được chụp mỗi ngày." : "Start with Earth from space — a full-disk photo taken every single day."}
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/earth" className="px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-white/90 transition whitespace-nowrap">{lang === "vi" ? "Xem Trái Đất →" : "See Earth →"}</Link>
              <Link href="/launches" className="px-6 py-3 rounded-full bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition whitespace-nowrap">{lang === "vi" ? "Lịch phóng →" : "Launches →"}</Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/30">
          {t("footer", lang)}
        </div>
      </section>
    </div>
  );
}
