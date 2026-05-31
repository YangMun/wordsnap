import type { Word } from '../types';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  const rand = seededRandom(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function dateSeed(dateStr: string): number {
  return dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function selectTodayWords(allWords: Word[], learnedIds: Set<string>, dateStr: string): Word[] {
  const seed = dateSeed(dateStr);
  const unlearned = allWords.filter(w => !learnedIds.has(w.id));
  const pool = unlearned.length >= 5 ? unlearned : allWords;
  return seededShuffle(pool, seed).slice(0, 5);
}

export function selectDecoyKorean(allWords: Word[], excludeId: string): string {
  const others = allWords.filter(w => w.id !== excludeId);
  const idx = Math.floor(Math.random() * others.length);
  return others[idx]?.korean ?? '모르는 단어';
}
