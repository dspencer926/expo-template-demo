import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import { secureStorage } from '../storage/secureStorage';
import { BiometricAuthConfig } from '@/types/auth';

export interface BiometricPromptOptions {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

export class BiometricAuthService {
  private static readonly BIOMETRIC_CONFIG_KEY = 'biometric_config';
  private static readonly BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';

  static async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Failed to check biometric availability:', error);
      return false;
    }
  }

  static async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Failed to get supported biometric types:', error);
      return [];
    }
  }

  static async getBiometricType(): Promise<'fingerprint' | 'face' | 'iris' | 'none'> {
    try {
      const types = await this.getSupportedTypes();

      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'face';
      }

      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'fingerprint';
      }

      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'iris';
      }

      return 'none';
    } catch (error) {
      console.error('Failed to get biometric type:', error);
      return 'none';
    }
  }

  static async authenticate(options: BiometricPromptOptions = {}): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw new Error('Biometric authentication is not available');
      }

      const biometricType = await this.getBiometricType();
      const defaultPrompt = this.getDefaultPromptMessage(biometricType);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.promptMessage || defaultPrompt,
        cancelLabel: options.cancelLabel || 'Cancel',
        fallbackLabel: options.fallbackLabel || 'Use Passcode',
        disableDeviceFallback: options.disableDeviceFallback ?? false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }

  static async enableBiometricAuth(userCredentials: {
    email: string;
    accessToken: string;
  }): Promise<void> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw new Error('Biometric authentication is not available on this device');
      }

      const biometricType = await this.getBiometricType();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      const config: BiometricAuthConfig = {
        isEnabled: true,
        type: biometricType,
        isEnrolled,
      };

      await secureStorage.setObject(this.BIOMETRIC_CONFIG_KEY, config);

      await secureStorage.setObject(this.BIOMETRIC_CREDENTIALS_KEY, userCredentials, {
        requireAuthentication: true,
      });
    } catch (error) {
      console.error('Failed to enable biometric authentication:', error);
      throw new Error('Failed to enable biometric authentication');
    }
  }

  static async disableBiometricAuth(): Promise<void> {
    try {
      const config: BiometricAuthConfig = {
        isEnabled: false,
        type: 'none',
        isEnrolled: false,
      };

      await secureStorage.setObject(this.BIOMETRIC_CONFIG_KEY, config);
      await secureStorage.removeItem(this.BIOMETRIC_CREDENTIALS_KEY);
    } catch (error) {
      console.error('Failed to disable biometric authentication:', error);
      throw new Error('Failed to disable biometric authentication');
    }
  }

  static async getBiometricConfig(): Promise<BiometricAuthConfig> {
    try {
      const config = await secureStorage.getObject<BiometricAuthConfig>(this.BIOMETRIC_CONFIG_KEY);

      if (!config) {
        const defaultConfig: BiometricAuthConfig = {
          isEnabled: false,
          type: 'none',
          isEnrolled: false,
        };
        return defaultConfig;
      }

      const isAvailable = await this.isAvailable();
      const currentType = await this.getBiometricType();

      return {
        ...config,
        type: currentType,
        isEnrolled: isAvailable,
      };
    } catch (error) {
      console.error('Failed to get biometric config:', error);
      return {
        isEnabled: false,
        type: 'none',
        isEnrolled: false,
      };
    }
  }

  static async getBiometricCredentials(): Promise<{
    email: string;
    accessToken: string;
  } | null> {
    try {
      const isAuthenticated = await this.authenticate({
        promptMessage: 'Authenticate to access your saved credentials',
      });

      if (!isAuthenticated) {
        return null;
      }

      return await secureStorage.getObject(this.BIOMETRIC_CREDENTIALS_KEY);
    } catch (error) {
      console.error('Failed to get biometric credentials:', error);
      return null;
    }
  }

  static async updateBiometricCredentials(credentials: {
    email: string;
    accessToken: string;
  }): Promise<void> {
    try {
      const config = await this.getBiometricConfig();
      if (!config.isEnabled) {
        return;
      }

      await secureStorage.setObject(this.BIOMETRIC_CREDENTIALS_KEY, credentials, {
        requireAuthentication: true,
      });
    } catch (error) {
      console.error('Failed to update biometric credentials:', error);
    }
  }

  private static getDefaultPromptMessage(biometricType: string): string {
    switch (biometricType) {
      case 'face':
        return Platform.OS === 'ios'
          ? 'Use Face ID to authenticate'
          : 'Use face recognition to authenticate';
      case 'fingerprint':
        return Platform.OS === 'ios'
          ? 'Use Touch ID to authenticate'
          : 'Use fingerprint to authenticate';
      case 'iris':
        return 'Use iris scan to authenticate';
      default:
        return 'Use biometric authentication';
    }
  }

  static async checkBiometricChanges(): Promise<boolean> {
    try {
      const config = await this.getBiometricConfig();
      if (!config.isEnabled) {
        return false;
      }

      const currentAvailability = await this.isAvailable();
      const currentType = await this.getBiometricType();

      const hasChanges = config.isEnrolled !== currentAvailability || config.type !== currentType;

      if (hasChanges) {
        await this.disableBiometricAuth();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to check biometric changes:', error);
      return false;
    }
  }
}
