import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RootStackParamList } from '@/types/navigation';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { LoadingScreen } from '@/screens/LoadingScreen';

const Stack = createStackNavigator<RootStackParamList>();

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: 'auth',
      Main: 'main',
      Modal: 'modal/:screen',
      Onboarding: 'onboarding',
      Loading: 'loading',
    },
  },
};

export function AppNavigator() {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const { theme, colorScheme } = useTheme();

  const navigationTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.palette.primary[500],
      background: theme.colors.semantic.background.primary,
      card: theme.colors.semantic.surface.primary,
      text: theme.colors.semantic.text.primary,
      border: theme.colors.semantic.border.primary,
      notification: theme.colors.palette.error[500],
    },
  };

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.semantic.background.primary },
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export const RoleGuard: React.FC<{
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
}> = ({ children, roles, fallback = null }) => {
  const { hasRole } = useAuth();

  const hasRequiredRole = roles.some(role => hasRole(role));

  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const PermissionGuard: React.FC<{
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
}> = ({ children, resource, action, fallback = null }) => {
  const { hasPermission } = useAuth();

  const hasRequiredPermission = hasPermission(resource, action);

  if (!hasRequiredPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
