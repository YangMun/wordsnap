import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useWordStore } from '../src/store/useWordStore';
import { useStreakStore } from '../src/store/useStreakStore';
import { useStatsStore } from '../src/store/useStatsStore';
import { QuizTimer } from '../src/components/quiz/QuizTimer';
import { QuizResult } from '../src/components/quiz/QuizResult';
import { tts } from '../src/lib/tts';

export default function QuizScreen() {
  const { quizSession, startQuizSession, answerQuizQuestion, completeQuiz, todayWords } = useWordStore();
  const recordStudyToday = useStreakStore(s => s.recordStudyToday);
  const recordQuizResult = useStatsStore(s => s.recordQuizResult);
  const feedbackBg = useSharedValue('transparent');
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startQuizSession();
  }, []);

  const feedbackStyle = useAnimatedStyle(() => ({
    backgroundColor: feedbackBg.value as string,
  }));

  if (!quizSession) return null;

  if (quizSession.isComplete) {
    return (
      <QuizResult
        session={quizSession}
        onRetry={() => startQuizSession()}
        onHome={() => { router.replace('/'); }}
      />
    );
  }

  const q = quizSession.questions[quizSession.currentIndex];
  if (!q) return null;

  async function handleAnswer(answer: 'O' | 'X') {
    if (advanceTimer.current) return;
    answerQuizQuestion(answer);
    const correct = (answer === 'O') === q.isCorrect;
    feedbackBg.value = withSequence(
      withTiming(correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', { duration: 200 }),
      withTiming('transparent', { duration: 600 })
    );

    const session = quizSession;
    if (!session) return;
    const isLast = session.currentIndex === session.questions.length - 1;
    advanceTimer.current = setTimeout(async () => {
      advanceTimer.current = null;
      if (isLast) {
        completeQuiz();
        await recordStudyToday();
        await recordQuizResult(
          { ...session, isComplete: true, totalTime: 0 },
          todayWords.map(w => w.category)
        );
      } else {
        useWordStore.setState(s => ({
          quizSession: s.quizSession
            ? { ...s.quizSession, currentIndex: s.quizSession.currentIndex + 1 }
            : null,
        }));
      }
    }, 800);
  }

  function handleTimeout() {
    completeQuiz();
    recordStudyToday();
  }

  const current = quizSession.currentIndex + 1;
  const total = quizSession.questions.length;

  return (
    <Animated.View style={[{ flex: 1 }, feedbackStyle]}>
      <SafeAreaView className="flex-1 bg-cream">
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => { completeQuiz(); router.back(); }} hitSlop={8}>
            <Text className="text-textSub text-lg">✕</Text>
          </TouchableOpacity>
          <QuizTimer duration={60} onTimeout={handleTimeout} />
          <Text className="text-textMain font-semibold">{current}/{total}</Text>
        </View>

        <View className="mx-4 h-1.5 bg-cream-dark rounded-full mb-8">
          <View className="h-full bg-primary rounded-full" style={{ width: `${(current / total) * 100}%` }} />
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-sm text-textSub font-medium mb-2">이 단어의 뜻이 맞나요?</Text>
          <Text className="text-4xl font-bold text-textMain text-center mb-2">{q.word.english}</Text>
          <TouchableOpacity onPress={() => tts.speak(q.word.english)} className="mb-8">
            <Text className="text-2xl">🔊</Text>
          </TouchableOpacity>

          <View className="bg-white rounded-3xl px-10 py-6 w-full items-center shadow-sm border border-gray-100 mb-10">
            <Text className="text-2xl font-bold text-textMain text-center">{q.displayedKorean}</Text>
          </View>

          <View className="flex-row gap-6 w-full px-4">
            <TouchableOpacity
              onPress={() => handleAnswer('O')}
              className="flex-1 bg-correct rounded-3xl py-6 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-5xl">⭕</Text>
              <Text className="text-white font-bold text-lg mt-1">맞아요</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAnswer('X')}
              className="flex-1 bg-wrong rounded-3xl py-6 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-5xl">❌</Text>
              <Text className="text-white font-bold text-lg mt-1">틀려요</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
