import { lightColors, darkColors, semanticColors, ColorScheme } from './colors';
import {
  textStyles,
  fontWeights,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacings,
} from './typography';
import {
  spacing,
  borderRadius,
  shadows,
  zIndex,
  iconSizes,
  buttonSizes,
  inputSizes,
} from './spacing';

export interface Theme {
  colors: {
    palette: typeof lightColors;
    semantic: typeof semanticColors.light;
  };
  typography: {
    styles: typeof textStyles;
    weights: typeof fontWeights;
    families: typeof fontFamilies;
    sizes: typeof fontSizes;
    lineHeights: typeof lineHeights;
    letterSpacings: typeof letterSpacings;
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
  iconSizes: typeof iconSizes;
  buttonSizes: typeof buttonSizes;
  inputSizes: typeof inputSizes;
  isDark: boolean;
}

export const createTheme = (colorScheme: ColorScheme): Theme => ({
  colors: {
    palette: colorScheme === 'light' ? lightColors : darkColors,
    semantic: colorScheme === 'light' ? semanticColors.light : semanticColors.dark,
  },
  typography: {
    styles: textStyles,
    weights: fontWeights,
    families: fontFamilies,
    sizes: fontSizes,
    lineHeights,
    letterSpacings,
  },
  spacing,
  borderRadius,
  shadows,
  zIndex,
  iconSizes,
  buttonSizes,
  inputSizes,
  isDark: colorScheme === 'dark',
});

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export * from './colors';
export * from './typography';
export * from './spacing';
