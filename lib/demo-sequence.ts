"use client";

import type { UnstampedAgentEvent } from "@/types/agent";
import { dispatch, resetRun, setRunning } from "@/lib/agent-runtime";
import { getVoiceProvider } from "@/lib/voice";

interface TimelineStep {
  at: number; // ms from start
  events: UnstampedAgentEvent[];
}

let activeTimers: ReturnType<typeof setTimeout>[] = [];
let sequenceRunning = false;

function cancelTimers() {
  for (const t of activeTimers) clearTimeout(t);
  activeTimers = [];
}

function play(timeline: TimelineStep[], onDone?: () => void) {
  if (sequenceRunning) return;
  sequenceRunning = true;
  cancelTimers();
  resetRun();
  setRunning(true);

  const totalMs = Math.max(...timeline.map((s) => s.at));
  for (const step of timeline) {
    activeTimers.push(
      setTimeout(() => {
        for (const e of step.events) {
          dispatch({ ...e, timestamp: Date.now() });
        }
      }, step.at)
    );
  }
  activeTimers.push(
    setTimeout(() => {
      sequenceRunning = false;
      setRunning(false);
      onDone?.();
    }, totalMs + 50)
  );
}

export function isSequenceRunning() {
  return sequenceRunning;
}

/**
 * The full Marcus demo: the exact event stream a real Hermes run would emit
 * for "What do I need to finish for Marcus?".
 */
export function runMarcusDemo(userText = "What do I need to finish for Marcus?") {
  const voiceLines = [
    "Marcus has three things we need to knock out.",
    "First, finish the A2P registration.",
    "Second, complete the Friday AI website.",
    "After that, review his upcoming onboarding and support schedule.",
  ];

  // Kick the mock voice provider so the adapter path is exercised end to end.
  void getVoiceProvider().speak(voiceLines.join(" "));

  play([
    {
      at: 0,
      events: [
        { type: "transcript_user", text: userText },
        { type: "state_changed", state: "listening" },
        { type: "flow_step", stepId: "request", status: "active" },
      ],
    },
    {
      at: 800,
      events: [
        { type: "state_changed", state: "thinking" },
        { type: "flow_step", stepId: "request", status: "completed" },
        { type: "flow_step", stepId: "intent", status: "active" },
      ],
    },
    {
      at: 1500,
      events: [
        { type: "flow_step", stepId: "intent", status: "completed" },
        { type: "flow_step", stepId: "search", status: "active" },
        { type: "state_changed", state: "recalling" },
      ],
    },
    {
      at: 2000,
      events: [
        { type: "memory_access", nodeIds: ["marcus"] },
        { type: "file_opened", path: "people/Marcus.md" },
      ],
    },
    {
      at: 2400,
      events: [
        { type: "memory_access", nodeIds: ["marcus", "friday-ai"] },
        { type: "file_opened", path: "projects/Friday-AI.md" },
      ],
    },
    {
      at: 2800,
      events: [
        { type: "memory_access", nodeIds: ["marcus", "friday-ai", "a2p"] },
        { type: "file_opened", path: "projects/A2P.md" },
      ],
    },
    {
      at: 3200,
      events: [
        { type: "memory_access", nodeIds: ["marcus", "friday-ai", "a2p", "website"] },
        { type: "file_opened", path: "projects/Websites.md" },
      ],
    },
    {
      at: 3700,
      events: [
        { type: "flow_step", stepId: "search", status: "completed" },
        { type: "flow_step", stepId: "context", status: "active" },
      ],
    },
    {
      at: 4200,
      events: [
        { type: "flow_step", stepId: "context", status: "completed" },
        { type: "flow_step", stepId: "tools", status: "active" },
        { type: "state_changed", state: "executing" },
        { type: "tool_started", tool: "google-calendar" },
      ],
    },
    {
      at: 5000,
      events: [
        { type: "tool_completed", tool: "google-calendar" },
        { type: "flow_step", stepId: "tools", status: "completed" },
        { type: "state_changed", state: "thinking" },
        { type: "flow_step", stepId: "generate", status: "active" },
      ],
    },
    {
      at: 6000,
      events: [
        { type: "flow_step", stepId: "generate", status: "completed" },
        { type: "flow_step", stepId: "voice", status: "active" },
        { type: "state_changed", state: "speaking" },
        { type: "speech_started" },
        { type: "transcript_agent", text: voiceLines[0] },
      ],
    },
    { at: 7000, events: [{ type: "transcript_agent", text: voiceLines[1] }] },
    { at: 8000, events: [{ type: "transcript_agent", text: voiceLines[2] }] },
    { at: 9000, events: [{ type: "transcript_agent", text: voiceLines[3] }] },
    {
      at: 10000,
      events: [
        { type: "speech_finished" },
        { type: "flow_step", stepId: "voice", status: "completed" },
        { type: "flow_step", stepId: "complete", status: "completed" },
        { type: "state_changed", state: "idle" },
      ],
    },
  ]);
}

/**
 * Short mocked sequence for arbitrary commands that aren't about Marcus.
 */
export function runGenericDemo(userText: string) {
  const reply =
    "Logged. I don't have a live workflow for that yet — once Hermes is connected I'll route it for real.";

  void getVoiceProvider().speak(reply);

  play([
    {
      at: 0,
      events: [
        { type: "transcript_user", text: userText },
        { type: "state_changed", state: "listening" },
        { type: "flow_step", stepId: "request", status: "active" },
      ],
    },
    {
      at: 600,
      events: [
        { type: "state_changed", state: "thinking" },
        { type: "flow_step", stepId: "request", status: "completed" },
        { type: "flow_step", stepId: "intent", status: "active" },
      ],
    },
    {
      at: 1300,
      events: [
        { type: "flow_step", stepId: "intent", status: "completed" },
        { type: "flow_step", stepId: "search", status: "active" },
        { type: "state_changed", state: "recalling" },
        { type: "memory_access", nodeIds: ["x-cerebro"] },
      ],
    },
    {
      at: 2100,
      events: [
        { type: "flow_step", stepId: "search", status: "completed" },
        { type: "flow_step", stepId: "context", status: "completed" },
        { type: "flow_step", stepId: "tools", status: "completed" },
        { type: "flow_step", stepId: "generate", status: "active" },
        { type: "state_changed", state: "thinking" },
      ],
    },
    {
      at: 2900,
      events: [
        { type: "flow_step", stepId: "generate", status: "completed" },
        { type: "flow_step", stepId: "voice", status: "active" },
        { type: "state_changed", state: "speaking" },
        { type: "speech_started" },
        { type: "transcript_agent", text: reply },
      ],
    },
    {
      at: 4700,
      events: [
        { type: "speech_finished" },
        { type: "flow_step", stepId: "voice", status: "completed" },
        { type: "flow_step", stepId: "complete", status: "completed" },
        { type: "state_changed", state: "idle" },
      ],
    },
  ]);
}

/** Route a typed command to the right mocked sequence. */
export function runCommand(text: string) {
  if (sequenceRunning) return;
  if (text.toLowerCase().includes("marcus")) {
    runMarcusDemo(text);
  } else {
    runGenericDemo(text);
  }
}
