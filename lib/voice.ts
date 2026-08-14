/**
 * Voice provider abstraction.
 *
 * Phase 1 ships MockVoiceProvider only. Phase 2 will add
 * ElevenLabsVoiceProvider, implemented against a server-side API route
 * (app/api/voice/route.ts) so the ELEVENLABS_API_KEY never reaches the
 * client. The route will call the ElevenLabs TTS endpoint with
 * process.env.ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID and stream audio
 * back; the client provider will play it through a Web Audio analyser so
 * the Waveform component can render real levels.
 */
export interface VoiceProvider {
  speak(text: string): Promise<void>;
  stop(): void;
}

export class MockVoiceProvider implements VoiceProvider {
  private cancelled = false;

  async speak(text: string): Promise<void> {
    this.cancelled = false;
    // Roughly 150 wpm reading speed, just so the promise lifetime feels real.
    const words = text.split(/\s+/).length;
    const durationMs = Math.min(12000, Math.max(1200, (words / 2.5) * 1000));
    console.log(`[MockVoiceProvider] speaking ${words} words (~${Math.round(durationMs)}ms)`);
    await new Promise((resolve) => setTimeout(resolve, durationMs));
    if (!this.cancelled) {
      console.log("[MockVoiceProvider] finished");
    }
  }

  stop(): void {
    this.cancelled = true;
  }
}

let provider: VoiceProvider | null = null;

export function getVoiceProvider(): VoiceProvider {
  if (!provider) provider = new MockVoiceProvider();
  return provider;
}
