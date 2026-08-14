"use client";

import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Mic,
  Brain,
  Search,
  Layers,
  Wrench,
  MessageSquareText,
  AudioLines,
  CheckCircle2,
  Calendar,
  Mail,
  Bot,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { flowSteps, toolDefs } from "@/data/flow";
import { useAgentRuntime } from "@/lib/agent-runtime";
import type { FlowStepStatus } from "@/types/agent";
import FlowNode from "./FlowNode";

const nodeTypes = { step: FlowNode };

const STEP_ICONS: Record<string, LucideIcon> = {
  request: Mic,
  intent: Brain,
  search: Search,
  context: Layers,
  tools: Wrench,
  generate: MessageSquareText,
  voice: AudioLines,
  complete: CheckCircle2,
};

const TOOL_ICONS: Record<string, LucideIcon> = {
  "google-calendar": Calendar,
  gmail: Mail,
  jarvis: Bot,
  browser: Globe,
};

const STEP_GAP = 96;
const TOOLS_X_OFFSET = 330;

export default function AgentFlow() {
  const { steps, activeTools, completedTools } = useAgentRuntime();
  const [toolsExpanded, setToolsExpanded] = useState(true);

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = flowSteps.map((step, i) => ({
      id: step.id,
      type: "step",
      position: { x: 0, y: i * STEP_GAP },
      draggable: false,
      data: {
        label: step.label,
        sublabel: step.sublabel,
        status: steps[step.id] ?? "pending",
        icon: STEP_ICONS[step.id],
        expandable: step.id === "tools",
        expanded: toolsExpanded,
        onToggle: () => setToolsExpanded((v) => !v),
      },
    }));

    const edges: Edge[] = flowSteps.slice(0, -1).map((step, i) => {
      const next = flowSteps[i + 1];
      const nextStatus = steps[next.id] ?? "pending";
      return {
        id: `${step.id}->${next.id}`,
        source: step.id,
        target: next.id,
        animated: nextStatus === "active",
        style: {
          stroke:
            nextStatus === "active"
              ? "#4d9fff"
              : nextStatus === "completed"
                ? "rgba(77,159,255,0.4)"
                : "rgba(120,160,255,0.18)",
          strokeWidth: nextStatus === "active" ? 1.8 : 1,
        },
      };
    });

    if (toolsExpanded) {
      const toolsIndex = flowSteps.findIndex((s) => s.id === "tools");
      const baseY = toolsIndex * STEP_GAP - ((toolDefs.length - 1) * 58) / 2;

      for (let i = 0; i < toolDefs.length; i++) {
        const tool = toolDefs[i];
        const status: FlowStepStatus = activeTools.includes(tool.id)
          ? "active"
          : completedTools.includes(tool.id)
            ? "completed"
            : "pending";

        nodes.push({
          id: `tool-${tool.id}`,
          type: "step",
          position: { x: TOOLS_X_OFFSET, y: baseY + i * 58 },
          draggable: false,
          data: {
            label: tool.label,
            status,
            icon: TOOL_ICONS[tool.id],
            compact: true,
          },
        });

        edges.push({
          id: `tools->tool-${tool.id}`,
          source: "tools",
          target: `tool-${tool.id}`,
          animated: status === "active",
          style: {
            stroke:
              status === "active"
                ? "#d8b26e"
                : status === "completed"
                  ? "rgba(216,178,110,0.45)"
                  : "rgba(120,160,255,0.12)",
            strokeWidth: status === "active" ? 1.6 : 1,
            strokeDasharray: "4 3",
          },
        });
      }
    }

    return { nodes, edges };
  }, [steps, activeTools, completedTools, toolsExpanded]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.4}
      maxZoom={1.6}
      nodesConnectable={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={26} size={1} color="rgba(120,160,255,0.12)" />
      <Controls showInteractive={false} position="bottom-right" />
    </ReactFlow>
  );
}
