import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemedStyles } from '@/context/ThemeContext';
import { Theme, ButtonSize } from '@/theme';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const styles = useThemedStyles(theme => createStyles(theme, variant, size, fullWidth));

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.container, isDisabled && styles.disabled, style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...rest}
    >
      {loading && (
        <ActivityIndicator size="small" color={styles.text.color} style={styles.loader} />
      )}

      {!loading && leftIcon && <>{leftIcon}</>}

      <Text style={[styles.text, textStyle]}>{children}</Text>

      {!loading && rightIcon && <>{rightIcon}</>}
    </TouchableOpacity>
  );
}

const createStyles = (
  theme: Theme,
  variant: ButtonProps['variant'],
  size: ButtonSize,
  fullWidth: boolean
) => {
  const sizeConfig = theme.buttonSizes[size];

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.palette.primary[500],
          borderColor: theme.colors.palette.primary[500],
          textColor: theme.colors.palette.primary[50],
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.semantic.surface.secondary,
          borderColor: theme.colors.semantic.border.primary,
          textColor: theme.colors.semantic.text.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.semantic.border.primary,
          textColor: theme.colors.semantic.text.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: theme.colors.palette.primary[500],
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.palette.error[500],
          borderColor: theme.colors.palette.error[500],
          textColor: theme.colors.palette.error[50],
        };
      default:
        return {
          backgroundColor: theme.colors.palette.primary[500],
          borderColor: theme.colors.palette.primary[500],
          textColor: theme.colors.palette.primary[50],
        };
    }
  };

  const variantStyles = getVariantStyles();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: sizeConfig.paddingHorizontal,
      paddingVertical: sizeConfig.paddingVertical,
      minHeight: sizeConfig.minHeight,
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: 1,
      borderColor: variantStyles.borderColor,
      borderRadius: theme.borderRadius.lg,
      width: fullWidth ? '100%' : undefined,
      ...theme.shadows.sm,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      ...(theme.typography.styles.button[size] || theme.typography.styles.button.md),
      color: variantStyles.textColor,
      textAlign: 'center',
    },
    loader: {
      marginRight: theme.spacing[2],
    },
  });
};
