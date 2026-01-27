import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native'; // OS check

export const initNotifications = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permission not granted for notifications');
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return true;
    } catch (error) {
        console.warn('Notification initialization failed (likely Expo Go limitation):', error);
        return false;
    }
};

export const scheduleReminder = async (title: string, body: string, secondsFromNow: number, data: any = {}) => {
    const trigger = secondsFromNow <= 0 ? null : { seconds: secondsFromNow };

    // If secondsFromNow is very small or 0, it might be immediate.
    // However, usually we schedule for the future.
    if (!trigger) return;

    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
            sound: true,
        },
        trigger: trigger as any,
    });
};

export const cancelCallback = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
}
