export interface ClockHandStyle {
  id: string;
  name: string;
  description: string;
  hourHandPath: string;
  minuteHandPath: string;
  secondHandPath?: string;
  priceModifier: number;
}

/**
 * All hand paths are designed with center at (0,0), pointing UP (negative Y).
 * Hour hands are shorter/wider, minute hands are longer/thinner.
 * Scale factor of ~1 = hands span roughly 40-60px in default size.
 */

export const CLOCK_HAND_STYLES: ClockHandStyle[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Simple tapered hands — clean and timeless",
    // Tapered rectangle: wide at base, narrow at tip
    hourHandPath: "M -3.5 4 L -2.5 -28 L 0 -32 L 2.5 -28 L 3.5 4 Z",
    minuteHandPath: "M -2.5 4 L -1.5 -38 L 0 -44 L 1.5 -38 L 2.5 4 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 0,
  },
  {
    id: "spade",
    name: "Spade",
    description: "Traditional spade-tip hands — a heritage favourite",
    // Rectangle body with diamond/spade tip
    hourHandPath:
      "M -3 4 L -3 -18 L -5.5 -24 L 0 -34 L 5.5 -24 L 3 -18 L 3 4 Z",
    minuteHandPath:
      "M -2 4 L -2 -28 L -4 -34 L 0 -46 L 4 -34 L 2 -28 L 2 4 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 2,
  },
  {
    id: "serpentine",
    name: "Serpentine",
    description: "S-curved elegant hands — ornate and graceful",
    // Curved S-shape using cubic beziers
    hourHandPath:
      "M -1 4 C -1 -4, -5 -10, -4 -18 C -3 -24, 3 -26, 2 -30 L 0 -34 L -2 -30 C -3 -26, 3 -24, 4 -18 C 5 -10, 1 -4, 1 4 Z",
    minuteHandPath:
      "M -0.8 4 C -0.8 -6, -4 -14, -3 -24 C -2 -32, 2 -36, 1.5 -42 L 0 -46 L -1.5 -42 C -2 -36, 2 -32, 3 -24 C 4 -14, 0.8 -6, 0.8 4 Z",
    secondHandPath: "M -0.4 8 L -0.4 -42 L 0.4 -42 L 0.4 8 Z",
    priceModifier: 3,
  },
  {
    id: "sword",
    name: "Sword",
    description: "Pointed sword-style hands — bold and striking",
    // Triangular sword blade with crossguard
    hourHandPath:
      "M 0 -34 L -4 -8 L -6 -6 L -4 -4 L -3 4 L 3 4 L 4 -4 L 6 -6 L 4 -8 Z",
    minuteHandPath:
      "M 0 -46 L -3 -12 L -5 -10 L -3 -8 L -2.5 4 L 2.5 4 L 3 -8 L 5 -10 L 3 -12 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 2,
  },
  {
    id: "cathedral",
    name: "Cathedral",
    description: "Gothic cathedral window hands — intricate and dramatic",
    // Gothic arch shape with internal cutout feel
    hourHandPath:
      "M -3.5 4 L -3.5 -10 L -5 -16 L -3 -22 L -4 -26 L 0 -34 L 4 -26 L 3 -22 L 5 -16 L 3.5 -10 L 3.5 4 Z M -1.5 -12 L -1.5 -20 L 0 -24 L 1.5 -20 L 1.5 -12 Z",
    minuteHandPath:
      "M -2.5 4 L -2.5 -14 L -4 -22 L -2.5 -30 L -3.5 -36 L 0 -46 L 3.5 -36 L 2.5 -30 L 4 -22 L 2.5 -14 L 2.5 4 Z M -1 -16 L -1 -28 L 0 -32 L 1 -28 L 1 -16 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 5,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Thin minimalist lines — sleek and contemporary",
    // Very thin line with small circle/diamond at tip
    hourHandPath:
      "M -1.5 4 L -1.5 -28 L -3 -30 L 0 -34 L 3 -30 L 1.5 -28 L 1.5 4 Z",
    minuteHandPath:
      "M -1 4 L -1 -40 L -2 -42 L 0 -46 L 2 -42 L 1 -40 L 1 4 Z",
    secondHandPath: "M -0.3 8 L -0.3 -44 L 0.3 -44 L 0.3 8 Z",
    priceModifier: 0,
  },
];

export const HAND_COLORS = [
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "gold", name: "Gold", hex: "#C5A572" },
  { id: "brass", name: "Brass", hex: "#B5893B" },
  { id: "white", name: "White", hex: "#F5F5F5" },
  { id: "rose-gold", name: "Rose Gold", hex: "#B76E79" },
];

export const HAND_SIZES = [
  { id: "small" as const, name: "Small", scale: 0.7 },
  { id: "medium" as const, name: "Medium", scale: 1.0 },
  { id: "large" as const, name: "Large", scale: 1.3 },
];

export type MarkerStyle = "none" | "dots" | "roman" | "arabic";

export const MARKER_STYLES: { id: MarkerStyle; name: string }[] = [
  { id: "none", name: "None" },
  { id: "dots", name: "Dots" },
  { id: "roman", name: "Roman" },
  { id: "arabic", name: "Arabic" },
];

// Roman numeral labels for clock positions (12, 1, 2, ... 11)
export const ROMAN_NUMERALS = [
  "XII", "I", "II", "III", "IV", "V",
  "VI", "VII", "VIII", "IX", "X", "XI",
];

export const ARABIC_NUMBERS = [
  "12", "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "10", "11",
];
