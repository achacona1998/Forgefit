export interface ColorTokens {
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  onTertiary: string;
  onTertiaryContainer: string;
  error: string;
  errorContainer: string;
  onError: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export const colors: ColorTokens = {
  primary: "#37BB54",
  primaryContainer: "#E0F2C2",
  onPrimary: "#000000",
  onPrimaryContainer: "#0A0F14",
  secondary: "#133875",
  secondaryContainer: "#D6EEFA",
  onSecondary: "#FFFFFF",
  onSecondaryContainer: "#0A0F14",
  tertiary: "#FFC857",
  tertiaryContainer: "#FFF3D4",
  onTertiary: "#000000",
  onTertiaryContainer: "#3D3013",
  error: "#CC1A1A",
  errorContainer: "#FCEEEE",
  onError: "#FFFFFF",
  onErrorContainer: "#6B0000",
  background: "#F4F7F9",
  onBackground: "#0A0F14",
  surface: "#FFFFFF",
  onSurface: "#0A0F14",
  surfaceVariant: "#E6EDF2",
  onSurfaceVariant: "#5C7080",
  outline: "#D0DCE5",
  outlineVariant: "#C4D1DB",
  shadow: "#000000",
  scrim: "#000000",
  inverseSurface: "#121A22",
  inverseOnSurface: "#F2F7FA",
  inversePrimary: "#37BB54",
};

export const darkColors: ColorTokens = {
  primary: "#37BB54",
  primaryContainer: "#133875",
  onPrimary: "#000000",
  onPrimaryContainer: "#F2F7FA",
  secondary: "#37BB54",
  secondaryContainer: "#0A0F14",
  onSecondary: "#FFFFFF",
  onSecondaryContainer: "#F2F7FA",
  tertiary: "#FFC857",
  tertiaryContainer: "#3D3013",
  onTertiary: "#000000",
  onTertiaryContainer: "#FFF3D4",
  error: "#FF6B6B",
  errorContainer: "#6B0000",
  onError: "#000000",
  onErrorContainer: "#FCEEEE",
  background: "#0A0F14",
  onBackground: "#F2F7FA",
  surface: "#121A22",
  onSurface: "#F2F7FA",
  surfaceVariant: "#17222D",
  onSurfaceVariant: "#8A9AA8",
  outline: "#263542",
  outlineVariant: "#3A4A56",
  shadow: "#000000",
  scrim: "#000000",
  inverseSurface: "#F4F7F9",
  inverseOnSurface: "#0A0F14",
  inversePrimary: "#37BB54",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  displayLarge: { fontSize: 57, fontWeight: "900" as const, lineHeight: 64, letterSpacing: -0.25 },
  displayMedium: { fontSize: 45, fontWeight: "900" as const, lineHeight: 52, letterSpacing: 0 },
  displaySmall: { fontSize: 36, fontWeight: "900" as const, lineHeight: 44, letterSpacing: 0 },
  headlineLarge: { fontSize: 32, fontWeight: "800" as const, lineHeight: 40, letterSpacing: 0 },
  headlineMedium: { fontSize: 28, fontWeight: "800" as const, lineHeight: 36, letterSpacing: 0 },
  headlineSmall: { fontSize: 24, fontWeight: "800" as const, lineHeight: 32, letterSpacing: 0 },
  titleLarge: { fontSize: 22, fontWeight: "700" as const, lineHeight: 28, letterSpacing: 0 },
  titleMedium: { fontSize: 16, fontWeight: "700" as const, lineHeight: 24, letterSpacing: 0.15 },
  titleSmall: { fontSize: 14, fontWeight: "700" as const, lineHeight: 20, letterSpacing: 0.1 },
  labelLarge: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20, letterSpacing: 0.1 },
  labelMedium: { fontSize: 12, fontWeight: "600" as const, lineHeight: 16, letterSpacing: 0.5 },
  labelSmall: { fontSize: 11, fontWeight: "600" as const, lineHeight: 16, letterSpacing: 0.5 },
  bodyLarge: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20, letterSpacing: 0.25 },
  bodySmall: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16, letterSpacing: 0.4 },
};