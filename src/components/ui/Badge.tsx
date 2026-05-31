import React from 'react';
import { View, Text } from 'react-native';
import type { WordCategory } from '../../types';

const CATEGORY_LABELS: Record<WordCategory, string> = {
  daily: '일상',
  travel: '여행',
  business: '비즈니스',
  academic: '학문',
  idiom: '관용구',
  emotion: '감정',
  nature: '자연',
};

const CATEGORY_COLORS: Record<WordCategory, string> = {
  daily: 'bg-blue-100 text-blue-700',
  travel: 'bg-green-100 text-green-700',
  business: 'bg-purple-100 text-purple-700',
  academic: 'bg-indigo-100 text-indigo-700',
  idiom: 'bg-orange-100 text-orange-700',
  emotion: 'bg-pink-100 text-pink-700',
  nature: 'bg-teal-100 text-teal-700',
};

interface Props {
  category: WordCategory;
}

export function Badge({ category }: Props) {
  const colors = CATEGORY_COLORS[category];
  const [bg, text] = colors.split(' ');
  return (
    <View className={`px-2 py-0.5 rounded-full ${bg}`}>
      <Text className={`text-xs font-semibold ${text}`}>{CATEGORY_LABELS[category]}</Text>
    </View>
  );
}
