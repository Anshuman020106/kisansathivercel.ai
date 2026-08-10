/**
 * Onboarding — Fast setup flow matching Stitch onboarding_fast_setup
 * Two screens: Welcome splash → Data collection form
 * Pre-populated with demo data for hackathon.
 */

import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

type Screen = 'welcome' | 'form';

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [name, setName] = useState('Ansh');
  const [location, setLocation] = useState('Gautam Buddha Nagar');
  const [crop, setCrop] = useState('Wheat');
  const [selectedLang, setSelectedLang] = useState<string>('हिन्दी');

  const languages = ['हिन्दी', 'Hinglish', 'English'];

  // ===== Welcome Splash Screen =====
  if (screen === 'welcome') {
    return (
      <main className="w-full max-w-md mx-auto h-[100dvh] relative overflow-hidden bg-surface shadow-2xl md:rounded-xl md:my-8 md:h-[calc(100vh-64px)] flex flex-col">
        {/* Hero image area */}
        <div
          className="relative w-full h-[55%] flex-shrink-0 bg-surface-container-low rounded-b-[40px] overflow-hidden"
          style={{ boxShadow: '0 4px 24px rgba(39,111,37,0.12)' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5GAhM4VMY5W6_KhJPU5iJcG232R-vB7bYu0MfzhyAyeu8KAQTh2AGRMa1AWW29H0dJlUqfF2M0gKXsSxAGZtFRdl4Zv_bHdBU5MdYz33PxviEjDJoWbRRNkn2TpbaBGMG7bdEr5kIBlbIgUTIKj_v3oC9U3IjcIy6UEOv-X_PBlkp7aM1B7Ff010T7xexBYkFSS2IuCNeo5KXaF3wYJn9wUTXKBYfCEniCSriabXwW26lwrbVE65OAQ')`,
            }}
            role="img"
            aria-label="Lush green terraced farming fields in golden hour"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-container-margin text-center">
          <h1 className="font-display-lg text-display-lg text-primary mb-4 tracking-tight">kisansathi.ai</h1>
          <p className="font-headline-md text-headline-md text-on-surface-variant max-w-[280px]">
            Apne khet ke baare mein bas bolkar baat karein.
          </p>
        </div>

        {/* Action button */}
        <div className="px-container-margin pb-8 pt-4">
          <button
            onClick={() => setScreen('form')}
            className="w-full h-touch-target-min bg-primary text-on-primary font-label-lg text-label-lg rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
            style={{ boxShadow: '0 8px 16px rgba(44,105,0,0.2)' }}
          >
            <span>Aage Badhein</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </main>
    );
  }

  // ===== Data Collection Form Screen =====
  return (
    <main className="w-full max-w-md mx-auto h-[100dvh] relative overflow-hidden bg-background shadow-2xl md:rounded-xl md:my-8 md:h-[calc(100vh-64px)] flex flex-col">
      {/* Header with back + progress */}
      <header className="pt-8 px-container-margin pb-6 flex items-center gap-4">
        <button
          onClick={() => setScreen('welcome')}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all text-on-surface"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary w-1/2 h-full rounded-full" />
        </div>
      </header>

      {/* Form */}
      <div className="px-container-margin flex-1 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-container mb-1">Thodi Jankari</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Humari behtar madad ke liye.</p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Name */}
          <div className="relative">
            <label className="sr-only" htmlFor="onboarding-name">Name</label>
            <input
              id="onboarding-name"
              className="w-full h-touch-target-min bg-surface-container-lowest border-2 border-surface-container-highest text-on-surface font-body-lg text-body-lg rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-0 transition-colors placeholder:text-outline-variant"
              style={{ boxShadow: '0 1px 4px rgba(44,105,0,0.05)' }}
              placeholder="Aapka Naam"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>

          {/* Location */}
          <div className="relative">
            <label className="sr-only" htmlFor="onboarding-location">Location</label>
            <input
              id="onboarding-location"
              className="w-full h-touch-target-min bg-surface-container-lowest border-2 border-surface-container-highest text-on-surface font-body-lg text-body-lg rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-0 transition-colors placeholder:text-outline-variant"
              style={{ boxShadow: '0 1px 4px rgba(44,105,0,0.05)' }}
              placeholder="Khet Ki Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary active:scale-90 transition-transform" aria-label="Use voice for location">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            </button>
          </div>

          {/* Current Crop */}
          <div className="relative">
            <label className="sr-only" htmlFor="onboarding-crop">Current Crop</label>
            <input
              id="onboarding-crop"
              className="w-full h-touch-target-min bg-surface-container-lowest border-2 border-surface-container-highest text-on-surface font-body-lg text-body-lg rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-0 transition-colors placeholder:text-outline-variant"
              style={{ boxShadow: '0 1px 4px rgba(44,105,0,0.05)' }}
              placeholder="Konsi Fasal Hai?"
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary active:scale-90 transition-transform" aria-label="Use voice for crop">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            </button>
          </div>

          {/* Language Selection */}
          <div className="pt-2">
            <span className="block font-label-lg text-label-lg text-on-surface-variant mb-3 uppercase tracking-wider text-xs">
              Bhasha Chunein (Language)
            </span>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`flex-1 min-w-[100px] h-touch-target-min font-headline-md text-headline-md rounded-full border-2 border-transparent active:scale-95 transition-all flex items-center justify-center ${
                    selectedLang === lang
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="px-container-margin mt-8 mb-4 pb-safe">
        <button
          onClick={onComplete}
          className="w-full h-touch-target-min bg-primary text-on-primary font-headline-md text-headline-md rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
          style={{ boxShadow: '0 8px 16px rgba(44,105,0,0.2)' }}
        >
          <span>Shuru Karein</span>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        </button>
      </div>
    </main>
  );
}


