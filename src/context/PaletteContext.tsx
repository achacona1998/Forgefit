import { createContext, useContext, type PropsWithChildren } from "react";
import { View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

const darkPalette = {
  bg: "#0A0F14",
  surface: "#121A22",
  surfaceAlt: "#17222D",
  border: "#263542",
  text: "#F2F7FA",
  muted: "#8A9AA8",
  lime: "#37BB54",
  limeSoft: "#133875",
  blue: "#133875",
  blueSoft: "#123044",
  success: "#37BB54",
  warning: "#FFC857",
  danger: "#FF6B6B",
  white: "#FFFFFF",
};

const lightPalette = {
  bg: "#F4F7F9",
  surface: "#FFFFFF",
  surfaceAlt: "#E6EDF2",
  border: "#D0DCE5",
  text: "#0A0F14",
  muted: "#5C7080",
  lime: "#37BB54",
  limeSoft: "#E0F2C2",
  blue: "#133875",
  blueSoft: "#D6EEFA",
  success: "#37BB54",
  warning: "#B37700",
  danger: "#CC1A1A",
  white: "#000000",
};

type Palette = typeof darkPalette;

const PaletteContext = createContext<Palette>(darkPalette);

export function PaletteProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const palette = theme.isDark ? darkPalette : lightPalette;

  return (
    <PaletteContext.Provider value={palette}>
      <View style={{ flex: 1, backgroundColor: palette.bg }}>{children}</View>
    </PaletteContext.Provider>
  );
}

export function usePalette(): Palette {
  return useContext(PaletteContext);
}

// Export static palettes for StyleSheet.create usage
export { darkPalette, lightPalette };