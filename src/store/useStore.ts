import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createChunkedStorage } from '../utils/storage';
import { QuestionSlice, createQuestionSlice } from './slices/questionSlice';
import { MaterialSlice, createMaterialSlice } from './slices/materialSlice';
import { FlashcardSlice, createFlashcardSlice } from './slices/flashcardSlice';

interface StoreState extends QuestionSlice, MaterialSlice, FlashcardSlice {
  loadInitialData: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createQuestionSlice(set, get, api),
      ...createMaterialSlice(set, get, api),
      ...createFlashcardSlice(set, get, api),
      loadInitialData: async () => {
        try {
          const store = get();
          await Promise.all([
            store.loadQuestions(),
            store.loadMaterials(),
            store.loadFlashcards(),
          ]);
        } catch (error) {
          console.error('Failed to load initial data:', error);
        }
      },
    }),
    {
      name: 'study-ai-storage',
      storage: createChunkedStorage('app'),
    }
  )
);