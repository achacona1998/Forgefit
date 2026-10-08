import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useTabsNavigation } from "../../navigation/hooks";
import { AppCard, EmptyState, PrimaryButton, SectionHeader, Chip, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useRoutineStore } from "../../stores/routineStore";

export default function RoutineScreen() {
  const navigation = useTabsNavigation();
  const palette = usePalette();
  const { routines, activeRoutineId, getActiveRoutine, setActiveRoutine } = useRoutineStore();
  const activeRoutine = getActiveRoutine?.();

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Mis rutinas" />

      {routines.length === 0 ? (
        <AppCard>
          <EmptyState
            icon="library-add"
            title="No hay rutinas aún"
            detail="Crea tu primera rutina o carga una de ejemplo para empezar.">
            <PrimaryButton label="Crear rutina" icon="add" onPress={() => navigation.getParent()?.navigate("Routine", { screen: "RoutineBuilder", params: undefined })} />
          </EmptyState>
        </AppCard>
      ) : (
        <View style={styles.list}>
          {routines.map((routine) => (
            <AppCard key={routine.id} style={styles.routineCard}>
              <View style={styles.routineHeader}>
                <View style={styles.routineInfo}>
                  <Text style={[{ ...styles.routineName, color: palette.text }]}>{routine.name}</Text>
                  <Text style={[{ ...styles.routineMeta, color: palette.muted }]}>
                    {routine.goal} · {routine.daysPerWeek} días/semana · {routine.trainingDays.length} días
                  </Text>
                </View>
                {routine.active ? (
                  <Chip label="ACTIVA" tone="lime" />
                ) : (
                  <Pressable onPress={() => setActiveRoutine(routine.id)} style={styles.activateBtn}>
                    <Text style={styles.activateText}>Activar</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.daysPreview}>
                {routine.trainingDays.slice(0, 3).map((day) => (
                  <Text key={day.id} style={styles.dayChip}>{day.name}</Text>
                ))}
                {routine.trainingDays.length > 3 && (
                  <Text style={styles.moreChip}>+{routine.trainingDays.length - 3} más</Text>
                )}
              </View>
              <View style={styles.routineActions}>
                <PrimaryButton
                  label="Editar"
                  variant="ghost"
                  icon="edit"
                  onPress={() => navigation.getParent()?.navigate("Routine", { screen: "RoutineBuilder", params: { routineId: routine.id } })}
                />
                <PrimaryButton
                  label={routine.active ? "Ver detalle" : "Duplicar"}
                  variant={routine.active ? "blue" : "ghost"}
                  icon={routine.active ? "visibility" : "content-copy"}
                  onPress={() => navigation.getParent()?.navigate("Routine", { screen: "RoutineDetail", params: { routineId: routine.id } })}
                />
              </View>
            </AppCard>
          ))}
        </View>
      )}

      <PrimaryButton
              label="Nueva rutina"
              icon="add"
              variant="ghost"
              onPress={() => navigation.getParent()?.navigate("Routine", { screen: "RoutineBuilder", params: undefined })}
              style={styles.newRoutineBtn}
            />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  list: { gap: 12 },
  routineCard: { padding: 16 },
  routineHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  routineInfo: { flex: 1 },
  routineName: { fontSize: 18, fontWeight: "900" },
  routineMeta: { fontSize: 12, marginTop: 2 },
  activateBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  activateText: { fontSize: 11, fontWeight: "800" },
  daysPreview: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  dayChip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, fontSize: 11, fontWeight: "700" },
  moreChip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, fontSize: 11, fontWeight: "700" },
  routineActions: { flexDirection: "row", gap: 8 },
  newRoutineBtn: { marginTop: 8 },
});