/**
 * AppShell — Main layout container
 * Mobile-first with centered max-width on desktop.
 * Bottom navigation: Assistant + Memory only (no Profile).
 */

import { ReactNode } from 'react';

interface AppShellProps {
  currentPage: 'assistant' | 'memory';
  onNavigate: (page: 'assistant' | 'memory') => void;
  children: ReactNode;
}

export default function AppShell({ currentPage, onNavigate, children }: AppShellProps) {
  return (
    <div className="h-full flex flex-col bg-background text-on-surface font-body-md antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm" style={{ boxShadow: '0 4px 20px rgba(39,111,37,0.08)' }}>
        <div className="flex justify-between items-center px-container-margin h-touch-target-min w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            <h1 className="text-headline-md font-headline-md font-black text-primary">kisansathi.ai</h1>
          </div>
          <div className="flex items-center">
            <span className="font-label-lg text-label-lg text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
              Wheat • Day 42
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[56px] pb-[80px] overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation — Mobile: Assistant + Memory only */}
      <nav
        className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-surface-container rounded-t-xl z-50"
        style={{ boxShadow: '0 -4px 20px rgba(39,111,37,0.08)' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <button
          onClick={() => onNavigate('assistant')}
          className={`flex flex-col items-center justify-center px-6 py-2 rounded-full transition-all active:scale-90 duration-200 ${
            currentPage === 'assistant'
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          aria-label="Assistant"
          aria-current={currentPage === 'assistant' ? 'page' : undefined}
        >
          <span
            className="material-symbols-outlined"
            style={currentPage === 'assistant' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            home
          </span>
          <span className="font-label-lg text-label-lg mt-1">Home</span>
        </button>

        <button
          onClick={() => onNavigate('memory')}
          className={`flex flex-col items-center justify-center px-6 py-2 rounded-full transition-all active:scale-90 duration-200 ${
            currentPage === 'memory'
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          aria-label="Memory"
          aria-current={currentPage === 'memory' ? 'page' : undefined}
        >
          <span
            className="material-symbols-outlined"
            style={currentPage === 'memory' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            history
          </span>
          <span className="font-label-lg text-label-lg mt-1">Memory</span>
        </button>
      </nav>
    </div>
  );
}
