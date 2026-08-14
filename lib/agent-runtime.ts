"use client";

import { useSyncExternalStore } from "react";
import type { AgentEvent, AgentState, FlowStepStatus } from "@/types/agent";
import { flowSteps } from "@/data/flow";
import { getNode } from "@/data/brain";

export interface TranscriptEntry {
  id: number;
  role: "user" | "agent";
  segments: string[];
}

export interface ActivityEntry {
  id: number;
  timestamp: number;
  text: string;
}

export interface RuntimeSnapshot {
  state: AgentState;
  statusLabel: string;
  transcript: TranscriptEntry[];
  activity: ActivityEntry[];
  /** Brain node ids currently lit up as "active memory". */
  activeNodeIds: string[];
  /** Files the agent has opened during the current run. */
  openedFiles: string[];
  activeTools: string[];
  completedTools: string[];
  steps: Record<string, FlowStepStatus>;
  running: boolean;
  events: AgentEvent[];
}

const STATE_LABELS: Record<AgentState, string> = {
  idle: "STANDBY",
  listening: "LISTENING",
  thinking: "THINKING",
  recalling: "SEARCHING MEMORY",
  executing: "EXECUTING",
  speaking: "SPEAKING",
  error: "ERROR",
};

const TOOL_LABELS: Record<string, string> = {
  "google-calendar": "CHECKING CALENDAR",
  gmail: "CHECKING GMAIL",
  jarvis: "QUERYING JARVIS",
  browser: "BROWSING",
};

function initialSteps(): Record<string, FlowStepStatus> {
  const steps: Record<string, FlowStepStatus> = {};
  for (const s of flowSteps) steps[s.id] = "pending";
  return steps;
}

function initialSnapshot(): RuntimeSnapshot {
  return {
    state: "idle",
    statusLabel: "STANDBY",
    transcript: [],
    activity: [],
    activeNodeIds: [],
    openedFiles: [],
    activeTools: [],
    completedTools: [],
    steps: initialSteps(),
    running: false,
    events: [],
  };
}

let snapshot: RuntimeSnapshot = initialSnapshot();
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function pushActivity(next: RuntimeSnapshot, timestamp: number, text: string) {
  next.activity = [...next.activity, { id: nextId++, timestamp, text }];
}

function fileName(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

/**
 * The single reducer every view is driven by. Hermes will eventually push
 * these exact event objects over a stream; nothing in the UI knows (or cares)
 * whether an event came from the demo sequencer or a live agent.
 */
function reduce(prev: RuntimeSnapshot, event: AgentEvent): RuntimeSnapshot {
  const next: RuntimeSnapshot = { ...prev, events: [...prev.events, event] };

  switch (event.type) {
    case "state_changed": {
      next.state = event.state;
      next.statusLabel = STATE_LABELS[event.state];
      if (event.state === "listening") {
        pushActivity(next, event.timestamp, "Request received");
      }
      if (event.state === "recalling") {
        pushActivity(next, event.timestamp, "Searching memory");
      }
      break;
    }
    case "memory_access": {
      const previous = new Set(prev.activeNodeIds);
      const added = event.nodeIds.filter((id) => !previous.has(id));
      next.activeNodeIds = event.nodeIds;
      for (const id of added) {
        const node = getNode(id);
        if (node) pushActivity(next, event.timestamp, `Memory node active: ${node.name}`);
      }
      break;
    }
    case "file_opened": {
      if (!prev.openedFiles.includes(event.path)) {
        next.openedFiles = [...prev.openedFiles, event.path];
      }
      pushActivity(next, event.timestamp, `Found ${fileName(event.path)}`);
      break;
    }
    case "tool_started": {
      if (!prev.activeTools.includes(event.tool)) {
        next.activeTools = [...prev.activeTools, event.tool];
      }
      next.statusLabel = TOOL_LABELS[event.tool] ?? `RUNNING ${event.tool.toUpperCase()}`;
      const node = getNode(event.tool);
      pushActivity(next, event.timestamp, `Checking ${node?.name ?? event.tool}`);
      break;
    }
    case "tool_completed": {
      next.activeTools = prev.activeTools.filter((t) => t !== event.tool);
      if (!prev.completedTools.includes(event.tool)) {
        next.completedTools = [...prev.completedTools, event.tool];
      }
      const node = getNode(event.tool);
      pushActivity(next, event.timestamp, `${node?.name ?? event.tool} check complete`);
      break;
    }
    case "flow_step": {
      next.steps = { ...prev.steps, [event.stepId]: event.status };
      if (event.stepId === "search" && event.status === "completed") {
        pushActivity(
          next,
          event.timestamp,
          `Found ${next.activeNodeIds.length} relevant memory nodes`
        );
      }
      if (event.stepId === "generate" && event.status === "active") {
        next.statusLabel = "BUILDING RESPONSE";
        pushActivity(next, event.timestamp, "Generating response");
      }
      if (event.stepId === "complete" && event.status === "completed") {
        pushActivity(next, event.timestamp, "Request complete");
      }
      break;
    }
    case "transcript_user": {
      next.transcript = [
        ...prev.transcript,
        { id: nextId++, role: "user", segments: [event.text] },
      ];
      break;
    }
    case "transcript_agent": {
      const last = prev.transcript[prev.transcript.length - 1];
      if (last && last.role === "agent") {
        const updated: TranscriptEntry = { ...last, segments: [...last.segments, event.text] };
        next.transcript = [...prev.transcript.slice(0, -1), updated];
      } else {
        next.transcript = [
          ...prev.transcript,
          { id: nextId++, role: "agent", segments: [event.text] },
        ];
      }
      break;
    }
    case "speech_started": {
      pushActivity(next, event.timestamp, "Voice started");
      break;
    }
    case "speech_finished": {
      pushActivity(next, event.timestamp, "Voice finished");
      break;
    }
  }

  return next;
}

export function dispatch(event: AgentEvent) {
  snapshot = reduce(snapshot, event);
  emit();
}

/** Clears per-run state (flow, memory highlights, tools) but keeps the transcript history. */
export function resetRun() {
  snapshot = {
    ...snapshot,
    state: "idle",
    statusLabel: "STANDBY",
    activeNodeIds: [],
    openedFiles: [],
    activeTools: [],
    completedTools: [],
    steps: initialSteps(),
  };
  emit();
}

export function setRunning(running: boolean) {
  snapshot = { ...snapshot, running };
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): RuntimeSnapshot {
  return snapshot;
}

const serverSnapshot = initialSnapshot();
function getServerSnapshot(): RuntimeSnapshot {
  return serverSnapshot;
}

/**
 * Every view subscribes to the same store through this hook.
 * One event stream → Command view, Brain graph, Live Flow.
 */
export function useAgentRuntime(): RuntimeSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
