import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useWordStore } from '../src/store/useWordStore';
import { useStreakStore } from '../src/store/useStreakStore';
import { useStatsStore } from '../src/store/useStatsStore';
import { FlashCard } from '../src/components/flashcard/FlashCard';

export default function FlashcardScreen() {
  const { flashcardSession, startFlashcardSession, flipCard, nextCard, prevCard, completeFlashcard, todayWords, markWordLearned } = useWordStore();
  const recordStudyToday = useStreakStore(s => s.recordStudyToday);
  const recordFlashcardCompletion = useStatsStore(s => s.recordFlashcardCompletion);

  useEffect(() => {
    startFlashcardSession();
    return () => completeFlashcard();
  }, []);

  if (!flashcardSession) return null;

  const currentWord = todayWords[flashcardSession.currentIndex];
  const isLast = flashcardSession.currentIndex === flashcardSession.wordIds.length - 1;

  async function handleNext() {
    if (currentWord) await markWordLearned(currentWord.id);
    if (isLast) {
      const ids = todayWords.map(w => w.id);
      const cats = todayWords.map(w => w.category);
      await recordStudyToday();
      await recordFlashcardCompletion(ids, cats);
      completeFlashcard();
      router.replace('/');
    } else {
      nextCard();
    }
  }

  if (!currentWord) return null;

  const progress = flashcardSession.currentIndex + 1;
  const total = flashcardSession.wordIds.length;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => { completeFlashcard(); router.back(); }} hitSlop={8}>
          <Text className="text-textSub text-lg">✕</Text>
        </TouchableOpacity>
        <Text className="text-textMain font-semibold">{progress} / {total}</Text>
        <View className="w-6" />
      </View>

      <View className="mx-4 h-1.5 bg-cream-dark rounded-full mb-6">
        <View className="h-full bg-primary rounded-full" style={{ width: `${(progress / total) * 100}%` }} />
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <FlashCard
          word={currentWord}
          isFlipped={flashcardSession.isFlipped}
          onFlip={flipCard}
        />
      </View>

      <View className="flex-row px-6 pb-6 gap-4 mt-4">
        {flashcardSession.currentIndex > 0 && (
          <TouchableOpacity
            onPress={prevCard}
            className="flex-1 bg-white rounded-2xl py-4 items-center border border-gray-200"
          >
            <Text className="text-textMain font-semibold">← 이전</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          className="flex-1 bg-primary rounded-2xl py-4 items-center"
        >
          <Text className="text-white font-bold">{isLast ? '완료 ✓' : '다음 →'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
