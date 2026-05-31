import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  completed: number;
  total: number;
}

export function DailyProgress({ completed, total }: Props) {
  const pct = total > 0 ? completed / total : 0;

  return (
    <View className="mx-4 mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-textMain font-semibold">오늘의 단어</Text>
        <Text className="text-primary font-bold">{completed}/{total} 완료</Text>
      </View>
      <View className="h-2 bg-cream-dark rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${pct * 100}%` }}
        />
      </View>
    </View>
  );
}
