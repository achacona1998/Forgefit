import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppCard, AppInput, PrimaryButton, SectionHeader, Chip, EmptyState, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";

export default function RoutineBuilderScreen() {
  const route = useRoute();
  const { routineId } = route.params as { routineId?: string };
  const navigation = useNavigation();
  const palette = usePalette();
  const [name, setName] = React.useState("");
  const [goal, setGoal] = React.useState("Hipertrofia");
  const [daysPerWeek, setDaysPerWeek] = React.useState(4);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title={routineId ? "Editar rutina" : "Nueva rutina"} />
      <AppCard>
        <AppInput label="Nombre" placeholder="Ej. Push/Pull/Legs" value={name} onChangeText={setName} />
        <AppInput label="Objetivo" placeholder="Hipertrofia, Fuerza..." value={goal} onChangeText={setGoal} />
        <View style={styles.field}>
          <Text style={[{ ...styles.fieldLabel, color: palette.muted }]}>Días por semana</Text>
          <View style={styles.daysRow}>
            {[3, 4, 5, 6].map((d) => (
              <Pressable key={d} onPress={() => setDaysPerWeek(d)} style={[{ ...styles.dayBtn, backgroundColor: daysPerWeek === d ? palette.lime : palette.surfaceAlt }]}>
                <Text style={[{ ...styles.dayBtnText, color: daysPerWeek === d ? palette.bg : palette.text }]}>{d}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <PrimaryButton label={routineId ? "Guardar cambios" : "Crear rutina"} icon="save" onPress={() => { navigation.goBack(); }} />
      </AppCard>

      <SectionHeader title="Días de entrenamiento" />
      <AppCard>
        <EmptyState icon="add" title="Sin días configurados" detail="Añade días de entrenamiento a tu rutina.">
          <PrimaryButton label="Añadir día" icon="add" onPress={() => {}} />
        </EmptyState>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: "800", marginBottom: 8 },
  daysRow: { flexDirection: "row", gap: 8 },
  dayBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1 },
  dayBtnText: { fontSize: 14, fontWeight: "800" },
});