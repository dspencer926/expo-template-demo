import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useThemedStyles } from '@/context/ThemeContext';
import { Theme, InputSize } from '@/theme';
import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | undefined;
  helperText?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  variant?: 'outline' | 'filled' | 'underline';
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      leftIcon,
      rightIcon,
      containerStyle,
      inputStyle,
      variant = 'outline',
      required = false,
      showPasswordToggle = false,
      secureTextEntry,
      ...rest
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
    const [isFocused, setIsFocused] = useState(false);

    const styles = useThemedStyles(theme => createStyles(theme, variant, size, !!error, isFocused));

    const isPasswordField = secureTextEntry || showPasswordToggle;
    const shouldShowPassword = isPasswordField && !isPasswordVisible;

    const handlePasswordToggle = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelContainer}>
            <Text variant="label-sm" color="secondary" style={styles.label}>
              {label}
            </Text>
            {required && (
              <Text variant="label-sm" color="error" style={styles.required}>
                *
              </Text>
            )}
          </View>
        )}

        <View style={[styles.inputContainer, inputStyle]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={styles.placeholder.color}
            secureTextEntry={shouldShowPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />

          {showPasswordToggle && isPasswordField && (
            <TouchableOpacity
              onPress={handlePasswordToggle}
              style={styles.rightIcon}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text variant="body-sm" color="tertiary">
                {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          )}

          {rightIcon && !showPasswordToggle && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>

        {(error || helperText) && (
          <Text variant="caption-md" color={error ? 'error' : 'tertiary'} style={styles.helperText}>
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const createStyles = (
  theme: Theme,
  variant: InputProps['variant'],
  size: InputSize,
  hasError: boolean,
  isFocused: boolean
) => {
  const sizeConfig = theme.inputSizes[size];

  const getVariantStyles = () => {
    const baseStyle = {
      paddingHorizontal: sizeConfig.paddingHorizontal,
      paddingVertical: sizeConfig.paddingVertical,
      minHeight: sizeConfig.minHeight,
    };

    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.semantic.surface.primary,
          borderWidth: 1,
          borderColor: hasError
            ? theme.colors.semantic.border.error
            : isFocused
              ? theme.colors.semantic.border.focus
              : theme.colors.semantic.border.primary,
          borderRadius: theme.borderRadius.lg,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.semantic.surface.secondary,
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: hasError
            ? theme.colors.semantic.border.error
            : isFocused
              ? theme.colors.semantic.border.focus
              : theme.colors.semantic.border.secondary,
          borderRadius: theme.borderRadius.md,
        };
      case 'underline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: hasError
            ? theme.colors.semantic.border.error
            : isFocused
              ? theme.colors.semantic.border.focus
              : theme.colors.semantic.border.primary,
          borderRadius: 0,
          paddingHorizontal: 0,
        };
      default:
        return baseStyle;
    }
  };

  const variantStyles = getVariantStyles();

  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing[1],
    },
    labelContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing[1],
    },
    label: {
      fontWeight: theme.typography.weights.medium,
    },
    required: {
      marginLeft: theme.spacing[0.5],
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      ...variantStyles,
    },
    input: {
      flex: 1,
      ...theme.typography.styles.body.md,
      color: theme.colors.semantic.text.primary,
      fontFamily: theme.typography.families.default,
    },
    placeholder: {
      color: theme.colors.semantic.text.tertiary,
    },
    leftIcon: {
      marginRight: theme.spacing[2],
    },
    rightIcon: {
      marginLeft: theme.spacing[2],
    },
    helperText: {
      marginTop: theme.spacing[1],
      marginLeft: variant === 'underline' ? 0 : theme.spacing[1],
    },
  });
};
