import { create } from 'zustand';
import { storage } from '../lib/storage';
import { getTodayString, isYesterday } from '../lib/dateUtils';
import type { StreakData } from '../types';

const DEFAULT: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalStudyDays: 0,
};

interface StreakStore {
  streak: StreakData;
  hydrate: () => Promise<void>;
  recordStudyToday: () => Promise<void>;
}

export const useStreakStore = create<StreakStore>((set, get) => ({
  streak: DEFAULT,

  hydrate: async () => {
    const saved = await storage.getStreak();
    if (saved) set({ streak: saved });
  },

  recordStudyToday: async () => {
    const today = getTodayString();
    const { streak } = get();
    if (streak.lastStudyDate === today) return;

    let newStreak: number;
    if (streak.lastStudyDate === null) {
      newStreak = 1;
    } else if (isYesterday(streak.lastStudyDate)) {
      newStreak = streak.currentStreak + 1;
    } else {
      newStreak = 1;
    }

    const updated: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastStudyDate: today,
      totalStudyDays: streak.totalStudyDays + 1,
    };
    set({ streak: updated });
    await storage.setStreak(updated);
  },
}));
