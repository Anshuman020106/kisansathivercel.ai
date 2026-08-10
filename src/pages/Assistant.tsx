/**
 * Assistant Page — The main voice-first interaction page
 * 
 * This is a SINGLE page that renders different UI based on the voice state machine.
 * States: IDLE → LISTENING → THINKING → SPEAKING → ENDED
 * 
 * STRICT RULE: During THINKING and SPEAKING, the microphone is locked.
 * No user voice input is accepted. No interruption is possible.
 * The mic auto-restarts ONLY after audio playback finishes.
 * 
 * When a call is active, the UI shows a persistent "Connected" status bar
 * and an "End Call" button, mimicking a phone call experience.
 * 
 * NO separate routes for states. All transitions happen in-place.
 */

import { useState, useEffect, useRef } from 'react';
import { useVoiceAgent } from '../hooks/useVoiceAgent';
import VoiceOrb from '../components/VoiceOrb';
import VoiceWaveform from '../components/VoiceWaveform';
import QuickQuestionChips from '../components/QuickQuestionChips';
import FarmContextCard from '../components/FarmContextCard';
import ProcessingContext from '../components/ProcessingContext';

interface AssistantProps {
  onNavigateToMemory?: () => void;
}

/**
 * Connected call status bar — shown at top during active calls
 */
function CallStatusBar({ status, icon }: { status: string; icon: string }) {
  return (
    <div className="call-status-bar flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 rounded-full mb-6">
      <span className="w-2.5 h-2.5 bg-[#4CAF50] rounded-full call-status-pulse" />
      <span className="font-label-lg text-label-lg text-primary">
        kisansathi.ai Connected
      </span>
      <span className="text-on-surface-variant font-body-md text-body-md ml-2">
        •  {icon} {status}
      </span>
    </div>
  );
}

/**
 * End Call button — shown at bottom during active calls
 */
function EndCallButton({ onEndCall }: { onEndCall: () => void }) {
  return (
    <button
      onClick={onEndCall}
      className="end-call-btn w-full max-w-xs h-[56px] bg-error text-on-error rounded-full flex items-center justify-center gap-3 active:scale-[0.97] transition-all duration-200 shadow-lg z-50"
      style={{ boxShadow: '0 4px 20px rgba(186,26,26,0.25)' }}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call_end</span>
      <span className="font-label-lg text-label-lg">End Call</span>
    </button>
  );
}

/**
 * Word-by-word animation for AI speaking
 */
