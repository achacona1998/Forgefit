import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoutineBuilderScreen from "../screens/routine/RoutineBuilderScreen";
import RoutineDetailScreen from "../screens/routine/RoutineDetailScreen";
import RoutineListScreen from "../screens/routine/RoutineListScreen";

export type RoutineStackParamList = {
  RoutineBuilder: { routineId?: string };
  RoutineDetail: { routineId: string };
  RoutineList: undefined;
};

const Stack = createNativeStackNavigator<RoutineStackParamList>();

export function RoutineStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoutineBuilder" component={RoutineBuilderScreen} />
      <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
      <Stack.Screen name="RoutineList" component={RoutineListScreen} />
    </Stack.Navigator>
  );
}