export type AgentState =
  | "idle"
  | "listening"
  | "thinking"
  | "recalling"
  | "executing"
  | "speaking"
  | "error";

export type FlowStepStatus = "pending" | "active" | "completed" | "error";

export type AgentEvent =
  | {
      type: "state_changed";
      state: AgentState;
      timestamp: number;
    }
  | {
      type: "memory_access";
      nodeIds: string[];
      timestamp: number;
    }
  | {
      type: "file_opened";
      path: string;
      timestamp: number;
    }
  | {
      type: "tool_started";
      tool: string;
      timestamp: number;
    }
  | {
      type: "tool_completed";
      tool: string;
      timestamp: number;
    }
  | {
      type: "flow_step";
      stepId: string;
      status: FlowStepStatus;
      timestamp: number;
    }
  | {
      type: "transcript_user";
      text: string;
      timestamp: number;
    }
  | {
      type: "transcript_agent";
      text: string;
      timestamp: number;
    }
  | {
      type: "speech_started";
      timestamp: number;
    }
  | {
      type: "speech_finished";
      timestamp: number;
    };

/**
 * Helper: an AgentEvent without its timestamp, used by the demo sequencer,
 * which stamps events at dispatch time. Distributes over the union.
 */
export type UnstampedAgentEvent = AgentEvent extends infer E
  ? E extends { timestamp: number }
    ? Omit<E, "timestamp">
    : never
  : never;
