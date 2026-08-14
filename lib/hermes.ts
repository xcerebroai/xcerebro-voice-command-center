/**
 * Hermes adapter (placeholder).
 *
 * Phase 2 integration plan:
 *  - Hermes exposes an event stream (SSE or WebSocket) at HERMES_API_URL.
 *  - Each streamed message is an AgentEvent (types/agent.ts) — the exact
 *    discriminated union the UI already consumes.
 *  - A thin client here will open the stream and forward every event to
 *    dispatch() from lib/agent-runtime.ts. Nothing else in the app changes:
 *    the demo sequencer and Hermes are interchangeable event sources.
 *
 *  export function connectHermes(url = process.env.NEXT_PUBLIC_HERMES_API_URL) {
 *    const source = new EventSource(url);
 *    source.onmessage = (msg) => dispatch(JSON.parse(msg.data) as AgentEvent);
 *    return () => source.close();
 *  }
 */
export async function sendToHermes(message: string) {
  console.log("Hermes placeholder:", message);

  return {
    text: "Hermes integration not connected yet.",
  };
}
