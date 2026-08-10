/**
 * FarmContextCard — "Your Farm" card from the Stitch idle state
 * Shows crop info, location, and memory hint with "View Memory" link.
 */

interface FarmContextCardProps {
  onViewMemory: () => void;
}

export default function FarmContextCard({ onViewMemory }: FarmContextCardProps) {
  return (
    <div
      className="w-full max-w-md bg-surface-container-lowest rounded-xl p-gutter border border-surface-container-low relative overflow-hidden"
      style={{ boxShadow: '0 8px 30px rgba(39,111,37,0.06)' }}
    >
      {/* Decorative circle */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-surface-container rounded-full opacity-50 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="font-label-lg text-label-lg text-on-surface-variant mb-1">Your Farm</h3>
          <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Wheat, 42 days</p>
          <p className="font-body-md text-body-md text-outline mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            Gautam Buddha Nagar
          </p>
        </div>
        <div className="bg-secondary-container p-3 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            grass
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-surface-container-high">
        <div className="flex items-start gap-3 bg-surface p-3 rounded-lg border border-surface-variant">
          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">tips_and_updates</span>
          <div className="flex-grow">
            <p className="font-body-md text-[14px] leading-relaxed text-on-surface-variant">
              <span className="font-semibold text-primary">kisansathi.ai remembers:</span> Last time you mentioned yellow leaves in your wheat crop.
            </p>
            <button
              onClick={onViewMemory}
              className="mt-2 text-primary font-label-lg text-label-lg hover:underline flex items-center gap-1"
            >
              View Memory <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
