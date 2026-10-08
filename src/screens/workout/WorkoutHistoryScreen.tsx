import { View, Text, StyleSheet } from "react-native";
import { usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";

export default function WorkoutHistoryScreen() {
  const palette = usePalette();

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <Text style={[{ ...styles.title, color: palette.text }]}>Historial de entrenamientos</Text>
      <Text style={[{ ...styles.subtitle, color: palette.muted }]}>Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "900" },
  subtitle: { fontSize: 14, marginTop: 8 },
});