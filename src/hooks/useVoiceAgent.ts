import { useState, useCallback, useRef } from "react";
import type { VoiceState, ProcessingIndicator, ConversationTurn } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

/** Delay (ms) before auto-restarting mic after AI finishes speaking */
const AUTO_RESTART_DELAY_MS = 700;

/** Phrases that trigger end-of-call when spoken by the user */
const END_CALL_PHRASES = [
  "stop",
  "bye",
  "goodbye",
  "end call",
  "thank you",
  "thanks",
  "bas karo",
  "dhanyavaad",
  "alvida",
  "band karo",
  "theek hai",
];

const INITIAL_INDICATORS: ProcessingIndicator[] = [
  {
    id: "memory",
    icon: "history",
    label: "Farm memory",
    completed: false,
  },
  {
    id: "weather",
    icon: "partly_cloudy_day",
    label: "Recent weather",
    completed: false,
  },
  {
    id: "crop",
    icon: "grass",
    label: "Crop context",
    completed: false,
  },
];


export interface VoiceAgentState {

  voiceState: VoiceState;

  transcript: string;

  aiResponse: string;

  processingIndicators: ProcessingIndicator[];

  conversationHistory: ConversationTurn[];

  /** Whether a call session is currently active */
  isInCall: boolean;

  /** Current session ID for conversation continuity */
  sessionId: string | null;

  /** Start a new phone-call style conversation */
  startCall: () => void;

  /** End the current call session */
  endCall: () => void;

  startListening: () => void;

  stopListening: () => void;

  sendMessage: (text: string) => void;

  resetToIdle: () => void;
}



