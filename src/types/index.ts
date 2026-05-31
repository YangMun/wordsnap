export type WordCategory =
  | 'daily'
  | 'travel'
  | 'business'
  | 'academic'
  | 'idiom'
  | 'emotion'
  | 'nature';

export interface Word {
  id: string;
  english: string;
  korean: string;
  pronunciation: string;
  partOfSpeech: 'verb' | 'noun' | 'adjective' | 'adverb' | 'phrase';
  category: WordCategory;
  difficulty: 1 | 2 | 3;
  exampleEn: string;
  exampleKo: string;
  synonyms: string[];
  imageEmoji: string;
}

export interface LearnedEntry {
  wordId: string;
  learnedAt: string;
  quizCorrectCount: number;
  quizAttemptCount: number;
}

export interface DailySession {
  date: string;
  wordIds: string[];
  completedFlashcard: boolean;
  completedQuiz: boolean;
  quizScore: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalStudyDays: number;
}

export interface StatsData {
  totalWordsLearned: number;
  totalQuizzesTaken: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  sessionHistory: DailySession[];
  categoryProgress: Record<WordCategory, number>;
}

export type QuizAnswerResult = 'correct' | 'wrong' | 'unanswered';

export interface QuizQuestion {
  word: Word;
  displayedKorean: string;
  isCorrect: boolean;
  userAnswer: 'O' | 'X' | null;
  result: QuizAnswerResult;
}

export interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  totalTime: number;
  isComplete: boolean;
  startedAt: string;
}

export interface NotificationPrefs {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface FlashcardSession {
  wordIds: string[];
  currentIndex: number;
  isFlipped: boolean;
  completedIds: string[];
}
