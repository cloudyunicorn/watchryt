import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

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

const MainTabs = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: any }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.surfaceHighlight,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 24,
                    height: 70,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
                    let iconName: any = 'home';
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Folders') iconName = focused ? 'folder' : 'folder-outline';
                    else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
                    return <Ionicons name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Folders" component={FolderStackNavigator} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export const RootNavigator = () => {
    const { isDarkMode, colors } = useTheme();

    // Create custom theme based on current colors
    const navigationTheme = isDarkMode ? {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: colors.background,
            card: colors.surface,
            text: colors.textPrimary,
            primary: colors.primary,
            border: colors.border,
        },
    } : {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: colors.background,
            card: colors.surface,
            text: colors.textPrimary,
            primary: colors.primary,
            border: colors.border,
        },
    };

    return (
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen
                    name="AddVideo"
                    component={AddVideoModal}
                    options={{
                        presentation: 'modal',
                        cardStyle: { backgroundColor: 'transparent' }
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
