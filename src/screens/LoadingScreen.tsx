import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemedStyles } from '@/context/ThemeContext';
import { Theme } from '@/theme';
import { Text } from '@/components/ui/Text';

export function LoadingScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={styles.loader.color} style={styles.loader} />
      <Text variant="body-lg" color="secondary" style={styles.text}>
        Loading...
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.semantic.background.primary,
      padding: theme.spacing[6],
    },
    loader: {
      color: theme.colors.palette.primary[500],
      marginBottom: theme.spacing[4],
    },
    text: {
      textAlign: 'center',
    },
  });
