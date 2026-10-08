import { View, Text, StyleSheet } from "react-native";
import { useTabsNavigation } from "../../navigation/hooks";
import { PrimaryButton, AppCard, Chip, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";

export default function TrainScreen() {
  const navigation = useTabsNavigation();
  const palette = usePalette();

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <AppCard style={styles.card}>
        <Text style={[{ ...styles.title, color: palette.text }]}>Entrenar</Text>
        <Text style={[{ ...styles.subtitle, color: palette.muted }]}>Tu entrenamiento de hoy</Text>
        <Chip label="PRÓXIMA SESIÓN" tone="lime" style={styles.chip} />
        <Text style={[{ ...styles.dayName, color: palette.text }]}>Pecho + Espalda A</Text>
        <Text style={[{ ...styles.meta, color: palette.muted }]}>5 ejercicios · 16 series · ~75 min</Text>
        <PrimaryButton
          label="Comenzar entrenamiento"
          icon="play-arrow"
          onPress={() => navigation.getParent()?.navigate("Workout", { screen: "WorkoutDetail", params: { sessionId: "today" } })}
          style={styles.startButton}
        />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: darkPalette.bg },
  card: { padding: 24 },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  chip: { marginBottom: 12 },
  dayName: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  meta: { fontSize: 13, marginBottom: 24 },
  startButton: { marginTop: 8 },
});