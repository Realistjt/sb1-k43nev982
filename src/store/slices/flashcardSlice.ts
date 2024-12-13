import { StateCreator } from 'zustand';
import { Flashcard } from '../../types';
import { db } from '../../services/database/db';

export interface FlashcardSlice {
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Omit<Flashcard, 'id'>) => Promise<void>;
  loadFlashcards: () => Promise<void>;
}

export const createFlashcardSlice: StateCreator<FlashcardSlice> = (set) => ({
  flashcards: [],
  addFlashcard: async (flashcard) => {
    try {
      const newFlashcard = {
        ...flashcard,
        id: crypto.randomUUID(),
      };
      await db.flashcards.add(newFlashcard);
      set((state) => ({
        flashcards: [...state.flashcards, newFlashcard],
      }));
    } catch (error) {
      console.error('Failed to add flashcard:', error);
      throw new Error('Failed to save flashcard');
    }
  },
  loadFlashcards: async () => {
    try {
      const flashcards = await db.flashcards.toArray();
      set({ flashcards });
    } catch (error) {
      console.error('Failed to load flashcards:', error);
    }
  },
});