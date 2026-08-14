export type BrainNodeType =
  | "person"
  | "company"
  | "client"
  | "project"
  | "tool"
  | "memory"
  | "task"
  | "meeting";

export interface BrainNode {
  id: string;
  name: string;
  type: BrainNodeType;
  file?: string;
  status?: string;
  recentActivity?: string[];
}

export interface BrainLink {
  source: string;
  target: string;
}

export const brainNodes: BrainNode[] = [
  { id: "lex", name: "Lex", type: "person", file: "people/Lex.md", status: "Operator" },
  { id: "q", name: "Q", type: "person", file: "people/Q.md", status: "Partner" },
  {
    id: "marcus",
    name: "Marcus",
    type: "client",
    file: "people/Marcus.md",
    status: "Active",
    recentActivity: ["A2P registration pending", "Website build active"],
  },
  { id: "mark", name: "Mark", type: "person", file: "people/Mark.md" },
  { id: "dyan", name: "Dyan", type: "person", file: "people/Dyan.md" },
  { id: "jarvis", name: "Jarvis", type: "company", file: "companies/Jarvis.md", status: "Active" },
  { id: "ai-cheat-codes", name: "AI Cheat Codes", type: "company", file: "companies/AI-Cheat-Codes.md" },
  {
    id: "x-cerebro",
    name: "X Cerebro",
    type: "company",
    file: "companies/X-Cerebro.md",
    status: "In development",
    recentActivity: ["Command center Phase 1 build"],
  },
  {
    id: "friday-ai",
    name: "Friday AI",
    type: "project",
    file: "projects/Friday-AI.md",
    status: "Active",
    recentActivity: ["Website build active"],
  },
  {
    id: "a2p",
    name: "A2P Registration",
    type: "task",
    file: "projects/A2P.md",
    status: "Pending",
    recentActivity: ["Awaiting carrier approval details"],
  },
  {
    id: "website",
    name: "Website",
    type: "project",
    file: "projects/Websites.md",
    status: "In progress",
    recentActivity: ["Friday AI site under construction"],
  },
  { id: "voice-agent", name: "Voice Agent", type: "project", file: "projects/Voice-Agent.md", status: "Active" },
  { id: "elevenlabs", name: "ElevenLabs", type: "tool", file: "tools/ElevenLabs.md" },
  { id: "hermes", name: "Hermes", type: "tool", file: "tools/Hermes.md" },
  { id: "google-calendar", name: "Google Calendar", type: "tool", file: "tools/Google-Calendar.md" },
  { id: "gmail", name: "Gmail", type: "tool", file: "tools/Gmail.md" },
  { id: "revenue", name: "Revenue", type: "memory" },
  { id: "clients", name: "Clients", type: "memory" },
  { id: "projects", name: "Projects", type: "memory" },
  { id: "meetings", name: "Meetings", type: "meeting" },
  { id: "content", name: "Content", type: "memory" },
  { id: "tasks", name: "Tasks", type: "task" },
];

export const brainLinks: BrainLink[] = [
  { source: "lex", target: "x-cerebro" },
  { source: "lex", target: "ai-cheat-codes" },
  { source: "lex", target: "clients" },
  { source: "q", target: "jarvis" },
  { source: "q", target: "x-cerebro" },
  { source: "mark", target: "ai-cheat-codes" },
  { source: "dyan", target: "content" },
  { source: "marcus", target: "friday-ai" },
  { source: "marcus", target: "a2p" },
  { source: "marcus", target: "website" },
  { source: "marcus", target: "clients" },
  { source: "friday-ai", target: "voice-agent" },
  { source: "friday-ai", target: "website" },
  { source: "voice-agent", target: "elevenlabs" },
  { source: "voice-agent", target: "hermes" },
  { source: "hermes", target: "x-cerebro" },
  { source: "elevenlabs", target: "x-cerebro" },
  { source: "jarvis", target: "revenue" },
  { source: "jarvis", target: "clients" },
  { source: "google-calendar", target: "meetings" },
  { source: "gmail", target: "clients" },
  { source: "x-cerebro", target: "google-calendar" },
  { source: "x-cerebro", target: "gmail" },
  { source: "a2p", target: "tasks" },
  { source: "website", target: "projects" },
  { source: "friday-ai", target: "projects" },
  { source: "voice-agent", target: "projects" },
  { source: "meetings", target: "clients" },
  { source: "content", target: "ai-cheat-codes" },
  { source: "revenue", target: "clients" },
];

export function getNode(id: string): BrainNode | undefined {
  return brainNodes.find((n) => n.id === id);
}

export function getRelated(id: string): BrainNode[] {
  const ids = new Set<string>();
  for (const link of brainLinks) {
    if (link.source === id) ids.add(link.target);
    if (link.target === id) ids.add(link.source);
  }
  return brainNodes.filter((n) => ids.has(n.id));
}
