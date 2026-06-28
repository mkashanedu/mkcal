import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { useFavorites } from "@/context/FavoritesContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";
import { StarButton } from "@/components/StarButton";

const C = Colors.light;

// ─── WHO/CDC Weight-for-Age Centile Lookup ──────────────────────────────────
// [P3, P15, P50, P85, P97] in kg — approximate reference values
// WHO 0-24 months, CDC 2-18 years
const WHO_W_BOYS: Record<number, [number, number, number, number, number]> = {
  0: [2.5, 3.0, 3.5, 4.0, 4.4],
  3: [5.0, 5.7, 6.4, 7.2, 7.9],
  6: [6.4, 7.1, 7.9, 8.8, 9.7],
  9: [7.1, 8.0, 8.9, 9.9, 10.9],
  12: [7.7, 8.7, 9.6, 10.7, 11.5],
  18: [9.1, 10.2, 11.1, 12.3, 13.3],
  24: [10.4, 11.5, 12.5, 13.9, 15.0],
  36: [11.9, 13.3, 14.6, 16.3, 17.8],
  48: [13.0, 14.8, 16.3, 18.4, 20.2],
  60: [14.1, 16.2, 18.0, 20.7, 23.0],
  72: [15.3, 17.7, 19.8, 23.0, 25.6],
  84: [16.6, 19.2, 21.5, 25.3, 28.5],
  96: [18.0, 20.9, 23.6, 28.0, 32.0],
  108: [19.5, 22.9, 26.0, 31.2, 36.2],
  120: [21.3, 25.1, 28.9, 35.1, 41.2],
  144: [27.0, 32.0, 37.5, 46.0, 55.0],
  168: [39.0, 47.0, 56.0, 67.0, 78.0],
  192: [52.0, 63.0, 73.0, 85.0, 96.0],
  216: [58.0, 70.0, 80.0, 93.0, 104.0],
};
const WHO_W_GIRLS: Record<number, [number, number, number, number, number]> = {
  0: [2.4, 2.8, 3.2, 3.7, 4.2],
  3: [4.6, 5.2, 5.8, 6.6, 7.3],
  6: [6.0, 6.7, 7.3, 8.2, 9.1],
  9: [6.7, 7.5, 8.2, 9.2, 10.2],
  12: [7.1, 8.0, 8.9, 10.0, 11.0],
  18: [8.4, 9.4, 10.2, 11.6, 12.8],
  24: [9.8, 10.8, 11.9, 13.2, 14.4],
  36: [11.3, 12.7, 14.1, 15.9, 17.4],
  48: [12.6, 14.2, 15.8, 18.1, 20.1],
  60: [13.7, 15.6, 17.5, 20.4, 23.0],
  72: [14.9, 17.0, 19.2, 22.8, 26.0],
  84: [16.2, 18.7, 21.2, 25.6, 29.7],
  96: [17.6, 20.5, 23.6, 29.1, 34.3],
  108: [19.3, 22.8, 26.5, 33.2, 39.9],
  120: [21.5, 25.6, 30.0, 38.0, 46.4],
  144: [29.0, 35.5, 42.5, 54.0, 64.0],
  168: [42.0, 50.0, 58.0, 70.0, 80.0],
  192: [48.0, 56.0, 64.0, 76.0, 87.0],
  216: [49.0, 57.0, 65.0, 77.0, 88.0],
};

function findNearestAge(
  ageMonths: number,
  table: Record<number, [number, number, number, number, number]>
): [number, number, number, number, number] {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  let nearest = keys[0];
  for (const k of keys) {
    if (Math.abs(k - ageMonths) < Math.abs(nearest - ageMonths)) nearest = k;
  }
  return table[nearest];
}

function estimatePercentile(val: number, refs: [number, number, number, number, number]) {
  const [p3, p15, p50, p85, p97] = refs;

  // Z-score approximation: SD ≈ (P97 - P3) / (2 × 1.88)
  const sd = (p97 - p3) / (2 * 1.88);
  const zscore = sd > 0 ? (val - p50) / sd : 0;
  const zRounded = Math.round(zscore * 10) / 10;

  // WHO Nutritional Status classification
  let nutritionStatus: string;
  let nutritionColor: string;
  let samAlert = false;
  if (zscore < -3) {
    nutritionStatus = "Severe Acute Malnutrition (SAM)";
    nutritionColor = "#DC2626";
    samAlert = true;
  } else if (zscore < -2) {
    nutritionStatus = "Moderate Acute Malnutrition (MAM)";
    nutritionColor = "#D97706";
  } else if (zscore <= 2) {
    nutritionStatus = "Normal";
    nutritionColor = "#16A34A";
  } else if (zscore <= 3) {
    nutritionStatus = "Overweight";
    nutritionColor = "#D97706";
  } else {
    nutritionStatus = "Obese";
    nutritionColor = "#DC2626";
  }

  // Percentile band
  let label: string;
  let color: string;
  let note: string;
  if (val < p3) { label = "<3rd percentile"; color = "#DC2626"; note = "Significantly below expected weight for age"; }
  else if (val < p15) { label = "3rd–15th percentile"; color = "#D97706"; note = "Below average — monitor closely"; }
  else if (val < p50) { label = "15th–50th percentile"; color = "#16A34A"; note = "Low-normal range"; }
  else if (val < p85) { label = "50th–85th percentile"; color = "#16A34A"; note = "Normal range"; }
  else if (val < p97) { label = "85th–97th percentile"; color = "#D97706"; note = "Above average — assess for obesity risk"; }
  else { label = ">97th percentile"; color = "#DC2626"; note = "Obese range — clinical review recommended"; }

  return { label, color, note, zscore: zRounded, nutritionStatus, nutritionColor, samAlert };
}

// ─── VIS formula ──────────────────────────────────────────────────────────────
// Wernovsky et al. VIS = Dopa + Dobu + 100×Epi + 10×Milrinone + 10000×Vaso + 100×Norepi
function calcVIS(d: { dopa: string; dobu: string; epi: string; mil: string; vaso: string; norepi: string }) {
  const dopa = parseFloat(d.dopa) || 0;
  const dobu = parseFloat(d.dobu) || 0;
  const epi = parseFloat(d.epi) || 0;
  const mil = parseFloat(d.mil) || 0;
  const vaso = parseFloat(d.vaso) || 0;
  const norepi = parseFloat(d.norepi) || 0;
  return +(dopa + dobu + 100 * epi + 10 * mil + 10000 * vaso + 100 * norepi).toFixed(1);
}

function visInterpret(vis: number) {
  if (vis === 0) return { label: "No vasoactive support", color: "#16A34A" };
  if (vis <= 10) return { label: "Low vasoactive support", color: "#16A34A" };
  if (vis <= 20) return { label: "Moderate support", color: "#D97706" };
  if (vis <= 30) return { label: "High support", color: "#EA580C" };
  return { label: "Very high — critical haemodynamic compromise", color: "#DC2626" };
}

// ─── Holliday-Segar ───────────────────────────────────────────────────────────
function hollidaySegar(wt: number) {
  let daily = 0;
  if (wt <= 10) daily = 100 * wt;
  else if (wt <= 20) daily = 1000 + 50 * (wt - 10);
  else daily = 1500 + 20 * (wt - 20);
  return { daily: Math.round(daily), hourly: +(daily / 24).toFixed(1) };
}

// ─── pGCS options ──────────────────────────────────────────────────────────────
const EYE_OPTIONS = [
  { val: 4, label: "4 — Spontaneous" },
  { val: 3, label: "3 — To voice" },
  { val: 2, label: "2 — To pain" },
  { val: 1, label: "1 — None" },
];
const VERBAL_OPTIONS = [
  { val: 5, label: "5 — Alert / Babbling / Oriented words" },
  { val: 4, label: "4 — Confused / Less than usual words" },
  { val: 3, label: "3 — Inappropriate words / Cries to pain" },
  { val: 2, label: "2 — Incomprehensible / Moans to pain" },
  { val: 1, label: "1 — None" },
];
const MOTOR_OPTIONS = [
  { val: 6, label: "6 — Obeys commands / Normal spontaneous" },
  { val: 5, label: "5 — Localises pain" },
  { val: 4, label: "4 — Withdraws to pain" },
  { val: 3, label: "3 — Abnormal flexion (Decorticate)" },
  { val: 2, label: "2 — Extension (Decerebrate)" },
  { val: 1, label: "1 — None" },
];

function gcsInterpret(total: number) {
  if (total >= 14) return { label: "Mild impairment", color: "#16A34A" };
  if (total >= 9) return { label: "Moderate impairment", color: "#D97706" };
  return { label: "Severe impairment — consider intubation if GCS ≤8", color: "#DC2626" };
}

// ─── Normal Vitals by Age ─────────────────────────────────────────────────────
const VITALS_TABLE = [
  { age: "Neonate (0–4 wk)", hr: "100–170", sbp: "60–85", rr: "40–60", map: "45–60" },
  { age: "Infant (1–12 mo)", hr: "100–160", sbp: "70–100", rr: "30–53", map: "50–65" },
  { age: "Toddler (1–2 yr)", hr: "90–150", sbp: "80–110", rr: "24–40", map: "55–70" },
  { age: "Pre-school (3–5 yr)", hr: "80–140", sbp: "80–115", rr: "22–34", map: "60–75" },
  { age: "School (6–11 yr)", hr: "70–120", sbp: "90–125", rr: "18–30", map: "65–80" },
  { age: "Adolescent (≥12 yr)", hr: "60–100", sbp: "100–135", rr: "12–16", map: "70–90" },
];

// ─── Renal adjustments ────────────────────────────────────────────────────────
const RENAL_DRUGS = [
  { drug: "Amikacin", adj: "Extend interval: CrCl 10–50 → q36h; CrCl <10 → q48h. Monitor troughs.", alert: "high" },
  { drug: "Gentamicin", adj: "Extend interval: CrCl 10–50 → q36h; CrCl <10 → q48h. Monitor levels.", alert: "high" },
  { drug: "Vancomycin", adj: "CrCl 10–50: q24–48h. CrCl <10: q48–96h. AUC/MIC monitoring preferred.", alert: "high" },
  { drug: "Meropenem", adj: "CrCl 26–50: normal dose q12h. CrCl 10–25: ½ dose q12h. CrCl <10: ½ dose q24h.", alert: "moderate" },
  { drug: "Ceftazidime", adj: "CrCl 10–50: 50% dose q12h. CrCl <10: 50% dose q24h.", alert: "moderate" },
  { drug: "Metronidazole", adj: "Severe renal failure: monitor for neurotoxicity. No dose change routinely.", alert: "low" },
  { drug: "Acyclovir", adj: "CrCl 10–50: reduce dose 50%. CrCl <10: reduce dose 75%. Ensure adequate hydration.", alert: "moderate" },
  { drug: "Furosemide", adj: "May need higher doses in renal failure. Avoid in anuria. Monitor electrolytes.", alert: "moderate" },
  { drug: "Midazolam", adj: "Metabolite accumulates in renal failure. Reduce dose and monitor CNS depression.", alert: "moderate" },
  { drug: "Morphine", adj: "Active metabolite (M6G) accumulates. Avoid or reduce dose by 50% in CrCl <30.", alert: "high" },
  { drug: "Fentanyl", adj: "Preferred opioid in renal failure — minimal active metabolites. Titrate carefully.", alert: "low" },
  { drug: "Ranitidine / Omeprazole", adj: "No significant renal adjustment required for standard doses.", alert: "low" },
];

const HEPATIC_DRUGS = [
  { drug: "Midazolam", adj: "Hepatic metabolism impaired — reduce dose 30–50%. Prolonged sedation risk.", alert: "high" },
  { drug: "Fentanyl", adj: "Use with caution; hepatic metabolism — monitor for accumulation.", alert: "moderate" },
  { drug: "Morphine", adj: "Reduce dose in hepatic failure. Risk of encephalopathy.", alert: "high" },
  { drug: "Metronidazole", adj: "Severe hepatic failure: reduce dose by 50%. Risk of encephalopathy.", alert: "moderate" },
  { drug: "Paracetamol", adj: "Avoid or reduce dose significantly in severe hepatic failure. Hepatotoxic in overdose.", alert: "high" },
  { drug: "Amiodarone", adj: "Use with caution — hepatotoxic. Monitor LFTs regularly.", alert: "moderate" },
  { drug: "Carbamazepine", adj: "May worsen hepatic failure. Monitor LFTs.", alert: "moderate" },
  { drug: "Fluconazole", adj: "Use with caution — hepatotoxic in high doses. Reduce dose in severe dysfunction.", alert: "moderate" },
];

// ─── Advanced ICU Care Bundles (4 checklists) ─────────────────────────────────
const FASTHUG_BUNDLE = [
  "Feeding — Enteral nutrition initiated within 24–48h if hemodynamically stable",
  "Analgesia — Assess pain (FLACC / VAS) every 4 hours; treat before sedation",
  "Sedation — Target RASS goal; avoid oversedation; daily SAT when feasible",
  "Thromboembolic prophylaxis — DVT prophylaxis (pharmacologic + mechanical) per protocol",
  "Head of Bed (HOB) elevation — 30–45° for all intubated patients",
  "Ulcer prophylaxis — Stress ulcer prophylaxis for high-risk patients (mechanical ventilation + coagulopathy)",
  "Glycemic control — Target 140–180 mg/dL; avoid hypoglycemia (<70 mg/dL)",
];

