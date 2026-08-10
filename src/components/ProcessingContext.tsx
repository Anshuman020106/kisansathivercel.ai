/**
 * ProcessingContext — Context retrieval indicators for the processing state
 * Shows Farm memory, Recent weather, Crop context with animated loading dots.
 */

import type { ProcessingIndicator } from '../types';

interface ProcessingContextProps {
  indicators: ProcessingIndicator[];
}

export default function ProcessingContext({ indicators }: ProcessingContextProps) {
  return (
    <div className="w-full max-w-xs flex flex-col gap-4">
      {indicators.map((indicator, index) => (
        <div
          key={indicator.id}
          className={`flex items-center gap-3 p-4 rounded-xl border shadow-[0_2px_10px_rgba(39,111,37,0.04)] fade-in-up ${
            indicator.completed
              ? 'bg-secondary-container/20 border-secondary-container'
              : 'bg-surface-container-low border-outline-variant/30'
          }`}
          style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
          {/* Loading dots or completed check */}
          {!indicator.completed ? (
            <div className="flex gap-1 w-6 items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full loading-dot" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full loading-dot" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full loading-dot" />
            </div>
          ) : (
            <span className="material-symbols-outlined text-primary text-sm w-6 text-center">check_circle</span>
          )}
          
          <span className="material-symbols-outlined text-outline text-sm">{indicator.icon}</span>
          <span className="font-body-md text-body-md text-on-surface-variant flex-grow">{indicator.label}</span>
          
          {indicator.completed && (
            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
          )}
        </div>
      ))}
    </div>
  );
}
