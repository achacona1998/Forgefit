import type { Exercise, Routine, TrainingDay, ExerciseTemplate, FitnessDatabase, AthleteProfile, AppSettings } from "../types/fitness";
import { makeId, isoDate } from "./sample-data-utils";

export const exerciseLibrary: Exercise[] = [
  { id: makeId("ex"), name: "Press de banca", aliases: ["Banca", "Bench press"], category: "compound", muscleGroups: ["pecho", "triceps", "hombros"], directMuscles: ["pecho"], secondaryMuscles: ["triceps", "hombros"], equipment: "Barra", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Press inclinado mancuernas", aliases: ["Inclinado DB"], category: "compound", muscleGroups: ["pecho", "triceps", "hombros"], directMuscles: ["pecho (clavicular)"], secondaryMuscles: ["triceps", "hombros"], equipment: "Mancuernas", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Press militar", aliases: ["Militar", "OHP"], category: "compound", muscleGroups: ["hombros", "triceps"], directMuscles: ["hombros (deltoides anterior)"], secondaryMuscles: ["triceps", "trapecio"], equipment: "Barra", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Remo con barra", aliases: ["Barbell row"], category: "compound", muscleGroups: ["espalda", "biceps"], directMuscles: ["dorsal", "romboides"], secondaryMuscles: ["biceps", "posterior deltoide"], equipment: "Barra", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Dominadas", aliases: ["Pull-ups", "Chin-ups"], category: "bodyweight", muscleGroups: ["espalda", "biceps"], directMuscles: ["dorsal"], secondaryMuscles: ["biceps", "posterior deltoide"], equipment: "Barra fija", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Sentadilla", aliases: ["Squat", "Back squat"], category: "compound", muscleGroups: ["piernas", "gluteos"], directMuscles: ["cuadriceps", "gluteos"], secondaryMuscles: ["isquios", "core"], equipment: "Barra", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Peso muerto", aliases: ["Deadlift"], category: "compound", muscleGroups: ["espalda", "piernas", "core"], directMuscles: ["isquios", "gluteos", "lumbares"], secondaryMuscles: ["dorsal", "trapecio", "core"], equipment: "Barra", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Press piernas", aliases: ["Leg press"], category: "machine", muscleGroups: ["piernas"], directMuscles: ["cuadriceps"], secondaryMuscles: ["gluteos", "isquios"], equipment: "Máquina", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Curl femoral", aliases: ["Leg curl"], category: "isolation", muscleGroups: ["piernas"], directMuscles: ["isquios"], secondaryMuscles: ["gluteos"], equipment: "Máquina", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Extensión cuádriceps", aliases: ["Leg extension"], category: "isolation", muscleGroups: ["piernas"], directMuscles: ["cuadriceps"], secondaryMuscles: [], equipment: "Máquina", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Elevaciones laterales", aliases: ["Lateral raises"], category: "isolation", muscleGroups: ["hombros"], directMuscles: ["hombros (deltoides lateral)"], secondaryMuscles: [], equipment: "Mancuernas", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Face pulls", aliases: [], category: "isolation", muscleGroups: ["hombros", "espalda"], directMuscles: ["posterior deltoide", "romboides"], secondaryMuscles: ["trapecio medio"], equipment: "Polea", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Curl bíceps", aliases: ["Bicep curl"], category: "isolation", muscleGroups: ["brazos"], directMuscles: ["biceps"], secondaryMuscles: ["braquial"], equipment: "Mancuernas", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Extensión tríceps polea", aliases: ["Tricep pushdown"], category: "isolation", muscleGroups: ["brazos"], directMuscles: ["triceps"], secondaryMuscles: [], equipment: "Polea", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
  { id: makeId("ex"), name: "Plancha abdominal", aliases: ["Plank"], category: "core", muscleGroups: ["core"], directMuscles: ["abdominales"], secondaryMuscles: ["lumbares", "gluteos"], equipment: "Peso corporal", videoUrl: "", instructions: "", notes: "", isCustom: false, createdAt: isoDate(), updatedAt: isoDate() },
];

function tpl(exId: string, name: string, order: number, sets: number, repMin: number, repMax: number, rest: number, rir?: number, weight?: number): ExerciseTemplate {
  return { id: makeId("tpl"), exerciseId: exId, name, order, sets, repRangeMin: repMin, repRangeMax: repMax, targetWeight: weight, targetRir: rir, restSeconds: rest };
}

export function createSampleDatabase(): FitnessDatabase {
  const now = isoDate();
  const profile: AthleteProfile = {
    id: "athlete-local",
    name: "Atleta",
    unit: "kg",
    createdAt: now,
    updatedAt: now,
  };

  const settings: AppSettings = {
    theme: "dark",
    showRir: true,
    showRpe: true,
    prCelebration: true,
    firstRunCompleted: true,
    equipmentProfile: { barWeight: 20, availablePlates: [25, 20, 15, 10, 5, 2.5, 1.25] },
  };

  const bench = exerciseLibrary.find((e) => e.name === "Press de banca")!;
  const incline = exerciseLibrary.find((e) => e.name === "Press inclinado mancuernas")!;
  const military = exerciseLibrary.find((e) => e.name === "Press militar")!;
  const row = exerciseLibrary.find((e) => e.name === "Remo con barra")!;
  const pullup = exerciseLibrary.find((e) => e.name === "Dominadas")!;
  const squat = exerciseLibrary.find((e) => e.name === "Sentadilla")!;
  const deadlift = exerciseLibrary.find((e) => e.name === "Peso muerto")!;
  const legpress = exerciseLibrary.find((e) => e.name === "Press piernas")!;
  const legcurl = exerciseLibrary.find((e) => e.name === "Curl femoral")!;
  const lext = exerciseLibrary.find((e) => e.name === "Extensión cuádriceps")!;
  const latraise = exerciseLibrary.find((e) => e.name === "Elevaciones laterales")!;
  const facepull = exerciseLibrary.find((e) => e.name === "Face pulls")!;
  const bcurl = exerciseLibrary.find((e) => e.name === "Curl bíceps")!;
  const tpush = exerciseLibrary.find((e) => e.name === "Extensión tríceps polea")!;
  const plank = exerciseLibrary.find((e) => e.name === "Plancha abdominal")!;

  const routines: Routine[] = [
    {
      id: makeId("rt"),
      name: "Push / Pull / Legs (5 días)",
      goal: "Hipertrofia",
      active: true,
      daysPerWeek: 5,
      startDate: isoDate(),
      trainingDays: [
        { id: makeId("day"), weekday: 1, name: "Push A", order: 1, exercises: [tpl(bench.id, bench.name, 1, 4, 6, 10, 180, 2, 80), tpl(incline.id, incline.name, 2, 3, 8, 12, 120, 2, 30), tpl(military.id, military.name, 3, 3, 8, 12, 120, 2, 40), tpl(latraise.id, latraise.name, 4, 3, 12, 15, 90, 1), tpl(tpush.id, tpush.name, 5, 3, 10, 12, 90, 1)] },
        { id: makeId("day"), weekday: 2, name: "Pull A", order: 2, exercises: [tpl(deadlift.id, deadlift.name, 1, 3, 5, 8, 180, 2, 100), tpl(row.id, row.name, 2, 4, 8, 12, 120, 2, 60), tpl(pullup.id, pullup.name, 3, 3, 6, 10, 120, 2), tpl(facepull.id, facepull.name, 4, 3, 12, 15, 90, 1), tpl(bcurl.id, bcurl.name, 5, 3, 10, 12, 90, 1)] },
        { id: makeId("day"), weekday: 3, name: "Legs A", order: 3, exercises: [tpl(squat.id, squat.name, 1, 4, 6, 10, 180, 2, 80), tpl(legpress.id, legpress.name, 2, 3, 10, 12, 120, 2, 120), tpl(legcurl.id, legcurl.name, 3, 3, 10, 12, 90, 1), tpl(lext.id, lext.name, 4, 3, 12, 15, 90, 1), tpl(plank.id, plank.name, 5, 3, 1, 1, 60, undefined, 0)] },
        { id: makeId("day"), weekday: 5, name: "Push B", order: 4, exercises: [tpl(incline.id, incline.name, 1, 4, 6, 10, 180, 2, 70), tpl(bench.id, bench.name, 2, 3, 8, 12, 120, 2, 70), tpl(military.id, military.name, 3, 3, 8, 12, 120, 2, 35), tpl(latraise.id, latraise.name, 4, 3, 12, 15, 90, 1), tpl(tpush.id, tpush.name, 5, 3, 10, 12, 90, 1)] },
        { id: makeId("day"), weekday: 6, name: "Pull B", order: 5, exercises: [tpl(row.id, row.name, 1, 4, 8, 12, 120, 2, 55), tpl(pullup.id, pullup.name, 2, 3, 6, 10, 120, 2), tpl(facepull.id, facepull.name, 3, 3, 12, 15, 90, 1), tpl(deadlift.id, deadlift.name, 4, 3, 6, 8, 180, 2, 90), tpl(bcurl.id, bcurl.name, 5, 3, 10, 12, 90, 1)] },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    schemaVersion: 1,
    updatedAt: now,
    profile,
    settings,
    exercises: exerciseLibrary,
    routines,
    sessions: [],
    measurements: [],
    records: [],
  };
}