const VAP_BUNDLE_UPDATED = [
  "Head of bed elevated 30–45°",
  "Daily sedation interruption (SAT) and assess readiness to extubate",
  "Daily spontaneous breathing trial (SBT) when SAT successful",
  "Peptic ulcer disease (PUD) prophylaxis — PPI or H2 blocker per protocol",
  "DVT prophylaxis — SCDs + pharmacologic if no contraindication",
  "Oral care with chlorhexidine 0.12% every 4–6 hours",
  "Subglottic secretion suctioning (if ETT with subglottic port available)",
  "Ventilator circuit: do NOT change routinely (change if soiled or malfunction)",
  "Hand hygiene before and after any airway manipulation",
  "Cuff pressure maintained 20–30 cmH₂O; verify daily",
];

const CLABSI_BUNDLE_UPDATED = [
  "Daily review of line necessity — remove central line as soon as no longer needed",
  "Hand hygiene with soap or alcohol gel before accessing line or changing dressing",
  "Strict aseptic technique for dressing changes — mask, sterile gloves, large drape",
  "Hub scrub — disinfect needleless connectors / hubs with 70% alcohol for ≥15 seconds",
  "Maximal sterile barrier precautions during insertion",
  "Chlorhexidine skin antisepsis (>0.5% CHG in 70% alcohol)",
  "Optimal catheter site selection (avoid femoral if possible; prefer subclavian)",
  "Change IV tubing every 96 hours (blood / lipid lines: 24 hours)",
  "Sterile dressing changed every 5–7 days or when soiled / loose",
  "No routine guidewire exchanges for suspected infection",
];

const CAUTI_BUNDLE = [
  "Daily assessment of catheter need — remove urinary catheter at earliest opportunity",
  "Maintain closed sterile drainage system — do not break circuit unless necessary",
  "Keep drainage bag below bladder level at all times",
  "Proper securement to prevent movement / traction — avoid urethral trauma",
  "Ensure unobstructed urine flow and prevent kinking of tubing",
  "Hand hygiene before and after any catheter manipulation",
  "Use aseptic technique for insertion and maintenance",
  "Consider alternatives (condom catheter, intermittent catheterization) when appropriate",
];

// ─── Advanced ICU Scores constants ─────────────────────────────────────────────
// FOUR Score options
const FOUR_EYE = [
  { label: "4 — Eyelids open, tracking, blinking to command", value: 4 },
  { label: "3 — Eyelids open but not tracking", value: 3 },
  { label: "2 — Eyelids closed, open to loud voice", value: 2 },
  { label: "1 — Eyelids closed, open to pain", value: 1 },
  { label: "0 — Eyelids remain closed with pain", value: 0 },
];
const FOUR_MOTOR = [
  { label: "4 — Thumbs-up, fist, or peace sign to command", value: 4 },
  { label: "3 — Localizing to pain", value: 3 },
  { label: "2 — Flexion response to pain", value: 2 },
  { label: "1 — Extension response to pain", value: 1 },
  { label: "0 — No response to pain or generalized myoclonus", value: 0 },
];
const FOUR_BRAINSTEM = [
  { label: "4 — Pupil and corneal reflexes present", value: 4 },
  { label: "3 — One pupil wide and fixed", value: 3 },
  { label: "2 — Pupil or corneal reflexes absent", value: 2 },
  { label: "1 — Pupil and corneal reflexes absent", value: 1 },
  { label: "0 — Absent pupil, corneal, and cough reflexes", value: 0 },
];
const FOUR_RESP = [
  { label: "4 — Not intubated, regular breathing pattern", value: 4 },
  { label: "3 — Not intubated, Cheyne-Stokes breathing pattern", value: 3 },
  { label: "2 — Not intubated, irregular breathing", value: 2 },
  { label: "1 — Breathes above ventilator rate", value: 1 },
  { label: "0 — Breathes at ventilator rate or apnea", value: 0 },
];

// SIPA age thresholds
function sipaThreshold(ageMonths: number) {
  if (ageMonths <= 12) return 1.0;          // 0–12 mo
  if (ageMonths <= 24) return 0.9;          // 1–2 yr
  if (ageMonths <= 48) return 0.85;         // 3–4 yr
  if (ageMonths <= 72) return 0.75;         // 5–6 yr
  if (ageMonths <= 144) return 0.7;         // 7–12 yr
  return 0.6;                               // ≥13 yr
}

// WAT-1 validated 11-item protocol (Franck et al. 2012)
const WAT1_PAST12 = [
  { label: "Loose/watery stools", points: 1 },
  { label: "Vomiting / retching / gagging", points: 1 },
  { label: "Temperature > 37.8°C", points: 1 },
];
const WAT1_OBS2MIN = [
  { label: "State: Awake and distressed", points: 1 },
  { label: "Tremor", points: 1 },
  { label: "Sweating", points: 1 },
  { label: "Uncoordinated or repetitive movements", points: 1 },
  { label: "Yawning or sneezing > 1 time", points: 1 },
];
const WAT1_STIMULUS = [
  { label: "Startle to touch", points: 1 },
  { label: "Muscle tone increased", points: 1 },
];
const WAT1_CALM_TIME = [
  { label: "< 2 min", points: 0 },
  { label: "2 – 5 min", points: 1 },
  { label: "> 5 min", points: 2 },
];

