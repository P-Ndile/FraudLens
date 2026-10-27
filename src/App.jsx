import React, { useState } from 'react';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import Dashboard from './components/dashboard/Dashboard';
import InvoiceScanner from './components/scanner/InvoiceScanner';

export default function App() {
  const [view, setView] = useState('onboarding');

  if (view === 'onboarding') return <OnboardingWizard onComplete={() => setView('dashboard')} />;
  if (view === 'scanner') return <InvoiceScanner />;

  return (
    <div>
      <div className="p-4 bg-white border-b flex space-x-4">
        <button onClick={() => setView('dashboard')} className="text-sm font-semibold text-blue-600">Dashboard</button>
        <button onClick={() => setView('scanner')} className="text-sm font-semibold text-blue-600">Scan Invoice</button>
      </div>
      <Dashboard />
    </div>
  );
}
