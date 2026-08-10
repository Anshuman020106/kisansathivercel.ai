/**
 * VoiceWaveform — Animated waveform bars for the listening state
 * Matches the Stitch listening_state design.
 */

export default function VoiceWaveform() {
  return (
    <div className="flex gap-2 items-center justify-center opacity-70">
      <div className="w-2 bg-primary rounded-full animate-waveform-1" style={{ height: 12 }} />
      <div className="w-2 bg-primary rounded-full animate-waveform-2" style={{ height: 12 }} />
      <div className="w-2 bg-primary rounded-full animate-waveform-3" style={{ height: 12 }} />
      <div className="w-2 bg-primary rounded-full animate-waveform-4" style={{ height: 12 }} />
      <div className="w-2 bg-primary rounded-full animate-waveform-5" style={{ height: 12 }} />
    </div>
  );
}
