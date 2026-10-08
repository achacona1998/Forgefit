import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";

export default function RoutineDetailScreen() {
  const route = useRoute();
  const { routineId } = route.params as { routineId: string };
  const palette = usePalette();

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <Text style={[{ ...styles.title, color: palette.text }]}>Detalle rutina</Text>
      <Text style={[{ ...styles.subtitle, color: palette.muted }]}>{routineId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "900" },
  subtitle: { fontSize: 14, marginTop: 8 },
});