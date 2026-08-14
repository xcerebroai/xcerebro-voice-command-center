"use client";

import type { AgentState } from "@/types/agent";

export default function VoiceOrb({
  state,
  statusLabel,
}: {
  state: AgentState;
  statusLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="orb" data-state={state}>
        <div className="orb-core" />
        <div className="orb-ring" />
        <div className="orb-ring" />
        <div className="orb-ring" />
        <div className="orb-orbit">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div className="orb-recall">
          <span className="node" />
          <span className="node" />
          <span className="node" />
          <span className="node" />
        </div>
        <div className="orb-gear" />
      </div>
      <div className="text-center">
        <div className="font-mono text-sm tracking-[0.5em] text-ink">X CEREBRO</div>
        <div
          className={`mt-2 font-mono text-[11px] tracking-[0.35em] ${
            state === "error" ? "text-[#e06c6c]" : state === "idle" ? "text-muted" : "text-accent"
          }`}
        >
          {statusLabel}
        </div>
      </div>
    </div>
  );
}
