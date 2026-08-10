import { useState } from 'react';
import AppShell from './components/AppShell';
import Onboarding from './pages/Onboarding';
import Assistant from './pages/Assistant';
import Memory from './pages/Memory';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentPage, setCurrentPage] = useState<'assistant' | 'memory'>('assistant');

  if (!isOnboarded) {
    return <Onboarding onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'assistant' ? (
        <Assistant onNavigateToMemory={() => setCurrentPage('memory')} />
      ) : (
        <Memory />
      )}
    </AppShell>
  );
}

export default App;

