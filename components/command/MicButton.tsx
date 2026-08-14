"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { dispatch } from "@/lib/agent-runtime";
import { runCommand, isSequenceRunning } from "@/lib/demo-sequence";

/**
 * Voice input via the browser's built-in Web Speech API (Chrome/Edge).
 * No API key needed and it runs fully client-side, so it works on the
 * static GitHub Pages deployment too. Phase 2 can swap this for a
 * higher-quality STT pipeline without touching the rest of the app —
 * it ends in the same runCommand() call as typed input.
 */

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function MicButton() {
  const [supported, setSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const gotResultRef = useRef(false);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => recognitionRef.current?.abort();
  }, []);

  function toggle() {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }
    if (isSequenceRunning()) return;

    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    gotResultRef.current = false;

    recognition.onstart = () => {
      setRecording(true);
      dispatch({ type: "state_changed", state: "listening", timestamp: Date.now() });
    };
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim();
      if (text) {
        gotResultRef.current = true;
        runCommand(text);
      }
    };
    recognition.onerror = () => {
      setRecording(false);
    };
    recognition.onend = () => {
      setRecording(false);
      // If nothing was heard (and no sequence took over), drop back to standby.
      if (!gotResultRef.current && !isSequenceRunning()) {
        dispatch({ type: "state_changed", state: "idle", timestamp: Date.now() });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  if (!supported) {
    return (
      <div
        className="flex h-11 items-center rounded-lg border border-line bg-panel px-3 font-mono text-[9px] text-muted/60"
        title="Voice input needs Chrome or Edge (Web Speech API)"
      >
        NO MIC API
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={recording ? "Stop listening" : "Talk to X Cerebro (Chrome/Edge)"}
      aria-label={recording ? "Stop listening" : "Start voice input"}
      className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
        recording
          ? "border-gold/60 bg-gold/15 text-gold shadow-[0_0_18px_rgba(216,178,110,0.25)]"
          : "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
      }`}
    >
      {recording ? <Square size={14} className="animate-pulse" /> : <Mic size={15} />}
    </button>
  );
}
