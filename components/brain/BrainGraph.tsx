"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { brainNodes, brainLinks, type BrainNode, type BrainNodeType } from "@/data/brain";
import { useAgentRuntime } from "@/lib/agent-runtime";

// react-force-graph-2d touches window at module scope — must skip SSR.
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
}) as unknown as React.ComponentType<Record<string, unknown>>;

// Muted, tasteful category tints — blues/steels with gold reserved for clients.
const TYPE_COLORS: Record<BrainNodeType, string> = {
  person: "#93a7c4",
  company: "#6c86ad",
  client: "#d8b26e",
  project: "#4d9fff",
  tool: "#5f9ba8",
  memory: "#7a8aa8",
  task: "#b08968",
  meeting: "#9a8fc0",
};

const TYPE_RADIUS: Partial<Record<BrainNodeType, number>> = {
  client: 7,
  company: 6.5,
  project: 6,
  person: 6,
};

interface GraphNode extends BrainNode {
  x?: number;
  y?: number;
}

export default function BrainGraph({
  active,
  onNodeClick,
}: {
  active: boolean;
  onNodeClick: (node: BrainNode) => void;
}) {
  const { activeNodeIds } = useAgentRuntime();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Track container size so the canvas fills the pane. Measure directly
  // whenever the tab activates (the pane starts hidden with display:none),
  // with a ResizeObserver as backup for live resizes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  // force-graph mutates its data objects (adds coordinates), so hand it clones.
  const graphData = useMemo(
    () => ({
      nodes: brainNodes.map((n) => ({ ...n })),
      links: brainLinks.map((l) => ({ ...l })),
    }),
    []
  );

  const activeSet = useMemo(() => new Set(activeNodeIds), [activeNodeIds]);
  const hasActive = activeSet.size > 0;

  const nodeCanvasObject = (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const active = activeSet.has(node.id);
    const dimmed = hasActive && !active;
    const color = TYPE_COLORS[node.type] ?? "#7a8aa8";
    const radius = (TYPE_RADIUS[node.type] ?? 5) * (active ? 1.35 : 1);

    ctx.globalAlpha = dimmed ? 0.22 : 1;

    if (active) {
      ctx.beginPath();
      ctx.arc(x, y, radius + 6, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(77, 159, 255, 0.15)";
      ctx.fill();
      ctx.shadowColor = "#4d9fff";
      ctx.shadowBlur = 14;
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = active ? "#bcd8ff" : color;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.lineWidth = 0.8;
    ctx.strokeStyle = active ? "#4d9fff" : "rgba(232, 236, 244, 0.25)";
    ctx.stroke();

    if (globalScale > 0.8 || active) {
      const fontSize = Math.max(3.5, 11 / globalScale);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = active ? "#e8ecf4" : "rgba(200, 210, 228, 0.75)";
      ctx.fillText(node.name, x, y + radius + 3);
    }

    ctx.globalAlpha = 1;
  };

  const nodePointerAreaPaint = (node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, 12, 0, 2 * Math.PI);
    ctx.fill();
  };

  const linkColor = (link: { source: GraphNode | string; target: GraphNode | string }) => {
    const sourceId = typeof link.source === "object" ? link.source.id : link.source;
    const targetId = typeof link.target === "object" ? link.target.id : link.target;
    const litLink = activeSet.has(sourceId) && activeSet.has(targetId);
    if (litLink) return "rgba(77, 159, 255, 0.85)";
    if (hasActive) return "rgba(120, 160, 255, 0.06)";
    return "rgba(120, 160, 255, 0.18)";
  };

  const linkWidth = (link: { source: GraphNode | string; target: GraphNode | string }) => {
    const sourceId = typeof link.source === "object" ? link.source.id : link.source;
    const targetId = typeof link.target === "object" ? link.target.id : link.target;
    return activeSet.has(sourceId) && activeSet.has(targetId) ? 1.8 : 0.6;
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      {size.width > 0 && size.height > 0 && (
        <ForceGraph2D
          width={size.width}
          height={size.height}
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={nodePointerAreaPaint}
          linkColor={linkColor}
          linkWidth={linkWidth}
          onNodeClick={(node: GraphNode) => onNodeClick(node)}
          cooldownTicks={120}
          d3VelocityDecay={0.35}
        />
      )}
    </div>
  );
}
