import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenCapture } from '../ScreenCapture';

export function AppHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-blue-600" size={24} />
          <h1 className="text-xl font-semibold">StudyAI Assistant</h1>
        </div>
        <ErrorBoundary>
          <ScreenCapture />
        </ErrorBoundary>
      </div>
    </header>
  );
}