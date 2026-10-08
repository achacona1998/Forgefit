import type { WorkoutSession, PersonalRecord } from "../types/fitness";

export function getWorkoutStats(sessions: WorkoutSession[], records: PersonalRecord[]) {
  const completed = sessions.filter((s) => s.status === "completed");
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weeklySessions = completed.filter((s) => new Date(s.scheduledDate) >= weekAgo).length;
  const monthlySessions = completed.filter((s) => new Date(s.scheduledDate) >= monthAgo).length;

  let weeklyVolume = 0;
  let monthlyVolume = 0;
  let totalMinutes = 0;

  completed.forEach((session) => {
    const sessionDate = new Date(session.scheduledDate);
    let sessionVolume = 0;
    session.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (!set.skipped) sessionVolume += set.weight * set.reps;
      });
    });
    if (sessionDate >= weekAgo) weeklyVolume += sessionVolume;
    if (sessionDate >= monthAgo) monthlyVolume += sessionVolume;
    if (session.durationSeconds) totalMinutes += Math.floor(session.durationSeconds / 60);
  });

  return {
    weeklySessions,
    monthlySessions,
    weeklyVolume,
    monthlyVolume,
    totalMinutes,
    recentRecords: records.slice(0, 10),
  };
}

export function detectNewRecords(
  session: WorkoutSession,
  previousSessions: WorkoutSession[],
  existingRecords: PersonalRecord[]
): PersonalRecord[] {
  const newRecords: PersonalRecord[] = [];
  const now = new Date().toISOString();

  for (const ex of session.exercises) {
    const previousBest = Math.max(
      ...previousSessions
        .filter((s) => s.status === "completed")
        .flatMap((s) => s.exercises.filter((e) => e.exerciseId === ex.exerciseId))
        .flatMap((e) => e.sets.filter((set) => !set.skipped).map((set) => set.weight * set.reps)),
      0
    );

    const sessionBest = Math.max(...ex.sets.filter((set) => !set.skipped).map((set) => set.weight * set.reps), 0);

    if (sessionBest > previousBest && sessionBest > 0) {
      const bestSet = ex.sets.reduce((best, set) => (!set.skipped && set.weight * set.reps > best.weight * best.reps ? set : best), ex.sets[0]);
      newRecords.push({
        id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        exerciseId: ex.exerciseId,
        exerciseName: ex.name,
        date: now,
        weight: bestSet.weight,
        reps: bestSet.reps,
        type: "volume",
        sourceSessionId: session.id,
      });
    }
  }

  return newRecords;
}