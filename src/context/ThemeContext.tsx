import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme, ColorScheme } from '@/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_MODE_KEY = 'theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorScheme>(() => {
    const appearance = Appearance.getColorScheme();
    return appearance === 'dark' ? 'dark' : 'light';
  });

  const resolvedColorScheme: ColorScheme = themeMode === 'system' ? systemColorScheme : themeMode;

  const theme = resolvedColorScheme === 'dark' ? darkTheme : lightTheme;

  const loadThemeMode = useCallback(async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_MODE_KEY);
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme mode:', error);
    }
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode: ThemeMode = resolvedColorScheme === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  }, [resolvedColorScheme, setThemeMode]);

  useEffect(() => {
    loadThemeMode();
  }, [loadThemeMode]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(preferences => {
      const newColorScheme = preferences.colorScheme === 'dark' ? 'dark' : 'light';
      setSystemColorScheme(newColorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const value: ThemeContextType = {
    theme,
    colorScheme: resolvedColorScheme,
    themeMode,
    setThemeMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemedStyles<T>(styleFactory: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return styleFactory(theme);
}
