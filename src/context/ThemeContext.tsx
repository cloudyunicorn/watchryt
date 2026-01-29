import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, spacing, typography, borderRadius, ThemeColors } from '../constants/theme';

const THEME_KEY = '@watchryt_theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    isDarkMode: boolean;
    themeMode: ThemeMode;
    colors: ThemeColors;
    spacing: typeof spacing;
    typography: typeof typography;
    borderRadius: typeof borderRadius;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
    const [isLoaded, setIsLoaded] = useState(false);

    // Determine if dark mode based on theme mode and system preference
    const isDarkMode = themeMode === 'system'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    const colors = isDarkMode ? darkColors : lightColors;

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_KEY);
            if (saved === 'light' || saved === 'dark' || saved === 'system') {
                setThemeModeState(saved);
            }
        } catch (e) {
            console.log('Failed to load theme preference');
        }
        setIsLoaded(true);
    };

    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem(THEME_KEY, mode);
        } catch (e) {
            console.log('Failed to save theme preference');
        }
    };

    const toggleTheme = () => {
        const newMode = isDarkMode ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    const value: ThemeContextType = {
        isDarkMode,
        themeMode,
        colors,
        spacing,
        typography,
        borderRadius,
        setThemeMode,
        toggleTheme,
    };

    // Don't render until theme is loaded to prevent flash
    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