export function useVoiceAgent(): VoiceAgentState {


const [voiceState, setVoiceState] =
useState<VoiceState>("IDLE");


const [transcript, setTranscript] =
useState("");


const [aiResponse, setAiResponse] =
useState("");


const [processingIndicators, setProcessingIndicators] =
useState<ProcessingIndicator[]>(
INITIAL_INDICATORS
);


const [conversationHistory, setConversationHistory] =
useState<ConversationTurn[]>([]);


const [isInCall, setIsInCall] =
useState(false);


const [sessionId, setSessionId] =
useState<string | null>(null);


const recognitionRef =
useRef<any>(null);


const audioRef =
useRef<HTMLAudioElement | null>(null);


/** Ref to track if call is active (avoids stale closure issues) */
const isCallActiveRef =
useRef(false);


/** Ref to hold the current session ID (avoids stale closure issues) */
const sessionIdRef =
useRef<string | null>(null);


/** Timer ref for auto-restart delay */
const autoRestartTimerRef =
useRef<ReturnType<typeof setTimeout> | null>(null);


/**
 * Microphone lock ref — tracks whether the mic is locked.
 * When true, no speech recognition may start.
 * Locked during THINKING and SPEAKING states.
 */
const micLockedRef = useRef(false);


/**
 * Voice state ref — mirrors voiceState for use inside callbacks
 * that would otherwise capture a stale closure.
 */
const voiceStateRef = useRef<VoiceState>("IDLE");

/** Helper: set voice state in both React state and ref */
const setVoiceStateSync = useCallback((state: VoiceState) => {
  voiceStateRef.current = state;
  setVoiceState(state);
}, []);


// ==============================
// CHECK END-CALL PHRASES
// ==============================

function isEndCallPhrase(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return END_CALL_PHRASES.some(phrase =>
    lower.includes(phrase)
  );
}


// ==============================
// MICROPHONE LOCK
// Enforces: no mic during THINKING or SPEAKING
// ==============================

/**
 * Lock the microphone — stops any active recognition and
 * prevents new recognition from starting.
 */
const lockMicrophone = useCallback(() => {
  micLockedRef.current = true;
  console.log("[MicLock] Microphone LOCKED");

  // Force-stop any active recognition
  if (recognitionRef.current) {
    try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
    recognitionRef.current = null;
  }
}, []);


/**
 * Unlock the microphone — allows recognition to start again.
 */
const unlockMicrophone = useCallback(() => {
  micLockedRef.current = false;
  console.log("[MicLock] Microphone UNLOCKED");
}, []);



// ==============================
// INTERNAL: START LISTENING
// (Used for both initial start and auto-restart)
// ==============================

const startListeningInternal = useCallback(() => {

  // Don't start if call is no longer active
  if (!isCallActiveRef.current) return;

  // *** MICROPHONE LOCK GATE ***
  // If the mic is locked (AI is thinking or speaking), refuse to start.
  if (micLockedRef.current) {
    console.log("[MicLock] Attempted to start listening while mic is locked — BLOCKED");
    return;
  }


  setTranscript("");
  setVoiceStateSync("LISTENING");


  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;


  if (!SpeechRecognition) {
    alert("Chrome browser required for voice input");
    return;
  }


  const recognition =
    new SpeechRecognition();


  recognition.lang = "en-US";

  recognition.continuous = false;

  recognition.interimResults = false;


  recognition.onstart = () => {
    console.log("🎙 Listening...");
  };


  recognition.onresult =
    (event: any) => {

    const text =
      event.results[0][0].transcript;

    console.log("User:", text);

    setTranscript(text);

    // Immediately stop recognition & lock mic
    recognition.stop();

    // Check if user wants to end the call
    if (isEndCallPhrase(text)) {
      endCallInternal();
      return;
    }

    sendMessageInternal(text);

  };


  recognition.onerror =
    (error: any) => {

    console.log("Speech error", error);

    // If mic got locked while we were listening, don't restart
    if (micLockedRef.current) {
      console.log("[MicLock] Error during locked state — ignoring");
      return;
    }

    // On error during a call, try to restart listening
    // (common errors: no-speech, network)
    if (isCallActiveRef.current && error.error === "no-speech") {
      // User didn't say anything — restart mic
      setTimeout(() => {
        if (isCallActiveRef.current && !micLockedRef.current) {
          startListeningInternal();
        }
      }, 300);
    } else if (isCallActiveRef.current) {
      // Other error during call — go back to listening
      setVoiceStateSync("LISTENING");
      setTimeout(() => {
        if (isCallActiveRef.current && !micLockedRef.current) {
          startListeningInternal();
        }
      }, 500);
    } else {
      setVoiceStateSync("IDLE");
    }

  };


  recognition.onend = () => {
    // SpeechRecognition auto-stops; we handle restart elsewhere
    console.log("Recognition ended");
  };


  recognitionRef.current = recognition;

  recognition.start();


}, []);



// ==============================
// INTERNAL: SEND MESSAGE TO BACKEND
// GEMINI + RIME (with session)
//
// State flow: LISTENING → THINKING → SPEAKING → LISTENING
// Mic is locked from THINKING through end of SPEAKING.
// ==============================

const sendMessageInternal =
useCallback(async (text: string) => {

try {

  // ——— STEP 1: Lock mic immediately ———
  lockMicrophone();

  setConversationHistory(prev => [
    ...prev,
    { id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), role: "user", text }
  ]);

  // ——— STEP 2: Enter THINKING state ———
  setVoiceStateSync("THINKING");

  setProcessingIndicators(
    INITIAL_INDICATORS.map(i => ({
      ...i,
      completed: false
    }))
  );


  const body: any = { text };

  // Include session_id for conversation continuity
  if (sessionIdRef.current) {
    body.session_id = sessionIdRef.current;
  }


  const response =
    await fetch(
      `${BACKEND_URL}/voice`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(body)
      }
    );



  if (!response.ok) {
    throw new Error("Backend failed");
  }



  const json = await response.json();
  const answerText = json.answer || "";
  const audioBase64 = json.audio || "";

  setAiResponse(answerText);
  setConversationHistory(prev => [
    ...prev,
    { id: crypto.randomUUID ? crypto.randomUUID() : (Date.now() + 1).toString(), role: "assistant", text: answerText }
  ]);

  // Decode base64 to Blob
  const byteCharacters = atob(audioBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const audioBlob = new Blob([byteArray], { type: "audio/mpeg" });


  const audioURL =
    URL.createObjectURL(audioBlob);


  const audio =
    new Audio(audioURL);


  audioRef.current = audio;

  // ——— STEP 3: Enter SPEAKING state (mic still locked) ———
  setVoiceStateSync("SPEAKING");


  audio.play();


  // ——— STEP 4: When audio ends, unlock mic and auto-restart ———
  audio.onended = () => {

    // Clean up the object URL
    URL.revokeObjectURL(audioURL);

    // Unlock microphone — audio is finished
    unlockMicrophone();

    // If call is still active, auto-restart mic after delay
    if (isCallActiveRef.current) {

      autoRestartTimerRef.current = setTimeout(() => {
        if (isCallActiveRef.current && !micLockedRef.current) {
          startListeningInternal();
        }
      }, AUTO_RESTART_DELAY_MS);

    } else {
      setVoiceStateSync("IDLE");
    }

  };


  // Safety: also handle audio errors (e.g. corrupt audio)
  audio.onerror = () => {
    console.log("[Audio] Playback error — unlocking mic");
    URL.revokeObjectURL(audioURL);
    unlockMicrophone();

    if (isCallActiveRef.current) {
      autoRestartTimerRef.current = setTimeout(() => {
        if (isCallActiveRef.current && !micLockedRef.current) {
          startListeningInternal();
        }
      }, AUTO_RESTART_DELAY_MS);
    } else {
      setVoiceStateSync("IDLE");
    }
  };



}
catch (error) {

  console.log("Voice error:", error);

  // Unlock mic on error so user can still interact
  unlockMicrophone();

  // If in a call, go back to listening on error
  if (isCallActiveRef.current) {
    setTimeout(() => {
      if (isCallActiveRef.current && !micLockedRef.current) {
        startListeningInternal();
      }
    }, 1000);
  } else {
    setVoiceStateSync("IDLE");
  }

}


}, [startListeningInternal, lockMicrophone, unlockMicrophone]);



