const primary = "#0D9488";
const primaryDark = "#0F766E";
const primaryLight = "#2DD4BF";
const accent = "#F59E0B";
const danger = "#DC2626";
const safe = "#16A34A";
const surface = "#F4FAF8";

// Premium Medical Dark Mode Palette
const DARK_BG = "#06231D";
const DARK_CARD = "#0B352B";
const DARK_CARD_ELEVATED = "#123C31";
const DARK_BORDER = "#1D5243";
const DARK_TEXT = "#FFFFFF";
const DARK_TEXT_SECONDARY = "#C9E8DF";
const DARK_TEXT_MUTED = "#83ACA1";
const DARK_INPUT_BG = "#041B16";
const DARK_PILL_BG = "#041B16";
const DARK_ACCENT_RED = "#FF4C60";
const DARK_ACCENT_MINT = "#00B48A";
const DARK_HEADER_BG = "#041B16";
const DARK_TAB_BAR = "#06231D";
const DARK_TAB_BORDER = "#14362C";

export const DarkTheme = {
  bg: DARK_BG,
  card: DARK_CARD,
  cardElevated: DARK_CARD_ELEVATED,
  border: DARK_BORDER,
  text: DARK_TEXT,
  textSecondary: DARK_TEXT_SECONDARY,
  textMuted: DARK_TEXT_MUTED,
  inputBg: DARK_INPUT_BG,
  pillBg: DARK_PILL_BG,
  accentRed: DARK_ACCENT_RED,
  accentMint: DARK_ACCENT_MINT,
  headerBg: DARK_HEADER_BG,
  tabBar: DARK_TAB_BAR,
  tabBorder: DARK_TAB_BORDER,
  tint: primary,
  tintDark: primaryDark,
  tintLight: primaryLight,
};

export const LightTheme = {
  bg: surface,
  card: "#FFFFFF",
  cardElevated: "#FFFFFF",
  border: "#E4EDF4",
  text: "#0A1628",
  textSecondary: "#374B5C",
  textMuted: "#7A95AA",
  inputBg: "#EBF5FB",
  pillBg: "#EBF5FB",
  accentRed: "#DC2626",
  accentMint: "#0D9488",
  headerBg: "#FFFFFF",
  tabBar: "#FFFFFF",
  tabBorder: "#E4EDF4",
  tint: primary,
  tintDark: primaryDark,
  tintLight: primaryLight,
};

export default {
  light: {
    text: "#0A1628",
    textSecondary: "#374B5C",
    textMuted: "#7A95AA",
    background: surface,
    backgroundSecondary: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E4EDF4",
    tint: primary,
    tintDark: primaryDark,
    tintLight: primaryLight,
    accent,
    danger,
    safe,
    tabIconDefault: "#94A8B8",
    tabIconSelected: primary,

    categoryColors: {
      analgesic: "#7C3AED",
      sedative: "#1D4ED8",
      inotrope: "#7C3AED",
      antibiotic: "#047857",
      antiepileptic: "#B45309",
      emergency: "#6366F1",
      fluid: "#0D9488",
      respiratory: "#0D9488",
      cardiovascular: "#7C3AED",
      antifungal: "#475569",
      steroid: "#C2410C",
      vitamin: "#15803D",
    },
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#C9E8DF",
    textMuted: "#83ACA1",
    background: "#06231D",
    backgroundSecondary: "#041B16",
    card: "#0B352B",
    border: "#1D5243",
    tint: "#00B48A",
    tintDark: "#059669",
    tintLight: "#34D399",
    accent: "#F59E0B",
    danger: "#FF4C60",
    safe: "#34D399",
    tabIconDefault: "#5A7094",
    tabIconSelected: "#00B48A",

    categoryColors: {
      analgesic: "#7C3AED",
      sedative: "#6366F1",
      inotrope: "#7C3AED",
      antibiotic: "#34D399",
      antiepileptic: "#FBBF24",
      emergency: "#6366F1",
      fluid: "#00B48A",
      respiratory: "#2DD4BF",
      cardiovascular: "#7C3AED",
      antifungal: "#94A3B8",
      steroid: "#FB923C",
      vitamin: "#34D399",
    },
  },
};
