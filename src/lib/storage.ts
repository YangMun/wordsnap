import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StreakData, LearnedEntry, StatsData, DailySession, NotificationPrefs } from '../types';

const KEYS = {
  streak: '@wordsnap/streak',
  learned: '@wordsnap/learned',
  stats: '@wordsnap/stats',
  sessions: '@wordsnap/sessions',
  notifPrefs: '@wordsnap/notifPrefs',
  cachedWords: '@wordsnap/cachedWords',
  wordCacheDate: '@wordsnap/wordCacheDate',
} as const;

async function get<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

async function set(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getStreak: () => get<StreakData>(KEYS.streak),
  setStreak: (v: StreakData) => set(KEYS.streak, v),

  getLearned: () => get<LearnedEntry[]>(KEYS.learned),
  setLearned: (v: LearnedEntry[]) => set(KEYS.learned, v),

  getStats: () => get<StatsData>(KEYS.stats),
  setStats: (v: StatsData) => set(KEYS.stats, v),

  getSessions: () => get<DailySession[]>(KEYS.sessions),
  setSessions: (v: DailySession[]) => set(KEYS.sessions, v),

  getNotifPrefs: () => get<NotificationPrefs>(KEYS.notifPrefs),
  setNotifPrefs: (v: NotificationPrefs) => set(KEYS.notifPrefs, v),

  getCachedWords: () => get<unknown>(KEYS.cachedWords),
  setCachedWords: (v: unknown) => set(KEYS.cachedWords, v),

  getWordCacheDate: () => get<string>(KEYS.wordCacheDate),
  setWordCacheDate: (v: string) => set(KEYS.wordCacheDate, v),
};
