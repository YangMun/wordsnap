import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../ui/Button';
import type { QuizSession } from '../../types';

interface Props {
  session: QuizSession;
  onRetry: () => void;
  onHome: () => void;
}

function Stars({ score, total }: { score: number; total: number }) {
  const ratio = score / total;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
  return (
    <Text className="text-5xl text-center mb-2">
      {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
    </Text>
  );
}

export function QuizResult({ session, onRetry, onHome }: Props) {
  const total = session.questions.length;

  return (
    <View className="flex-1 bg-cream p-6">
      <Text className="text-2xl font-bold text-textMain text-center mb-2">퀴즈 완료!</Text>
      <Stars score={session.score} total={total} />
      <Text className="text-4xl font-bold text-primary text-center mb-1">{session.score}/{total}</Text>
      <Text className="text-textSub text-center mb-6">정답</Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {session.questions.map((q, i) => (
          <View key={q.word.id} className="bg-white rounded-2xl p-4 mb-3 flex-row items-center">
            <Text className="text-2xl mr-3">
              {q.result === 'correct' ? '✅' : q.result === 'wrong' ? '❌' : '⬜'}
            </Text>
            <View className="flex-1">
              <Text className="font-bold text-textMain">{q.word.english}</Text>
              <Text className="text-sm text-textSub">{q.word.korean}</Text>
              {q.result === 'wrong' && (
                <Text className="text-xs text-wrong mt-1">표시된 뜻: {q.displayedKorean}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="gap-3 mt-4">
        <Button title="다시 풀기" onPress={onRetry} variant="primary" />
        <Button title="홈으로" onPress={onHome} variant="ghost" />
      </View>
    </View>
  );
}
