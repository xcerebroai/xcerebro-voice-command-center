"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  type LucideIcon,
} from "lucide-react";
import type { FlowStepStatus } from "@/types/agent";

export interface FlowNodeData {
  label: string;
  sublabel?: string;
  status: FlowStepStatus;
  icon?: LucideIcon;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  compact?: boolean;
  [key: string]: unknown;
}

function StatusBadge({ status }: { status: FlowStepStatus }) {
  if (status === "completed") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-accent">
        <Check size={10} strokeWidth={3} />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute h-3 w-3 animate-ping rounded-full bg-accent/40" />
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(77,159,255,0.9)]" />
      </span>
    );
  }
  if (status === "error") {
    return <CircleAlert size={14} className="text-[#e06c6c]" />;
  }
  return <span className="h-2 w-2 rounded-full border border-muted/50" />;
}

function FlowNodeInner({ data }: NodeProps) {
  const d = data as FlowNodeData;
  const Icon = d.icon;
  const active = d.status === "active";
  const completed = d.status === "completed";

  return (
    <div
      className={`rounded-lg border px-4 transition-all duration-300 ${
        d.compact ? "min-w-[170px] py-2" : "min-w-[230px] py-3"
      } ${
        active
          ? "border-accent/60 bg-accent/10 shadow-[0_0_24px_rgba(77,159,255,0.18)]"
          : completed
            ? "border-accent/25 bg-panel"
            : "border-line bg-panel opacity-80"
      }`}
    >
      <Handle type="target" position={d.compact ? Position.Left : Position.Top} className="!bg-accent/40 !border-0 !h-1.5 !w-1.5" />
      <div className="flex items-center gap-3">
        <StatusBadge status={d.status} />
        {Icon && <Icon size={14} className={active ? "text-accent" : "text-muted"} />}
        <div className="flex-1">
          <div
            className={`font-mono text-[11px] tracking-[0.15em] ${
              active ? "text-ink" : completed ? "text-ink/85" : "text-muted"
            }`}
          >
            {d.label}
          </div>
          {d.sublabel && !d.compact && (
            <div className="mt-0.5 text-[10px] text-muted/70">{d.sublabel}</div>
          )}
        </div>
        {d.expandable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              d.onToggle?.();
            }}
            className="text-muted transition-colors hover:text-ink"
            aria-label="Toggle tool sub-flow"
          >
            {d.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>
      <Handle type="source" position={d.compact ? Position.Right : Position.Bottom} className="!bg-accent/40 !border-0 !h-1.5 !w-1.5" />
    </div>
  );
}

export default memo(FlowNodeInner);
