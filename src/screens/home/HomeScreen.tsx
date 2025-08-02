import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/context/AuthContext';
import { useThemedStyles } from '@/context/ThemeContext';
import { Theme } from '@/theme';
import { HomeStackScreenProps } from '@/types/navigation';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const styles = useThemedStyles(createStyles);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleViewDetails = (id: string) => {
    navigation.navigate('Details', { id });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text variant="heading-2xl" color="primary">
            Hello, {user?.firstName}! 👋
          </Text>
          <Text variant="body-lg" color="secondary">
            Welcome back to your dashboard
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
            <Ionicons name="search" size={24} color={styles.iconButton.color} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={styles.iconButton.color} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text variant="heading-lg" color="primary" style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard} onPress={() => handleViewDetails('1')}>
              <Ionicons
                name="document-text-outline"
                size={32}
                color={styles.quickActionIcon.color}
              />
              <Text variant="label-md" style={styles.quickActionText}>
                View Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="analytics-outline" size={32} color={styles.quickActionIcon.color} />
              <Text variant="label-md" style={styles.quickActionText}>
                Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="settings-outline" size={32} color={styles.quickActionIcon.color} />
              <Text variant="label-md" style={styles.quickActionText}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="heading-lg" color="primary" style={styles.sectionTitle}>
            Recent Activity
          </Text>

          <View style={styles.activityCard}>
            <Text variant="body-md" color="secondary">
              No recent activity to display.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="heading-lg" color="primary" style={styles.sectionTitle}>
            Account
          </Text>

          <View style={styles.accountInfo}>
            <Text variant="body-md" color="secondary">
              Email: {user?.email}
            </Text>
            <Text variant="body-md" color="secondary">
              Role: {user?.role?.name}
            </Text>
            <Text variant="body-md" color="secondary">
              Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <Button variant="outline" onPress={handleLogout} style={styles.logoutButton}>
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.semantic.background.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: theme.spacing[6],
      paddingBottom: theme.spacing[4],
      backgroundColor: theme.colors.semantic.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.semantic.border.primary,
    },
    greeting: {
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    iconButton: {
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.semantic.surface.secondary,
      color: theme.colors.semantic.text.secondary,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: theme.spacing[6],
      paddingBottom: theme.spacing[4],
    },
    sectionTitle: {
      marginBottom: theme.spacing[4],
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing[3],
    },
    quickActionCard: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing[4],
      backgroundColor: theme.colors.semantic.surface.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.semantic.border.primary,
      ...theme.shadows.sm,
    },
    quickActionIcon: {
      color: theme.colors.palette.primary[500],
    },
    quickActionText: {
      marginTop: theme.spacing[2],
      textAlign: 'center',
    },
    activityCard: {
      padding: theme.spacing[6],
      backgroundColor: theme.colors.semantic.surface.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.semantic.border.primary,
      alignItems: 'center',
    },
    accountInfo: {
      backgroundColor: theme.colors.semantic.surface.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.semantic.border.primary,
      gap: theme.spacing[2],
    },
    logoutButton: {
      marginTop: theme.spacing[2],
    },
  });
