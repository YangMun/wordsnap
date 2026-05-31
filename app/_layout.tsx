import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWordStore } from '../src/store/useWordStore';
import { useStreakStore } from '../src/store/useStreakStore';
import { useStatsStore } from '../src/store/useStatsStore';
import { useNotificationSetup } from '../src/hooks/useNotifications';

export default function RootLayout() {
  const hydrateWords = useWordStore(s => s.hydrate);
  const hydrateStreak = useStreakStore(s => s.hydrate);
  const hydrateStats = useStatsStore(s => s.hydrate);
  useNotificationSetup();

  useEffect(() => {
    Promise.all([hydrateWords(), hydrateStreak(), hydrateStats()]);
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="flashcard"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="quiz"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}
