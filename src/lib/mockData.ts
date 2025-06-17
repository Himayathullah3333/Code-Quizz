import type { Question, Contest, Participant } from '@/types';

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    questionText: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctAnswerIndex: 1,
    category: 'Geography',
  },
  {
    id: 'q2',
    questionText: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1,
    category: 'Science',
  },
  {
    id: 'q3',
    questionText: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswerIndex: 1,
    category: 'Mathematics',
  },
  {
    id: 'q4',
    questionText: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'],
    correctAnswerIndex: 2,
    category: 'Art',
  },
  {
    id: 'q5',
    questionText: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswerIndex: 3,
    category: 'Geography',
  },
  {
    id: 'q6',
    questionText: 'What is the chemical symbol for water?',
    options: ['H2O', 'O2', 'CO2', 'NaCl'],
    correctAnswerIndex: 0,
    category: 'Science',
  },
  {
    id: 'q7',
    questionText: 'Which is the largest mammal?',
    options: ['Elephant', 'Blue Whale', 'Giraffe', 'Great White Shark'],
    correctAnswerIndex: 1,
    category: 'Science',
  },
  {
    id: 'q8',
    questionText: 'What year did World War II end?',
    options: ['1942', '1945', '1948', '1950'],
    correctAnswerIndex: 1,
    category: 'History',
  },
  {
    id: 'q9',
    questionText: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswerIndex: 1,
    category: 'Literature',
  },
  {
    id: 'q10',
    questionText: 'What is the currency of Japan?',
    options: ['Won', 'Yuan', 'Yen', 'Baht'],
    correctAnswerIndex: 2,
    category: 'General Knowledge',
  },
];

export const mockContest: Contest = {
  id: 'CONTEST123',
  name: 'General Knowledge Challenge',
  questions: mockQuestions,
};

export const mockParticipants: Participant[] = [
  { id: 'user1', username: 'PlayerOne', score: 0 },
  { id: 'user2', username: 'QuizWhiz', score: 0 },
  { id: 'user3', username: 'SmartyPants', score: 0 },
];
