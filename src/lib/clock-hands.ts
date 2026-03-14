export interface ClockHandStyle {
  id: string;
  name: string;
  description: string;
  productImage: string;
  variants: Record<string, string>;
  hourHandPath: string;
  minuteHandPath: string;
  secondHandPath?: string;
  priceModifier: number;
}

/**
 * All hand paths are designed with center at (0,0), pointing UP (negative Y).
 * Hour hands are shorter/wider, minute hands are longer/thinner.
 * Scale factor of ~1 = hands span roughly 40-60px in default size.
 *
 * Each style also carries:
 *   - productImage: default transparent PNG from /hands/ for the selector UI
 *   - variants: colour variants with real product photos
 */

export const HAND_STYLES: ClockHandStyle[] = [
  {
    id: "spade",
    name: "Spade",
    description: "Traditional spade-tip hands",
    productImage: "/hands/spade-black.png",
    variants: {
      black: "/hands/spade-black.png",
      gold: "/hands/spade-gold.png",
      silver: "/hands/spade-silver.png",
    },
    hourHandPath:
      "M -3 4 L -3 -18 L -5.5 -24 L 0 -34 L 5.5 -24 L 3 -18 L 3 4 Z",
    minuteHandPath:
      "M -2 4 L -2 -28 L -4 -34 L 0 -46 L 4 -34 L 2 -28 L 2 4 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 0,
  },
  {
    id: "ornate",
    name: "Ornate",
    description: "Elegant decorative hands",
    productImage: "/hands/ornate-black.png",
    variants: {
      black: "/hands/ornate-black.png",
      gold: "/hands/ornate-gold.png",
    },
    hourHandPath:
      "M -1 4 C -1 0, -4 -4, -5 -10 C -6 -16, -3 -20, -4 -24 L -6 -26 L 0 -34 L 6 -26 L 4 -24 C 3 -20, 6 -16, 5 -10 C 4 -4, 1 0, 1 4 Z",
    minuteHandPath:
      "M -0.8 4 C -0.8 -2, -3.5 -8, -4 -16 C -4.5 -24, -2 -30, -3 -34 L -5 -36 L 0 -46 L 5 -36 L 3 -34 C 2 -30, 4.5 -24, 4 -16 C 3.5 -8, 0.8 -2, 0.8 4 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 2,
  },
  {
    id: "serpentine",
    name: "Serpentine",
    description: "Curved S-shaped hands",
    productImage: "/hands/serpentine-black.png",
    variants: {
      black: "/hands/serpentine-black.png",
    },
    hourHandPath:
      "M -1 4 C -1 -4, -5 -10, -4 -18 C -3 -24, 3 -26, 2 -30 L 0 -34 L -2 -30 C -3 -26, 3 -24, 4 -18 C 5 -10, 1 -4, 1 4 Z",
    minuteHandPath:
      "M -0.8 4 C -0.8 -6, -4 -14, -3 -24 C -2 -32, 2 -36, 1.5 -42 L 0 -46 L -1.5 -42 C -2 -36, 2 -32, 3 -24 C 4 -14, 0.8 -6, 0.8 4 Z",
    secondHandPath: "M -0.4 8 L -0.4 -42 L 0.4 -42 L 0.4 8 Z",
    priceModifier: 3,
  },
  {
    id: "gothic",
    name: "Gothic",
    description: "Dark gothic style",
    productImage: "/hands/gothic-black.png",
    variants: {
      black: "/hands/gothic-black.png",
    },
    hourHandPath:
      "M 0 -34 L -4 -8 L -6 -6 L -4 -4 L -3 4 L 3 4 L 4 -4 L 6 -6 L 4 -8 Z",
    minuteHandPath:
      "M 0 -46 L -3 -12 L -5 -10 L -3 -8 L -2.5 4 L 2.5 4 L 3 -8 L 5 -10 L 3 -12 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 2,
  },
  {
    id: "baton",
    name: "Baton",
    description: "Clean modern baton hands",
    productImage: "/hands/baton-black.png",
    variants: {
      black: "/hands/baton-black.png",
      gold: "/hands/baton-gold.png",
    },
    hourHandPath:
      "M -2.2 4 L -2.2 -28 L -1.8 -32 L 0 -33 L 1.8 -32 L 2.2 -28 L 2.2 4 Z",
    minuteHandPath:
      "M -1.5 4 L -1.5 -40 L -1.2 -44 L 0 -45 L 1.2 -44 L 1.5 -40 L 1.5 4 Z",
    secondHandPath: "M -0.3 8 L -0.3 -44 L 0.3 -44 L 0.3 8 Z",
    priceModifier: 0,
  },
  {
    id: "pointed",
    name: "Pointed",
    description: "Sleek pointed tips",
    productImage: "/hands/pointed-black.png",
    variants: {
      black: "/hands/pointed-black.png",
      gold: "/hands/pointed-gold.png",
    },
    hourHandPath:
      "M -3 4 L -3.5 -4 L -2.5 -26 L 0 -34 L 2.5 -26 L 3.5 -4 L 3 4 Z",
    minuteHandPath:
      "M -2 4 L -2.5 -6 L -1.8 -38 L 0 -46 L 1.8 -38 L 2.5 -6 L 2 4 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 0,
  },
  {
    id: "vienna",
    name: "Vienna",
    description: "Classical Vienna regulator style",
    productImage: "/hands/vienna-brass.png",
    variants: {
      brass: "/hands/vienna-brass.png",
    },
    hourHandPath:
      "M -2 4 L -2 -10 L -4.5 -12 L -4.5 -18 L -2 -20 L -3 -26 L 0 -34 L 3 -26 L 2 -20 L 4.5 -18 L 4.5 -12 L 2 -10 L 2 4 Z",
    minuteHandPath:
      "M -1.5 4 L -1.5 -14 L -3.5 -16 L -3.5 -24 L -1.5 -26 L -2.5 -36 L 0 -46 L 2.5 -36 L 1.5 -26 L 3.5 -24 L 3.5 -16 L 1.5 -14 L 1.5 4 Z",
    secondHandPath: "M -0.4 8 L -0.4 -42 L 0.4 -42 L 0.4 8 Z",
    priceModifier: 3,
  },
  {
    id: "cathedral",
    name: "Cathedral",
    description: "Gothic cathedral window cutouts",
    productImage: "/hands/cathedral-black.png",
    variants: {
      black: "/hands/cathedral-black.png",
    },
    hourHandPath:
      "M -3.5 4 L -3.5 -10 L -5 -16 L -3 -22 L -4 -26 L 0 -34 L 4 -26 L 3 -22 L 5 -16 L 3.5 -10 L 3.5 4 Z M -1.5 -12 L -1.5 -20 L 0 -24 L 1.5 -20 L 1.5 -12 Z",
    minuteHandPath:
      "M -2.5 4 L -2.5 -14 L -4 -22 L -2.5 -30 L -3.5 -36 L 0 -46 L 3.5 -36 L 2.5 -30 L 4 -22 L 2.5 -14 L 2.5 4 Z M -1 -16 L -1 -28 L 0 -32 L 1 -28 L 1 -16 Z",
    secondHandPath: "M -0.5 8 L -0.5 -42 L 0.5 -42 L 0.5 8 Z",
    priceModifier: 4,
  },
];

// Keep backward-compatible alias
export const CLOCK_HAND_STYLES = HAND_STYLES;

export const HAND_COLORS = [
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "gold", name: "Gold", hex: "#C5A572" },
  { id: "brass", name: "Brass", hex: "#B5893B" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
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
