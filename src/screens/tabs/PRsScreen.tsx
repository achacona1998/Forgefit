import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppCard, EmptyState, SectionHeader, Chip, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useProfileStore } from "../../stores/profileStore";
import { useExerciseStore } from "../../stores/exerciseStore";

export default function PRsScreen() {
  const palette = usePalette();
  const { records } = useProfileStore();
  const { getExercise } = useExerciseStore();

  const recordsWithNames = records.map((r) => ({
    ...r,
    exerciseName: getExercise(r.exerciseId)?.name ?? "Ejercicio",
  }));

  const byExercise = recordsWithNames.reduce((acc, r) => {
    if (!acc[r.exerciseId]) acc[r.exerciseId] = [];
    acc[r.exerciseId].push(r);
    return acc;
  }, {} as Record<string, typeof recordsWithNames>);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Récords personales" />
      {records.length === 0 ? (
        <AppCard>
          <EmptyState icon="emoji-events" title="Sin récords aún" detail="Completa entrenamientos para detectar PRs automáticamente." />
        </AppCard>
      ) : (
        <View style={styles.list}>
          {Object.entries(byExercise).map(([exerciseId, exerciseRecords]) => {
            const best = exerciseRecords.sort((a, b) => b.weight - a.weight)[0];
            return (
              <AppCard key={exerciseId} style={styles.prCard}>
                <View style={styles.prHeader}>
                  <Text style={[{ ...styles.prName, color: palette.text }]}>{best.exerciseName}</Text>
                  <Chip tone="warning" label={best.type === "weight" ? "PESO" : best.type === "volume" ? "VOLUMEN" : "1RM EST"} />
                </View>
                <Text style={[{ ...styles.prValue, color: palette.lime }]}>{best.weight} kg × {best.reps} reps</Text>
                <Text style={[{ ...styles.prDate, color: palette.muted }]}>{best.date.split("T")[0]}</Text>
              </AppCard>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  list: { gap: 10 },
  prCard: { padding: 16 },
  prHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  prName: { fontSize: 16, fontWeight: "800" },
  prValue: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  prDate: { fontSize: 12 },
});