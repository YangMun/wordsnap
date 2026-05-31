import { create } from 'zustand';
import { storage } from '../lib/storage';
import { selectTodayWords, selectDecoyKorean } from '../lib/wordSelector';
import { getTodayString } from '../lib/dateUtils';
import { fetchRemoteWords } from '../lib/wordFetcher';
import wordsData from '../data/words.json';
import type { Word, LearnedEntry, FlashcardSession, QuizSession, QuizQuestion } from '../types';

interface WordStore {
  allWords: Word[];
  todayWords: Word[];
  learnedEntries: LearnedEntry[];
  flashcardSession: FlashcardSession | null;
  quizSession: QuizSession | null;

  hydrate: () => Promise<void>;
  refreshTodayWords: () => void;
  markWordLearned: (wordId: string) => Promise<void>;

  startFlashcardSession: () => void;
  flipCard: () => void;
  nextCard: () => void;
  prevCard: () => void;
  completeFlashcard: () => void;

  startQuizSession: () => void;
  answerQuizQuestion: (answer: 'O' | 'X') => void;
  completeQuiz: () => void;
}

export const useWordStore = create<WordStore>((set, get) => ({
  allWords: (wordsData as { words: Word[] }).words,
  todayWords: [],
  learnedEntries: [],
  flashcardSession: null,
  quizSession: null,

  hydrate: async () => {
    const saved = await storage.getLearned();
    const entries = saved ?? [];
    set({ learnedEntries: entries });
    get().refreshTodayWords();

    fetchRemoteWords().then(remote => {
      if (remote && remote.length > 0) {
        set({ allWords: remote });
        get().refreshTodayWords();
      }
    });
  },

  refreshTodayWords: () => {
    const { allWords, learnedEntries } = get();
    const learnedIds = new Set(learnedEntries.map(e => e.wordId));
    const today = getTodayString();
    const words = selectTodayWords(allWords, learnedIds, today);
    set({ todayWords: words });
  },

  markWordLearned: async (wordId) => {
    const { learnedEntries } = get();
    if (learnedEntries.some(e => e.wordId === wordId)) return;
    const updated = [...learnedEntries, { wordId, learnedAt: getTodayString(), quizCorrectCount: 0, quizAttemptCount: 0 }];
    set({ learnedEntries: updated });
    await storage.setLearned(updated);
  },

  startFlashcardSession: () => {
    const { todayWords } = get();
    set({
      flashcardSession: {
        wordIds: todayWords.map(w => w.id),
        currentIndex: 0,
        isFlipped: false,
        completedIds: [],
      },
    });
  },

  flipCard: () => {
    const { flashcardSession } = get();
    if (!flashcardSession) return;
    set({ flashcardSession: { ...flashcardSession, isFlipped: !flashcardSession.isFlipped } });
  },

  nextCard: () => {
    const { flashcardSession, todayWords } = get();
    if (!flashcardSession) return;
    const current = todayWords[flashcardSession.currentIndex];
    const completedIds = current
      ? [...new Set([...flashcardSession.completedIds, current.id])]
      : flashcardSession.completedIds;
    const next = Math.min(flashcardSession.currentIndex + 1, flashcardSession.wordIds.length - 1);
    set({ flashcardSession: { ...flashcardSession, currentIndex: next, isFlipped: false, completedIds } });
  },

  prevCard: () => {
    const { flashcardSession } = get();
    if (!flashcardSession) return;
    set({ flashcardSession: { ...flashcardSession, currentIndex: Math.max(0, flashcardSession.currentIndex - 1), isFlipped: false } });
  },

  completeFlashcard: () => {
    set({ flashcardSession: null });
  },

  startQuizSession: () => {
    const { todayWords, allWords } = get();
    const questions: QuizQuestion[] = todayWords.map(word => {
      const isCorrect = Math.random() > 0.5;
      const displayedKorean = isCorrect ? word.korean : selectDecoyKorean(allWords, word.id);
      return { word, displayedKorean, isCorrect, userAnswer: null, result: 'unanswered' };
    });
    set({
      quizSession: {
        questions,
        currentIndex: 0,
        score: 0,
        totalTime: 0,
        isComplete: false,
        startedAt: new Date().toISOString(),
      },
    });
  },

  answerQuizQuestion: (answer) => {
    const { quizSession } = get();
    if (!quizSession || quizSession.isComplete) return;
    const questions = [...quizSession.questions];
    const q = { ...questions[quizSession.currentIndex] };
    const correct = (answer === 'O') === q.isCorrect;
    q.userAnswer = answer;
    q.result = correct ? 'correct' : 'wrong';
    questions[quizSession.currentIndex] = q;
    const score = quizSession.score + (correct ? 1 : 0);
    set({ quizSession: { ...quizSession, questions, score } });
  },

  completeQuiz: () => {
    const { quizSession } = get();
    if (!quizSession) return;
    const elapsed = Math.round((Date.now() - new Date(quizSession.startedAt).getTime()) / 1000);
    set({ quizSession: { ...quizSession, isComplete: true, totalTime: elapsed } });
  },
}));