function LiveTranscript({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    const words = text.split(' ');
    let currentWordIndex = 0;

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setDisplayedText(prev => prev ? prev + ' ' + words[currentWordIndex] : words[currentWordIndex]);
        currentWordIndex++;
      } else {
        clearInterval(interval);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}


export default function Assistant({ onNavigateToMemory }: AssistantProps) {
  const {
    voiceState,
    transcript,
    aiResponse,
    processingIndicators,
    conversationHistory,
    isInCall,
    startCall,
    endCall,
    stopListening,
    sendMessage,
    resetToIdle,
  } = useVoiceAgent();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationHistory, transcript, aiResponse, voiceState]);


  // ===== IDLE STATE =====
  if (voiceState === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center px-container-margin w-full max-w-lg mx-auto min-h-full">
        {/* Hero Orb Area */}
        <div className="flex flex-col items-center justify-center flex-grow w-full py-12">
          <VoiceOrb state="IDLE" onClick={startCall} />
          <div className="mt-8 text-center flex flex-col items-center max-w-[300px]">
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Bolkar poochhein</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Apne khet ke baare mein mujhse baat karein
            </p>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="mb-12">
          <QuickQuestionChips onSelect={(q) => sendMessage(q)} />
        </div>

        {/* Farm Context Card */}
        <div className="mb-8 w-full flex justify-center">
          <FarmContextCard onViewMemory={() => onNavigateToMemory?.()} />
        </div>
      </div>
    );
  }

  // ===== CALL ENDED STATE =====
  if (voiceState === 'ENDED') {
    return (
      <div className="flex flex-col items-center justify-center px-container-margin w-full max-w-lg mx-auto min-h-full">
        <div className="flex flex-col items-center text-center space-y-8 call-ended-fade-in">
          {/* Farewell icon */}
          <div className="w-28 h-28 rounded-full bg-secondary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[56px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
          </div>

          {/* Farewell message */}
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-primary">
            Thank you for using kisansathi.ai 🌱
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
            Aapki fasal ka khayal rakhna hamara kaam hai. Jab chaahein baat karein!
          </p>

          {/* Start new call button */}
          <button
            onClick={resetToIdle}
            className="mt-8 px-8 py-4 bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center gap-3 active:scale-95 transition-transform duration-200 shadow-lg hover:bg-primary-container hover:text-on-primary-container"
            style={{ boxShadow: '0 4px 20px rgba(44,105,0,0.2)' }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
            Start New Call
          </button>
        </div>
      </div>
    );
  }

  // ===== ACTIVE CALL STATES (LISTENING, THINKING, SPEAKING) =====
  if (['LISTENING', 'THINKING', 'SPEAKING'].includes(voiceState)) {
    let statusText = "Connected";
    let statusIcon = "";
    if (voiceState === 'LISTENING') {
      statusText = "Listening...";
      statusIcon = "🎙";
    } else if (voiceState === 'THINKING') {
      statusText = "Thinking...";
      statusIcon = "🧠";
    } else if (voiceState === 'SPEAKING') {
      statusText = "kisansathi.ai is speaking...";
      statusIcon = "🔊";
    }

    return (
      <div className="flex flex-col h-[100dvh] w-full max-w-lg mx-auto relative pt-8 px-container-margin overflow-hidden bg-surface">
        {/* Top Status */}
        <div className="flex-shrink-0 z-20 flex flex-col items-center bg-surface pb-4">
          {isInCall && <CallStatusBar status={statusText} icon={statusIcon} />}
          {voiceState === 'LISTENING' && !isInCall && (
            <p className="font-headline-md text-headline-md text-primary animate-pulse mb-4">Sun raha hoon...</p>
          )}
        </div>

        {/* Main Transcript Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto w-full flex flex-col gap-6 transcript-container pb-[200px] z-10"
        >
          {conversationHistory.map((msg, index) => {
            const isLast = index === conversationHistory.length - 1;
            const isAiSpeaking = isLast && msg.role === 'assistant' && voiceState === 'SPEAKING';
            
            return (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-on-surface-variant mb-1 mx-1 opacity-70">
                  {msg.role === 'user' ? 'Farmer' : 'kisansathi.ai'}
                </span>
                <div className={`p-4 rounded-2xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-primary text-on-primary rounded-br-sm' 
                    : 'bg-surface-container-high text-on-surface rounded-bl-sm border border-surface-variant'
                }`}>
                  <p className="font-body-lg text-body-lg leading-relaxed">
                    {isAiSpeaking ? <LiveTranscript text={msg.text} /> : msg.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Live transcription when user is speaking */}
          {voiceState === 'LISTENING' && transcript && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-on-surface-variant mb-1 mx-1 opacity-70">Farmer</span>
              <div className="p-4 rounded-2xl max-w-[85%] bg-primary/80 text-on-primary rounded-br-sm opacity-80">
                <p className="font-body-lg text-body-lg italic leading-relaxed">{transcript}</p>
              </div>
            </div>
          )}

          {/* Thinking Indicator */}
          {voiceState === 'THINKING' && (
            <div className="flex flex-col items-start mt-2">
              <ProcessingContext indicators={processingIndicators} />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="fixed bottom-0 left-0 w-full px-container-margin pb-8 pt-16 bg-gradient-to-t from-background via-background/90 to-transparent z-30 flex flex-col items-center gap-4">
          {/* Orb */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-40">
            {voiceState === 'LISTENING' && (
              <div className="absolute inset-0 z-[-1]">
                <VoiceWaveform />
              </div>
            )}
            <VoiceOrb 
              state={voiceState} 
              onClick={voiceState === 'LISTENING' ? (isInCall ? endCall : stopListening) : () => {}} 
            />
          </div>
          
          <div className="z-50 w-full flex justify-center">
            {voiceState === 'SPEAKING' ? (
              /* During SPEAKING: show a disabled/informational indicator — NO interrupt button */
              <div className="w-full max-w-xs h-[56px] bg-surface-container-high text-on-surface rounded-full flex items-center justify-center gap-3 border border-outline-variant opacity-80">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
                <span className="font-label-lg text-label-lg text-on-surface-variant">🔊 kisansathi.ai is speaking...</span>
              </div>
            ) : voiceState === 'THINKING' ? (
              /* During THINKING: show informational indicator — mic is locked */
              <div className="w-full max-w-xs h-[56px] bg-surface-container-high text-on-surface rounded-full flex items-center justify-center gap-3 border border-outline-variant opacity-80">
                <span className="material-symbols-outlined text-primary animate-spin-slow" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <span className="font-label-lg text-label-lg text-on-surface-variant">🧠 Thinking...</span>
              </div>
            ) : (
              isInCall ? (
                <EndCallButton onEndCall={endCall} />
              ) : (
                <button
                  onClick={stopListening}
                  className="w-full max-w-xs h-[56px] flex items-center justify-center gap-2 bg-error-container text-on-error-container rounded-full shadow-sm active:scale-95 transition-transform duration-150"
                >
                  <span className="material-symbols-outlined">close</span>
                  <span className="font-label-lg text-label-lg">Cancel</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
