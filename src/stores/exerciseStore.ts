import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStoreWrapper } from "../utils/secureStoreWrapper";
import type { Exercise } from "../types/fitness";

interface ExerciseState {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exercise: Exercise) => void;
  removeExercise: (id: string) => void;
  getExercise: (id: string) => Exercise | undefined;
  searchExercises: (query: string) => Exercise[];
  filterByMuscleGroup: (muscleGroup: string) => Exercise[];
  filterByCategory: (category: string) => Exercise[];
  filterByEquipment: (equipment: string) => Exercise[];
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exercises: [],

      setExercises: (exercises) => set({ exercises }),
      addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
      updateExercise: (exercise) =>
        set((state) => ({
          exercises: state.exercises.map((e) => (e.id === exercise.id ? exercise : e)),
        })),
      removeExercise: (id) =>
        set((state) => ({ exercises: state.exercises.filter((e) => e.id !== id) })),
      getExercise: (id) => get().exercises.find((e) => e.id === id),
      searchExercises: (query) => {
        const q = query.toLowerCase();
        return get().exercises.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.aliases?.some((a) => a.toLowerCase().includes(q)) ||
            e.category.toLowerCase().includes(q) ||
            e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
            e.equipment.toLowerCase().includes(q)
        );
      },
      filterByMuscleGroup: (muscleGroup) =>
        get().exercises.filter((e) => e.muscleGroups.includes(muscleGroup)),
      filterByCategory: (category) =>
        get().exercises.filter((e) => e.category === category),
      filterByEquipment: (equipment) =>
        get().exercises.filter((e) => e.equipment === equipment),
    }),
    {
      name: "forgefit-exercises",
      storage: createJSONStorage(() => secureStoreWrapper),
      partialize: (state) => ({ exercises: state.exercises }),
    }
  )
);