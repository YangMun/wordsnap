import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useWordStore } from '../../src/store/useWordStore';
import { StreakBanner } from '../../src/components/home/StreakBanner';
import { WordCard } from '../../src/components/home/WordCard';
import { DailyProgress } from '../../src/components/home/DailyProgress';
import { Button } from '../../src/components/ui/Button';

export default function HomeScreen() {
  const todayWords = useWordStore(s => s.todayWords);
  const learnedEntries = useWordStore(s => s.learnedEntries);

  const todayIds = new Set(todayWords.map(w => w.id));
  const completedToday = learnedEntries.filter(e => todayIds.has(e.wordId)).length;

  function startFlashcard() {
    router.push('/flashcard');
  }

  function startQuiz() {
    router.push('/quiz');
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-textMain">WordSnap 📸</Text>
        <Text className="text-textSub text-sm mt-0.5">오늘도 5개 단어를 배워보세요!</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-2">
          <StreakBanner />
          <DailyProgress completed={completedToday} total={todayWords.length} />
        </View>

        <View className="px-4 mb-3">
          <Text className="text-base font-semibold text-textMain">오늘의 단어</Text>
          <Text className="text-xs text-textSub mt-0.5">탭하면 뜻을 확인할 수 있어요</Text>
        </View>

        {todayWords.map((word, i) => (
          <WordCard key={word.id} word={word} index={i} />
        ))}

        {todayWords.length === 0 && (
          <View className="items-center py-12">
            <Text className="text-4xl mb-4">⏳</Text>
            <Text className="text-textSub text-center">단어를 불러오는 중...</Text>
          </View>
        )}

        <View className="px-4 mt-2 gap-3">
          <Button title="📋 플래시카드 시작" onPress={startFlashcard} variant="primary" />
          <Button title="⚡ O/X 퀴즈 시작" onPress={startQuiz} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
