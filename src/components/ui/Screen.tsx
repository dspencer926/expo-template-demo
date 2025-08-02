import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemedStyles } from '@/context/ThemeContext';
import { Theme } from '@/theme';
import { Text } from './Text';

export interface ScreenProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  centered?: boolean;
}

export function Screen({ title, subtitle, children, style, centered = false }: ScreenProps) {
  const styles = useThemedStyles(theme => createStyles(theme, centered));

  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.header}>
          <Text variant="heading-2xl" color="primary" style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="body-lg" color="secondary" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const createStyles = (theme: Theme, centered: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.semantic.background.primary,
      padding: theme.spacing[6],
    },
    header: {
      marginBottom: theme.spacing[6],
      alignItems: centered ? 'center' : 'flex-start',
    },
    title: {
      marginBottom: theme.spacing[2],
      textAlign: centered ? 'center' : 'left',
    },
    subtitle: {
      textAlign: centered ? 'center' : 'left',
    },
    content: {
      flex: 1,
      justifyContent: centered ? 'center' : 'flex-start',
      alignItems: centered ? 'center' : 'stretch',
    },
  });
