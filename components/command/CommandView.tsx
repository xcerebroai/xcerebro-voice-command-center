"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useAgentRuntime } from "@/lib/agent-runtime";
import { runCommand } from "@/lib/demo-sequence";
import VoiceOrb from "./VoiceOrb";
import Waveform from "./Waveform";
import Transcript from "./Transcript";
import ActiveContext from "./ActiveContext";
import ActivityFeed from "./ActivityFeed";

export default function CommandView() {
  const { state, statusLabel, transcript, running } = useAgentRuntime();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Spacebar or Cmd/Ctrl+K focuses the command field.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === " " && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function submit() {
    const text = input.trim();
    if (!text || running) return;
    setInput("");
    runCommand(text);
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      {/* center column */}
      <div className="flex min-h-0 flex-col items-center">
        <div className="flex flex-col items-center pt-6">
          <VoiceOrb state={state} statusLabel={statusLabel} />
          <div className="mt-3 w-64">
            <Waveform speaking={state === "speaking"} />
          </div>
        </div>

        <div className="panel mt-4 flex min-h-0 w-full max-w-2xl flex-1 flex-col p-5">
          <div className="panel-title">TRANSCRIPT</div>
          <div className="mt-3 min-h-0 flex-1">
            <Transcript entries={transcript} />
          </div>
        </div>

        <form
          className="mt-4 flex w-full max-w-2xl items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask X Cerebro...   (Space or Ctrl+K to focus)"
            className="panel h-11 flex-1 rounded-lg px-4 text-sm text-ink placeholder:text-muted/50 outline-none focus:border-accent/40"
          />
          <button
            type="submit"
            disabled={running || !input.trim()}
            className="flex h-11 items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 font-mono text-[11px] tracking-[0.2em] text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={13} />
            SEND
          </button>
        </form>
      </div>

      {/* right column */}
      <div className="flex min-h-0 flex-col gap-4">
        <ActiveContext />
        <ActivityFeed />
      </div>
    </div>
  );
}
