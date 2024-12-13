import { StateCreator } from 'zustand';
import { Question } from '../../types';
import { db } from '../../services/database/db';

export interface QuestionSlice {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'timestamp'>) => Promise<void>;
  loadQuestions: () => Promise<void>;
}

export const createQuestionSlice: StateCreator<QuestionSlice> = (set) => ({
  questions: [],
  addQuestion: async (question) => {
    try {
      const newQuestion = {
        ...question,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      await db.questions.add(newQuestion);
      set((state) => ({
        questions: [...state.questions, newQuestion],
      }));
    } catch (error) {
      console.error('Failed to add question:', error);
      throw new Error('Failed to save question');
    }
  },
  loadQuestions: async () => {
    try {
      const questions = await db.questions.toArray();
      set({ questions });
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  },
});