import React from 'react';
import { Layout, BookOpen, Book } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ChatInterface } from '../ChatInterface';
import { MaterialUpload } from '../MaterialUpload';
import { FlashcardSystem } from '../FlashcardSystem';
import { ProgressTracker } from '../ProgressTracker';

export function AppMain() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layout size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold">Study Assistant</h2>
            </div>
            <div className="h-[600px]">
              <ErrorBoundary>
                <ChatInterface />
              </ErrorBoundary>
            </div>
          </div>

          <div className="mt-8">
            <ErrorBoundary>
              <ProgressTracker />
            </ErrorBoundary>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold">Study Materials</h2>
            </div>
            <ErrorBoundary>
              <MaterialUpload />
            </ErrorBoundary>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Book size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold">Flashcards</h2>
            </div>
            <ErrorBoundary>
              <FlashcardSystem />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </main>
  );
}