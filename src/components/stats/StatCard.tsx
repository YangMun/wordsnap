import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  label: string;
  value: string;
  emoji: string;
  color?: string;
}

export function StatCard({ label, value, emoji, color = 'bg-white' }: Props) {
  return (
    <View className={`${color} rounded-2xl p-4 flex-1 items-center shadow-sm border border-gray-100`}>
      <Text className="text-3xl mb-1">{emoji}</Text>
      <Text className="text-2xl font-bold text-textMain">{value}</Text>
      <Text className="text-xs text-textSub text-center mt-1">{label}</Text>
    </View>
  );
}
