import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { initDatabase } from './src/services/db';
import { initNotifications } from './src/services/reminders';
import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';


export default function App() {
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
