import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '@/context/AuthContext';
import { useThemedStyles } from '@/context/ThemeContext';
import { Theme } from '@/theme';
import { AuthStackScreenProps } from '@/types/navigation';

import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { login, biometricAuth, authenticateWithBiometrics, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const styles = useThemedStyles(createStyles);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      await authenticateWithBiometrics();
    } catch (error) {
      console.error('Biometric login failed:', error);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="display-sm" color="primary" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="body-lg" color="secondary" style={styles.subtitle}>
            Sign in to your account
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="Enter your email"
                required
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry={!showPassword}
                showPasswordToggle
                autoComplete="password"
                textContentType="password"
                placeholder="Enter your password"
                required
              />
            )}
          />

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text variant="body-sm" color="link">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text variant="body-sm" color="error" style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isValid}
            fullWidth
            style={styles.loginButton}
          >
            Sign In
          </Button>

          {biometricAuth.isEnabled && (
            <Button
              variant="outline"
              onPress={handleBiometricLogin}
              fullWidth
              style={styles.biometricButton}
            >
              {biometricAuth.type === 'face' ? '👤' : '👆'} Use{' '}
              {biometricAuth.type === 'face' ? 'Face ID' : 'Touch ID'}
            </Button>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text variant="body-md" color="secondary">
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text variant="body-md" color="link">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.semantic.background.primary,
    },
    scrollContent: {
      flexGrow: 1,
      padding: theme.spacing[6],
      paddingTop: theme.spacing[12],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing[8],
    },
    title: {
      marginBottom: theme.spacing[2],
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
    },
    form: {
      marginBottom: theme.spacing[6],
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: theme.spacing[2],
      marginBottom: theme.spacing[6],
    },
    errorContainer: {
      backgroundColor: theme.colors.palette.error[50],
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.palette.error[200],
    },
    errorText: {
      textAlign: 'center',
    },
    loginButton: {
      marginBottom: theme.spacing[4],
    },
    biometricButton: {
      marginTop: theme.spacing[2],
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[6],
      paddingTop: theme.spacing[4],
    },
  });
