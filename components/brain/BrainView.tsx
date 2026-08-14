"use client";

import { useState } from "react";
import type { BrainNode, BrainNodeType } from "@/data/brain";
import BrainGraph from "./BrainGraph";
import NodeDetailPanel from "./NodeDetailPanel";

const LEGEND: { type: BrainNodeType; label: string; color: string }[] = [
  { type: "person", label: "Person", color: "#93a7c4" },
  { type: "client", label: "Client", color: "#d8b26e" },
  { type: "company", label: "Company", color: "#6c86ad" },
  { type: "project", label: "Project", color: "#4d9fff" },
  { type: "tool", label: "Tool", color: "#5f9ba8" },
  { type: "task", label: "Task", color: "#b08968" },
  { type: "memory", label: "Memory", color: "#7a8aa8" },
  { type: "meeting", label: "Meeting", color: "#9a8fc0" },
];

export default function BrainView({ active }: { active: boolean }) {
  const [selected, setSelected] = useState<BrainNode | null>(null);

  return (
    <div className="panel relative h-full min-h-0 overflow-hidden">
      <div className="absolute left-4 top-4 z-10">
        <div className="panel-title">MEMORY GRAPH</div>
        <div className="mt-1 font-mono text-[10px] text-muted/60">
          drag · zoom · click a node
        </div>
      </div>

      <BrainGraph active={active} onNodeClick={setSelected} />

      {selected && <NodeDetailPanel node={selected} onClose={() => setSelected(null)} />}

      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-x-4 gap-y-1.5">
        {LEGEND.map((item) => (
          <div key={item.type} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color, opacity: 0.85 }}
            />
            <span className="font-mono text-[10px] tracking-wider text-muted">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
