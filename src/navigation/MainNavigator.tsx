import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import {
  MainTabParamList,
  HomeStackParamList,
  ProfileStackParamList,
  SettingsStackParamList,
} from '@/types/navigation';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { DetailsScreen } from '@/screens/home/DetailsScreen';
import { SearchScreen } from '@/screens/home/SearchScreen';
import { NotificationsScreen } from '@/screens/home/NotificationsScreen';

import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { ChangePasswordScreen } from '@/screens/profile/ChangePasswordScreen';
import { ProfilePictureScreen } from '@/screens/profile/ProfilePictureScreen';

import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { AccountScreen } from '@/screens/settings/AccountScreen';
import { SecurityScreen } from '@/screens/settings/SecurityScreen';
import { PrivacyScreen } from '@/screens/settings/PrivacyScreen';
import { LanguageScreen } from '@/screens/settings/LanguageScreen';
import { ThemeScreen } from '@/screens/settings/ThemeScreen';
import { AboutScreen } from '@/screens/settings/AboutScreen';
import { SupportScreen } from '@/screens/settings/SupportScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

function HomeStackNavigator() {
  const { theme } = useTheme();

  return (
    <HomeStack.Navigator
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
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
      <HomeStack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <HomeStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
    </HomeStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const { theme } = useTheme();

  return (
    <ProfileStack.Navigator
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
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
      <ProfileStack.Screen
        name="ProfilePicture"
        component={ProfilePictureScreen}
        options={{ title: 'Profile Picture' }}
      />
    </ProfileStack.Navigator>
  );
}

function SettingsStackNavigator() {
  const { theme } = useTheme();

  return (
    <SettingsStack.Navigator
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
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <SettingsStack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
      <SettingsStack.Screen
        name="Security"
        component={SecurityScreen}
        options={{ title: 'Security' }}
      />
      <SettingsStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: 'Privacy' }}
      />
      <SettingsStack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ title: 'Language' }}
      />
      <SettingsStack.Screen name="Theme" component={ThemeScreen} options={{ title: 'Theme' }} />
      <SettingsStack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
      <SettingsStack.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: 'Support' }}
      />
    </SettingsStack.Navigator>
  );
}

export function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'SettingsStack') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.palette.primary[500],
        tabBarInactiveTintColor: theme.colors.semantic.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.semantic.surface.primary,
          borderTopColor: theme.colors.semantic.border.primary,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: theme.colors.semantic.text.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingBottom: theme.spacing[1],
          paddingTop: theme.spacing[1],
          height: 60,
        },
        tabBarLabelStyle: {
          ...theme.typography.styles.caption.md,
          marginBottom: theme.spacing[0.5],
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
