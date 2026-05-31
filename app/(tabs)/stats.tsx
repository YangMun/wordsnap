import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useStatsStore } from '../../src/store/useStatsStore';
import { useStreakStore } from '../../src/store/useStreakStore';
import { StatCard } from '../../src/components/stats/StatCard';
import { WeeklyChart } from '../../src/components/stats/WeeklyChart';
import { storage } from '../../src/lib/storage';
import { scheduleStudyReminder, requestNotificationPermission } from '../../src/hooks/useNotifications';

export default function StatsScreen() {
  const stats = useStatsStore(s => s.stats);
  const streak = useStreakStore(s => s.streak);
  const weeklyActivity = useStatsStore(s => s.getWeeklyActivity)();
  const [notifEnabled, setNotifEnabled] = useState(false);

  React.useEffect(() => {
    storage.getNotifPrefs().then(p => { if (p) setNotifEnabled(p.enabled); });
  }, []);

  async function toggleNotif(val: boolean) {
    setNotifEnabled(val);
    if (val) await requestNotificationPermission();
    const prefs = { enabled: val, hour: 8, minute: 0 };
    await storage.setNotifPrefs(prefs);
    await scheduleStudyReminder(prefs);
  }

  const accuracy = stats.totalQuizzesTaken > 0
    ? Math.round((stats.totalCorrectAnswers / (stats.totalCorrectAnswers + stats.totalWrongAnswers)) * 100)
    : 0;

  const recentSessions = [...stats.sessionHistory].reverse().slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-textMain">학습 통계 📊</Text>
        </View>

        <View className="flex-row px-4 gap-3 mb-4">
          <StatCard label="학습한 단어" value={`${stats.totalWordsLearned}`} emoji="📖" />
          <StatCard label="현재 스트릭" value={`${streak.currentStreak}일`} emoji="🔥" color="bg-orange-50" />
        </View>
        <View className="flex-row px-4 gap-3 mb-4">
          <StatCard label="퀴즈 정확도" value={`${accuracy}%`} emoji="🎯" />
          <StatCard label="총 학습 일수" value={`${streak.totalStudyDays}일`} emoji="📅" color="bg-yellow-50" />
        </View>

        <View className="px-4 mb-4">
          <WeeklyChart sessions={weeklyActivity} />
        </View>

        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="font-bold text-textMain mb-3">카테고리별 학습</Text>
            {Object.entries(stats.categoryProgress).map(([cat, count]) => (
              <View key={cat} className="mb-2">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-textSub capitalize">{cat}</Text>
                  <Text className="text-sm font-medium text-textMain">{count}개</Text>
                </View>
                <View className="h-1.5 bg-cream-dark rounded-full">
                  <View className="h-full bg-primary rounded-full" style={{ width: `${Math.min((count / 30) * 100, 100)}%` }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {recentSessions.length > 0 && (
          <View className="px-4 mb-4">
            <Text className="font-semibold text-textMain mb-2">최근 퀴즈</Text>
            {recentSessions.map(s => (
              <View key={s.date} className="bg-white rounded-2xl p-3 mb-2 flex-row items-center border border-gray-100">
                <Text className="text-2xl mr-3">{s.completedQuiz ? '✅' : '⬜'}</Text>
                <View>
                  <Text className="text-sm font-medium text-textMain">{s.date}</Text>
                  {s.completedQuiz && <Text className="text-xs text-textSub">점수: {s.quizScore}/5</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="px-4">
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-gray-100">
            <View>
              <Text className="font-bold text-textMain">매일 학습 알림</Text>
              <Text className="text-xs text-textSub mt-0.5">오전 8시에 알림을 받아요</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={toggleNotif}
              trackColor={{ false: '#D1D5DB', true: '#F97316' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
