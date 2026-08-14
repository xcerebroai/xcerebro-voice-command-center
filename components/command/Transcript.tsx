"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@/lib/agent-runtime";

/**
 * System-dialogue style transcript — command output, not chat bubbles.
 */
export default function Transcript({ entries }: { entries: TranscriptEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  return (
    <div ref={scrollRef} className="scroll-thin h-full overflow-y-auto pr-2">
      {entries.length === 0 ? (
        <div className="font-mono text-xs text-muted/60">
          — Awaiting first command. Try RUN MARCUS DEMO. —
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map((entry) => (
            <div key={entry.id}>
              <div
                className={`font-mono text-[10px] tracking-[0.3em] ${
                  entry.role === "user" ? "text-gold" : "text-accent"
                }`}
              >
                {entry.role === "user" ? "LEX" : "Q AI"}
              </div>
              <div className="mt-1.5 space-y-1 border-l border-line pl-3">
                {entry.segments.map((seg, i) => (
                  <p key={i} className="text-sm leading-relaxed text-ink/90">
                    {entry.role === "user" ? `"${seg}"` : seg}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
