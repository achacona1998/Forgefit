import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutDetailScreen from "../screens/workout/WorkoutDetailScreen";
import WorkoutTimerScreen from "../screens/workout/WorkoutTimerScreen";
import WorkoutHistoryScreen from "../screens/workout/WorkoutHistoryScreen";

export type WorkoutStackParamList = {
  WorkoutDetail: { sessionId: string };
  WorkoutTimer: { sessionId: string; exerciseId: string };
  WorkoutHistory: undefined;
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export function WorkoutStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <Stack.Screen name="WorkoutTimer" component={WorkoutTimerScreen} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
    </Stack.Navigator>
  );
}