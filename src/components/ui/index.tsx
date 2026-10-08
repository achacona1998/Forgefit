// Declaration merging for boxShadow in StyleSheet
declare module 'react-native' {
  interface ViewStyle {
    boxShadow?: string;
  }
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { usePalette } from "../../context/PaletteContext";

export { usePalette } from "../../context/PaletteContext";

export function Logo({
  width = 32,
  height = 32,
}: {
  width?: number;
  height?: number;
}) {
  const palette = usePalette();
  return (
    <View style={{ width, height }}>
      <Text style={{ fontSize: 24, fontWeight: "900", color: palette.lime }}>F</Text>
    </View>
  );
}

export function AppCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = usePalette();
  return <View style={[{ ...styles.card, backgroundColor: palette.surface, borderColor: palette.border }, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const palette = usePalette();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}>
          <Text style={[styles.textActionLabel, { color: palette.lime }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon = "arrow-forward",
  variant = "lime",
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  variant?: "lime" | "ghost" | "blue" | "danger";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = usePalette();
  const variantStyle =
    variant === "ghost"
      ? styles.buttonGhost
      : variant === "blue"
        ? styles.buttonBlue
        : variant === "danger"
          ? styles.buttonDanger
          : styles.buttonLime;
  const textStyle =
    variant === "ghost"
      ? styles.buttonGhostText
      : variant === "lime"
        ? styles.buttonLimeText
        : styles.buttonDarkText;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        { backgroundColor: variant === "ghost" ? "transparent" : palette.lime },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[{ ...textStyle, color: variant === "ghost" ? palette.text : palette.bg }]}>{label}</Text>
      <MaterialIcons name={icon} size={19} color={variant === "ghost" ? palette.text : palette.bg} />
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  accent = false,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  label?: string;
  accent?: boolean;
}) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        accent && styles.iconButtonAccent,
        { backgroundColor: accent ? palette.lime : palette.surfaceAlt, borderColor: accent ? palette.lime : palette.border },
        pressed && styles.pressed,
      ]}>
      <MaterialIcons name={icon} size={20} color={accent ? palette.bg : palette.text} />
    </Pressable>
  );
}

export function Metric({
  label,
  value,
  detail,
  tone = "lime",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "lime" | "blue" | "white";
}) {
  const palette = usePalette();
  const valueColor = tone === "blue" ? palette.blue : tone === "white" ? palette.text : palette.lime;
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricLabel, { color: palette.muted }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: valueColor }]}>{value}</Text>
      {detail ? <Text style={[styles.metricDetail, { color: palette.muted }]}>{detail}</Text> : null}
    </View>
  );
}

