import type { FitnessDatabase } from "../types/fitness";
import { openDb } from "../db/openDb";

export interface ExportData {
  schemaVersion: number;
  exportDate: string;
  appVersion: string;
  data: FitnessDatabase;
}

export async function exportToJSON(): Promise<string> {
  const db = await openDb();

  const [profile, settings, exercises, routines, sessions, measurements, records] = await Promise.all([
    db.getFirstAsync<{ id: string; name: string; unit: string; createdAt: string; updatedAt: string; value: string }>(
      `SELECT * FROM settings WHERE key = 'profile' LIMIT 1;`
    ).then((r) => r ? JSON.parse(r.value) : null),
    db.getFirstAsync<{ value: string }>(
      `SELECT value FROM settings WHERE key = 'app_state' LIMIT 1;`
    ).then((r) => r ? JSON.parse(r.value).settings : null),
    db.getAllAsync(`SELECT * FROM exercises;`),
    db.getAllAsync(`SELECT * FROM routines;`),
    db.getAllAsync(`SELECT * FROM sessions;`),
    db.getAllAsync(`SELECT * FROM measurements;`),
    db.getAllAsync(`SELECT * FROM personalRecords;`),
  ]);

  const data: FitnessDatabase = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    profile: profile!,
    settings: settings!,
    exercises: exercises as any,
    routines: routines as any,
    sessions: sessions as any,
    measurements: measurements as any,
    records: records as any,
  };

  const exportData: ExportData = {
    schemaVersion: 1,
    exportDate: new Date().toISOString(),
    appVersion: "1.0.0",
    data,
  };

  return JSON.stringify(exportData, null, 2);
}

function toNullable<T>(val: T | undefined): T | null {
  return val ?? null;
}

export async function importFromJSON(json: string): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = JSON.parse(json) as ExportData;
    if (parsed.schemaVersion !== 1) {
      return { success: false, error: "Versión de esquema no compatible" };
    }

    const db = await openDb();
    await db.execAsync("BEGIN;");

    try {
      await db.runAsync(
        `INSERT INTO settings (key, value, updatedAt) VALUES ('app_state', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt;`,
        [JSON.stringify({ profile: parsed.data.profile, settings: parsed.data.settings }), Date.now()]
      );

      for (const ex of parsed.data.exercises) {
        await db.runAsync(
          `INSERT INTO exercises (id, name, aliases, category, muscleGroups, directMuscles, secondaryMuscles, equipment, videoUrl, instructions, notes, isCustom, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET name = excluded.name;`,
          [ex.id, ex.name, JSON.stringify(ex.aliases), ex.category, JSON.stringify(ex.muscleGroups), JSON.stringify(ex.directMuscles), JSON.stringify(ex.secondaryMuscles), ex.equipment, toNullable(ex.videoUrl), toNullable(ex.instructions), toNullable(ex.notes), ex.isCustom ? 1 : 0, Date.now(), Date.now()]
        );
      }

      for (const routine of parsed.data.routines) {
        const versionId = routine.id + "-v1";
        await db.runAsync(
          `INSERT INTO routines (id, name, goal, active, daysPerWeek, startDate, currentVersionId, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET name = excluded.name;`,
          [routine.id, routine.name, routine.goal, routine.active ? 1 : 0, routine.daysPerWeek, routine.startDate, versionId, routine.createdAt, routine.updatedAt]
        );

        await db.runAsync(`INSERT OR IGNORE INTO routineVersions (id, routineId, versionNumber, createdAt) VALUES (?, ?, ?, ?);`, [versionId, routine.id, 1, Date.now()]);

        for (const day of routine.trainingDays) {
          await db.runAsync(`INSERT OR IGNORE INTO trainingDays (id, routineVersionId, name, dayOfWeek, "order") VALUES (?, ?, ?, ?, ?);`, [day.id, versionId, day.name, day.weekday, day.order]);
          for (const tpl of day.exercises) {
            await db.runAsync(
              `INSERT OR IGNORE INTO exerciseTemplates (id, trainingDayId, exerciseId, "order", sets, repRangeMin, repRangeMax, targetWeight, targetRIRMin, targetRPE, restMinSeconds, notes, progressionConfig, enabled)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
              [tpl.id, day.id, tpl.exerciseId, tpl.order, tpl.sets, tpl.repRangeMin, tpl.repRangeMax, toNullable(tpl.targetWeight), toNullable(tpl.targetRir), toNullable(tpl.targetRpe), tpl.restSeconds, toNullable(tpl.notes), JSON.stringify(tpl.progressionConfig), 1]
            );
          }
        }
      }

      for (const session of parsed.data.sessions) {
        await db.runAsync(
          `INSERT OR IGNORE INTO sessions (id, routineId, trainingDayId, date, status, startedAt, completedAt, sessionNotes, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [session.id, session.routineId, session.trainingDayId, session.scheduledDate, session.status, toNullable(session.startedAt), toNullable(session.completedAt), toNullable(session.notes), Date.now()]
        );

        for (const ex of session.exercises) {
          await db.runAsync(`INSERT OR IGNORE INTO sessionExercises (id, sessionId, exerciseId, "order", createdAt) VALUES (?, ?, ?, ?, ?);`, [ex.id, session.id, ex.exerciseId, ex.order, Date.now()]);
          for (const set of ex.sets) {
            await db.runAsync(
              `INSERT OR IGNORE INTO setLogs (id, sessionExerciseId, setNumber, type, actualWeight, actualReps, actualRIR, actualRPE, techniqueRating, restActualSeconds, completedAt, skipped)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
              [set.id, ex.id, set.order, toNullable(set.type), set.weight, set.reps, toNullable(set.rir), toNullable(set.rpe), toNullable(set.quality), toNullable(set.restSeconds), toNullable(set.completedAt), set.skipped ? 1 : 0]
            );
          }
        }
      }

      for (const m of parsed.data.measurements) {
        await db.runAsync(`INSERT OR IGNORE INTO measurements (id, date, weight, bodyFatPercentage, values, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);`, [m.id, m.date, toNullable(m.weight), toNullable(m.bodyFat), JSON.stringify(m.customMetrics), toNullable(m.notes), Date.now()]);
      }

      for (const r of parsed.data.records) {
        await db.runAsync(`INSERT OR IGNORE INTO personalRecords (id, exerciseId, sessionId, recordType, weight, reps, volume, estimatedPerformance, achievedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`, [r.id, r.exerciseId, toNullable(r.sourceSessionId), r.type, r.weight, r.reps, toNullable(r.volume), 0, r.date]);
      }

      await db.execAsync("COMMIT;");
      return { success: true };
    } catch (e) {
      await db.execAsync("ROLLBACK;");
      throw e;
    }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error desconocido" };
  }
}