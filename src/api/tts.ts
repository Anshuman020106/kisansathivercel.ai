/**
 * TTS Abstraction Layer
 * 
 * This module provides a clean interface for text-to-speech that will
 * later be connected to Rime TTS. For now it uses a mock implementation.
 * 
 * Future integration:
 * - Replace MockTTSEngine with RimeTTSEngine
 * - Connect to Rime WebSocket or REST API
 * - Handle streaming audio chunks
 * 
 * DO NOT put Rime credentials in the frontend.
 * The Rime connection should go through a backend proxy.
 */

export interface TTSEngine {
  speak(text: string): Promise<void>;
  stop(): void;
  onStateChange?: (state: 'started' | 'speaking' | 'interrupted' | 'finished') => void;
}

class MockTTSEngine implements TTSEngine {
  private _timeout: ReturnType<typeof setTimeout> | null = null;
  onStateChange?: (state: 'started' | 'speaking' | 'interrupted' | 'finished') => void;

  async speak(text: string): Promise<void> {
    this.onStateChange?.('started');
    
    // Simulate speaking duration based on text length
    // Roughly 100ms per word
    const words = text.split(' ').length;
    const duration = Math.max(2000, words * 200);

    this.onStateChange?.('speaking');
    
    return new Promise((resolve) => {
      this._timeout = setTimeout(() => {
        this._timeout = null;
        this.onStateChange?.('finished');
        resolve();
      }, duration);
    });
  }

  stop(): void {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
      this.onStateChange?.('interrupted');
    }
  }
}

// Singleton instance — swap this out for RimeTTSEngine later
export const ttsEngine: TTSEngine = new MockTTSEngine();
