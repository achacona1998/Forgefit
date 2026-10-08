import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { AppCard, EmptyState, PrimaryButton, AppInput, SectionHeader, NumberStep, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useProfileStore } from "../../stores/profileStore";

interface MeasurementInput {
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  shoulders?: number;
  waist?: number;
  hips?: number;
  rightBicep?: number;
  leftBicep?: number;
  rightThigh?: number;
  leftThigh?: number;
  rightCalf?: number;
  leftCalf?: number;
}

const measurementFields = [
  { key: "weight", label: "Peso (kg)", unit: "kg", step: 0.1 },
  { key: "bodyFat", label: "% Grasa", unit: "%", step: 0.1 },
  { key: "chest", label: "Pecho (cm)", unit: "cm", step: 0.5 },
  { key: "shoulders", label: "Hombros (cm)", unit: "cm", step: 0.5 },
  { key: "waist", label: "Cintura (cm)", unit: "cm", step: 0.5 },
  { key: "hips", label: "Cadera (cm)", unit: "cm", step: 0.5 },
  { key: "rightBicep", label: "Bíceps D (cm)", unit: "cm", step: 0.1 },
  { key: "leftBicep", label: "Bíceps I (cm)", unit: "cm", step: 0.1 },
  { key: "rightThigh", label: "Muslo D (cm)", unit: "cm", step: 0.5 },
  { key: "leftThigh", label: "Muslo I (cm)", unit: "cm", step: 0.5 },
  { key: "rightCalf", label: "Pantorrilla D (cm)", unit: "cm", step: 0.1 },
  { key: "leftCalf", label: "Pantorrilla I (cm)", unit: "cm", step: 0.1 },
];

export default function MeasurementsScreen() {
  const { measurements, addMeasurement } = useProfileStore();
  const palette = usePalette();
  const [newMeasurement, setNewMeasurement] = useState<MeasurementInput>({ date: new Date().toISOString().split("T")[0] });

  const handleSave = () => {
    addMeasurement({
      id: `m-${Date.now()}`,
      date: newMeasurement.date,
      weight: newMeasurement.weight,
      bodyFat: newMeasurement.bodyFat,
      chest: newMeasurement.chest,
      shoulders: newMeasurement.shoulders,
      waist: newMeasurement.waist,
      hips: newMeasurement.hips,
      rightBicep: newMeasurement.rightBicep,
      leftBicep: newMeasurement.leftBicep,
      rightThigh: newMeasurement.rightThigh,
      leftThigh: newMeasurement.leftThigh,
      rightCalf: newMeasurement.rightCalf,
      leftCalf: newMeasurement.leftCalf,
    });
    setNewMeasurement({ date: new Date().toISOString().split("T")[0] });
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Nueva medida" />
      <AppCard>
        <AppInput label="Fecha" value={newMeasurement.date} onChangeText={(v) => setNewMeasurement({ ...newMeasurement, date: v })} style={styles.dateInput} />
        {measurementFields.map((field) => (
          <View key={field.key} style={styles.fieldRow}>
            <Text style={[{ ...styles.fieldLabel, color: palette.text }]}>{field.label}</Text>
            <NumberStep
              value={Number(newMeasurement[field.key as keyof typeof newMeasurement]) || 0}
              onChange={(v) => setNewMeasurement({ ...newMeasurement, [field.key]: v })}
              step={field.step}
              suffix={` ${field.unit}`}
            />
          </View>
        ))}
        <PrimaryButton label="Guardar medida" icon="save" onPress={handleSave} style={styles.saveBtn} />
      </AppCard>

      <SectionHeader title="Historial" />
      {measurements.length === 0 ? (
        <AppCard>
          <EmptyState icon="straighten" title="Sin medidas registradas" detail="Añade tu primera medición arriba." />
        </AppCard>
      ) : (
        <View style={styles.history}>
          {measurements.slice(0, 10).map((m) => (
            <AppCard key={m.id} style={styles.measureCard}>
              <Text style={[{ ...styles.measureDate, color: palette.text }]}>{m.date}</Text>
              <View style={styles.measureValues}>
                {m.weight && <Text>{m.weight} kg</Text>}
                {m.bodyFat && <Text>{m.bodyFat}%</Text>}
                {m.chest && <Text>Pecho: {m.chest} cm</Text>}
                {m.waist && <Text>Cintura: {m.waist} cm</Text>}
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
  dateInput: { marginBottom: 12 },
  fieldRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 },
  fieldLabel: { fontSize: 13, fontWeight: "600", width: 120 },
  saveBtn: { marginTop: 8 },
  history: { gap: 8 },
  measureCard: { padding: 16 },
  measureDate: { fontSize: 14, fontWeight: "800", marginBottom: 8 },
  measureValues: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
});