import Dexie, { Table } from 'dexie';
import type { Question, StudyMaterial, Flashcard } from '../../types';

class StudyDB extends Dexie {
  questions!: Table<Question>;
  materials!: Table<StudyMaterial>;
  flashcards!: Table<Flashcard>;

  constructor() {
    super('StudyDB');
    
    this.version(1).stores({
      questions: '++id, timestamp',
      materials: '++id, timestamp, type',
      flashcards: '++id, lastReviewed',
    });

    // Add indexes for better performance and data management
    this.questions.hook('creating', (primKey, obj) => {
      obj.timestamp = obj.timestamp || Date.now();
    });

    this.materials.hook('creating', (primKey, obj) => {
      obj.timestamp = obj.timestamp || Date.now();
    });

    this.flashcards.hook('creating', (primKey, obj) => {
      obj.lastReviewed = obj.lastReviewed || Date.now();
    });
  }

  async cleanup() {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    await Promise.all([
      this.questions.where('timestamp').below(thirtyDaysAgo).delete(),
      this.materials.where('timestamp').below(thirtyDaysAgo).delete(),
      this.flashcards.where('lastReviewed').below(thirtyDaysAgo).delete(),
    ]);
  }
}

const db = new StudyDB();

// Perform cleanup periodically
setInterval(() => {
  db.cleanup().catch(console.error);
}, 24 * 60 * 60 * 1000); // Once per day

export { db };