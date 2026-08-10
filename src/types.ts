// ===== Voice Agent State Machine Types =====
//
// Strict state machine:
//   IDLE → LISTENING → THINKING → SPEAKING → LISTENING (loop)
//   Any state → ENDED (via endCall)
//
// Forbidden transitions:
//   SPEAKING → THINKING  (must finish audio first)
//   SPEAKING → LISTENING (must finish audio first)

export type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ENDED';

export interface FarmContext {
  crop: string;
  cropAge: number;
  location: string;
  lastIrrigation: string;
  farmerName: string;
}

export interface MemoryItem {
  id: string;
  text: string;
  timestamp: string;
  timeLabel: string;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface ProcessingIndicator {
  id: string;
  icon: string;
  label: string;
  completed: boolean;
}

export interface OnboardingData {
  name: string;
  location: string;
  crop: string;
  language: 'hindi' | 'hinglish' | 'english';
}
