import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Modal: { screen: string; params?: any };
  Onboarding: undefined;
  Loading: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  BiometricSetup: undefined;
  MFASetup: undefined;
  MFAVerify: { tempToken: string };
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  Details: { id: string };
  Search: undefined;
  Notifications: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  ProfilePicture: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Account: undefined;
  Security: undefined;
  Privacy: undefined;
  Notifications: undefined;
  Language: undefined;
  Theme: undefined;
  About: undefined;
  Support: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = StackScreenProps<
  HomeStackParamList,
  T
>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = StackScreenProps<
  ProfileStackParamList,
  T
>;

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> = StackScreenProps<
  SettingsStackParamList,
  T
>;

export interface DeepLinkConfig {
  screens: {
    Auth: {
      screens: {
        Login: 'login';
        Register: 'register';
        ForgotPassword: 'forgot-password';
        ResetPassword: 'reset-password/:token';
      };
    };
    Main: {
      screens: {
        HomeStack: {
          screens: {
            Home: 'home';
            Details: 'details/:id';
            Search: 'search';
          };
        };
        ProfileStack: {
          screens: {
            Profile: 'profile';
            EditProfile: 'profile/edit';
          };
        };
        SettingsStack: {
          screens: {
            Settings: 'settings';
            Account: 'settings/account';
            Security: 'settings/security';
          };
        };
      };
    };
  };
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
