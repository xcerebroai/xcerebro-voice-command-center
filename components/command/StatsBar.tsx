"use client";

import { kpis } from "@/data/kpis";

function todayRange(): string {
  const d = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `(${d} - ${d})`;
}

/**
 * INFINITY CASH OFFER pipeline strip — mirrors the Jarvis/GHL dashboard
 * widgets. Values are mocked until Phase 2 wires live GHL data.
 */
export default function StatsBar() {
  return (
    <div className="mb-4">
      <div className="rounded-lg border border-gold/25 bg-black/50 px-4 py-1.5 text-center font-mono text-[11px] tracking-[0.35em] text-gold">
        INFINITY CASH OFFER
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.id} className="panel px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <Icon size={11} className="shrink-0 text-gold/80" />
                <span className="truncate font-mono text-[9px] tracking-[0.12em] text-muted">
                  {k.label}
                </span>
              </div>
              <div className="h-3 font-mono text-[8px] text-muted/50">
                {k.showDateRange ? todayRange() : ""}
              </div>
              <div className="text-center text-2xl font-semibold leading-tight text-ink">
                {k.value}
              </div>
              <div className="text-center text-[9px]">
                <span className="rounded bg-emerald-400/10 px-1 py-0.5 text-emerald-400">
                  ↑ {k.delta}
                </span>{" "}
                <span className="text-muted/70">{k.compare}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
