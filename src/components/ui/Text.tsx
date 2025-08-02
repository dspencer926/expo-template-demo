import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useThemedStyles } from '@/context/ThemeContext';
import { Theme } from '@/theme';

type TextVariant =
  | 'display-2xl'
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'display-xs'
  | 'heading-4xl'
  | 'heading-3xl'
  | 'heading-2xl'
  | 'heading-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'heading-xs'
  | 'body-2xl'
  | 'body-xl'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'body-xs'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'label-xs'
  | 'caption-lg'
  | 'caption-md'
  | 'overline-lg'
  | 'overline-md'
  | 'button-lg'
  | 'button-md'
  | 'button-sm'
  | 'button-xs'
  | 'code-lg'
  | 'code-md'
  | 'code-sm'
  | 'code-xs';

type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'disabled'
  | 'link'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

export function Text({
  variant = 'body-md',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...rest
}: TextProps) {
  const styles = useThemedStyles(theme => createStyles(theme, variant, color, align));

  return (
    <RNText style={[styles.text, style]} {...rest}>
      {children}
    </RNText>
  );
}

const createStyles = (
  theme: Theme,
  variant: TextVariant,
  color: TextColor,
  align: TextProps['align']
) => {
  const getVariantStyle = () => {
    const [category, size] = variant.split('-') as [string, string];

    switch (category) {
      case 'display':
        return theme.typography.styles.display[
          size as keyof typeof theme.typography.styles.display
        ];
      case 'heading':
        return theme.typography.styles.heading[
          size as keyof typeof theme.typography.styles.heading
        ];
      case 'body':
        return theme.typography.styles.body[size as keyof typeof theme.typography.styles.body];
      case 'label':
        return theme.typography.styles.label[size as keyof typeof theme.typography.styles.label];
      case 'caption':
        return theme.typography.styles.caption[
          size as keyof typeof theme.typography.styles.caption
        ];
      case 'overline':
        return theme.typography.styles.overline[
          size as keyof typeof theme.typography.styles.overline
        ];
      case 'button':
        return theme.typography.styles.button[size as keyof typeof theme.typography.styles.button];
      case 'code':
        return theme.typography.styles.code[size as keyof typeof theme.typography.styles.code];
      default:
        return theme.typography.styles.body.md;
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'primary':
        return theme.colors.semantic.text.primary;
      case 'secondary':
        return theme.colors.semantic.text.secondary;
      case 'tertiary':
        return theme.colors.semantic.text.tertiary;
      case 'inverse':
        return theme.colors.semantic.text.inverse;
      case 'disabled':
        return theme.colors.semantic.text.disabled;
      case 'link':
        return theme.colors.semantic.text.link;
      case 'success':
        return theme.colors.semantic.text.success;
      case 'warning':
        return theme.colors.semantic.text.warning;
      case 'error':
        return theme.colors.semantic.text.error;
      case 'info':
        return theme.colors.semantic.text.info;
      default:
        return theme.colors.semantic.text.primary;
    }
  };

  return StyleSheet.create({
    text: {
      ...getVariantStyle(),
      color: getTextColor(),
      textAlign: align,
      fontFamily: theme.typography.families.default,
    },
  });
};
