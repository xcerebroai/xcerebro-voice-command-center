export interface FlowStepDef {
  id: string;
  label: string;
  sublabel?: string;
}

export const flowSteps: FlowStepDef[] = [
  { id: "request", label: "USER REQUEST", sublabel: "Voice / text input" },
  { id: "intent", label: "UNDERSTAND INTENT", sublabel: "Parse the request" },
  { id: "search", label: "SEARCH MEMORY", sublabel: "Obsidian brain lookup" },
  { id: "context", label: "SELECT CONTEXT", sublabel: "Rank relevant nodes" },
  { id: "tools", label: "USE TOOLS", sublabel: "External integrations" },
  { id: "generate", label: "GENERATE RESPONSE", sublabel: "Compose answer" },
  { id: "voice", label: "ELEVENLABS VOICE", sublabel: "Speech synthesis" },
  { id: "complete", label: "COMPLETE", sublabel: "Request finished" },
];

export interface ToolDef {
  id: string;
  label: string;
}

export const toolDefs: ToolDef[] = [
  { id: "google-calendar", label: "Google Calendar" },
  { id: "gmail", label: "Gmail" },
  { id: "jarvis", label: "Jarvis" },
  { id: "browser", label: "Browser" },
];
