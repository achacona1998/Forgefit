import { colors, darkColors, radius, spacing, typography } from "./tokens";

export const lightTheme = {
  colors,
  radius,
  spacing,
  typography,
  isDark: false,
} as const;

export const darkTheme = {
  colors: darkColors,
  radius,
  spacing,
  typography,
  isDark: true,
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;