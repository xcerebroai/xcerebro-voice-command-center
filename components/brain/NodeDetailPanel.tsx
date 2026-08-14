"use client";

import { X, FileText } from "lucide-react";
import { getRelated, type BrainNode } from "@/data/brain";

export default function NodeDetailPanel({
  node,
  onClose,
}: {
  node: BrainNode;
  onClose: () => void;
}) {
  const related = getRelated(node.id);

  return (
    <div className="panel absolute right-4 top-4 z-10 w-72 p-5">
      <div className="flex items-start justify-between">
        <div className="font-mono text-sm tracking-[0.25em] text-ink">
          {node.name.toUpperCase()}
        </div>
        <button
          onClick={onClose}
          className="text-muted transition-colors hover:text-ink"
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-4 text-sm">
        <div>
          <div className="panel-title">TYPE</div>
          <div className="mt-1 capitalize text-ink/90">{node.type}</div>
        </div>

        {related.length > 0 && (
          <div>
            <div className="panel-title">RELATED</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {related.map((r) => (
                <span
                  key={r.id}
                  className="rounded border border-line bg-panel2 px-2 py-0.5 text-xs text-ink/80"
                >
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {node.file && (
          <div>
            <div className="panel-title">FILES</div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-accent/90">
              <FileText size={12} />
              brain/{node.file}
            </div>
          </div>
        )}

        {node.status && (
          <div>
            <div className="panel-title">STATUS</div>
            <div className="mt-1 text-ink/90">{node.status}</div>
          </div>
        )}

        {node.recentActivity && node.recentActivity.length > 0 && (
          <div>
            <div className="panel-title">RECENT ACTIVITY</div>
            <ul className="mt-1.5 space-y-1">
              {node.recentActivity.map((a, i) => (
                <li key={i} className="flex gap-2 text-xs text-ink/80">
                  <span className="text-gold">•</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
