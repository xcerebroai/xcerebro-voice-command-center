"use client";

import { useEffect, useRef } from "react";
import { useAgentRuntime } from "@/lib/agent-runtime";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function ActivityFeed() {
  const { activity } = useAgentRuntime();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activity]);

  return (
    <div className="panel flex min-h-0 flex-1 flex-col p-4">
      <div className="panel-title">ACTIVITY</div>
      <div ref={scrollRef} className="scroll-thin mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
        {activity.length === 0 ? (
          <div className="font-mono text-[11px] text-muted/60">No operational events yet.</div>
        ) : (
          <div className="space-y-1.5">
            {activity.map((entry) => (
              <div key={entry.id} className="feed-row flex gap-3 font-mono text-[11px]">
                <span className="shrink-0 text-muted/60">{formatTime(entry.timestamp)}</span>
                <span className="text-ink/80">{entry.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
