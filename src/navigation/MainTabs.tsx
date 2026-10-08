import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/tabs/HomeScreen";
import TrainScreen from "../screens/tabs/TrainScreen";
import RoutineScreen from "../screens/tabs/RoutineScreen";
import LibraryScreen from "../screens/tabs/LibraryScreen";
import ProgressScreen from "../screens/tabs/ProgressScreen";
import MeasurementsScreen from "../screens/tabs/MeasurementsScreen";
import PRsScreen from "../screens/tabs/PRsScreen";
import CalendarScreen from "../screens/tabs/CalendarScreen";
import SettingsScreen from "../screens/tabs/SettingsScreen";
import { BottomTabBar } from "../components/layout/BottomTabBar";

export type TabsParamList = {
  Home: undefined;
  Train: undefined;
  Routine: undefined;
  Library: undefined;
  Progress: undefined;
  Measurements: undefined;
  PRs: undefined;
  Calendar: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Train" component={TrainScreen} />
      <Tab.Screen name="Routine" component={RoutineScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Measurements" component={MeasurementsScreen} />
      <Tab.Screen name="PRs" component={PRsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}