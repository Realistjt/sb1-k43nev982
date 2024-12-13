import { db } from './db';
import type { Question, StudyMaterial, Flashcard } from '../../types';

// Question operations
export async function addQuestion(question: Omit<Question, 'id' | 'timestamp'>): Promise<Question> {
  const newQuestion = {
    ...question,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  await db.questions.add(newQuestion);
  return newQuestion;
}

export async function getQuestions(): Promise<Question[]> {
  return db.questions.toArray();
}

// Material operations
export async function addMaterial(material: Omit<StudyMaterial, 'id' | 'timestamp'>): Promise<StudyMaterial> {
  const newMaterial = {
    ...material,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  await db.materials.add(newMaterial);
  return newMaterial;
}

export async function getMaterials(): Promise<StudyMaterial[]> {
  return db.materials.toArray();
}

// Flashcard operations
export async function addFlashcard(flashcard: Omit<Flashcard, 'id'>): Promise<Flashcard> {
  const newFlashcard = {
    ...flashcard,
    id: crypto.randomUUID(),
  };
  await db.flashcards.add(newFlashcard);
  return newFlashcard;
}

export async function getFlashcards(): Promise<Flashcard[]> {
  return db.flashcards.toArray();
}