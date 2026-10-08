import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./RootNavigator";
import { TabsParamList } from "./MainTabs";
import { WorkoutStackParamList } from "./WorkoutStack";
import { RoutineStackParamList } from "./RoutineStack";
import { ExerciseStackParamList } from "./ExerciseStack";

// Hook for root navigator (used in _layout.tsx)
export const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();

// Hook for tabs (used in tab screens like HomeScreen)
export const useTabsNavigation = () => useNavigation<NavigationProp<TabsParamList>>();

// Hook for workout stack
export const useWorkoutNavigation = () => useNavigation<NavigationProp<WorkoutStackParamList>>();

// Hook for routine stack
export const useRoutineNavigation = () => useNavigation<NavigationProp<RoutineStackParamList>>();

// Hook for exercise stack
export const useExerciseNavigation = () => useNavigation<NavigationProp<ExerciseStackParamList>>();

export type RootNavigationProp = NavigationProp<RootStackParamList>;
