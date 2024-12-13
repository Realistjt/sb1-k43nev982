export interface Question {
  id: string;
  text: string;
  timestamp: number;
  answer?: string;
}

export interface StudyMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'note' | 'image';
  content: string;
  timestamp: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  lastReviewed?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}