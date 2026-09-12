"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Lang } from "@/lib/translations";

type Theme = "dark" | "light" | "auto";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "dark" | "light";
  // kept for backward compat — no longer used (NASA key moved to server env)
  nasaKey: string;
  setNasaKey: (k: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // English is the default, but VI/EN switching is fully supported
  const [lang, setLangRaw] = useState<Lang>("en");
  const [theme, setThemeRaw] = useState<Theme>("dark");
  const [resolvedTheme, setResolved] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const l = (localStorage.getItem("ce-lang") as Lang) || "en";
    const th = (localStorage.getItem("ce-theme") as Theme) || "dark";
    setLangRaw(l);
    setThemeRaw(th);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = theme === "auto" ? (sysDark ? "dark" : "light") : theme;
    setResolved(resolved as "dark" | "light");
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.classList.toggle("light", resolved === "light");
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "auto") {
        const r = m.matches ? "dark" : "light";
        setResolved(r as any);
        document.documentElement.classList.toggle("dark", r === "dark");
        document.documentElement.classList.toggle("light", r === "light");
      }
    };
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, [theme, mounted]);

  const setLang = (l: Lang) => {
    setLangRaw(l);
    localStorage.setItem("ce-lang", l);
  };
  const setTheme = (t: Theme) => {
    setThemeRaw(t);
    localStorage.setItem("ce-theme", t);
  };

  // deprecated: kept so old pages don't crash
  const nasaKey = "";
  const setNasaKey = (_k: string) => {};

  return (
    <AppCtx.Provider value={{ lang, setLang, theme, setTheme, resolvedTheme, nasaKey, setNasaKey }}>
      {children}
    </AppCtx.Provider>
  );
}
