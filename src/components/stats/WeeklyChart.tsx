import React from 'react';
import { View, Text } from 'react-native';
import type { DailySession } from '../../types';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  sessions: DailySession[];
}

export function WeeklyChart({ sessions }: Props) {
  const max = Math.max(...sessions.map(s => s.wordIds.length), 1);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <Text className="font-bold text-textMain mb-4">이번 주 학습</Text>
      <View className="flex-row items-end justify-between h-24">
        {sessions.map((s, i) => {
          const dayOfWeek = new Date(s.date + 'T00:00:00').getDay();
          const label = DAY_LABELS[dayOfWeek];
          const ratio = s.wordIds.length / max;
          const isToday = i === sessions.length - 1;
          return (
            <View key={s.date} className="items-center flex-1">
              <View
                className={`rounded-t-lg w-6 ${isToday ? 'bg-primary' : s.wordIds.length > 0 ? 'bg-accent' : 'bg-cream-dark'}`}
                style={{ height: Math.max(ratio * 80, s.wordIds.length > 0 ? 8 : 4) }}
              />
              <Text className={`text-xs mt-1 ${isToday ? 'text-primary font-bold' : 'text-textSub'}`}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
