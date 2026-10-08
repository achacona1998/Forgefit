import * as SecureStore from "expo-secure-store";

export type ThemePreference = "system" | "light" | "dark";

const THEME_KEY = "forgefit_theme_preference";

export async function getThemePreference(): Promise<ThemePreference> {
  try {
    const value = await SecureStore.getItemAsync(THEME_KEY);
    if (value === "system" || value === "light" || value === "dark") {
      return value;
    }
    return "system";
  } catch {
    return "system";
  }
}

export async function setThemePreference(preference: ThemePreference): Promise<void> {
  try {
    await SecureStore.setItemAsync(THEME_KEY, preference);
  } catch {
    // Silently fail on web or if secure store unavailable
  }
}