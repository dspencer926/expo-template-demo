import { Platform } from 'react-native';

export const fontWeights = {
  thin: '100',
  extraLight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

export const fontFamilies = {
  default: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  mono: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
} as const;

export const lineHeights = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 1,
  '6xl': 1,
  '7xl': 1,
  '8xl': 1,
  '9xl': 1,
} as const;

export const letterSpacings = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

export const textStyles = {
  display: {
    '2xl': {
      fontSize: fontSizes['8xl'],
      lineHeight: lineHeights['8xl'],
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
    xl: {
      fontSize: fontSizes['7xl'],
      lineHeight: lineHeights['7xl'],
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
    lg: {
      fontSize: fontSizes['6xl'],
      lineHeight: lineHeights['6xl'],
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
    md: {
      fontSize: fontSizes['5xl'],
      lineHeight: lineHeights['5xl'],
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
    sm: {
      fontSize: fontSizes['4xl'],
      lineHeight: lineHeights['4xl'],
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
    xs: {
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights['3xl'],
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
  },
  heading: {
    '4xl': {
      fontSize: fontSizes['4xl'],
      lineHeight: lineHeights['4xl'],
      fontWeight: fontWeights.bold,
    },
    '3xl': {
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights['3xl'],
      fontWeight: fontWeights.bold,
    },
    '2xl': {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights['2xl'],
      fontWeight: fontWeights.bold,
    },
    xl: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.xl,
      fontWeight: fontWeights.bold,
    },
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.lg,
      fontWeight: fontWeights.semiBold,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.base,
      fontWeight: fontWeights.semiBold,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.semiBold,
    },
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      fontWeight: fontWeights.semiBold,
    },
  },
  body: {
    '2xl': {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights['2xl'],
      fontWeight: fontWeights.normal,
    },
    xl: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.xl,
      fontWeight: fontWeights.normal,
    },
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.lg,
      fontWeight: fontWeights.normal,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.base,
      fontWeight: fontWeights.normal,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.normal,
    },
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      fontWeight: fontWeights.normal,
    },
  },
  label: {
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.lg,
      fontWeight: fontWeights.medium,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.base,
      fontWeight: fontWeights.medium,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.medium,
    },
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      fontWeight: fontWeights.medium,
    },
  },
  caption: {
    lg: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacings.wide,
    },
    md: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacings.wide,
    },
  },
  overline: {
    lg: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacings.widest,
      textTransform: 'uppercase' as const,
    },
    md: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacings.widest,
      textTransform: 'uppercase' as const,
    },
  },
  button: {
    xl: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.xl,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacings.wide,
    },
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.lg,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacings.wide,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.base,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacings.wide,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacings.wide,
    },
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacings.wide,
    },
  },
  code: {
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.lg,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.mono,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.base,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.mono,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.mono,
    },
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      fontWeight: fontWeights.normal,
      fontFamily: fontFamilies.mono,
    },
  },
} as const;

export type FontWeight = keyof typeof fontWeights;
export type FontFamily = keyof typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacings;
export type TextStyle = typeof textStyles;
