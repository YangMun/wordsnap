import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { storage } from '../lib/storage';
import type { NotificationPrefs } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleStudyReminder(prefs: NotificationPrefs): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!prefs.enabled) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 오늘의 단어 학습 시간!',
      body: '오늘의 영단어 5개를 학습하고 스트릭을 유지하세요 🔥',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: prefs.hour,
      minute: prefs.minute,
    },
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function useNotificationSetup() {
  useEffect(() => {
    (async () => {
      const prefs = await storage.getNotifPrefs();
      if (prefs?.enabled) {
        const granted = await requestNotificationPermission();
        if (granted) await scheduleStudyReminder(prefs);
      }
    })();
  }, []);
}
