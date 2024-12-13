import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const { questions = [], addQuestion } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await addQuestion({ text: message });
        setMessage('');
      } catch (error) {
        console.error('Failed to add question:', error);
      }
    }
  };

  if (!Array.isArray(questions)) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-white rounded-lg p-4 shadow">
            <p className="font-medium">{q.text}</p>
            {q.answer && (
              <p className="mt-2 text-gray-600">{q.answer}</p>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};