"use client";

import { useState } from "react";
import { Play, LoaderCircle } from "lucide-react";
import { useAgentRuntime } from "@/lib/agent-runtime";
import { runMarcusDemo } from "@/lib/demo-sequence";
import CommandView from "@/components/command/CommandView";
import StatsBar from "@/components/command/StatsBar";
import BrainView from "@/components/brain/BrainView";
import FlowView from "@/components/flow/FlowView";

type Mode = "command" | "brain" | "flow";

const TABS: { id: Mode; label: string }[] = [
  { id: "command", label: "COMMAND" },
  { id: "brain", label: "BRAIN" },
  { id: "flow", label: "LIVE FLOW" },
];

export default function Home() {
  const [mode, setMode] = useState<Mode>("command");
  const { running, state } = useAgentRuntime();

  return (
    <div className="flex h-screen flex-col p-4">
      {/* header */}
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg border border-accent/30 bg-accent/10">
            <span className="font-mono text-sm font-bold text-accent">X</span>
          </div>
          <div>
            <div className="font-mono text-xs tracking-[0.35em] text-ink">X CEREBRO</div>
            <div className="font-mono text-[9px] tracking-[0.25em] text-muted/70">
              VOICE COMMAND CENTER
            </div>
          </div>
        </div>

        <nav className="flex gap-1 rounded-lg border border-line bg-panel p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`rounded-md px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] transition-colors ${
                mode === tab.id
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                state === "idle" ? "bg-muted/50" : "bg-accent shadow-[0_0_8px_rgba(77,159,255,0.9)]"
              }`}
            />
            {running ? "ACTIVE" : "STANDBY"}
          </div>
          <button
            onClick={() => runMarcusDemo()}
            disabled={running}
            className="flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-gold transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <Play size={13} />
            )}
            RUN MARCUS DEMO
          </button>
        </div>
      </header>

      {/* Jarvis / GHL pipeline KPIs (mocked until Phase 2) */}
      <StatsBar />

      {/* views — all stay mounted so one event stream drives all three */}
      <main className="min-h-0 flex-1">
        <div className={`h-full ${mode === "command" ? "" : "hidden"}`}>
          <CommandView />
        </div>
        <div className={`h-full ${mode === "brain" ? "" : "hidden"}`}>
          <BrainView active={mode === "brain"} />
        </div>
        <div className={`h-full ${mode === "flow" ? "" : "hidden"}`}>
          <FlowView active={mode === "flow"} />
        </div>
      </main>
    </div>
  );
}
