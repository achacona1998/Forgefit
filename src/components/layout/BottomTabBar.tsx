import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  Home,
  Dumbbell,
  ListTodo,
  BookOpen,
  TrendingUp,
  Ruler,
  Trophy,
  Calendar,
  Settings,
  LayoutDashboard,
} from "lucide-react-native";
import { usePalette } from "../../components/ui";
import { hapticLight } from "../../utils/haptics";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const tabConfig = [
  { name: "Home", label: "Inicio", icon: Home, focusedIcon: LayoutDashboard },
  { name: "Train", label: "Entrenar", icon: Dumbbell, focusedIcon: Dumbbell },
  { name: "Routine", label: "Rutina", icon: ListTodo, focusedIcon: ListTodo },
  { name: "Library", label: "Biblioteca", icon: BookOpen, focusedIcon: BookOpen },
  { name: "Progress", label: "Progreso", icon: TrendingUp, focusedIcon: TrendingUp },
  { name: "Measurements", label: "Medidas", icon: Ruler, focusedIcon: Ruler },
  { name: "PRs", label: "PRs", icon: Trophy, focusedIcon: Trophy },
  { name: "Calendar", label: "Calendario", icon: Calendar, focusedIcon: Calendar },
  { name: "Settings", label: "Ajustes", icon: Settings, focusedIcon: Settings },
] as const;

type TabsParamList = {
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

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const palette = usePalette();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
      ]}
    >
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const routeName = route.name as keyof TabsParamList;
          const config = tabConfig.find((t) => t.name === routeName);
          const Icon = config?.icon ?? Home;
          const FocusedIcon = config?.focusedIcon ?? Home;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              hapticLight();
              navigation.navigate(routeName);
            }
          };

          const activeColor = palette.lime;
          const inactiveColor = palette.muted;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={config?.label}
            >
              <View
                style={[
                  styles.tabInner,
                  isFocused && {
                    backgroundColor: palette.limeSoft,
                    borderRadius: 9999,
                    paddingHorizontal: 16,
                  },
                ]}
              >
                <Icon
                  size={isFocused ? 24 : 22}
                  color={isFocused ? activeColor : inactiveColor}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused ? activeColor : inactiveColor,
                      fontWeight: isFocused ? "900" : "700",
                    },
                  ]}
                >
                  {config?.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    paddingBottom: 24,
  },
  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 4,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});