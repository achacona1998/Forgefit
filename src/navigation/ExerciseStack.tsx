import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExerciseDetailScreen from "../screens/exercise/ExerciseDetailScreen";
import ExerciseListScreen from "../screens/exercise/ExerciseListScreen";
import CreateExerciseScreen from "../screens/exercise/CreateExerciseScreen";

export type ExerciseStackParamList = {
  ExerciseDetail: { exerciseId: string };
  ExerciseList: undefined;
  CreateExercise: undefined;
};

const Stack = createNativeStackNavigator<ExerciseStackParamList>();

export function ExerciseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
      <Stack.Screen name="CreateExercise" component={CreateExerciseScreen} />
    </Stack.Navigator>
  );
}