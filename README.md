# X Cerebro — Voice Command Center

A JARVIS-style AI operating system frontend: animated voice orb, Obsidian-style
memory graph, and a live execution flow — all driven by a single agent event
stream. Phase 1 is fully mocked; no external APIs are required.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000, then click **RUN MARCUS DEMO** (or type a command
containing "Marcus" into the input). Production build: `npm run build`.

## The three modes

- **COMMAND** — voice orb (idle / listening / thinking / recalling / executing /
  speaking / error), status readout, simulated waveform, system-dialogue
  transcript, ACTIVE CONTEXT panel, and operational ACTIVITY feed.
- **BRAIN** — interactive force-directed knowledge graph
  (`react-force-graph-2d`). Zoom, pan, drag, click a node for its detail panel.
  When the agent accesses memory, the touched nodes light up and everything
  else dims.
- **LIVE FLOW** — React Flow execution pipeline (USER REQUEST → … → COMPLETE)
  with per-step status and an expandable USE TOOLS sub-flow (Google Calendar,
  Gmail, Jarvis, Browser).

All three views stay mounted; tabs only toggle visibility, so state never
resets when you switch.

## Architecture

```
Hermes (future)  ──▶  Agent Event Stream  ──▶  X Cerebro Runtime (lib/agent-runtime.ts)
                                                      │
                              ┌───────────────┬───────┴────────┐
                              │ Command View  │ Brain Graph    │ Live Flow
                              └───────────────┴────────────────┘
                                                      │
                                            ElevenLabs Voice (future)
```

### Event system

- `types/agent.ts` — the `AgentEvent` discriminated union (`state_changed`,
  `memory_access`, `file_opened`, `tool_started`, `tool_completed`,
  `flow_step`, `transcript_user`, `transcript_agent`, `speech_started`,
  `speech_finished`). This is the wire contract for everything.
- `lib/agent-runtime.ts` — a tiny external store. `dispatch(event)` runs a pure
  reducer that folds events into one `RuntimeSnapshot` (agent state, status
  label, transcript, activity feed, active memory nodes, tool status, flow step
  status). `useAgentRuntime()` (built on `useSyncExternalStore`) is how every
  component subscribes. **One event stream, multiple visualizations** — no
  component fakes its own state.
- `lib/demo-sequence.ts` — the mocked event source. `runMarcusDemo()` plays a
  timed timeline of the exact events a real Hermes run would emit;
  `runCommand(text)` routes typed input (mentions of "Marcus" → full demo,
  anything else → a short generic sequence).

### Where Hermes plugs in (Phase 2)

`lib/hermes.ts`. Hermes will stream `AgentEvent` JSON over SSE/WebSocket from
`HERMES_API_URL`; a thin client forwards each message to `dispatch()`. The demo
sequencer and Hermes are interchangeable event sources — no UI changes needed.

### Where ElevenLabs plugs in (Phase 2)

`lib/voice.ts` defines the `VoiceProvider` interface; the demo uses
`MockVoiceProvider`. The real `ElevenLabsVoiceProvider` will call a
server-side API route (keys stay in `ELEVENLABS_API_KEY` /
`ELEVENLABS_VOICE_ID`, never in client code), play the returned audio, and feed
a Web Audio analyser so `Waveform.tsx` renders real levels instead of
randomized ones.

### Where Markdown brain parsing comes next

`brain/` is a real Obsidian-style vault (people / companies / projects / tools
/ daily, with frontmatter + `[[wiki links]]`). Phase 1 renders the graph from
the hand-built `data/brain.ts`. Phase 2 adds a build-time (or API-route)
parser that walks `brain/`, reads frontmatter for node types, and turns
`[[links]]` into graph edges — replacing `data/brain.ts` as the source of
truth.

## Layout

```
app/                 Next.js app router shell (page.tsx hosts the three tabs)
components/command/  Orb, waveform, transcript, context panel, activity feed
components/brain/    Force graph + node detail panel
components/flow/     React Flow pipeline + custom nodes
lib/                 agent-runtime (store), demo-sequence, voice, hermes
data/                brain.ts (graph data), flow.ts (pipeline + tool defs)
types/agent.ts       AgentEvent contract
brain/               Sample Obsidian vault
```
