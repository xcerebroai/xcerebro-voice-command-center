"use client";

import { useAgentRuntime } from "@/lib/agent-runtime";

interface ContextItem {
  id: string;
  name: string;
  kind: string;
}

const CONTEXT_ITEMS: ContextItem[] = [
  { id: "marcus", name: "Marcus", kind: "Client" },
  { id: "a2p", name: "A2P Registration", kind: "Project" },
  { id: "friday-ai", name: "Friday AI", kind: "Product" },
  { id: "website", name: "Website", kind: "Project" },
  { id: "google-calendar", name: "Google Calendar", kind: "Tool" },
];

export default function ActiveContext() {
  const { activeNodeIds, activeTools, completedTools } = useAgentRuntime();
  const lit = new Set([...activeNodeIds, ...activeTools, ...completedTools]);

  return (
    <div className="panel p-4">
      <div className="panel-title">ACTIVE CONTEXT</div>
      <div className="mt-3 space-y-2">
        {CONTEXT_ITEMS.map((item) => {
          const active = lit.has(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-lg border border-transparent px-3 py-2 transition-all duration-300 ${
                active ? "ctx-active" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    active ? "bg-accent shadow-[0_0_8px_rgba(77,159,255,0.8)]" : "bg-muted/40"
                  }`}
                />
                <span className={`text-sm ${active ? "text-ink" : "text-muted"}`}>
                  {item.name}
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted/70">
                {item.kind.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
