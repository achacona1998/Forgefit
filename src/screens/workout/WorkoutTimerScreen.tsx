import { View, Text, StyleSheet } from "react-native";
import { usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";

export default function WorkoutTimerScreen() {
  const palette = usePalette();

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <Text style={[{ ...styles.title, color: palette.text }]}>Temporizador</Text>
      <Text style={[{ ...styles.subtitle, color: palette.muted }]}>Pantalla de descanso en desarrollo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "900" },
  subtitle: { fontSize: 14, marginTop: 8 },
});