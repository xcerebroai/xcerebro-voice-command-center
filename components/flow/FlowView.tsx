"use client";

import { useEffect, useRef, useState } from "react";
import AgentFlow from "./AgentFlow";

export default function FlowView({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // React Flow needs a measured container; wait until this pane actually
  // has dimensions (it starts hidden behind another tab). Measure directly
  // whenever the tab activates, with a ResizeObserver as backup.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setReady(el.clientWidth > 0);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  return (
    <div className="panel relative h-full min-h-0 overflow-hidden">
      <div className="absolute left-4 top-4 z-10">
        <div className="panel-title">EXECUTION PIPELINE</div>
        <div className="mt-1 font-mono text-[10px] text-muted/60">
          live agent flow · expand USE TOOLS for sub-flows
        </div>
      </div>
      <div ref={containerRef} className="h-full w-full">
        {ready && <AgentFlow />}
      </div>
    </div>
  );
}