// ─── Helper components ────────────────────────────────────────────────────────
function SectionHeader({
  title,
  icon,
  color,
  open,
  onToggle,
  isDark,
}: {
  title: string;
  icon: string;
  color: string;
  open: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.75}
      style={[
        styles.sectionHeader,
        { backgroundColor: isDark ? "#112240" : "#FFFFFF", borderColor: isDark ? "#233554" : "#E2E8F0" },
      ]}
    >
      <View style={[styles.sectionIcon, { backgroundColor: color + "1A" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <Text style={[styles.sectionTitle, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>{title}</Text>
      <Feather name={open ? "chevron-up" : "chevron-down"} size={20} color={isDark ? "#8892B0" : "#8A9BB0"} />
    </TouchableOpacity>
  );
}

function Row({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { color: isDark ? "#8892B0" : "#64748B" }]}>{label}</Text>
      <Text style={[styles.tableCellVal, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>{value}</Text>
    </View>
  );
}

function GCSOption({
  options,
  selected,
  onSelect,
  isDark,
}: {
  options: { val: number; label: string }[];
  selected: number;
  onSelect: (v: number) => void;
  isDark: boolean;
}) {
  return (
    <View style={styles.gcsGroup}>
      {options.map((o) => (
        <TouchableOpacity
          key={o.val}
          onPress={() => onSelect(o.val)}
          style={[
            styles.gcsOption,
            {
              backgroundColor:
                selected === o.val
                  ? C.tint + "22"
                  : isDark
                  ? "#0F1F2E"
                  : "#F8FAFC",
              borderColor: selected === o.val ? C.tint : isDark ? "#233554" : "#E2E8F0",
            },
          ]}
        >
          <View style={[styles.gcsRadio, { borderColor: selected === o.val ? C.tint : isDark ? "#3D5470" : "#CBD5E1" }]}>
            {selected === o.val && <View style={[styles.gcsRadioDot, { backgroundColor: C.tint }]} />}
          </View>
          <Text style={[styles.gcsOptionText, { color: isDark ? "#CBD5E1" : "#334155" }]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Chip({ label, color, selected, onPress, isDark }: {
  label: string; color: string; selected: boolean; onPress: () => void; isDark: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : isDark ? "#0A192F" : "#F1F5F9",
          borderColor: selected ? color : isDark ? "#2D4456" : "#CBD5E1",
        },
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? "#FFF" : isDark ? "#8892B0" : "#64748B" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Scenario-based fluid recommendation panel ───────────────────────────────
function ScenarioFluidPanel({
  scenario,
  kCl,
  isDark,
  textMuted,
  textPrimary,
}: {
  scenario: string;
  kCl: boolean;
  isDark: boolean;
  textMuted: string;
  textPrimary: string;
}) {
  const data: Record<string, { fluid: string; alert: string; alertColor: string; bg: string; border: string }> = {
    neonatal: {
      fluid: "D10W or D10 0.2% NaCl",
      alert: "Monitor blood glucose periodically.",
      alertColor: "#7C3AED",
      bg: isDark ? "#1A0A2E" : "#F3E8FF",
      border: isDark ? "#7C3AED" : "#D8B4FE",
    },
    maintenance: {
      fluid: `D5 0.45% NaCl or D5 0.9% NaCl${kCl ? " + 20 mEq/L KCl" : ""}`,
      alert: "",
      alertColor: "#0EA5E9",
      bg: isDark ? "#0A192F" : "#EFF6FF",
      border: isDark ? "#0EA5E9" : "#BFDBFE",
    },
    dehydration: {
      fluid: `D5 0.45% NaCl or D5 0.9% NaCl${kCl ? " + 20 mEq/L KCl" : ""}`,
      alert: "",
      alertColor: "#0EA5E9",
      bg: isDark ? "#0A192F" : "#EFF6FF",
      border: isDark ? "#0EA5E9" : "#BFDBFE",
    },
    resuscitation: {
      fluid: "0.9% NaCl or Ringer's Lactate (10–20 mL/kg bolus)",
      alert: "Caution: Check Serum Calcium if massive transfusion or blood products are running with RL.",
      alertColor: "#DC2626",
      bg: isDark ? "#450A0A" : "#FEE2E2",
      border: isDark ? "#DC2626" : "#FCA5A5",
    },
    dka: {
      fluid: "0.9% NaCl",
      alert: "Avoid Dextrose initially.",
      alertColor: "#DC2626",
      bg: isDark ? "#450A0A" : "#FEE2E2",
      border: isDark ? "#DC2626" : "#FCA5A5",
    },
  };
  const d = data[scenario] || data.maintenance;
  return (
    <View style={[styles.scenarioBox, { backgroundColor: d.bg, borderColor: d.border }]}>
      <Text style={[styles.scenarioLabel, { color: textMuted }]}>Recommended Fluid</Text>
      <Text style={[styles.scenarioFluid, { color: d.alertColor }]}>{d.fluid}</Text>
      {d.alert ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
          <Feather name="alert-triangle" size={14} color={d.alertColor} />
          <Text style={[styles.scenarioAlert, { color: d.alertColor }]}>{d.alert}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { weight } = useWeight();
  const { isFav, toggleFav } = useFavorites();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const [openSection, setOpenSection] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<Record<string, View | null>>({});
  const scrollToSection = useCallback((key: string) => {
    setOpenSection(key);
    requestAnimationFrame(() => {
      const node = sectionRefs.current[key];
      if (node && scrollRef.current) {
        node.measureLayout(
          scrollRef.current.getInnerViewNode(),
          (x, y) => scrollRef.current?.scrollTo({ y: y - 120, animated: true }),
          () => {}
        );
      }
    });
  }, []);
  const toggle = (key: string) => setOpenSection((prev) => (prev === key ? null : key));

  // ── Growth state ──
  const [growthSex, setGrowthSex] = useState<"M" | "F">("M");
  const [growthAge, setGrowthAge] = useState("");
  const [growthAgeUnit, setGrowthAgeUnit] = useState<"months" | "years">("months");
  const [growthWeight, setGrowthWeight] = useState(weight > 0 ? weight.toString() : "");
  const growthAgeMonths = growthAgeUnit === "years"
    ? (parseFloat(growthAge) || 0) * 12
    : parseFloat(growthAge) || 0;
  const growthWeightNum = parseFloat(growthWeight) || 0;
  const growthTable = growthSex === "M" ? WHO_W_BOYS : WHO_W_GIRLS;
  const growthRefs = growthAgeMonths > 0 ? findNearestAge(growthAgeMonths, growthTable) : null;
  const growthResult = growthRefs && growthWeightNum > 0 ? estimatePercentile(growthWeightNum, growthRefs) : null;

  // ── VIS state ──
  const [vis, setVis] = useState({ dopa: "", dobu: "", epi: "", mil: "", vaso: "", norepi: "" });
  const visScore = calcVIS(vis);
  const visResult = visInterpret(visScore);

  // ── Fluids state ──
  const [fluidWt, setFluidWt] = useState(weight > 0 ? weight.toString() : "");
  const [dehydPct, setDehydPct] = useState<5 | 10 | 15>(5);
  const [maintTarget, setMaintTarget] = useState<100 | 75 | 66 | 50>(100);
  const [scenario, setScenario] = useState<"maintenance" | "neonatal" | "dehydration" | "resuscitation" | "dka">("maintenance");
  const [kClToggle, setKClToggle] = useState(false);
  const fluidWtNum = Math.min(parseFloat(fluidWt) || 0, 60);
  const rawMaintenance = fluidWtNum > 0 ? hollidaySegar(fluidWtNum) : null;
  const multiplier = maintTarget / 100;
  const maintenance = rawMaintenance
    ? {
        daily: Math.round(rawMaintenance.daily * multiplier),
        hourly: +(rawMaintenance.hourly * multiplier).toFixed(1),
      }
    : null;
  const deficit = fluidWtNum > 0 ? Math.round((dehydPct / 100) * fluidWtNum * 1000) : 0;
  const total48h = maintenance ? Math.round(maintenance.daily + deficit / 2) : 0;

  // ── Electrolyte Correction state ──
  const [elActualK, setElActualK] = useState("");
  const [elTargetK, setElTargetK] = useState("4.0");
  const [elWt, setElWt] = useState(weight > 0 ? weight.toString() : "");
  const [elCentral, setElCentral] = useState(false);
  const [elRestrictFluids, setElRestrictFluids] = useState(false);
  const [elChecklist, setElChecklist] = useState({ renal: false, ecg: false, mg: false });
  const elActualKNum = parseFloat(elActualK) || 0;
  const elTargetKNum = parseFloat(elTargetK) || 4.0;
  const elWtNum = parseFloat(elWt) || 0;
  const elDeficit = elWtNum > 0 && elActualKNum > 0 && elTargetKNum > elActualKNum
    ? Math.round((elTargetKNum - elActualKNum) * elWtNum * 0.4 * 10) / 10
    : 0;
  const elChecklistDone = elChecklist.renal && elChecklist.ecg && elChecklist.mg;
  // KCl ampoule: 2 mEq/mL (20 mEq / 10 mL)
  // Peripheral: max 40 mEq/L = 0.04 mEq/mL  |  Central / fluid-restricted: 80 mEq/L = 0.08 mEq/mL
  const elConc = (elCentral || elRestrictFluids) ? 0.08 : 0.04;
  const elKClML = elDeficit > 0 ? Math.round((elDeficit / 2) * 10) / 10 : 0;
  const elTotalVol = elKClML > 0 ? Math.round(elDeficit / elConc) : 0;
  const elNSML = Math.max(0, elTotalVol - elKClML);
  const elRateMEqHr = elWtNum > 0 ? (elCentral ? 0.5 : 0.3) * elWtNum : 0;
  const elRateMLHr = elConc > 0 && elRateMEqHr > 0 ? Math.round(elRateMEqHr / elConc * 10) / 10 : 0;
  const elDurationHr = elRateMLHr > 0 && elTotalVol > 0 ? Math.round(elTotalVol / elRateMLHr * 10) / 10 : 0;

  // ── pGCS state ──
  const [eye, setEye] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);
  const gcsTotal = eye + verbal + motor;
  const gcsResult = gcsInterpret(gcsTotal);

  // ── Renal tab ──
  const [renalTab, setRenalTab] = useState<"renal" | "hepatic">("renal");
  const [crclWt, setCrclWt] = useState(weight > 0 ? weight.toString() : "");
  const [crclCr, setCrclCr] = useState("");
  const [crclHt, setCrclHt] = useState("");
  const crclWtNum = parseFloat(crclWt) || 0;
  const crclCrNum = parseFloat(crclCr) || 0;
  const crclHtNum = parseFloat(crclHt) || 0;
  const schwartz = crclWtNum > 0 && crclCrNum > 0 && crclHtNum > 0
    ? +(0.413 * crclHtNum / crclCrNum).toFixed(1)
    : null;
  function crclSeverity(v: number) {
    if (v >= 60) return { label: "Normal/Mild", color: "#16A34A" };
    if (v >= 30) return { label: "Moderate CKD", color: "#D97706" };
    if (v >= 15) return { label: "Severe CKD", color: "#EA580C" };
    return { label: "Kidney Failure — adjust all renally-cleared drugs", color: "#DC2626" };
  }

  // ── Bundle state (4 checklists) ──
  const [bundleTab, setBundleTab] = useState<"fasthug" | "vap" | "clabsi" | "cauti">("fasthug");
  const [fasthugChecked, setFasthugChecked] = useState<boolean[]>(FASTHUG_BUNDLE.map(() => false));
  const [vapChecked, setVapChecked] = useState<boolean[]>(VAP_BUNDLE_UPDATED.map(() => false));
  const [clabsiChecked, setClabsiChecked] = useState<boolean[]>(CLABSI_BUNDLE_UPDATED.map(() => false));
  const [cautiChecked, setCautiChecked] = useState<boolean[]>(CAUTI_BUNDLE.map(() => false));
  const fasthugPct = Math.round((fasthugChecked.filter(Boolean).length / FASTHUG_BUNDLE.length) * 100);
  const vapPct = Math.round((vapChecked.filter(Boolean).length / VAP_BUNDLE_UPDATED.length) * 100);
  const clabsiPct = Math.round((clabsiChecked.filter(Boolean).length / CLABSI_BUNDLE_UPDATED.length) * 100);
  const cautiPct = Math.round((cautiChecked.filter(Boolean).length / CAUTI_BUNDLE.length) * 100);

  // ── Advanced ICU Scores state ──
  // FOUR Score
  const [fourEye, setFourEye] = useState(4);
  const [fourMotor, setFourMotor] = useState(4);
  const [fourBrainstem, setFourBrainstem] = useState(4);
  const [fourResp, setFourResp] = useState(4);
  const fourTotal = fourEye + fourMotor + fourBrainstem + fourResp;
  const fourInterpret = fourTotal >= 13 ? { label: "Awake / Coma recovery", color: "#16A34A" } : fourTotal >= 7 ? { label: "Coma — moderate brainstem involvement", color: "#D97706" } : { label: "Coma — severe brainstem involvement", color: "#DC2626" };
  // OSI
  const [osiMap, setOsiMap] = useState("");
  const [osiFio2, setOsiFio2] = useState("");
  const [osiSpo2, setOsiSpo2] = useState("");
  const osiVal = osiMap && osiFio2 && osiSpo2 ? +((parseFloat(osiMap) || 0) * (parseFloat(osiFio2) || 0) / (parseFloat(osiSpo2) || 1)).toFixed(2) : null;
  const osiInterp = osiVal === null ? null : osiVal >= 12.4 ? { label: "Severe ARDS (OSI ≥ 12.4)", color: "#DC2626" } : osiVal >= 7.5 ? { label: "Moderate ARDS (OSI 7.5–12.3)", color: "#D97706" } : osiVal >= 5 ? { label: "Mild ARDS (OSI 5.0–7.4)", color: "#F59E0B" } : { label: "Normal (OSI < 5)", color: "#16A34A" };
  // SIPA
  const [sipaAge, setSipaAge] = useState("");
  const [sipaAgeUnit, setSipaAgeUnit] = useState<"months" | "years">("years");
  const [sipaHR, setSipaHR] = useState("");
  const [sipaSBP, setSipaSBP] = useState("");
  const sipaAgeMonths = sipaAgeUnit === "years" ? (parseFloat(sipaAge) || 0) * 12 : parseFloat(sipaAge) || 0;
  const sipaHrNum = parseFloat(sipaHR) || 0;
  const sipaSbpNum = parseFloat(sipaSBP) || 0;
  const sipaSi = sipaSbpNum > 0 ? +(sipaHrNum / sipaSbpNum).toFixed(2) : null;
  const sipaThresholdVal = sipaAgeMonths > 0 ? sipaThreshold(sipaAgeMonths) : 0.6;
  const sipaAlert = sipaSi !== null && sipaSi > sipaThresholdVal;
  // WAT-1
  const [wat1Past12, setWat1Past12] = useState<boolean[]>(WAT1_PAST12.map(() => false));
  const [wat1Obs2, setWat1Obs2] = useState<boolean[]>(WAT1_OBS2MIN.map(() => false));
  const [wat1Stim, setWat1Stim] = useState<boolean[]>(WAT1_STIMULUS.map(() => false));
  const [wat1CalmTime, setWat1CalmTime] = useState<number>(0);
  const wat1Score =
    wat1Past12.filter(Boolean).length +
    wat1Obs2.filter(Boolean).length +
    wat1Stim.filter(Boolean).length +
    wat1CalmTime;
  const wat1Interpret =
    wat1Score <= 2
      ? { label: "Minimal / No Withdrawal", color: "#16A34A" }
      : { label: "Significant Withdrawal \u2014 Intervention may be needed", color: "#FF4C60" };

  // ── Score tab selector ──
  const [scoreTab, setScoreTab] = useState<"four" | "osi" | "sipa" | "wat1">("four");

  // ── APGAR (interactive 0–2 per category) ──
  const [apgarA, setApgarA] = useState<number | null>(null);
  const [apgarP, setApgarP] = useState<number | null>(null);
  const [apgarG, setApgarG] = useState<number | null>(null);
  const [apgarAc, setApgarAc] = useState<number | null>(null);
  const [apgarR, setApgarR] = useState<number | null>(null);
  const apgarTotal = (apgarA ?? 0) + (apgarP ?? 0) + (apgarG ?? 0) + (apgarAc ?? 0) + (apgarR ?? 0);
  const apgarItems = [
    {
      key: "Appearance",
      setter: setApgarA,
      value: apgarA,
      options: [
        { score: 0, label: "Pale / Blue" },
        { score: 1, label: "Pink body, Blue extremities" },
        { score: 2, label: "Completely Pink" },
      ],
    },
    {
      key: "Pulse",
      setter: setApgarP,
      value: apgarP,
      options: [
        { score: 0, label: "Absent" },
        { score: 1, label: "< 100 bpm" },
        { score: 2, label: "> 100 bpm" },
      ],
    },
    {
      key: "Grimace",
      setter: setApgarG,
      value: apgarG,
      options: [
        { score: 0, label: "No response" },
        { score: 1, label: "Grimace / feeble cry" },
        { score: 2, label: "Cry, sneeze, cough" },
      ],
    },
    {
      key: "Activity",
      setter: setApgarAc,
      value: apgarAc,
      options: [
        { score: 0, label: "Flaccid / Limp" },
        { score: 1, label: "Some flexion" },
        { score: 2, label: "Active movement" },
      ],
    },
    {
      key: "Respiration",
      setter: setApgarR,
      value: apgarR,
      options: [
        { score: 0, label: "Absent" },
        { score: 1, label: "Weak / irregular / gasping" },
        { score: 2, label: "Good, strong cry" },
      ],
    },
  ];

  // ── PEWS ──
  const [pewsB, setPewsB] = useState("");
  const [pewsCv, setPewsCv] = useState("");
  const [pewsR, setPewsR] = useState("");
  const pewsSum = (parseInt(pewsB) || 0) + (parseInt(pewsCv) || 0) + (parseInt(pewsR) || 0);
  const pewsAlert = pewsSum >= 5;

  const bg = isDark ? "#0B132B" : "#F0F4F8";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const textPrimary = isDark ? "#CCD6F6" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#8A9BB0";
  const inputBg = isDark ? "#0A192F" : "#F8FAFC";

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? "#0A192F" : "#FFFFFF" }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>MKashanEdu</Text>
            <Text style={[styles.headerSub, { color: textMuted }]}>Pediatric Clinical Guide • Based on Harriet Lane & Nelson's • 95+ drugs</Text>
          </View>
          <TouchableOpacity
            onPress={toggleDark}
            style={[styles.nightToggle, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
          >
            <Feather name={isDark ? "sun" : "moon"} size={18} color={isDark ? "#FFD700" : "#4A5568"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable chip nav */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
        style={[styles.chipNav, { backgroundColor: isDark ? "#0A192F" : "#FFFFFF" }]}
      >
        {[
          { key: "growth", label: "Growth", color: "#0D9488" },
          { key: "vis", label: "VIS", color: "#E53E3E" },
          { key: "bundles", label: "Bundles", color: "#7C3AED" },
          { key: "fluids", label: "Fluids", color: "#0EA5E9" },
          { key: "electrolytes", label: "Electrolytes", color: "#0891B2" },
          { key: "gcs", label: "GCS", color: "#16A34A" },
          { key: "scores", label: "Scores", color: "#FF4C60" },
          { key: "renal", label: "Renal", color: "#DC2626" },
          { key: "pews", label: "PEWS", color: "#F59E0B" },
          { key: "apgar", label: "APGAR", color: "#EC4899" },
        ].map((chip) => (
          <TouchableOpacity
            key={chip.key}
            onPress={() => scrollToSection(chip.key)}
            style={[
              styles.navChip,
              {
                backgroundColor: openSection === chip.key ? chip.color + "20" : isDark ? "#112240" : "#F1F5F9",
                borderColor: openSection === chip.key ? chip.color : isDark ? "#233554" : "#E2E8F0",
              },
            ]}
          >
            <Text style={[styles.navChipText, { color: openSection === chip.key ? chip.color : textMuted }]}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ──────────────── MODULE 3: GROWTH CHARTS ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["growth"] = el; }}>
          <SectionHeader
            title="Growth Charts — WHO Standards"
            icon="bar-chart-2"
            color="#0D9488"
            open={openSection === "growth"}
            onToggle={() => toggle("growth")}
            isDark={isDark}
          />
          {openSection === "growth" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>

              {/* ── Header bar ── */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#0D9488", letterSpacing: 0.3 }}>
                    WHO Child Growth Standards
                  </Text>
                  <Text style={{ fontSize: 10, color: textMuted, marginTop: 1 }}>
                    Nelson's Pediatrics 22e · Harriet Lane 23e
                  </Text>
                </View>
                <StarButton isFav={isFav("tool-growth")} onToggle={() => toggleFav({ id: "tool-growth", type: "tool", label: "Growth Charts", color: "#0D9488" })} size={18} color="#0D9488" />
              </View>

              <Text style={[styles.refText, { color: textMuted, marginBottom: 10 }]}>
                Weight-for-Age · Z-score (SD) · Nutritional Status Classification
              </Text>

              {/* ── Sex selector ── */}
              <Text style={[styles.inputLabel, { color: textMuted, marginBottom: 4 }]}>Sex</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => setGrowthSex("M")}
                  style={{
                    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center",
                    backgroundColor: growthSex === "M" ? "#0D9488" : (isDark ? "#1E293B" : "#F1F5F9"),
                    borderWidth: 2,
                    borderColor: growthSex === "M" ? "#0D9488" : (isDark ? "#334155" : "#CBD5E1"),
                  }}
                >
                  <Text style={{ fontWeight: "700", fontSize: 14, color: growthSex === "M" ? "#FFFFFF" : textMuted }}>
                    ♂ Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGrowthSex("F")}
                  style={{
                    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center",
                    backgroundColor: growthSex === "F" ? "#7C3AED" : (isDark ? "#1E293B" : "#F1F5F9"),
                    borderWidth: 2,
                    borderColor: growthSex === "F" ? "#7C3AED" : (isDark ? "#334155" : "#CBD5E1"),
                  }}
                >
                  <Text style={{ fontWeight: "700", fontSize: 14, color: growthSex === "F" ? "#FFFFFF" : textMuted }}>
                    ♀ Female
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ── Age input + unit toggle ── */}
              <Text style={[styles.inputLabel, { color: textMuted, marginBottom: 4 }]}>Age</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                <TextInput
                  style={[styles.input, { flex: 1, color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                  value={growthAge}
                  onChangeText={setGrowthAge}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 18"
                  placeholderTextColor={textMuted}
                />
                <TouchableOpacity
                  onPress={() => setGrowthAgeUnit("months")}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, justifyContent: "center",
                    backgroundColor: growthAgeUnit === "months" ? "#0D9488" : (isDark ? "#1E293B" : "#F1F5F9"),
                    borderWidth: 2,
                    borderColor: growthAgeUnit === "months" ? "#0D9488" : (isDark ? "#334155" : "#CBD5E1"),
                  }}
                >
                  <Text style={{ fontWeight: "700", fontSize: 13, color: growthAgeUnit === "months" ? "#FFFFFF" : textMuted }}>Months</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGrowthAgeUnit("years")}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, justifyContent: "center",
                    backgroundColor: growthAgeUnit === "years" ? "#0D9488" : (isDark ? "#1E293B" : "#F1F5F9"),
                    borderWidth: 2,
                    borderColor: growthAgeUnit === "years" ? "#0D9488" : (isDark ? "#334155" : "#CBD5E1"),
                  }}
                >
                  <Text style={{ fontWeight: "700", fontSize: 13, color: growthAgeUnit === "years" ? "#FFFFFF" : textMuted }}>Years</Text>
                </TouchableOpacity>
              </View>

              {/* ── Weight input ── */}
              <Text style={[styles.inputLabel, { color: textMuted, marginBottom: 4 }]}>Weight (kg)</Text>
              <TextInput
                style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border, marginBottom: 14 }]}
                value={growthWeight}
                onChangeText={setGrowthWeight}
                keyboardType="decimal-pad"
                placeholder="e.g. 12.5"
                placeholderTextColor={textMuted}
              />

              {/* ── Results ── */}
              {growthResult && growthRefs && (
                <View style={{ gap: 10 }}>

                  {/* SAM Critical Alert */}
                  {growthResult.samAlert && (
                    <View style={{ backgroundColor: "#FEE2E2", borderColor: "#DC2626", borderWidth: 2, borderRadius: 10, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Feather name="alert-triangle" size={20} color="#DC2626" />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#DC2626", fontWeight: "800", fontSize: 13 }}>
                          CRITICAL: Severe Acute Malnutrition
                        </Text>
                        <Text style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>
                          Refer to Dietitian — Initiate SAM Protocol
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Z-score + Percentile row */}
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <View style={{ flex: 1, backgroundColor: growthResult.color + "18", borderColor: growthResult.color + "50", borderWidth: 1.5, borderRadius: 10, padding: 12, alignItems: "center" }}>
                      <Text style={{ fontSize: 11, color: textMuted, fontWeight: "600", marginBottom: 2 }}>Z-SCORE (SD)</Text>
                      <Text style={{ fontSize: 26, fontWeight: "800", color: growthResult.color }}>
                        {growthResult.zscore > 0 ? "+" : ""}{growthResult.zscore}
                      </Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: growthResult.color + "18", borderColor: growthResult.color + "50", borderWidth: 1.5, borderRadius: 10, padding: 12, alignItems: "center" }}>
                      <Text style={{ fontSize: 11, color: textMuted, fontWeight: "600", marginBottom: 2 }}>PERCENTILE</Text>
                      <Text style={{ fontSize: 14, fontWeight: "800", color: growthResult.color, textAlign: "center" }}>
                        {growthResult.label}
                      </Text>
                    </View>
                  </View>

                  {/* Nutritional Status badge */}
                  <View style={{ backgroundColor: growthResult.nutritionColor + "15", borderColor: growthResult.nutritionColor + "60", borderWidth: 1.5, borderRadius: 10, padding: 12 }}>
                    <Text style={{ fontSize: 11, color: textMuted, fontWeight: "600", marginBottom: 2 }}>NUTRITIONAL STATUS</Text>
                    <Text style={{ fontSize: 15, fontWeight: "800", color: growthResult.nutritionColor }}>
                      {growthResult.nutritionStatus}
                    </Text>
                    <Text style={{ fontSize: 12, color: textMuted, marginTop: 3 }}>{growthResult.note}</Text>
                  </View>

                  {/* Visual Z-score bar */}
                  <View style={{ marginTop: 2 }}>
                    <Text style={{ fontSize: 11, color: textMuted, fontWeight: "600", marginBottom: 6 }}>
                      NUTRITIONAL STATUS BAR (Z-score −4 to +4)
                    </Text>
                    <View style={{ height: 16, borderRadius: 8, flexDirection: "row", overflow: "hidden", marginBottom: 4 }}>
                      <View style={{ flex: 1, backgroundColor: "#DC2626" }} />
                      <View style={{ flex: 1, backgroundColor: "#F59E0B" }} />
                      <View style={{ flex: 4, backgroundColor: "#16A34A" }} />
                      <View style={{ flex: 1, backgroundColor: "#F59E0B" }} />
                      <View style={{ flex: 1, backgroundColor: "#DC2626" }} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 9, color: "#DC2626", fontWeight: "700" }}>SAM</Text>
                      <Text style={{ fontSize: 9, color: "#F59E0B", fontWeight: "700" }}>MAM</Text>
                      <Text style={{ fontSize: 9, color: "#16A34A", fontWeight: "700" }}>NORMAL</Text>
                      <Text style={{ fontSize: 9, color: "#F59E0B", fontWeight: "700" }}>OVER</Text>
                      <Text style={{ fontSize: 9, color: "#DC2626", fontWeight: "700" }}>OBESE</Text>
                    </View>
                  </View>

                  {/* Reference values */}
                  <Text style={[styles.refText, { color: textMuted }]}>
                    Reference at {Math.round(growthAgeMonths)} mo ({growthSex === "M" ? "Boys" : "Girls"}):
                    {"  "}P3 = {growthRefs[0]} kg · P50 = {growthRefs[2]} kg · P97 = {growthRefs[4]} kg
                  </Text>
                </View>
              )}

              {/* ── Head Circumference Reference Table ── */}
              <View style={{ marginTop: 16, backgroundColor: isDark ? "#0F172A" : "#EFF6FF", borderColor: isDark ? "#1E3A5F" : "#BFDBFE", borderWidth: 1, borderRadius: 10, padding: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: "800", color: "#2563EB", marginBottom: 8 }}>
                  Head Circumference Reference (WHO)
                </Text>
                {[
                  ["Age", "Male (cm)", "Female (cm)", "Note"],
                  ["Birth", "34.5", "33.9", ""],
                  ["3 months", "40.5", "39.5", ""],
                  ["6 months", "43.3", "42.2", ""],
                  ["9 months", "45.0", "43.8", ""],
                  ["12 months", "46.1", "44.9", ""],
                  ["18 months", "47.6", "46.4", ""],
                  ["2 years", "48.6", "47.3", ""],
                  ["3 years", "49.6", "48.3", ""],
                  ["5 years", "51.1", "49.8", ""],
                  ["10 years", "53.2", "52.0", ""],
                  ["Adult", "57.0", "55.0", "Approx."],
                ].map((row, i) => (
                  <View key={i} style={{
                    flexDirection: "row",
                    paddingVertical: 5,
                    borderBottomWidth: i < 11 ? 0.5 : 0,
                    borderBottomColor: isDark ? "#1E3A5F" : "#DBEAFE",
                    backgroundColor: i === 0 ? (isDark ? "#1E3A5F" : "#DBEAFE") : "transparent",
                    borderRadius: i === 0 ? 6 : 0,
                    paddingHorizontal: i === 0 ? 4 : 0,
                    marginBottom: i === 0 ? 2 : 0,
                  }}>
                    <Text style={{ flex: 2, fontSize: i === 0 ? 11 : 12, fontWeight: i === 0 ? "700" : "500", color: i === 0 ? "#2563EB" : textPrimary }}>{row[0]}</Text>
                    <Text style={{ flex: 1.5, fontSize: i === 0 ? 11 : 12, fontWeight: i === 0 ? "700" : "600", color: i === 0 ? "#2563EB" : "#0D9488", textAlign: "center" }}>{row[1]}</Text>
                    <Text style={{ flex: 1.5, fontSize: i === 0 ? 11 : 12, fontWeight: i === 0 ? "700" : "600", color: i === 0 ? "#2563EB" : "#7C3AED", textAlign: "center" }}>{row[2]}</Text>
                    <Text style={{ flex: 1.5, fontSize: 10, color: textMuted, textAlign: "right" }}>{row[3]}</Text>
                  </View>
                ))}
                <Text style={{ fontSize: 10, color: textMuted, marginTop: 8 }}>
                  Microcephaly: {"<"}2 SD below mean · Macrocephaly: {">"}98th percentile
                </Text>
              </View>

              <Text style={[styles.refText, { color: textMuted, marginTop: 8 }]}>
                Source: WHO Child Growth Standards · Nelson's Pediatrics 22e · Harriet Lane 23e
              </Text>
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 5: VIS / CARDIAC ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["vis"] = el; }}>
          <SectionHeader
            title="VIS / Cardiac & Haemodynamic"
            icon="heart"
            color="#E53E3E"
            open={openSection === "vis"}
            onToggle={() => toggle("vis")}
            isDark={isDark}
          />
          {openSection === "vis" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 }}>
                <StarButton isFav={isFav("tool-vis")} onToggle={() => toggleFav({ id: "tool-vis", type: "tool", label: "VIS / Cardiac", color: "#E53E3E" })} size={18} color="#E53E3E" />
              </View>
              <Text style={[styles.refText, { color: textMuted }]}>
                Vasoactive-Inotropic Score (Wernovsky et al. 1995){"\n"}
                VIS = Dopa + Dobu + 100×Epi + 10×Milrinone + 10000×Vaso + 100×Norepi
              </Text>

              {(["dopa", "dobu", "epi", "mil", "vaso", "norepi"] as const).map((key) => {
                const labels: Record<string, string> = {
                  dopa: "Dopamine (mcg/kg/min)",
                  dobu: "Dobutamine (mcg/kg/min)",
                  epi: "Epinephrine (mcg/kg/min)",
                  mil: "Milrinone (mcg/kg/min)",
                  vaso: "Vasopressin (units/kg/min)",
                  norepi: "Norepinephrine (mcg/kg/min)",
                };
                return (
                  <View key={key} style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: textMuted }]}>{labels[key]}</Text>
                    <TextInput
                      style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                      value={vis[key]}
                      onChangeText={(t) => setVis((prev) => ({ ...prev, [key]: t }))}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={textMuted}
                    />
                  </View>
                );
              })}

              <View style={[styles.resultBox, { backgroundColor: visResult.color + "15", borderColor: visResult.color + "40" }]}>
                <Text style={[styles.resultLabel, { color: visResult.color }]}>VIS = {visScore}</Text>
                <Text style={[styles.resultNote, { color: textMuted }]}>{visResult.label}</Text>
              </View>

              {/* Normal Vitals Table */}
              <View style={[styles.infoBox, { backgroundColor: isDark ? "#0A192F" : "#EFF6FF", borderColor: isDark ? "#233554" : "#BFDBFE", marginTop: 14 }]}>
                <Text style={[styles.infoTitle, { color: "#3B82F6" }]}>Normal Vitals by Age</Text>
                <View style={[styles.tableHeaderRow, { borderBottomColor: border }]}>
                  {["Age Group", "HR", "SBP", "RR", "MAP"].map((h) => (
                    <Text key={h} style={[styles.tableHeaderCell, { color: "#3B82F6" }]}>{h}</Text>
                  ))}
                </View>
                {VITALS_TABLE.map((row) => (
                  <View key={row.age} style={[styles.vitalsRow, { borderBottomColor: border }]}>
                    <Text style={[styles.vitalsAge, { color: textPrimary }]}>{row.age}</Text>
                    <Text style={[styles.vitalsCell, { color: textMuted }]}>{row.hr}</Text>
                    <Text style={[styles.vitalsCell, { color: textMuted }]}>{row.sbp}</Text>
                    <Text style={[styles.vitalsCell, { color: textMuted }]}>{row.rr}</Text>
                    <Text style={[styles.vitalsCell, { color: textMuted }]}>{row.map}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 6: CARE BUNDLES ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["bundles"] = el; }}>
          <SectionHeader
            title="PICU Care Bundles"
            icon="check-square"
            color="#7C3AED"
            open={openSection === "bundles"}
            onToggle={() => toggle("bundles")}
            isDark={isDark}
          />
          {openSection === "bundles" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              {/* 4-tab chip selector */}
              <View style={styles.chipRow}>
                <Chip label={`FASTHUG (${fasthugPct}%)`} color="#0891B2" selected={bundleTab === "fasthug"} onPress={() => setBundleTab("fasthug")} isDark={isDark} />
                <Chip label={`VAP (${vapPct}%)`} color="#E53E3E" selected={bundleTab === "vap"} onPress={() => setBundleTab("vap")} isDark={isDark} />
                <Chip label={`CLABSI (${clabsiPct}%)`} color="#7C3AED" selected={bundleTab === "clabsi"} onPress={() => setBundleTab("clabsi")} isDark={isDark} />
                <Chip label={`CAUTI (${cautiPct}%)`} color="#F59E0B" selected={bundleTab === "cauti"} onPress={() => setBundleTab("cauti")} isDark={isDark} />
              </View>

              {/* FASTHUG */}
              {bundleTab === "fasthug" && (
                <>
                  <Text style={[styles.bundleTitle, { color: "#0891B2" }]}>FASTHUG (Daily ICU Checklist)</Text>
                  <View style={[styles.progressBar, { backgroundColor: isDark ? "#233554" : "#E2E8F0" }]}>
                    <View style={[styles.progressFill, { width: `${fasthugPct}%` as any, backgroundColor: fasthugPct === 100 ? "#16A34A" : "#0891B2" }]} />
                  </View>
                  <Text style={[styles.progressLabel, { color: textMuted }]}>{fasthugChecked.filter(Boolean).length} / {FASTHUG_BUNDLE.length} complete</Text>
                  {FASTHUG_BUNDLE.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => setFasthugChecked((prev) => prev.map((v, j) => j === i ? !v : v))} style={styles.checkItem}>
                      <View style={[styles.checkbox, { backgroundColor: fasthugChecked[i] ? "#16A34A" : "transparent", borderColor: fasthugChecked[i] ? "#16A34A" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                        {fasthugChecked[i] && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      <Text style={[styles.checkLabel, { color: fasthugChecked[i] ? textMuted : textPrimary, textDecorationLine: fasthugChecked[i] ? "line-through" : "none" }]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setFasthugChecked(FASTHUG_BUNDLE.map(() => false))} style={styles.resetBundleBtn}>
                    <Feather name="rotate-ccw" size={14} color={textMuted} />
                    <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset checklist</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* VAP */}
              {bundleTab === "vap" && (
                <>
                  <Text style={[styles.bundleTitle, { color: "#E53E3E" }]}>Ventilator-Associated Pneumonia (VAP) Prevention</Text>
                  <View style={[styles.progressBar, { backgroundColor: isDark ? "#233554" : "#E2E8F0" }]}>
                    <View style={[styles.progressFill, { width: `${vapPct}%` as any, backgroundColor: vapPct === 100 ? "#16A34A" : "#E53E3E" }]} />
                  </View>
                  <Text style={[styles.progressLabel, { color: textMuted }]}>{vapChecked.filter(Boolean).length} / {VAP_BUNDLE_UPDATED.length} complete</Text>
                  {VAP_BUNDLE_UPDATED.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => setVapChecked((prev) => prev.map((v, j) => j === i ? !v : v))} style={styles.checkItem}>
                      <View style={[styles.checkbox, { backgroundColor: vapChecked[i] ? "#16A34A" : "transparent", borderColor: vapChecked[i] ? "#16A34A" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                        {vapChecked[i] && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      <Text style={[styles.checkLabel, { color: vapChecked[i] ? textMuted : textPrimary, textDecorationLine: vapChecked[i] ? "line-through" : "none" }]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setVapChecked(VAP_BUNDLE_UPDATED.map(() => false))} style={styles.resetBundleBtn}>
                    <Feather name="rotate-ccw" size={14} color={textMuted} />
                    <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset checklist</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* CLABSI */}
              {bundleTab === "clabsi" && (
                <>
                  <Text style={[styles.bundleTitle, { color: "#7C3AED" }]}>CLABSI Prevention (Central Line Bundle)</Text>
                  <View style={[styles.progressBar, { backgroundColor: isDark ? "#233554" : "#E2E8F0" }]}>
                    <View style={[styles.progressFill, { width: `${clabsiPct}%` as any, backgroundColor: clabsiPct === 100 ? "#16A34A" : "#7C3AED" }]} />
                  </View>
                  <Text style={[styles.progressLabel, { color: textMuted }]}>{clabsiChecked.filter(Boolean).length} / {CLABSI_BUNDLE_UPDATED.length} complete</Text>
                  {CLABSI_BUNDLE_UPDATED.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => setClabsiChecked((prev) => prev.map((v, j) => j === i ? !v : v))} style={styles.checkItem}>
                      <View style={[styles.checkbox, { backgroundColor: clabsiChecked[i] ? "#16A34A" : "transparent", borderColor: clabsiChecked[i] ? "#16A34A" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                        {clabsiChecked[i] && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      <Text style={[styles.checkLabel, { color: clabsiChecked[i] ? textMuted : textPrimary, textDecorationLine: clabsiChecked[i] ? "line-through" : "none" }]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setClabsiChecked(CLABSI_BUNDLE_UPDATED.map(() => false))} style={styles.resetBundleBtn}>
                    <Feather name="rotate-ccw" size={14} color={textMuted} />
                    <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset checklist</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* CAUTI */}
              {bundleTab === "cauti" && (
                <>
                  <Text style={[styles.bundleTitle, { color: "#F59E0B" }]}>CAUTI Prevention (Urinary Catheter Bundle)</Text>
                  <View style={[styles.progressBar, { backgroundColor: isDark ? "#233554" : "#E2E8F0" }]}>
                    <View style={[styles.progressFill, { width: `${cautiPct}%` as any, backgroundColor: cautiPct === 100 ? "#16A34A" : "#F59E0B" }]} />
                  </View>
                  <Text style={[styles.progressLabel, { color: textMuted }]}>{cautiChecked.filter(Boolean).length} / {CAUTI_BUNDLE.length} complete</Text>
                  {CAUTI_BUNDLE.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => setCautiChecked((prev) => prev.map((v, j) => j === i ? !v : v))} style={styles.checkItem}>
                      <View style={[styles.checkbox, { backgroundColor: cautiChecked[i] ? "#16A34A" : "transparent", borderColor: cautiChecked[i] ? "#16A34A" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                        {cautiChecked[i] && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      <Text style={[styles.checkLabel, { color: cautiChecked[i] ? textMuted : textPrimary, textDecorationLine: cautiChecked[i] ? "line-through" : "none" }]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setCautiChecked(CAUTI_BUNDLE.map(() => false))} style={styles.resetBundleBtn}>
                    <Feather name="rotate-ccw" size={14} color={textMuted} />
                    <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset checklist</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Reset All */}
              <TouchableOpacity
                onPress={() => {
                  setFasthugChecked(FASTHUG_BUNDLE.map(() => false));
                  setVapChecked(VAP_BUNDLE_UPDATED.map(() => false));
                  setClabsiChecked(CLABSI_BUNDLE_UPDATED.map(() => false));
                  setCautiChecked(CAUTI_BUNDLE.map(() => false));
                }}
                style={[styles.resetBundleBtn, { justifyContent: "center", paddingTop: 14 }]}>
                <Feather name="rotate-ccw" size={14} color="#DC2626" />
                <Text style={[styles.resetBundleText, { color: "#DC2626", fontWeight: "700" }]}>Reset All Bundles</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 7: IV FLUIDS ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["fluids"] = el; }}>
          <SectionHeader
            title="IV Fluids & Dehydration — Clinical Decision Support"
            icon="droplet"
            color="#0EA5E9"
            open={openSection === "fluids"}
            onToggle={() => toggle("fluids")}
            isDark={isDark}
          />
          {openSection === "fluids" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 }}>
                <StarButton isFav={isFav("tool-fluids")} onToggle={() => toggleFav({ id: "tool-fluids", type: "tool", label: "IV Fluids", color: "#0EA5E9" })} size={18} color="#0EA5E9" />
              </View>
              <Text style={[styles.refText, { color: textMuted }]}>
                Holliday-Segar · Harriet Lane 23e · Nelson 22e
              </Text>
              <View style={styles.inputWrap}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Patient Weight (kg)</Text>
                <TextInput
                  style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                  value={fluidWt}
                  onChangeText={setFluidWt}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 15"
                  placeholderTextColor={textMuted}
                />
              </View>

              {/* Clinical Scenario selector */}
              <Text style={[styles.inputLabel, { color: textMuted, marginTop: 4 }]}>Clinical Scenario</Text>
              <View style={styles.chipRow}>
                {[
                  { key: "maintenance", label: "Maintenance Only" },
                  { key: "neonatal", label: "Neonatal" },
                  { key: "dehydration", label: "Dehydration" },
                  { key: "resuscitation", label: "Resuscitation" },
                  { key: "dka", label: "DKA / Metabolic" },
                ].map((s) => (
                  <Chip
                    key={s.key}
                    label={s.label}
                    color={s.key === "resuscitation" || s.key === "dka" ? "#DC2626" : s.key === "neonatal" ? "#7C3AED" : "#0EA5E9"}
                    selected={scenario === (s.key as any)}
                    onPress={() => setScenario(s.key as any)}
                    isDark={isDark}
                  />
                ))}
              </View>

              {/* Maintenance Target multiplier */}
              <Text style={[styles.inputLabel, { color: textMuted, marginTop: 4 }]}>Maintenance Target</Text>
              <View style={styles.chipRow}>
                {[
                  { key: 100, label: "100% (Full)" },
                  { key: 75, label: "75% (3/4)" },
                  { key: 66, label: "66% (2/3)" },
                  { key: 50, label: "50% (1/2)" },
                ].map((m) => (
                  <Chip
                    key={m.key}
                    label={m.label}
                    color="#0891B2"
                    selected={maintTarget === (m.key as any)}
                    onPress={() => setMaintTarget(m.key as any)}
                    isDark={isDark}
                  />
                ))}
              </View>
              {maintTarget < 100 && (
                <View style={[styles.alertBanner, { backgroundColor: isDark ? "#451A03" : "#FEF3C7", borderColor: isDark ? "#92400E" : "#F59E0B" }]}>
                  <Feather name="info" size={14} color={isDark ? "#FCD34D" : "#92400E"} />
                  <Text style={[styles.alertBannerText, { color: isDark ? "#FCD34D" : "#92400E" }]}>
                    Note: Fluid restriction applied. Monitor hemodynamics.
                  </Text>
                </View>
              )}

              {maintenance && (
                <>
                  <View style={[styles.resultBox, { backgroundColor: "#0EA5E915", borderColor: "#0EA5E940" }]}>
                    <Text style={[styles.resultLabel, { color: "#0EA5E9" }]}>
                      Maintenance Fluids {maintTarget < 100 ? `(${maintTarget}% of Holliday-Segar)` : ""}
                    </Text>
                    <Row label="24-hour total" value={`${maintenance.daily} mL/day`} isDark={isDark} />
                    <Row label="Hourly rate" value={`${maintenance.hourly} mL/hr`} isDark={isDark} />
                    <Text style={[styles.refText, { color: textMuted, marginTop: 6 }]}>
                      {fluidWtNum <= 10
                        ? `${fluidWtNum} kg × 100 = ${rawMaintenance!.daily} mL/day × ${multiplier} = ${maintenance.daily} mL/day`
                        : fluidWtNum <= 20
                        ? `1000 + (${fluidWtNum - 10} × 50) = ${rawMaintenance!.daily} mL/day × ${multiplier} = ${maintenance.daily} mL/day`
                        : `1500 + (${fluidWtNum - 20} × 20) = ${rawMaintenance!.daily} mL/day × ${multiplier} = ${maintenance.daily} mL/day`}
                    </Text>
                  </View>

                  <Text style={[styles.inputLabel, { color: textMuted, marginTop: 12 }]}>Dehydration Severity</Text>
                  <View style={styles.chipRow}>
                    {([5, 10, 15] as const).map((pct) => (
                      <Chip
                        key={pct}
                        label={`${pct}% (${pct === 5 ? "Mild" : pct === 10 ? "Moderate" : "Severe"})`}
                        color={pct === 5 ? "#16A34A" : pct === 10 ? "#D97706" : "#DC2626"}
                        selected={dehydPct === pct}
                        onPress={() => setDehydPct(pct)}
                        isDark={isDark}
                      />
                    ))}
                  </View>

                  <View style={[styles.resultBox, { backgroundColor: "#D9770615", borderColor: "#D9770640", marginTop: 8 }]}>
                    <Text style={[styles.resultLabel, { color: "#D97706" }]}>Fluid Deficit</Text>
                    <Row label="Deficit volume" value={`${deficit} mL`} isDark={isDark} />
                    <Row label="Replace over 48h (+ maintenance)" value={`${total48h} mL/day`} isDark={isDark} />
                    <Row label="Total hourly rate" value={`${+(total48h / 24).toFixed(1)} mL/hr`} isDark={isDark} />
                    <Text style={[styles.refText, { color: textMuted, marginTop: 6 }]}>
                      Deficit = {dehydPct}% × {fluidWtNum} kg × 1000 = {deficit} mL{"\n"}
                      Replace deficit over 48h + maintenance. Reassess frequently.
                    </Text>
                  </View>

                  {/* KCl toggle — Maintenance & Dehydration only */}
                  {(scenario === "maintenance" || scenario === "dehydration") && (
                    <View style={[styles.kClRow, { marginTop: 8 }]}>
                      <TouchableOpacity
                        onPress={() => setKClToggle(!kClToggle)}
                        style={[styles.kClToggle, { backgroundColor: kClToggle ? (isDark ? "#16A34A" : "#16A34A") : (isDark ? "#0A192F" : "#F8FAFC"), borderColor: kClToggle ? "#16A34A" : border }]}
                      >
                        <Feather name={kClToggle ? "check-square" : "square"} size={16} color={kClToggle ? "#FFF" : textMuted} />
                        <Text style={[styles.kClToggleText, { color: kClToggle ? "#FFF" : textPrimary }]}>+20 mEq/L KCl</Text>
                      </TouchableOpacity>
                      {kClToggle && (
                        <View style={[styles.alertBanner, { backgroundColor: isDark ? "#450A0A" : "#FEE2E2", borderColor: isDark ? "#DC2626" : "#F87171" }]}>
                          <Feather name="alert-triangle" size={14} color="#DC2626" />
                          <Text style={[styles.alertBannerText, { color: "#DC2626" }]}>
                            ⚠ MUST confirm adequate urine output before KCl addition.
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Scenario-based fluid recommendation + alerts */}
                  <ScenarioFluidPanel
                    scenario={scenario}
                    kCl={kClToggle}
                    isDark={isDark}
                    textMuted={textMuted}
                    textPrimary={textPrimary}
                  />
                </>
              )}
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 7B: ELECTROLYTE CORRECTION ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["electrolytes"] = el; }}>
          <SectionHeader
            title="Electrolyte Correction — K⁺"
            icon="zap"
            color="#0891B2"
            open={openSection === "electrolytes"}
            onToggle={() => toggle("electrolytes")}
            isDark={isDark}
          />
          {openSection === "electrolytes" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>

              {/* Header */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#0891B2", letterSpacing: 0.3 }}>
                    Potassium (K⁺) Correction Calculator
                  </Text>
                  <Text style={{ fontSize: 10, color: textMuted, marginTop: 1 }}>
                    Deficit = (Target − Actual) × Weight × 0.4 · KCl 2 mEq/mL ampoule
                  </Text>
                </View>
                <StarButton isFav={isFav("tool-electrolytes")} onToggle={() => toggleFav({ id: "tool-electrolytes", type: "tool", label: "Electrolyte Correction", color: "#0891B2" })} size={18} color="#0891B2" />
              </View>

              {/* ── Inputs ── */}
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: textMuted, marginBottom: 4 }]}>Actual K⁺ (mEq/L)</Text>
                  <TextInput
                    style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                    value={elActualK}
                    onChangeText={setElActualK}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 2.8"
                    placeholderTextColor={textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: textMuted, marginBottom: 4 }]}>Target K⁺ (mEq/L)</Text>
                  <TextInput
                    style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                    value={elTargetK}
                    onChangeText={setElTargetK}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 4.0"
                    placeholderTextColor={textMuted}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={[styles.inputLabel, { color: textMuted, marginBottom: 4 }]}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                  value={elWt}
                  onChangeText={setElWt}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 15"
                  placeholderTextColor={textMuted}
                />
              </View>

              {/* ── Toggles: Central Line + Fluid Restriction ── */}
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                <TouchableOpacity
                  onPress={() => setElCentral(!elCentral)}
                  style={{
                    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center",
                    backgroundColor: elCentral ? "#0891B2" : (isDark ? "#1E293B" : "#F1F5F9"),
                    borderWidth: 2, borderColor: elCentral ? "#0891B2" : (isDark ? "#334155" : "#CBD5E1"),
                  }}
                >
                  <Text style={{ fontWeight: "700", fontSize: 12, color: elCentral ? "#FFFFFF" : textMuted }}>
                    🏥 Central Line
                  </Text>
                  <Text style={{ fontSize: 10, color: elCentral ? "#E0F7FA" : textMuted, marginTop: 2 }}>
                    {elCentral ? "80 mEq/L max" : "Peripheral"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setElRestrictFluids(!elRestrictFluids)}
                  style={{
                    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center",
                    backgroundColor: elRestrictFluids ? "#7C3AED" : (isDark ? "#1E293B" : "#F1F5F9"),
                    borderWidth: 2, borderColor: elRestrictFluids ? "#7C3AED" : (isDark ? "#334155" : "#CBD5E1"),
                  }}
                >
                  <Text style={{ fontWeight: "700", fontSize: 12, color: elRestrictFluids ? "#FFFFFF" : textMuted }}>
                    💧 Restrict Fluids
                  </Text>
                  <Text style={{ fontSize: 10, color: elRestrictFluids ? "#EDE9FE" : textMuted, marginTop: 2 }}>
                    {elRestrictFluids ? "High-conc. recipe" : "Standard volume"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ── Safety Checklist ── */}
              <View style={{ backgroundColor: isDark ? "#0F172A" : "#FEF9C3", borderColor: isDark ? "#334155" : "#FDE047", borderWidth: 1.5, borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "800", color: "#B45309", marginBottom: 8 }}>
                  ⚠ Safety Checklist — Required Before Infusion
                </Text>
                {([
                  { key: "renal", label: "Renal function (Cr / BUN) checked?" },
                  { key: "ecg",   label: "Baseline ECG performed?" },
                  { key: "mg",    label: "Magnesium levels normal (≥ 0.7 mmol/L)?" },
                ] as { key: keyof typeof elChecklist; label: string }[]).map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setElChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 }}
                  >
                    <View style={{
                      width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                      borderColor: elChecklist[item.key] ? "#16A34A" : "#D97706",
                      backgroundColor: elChecklist[item.key] ? "#16A34A" : "transparent",
                      justifyContent: "center", alignItems: "center",
                    }}>
                      {elChecklist[item.key] && <Feather name="check" size={13} color="#FFFFFF" />}
                    </View>
                    <Text style={{ flex: 1, fontSize: 13, color: elChecklist[item.key] ? "#16A34A" : (isDark ? "#FDE68A" : "#92400E"), fontWeight: elChecklist[item.key] ? "600" : "400" }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                {!elChecklistDone && (
                  <Text style={{ fontSize: 11, color: "#B45309", marginTop: 6, fontStyle: "italic" }}>
                    Tick all 3 items to unlock the calculation result.
                  </Text>
                )}
              </View>

              {/* ── Results — only shown when checklist complete ── */}
              {elDeficit > 0 && elChecklistDone && (
                <View style={{ gap: 8 }}>

                  {/* Total Deficit card */}
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <View style={{ flex: 1, backgroundColor: "#0891B220", borderColor: "#0891B250", borderWidth: 1.5, borderRadius: 10, padding: 12, alignItems: "center" }}>
                      <Text style={{ fontSize: 11, color: textMuted, fontWeight: "600", marginBottom: 2 }}>TOTAL DEFICIT</Text>
                      <Text style={{ fontSize: 26, fontWeight: "800", color: "#0891B2" }}>{elDeficit}</Text>
                      <Text style={{ fontSize: 12, color: textMuted }}>mEq</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "#0891B220", borderColor: "#0891B250", borderWidth: 1.5, borderRadius: 10, padding: 12, alignItems: "center" }}>
                      <Text style={{ fontSize: 11, color: textMuted, fontWeight: "600", marginBottom: 2 }}>RATE</Text>
                      <Text style={{ fontSize: 26, fontWeight: "800", color: "#0891B2" }}>{elRateMLHr}</Text>
                      <Text style={{ fontSize: 12, color: textMuted }}>mL/hr</Text>
                    </View>
                  </View>

                  {/* Dilution Recipe */}
                  <View style={{ backgroundColor: isDark ? "#0A192F" : "#EFF6FF", borderColor: isDark ? "#1E3A5F" : "#BFDBFE", borderWidth: 1, borderRadius: 10, padding: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: "800", color: "#2563EB", marginBottom: 6 }}>
                      {(elCentral || elRestrictFluids) ? "Central / Fluid-Restricted Recipe" : "Peripheral Line Recipe"}
                    </Text>
                    <Text style={{ fontSize: 13, color: textPrimary, lineHeight: 20 }}>
                      {"• KCl drawn: "}<Text style={{ fontWeight: "700", color: "#0891B2" }}>{elKClML} mL</Text>{" from 2 mEq/mL ampoule\n"}
                      {"• Add NS: "}<Text style={{ fontWeight: "700", color: "#0891B2" }}>{elNSML} mL\n</Text>
                      {"• Total syringe: "}<Text style={{ fontWeight: "700", color: "#0891B2" }}>{elTotalVol} mL\n</Text>
                      {"• Concentration: "}<Text style={{ fontWeight: "700", color: "#0891B2" }}>{(elCentral || elRestrictFluids) ? "80" : "40"} mEq/L</Text>
                      {(elCentral || elRestrictFluids) ? " (Central / Restricted)" : " (Peripheral — max safe)"}
                    </Text>
                    <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: isDark ? "#1E3A5F" : "#BFDBFE" }}>
                      <Text style={{ fontSize: 12, color: textMuted }}>
                        {"Infusion duration: ~"}<Text style={{ fontWeight: "700", color: "#0891B2" }}>{elDurationHr} hr</Text>
                        {"  ·  Rate: "}<Text style={{ fontWeight: "700" }}>{(elCentral ? 0.5 : 0.3)} mEq/kg/hr</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Warnings */}
                  <View style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", borderWidth: 1, borderRadius: 10, padding: 10 }}>
                    <Text style={{ fontSize: 11, color: "#DC2626", fontWeight: "700", marginBottom: 4 }}>⚠ Clinical Warnings</Text>
                    <Text style={{ fontSize: 11, color: "#991B1B", lineHeight: 18 }}>
                      {"• Max peripheral KCl: 40 mEq/L — extravasation risk at higher conc.\n"}
                      {"• Central line required if concentration > 40 mEq/L\n"}
                      {"• Never give KCl bolus IV — fatal arrhythmia risk\n"}
                      {"• Continuous cardiac monitoring (ECG) during infusion\n"}
                      {"• Recheck K⁺ level 1–2 hr after infusion"}
                    </Text>
                  </View>
                </View>
              )}

              {/* Placeholder when inputs incomplete */}
              {(elDeficit <= 0 || !elChecklistDone) && elActualKNum > 0 && elWtNum > 0 && (
                <View style={{ padding: 12, borderRadius: 10, backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0", borderWidth: 1 }}>
                  <Text style={{ color: textMuted, fontSize: 13, textAlign: "center" }}>
                    {!elChecklistDone
                      ? "Complete the safety checklist above to view results."
                      : elTargetKNum <= elActualKNum
                        ? "Target K⁺ must be higher than Actual K⁺ to calculate a deficit."
                        : "Enter all values above."}
                  </Text>
                </View>
              )}

              {/* Branding footer */}
              <Text style={[styles.refText, { color: textMuted, marginTop: 12 }]}>
                Calculations based on Nelson's Pediatrics 22e · Harriet Lane 23e
              </Text>
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 8: pGCS ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["gcs"] = el; }}>
          <SectionHeader
            title="Pediatric GCS (pGCS)"
            icon="activity"
            color="#16A34A"
            open={openSection === "gcs"}
            onToggle={() => toggle("gcs")}
            isDark={isDark}
          />
          {openSection === "gcs" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 }}>
                <StarButton isFav={isFav("tool-gcs")} onToggle={() => toggleFav({ id: "tool-gcs", type: "tool", label: "Pediatric GCS", color: "#16A34A" })} size={18} color="#16A34A" />
              </View>
              <Text style={[styles.refText, { color: textMuted }]}>
                Modified GCS for verbal children and infants (Reilly et al. 1988 / PALS 2025).
                Score range: 3 (deep coma) – 15 (normal).
              </Text>

              {/* Eye response */}
              <Text style={[styles.gcsLabel, { color: textPrimary }]}>Eye Opening (E) — selected: {eye}</Text>
              <GCSOption options={EYE_OPTIONS} selected={eye} onSelect={setEye} isDark={isDark} />

              {/* Verbal */}
              <Text style={[styles.gcsLabel, { color: textPrimary }]}>Verbal Response (V) — selected: {verbal}</Text>
              <GCSOption options={VERBAL_OPTIONS} selected={verbal} onSelect={setVerbal} isDark={isDark} />

              {/* Motor */}
              <Text style={[styles.gcsLabel, { color: textPrimary }]}>Motor Response (M) — selected: {motor}</Text>
              <GCSOption options={MOTOR_OPTIONS} selected={motor} onSelect={setMotor} isDark={isDark} />

              {/* Result */}
              <View style={[styles.resultBox, { backgroundColor: gcsResult.color + "15", borderColor: gcsResult.color + "40" }]}>
                <Text style={[styles.resultLabel, { color: gcsResult.color, fontSize: 24 }]}>
                  pGCS = {gcsTotal} / 15
                </Text>
                <Text style={[styles.resultNote, { color: textMuted }]}>
                  E{eye} + V{verbal} + M{motor} = {gcsTotal}
                </Text>
                <Text style={[styles.resultNote, { color: gcsResult.color, fontWeight: "700" }]}>{gcsResult.label}</Text>
              </View>

              <TouchableOpacity
                onPress={() => { setEye(4); setVerbal(5); setMotor(6); }}
                style={[styles.resetBundleBtn, { justifyContent: "center" }]}
              >
                <Feather name="rotate-ccw" size={14} color={textMuted} />
                <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset GCS</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 8.5: ADVANCED ICU SCORES ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["scores"] = el; }}>
          <SectionHeader
            title="Advanced ICU Scores (FOUR, OSI, SIPA, WAT-1)"
            icon="activity"
            color="#FF4C60"
            open={openSection === "scores"}
            onToggle={() => toggle("scores")}
            isDark={isDark}
          />
          {openSection === "scores" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              {/* Score selector */}
              <View style={styles.chipRow}>
                {[
                  { key: "four", label: "FOUR Score", color: "#0891B2" },
                  { key: "osi", label: "OSI", color: "#0EA5E9" },
                  { key: "sipa", label: "SIPA", color: "#D97706" },
                  { key: "wat1", label: "WAT-1", color: "#FF4C60" },
                ].map((s) => (
                  <Chip key={s.key} label={s.label} color={s.color} selected={scoreTab === (s.key as any)} onPress={() => setScoreTab(s.key as any)} isDark={isDark} />
                ))}
              </View>

              {/* FOUR Score */}
              {scoreTab === "four" && (
                <>
                  <Text style={[styles.refText, { color: textMuted }]}>Full Outline of UnResponsiveness (Wijdicks et al. 2005). Range 0–16.</Text>
                  {[
                    { label: "Eye Response", options: FOUR_EYE, value: fourEye, setter: setFourEye },
                    { label: "Motor Response", options: FOUR_MOTOR, value: fourMotor, setter: setFourMotor },
                    { label: "Brainstem Reflexes", options: FOUR_BRAINSTEM, value: fourBrainstem, setter: setFourBrainstem },
                    { label: "Respiration", options: FOUR_RESP, value: fourResp, setter: setFourResp },
                  ].map((section) => (
                    <View key={section.label} style={{ marginTop: 8 }}>
                      <Text style={[styles.gcsLabel, { color: textPrimary }]}>{section.label} — selected: {section.value}</Text>
                      <View style={styles.gcsGroup}>
                        {section.options.map((opt) => (
                          <TouchableOpacity
                            key={opt.value}
                            onPress={() => section.setter(opt.value)}
                            style={[styles.gcsOption, { borderColor: section.value === opt.value ? section.value === 4 ? "#16A34A" : "#0891B2" : border, backgroundColor: section.value === opt.value ? (isDark ? "#0891B220" : "#E0F2FE") : "transparent" }]}
                          >
                            <View style={[styles.gcsRadio, { borderColor: section.value === opt.value ? "#0891B2" : textMuted }]}>
                              {section.value === opt.value && <View style={[styles.gcsRadioDot, { backgroundColor: "#0891B2" }]} />}
                            </View>
                            <Text style={[styles.gcsOptionText, { color: section.value === opt.value ? textPrimary : textMuted }]}>{opt.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                  <View style={[styles.resultBox, { backgroundColor: fourInterpret.color + "15", borderColor: fourInterpret.color + "40" }]}>
                    <Text style={[styles.resultLabel, { color: fourInterpret.color, fontSize: 22 }]}>FOUR = {fourTotal} / 16</Text>
                    <Text style={[styles.resultNote, { color: fourInterpret.color, fontWeight: "700" }]}>{fourInterpret.label}</Text>
                  </View>
                  <TouchableOpacity onPress={() => { setFourEye(4); setFourMotor(4); setFourBrainstem(4); setFourResp(4); }} style={[styles.resetBundleBtn, { justifyContent: "center" }]}>
                    <Feather name="rotate-ccw" size={14} color={textMuted} />
                    <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset FOUR Score</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* OSI */}
              {scoreTab === "osi" && (
                <>
                  <Text style={[styles.refText, { color: textMuted }]}>
                    Oxygen Saturation Index (OSI) — Severe et al. 2014{"\n"}
                    Formula: OSI = (MAP × FiO₂%) / SpO₂%
                  </Text>
                  <View style={styles.inputRow}>
                    <View style={[styles.inputWrap, { flex: 1, marginRight: 6 }]}>
                      <Text style={[styles.inputLabel, { color: textMuted }]}>MAP (mmHg)</Text>
                      <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]} value={osiMap} onChangeText={setOsiMap} keyboardType="decimal-pad" placeholder="e.g. 70" placeholderTextColor={textMuted} />
                    </View>
                    <View style={[styles.inputWrap, { flex: 1, marginRight: 6 }]}>
                      <Text style={[styles.inputLabel, { color: textMuted }]}>FiO₂ (%)</Text>
                      <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]} value={osiFio2} onChangeText={setOsiFio2} keyboardType="decimal-pad" placeholder="e.g. 40" placeholderTextColor={textMuted} />
                    </View>
                    <View style={[styles.inputWrap, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: textMuted }]}>SpO₂ (%)</Text>
                      <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]} value={osiSpo2} onChangeText={setOsiSpo2} keyboardType="decimal-pad" placeholder="e.g. 95" placeholderTextColor={textMuted} />
                    </View>
                  </View>
                  {osiVal !== null && osiInterp && (
                    <View style={[styles.resultBox, { backgroundColor: osiInterp.color + "15", borderColor: osiInterp.color + "40" }]}>
                      <Text style={[styles.resultLabel, { color: osiInterp.color }]}>OSI = {osiVal}</Text>
                      <Text style={[styles.resultNote, { color: osiInterp.color, fontWeight: "700" }]}>{osiInterp.label}</Text>
                    </View>
                  )}
                </>
              )}

              {/* SIPA */}
              {scoreTab === "sipa" && (
                <>
                  <Text style={[styles.refText, { color: textMuted }]}>
                    Pediatric Age-Adjusted Shock Index (SIPA){"\n"}
                    SI = HR / SBP · Compare to age-specific threshold
                  </Text>
                  <View style={styles.inputRow}>
                    <View style={[styles.inputWrap, { flex: 1, marginRight: 6 }]}>
                      <Text style={[styles.inputLabel, { color: textMuted }]}>Age</Text>
                      <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]} value={sipaAge} onChangeText={setSipaAge} keyboardType="decimal-pad" placeholder="e.g. 5" placeholderTextColor={textMuted} />
                    </View>
                    <View style={[styles.inputWrap, { flex: 1, marginRight: 6 }]}>
                      <Text style={[styles.inputLabel, { color: textMuted }]}>HR (bpm)</Text>
                      <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]} value={sipaHR} onChangeText={setSipaHR} keyboardType="decimal-pad" placeholder="e.g. 140" placeholderTextColor={textMuted} />
                    </View>
                    <View style={[styles.inputWrap, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: textMuted }]}>SBP (mmHg)</Text>
                      <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]} value={sipaSBP} onChangeText={setSipaSBP} keyboardType="decimal-pad" placeholder="e.g. 80" placeholderTextColor={textMuted} />
                    </View>
                  </View>
                  <View style={styles.chipRow}>
                    <Chip label="Years" color="#D97706" selected={sipaAgeUnit === "years"} onPress={() => setSipaAgeUnit("years")} isDark={isDark} />
                    <Chip label="Months" color="#D97706" selected={sipaAgeUnit === "months"} onPress={() => setSipaAgeUnit("months")} isDark={isDark} />
                  </View>
                  {sipaSi !== null && (
                    <>
                      <View style={[styles.resultBox, { backgroundColor: sipaAlert ? "#FEE2E2" : "#DCFCE715", borderColor: sipaAlert ? "#FCA5A5" : "#86EFAC40" }]}>
                        <Text style={[styles.resultLabel, { color: sipaAlert ? "#DC2626" : "#16A34A" }]}>SIPA = {sipaSi} (threshold: {sipaThresholdVal})</Text>
                        <Text style={[styles.resultNote, { color: sipaAlert ? "#DC2626" : "#16A34A", fontWeight: "700" }]}>
                          {sipaAlert ? "SIPA ABOVE threshold — possible shock" : "SIPA within normal limits"}
                        </Text>
                      </View>
                    </>
                  )}
                </>
              )}

              {/* WAT-1 */}
              {scoreTab === "wat1" && (
                <>
                  <Text style={[styles.refText, { color: textMuted }]}>
                    Withdrawal Assessment Tool-1 (WAT-1) — Franck et al. 2012{"\n"}
                    Standard 11-item protocol. Range 0–12. Score ≥3 = significant withdrawal.
                  </Text>

                  {/* Section 1: Past 12 Hours */}
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 6 }]}>Section 1: Past 12 Hours</Text>
                  {WAT1_PAST12.map((item, i) => (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => setWat1Past12((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                      style={styles.checkItem}
                    >
                      <View style={[styles.checkbox, { backgroundColor: wat1Past12[i] ? "#FF4C60" : "transparent", borderColor: wat1Past12[i] ? "#FF4C60" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                        {wat1Past12[i] && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      <Text style={[styles.checkLabel, { color: wat1Past12[i] ? textMuted : textPrimary, textDecorationLine: wat1Past12[i] ? "line-through" : "none" }]}>
                        {item.label} <Text style={{ color: textMuted, fontWeight: "700" }}>(+{item.points})</Text>
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Section 2: 2-Minute Observation */}
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 6 }]}>Section 2: 2-Minute Observation</Text>
                  {WAT1_OBS2MIN.map((item, i) => (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => setWat1Obs2((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                      style={styles.checkItem}
                    >
                      <View style={[styles.checkbox, { backgroundColor: wat1Obs2[i] ? "#FF4C60" : "transparent", borderColor: wat1Obs2[i] ? "#FF4C60" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                        {wat1Obs2[i] && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      <Text style={[styles.checkLabel, { color: wat1Obs2[i] ? textMuted : textPrimary, textDecorationLine: wat1Obs2[i] ? "line-through" : "none" }]}>
                        {item.label} <Text style={{ color: textMuted, fontWeight: "700" }}>(+{item.points})</Text>
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Section 3: Stimulus Observation */}
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 6 }]}>Section 3: Stimulus Observation</Text>
                  {WAT1_STIMULUS.map((item, i) => (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => setWat1Stim((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                      style={styles.checkItem}
                    >
                      <View style={[styles.checkbox, { backgroundColor: wat1Stim[i] ? "#FF4C60" : "transparent", borderColor: wat1Stim[i] ? "#FF4C60" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                        {wat1Stim[i] && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      <Text style={[styles.checkLabel, { color: wat1Stim[i] ? textMuted : textPrimary, textDecorationLine: wat1Stim[i] ? "line-through" : "none" }]}>
                        {item.label} <Text style={{ color: textMuted, fontWeight: "700" }}>(+{item.points})</Text>
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Time to calm state — pill selector */}
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 6 }]}>Time to gain calm state</Text>
                  <View style={styles.pillRow}>
                    {WAT1_CALM_TIME.map((opt) => (
                      <TouchableOpacity
                        key={opt.label}
                        onPress={() => setWat1CalmTime(opt.points)}
                        style={[
                          styles.pillBtn,
                          {
                            backgroundColor: wat1CalmTime === opt.points ? "#FF4C60" : isDark ? "#0A192F" : "#F8FAFC",
                            borderColor: wat1CalmTime === opt.points ? "#FF4C60" : border,
                          },
                        ]}
                      >
                        <Text style={[styles.pillText, { color: wat1CalmTime === opt.points ? "#FFFFFF" : textMuted }]}>
                          {opt.label} ({opt.points > 0 ? `+${opt.points}` : opt.points})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* WAT-1 Total */}
                  <View style={[styles.resultBox, { backgroundColor: wat1Interpret.color + "15", borderColor: wat1Interpret.color + "40" }]}>
                    <Text style={[styles.resultLabel, { color: wat1Interpret.color, fontSize: 22 }]}>WAT-1 Score = {wat1Score} / 12</Text>
                    <Text style={[styles.resultNote, { color: wat1Interpret.color, fontWeight: "700" }]}>
                      {wat1Interpret.label}
                    </Text>
                    <Text style={[styles.refText, { color: textMuted, marginTop: 4 }]}>
                      {wat1Score <= 2 ? "Routine monitoring" : "Consider weaning / sedation adjustment"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setWat1Past12(WAT1_PAST12.map(() => false));
                      setWat1Obs2(WAT1_OBS2MIN.map(() => false));
                      setWat1Stim(WAT1_STIMULUS.map(() => false));
                      setWat1CalmTime(0);
                    }}
                    style={[styles.resetBundleBtn, { justifyContent: "center" }]}
                  >
                    <Feather name="rotate-ccw" size={14} color={textMuted} />
                    <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset WAT-1</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 9: RENAL / HEPATIC ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["renal"] = el; }}>
          <SectionHeader
            title="Renal & Hepatic Dose Adjustments"
            icon="shield"
            color="#DC2626"
            open={openSection === "renal"}
            onToggle={() => toggle("renal")}
            isDark={isDark}
          />
          {openSection === "renal" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <View style={styles.chipRow}>
                <Chip label="Renal" color="#DC2626" selected={renalTab === "renal"} onPress={() => setRenalTab("renal")} isDark={isDark} />
                <Chip label="Hepatic" color="#D97706" selected={renalTab === "hepatic"} onPress={() => setRenalTab("hepatic")} isDark={isDark} />
              </View>

              {renalTab === "renal" && (
                <>
                  {/* Schwartz eGFR */}
                  <View style={[styles.infoBox, { backgroundColor: isDark ? "#1C0A0A" : "#FFF1F1", borderColor: isDark ? "#4A1A1A" : "#FCA5A5" }]}>
                    <Text style={[styles.infoTitle, { color: "#DC2626" }]}>Schwartz eGFR (Paediatric)</Text>
                    <Text style={[styles.refText, { color: textMuted }]}>eGFR = 0.413 × Height(cm) / Serum Creatinine(mg/dL)</Text>
                    <View style={styles.inputRow}>
                      <View style={[styles.inputWrap, { flex: 1, marginRight: 6 }]}>
                        <Text style={[styles.inputLabel, { color: textMuted }]}>Height (cm)</Text>
                        <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                          value={crclHt} onChangeText={setCrclHt} keyboardType="decimal-pad" placeholder="e.g. 90" placeholderTextColor={textMuted} />
                      </View>
                      <View style={[styles.inputWrap, { flex: 1 }]}>
                        <Text style={[styles.inputLabel, { color: textMuted }]}>Creatinine (mg/dL)</Text>
                        <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                          value={crclCr} onChangeText={setCrclCr} keyboardType="decimal-pad" placeholder="e.g. 0.5" placeholderTextColor={textMuted} />
                      </View>
                    </View>
                    {schwartz !== null && (
                      <View style={[styles.resultBox, { backgroundColor: crclSeverity(schwartz).color + "15", borderColor: crclSeverity(schwartz).color + "40" }]}>
                        <Text style={[styles.resultLabel, { color: crclSeverity(schwartz).color }]}>eGFR = {schwartz} mL/min/1.73m²</Text>
                        <Text style={[styles.resultNote, { color: textMuted }]}>{crclSeverity(schwartz).label}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 12 }]}>Drug Adjustments in Renal Failure</Text>
                  {RENAL_DRUGS.map((d) => (
                    <View key={d.drug} style={[styles.drugAdjRow, { borderLeftColor: d.alert === "high" ? "#DC2626" : d.alert === "moderate" ? "#D97706" : "#16A34A", backgroundColor: isDark ? "#0A192F" : "#F8FAFC" }]}>
                      <View style={styles.drugAdjHeader}>
                        <Text style={[styles.drugAdjName, { color: textPrimary }]}>{d.drug}</Text>
                        <View style={[styles.alertBadge, { backgroundColor: d.alert === "high" ? "#DC262620" : d.alert === "moderate" ? "#D9770620" : "#16A34A20" }]}>
                          <Text style={[styles.alertBadgeText, { color: d.alert === "high" ? "#DC2626" : d.alert === "moderate" ? "#D97706" : "#16A34A" }]}>
                            {d.alert === "high" ? "HIGH RISK" : d.alert === "moderate" ? "CAUTION" : "LOW RISK"}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.drugAdjText, { color: textMuted }]}>{d.adj}</Text>
                    </View>
                  ))}
                </>
              )}

              {renalTab === "hepatic" && (
                <>
                  <View style={[styles.infoBox, { backgroundColor: isDark ? "#1A0D00" : "#FFFBEB", borderColor: isDark ? "#4A2800" : "#FCD34D" }]}>
                    <Text style={[styles.infoTitle, { color: "#D97706" }]}>Hepatic Failure — General Principles</Text>
                    <Text style={[styles.infoText, { color: textMuted }]}>
                      {"• Most sedatives, opioids, and antimicrobials are hepatically metabolised\n• Child-Pugh score guides severity: A (5–6), B (7–9), C (10–15)\n• Avoid nephrotoxic drugs — hepatorenal syndrome risk\n• Monitor coagulation (PT/INR) and ammonia regularly\n• Anticipate prolonged drug effect — titrate slowly"}
                    </Text>
                  </View>
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 12 }]}>Drug Adjustments in Hepatic Failure</Text>
                  {HEPATIC_DRUGS.map((d) => (
                    <View key={d.drug} style={[styles.drugAdjRow, { borderLeftColor: d.alert === "high" ? "#DC2626" : "#D97706", backgroundColor: isDark ? "#0A192F" : "#F8FAFC" }]}>
                      <View style={styles.drugAdjHeader}>
                        <Text style={[styles.drugAdjName, { color: textPrimary }]}>{d.drug}</Text>
                        <View style={[styles.alertBadge, { backgroundColor: d.alert === "high" ? "#DC262620" : "#D9770620" }]}>
                          <Text style={[styles.alertBadgeText, { color: d.alert === "high" ? "#DC2626" : "#D97706" }]}>
                            {d.alert === "high" ? "HIGH RISK" : "CAUTION"}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.drugAdjText, { color: textMuted }]}>{d.adj}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </View>

        {/* ──────────────── PEWS ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["pews"] = el; }}>
          <SectionHeader title="PEWS Score" icon="activity" color="#FF4C60" open={openSection === "pews"} onToggle={() => toggle("pews")} isDark={isDark} />
          {openSection === "pews" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 }}>
                <StarButton isFav={isFav("tool-pews")} onToggle={() => toggleFav({ id: "tool-pews", type: "tool", label: "PEWS Score", color: "#FF4C60" })} size={18} color="#FF4C60" />
              </View>
              <Text style={[styles.refText, { color: textMuted }]}>Pediatric Early Warning Score (PEWS) — 3 categories 0–3 each. Total 0–9.</Text>
              {[
                { l: "Behavior", v: pewsB, s: setPewsB },
                { l: "Cardiovascular", v: pewsCv, s: setPewsCv },
                { l: "Respiratory", v: pewsR, s: setPewsR },
              ].map((x) => (
                <View key={x.l} style={{ marginTop: 8 }}>
                  <Text style={[styles.inputLabel, { color: textMuted }]}>{x.l} (0–3)</Text>
                  <View style={styles.pillRow}>
                    {[0, 1, 2, 3].map((n) => (
                      <TouchableOpacity
                        key={n}
                        onPress={() => x.s(n.toString())}
                        style={[
                          styles.pillBtn,
                          {
                            backgroundColor: x.v === n.toString() ? "#FF4C60" : isDark ? "#0A192F" : "#F8FAFC",
                            borderColor: x.v === n.toString() ? "#FF4C60" : border,
                          },
                        ]}
                      >
                        <Text style={[styles.pillText, { color: x.v === n.toString() ? "#FFFFFF" : textMuted }]}>{n}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
              <View style={[styles.resultBox, { backgroundColor: pewsAlert ? "#FF4C6015" : "#16A34A15", borderColor: pewsAlert ? "#FF4C6040" : "#16A34A40" }]}>
                <Text style={[styles.resultLabel, { color: pewsAlert ? "#FF4C60" : "#16A34A" }]}>PEWS = {pewsSum} / 9</Text>
                <Text style={[styles.resultNote, { color: pewsAlert ? "#FF4C60" : "#16A34A", fontWeight: "700" }]}>
                  {pewsAlert ? "\u26a0 Urgent: Activate Rapid Response" : "Routine monitoring"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ──────────────── APGAR Score ──────────────── */}
        <View style={styles.sectionWrap} ref={(el) => { sectionRefs.current["apgar"] = el; }}>
          <SectionHeader
            title="APGAR Score (1 & 5 min)"
            icon="heart"
            color="#EC4899"
            open={openSection === "apgar"}
            onToggle={() => toggle("apgar")}
            isDark={isDark}
          />
          {openSection === "apgar" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 }}>
                <StarButton isFav={isFav("tool-apgar")} onToggle={() => toggleFav({ id: "tool-apgar", type: "tool", label: "APGAR Score", color: "#EC4899" })} size={18} color="#EC4899" />
              </View>
              <Text style={[styles.refText, { color: textMuted }]}>
                Neonatal assessment at 1 and 5 minutes. Score range: 0–10.
              </Text>

              {apgarItems.map((item) => (
                <View key={item.key} style={{ marginTop: 10 }}>
                  <Text style={[styles.gcsLabel, { color: textPrimary }]}>
                    {item.key} — <Text style={{ color: textMuted, fontWeight: "400" }}>selected: {item.value ?? "—"}</Text>
                  </Text>
                  <View style={styles.pillRow}>
                    {item.options.map((opt) => (
                      <TouchableOpacity
                        key={opt.score}
                        onPress={() => item.setter(opt.score)}
                        style={[
                          styles.pillBtn,
                          {
                            backgroundColor: item.value === opt.score ? "#EC4899" : isDark ? "#0A192F" : "#F8FAFC",
                            borderColor: item.value === opt.score ? "#EC4899" : border,
                          },
                        ]}
                      >
                        <Text style={[styles.pillText, { color: item.value === opt.score ? "#FFFFFF" : textMuted }]}>
                          {opt.score}
                        </Text>
                        <Text style={{ fontSize: 10, color: item.value === opt.score ? "#FFFFFF" : textMuted, marginTop: 2, fontWeight: "500" }}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              <View style={[styles.resultBox, { backgroundColor: apgarTotal >= 7 ? "#16A34A15" : apgarTotal >= 4 ? "#F59E0B15" : "#FEE2E2", borderColor: apgarTotal >= 7 ? "#16A34A40" : apgarTotal >= 4 ? "#F59E0B40" : "#FCA5A5", marginTop: 14 }]}>
                <Text style={[styles.resultLabel, { color: apgarTotal >= 7 ? "#16A34A" : apgarTotal >= 4 ? "#F59E0B" : "#DC2626" }]}>APGAR = {apgarTotal} / 10</Text>
                <Text style={[styles.resultNote, { color: apgarTotal >= 7 ? "#16A34A" : apgarTotal >= 4 ? "#F59E0B" : "#DC2626", fontWeight: "700" }]}>
                  {apgarTotal >= 7 ? "Normal" : apgarTotal >= 4 ? "Moderately depressed" : "Severely depressed"}
                </Text>
                <Text style={[styles.refText, { color: textMuted, marginTop: 4 }]}>
                  {apgarTotal < 7 ? "If HR < 100: PPV. If HR < 60: CPR + Epi" : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => { setApgarA(null); setApgarP(null); setApgarG(null); setApgarAc(null); setApgarR(null); }}
                style={[styles.resetBundleBtn, { justifyContent: "center" }]}
              >
                <Feather name="rotate-ccw" size={14} color={textMuted} />
                <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset APGAR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ProfessionalFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  headerSub: { fontSize: 12, marginTop: 2 },
  nightToggle: { padding: 10, borderRadius: 10, marginLeft: 10 },
  sectionWrap: { marginHorizontal: 14, marginTop: 10 },
  sectionHeader: {
    flexDirection: "row", alignItems: "center", padding: 14,
    borderRadius: 14, borderWidth: 1, gap: 12,
  },
  sectionIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: "700" },
  sectionBody: { borderWidth: 1, borderTopWidth: 0, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: 14, gap: 10 },
  inputWrap: { gap: 4 },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, flexWrap: "wrap" },
  inputLabel: { fontSize: 12, fontWeight: "600", marginBottom: 2 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontWeight: "600" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: "600" },
  resultBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 4, marginTop: 4 },
  resultLabel: { fontSize: 18, fontWeight: "800" },
  resultNote: { fontSize: 13, lineHeight: 18 },
  refText: { fontSize: 11, lineHeight: 16 },
  infoBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 },
  infoTitle: { fontSize: 13, fontWeight: "700" },
  infoText: { fontSize: 12, lineHeight: 18 },
  tableHeaderRow: { flexDirection: "row", paddingBottom: 6, borderBottomWidth: 1, marginBottom: 2 },
  tableHeaderCell: { flex: 1, fontSize: 11, fontWeight: "700" },
  vitalsRow: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1 },
  vitalsAge: { flex: 2, fontSize: 11, fontWeight: "600" },
  vitalsCell: { flex: 1, fontSize: 11, textAlign: "center" },
  tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  tableCell: { fontSize: 13 },
  tableCellVal: { fontSize: 13, fontWeight: "700" },
  bundleTitle: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 4 },
  progressFill: { height: 8, borderRadius: 4 },
  progressLabel: { fontSize: 12, marginBottom: 8 },
  checkItem: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 7, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#1E2D3D" },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, justifyContent: "center", alignItems: "center", marginTop: 1, flexShrink: 0 },
  checkLabel: { flex: 1, fontSize: 13, lineHeight: 18 },
  resetBundleBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 10, paddingBottom: 2 },
  resetBundleText: { fontSize: 13 },
  gcsLabel: { fontSize: 14, fontWeight: "700", marginTop: 8 },
  gcsGroup: { gap: 4 },
  gcsOption: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  gcsRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  gcsRadioDot: { width: 9, height: 9, borderRadius: 5 },
  gcsOptionText: { fontSize: 13, flex: 1 },
  drugAdjRow: { borderLeftWidth: 3, paddingLeft: 10, paddingVertical: 8, borderRadius: 6, marginBottom: 6, gap: 4 },
  drugAdjHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  drugAdjName: { fontSize: 14, fontWeight: "700" },
  alertBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  alertBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  drugAdjText: { fontSize: 12, lineHeight: 17 },
  alertBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 10, padding: 10, borderWidth: 1,
  },
  alertBannerText: { fontSize: 12, fontWeight: "700", flex: 1, lineHeight: 16 },
  kClRow: { gap: 6 },
  kClToggle: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1, alignSelf: "flex-start",
  },
  kClToggleText: { fontSize: 13, fontWeight: "700" },
  scenarioBox: {
    borderWidth: 1, borderRadius: 12, padding: 12, gap: 4,
    marginTop: 8,
  },
  scenarioLabel: { fontSize: 12, fontWeight: "600" },
  scenarioFluid: { fontSize: 14, fontWeight: "700" },
  scenarioAlert: { fontSize: 12, fontWeight: "700", flex: 1, lineHeight: 16 },
  // Chip nav styles
  chipNav: { borderBottomWidth: 1, borderBottomColor: "#1E2D3D" },
  navChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  navChipText: { fontSize: 13, fontWeight: "700" },
  // Pill selector styles
  pillRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  pillBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  pillText: { fontSize: 15, fontWeight: "700" },
});
