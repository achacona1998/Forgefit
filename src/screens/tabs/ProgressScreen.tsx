import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppCard, EmptyState, SectionHeader, Metric, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useProfileStore } from "../../stores/profileStore";

export default function ProgressScreen() {
  const palette = usePalette();
  const { stats } = useProfileStore();

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Resumen semanal" />
      <AppCard>
        <View style={styles.metricRow}>
          <Metric label="Sesiones" value={`${stats.weeklySessions}`} detail="esta semana" />
          <Metric label="Volumen" value={`${Math.round(stats.weeklyVolume / 1000)}k`} detail="kg" tone="blue" />
          <Metric label="Tiempo" value={`${stats.totalMinutes}m`} detail="total" tone="white" />
        </View>
      </AppCard>

      <SectionHeader title="PRs recientes" />
      {stats.recentRecords.length > 0 ? (
        <View style={styles.prList}>
          {stats.recentRecords.map((pr) => (
            <AppCard key={pr.id} style={styles.prCard}>
              <Text style={[{ ...styles.prName, color: palette.text }]}>{pr.exerciseName}</Text>
              <Text style={[{ ...styles.prDetail, color: palette.muted }]}>{pr.weight} kg × {pr.reps} · {pr.type}</Text>
            </AppCard>
          ))}
        </View>
      ) : (
        <AppCard>
          <EmptyState icon="trending-up" title="Sin récords aún" detail="Entrena para ver tus mejores marcas aquí." />
        </AppCard>
      )}

      <SectionHeader title="Ejercicios en progreso" />
      <AppCard>
        <EmptyState icon="bar-chart" title="Gráficas próximamente" detail="Historial por ejercicio, volumen muscular y adherencia en desarrollo." />
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  metricRow: { flexDirection: "row", alignItems: "stretch" },
  prList: { gap: 8 },
  prCard: { padding: 16 },
  prName: { fontSize: 16, fontWeight: "800" },
  prDetail: { fontSize: 12, marginTop: 2 },
});