export function Chip({
  label,
  tone = "neutral",
  onPress,
  style,
}: {
  label: string;
  tone?: "neutral" | "lime" | "blue" | "success" | "warning";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = usePalette();
  const chipStyle =
    tone === "lime"
      ? styles.chipLime
      : tone === "blue"
        ? styles.chipBlue
        : tone === "success"
          ? styles.chipSuccess
          : tone === "warning"
            ? styles.chipWarning
            : styles.chip;
  const textStyle =
    tone === "lime"
      ? styles.chipTextLime
      : tone === "blue"
        ? styles.chipTextBlue
        : tone === "success"
          ? styles.chipTextSuccess
          : tone === "warning"
            ? styles.chipTextWarning
            : styles.chipText;
  return (
    <Pressable
      onPress={onPress}
      style={[{ ...styles.chip, ...chipStyle, backgroundColor: tone === "lime" ? palette.limeSoft : tone === "blue" ? palette.blueSoft : tone === "success" ? "#143426" : tone === "warning" ? "#3D3013" : palette.surfaceAlt }, style]}
    >
      <Text style={[{ ...textStyle, color: tone === "lime" ? palette.lime : tone === "blue" ? palette.blue : tone === "success" ? palette.success : tone === "warning" ? palette.warning : palette.muted }]}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  detail,
  children,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  detail: string;
  children?: ReactNode;
}) {
  const palette = usePalette();
  return (
    <View style={[{ ...styles.emptyState, backgroundColor: palette.surface }]}>
      <View style={[{ ...styles.emptyIcon, backgroundColor: palette.limeSoft }]}>
        <MaterialIcons name={icon} color={palette.lime} size={28} />
      </View>
      <Text style={[{ ...styles.emptyTitle, color: palette.text }]}>{title}</Text>
      <Text style={[{ ...styles.emptyDetail, color: palette.muted }]}>{detail}</Text>
      {children ? <View style={styles.emptyAction}>{children}</View> : null}
    </View>
  );
}

export function AppInput({
  label,
  isFocused: externalIsFocused,
  ...props
}: { label?: string; isFocused?: boolean } & TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const palette = usePalette();
  return (
    <View style={[{ ...styles.inputGroup, gap: 6 }]}>
      {label ? <Text style={[{ ...styles.inputLabel, color: palette.muted }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={palette.muted}
        style={[
          {
            ...styles.input,
            backgroundColor: palette.surfaceAlt,
            borderColor: palette.border,
            color: palette.text,
          },
          (isFocused || externalIsFocused) && styles.inputFocused,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
}

export function NumberStep({
  value,
  onChange,
  step = 1,
  min = 0,
  suffix = "",
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  const palette = usePalette();
  return (
    <View style={[{ ...styles.stepper, gap: 9 }]}>
      <Pressable
        onPress={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
        style={({ pressed }) => [{ ...styles.stepButton, backgroundColor: palette.surfaceAlt, borderColor: palette.border }, pressed && styles.pressed]}>
        <MaterialIcons name="remove" size={18} color={palette.text} />
      </Pressable>
      <Text style={[{ ...styles.stepValue, color: palette.text }]}>
        {value}
        {suffix}
      </Text>
      <Pressable
        onPress={() => onChange(Math.round((value + step) * 100) / 100)}
        style={({ pressed }) => [{ ...styles.stepButton, ...styles.stepButtonPlus, backgroundColor: palette.lime, borderColor: palette.lime }, pressed && styles.pressed]}>
        <MaterialIcons name="add" size={18} color={palette.bg} />
      </Pressable>
    </View>
  );
}

export function LoadingScreen() {
  const palette = usePalette();
  return (
    <View style={[{ ...styles.loading, backgroundColor: palette.bg }]}>
      <Logo width={64} height={64} />
      <ActivityIndicator size="large" color={palette.lime} style={{ marginTop: 24 }} />
      <Text style={[{ ...styles.loadingText, color: palette.muted }]}>Cargando tu diario local…</Text>
      <Text style={[{ ...styles.attributionText, color: palette.muted }]}>Creado por achadev</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  textAction: { paddingVertical: 5, paddingLeft: 12 },
  textActionLabel: { fontSize: 13, fontWeight: "800" },
  button: {
    minHeight: 48,
    borderRadius: 15,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  buttonLime: { backgroundColor: "#37BB54" },
  buttonBlue: { backgroundColor: "#133875" },
  buttonDanger: { backgroundColor: "#FF6B6B" },
  buttonGhost: { backgroundColor: "transparent", borderWidth: 1 },
  buttonLimeText: { color: "#0A0F14", fontWeight: "900", fontSize: 14 },
  buttonDarkText: { color: "#0A0F14", fontWeight: "900", fontSize: 14 },
  buttonGhostText: { fontWeight: "800", fontSize: 14 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  iconButtonAccent: { backgroundColor: "#37BB54", borderColor: "#37BB54" },
  metric: { flex: 1, gap: 3 },
  metricLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    fontWeight: "800",
  },
  metricValue: { fontSize: 24, fontWeight: "900", letterSpacing: -0.8 },
  metricDetail: { fontSize: 11 },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipLime: { backgroundColor: "#133875" },
  chipBlue: { backgroundColor: "#123044" },
  chipSuccess: { backgroundColor: "#143426" },
  chipWarning: { backgroundColor: "#3D3013" },
  chipText: { fontSize: 11, fontWeight: "800" },
  chipTextLime: { color: "#37BB54", fontSize: 11, fontWeight: "800" },
  chipTextBlue: { color: "#133875", fontSize: 11, fontWeight: "800" },
  chipTextSuccess: { color: "#37BB54", fontSize: 11, fontWeight: "800" },
  chipTextWarning: { color: "#FFC857", fontSize: 11, fontWeight: "800" },
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 18,
  },
  emptyIcon: {
    height: 64,
    width: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    boxShadow: "0 4px 8px rgba(55, 187, 84, 0.2)",
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  emptyDetail: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 20,
  },
  emptyAction: { width: "100%", marginTop: 18 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: "800" },
  input: {
    minHeight: 48,
    fontSize: 15,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  inputFocused: {
    borderColor: "#37BB54",
    backgroundColor: "#121A22",
    boxShadow: "0 0 8px rgba(55, 187, 84, 0.15)",
    elevation: 2,
  },
  stepper: { flexDirection: "row", alignItems: "center", gap: 9 },
  stepButton: {
    height: 32,
    width: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  stepButtonPlus: { backgroundColor: "#37BB54", borderColor: "#37BB54" },
  stepValue: {
    minWidth: 42,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  loadingText: { fontSize: 14, fontWeight: "600" },
  attributionText: {
    fontSize: 12,
    position: "absolute",
    bottom: 40,
    opacity: 0.5,
  },
});