import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const FlashcardSystem: React.FC = () => {
  const { flashcards = [] } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No flashcards available yet.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  if (!currentCard) {
    return null;
  }

  return (
    <div className="p-4">
      <div
        className="bg-white rounded-lg shadow-lg p-8 min-h-[200px] cursor-pointer"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        <div className="text-center">
          <p className="text-lg font-medium mb-4">
            {showAnswer ? currentCard.answer : currentCard.question}
          </p>
          <p className="text-sm text-gray-500">
            Click to {showAnswer ? 'show question' : 'reveal answer'}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
            setShowAnswer(false);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        <button
          onClick={() => {
            setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
            setShowAnswer(false);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};