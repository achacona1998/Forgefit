import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { useTabsNavigation } from "../../navigation/hooks";
import { AppCard, EmptyState, PrimaryButton, Chip, SectionHeader, AppInput, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useExerciseStore } from "../../stores/exerciseStore";

export default function LibraryScreen() {
  const navigation = useTabsNavigation();
  const palette = usePalette();
  const { exercises, searchExercises, filterByMuscleGroup, filterByCategory } = useExerciseStore();
  const [query, setQuery] = React.useState("");

  const filtered = query ? searchExercises(query) : exercises;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AppInput
        label="Buscar ejercicios"
        placeholder="Nombre, músculo, equipo..."
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      <View style={styles.filters}>
        <Chip label="Todos" tone="neutral" />
        <Chip label="Pecho" tone="blue" onPress={() => setQuery("pecho")} />
        <Chip label="Espalda" tone="lime" onPress={() => setQuery("espalda")} />
        <Chip label="Piernas" tone="warning" onPress={() => setQuery("piernas")} />
        <Chip label="Hombros" tone="success" onPress={() => setQuery("hombros")} />
        <Chip label="Brazos" tone="blue" onPress={() => setQuery("brazos")} />
      </View>

      <SectionHeader title={`Ejercicios (${filtered.length})`} />

      {filtered.length === 0 ? (
        <AppCard>
          <EmptyState
            icon="search-off"
            title={query ? "Sin resultados" : "Biblioteca vacía"}
            detail={query ? "Prueba con otros términos de búsqueda." : "Añade ejercicios a tu biblioteca."}>
            <PrimaryButton label="Crear ejercicio" icon="add" onPress={() => navigation.getParent()?.navigate("Exercise", { screen: "CreateExercise", params: undefined })} />
          </EmptyState>
        </AppCard>
      ) : (
        <View style={styles.list}>
          {filtered.map((ex) => (
            <AppCard key={ex.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={[{ ...styles.exerciseName, color: palette.text }]}>{ex.name}</Text>
                <Chip tone={ex.isCustom ? "warning" : "neutral"} label={ex.category} />
              </View>
              <View style={styles.exerciseMeta}>
                <Text style={[{ ...styles.muscleGroups, color: palette.muted }]}>
                  {ex.muscleGroups.slice(0, 3).join(", ")}{ex.muscleGroups.length > 3 ? "..." : ""}
                </Text>
                <Text style={[{ ...styles.equipment, color: palette.muted }]}>{ex.equipment}</Text>
              </View>
            </AppCard>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  search: { marginBottom: 8 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  list: { gap: 10 },
  exerciseCard: { padding: 16 },
  exerciseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  exerciseName: { fontSize: 16, fontWeight: "800" },
  exerciseMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  muscleGroups: { fontSize: 12, flex: 1 },
  equipment: { fontSize: 11, fontWeight: "600" },
});