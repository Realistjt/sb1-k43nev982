import { StateCreator } from 'zustand';
import { StudyMaterial } from '../../types';
import { db } from '../../services/database/db';

export interface MaterialSlice {
  materials: StudyMaterial[];
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'timestamp'>) => Promise<void>;
  loadMaterials: () => Promise<void>;
}

export const createMaterialSlice: StateCreator<MaterialSlice> = (set) => ({
  materials: [],
  addMaterial: async (material) => {
    try {
      const newMaterial = {
        ...material,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      await db.materials.add(newMaterial);
      set((state) => ({
        materials: [...state.materials, newMaterial],
      }));
    } catch (error) {
      console.error('Failed to add material:', error);
      throw new Error('Failed to save study material');
    }
  },
  loadMaterials: async () => {
    try {
      const materials = await db.materials.toArray();
      set({ materials });
    } catch (error) {
      console.error('Failed to load materials:', error);
    }
  },
});