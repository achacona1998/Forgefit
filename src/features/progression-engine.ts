import type { ExerciseTemplate, WorkoutSet, ProgressionConfig, PreviousPerformance } from "../types/fitness";

export interface ProgressionSuggestion {
  exerciseId: string;
  currentWeight: number;
  suggestedWeight: number;
  reason: string;
  confidence: "high" | "medium" | "low";
}

export function calculateNextTarget(
  template: ExerciseTemplate,
  previousPerformance: PreviousPerformance | undefined,
  completedSets: WorkoutSet[],
  config?: ProgressionConfig
): ProgressionSuggestion | null {
  if (!config || config.type !== "DOUBLE_PROGRESSION") return null;

  const workingSets = completedSets.filter((s) => s.type === "working" && !s.skipped);
  if (workingSets.length === 0) return null;

  const allSetsHitMaxReps = workingSets.every((s) => s.reps >= template.repRangeMax);
  const avgRIR = workingSets.reduce((sum, s) => sum + (s.rir ?? 0), 0) / workingSets.length;
  const targetRIR = config.minRIR ?? template.targetRir ?? 2;

  if (allSetsHitMaxReps && avgRIR <= targetRIR) {
    const increment = config.loadIncrement ?? template.increment ?? 2.5;
    return {
      exerciseId: template.exerciseId,
      currentWeight: previousPerformance?.weight ?? template.targetWeight ?? 0,
      suggestedWeight: (previousPerformance?.weight ?? template.targetWeight ?? 0) + increment,
      reason: `Completaste todas las series en ${template.repRangeMax} reps con RIR promedio ${avgRIR.toFixed(1)} (objetivo ≤ ${targetRIR})`,
      confidence: "high",
    };
  }

  if (workingSets.some((s) => s.reps < template.repRangeMin)) {
    return {
      exerciseId: template.exerciseId,
      currentWeight: previousPerformance?.weight ?? template.targetWeight ?? 0,
      suggestedWeight: (previousPerformance?.weight ?? template.targetWeight ?? 0),
      reason: `Algunas series por debajo de ${template.repRangeMin} reps. Mantén la carga.`,
      confidence: "medium",
    };
  }

  return null;
}

export function getProgressionSuggestions(
  templates: ExerciseTemplate[],
  previousPerformances: Map<string, PreviousPerformance>,
  completedSetsByExercise: Map<string, WorkoutSet[]>
): ProgressionSuggestion[] {
  const suggestions: ProgressionSuggestion[] = [];

  for (const template of templates) {
    const prev = previousPerformances.get(template.exerciseId);
    const sets = completedSetsByExercise.get(template.exerciseId) ?? [];
    const suggestion = calculateNextTarget(template, prev, sets, template.progressionConfig);
    if (suggestion) suggestions.push(suggestion);
  }

  return suggestions;
}