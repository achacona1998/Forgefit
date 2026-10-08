import type { EquipmentProfile } from "../types/fitness";

export interface PlateResult {
  plates: { weight: number; count: number; side: "left" | "right" }[];
  totalWeight: number;
  difference: number;
}

export function calculatePlates(
  targetWeight: number,
  equipment: EquipmentProfile = { barWeight: 20, availablePlates: [25, 20, 15, 10, 5, 2.5, 1.25] }
): PlateResult {
  const platesPerSide = (targetWeight - equipment.barWeight) / 2;
  if (platesPerSide <= 0) {
    return { plates: [], totalWeight: equipment.barWeight, difference: targetWeight - equipment.barWeight };
  }

  const result: PlateResult["plates"] = [];
  let remaining = platesPerSide;

  for (const plate of equipment.availablePlates.sort((a, b) => b - a)) {
    const count = Math.floor(remaining / plate);
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        result.push({ weight: plate, count: 1, side: "left" });
        result.push({ weight: plate, count: 1, side: "right" });
      }
      remaining -= count * plate;
    }
  }

  const calculatedWeight = equipment.barWeight + result.reduce((sum, p) => sum + p.weight, 0);
  return { plates: result, totalWeight: calculatedWeight, difference: targetWeight - calculatedWeight };
}

export function formatPlateOutput(result: PlateResult): string {
  const sides = { left: [] as string[], right: [] as string[] };
  result.plates.forEach((p) => sides[p.side].push(`${p.weight}kg`));

  return `
Barra: ${result.totalWeight - result.plates.reduce((s, p) => s + p.weight, 0)} kg
Izquierda: ${sides.left.join(" + ") || "—"}
Derecha: ${sides.right.join(" + ") || "—"}
Total: ${result.totalWeight.toFixed(1)} kg (dif: ${result.difference >= 0 ? "+" : ""}${result.difference.toFixed(1)} kg)
  `.trim();
}