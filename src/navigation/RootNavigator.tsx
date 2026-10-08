import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabs, TabsParamList } from "./MainTabs";
import { WorkoutStack, WorkoutStackParamList } from "./WorkoutStack";
import { RoutineStack, RoutineStackParamList } from "./RoutineStack";
import { ExerciseStack, ExerciseStackParamList } from "./ExerciseStack";

export type RootStackParamList = {
  MainTabs: { screen: keyof TabsParamList; params: TabsParamList[keyof TabsParamList] } | undefined;
  Workout: { screen: keyof WorkoutStackParamList; params: WorkoutStackParamList[keyof WorkoutStackParamList] } | undefined;
  Routine: { screen: keyof RoutineStackParamList; params: RoutineStackParamList[keyof RoutineStackParamList] } | undefined;
  Exercise: { screen: keyof ExerciseStackParamList; params: ExerciseStackParamList[keyof ExerciseStackParamList] } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Workout" component={WorkoutStack} />
        <Stack.Screen name="Routine" component={RoutineStack} />
        <Stack.Screen name="Exercise" component={ExerciseStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}