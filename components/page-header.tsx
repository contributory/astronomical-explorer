"use client";
import { cn } from "@/lib/utils";

export function PageHeader({
  icon,
  title,
  desc,
  gradient = "from-sky-400 to-violet-500",
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] p-[1px] bg-gradient-to-br from-sky-500/20 via-violet-500/20 to-fuchsia-500/20 light:from-sky-500/15 light:via-violet-500/10 light:to-transparent">
      <div className="rounded-[19px] bg-gradient-to-br from-[#0F172A]/90 to-[#111A33]/90 backdrop-blur p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between light:from-white light:to-slate-50/80 light:border light:border-slate-200">
        <div className="flex gap-4">
          <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br grid place-items-center shrink-0 shadow-lg", gradient)}>
            {icon}
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg sm:text-xl leading-tight text-white light:text-slate-900">{title}</h1>
            <p className="text-sm leading-relaxed text-white/60 mt-1 max-w-[640px] light:text-slate-500">{desc}</p>
          </div>
        </div>
        {actions && <div className="w-full sm:w-auto shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 backdrop-blur light:bg-white light:border-slate-200 light:shadow-sm">
      <div className="text-[11px] tracking-widest font-bold text-white/40 light:text-slate-400">{label}</div>
      <div className={cn("font-display font-extrabold text-xl mt-1", accent || "text-white light:text-slate-900")}>{value}</div>
      {sub && <div className="text-xs text-white/50 mt-1 truncate light:text-slate-400">{sub}</div>}
    </div>
  );
}
