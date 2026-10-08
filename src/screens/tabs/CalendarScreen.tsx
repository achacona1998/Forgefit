import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { AppCard, SectionHeader,  PrimaryButton, usePalette } from "../../components/ui";
import { darkPalette } from "../../context/PaletteContext";
import { useSessionStore } from "../../stores/sessionStore";
import { useRoutineStore } from "../../stores/routineStore";

export default function CalendarScreen() {
  const palette = usePalette();
  const { sessions } = useSessionStore();
  const { activeRoutineId, getActiveRoutine } = useRoutineStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const activeRoutine = getActiveRoutine?.();
  const todayStr = new Date().toISOString().split("T")[0];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);
  const monthName = selectedDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const getSessionForDay = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return sessions.find((s) => s.scheduledDate === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === selectedDate.getMonth() && today.getFullYear() === selectedDate.getFullYear();
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <PrimaryButton variant="ghost" label="Anterior" icon="chevron-left" onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} />
        <Text style={[{ ...styles.monthTitle, color: palette.text }]}>{monthName}</Text>
        <PrimaryButton variant="ghost" label="Siguiente" icon="chevron-right" onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} />
      </View>

      <View style={styles.weekdays}>
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <Text key={d} style={[{ ...styles.weekday, color: palette.muted }]}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dayEmpty} />
        ))}
        {days.map((day) => {
          const session = getSessionForDay(day);
          const today = isToday(day);
          let status: "completed" | "scheduled" | "rest" | "today" = "rest";
          if (today) status = "today";
          else if (session) status = session.status === "completed" ? "completed" : "scheduled";

          return (
            <Pressable key={day} style={[{ ...styles.day, ...styles[status] }]} onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}>
              <Text style={[{ ...styles.dayText, ...(today && styles.todayText) }]}>{day}</Text>
              {session && <View style={styles.dot} />}
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="Sesión seleccionada" />
      <AppCard>
        {getSessionForDay(selectedDate.getDate()) ? (
          <View>
            <Text style={[{ ...styles.sessionTitle, color: palette.text }]}>{getSessionForDay(selectedDate.getDate())?.trainingDayName}</Text>
            <Text style={[{ ...styles.sessionMeta, color: palette.muted }]}>{getSessionForDay(selectedDate.getDate())?.exercises.length} ejercicios · {getSessionForDay(selectedDate.getDate())?.status}</Text>
          </View>
        ) : (
          <Text style={[{ ...styles.noSession, color: palette.muted }]}>Día de descanso</Text>
        )}
      </AppCard>

      <SectionHeader title="Leyenda" />
      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.dotCompleted]} /><Text>Completado</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.dotScheduled]} /><Text>Programado</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.dotToday]} /><Text>Hoy</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.dotRest]} /><Text>Descanso</Text></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  content: { padding: 16, paddingBottom: 100, gap: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  monthTitle: { fontSize: 20, fontWeight: "900" },
  weekdays: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  weekday: { fontSize: 12, fontWeight: "700", width: 40, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  dayEmpty: { width: 40, height: 40 },
  day: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  dayText: { fontSize: 14, fontWeight: "700" },
  todayText: { color: darkPalette.bg },
  scheduled: { backgroundColor: darkPalette.blueSoft },
  completed: { backgroundColor: darkPalette.limeSoft },
  today: { backgroundColor: darkPalette.lime },
  rest: { backgroundColor: darkPalette.surfaceAlt },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: darkPalette.lime, marginTop: 4 },
  sessionTitle: { fontSize: 16, fontWeight: "800" },
  sessionMeta: { fontSize: 12, marginTop: 2 },
  noSession: { textAlign: "center", paddingVertical: 20 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  dotCompleted: { backgroundColor: darkPalette.lime },
  dotScheduled: { backgroundColor: darkPalette.blue },
  dotToday: { backgroundColor: darkPalette.lime, borderWidth: 2, borderColor: darkPalette.text },
  dotRest: { backgroundColor: darkPalette.muted },
});