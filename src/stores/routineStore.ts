import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStoreWrapper } from "../utils/secureStoreWrapper";
import type { Routine } from "../types/fitness";

interface RoutineState {
  routines: Routine[];
  activeRoutineId: string | null;
  setRoutines: (routines: Routine[]) => void;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routine: Routine) => void;
  removeRoutine: (id: string) => void;
  setActiveRoutine: (id: string | null) => void;
  getActiveRoutine: () => Routine | undefined;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      routines: [],
      activeRoutineId: null,

      setRoutines: (routines) => set({ routines }),
      addRoutine: (routine) => set((state) => ({ routines: [...state.routines, routine] })),
      updateRoutine: (routine) =>
        set((state) => ({
          routines: state.routines.map((r) => (r.id === routine.id ? routine : r)),
        })),
      removeRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
          activeRoutineId: state.activeRoutineId === id ? null : state.activeRoutineId,
        })),
      setActiveRoutine: (id) => set({ activeRoutineId: id }),
      getActiveRoutine: () => get().routines.find((r) => r.id === get().activeRoutineId),
    }),
    {
      name: "forgefit-routines",
      storage: createJSONStorage(() => secureStoreWrapper),
      partialize: (state) => ({
        routines: state.routines,
        activeRoutineId: state.activeRoutineId,
      }),
    }
  )
);