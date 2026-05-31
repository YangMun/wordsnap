import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStreakStore } from '../../store/useStreakStore';

export function StreakBanner() {
  const streak = useStreakStore(s => s.streak);
  const { currentStreak, longestStreak } = streak;

  return (
    <LinearGradient
      colors={['#F97316', '#FBBF24']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="rounded-2xl p-4 mx-4 mb-4"
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-white text-sm font-medium opacity-90">현재 스트릭</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-white text-4xl font-bold">🔥 {currentStreak}</Text>
            <Text className="text-white text-xl font-bold ml-1">일</Text>
          </View>
          <Text className="text-white text-xs opacity-80 mt-1">연속 학습 중!</Text>
        </View>
        <View className="items-end">
          <Text className="text-white text-xs opacity-80">최고 기록</Text>
          <Text className="text-white text-2xl font-bold">🏆 {longestStreak}일</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
