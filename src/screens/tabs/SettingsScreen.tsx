import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from "react-native";
import { useTheme, useThemePreference } from "../../theme/ThemeProvider";
import { AppCard, SectionHeader, PrimaryButton, EmptyState, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useProfileStore } from "../../stores/profileStore";
import { useExerciseStore } from "../../stores/exerciseStore";
import { useRoutineStore } from "../../stores/routineStore";
import { useSessionStore } from "../../stores/sessionStore";

export default function SettingsScreen() {
  const { theme, themePreference, setTheme } = useThemePreference();
  const palette = usePalette();
  const { profile, settings, updateProfile, updateSettings, reset } = useProfileStore();
  const { exercises, setExercises } = useExerciseStore();
  const { routines, setRoutines } = useRoutineStore();
  const { sessions, setSessions } = useSessionStore();

  const handleExport = async () => {
    const data = {
      profile,
      settings,
      exercises,
      routines,
      sessions,
      exportedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    console.log("Export data:", json);
    alert("Datos exportados (ver consola)");
  };

  const handleReset = () => {
    if (confirm("¿Eliminar TODOS los datos? Esta acción no se puede deshacer.")) {
      reset();
      setExercises([]);
      setRoutines([]);
      setSessions([]);
      alert("Datos eliminados. Reinicia la app.");
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Apariencia" />
      <AppCard>
        <View style={styles.settingRow}>
          <Text style={[{ ...styles.settingLabel, color: palette.text }]}>Tema</Text>
          <View style={styles.themeSelector}>
            {(["system", "light", "dark"] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => setTheme(t)}
                style={[
                  styles.themeOption,
                  themePreference === t && styles.themeOptionActive,
                ]}>
                <Text style={[{ ...styles.themeOptionText, color: themePreference === t ? palette.lime : palette.text }]}>
                  {t === "system" ? "Sistema" : t === "light" ? "Claro" : "Oscuro"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </AppCard>

      <SectionHeader title="Preferencias de entrenamiento" />
      <AppCard>
        <View style={styles.settingRow}>
          <Text style={[{ ...styles.settingLabel, color: palette.text }]}>Mostrar RIR</Text>
          <Switch value={settings.showRir} onValueChange={(v) => updateSettings({ showRir: v })} thumbColor={palette.lime} trackColor={{ false: palette.border, true: palette.limeSoft }} />
        </View>
        <View style={styles.settingRow}>
          <Text style={[{ ...styles.settingLabel, color: palette.text }]}>Mostrar RPE</Text>
          <Switch value={settings.showRpe} onValueChange={(v) => updateSettings({ showRpe: v })} thumbColor={palette.lime} trackColor={{ false: palette.border, true: palette.limeSoft }} />
        </View>
        <View style={styles.settingRow}>
          <Text style={[{ ...styles.settingLabel, color: palette.text }]}>Celebrar PRs</Text>
          <Switch value={settings.prCelebration} onValueChange={(v) => updateSettings({ prCelebration: v })} thumbColor={palette.lime} trackColor={{ false: palette.border, true: palette.limeSoft }} />
        </View>
        <View style={styles.settingRow}>
          <Text style={[{ ...styles.settingLabel, color: palette.text }]}>Unidad de peso</Text>
          <Text style={[{ ...styles.settingValue, color: palette.muted }]}>{settings.equipmentProfile?.barWeight ? "kg" : "kg"}</Text>
        </View>
      </AppCard>

      <SectionHeader title="Perfil" />
      <AppCard>
        <View style={styles.profileRow}>
          <Text style={[{ ...styles.profileName, color: palette.text }]}>{profile.name}</Text>
          <Text style={[{ ...styles.profileUnit, color: palette.muted }]}>{settings.equipmentProfile?.barWeight ? `${settings.equipmentProfile.barWeight} kg` : "20 kg"} barra</Text>
        </View>
        <PrimaryButton label="Editar perfil" variant="ghost" icon="edit" style={styles.editBtn} onPress={() => {}} />
      </AppCard>

      <SectionHeader title="Datos" />
      <AppCard>
        <PrimaryButton label="Exportar backup (JSON)" variant="ghost" icon="download" onPress={handleExport} />
        <PrimaryButton label="Importar backup" variant="ghost" icon="upload" onPress={() => alert("Próximamente")} />
      </AppCard>

      <SectionHeader title="Zona de peligro" />
      <AppCard>
        <PrimaryButton label="Eliminar todos los datos" variant="danger" icon="delete" onPress={handleReset} />
      </AppCard>

      <View style={styles.footer}>
        <Text style={[{ ...styles.version, color: palette.muted }]}>ForgeFit v1.0.0</Text>
        <Text style={[{ ...styles.credit, color: palette.muted }]}>Creado por achadev · Local-first · Offline</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  content: { padding: 16, paddingBottom: 100, gap: 12 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  settingLabel: { fontSize: 15, fontWeight: "600" },
  settingValue: { fontSize: 14 },
  themeSelector: { flexDirection: "row", gap: 6 },
  themeOption: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1 },
  themeOptionActive: { borderColor: darkPalette.lime },
  themeOptionText: { fontSize: 12, fontWeight: "700" },
  profileRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  profileName: { fontSize: 18, fontWeight: "900" },
  profileUnit: { fontSize: 13 },
  editBtn: { marginTop: 8 },
  footer: { paddingVertical: 24, alignItems: "center", gap: 4 },
  version: { fontSize: 13, fontWeight: "600" },
  credit: { fontSize: 11, opacity: 0.7 },
});