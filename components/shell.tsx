"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./providers";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  Image as ImageIcon,
  Satellite,
  Asterisk,
  Rocket,
  Orbit,
  Newspaper,
  Menu,
  X,
  Sparkles,
  Globe,
  Moon,
  Sun,
  Globe2,
  RocketIcon,
  Atom,
  Flame,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/apod", icon: ImageIcon, vi: "Ảnh Vũ Trụ", en: "Photo of the Day" },
  { href: "/iss", icon: Satellite, vi: "Trạm ISS", en: "Space Station" },
  { href: "/neo", icon: Asterisk, vi: "Tiểu Hành Tinh", en: "Asteroids" },
  { href: "/mars", icon: Rocket, vi: "Sao Hỏa", en: "Mars" },
  { href: "/solar", icon: Orbit, vi: "Hệ Mặt Trời", en: "Solar System" },
  { href: "/news", icon: Newspaper, vi: "Tin Tức", en: "News" },
];

const navMore = [
  { href: "/earth", icon: Globe2, vi: "Trái Đất", en: "Earth" },
  { href: "/launches", icon: RocketIcon, vi: "Lịch Phóng", en: "Launches" },
  { href: "/bodies", icon: Atom, vi: "Hành Tinh", en: "Planets" },
  { href: "/events", icon: Flame, vi: "Thiên Tai", en: "Events" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { lang, setLang, theme, setTheme } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/[0.08] bg-[#080B14]/70">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 flex h-[64px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.07] border border-white/10"
              aria-label="menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 grid place-items-center shadow-lg shadow-sky-500/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="leading-none hidden sm:block">
                <div className="font-display font-extrabold tracking-tight text-[15px]">COSMIC EXPLORER</div>
                <div className="text-[11px] tracking-[0.18em] text-white/50 font-medium">THÁM HIỂM VŨ TRỤ</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-full bg-white/[0.06] border border-white/10 p-1">
              <button
                onClick={() => setLang("vi")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition",
                  lang === "vi" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
                )}
              >
                VI
              </button>
              <button
                onClick={() => setLang("en")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition",
                  lang === "en" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
                )}
              >
                EN
              </button>
            </div>

            <div className="flex items-center rounded-full bg-white/[0.06] border border-white/10 p-1">
              <button
                onClick={() => setTheme("dark")}
                className={cn("p-1.5 rounded-full", theme === "dark" ? "bg-white text-slate-900" : "text-white/60")}
                title={lang === "vi" ? "Tối" : "Dark"}
              >
                <Moon size={14} />
              </button>
              <button
                onClick={() => setTheme("light")}
                className={cn("p-1.5 rounded-full", theme === "light" ? "bg-white text-slate-900" : "text-white/60")}
                title={lang === "vi" ? "Sáng" : "Light"}
              >
                <Sun size={14} />
              </button>
              <button
                onClick={() => setTheme("auto")}
                className={cn("px-2 py-1 rounded-full text-[11px] font-bold", theme === "auto" ? "bg-white text-slate-900" : "text-white/60")}
              >
                AUTO
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex gap-6">
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-[88px] space-y-4">
            <div className="rounded-[20px] overflow-hidden border border-white/10 bg-gradient-to-br from-sky-500/10 via-violet-500/10 to-fuchsia-500/10 p-[1px]">
              <div className="rounded-[19px] bg-[#0B1020] p-4">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80&auto=format&fit=crop"
                  alt="Earth from space"
                  className="w-full h-[108px] object-cover rounded-xl"
                />
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow shadow-emerald-400/50" />
                  <span className="text-[11px] tracking-widest font-semibold text-white/60">{lang === "vi" ? "TRỰC TIẾP • MỖI NGÀY" : "LIVE • DAILY"}</span>
                </div>
                <div className="mt-2 text-[12px] leading-relaxed text-white/60">
                  {lang === "vi" ? "Mười góc nhìn khác nhau về cùng một vũ trụ." : "Ten different windows onto the same cosmos."}
                </div>
              </div>
            </div>

            <nav className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-2">
              <div className="px-3 py-2 text-[11px] tracking-widest font-bold text-white/40">{t("menu_title", lang).toUpperCase()}</div>
              <div className="space-y-1">
                {nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition border",
                        active
                          ? "bg-gradient-to-r from-sky-500/20 to-violet-500/20 border-sky-400/30 text-sky-300 shadow shadow-sky-500/10"
                          : "border-transparent text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/10"
                      )}
                    >
                      <item.icon size={18} className={cn(active ? "text-sky-400" : "text-white/40")} />
                      <span>{lang === "vi" ? item.vi : item.en}</span>
                      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow shadow-sky-400/50" />}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/10 p-2">
                <div className="text-[11px] tracking-widest font-bold text-white/40 px-2 py-1">{lang === "vi" ? "KHÁM PHÁ THÊM" : "MORE TO SEE"}</div>
                <div className="space-y-1">
                  {navMore.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition border",
                          active
                            ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-emerald-400/30 text-emerald-300"
                            : "border-transparent text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/10"
                        )}
                      >
                        <item.icon size={16} className={cn(active ? "text-emerald-400" : "text-white/40")} />
                        <span className="text-[13px]">{lang === "vi" ? item.vi : item.en}</span>
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow shadow-emerald-400/50" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between px-2">
                <button
                  onClick={() => setLang(lang === "vi" ? "en" : "vi")}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
                >
                  <Globe size={14} /> {lang === "vi" ? "Tiếng Việt" : "English"}
                </button>
                <span className="text-[11px] text-white/30">{lang === "vi" ? "10 góc nhìn" : "10 views"}</span>
              </div>
            </nav>

            <div className="px-2 text-[11px] leading-relaxed text-white/30">
              {t("footer", lang)}
            </div>
          </div>
        </aside>

        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-[64px] bottom-0 w-[300px] bg-[#0B1020] border-r border-white/10 p-4 overflow-auto">
              <nav className="space-y-1">
                {[...nav, ...navMore].map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border",
                        active ? "bg-sky-500/15 border-sky-400/30 text-sky-300" : "border-transparent text-white/70"
                      )}
                    >
                      <item.icon size={18} />
                      {lang === "vi" ? item.vi : item.en}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setLang("vi")} className={cn("flex-1 py-2.5 rounded-xl text-sm font-bold border", lang === "vi" ? "bg-white text-slate-900 border-white" : "border-white/15 text-white/70")}>Tiếng Việt</button>
                <button onClick={() => setLang("en")} className={cn("flex-1 py-2.5 rounded-xl text-sm font-bold border", lang === "en" ? "bg-white text-slate-900 border-white" : "border-white/15 text-white/70")}>English</button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