// ==============================
// INTERNAL: END CALL
// ==============================

const endCallInternal = useCallback(() => {

  isCallActiveRef.current = false;
  setIsInCall(false);

  // Unlock mic (cleanup)
  unlockMicrophone();

  // Stop any playing audio
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.onended = null;
    audioRef.current.onerror = null;
    audioRef.current = null;
  }

  // Stop mic
  if (recognitionRef.current) {
    try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
    recognitionRef.current = null;
  }

  // Clear auto-restart timer
  if (autoRestartTimerRef.current) {
    clearTimeout(autoRestartTimerRef.current);
    autoRestartTimerRef.current = null;
  }

  // Notify backend to clear session
  const sid = sessionIdRef.current;
  if (sid) {
    fetch(`${BACKEND_URL}/session/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid })
    }).catch(err => console.log("Session end error:", err));
  }

  sessionIdRef.current = null;
  setSessionId(null);

  setVoiceStateSync("ENDED");

}, [unlockMicrophone]);



// ==============================
// PUBLIC: START CALL
// ==============================

const startCall = useCallback(() => {

  // Generate a session ID
  const newSessionId = crypto.randomUUID
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  sessionIdRef.current = newSessionId;
  setSessionId(newSessionId);

  isCallActiveRef.current = true;
  setIsInCall(true);

  // Ensure mic is unlocked at call start
  unlockMicrophone();

  setTranscript("");
  setAiResponse("");
  setConversationHistory([]);

  // Start listening immediately
  startListeningInternal();

}, [startListeningInternal, unlockMicrophone]);



// ==============================
// PUBLIC: END CALL
// ==============================

const endCall = useCallback(() => {
  endCallInternal();
}, [endCallInternal]);



// ==============================
// PUBLIC: START LISTENING
// (for backward compatibility & orb clicks during call)
// ==============================

const startListening = useCallback(() => {

  // Block if mic is locked (AI is thinking or speaking)
  if (micLockedRef.current) {
    console.log("[MicLock] startListening blocked — mic is locked");
    return;
  }

  if (isCallActiveRef.current) {
    // Already in a call — just restart listening
    startListeningInternal();
  } else {
    // Not in a call — start a new call
    startCall();
  }

}, [startListeningInternal, startCall]);



// ==============================
// STOP LISTENING
// ==============================

const stopListening =
useCallback(() => {

  if (recognitionRef.current) {
    try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
    recognitionRef.current = null;
  }

  // If in a call, don't go to IDLE — end the call
  if (isCallActiveRef.current) {
    endCallInternal();
  } else {
    setVoiceStateSync("IDLE");
  }

}, [endCallInternal]);



// ==============================
// SEND MESSAGE (Public)
// For quick-question chips — starts a call if not in one
// ==============================

const sendMessage = useCallback((text: string) => {

  if (!isCallActiveRef.current) {
    // Start a call session for chip-initiated messages
    const newSessionId = crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    sessionIdRef.current = newSessionId;
    setSessionId(newSessionId);
    isCallActiveRef.current = true;
    setIsInCall(true);
  }

  setTranscript(text);
  sendMessageInternal(text);

}, [sendMessageInternal]);



// ==============================
// RESET
// ==============================

const resetToIdle =
useCallback(() => {

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.onended = null;
    audioRef.current.onerror = null;
    audioRef.current = null;
  }

  // Clear auto-restart timer
  if (autoRestartTimerRef.current) {
    clearTimeout(autoRestartTimerRef.current);
    autoRestartTimerRef.current = null;
  }

  // Unlock mic
  unlockMicrophone();

  isCallActiveRef.current = false;
  setIsInCall(false);
  sessionIdRef.current = null;
  setSessionId(null);

  setVoiceStateSync("IDLE");

  setTranscript("");
  setAiResponse("");
  setConversationHistory([]);

  setProcessingIndicators(
    INITIAL_INDICATORS
  );

}, [unlockMicrophone]);




return {

  voiceState,

  transcript,

  aiResponse,

  processingIndicators,

  conversationHistory,

  isInCall,

  sessionId,

  startCall,

  endCall,

  startListening,

  stopListening,

  sendMessage,

  resetToIdle,

};


}