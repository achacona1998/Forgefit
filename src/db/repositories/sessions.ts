import { openDb, type Db } from "../openDb";
import type { WorkoutSession, WorkoutSet } from "../../types/fitness";

function mapSetLogRow(r: any): WorkoutSet {
  return {
    id: r.id,
    order: r.setNumber,
    type: r.type as "warmup" | "working" | "dropset" | "failure",
    weight: r.actualWeight ?? 0,
    reps: r.actualReps ?? 0,
    rir: r.actualRIR ?? undefined,
    rpe: r.actualRPE ?? undefined,
    quality: r.techniqueRating as "excellent" | "acceptable" | "poor" | undefined,
    completedAt: r.completedAt ?? undefined,
    skipped: Boolean(r.skipped),
    restSeconds: r.restActualSeconds ?? 0,
  };
}

export const sessionRepository = {
  async getAll(): Promise<WorkoutSession[]> {
    const db = await openDb();

    const sessions = await db.getAllAsync<{
      id: string;
      routineId: string | null;
      routineVersionId: string | null;
      trainingDayId: string | null;
      date: string;
      status: string;
      startedAt: string | null;
      completedAt: string | null;
      durationSeconds: number | null;
      sessionNotes: string | null;
      recoveryContext: string | null;
      createdAt: number;
    }>(`SELECT * FROM sessions ORDER BY date DESC;`);

    const result: WorkoutSession[] = [];

    for (const s of sessions) {
      const sessionExercises = await db.getAllAsync<{
        id: string;
        sessionId: string;
        exerciseId: string;
        templateSnapshot: string | null;
        "order": number;
        status: string;
        notes: string | null;
        createdAt: number;
      }>(
        `SELECT * FROM sessionExercises WHERE sessionId = ? ORDER BY "order";`,
        [s.id]
      );

      const exercises = [];

      for (const se of sessionExercises) {
        const setLogs = await db.getAllAsync<{
          id: string;
          sessionExerciseId: string;
          setNumber: number;
          type: string;
          actualWeight: number | null;
          actualReps: number | null;
          actualRIR: number | null;
          actualRPE: number | null;
          techniqueRating: string | null;
          restActualSeconds: number | null;
          completedAt: string | null;
          skipped: number;
        }>(
          `SELECT * FROM setLogs WHERE sessionExerciseId = ? ORDER BY setNumber;`,
          [se.id]
        );

        exercises.push({
          id: se.id,
          exerciseId: se.exerciseId,
          name: "Unknown",
          target: { sets: 0, repRangeMin: 1, repRangeMax: 1, restSeconds: 0 },
          templateId: "",
          order: se.order,
          sets: setLogs.map(mapSetLogRow),
        });
      }

      result.push({
        id: s.id,
        routineId: s.routineId ?? "",
        routineName: "Rutina Local",
        trainingDayId: s.trainingDayId ?? "",
        trainingDayName: "Día Local",
        scheduledDate: s.date,
        startedAt: s.startedAt ?? undefined,
        completedAt: s.completedAt ?? undefined,
        status: s.status as "scheduled" | "in_progress" | "completed" | "skipped" | "cancelled",
        notes: s.sessionNotes ?? undefined,
        exercises,
      });
    }

    return result;
  },

  async insert(session: WorkoutSession): Promise<void> {
    const db = await openDb();
    const now = Date.now();

    await db.execAsync("BEGIN;");
    try {
      await db.runAsync(
        `INSERT INTO sessions (id, routineId, trainingDayId, date, status, startedAt, completedAt, sessionNotes, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           status = excluded.status,
           startedAt = excluded.startedAt,
           completedAt = excluded.completedAt,
           sessionNotes = excluded.sessionNotes;`,
        [
          session.id,
          session.routineId ?? null,
          session.trainingDayId ?? null,
          session.scheduledDate,
          session.status,
          session.startedAt ?? null,
          session.completedAt ?? null,
          session.notes ?? null,
          now,
        ]
      );

      await db.runAsync(
        `DELETE FROM sessionExercises WHERE sessionId = ?;`,
        [session.id]
      );

      for (const ex of session.exercises) {
        await db.runAsync(
          `INSERT INTO sessionExercises (id, sessionId, exerciseId, "order", createdAt)
           VALUES (?, ?, ?, ?, ?);`,
          [ex.id, session.id, ex.exerciseId, ex.order, now]
        );

        if (ex.sets.length > 0) {
          for (const set of ex.sets) {
            await db.runAsync(
              `INSERT INTO setLogs (id, sessionExerciseId, setNumber, type, actualWeight, actualReps, actualRIR, actualRPE, techniqueRating, restActualSeconds, completedAt, skipped)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
              [
                set.id,
                ex.id,
                set.order,
                set.type || "working",
                set.weight ?? 0,
                set.reps ?? 0,
                set.rir ?? null,
                set.rpe ?? null,
                set.quality ?? null,
                set.restSeconds ?? 0,
                set.completedAt ?? null,
                set.skipped ? 1 : 0,
              ]
            );
          }
        }
      }

      await db.execAsync("COMMIT;");
    } catch (e) {
      await db.execAsync("ROLLBACK;");
      throw e;
    }
  },
};