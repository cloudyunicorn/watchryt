import React from 'react';
import { NavigationContainer, DarkTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { FolderListScreen } from '../screens/FolderListScreen';
import { FolderDetailScreen } from '../screens/FolderDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AddVideoModal } from '../screens/AddVideoModal';

// Navigation ref for programmatic navigation from App.tsx
export const navigationRef = createNavigationContainerRef<any>();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const FolderStack = createStackNavigator();

const FolderStackNavigator = () => (
    <FolderStack.Navigator screenOptions={{ headerShown: false }}>
        <FolderStack.Screen name="FolderList" component={FolderListScreen} />
        <FolderStack.Screen name="FolderDetail" component={FolderDetailScreen} />
    </FolderStack.Navigator>
);

const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }: { route: any }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.surfaceHighlight,
                paddingBottom: 4,
                paddingTop: 4,
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
                let iconName: any = 'home';
                if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                else if (route.name === 'Folders') iconName = focused ? 'folder' : 'folder-outline';
                else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Folders" component={FolderStackNavigator} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
);

export const RootNavigator = () => (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
                name="AddVideo"
                component={AddVideoModal}
                options={{
                    presentation: 'modal',
                    cardStyle: { backgroundColor: 'transparent' } // If custom modal effect needed
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
);
