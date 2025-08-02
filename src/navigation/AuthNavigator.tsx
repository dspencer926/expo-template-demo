import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@/context/ThemeContext';
import { AuthStackParamList } from '@/types/navigation';

import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/screens/auth/ResetPasswordScreen';
import { BiometricSetupScreen } from '@/screens/auth/BiometricSetupScreen';
import { MFASetupScreen } from '@/screens/auth/MFASetupScreen';
import { MFAVerifyScreen } from '@/screens/auth/MFAVerifyScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.semantic.surface.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.semantic.border.primary,
        },
        headerTitleStyle: {
          ...theme.typography.styles.heading.lg,
          color: theme.colors.semantic.text.primary,
        },
        headerTintColor: theme.colors.semantic.text.primary,
        cardStyle: {
          backgroundColor: theme.colors.semantic.background.primary,
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'New Password',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="BiometricSetup"
        component={BiometricSetupScreen}
        options={{
          title: 'Biometric Authentication',
        }}
      />
      <Stack.Screen
        name="MFASetup"
        component={MFASetupScreen}
        options={{
          title: 'Two-Factor Authentication',
        }}
      />
      <Stack.Screen
        name="MFAVerify"
        component={MFAVerifyScreen}
        options={{
          title: 'Verification Required',
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}
