import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStoreWrapper } from "../utils/secureStoreWrapper";
import type { AthleteProfile, AppSettings, Measurement, PersonalRecord, WorkoutStats } from "../types/fitness";

interface ProfileState {
  profile: AthleteProfile;
  settings: AppSettings;
  measurements: Measurement[];
  records: PersonalRecord[];
  stats: WorkoutStats;
  hydrated: boolean;

  setProfile: (profile: AthleteProfile) => void;
  updateProfile: (patch: Partial<AthleteProfile>) => void;
  setSettings: (settings: AppSettings) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  addMeasurement: (measurement: Measurement) => void;
  removeMeasurement: (id: string) => void;
  setMeasurements: (measurements: Measurement[]) => void;
  addRecord: (record: PersonalRecord) => void;
  setRecords: (records: PersonalRecord[]) => void;
  setStats: (stats: WorkoutStats) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

const defaultProfile: AthleteProfile = {
  id: "athlete-local",
  name: "Atleta",
  unit: "kg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSettings: AppSettings = {
  theme: "system",
  showRir: true,
  showRpe: true,
  prCelebration: true,
  firstRunCompleted: false,
  equipmentProfile: {
    barWeight: 20,
    availablePlates: [25, 20, 15, 10, 5, 2.5, 1.25],
  },
};

const defaultStats: WorkoutStats = {
  weeklySessions: 0,
  monthlySessions: 0,
  weeklyVolume: 0,
  monthlyVolume: 0,
  totalMinutes: 0,
  recentRecords: [],
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      settings: defaultSettings,
      measurements: [],
      records: [],
      stats: defaultStats,
      hydrated: false,

      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((state) => ({
          profile: { ...state.profile, ...patch, updatedAt: new Date().toISOString() },
        })),
      setSettings: (settings) => set({ settings }),
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
      addMeasurement: (measurement) =>
        set((state) => ({ measurements: [measurement, ...state.measurements] })),
      removeMeasurement: (id) =>
        set((state) => ({
          measurements: state.measurements.filter((m) => m.id !== id),
        })),
      addRecord: (record) =>
        set((state) => ({ records: [record, ...state.records] })),
      setRecords: (records) => set({ records }),
      setStats: (stats) => set({ stats }),
      setMeasurements: (measurements) => set({ measurements }),
      setHydrated: (hydrated) => set({ hydrated }),
      reset: () =>
        set({
          profile: defaultProfile,
          settings: defaultSettings,
          measurements: [],
          records: [],
          stats: defaultStats,
        }),
    }),
    {
      name: "forgefit-profile",
      storage: createJSONStorage(() => secureStoreWrapper),
      partialize: (state) => ({
        profile: state.profile,
        settings: state.settings,
        measurements: state.measurements,
        records: state.records,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);