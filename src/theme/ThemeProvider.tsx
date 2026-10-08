import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Appearance, LayoutAnimation, View } from "react-native";
import { lightTheme, darkTheme, Theme } from "./theme";
import { getThemePreference, setThemePreference, ThemePreference } from "./themePreference";

interface ThemeContextValue {
  theme: Theme;
  themePreference: ThemePreference;
  setTheme: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  themePreference: "system",
  setTheme: () => {},
});

function useSystemColorScheme(): "light" | "dark" {
  const [scheme, setScheme] = useState<"light" | "dark">(
    () => Appearance.getColorScheme() ?? "light",
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === "dark" || colorScheme === "light") {
        setScheme(colorScheme);
      }
    });
    return () => subscription.remove();
  }, []);

  return scheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themePreference, setThemePref] = useState<ThemePreference>("system");

  useEffect(() => {
    getThemePreference().then(setThemePref);
  }, []);

  const resolvedTheme = (() => {
    if (themePreference === "dark") return darkTheme as Theme;
    if (themePreference === "light") return lightTheme as Theme;
    return (systemScheme === "dark" ? darkTheme : lightTheme) as Theme;
  })();

  const prevIsDark = useRef(resolvedTheme.isDark);
  useEffect(() => {
    if (prevIsDark.current !== resolvedTheme.isDark) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevIsDark.current = resolvedTheme.isDark;
    }
  }, [resolvedTheme.isDark]);

  const handleSetTheme = useCallback((preference: ThemePreference) => {
    setThemePref(preference);
    setThemePreference(preference);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themePreference,
        setTheme: handleSetTheme,
      }}
    >
      <View style={{ flex: 1, backgroundColor: resolvedTheme.colors.background }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}

export function useThemePreference() {
  return useContext(ThemeContext);
}