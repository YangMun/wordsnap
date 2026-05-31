import { create } from 'zustand';
import { storage } from '../lib/storage';
import { getTodayString } from '../lib/dateUtils';
import type { StatsData, DailySession, QuizSession, WordCategory } from '../types';

const DEFAULT_STATS: StatsData = {
  totalWordsLearned: 0,
  totalQuizzesTaken: 0,
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  sessionHistory: [],
  categoryProgress: {
    daily: 0, travel: 0, business: 0, academic: 0,
    idiom: 0, emotion: 0, nature: 0,
  },
};

interface StatsStore {
  stats: StatsData;
  hydrate: () => Promise<void>;
  recordQuizResult: (session: QuizSession, wordCategories: WordCategory[]) => Promise<void>;
  recordFlashcardCompletion: (wordIds: string[], categories: WordCategory[]) => Promise<void>;
  getWeeklyActivity: () => DailySession[];
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: DEFAULT_STATS,

  hydrate: async () => {
    const saved = await storage.getStats();
    if (saved) set({ stats: saved });
  },

  recordQuizResult: async (session, wordCategories) => {
    const { stats } = get();
    const correct = session.questions.filter(q => q.result === 'correct').length;
    const wrong = session.questions.filter(q => q.result === 'wrong').length;
    const today = getTodayString();

    const history = [...stats.sessionHistory];
    const todayIdx = history.findIndex(s => s.date === today);
    if (todayIdx >= 0) {
      history[todayIdx] = { ...history[todayIdx], completedQuiz: true, quizScore: session.score };
    } else {
      history.push({
        date: today,
        wordIds: session.questions.map(q => q.word.id),
        completedFlashcard: false,
        completedQuiz: true,
        quizScore: session.score,
      });
    }

    const updated: StatsData = {
      ...stats,
      totalQuizzesTaken: stats.totalQuizzesTaken + 1,
      totalCorrectAnswers: stats.totalCorrectAnswers + correct,
      totalWrongAnswers: stats.totalWrongAnswers + wrong,
      sessionHistory: history.slice(-30),
    };
    set({ stats: updated });
    await storage.setStats(updated);
  },

  recordFlashcardCompletion: async (wordIds, categories) => {
    const { stats } = get();
    const today = getTodayString();
    const catProgress = { ...stats.categoryProgress };
    categories.forEach(c => { catProgress[c] = (catProgress[c] ?? 0) + 1; });

    const history = [...stats.sessionHistory];
    const todayIdx = history.findIndex(s => s.date === today);
    if (todayIdx >= 0) {
      history[todayIdx] = { ...history[todayIdx], completedFlashcard: true };
    } else {
      history.push({
        date: today,
        wordIds,
        completedFlashcard: true,
        completedQuiz: false,
        quizScore: 0,
      });
    }

    const updated: StatsData = {
      ...stats,
      totalWordsLearned: stats.totalWordsLearned + wordIds.length,
      categoryProgress: catProgress,
      sessionHistory: history.slice(-30),
    };
    set({ stats: updated });
    await storage.setStats(updated);
  },

  getWeeklyActivity: () => {
    const { stats } = get();
    const days: DailySession[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const session = stats.sessionHistory.find(s => s.date === dateStr);
      days.push(session ?? { date: dateStr, wordIds: [], completedFlashcard: false, completedQuiz: false, quizScore: 0 });
    }
    return days;
  },
}));
