/**
 * VoiceOrb — The central microphone/orb interaction element
 * Adapts visually to each voice state per the strict state machine.
 *
 * States: IDLE | LISTENING | THINKING | SPEAKING | ENDED
 */

import type { VoiceState } from '../types';

interface VoiceOrbProps {
  state: VoiceState;
  onClick: () => void;
}

export default function VoiceOrb({ state, onClick }: VoiceOrbProps) {
  // Idle: large green orb with mic icon and subtle glow pulse
  if (state === 'IDLE') {
    return (
      <button
        aria-label="Start voice conversation"
        onClick={onClick}
        className="relative w-40 h-40 rounded-full bg-primary flex items-center justify-center orb-glow animate-pulse-slow active:scale-95 transition-transform duration-200 cursor-pointer shadow-lg z-10 hover:bg-primary-container"
      >
        <div className="absolute inset-0 rounded-full border-4 border-inverse-primary opacity-50 scale-110" />
        <span className="material-symbols-outlined text-on-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          mic
        </span>
      </button>
    );
  }

  // Listening: smaller orb with pulsing lime rings
  if (state === 'LISTENING') {
    return (
      <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full border-4 border-[#BCDC12] pulse-ring-1" />
          <div className="absolute w-32 h-32 rounded-full border-4 border-[#BCDC12] pulse-ring-2" />
          <div className="absolute w-32 h-32 rounded-full border-4 border-[#BCDC12] pulse-ring-3" />
        </div>
        {/* Central orb */}
        <button
          aria-label="Stop listening"
          onClick={onClick}
          className="relative z-20 w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-lg pulse-orb-active active:scale-95 transition-transform duration-200"
        >
          <span className="material-symbols-outlined text-[64px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            mic
          </span>
        </button>
      </div>
    );
  }

  // Thinking: medium orb with processing pulse — mic is LOCKED, no interaction
  if (state === 'THINKING') {
    return (
      <div className="relative flex justify-center items-center h-40 w-40">
        <div
          className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg z-20 pulse-processing"
        >
          <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
        </div>
      </div>
    );
  }

  // Speaking: orb with wave bars inside — mic is LOCKED, no interaction
  if (state === 'SPEAKING') {
    return (
      <div className="flex flex-col items-center justify-center mt-4">
        <div
          className="w-24 h-24 rounded-full bg-primary flex items-center justify-center orb-pulse transition-transform duration-300"
          style={{ boxShadow: '0 8px 32px rgba(44,105,0,0.3)' }}
        >
          <div className="flex items-center justify-center gap-1.5 h-10">
            <div className="w-1.5 h-6 bg-on-primary rounded-full wave-bar wave-delay-1" />
            <div className="w-1.5 h-10 bg-on-primary rounded-full wave-bar wave-delay-2" />
            <div className="w-1.5 h-8 bg-on-primary rounded-full wave-bar wave-delay-3" />
            <div className="w-1.5 h-10 bg-on-primary rounded-full wave-bar wave-delay-4" />
            <div className="w-1.5 h-6 bg-on-primary rounded-full wave-bar wave-delay-5" />
          </div>
        </div>
      </div>
    );
  }

  // Call Ended: gentle orb with restart icon
  if (state === 'ENDED') {
    return (
      <div className="relative flex items-center justify-center">
        <button
          aria-label="Start new call"
          onClick={onClick}
          className="w-[120px] h-[120px] bg-secondary-container rounded-full flex items-center justify-center soil-shadow hover:bg-primary-container transition-colors active:scale-95 duration-150 ease-in-out relative z-10"
        >
          <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            call
          </span>
        </button>
      </div>
    );
  }

  return null;
}
