import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import * as SQLite from "expo-sqlite";
import { exerciseRepository } from "../db/repositories/exercises";
import { routineRepository } from "../db/repositories/routines";
import { sessionRepository } from "../db/repositories/sessions";
import { openDb } from "../db/openDb";
import { SCHEMA_SQL } from "../db/schema";
import { exerciseLibrary } from "../features/sample-data";
import { useExerciseStore } from "../stores/exerciseStore";
import { useRoutineStore } from "../stores/routineStore";
import { useSessionStore } from "../stores/sessionStore";
import { useProfileStore } from "../stores/profileStore";
import type { FitnessDatabase } from "../types/fitness";

interface DatabaseContextValue {
  db: SQLite.SQLiteDatabase | null;
  initialized: boolean;
  initializeDatabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [initialized, setInitialized] = useState(false);

  const { setExercises } = useExerciseStore();
  const { setRoutines, setActiveRoutine } = useRoutineStore();
  const { setSessions } = useSessionStore();
  const { setProfile, setSettings, setMeasurements, setRecords, setStats, setHydrated } = useProfileStore();

  const initializeDatabase = async () => {
    try {
      const database = await openDb();
      setDb(database);

      // Run migrations
      await database.execAsync(SCHEMA_SQL);

      // Load data into stores
      const [exercises, routines, sessions] = await Promise.all([
        exerciseRepository.getAll(),
        routineRepository.getAll(),
        sessionRepository.getAll(),
      ]);

      setExercises(exercises);
      setRoutines(routines);
      setSessions(sessions);

      // Initialize exercise library if empty
      if (exercises.length === 0) {
        await exerciseRepository.insertMany(exerciseLibrary);
        setExercises(exerciseLibrary);
      }

      // Load profile/settings from settings table
      const settingsRecord = await database.getFirstAsync<{ value: string }>(
        `SELECT value FROM settings WHERE key = 'app_state' LIMIT 1;`
      );

      if (settingsRecord) {
        try {
          const parsed = JSON.parse(settingsRecord.value) as Partial<FitnessDatabase>;
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.settings) setSettings(parsed.settings);
        } catch {
          // Ignore parse errors
        }
      }

      // Load measurements and records
      const [measurements, records] = await Promise.all([
        database.getAllAsync<{ id: string; date: string; weight: number | null; bodyFatPercentage: number | null; values: string | null; notes: string | null; createdAt: number }>(
          `SELECT * FROM measurements ORDER BY date DESC;`
        ),
        database.getAllAsync<{ id: string; exerciseId: string; sessionId: string | null; recordType: string; weight: number | null; reps: number | null; volume: number | null; estimatedPerformance: number | null; achievedAt: string }>(
          `SELECT * FROM personalRecords ORDER BY achievedAt DESC;`
        ),
      ]);

      setMeasurements(
        measurements.map((m) => ({
          id: m.id,
          date: m.date,
          weight: m.weight ?? undefined,
          bodyFat: m.bodyFatPercentage ?? undefined,
          values: m.values ? JSON.parse(m.values) : undefined,
          notes: m.notes ?? undefined,
        }))
      );

      setRecords(
        records.map((r) => ({
          id: r.id,
          exerciseId: r.exerciseId,
          exerciseName: "", // Will be resolved from exercise store
          date: r.achievedAt,
          weight: r.weight ?? 0,
          reps: r.reps ?? 0,
          type: r.recordType as "weight" | "estimated_1rm" | "volume",
          sourceSessionId: r.sessionId ?? undefined,
        }))
      );

      // Calculate stats
      const completedSessions = sessions.filter((s) => s.status === "completed");
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weeklySessions = completedSessions.filter((s) => new Date(s.scheduledDate) >= weekAgo).length;
      const monthlySessions = completedSessions.filter((s) => new Date(s.scheduledDate) >= monthAgo).length;

      let weeklyVolume = 0;
      let monthlyVolume = 0;
      let totalMinutes = 0;

      completedSessions.forEach((session) => {
        const sessionDate = new Date(session.scheduledDate);
        let sessionVolume = 0;
        session.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            if (!set.skipped) {
              sessionVolume += set.weight * set.reps;
            }
          });
        });
        if (sessionDate >= weekAgo) weeklyVolume += sessionVolume;
        if (sessionDate >= monthAgo) monthlyVolume += sessionVolume;
        if (session.durationSeconds) totalMinutes += Math.floor(session.durationSeconds / 60);
      });

      setStats({
        weeklySessions,
        monthlySessions,
        weeklyVolume,
        monthlyVolume,
        totalMinutes,
        recentRecords: records.slice(0, 5).map((r) => ({
          id: r.id,
          exerciseId: r.exerciseId,
          exerciseName: "",
          date: r.achievedAt,
          weight: r.weight ?? 0,
          reps: r.reps ?? 0,
          type: r.recordType as "weight" | "estimated_1rm" | "volume",
          sourceSessionId: r.sessionId ?? undefined,
        })),
      });

      setHydrated(true);
    } catch (error) {
      console.error("Database initialization failed:", error);
      setHydrated(true);
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, initialized, initializeDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within DatabaseProvider");
  }
  return context;
}