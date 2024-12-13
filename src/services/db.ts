import Dexie, { Table } from 'dexie';
import { Question, StudyMaterial, Flashcard } from '../types';

class StudyDB extends Dexie {
  questions!: Table<Question>;
  materials!: Table<StudyMaterial>;
  flashcards!: Table<Flashcard>;

  constructor() {
    super('StudyDB');
    
    // Increase the chunk size for large files
    this.version(1).stores({
      questions: '++id, timestamp',
      materials: '++id, timestamp, type',
      flashcards: '++id, lastReviewed',
    });

    // Configure for larger file handling
    this.on('ready', () => {
      Dexie.maxTableSize = 200 * 1024 * 1024; // 200MB total storage
    });
  }
}

// Create and export a single instance
export const db = new StudyDB();