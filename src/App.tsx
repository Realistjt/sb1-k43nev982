import React from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { AppMain } from './components/layout/AppMain';
import { useInitializeApp } from './hooks/useInitializeApp';

export default function App() {
  useInitializeApp();

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />
      <AppMain />
    </div>
  );
}