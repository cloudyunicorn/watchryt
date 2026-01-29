import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator, navigationRef } from './src/navigation';
import { initDatabase } from './src/services/db';
import { initNotifications } from './src/services/reminders';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { useShareIntent } from 'expo-share-intent';

export default function App() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();
  const hasHandledIntent = useRef(false);

  useEffect(() => {
    // Configure notification handler
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (e) {
      console.log("Notification handler failed (ignore in Expo Go)");
    }

    initApp();
  }, []);

  const initApp = async () => {
    try {
      await initDatabase();
      await initNotifications();
    } catch (e) {
      console.error("Initialization failed", e);
    }
  };

  // Handle share intent from other apps
  useEffect(() => {
    if (hasShareIntent && shareIntent && !hasHandledIntent.current) {
      hasHandledIntent.current = true;

      // Extract URL from share intent
      let sharedUrl = '';
      if (shareIntent.text) {
        // Try to extract URL from text
        const urlMatch = shareIntent.text.match(/https?:\/\/[^\s]+/);
        sharedUrl = urlMatch ? urlMatch[0] : shareIntent.text;
      } else if (shareIntent.webUrl) {
        sharedUrl = shareIntent.webUrl;
      }

      console.log('[ShareIntent] Received URL:', sharedUrl);

      if (sharedUrl && navigationRef.current) {
        // Small delay to ensure navigation is ready
        setTimeout(() => {
          navigationRef.current?.navigate('AddVideo', { sharedUrl });
          resetShareIntent();
          hasHandledIntent.current = false;
        }, 500);
      }
    }
  }, [hasShareIntent, shareIntent]);

  // Handle deep linking from notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      if (url && typeof url === 'string') {
        Linking.openURL(url).catch(e => console.error("Found no app to open url", e));
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
