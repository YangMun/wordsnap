import '../global.css';
import React, { useEffect, Component } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView } from 'react-native';
import { useWordStore } from '../src/store/useWordStore';
import { useStreakStore } from '../src/store/useStreakStore';
import { useStatsStore } from '../src/store/useStatsStore';
import { useNotificationSetup } from '../src/hooks/useNotifications';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <View style={{ flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 12 }}>
            앱 오류 발생
          </Text>
          <ScrollView>
            <Text style={{ fontSize: 13, color: '#333', fontFamily: 'monospace' }}>
              {err.message}{'\n\n'}{err.stack}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppLayout() {
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

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  );
}
