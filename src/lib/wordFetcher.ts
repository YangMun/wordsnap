import { storage } from './storage';
import { getTodayString } from './dateUtils';
import type { Word } from '../types';

const REMOTE_URL =
  'https://raw.githubusercontent.com/YangMun/wordsnap/claude/english-learning-app-NWogo/src/data/words.json';

export async function fetchRemoteWords(): Promise<Word[] | null> {
  try {
    const today = getTodayString();
    const cacheDate = await storage.getWordCacheDate();
    if (cacheDate === today) return null;

    const res = await fetch(REMOTE_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { words: Word[] };
    if (!Array.isArray(data.words)) return null;

    await storage.setCachedWords(data.words);
    await storage.setWordCacheDate(today);
    return data.words;
  } catch {
    return null;
  }
}
