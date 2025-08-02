import Constants from 'expo-constants';

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  NODE_ENV: Environment;
  API_BASE_URL: string;
  API_VERSION: string;
  API_TIMEOUT: number;
  SENTRY_DSN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_API_KEY?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  FIREBASE_STORAGE_BUCKET?: string;
  FIREBASE_MESSAGING_SENDER_ID?: string;
  FIREBASE_APP_ID?: string;
  FEATURE_FLAGS_URL?: string;
  FEATURE_FLAGS_API_KEY?: string;
  REACTOTRON_HOST?: string;
  REACTOTRON_PORT?: number;
  FLIPPER_ENABLED: boolean;
}

const developmentConfig: EnvironmentConfig = {
  NODE_ENV: 'development',
  API_BASE_URL: 'https://dev-api.example.com',
  API_VERSION: 'v1',
  API_TIMEOUT: 30000,
  REACTOTRON_HOST: 'localhost',
  REACTOTRON_PORT: 9090,
  FLIPPER_ENABLED: true,
};

const stagingConfig: EnvironmentConfig = {
  NODE_ENV: 'staging',
  API_BASE_URL: 'https://staging-api.example.com',
  API_VERSION: 'v1',
  API_TIMEOUT: 30000,
  FLIPPER_ENABLED: false,
};

const productionConfig: EnvironmentConfig = {
  NODE_ENV: 'production',
  API_BASE_URL: 'https://api.example.com',
  API_VERSION: 'v1',
  API_TIMEOUT: 30000,
  FLIPPER_ENABLED: false,
};

const getEnvironmentConfig = (): EnvironmentConfig => {
  const releaseChannel = (Constants.expoConfig as any)?.releaseChannel;
  const nodeEnv = process.env.NODE_ENV as Environment;

  if (__DEV__ || nodeEnv === 'development') {
    return developmentConfig;
  }

  if (releaseChannel === 'staging' || nodeEnv === 'staging') {
    return stagingConfig;
  }

  return productionConfig;
};

export const ENV = getEnvironmentConfig();

export const isDevelopment = ENV.NODE_ENV === 'development';
export const isStaging = ENV.NODE_ENV === 'staging';
export const isProduction = ENV.NODE_ENV === 'production';

export const enableLogging = isDevelopment || isStaging;
export const enableDebugTools = isDevelopment;

export default ENV;
