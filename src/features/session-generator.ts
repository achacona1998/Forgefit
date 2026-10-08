import type { Routine, TrainingDay, WorkoutSession, ExerciseTemplate, WorkoutSet } from "../types/fitness";
import { makeId, isoDate } from "./sample-data-utils";

export function findTrainingDayForDate(routine: Routine | undefined): TrainingDay | undefined {
  if (!routine) return undefined;
  const today = new Date().getDay();
  return routine.trainingDays.find((d) => d.weekday === today) ?? routine.trainingDays[0];
}

function mapTemplateToSessionExercise(template: ExerciseTemplate, previousPerformance?: { weight: number; reps: number; rir?: number }): WorkoutSession["exercises"][0] {
  const sets: WorkoutSet[] = Array.from({ length: template.sets }, (_, i) => ({
    id: makeId("set"),
    order: i + 1,
    type: "working" as const,
    weight: previousPerformance?.weight ?? template.targetWeight ?? 0,
    reps: previousPerformance?.reps ?? template.repRangeMin,
    rir: previousPerformance?.rir ?? template.targetRir,
    restSeconds: template.restSeconds,
    completedAt: undefined,
    skipped: false,
  }));

  return {
    id: makeId("ex"),
    templateId: template.id,
    exerciseId: template.exerciseId,
    name: template.name,
    order: template.order,
    target: {
      sets: template.sets,
      repRangeMin: template.repRangeMin,
      repRangeMax: template.repRangeMax,
      targetWeight: template.targetWeight,
      targetRir: template.targetRir,
      targetRpe: template.targetRpe,
      restSeconds: template.restSeconds,
    },
    previousPerformance: previousPerformance ? { weight: previousPerformance.weight, reps: previousPerformance.reps, rir: previousPerformance.rir } : undefined,
    sets,
  };
}

export function buildSession(
  routine: Routine,
  day: TrainingDay,
  existingSessions: WorkoutSession[]
): WorkoutSession {
  const today = isoDate();

  const previousSession = [...existingSessions]
    .reverse()
    .find((s) => s.status === "completed" && s.trainingDayId === day.id);

  const previousPerformances = new Map<string, { weight: number; reps: number; rir?: number }>();
  if (previousSession) {
    previousSession.exercises.forEach((ex) => {
      const bestSet = ex.sets.reduce((best, set) => (!set.skipped && set.weight * set.reps > best.weight * best.reps ? set : best), ex.sets[0]);
      if (!bestSet.skipped) {
        previousPerformances.set(ex.exerciseId, { weight: bestSet.weight, reps: bestSet.reps, rir: bestSet.rir });
      }
    });
  }

  return {
    id: makeId("ses"),
    routineId: routine.id,
    routineName: routine.name,
    trainingDayId: day.id,
    trainingDayName: day.name,
    scheduledDate: today,
    startedAt: undefined,
    completedAt: undefined,
    status: "scheduled",
    exercises: day.exercises.map((tpl) => mapTemplateToSessionExercise(tpl, previousPerformances.get(tpl.exerciseId))),
    notes: undefined,
  };
}