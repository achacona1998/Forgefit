import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppCard, PrimaryButton, Chip, LoadingScreen, AppInput, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useProfileStore } from "../../stores/profileStore";
import { useSessionStore } from "../../stores/sessionStore";
import { useExerciseStore } from "../../stores/exerciseStore";

export default function WorkoutDetailScreen() {
  const route = useRoute();
  const { sessionId } = route.params as { sessionId: string };
  const palette = usePalette();
  const { hydrated } = useProfileStore();
  const { sessions, getCurrentSession, updateSession, setCurrentSession, updateSetInCurrentSession, addSetToCurrentExercise } = useSessionStore();
  const { getExercise } = useExerciseStore();

  if (!hydrated) return <LoadingScreen />;

  const session = sessions.find((s) => s.id === sessionId) || getCurrentSession?.();

  if (!session) return <View style={[styles.screen, { backgroundColor: palette.bg }]}><Text style={[{ ...styles.error, color: palette.danger }]}>Sesión no encontrada</Text></View>;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AppCard style={styles.headerCard}>
        <Text style={[{ ...styles.title, color: palette.text }]}>{session.trainingDayName}</Text>
        <Text style={[{ ...styles.meta, color: palette.muted }]}>{session.exercises.length} ejercicios · {session.status}</Text>
      </AppCard>

      {session.exercises.map((ex, idx) => (
        <AppCard key={ex.id} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={[{ ...styles.exerciseName, color: palette.text }]}>{ex.name}</Text>
            <Chip tone="lime" label={`${ex.sets} series`} />
          </View>
          <View style={styles.exerciseTarget}>
            <Text style={[{ ...styles.targetText, color: palette.text }]}>
              {ex.target.sets} × {ex.target.repRangeMin}–{ex.target.repRangeMax} reps
              {ex.target.restSeconds ? ` · {ex.target.restSeconds}s` : ""}
            </Text>
            {ex.previousPerformance && (
              <Text style={[{ ...styles.previousText, color: palette.muted }]}>
                Última: {ex.previousPerformance.weight} kg × {ex.previousPerformance.reps} (RIR {ex.previousPerformance.rir ?? "?"})
              </Text>
            )}
          </View>

          {ex.sets.map((set, setIdx) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={[{ ...styles.setNumber, color: palette.muted }]}>Serie {set.order}</Text>
              <View style={styles.setInputs}>
                <AppInput
                  placeholder="Peso"
                  value={String(set.weight)}
                  onChangeText={(v) => updateSetInCurrentSession(ex.id, set.id, { weight: parseFloat(v) || 0 })}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <AppInput
                  placeholder="Reps"
                  value={String(set.reps)}
                  onChangeText={(v) => updateSetInCurrentSession(ex.id, set.id, { reps: parseInt(v) || 0 })}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <AppInput
                  placeholder="RIR"
                  value={set.rir !== undefined ? String(set.rir) : ""}
                  onChangeText={(v) => updateSetInCurrentSession(ex.id, set.id, { rir: v ? parseInt(v) : undefined })}
                  keyboardType="numeric"
                  style={styles.inputSmall}
                />
              </View>
              <Pressable
                onPress={() => updateSetInCurrentSession(ex.id, set.id, { completedAt: set.completedAt ? undefined : new Date().toISOString() })}
                style={[{ ...styles.completeBtn, backgroundColor: set.completedAt ? palette.lime : palette.surfaceAlt }]}>
                <Text style={[{ ...styles.completeBtnText, color: set.completedAt ? palette.bg : palette.text }]}>
                  {set.completedAt ? "✓" : "Completar"}
                </Text>
              </Pressable>
            </View>
          ))}

          <Pressable onPress={() => addSetToCurrentExercise(ex.id, { id: `set-${Date.now()}`, order: ex.sets.length + 1, weight: 0, reps: 0, restSeconds: 0 })} style={styles.addSetBtn}>
            <Text style={[{ ...styles.addSetText, color: palette.muted }]}>+ Añadir serie</Text>
          </Pressable>
        </AppCard>
      ))}

      {session.status !== "completed" && (
        <PrimaryButton
          label="Finalizar entrenamiento"
          icon="check"
          onPress={() => {
            updateSession({ ...session, status: "completed", completedAt: new Date().toISOString() });
            Alert.alert("¡Entrenamiento completado!", "Buen trabajo. Los datos se han guardado.");
          }}
          style={styles.finishBtn}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg, padding: 16 },
  content: { paddingBottom: 100, gap: 12 },
  headerCard: { padding: 16, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "900", marginBottom: 4 },
  meta: { fontSize: 13 },
  exerciseCard: { padding: 16 },
  exerciseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  exerciseName: { fontSize: 18, fontWeight: "800" },
  exerciseTarget: { marginBottom: 12 },
  targetText: { fontSize: 13, fontWeight: "600" },
  previousText: { fontSize: 11, marginTop: 4 },
  setRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, borderBottomWidth: 1 },
  setNumber: { fontSize: 12, fontWeight: "700", width: 50 },
  setInputs: { flexDirection: "row", gap: 6, flex: 1 },
  input: { flex: 1, minWidth: 60 },
  inputSmall: { width: 50 },
  completeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  completeBtnText: { fontSize: 11, fontWeight: "800" },
  addSetBtn: { marginTop: 8, paddingVertical: 8, alignItems: "center", borderWidth: 1, borderRadius: 8, borderStyle: "dashed" },
  addSetText: { fontSize: 12, fontWeight: "600" },
  finishBtn: { marginTop: 16 },
  error: { fontSize: 16, textAlign: "center", marginTop: 40 },
});