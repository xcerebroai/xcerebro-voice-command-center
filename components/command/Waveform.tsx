"use client";

import { useEffect, useRef, useState } from "react";

const BAR_COUNT = 28;
const BASE_HEIGHT = 3;

/**
 * Simulated speech waveform. Randomized levels while speaking; bars decay
 * smoothly back to baseline otherwise. Phase 2 swaps the random generator
 * for real Web Audio analyser values from ElevenLabsVoiceProvider.
 */
export default function Waveform({ speaking }: { speaking: boolean }) {
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(BASE_HEIGHT));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setLevels((prev) =>
        prev.map((h, i) => {
          if (speaking) {
            // Center-weighted random levels for a voice-like envelope.
            const centerBoost = 1 - Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
            return BASE_HEIGHT + Math.random() * (10 + 26 * centerBoost);
          }
          return Math.max(BASE_HEIGHT, h * 0.65);
        })
      );
    }, 110);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [speaking]);

  return (
    <div className="flex h-12 items-center justify-center gap-[3px]" aria-hidden>
      {levels.map((h, i) => (
        <div key={i} className="waveform-bar" style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}
