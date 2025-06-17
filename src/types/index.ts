
export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  category?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeTaken: number; // in seconds for the specific question
}

export interface Participant {
  id: string;
  username: string;
  score: number;
  rank?: number;
}

export interface Contest {
  id: string;
  name: string;
  questions: Question[];
}
