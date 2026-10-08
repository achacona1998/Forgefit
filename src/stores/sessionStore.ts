import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStoreWrapper } from "../utils/secureStoreWrapper";
import type { WorkoutSession, SessionExercise, WorkoutSet } from "../types/fitness";

interface SessionState {
  sessions: WorkoutSession[];
  currentSessionId: string | null;
  setSessions: (sessions: WorkoutSession[]) => void;
  addSession: (session: WorkoutSession) => void;
  updateSession: (session: WorkoutSession) => void;
  removeSession: (id: string) => void;
  setCurrentSession: (id: string | null) => void;
  getCurrentSession: () => WorkoutSession | undefined;
  updateExerciseInCurrentSession: (exerciseId: string, updates: Partial<SessionExercise>) => void;
  updateSetInCurrentSession: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  addSetToCurrentExercise: (exerciseId: string, newSet: WorkoutSet) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      setSessions: (sessions) => set({ sessions }),
      addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
      updateSession: (session) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === session.id ? session : s)),
        })),
      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
        })),
      setCurrentSession: (id) => set({ currentSessionId: id }),
      getCurrentSession: () => get().sessions.find((s) => s.id === get().currentSessionId),

      updateExerciseInCurrentSession: (exerciseId, updates) =>
        set((state) => {
          const current = state.sessions.find((s) => s.id === state.currentSessionId);
          if (!current) return state;
          return {
            sessions: state.sessions.map((s) =>
              s.id === current.id
                ? {
                    ...s,
                    exercises: s.exercises.map((ex) =>
                      ex.id === exerciseId ? { ...ex, ...updates } : ex
                    ),
                  }
                : s
            ),
          };
        }),

      updateSetInCurrentSession: (exerciseId, setId, updates) =>
        set((state) => {
          const current = state.sessions.find((s) => s.id === state.currentSessionId);
          if (!current) return state;
          return {
            sessions: state.sessions.map((s) =>
              s.id === current.id
                ? {
                    ...s,
                    exercises: s.exercises.map((ex) =>
                      ex.id === exerciseId
                        ? {
                            ...ex,
                            sets: ex.sets.map((st) =>
                              st.id === setId ? { ...st, ...updates } : st
                            ),
                          }
                        : ex
                    ),
                  }
                : s
            ),
          };
        }),

      addSetToCurrentExercise: (exerciseId, newSet) =>
        set((state) => {
          const current = state.sessions.find((s) => s.id === state.currentSessionId);
          if (!current) return state;
          return {
            sessions: state.sessions.map((s: WorkoutSession) =>
              s.id === current.id
                ? {
                    ...s,
                    exercises: s.exercises.map((ex: SessionExercise) =>
                      ex.id === exerciseId
                        ? { ...ex, sets: [...ex.sets, newSet] }
                        : ex
                    ),
                  }
                : s
            ),
          };
        }),
    }),
    {
      name: "forgefit-sessions",
      storage: createJSONStorage(() => secureStoreWrapper),
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);