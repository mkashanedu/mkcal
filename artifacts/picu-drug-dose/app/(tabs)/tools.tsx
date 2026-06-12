import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

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
  if (val < p3) return { label: "<3rd percentile", color: "#DC2626", note: "Severely underweight — review nutrition/growth" };
  if (val < p15) return { label: "3rd–15th percentile", color: "#D97706", note: "Below average — monitor closely" };
  if (val < p50) return { label: "15th–50th percentile", color: "#16A34A", note: "Low-normal range" };
  if (val < p85) return { label: "50th–85th percentile", color: "#16A34A", note: "Normal range" };
  if (val < p97) return { label: "85th–97th percentile", color: "#D97706", note: "Above average — assess for obesity risk" };
  return { label: ">97th percentile", color: "#DC2626", note: "Obese range — clinical review recommended" };
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

// WAT-1 items
const WAT1_ITEMS = [
  { label: "Loose or watery stools", section: "past12" },
  { label: "Vomiting / retching / gagging", section: "past12" },
  { label: "Temperature ≥ 37.8°C", section: "past12" },
  { label: "Temperature ≤ 36.5°C", section: "past12" },
  { label: "Sweating / perspiring (not environmental)", section: "past12" },
  { label: "Tremor (not startling)", section: "obs2min" },
  { label: "Frequent yawning / sneezing", section: "obs2min" },
  { label: "Increased muscle tone", section: "obs2min" },
  { label: "Irritable / fussy (not consolable)", section: "obs2min" },
  { label: "High-pitched cry / inconsolable crying", section: "obs2min" },
  { label: "Frantic / sucking fist / rooting (after stimulus)", section: "stimulus" },
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
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const [openSection, setOpenSection] = useState<string | null>(null);
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
  const [wat1Checked, setWat1Checked] = useState<boolean[]>(WAT1_ITEMS.map(() => false));
  const wat1Score = wat1Checked.filter(Boolean).length;
  const wat1Alert = wat1Score >= 3;

  // ── Score tab selector ──
  const [scoreTab, setScoreTab] = useState<"four" | "osi" | "sipa" | "wat1">("four");

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
            <Text style={[styles.headerTitle, { color: textPrimary }]}>Clinical Tools</Text>
            <Text style={[styles.headerSub, { color: textMuted }]}>
              Growth · VIS · Bundles · Fluids · GCS · Scores · Renal
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleDark}
            style={[styles.nightToggle, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
          >
            <Feather name={isDark ? "sun" : "moon"} size={18} color={isDark ? "#FFD700" : "#4A5568"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ──────────────── MODULE 3: GROWTH CHARTS ──────────────── */}
        <View style={styles.sectionWrap}>
          <SectionHeader
            title="Growth Charts (WHO/CDC)"
            icon="bar-chart-2"
            color="#0D9488"
            open={openSection === "growth"}
            onToggle={() => toggle("growth")}
            isDark={isDark}
          />
          {openSection === "growth" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <Text style={[styles.refText, { color: textMuted }]}>WHO (0–24 mo) · CDC (2–18 yr) — Weight-for-Age percentile estimate</Text>

              {/* Sex selector */}
              <View style={styles.chipRow}>
                <Chip label="Male" color="#0D9488" selected={growthSex === "M"} onPress={() => setGrowthSex("M")} isDark={isDark} />
                <Chip label="Female" color="#7C3AED" selected={growthSex === "F"} onPress={() => setGrowthSex("F")} isDark={isDark} />
              </View>

              {/* Age input */}
              <View style={styles.inputRow}>
                <View style={styles.inputWrap}>
                  <Text style={[styles.inputLabel, { color: textMuted }]}>Age</Text>
                  <TextInput
                    style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                    value={growthAge}
                    onChangeText={setGrowthAge}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 18"
                    placeholderTextColor={textMuted}
                  />
                </View>
                <View style={styles.chipRow}>
                  <Chip label="Months" color="#0D9488" selected={growthAgeUnit === "months"} onPress={() => setGrowthAgeUnit("months")} isDark={isDark} />
                  <Chip label="Years" color="#0D9488" selected={growthAgeUnit === "years"} onPress={() => setGrowthAgeUnit("years")} isDark={isDark} />
                </View>
              </View>

              {/* Weight input */}
              <View style={styles.inputWrap}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]}
                  value={growthWeight}
                  onChangeText={setGrowthWeight}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 12.5"
                  placeholderTextColor={textMuted}
                />
              </View>

              {growthResult && growthRefs && (
                <View style={[styles.resultBox, { backgroundColor: growthResult.color + "15", borderColor: growthResult.color + "40" }]}>
                  <Text style={[styles.resultLabel, { color: growthResult.color }]}>{growthResult.label}</Text>
                  <Text style={[styles.resultNote, { color: textMuted }]}>{growthResult.note}</Text>
                  <Text style={[styles.refText, { color: textMuted, marginTop: 6 }]}>
                    Reference at age {Math.round(growthAgeMonths)} mo ({growthSex === "M" ? "Boys" : "Girls"}):
                    {" "}P3={growthRefs[0]} · P50={growthRefs[2]} · P97={growthRefs[4]} kg
                  </Text>
                </View>
              )}

              {/* HC reference */}
              <View style={[styles.infoBox, { backgroundColor: isDark ? "#0A192F" : "#EFF6FF", borderColor: isDark ? "#233554" : "#BFDBFE" }]}>
                <Text style={[styles.infoTitle, { color: "#3B82F6" }]}>Head Circumference Reference (WHO)</Text>
                <Text style={[styles.infoText, { color: textMuted }]}>
                  {"Birth: 34 cm  ·  3 mo: 40 cm  ·  6 mo: 43 cm\n12 mo: 46 cm  ·  2 yr: 48 cm  ·  Adult: ~57 cm\nMicrocephaly <2SD below mean  ·  Macrocephaly >98th %ile"}
                </Text>
              </View>

              <Text style={[styles.refText, { color: textMuted, marginTop: 4 }]}>
                Source: WHO Child Growth Standards · CDC Growth Charts 2000
              </Text>
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 5: VIS / CARDIAC ──────────────── */}
        <View style={styles.sectionWrap}>
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
        <View style={styles.sectionWrap}>
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
        <View style={styles.sectionWrap}>
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

        {/* ──────────────── MODULE 8: pGCS ──────────────── */}
        <View style={styles.sectionWrap}>
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
        <View style={styles.sectionWrap}>
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
                    Score each item present as 1 point. Total 0–12. Score ≥3 = significant withdrawal.
                  </Text>
                  {/* Past 12h */}
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 6 }]}>Past 12 Hours Record</Text>
                  {WAT1_ITEMS.filter((i) => i.section === "past12").map((item, idx) => {
                    const globalIdx = WAT1_ITEMS.findIndex((x) => x.label === item.label);
                    return (
                      <TouchableOpacity key={item.label} onPress={() => setWat1Checked((prev) => prev.map((v, j) => j === globalIdx ? !v : v))} style={styles.checkItem}>
                        <View style={[styles.checkbox, { backgroundColor: wat1Checked[globalIdx] ? "#FF4C60" : "transparent", borderColor: wat1Checked[globalIdx] ? "#FF4C60" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                          {wat1Checked[globalIdx] && <Feather name="check" size={12} color="#FFF" />}
                        </View>
                        <Text style={[styles.checkLabel, { color: wat1Checked[globalIdx] ? textMuted : textPrimary, textDecorationLine: wat1Checked[globalIdx] ? "line-through" : "none" }]}>{item.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                  {/* 2-min observation */}
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 6 }]}>2-Minute Observation</Text>
                  {WAT1_ITEMS.filter((i) => i.section === "obs2min").map((item) => {
                    const globalIdx = WAT1_ITEMS.findIndex((x) => x.label === item.label);
                    return (
                      <TouchableOpacity key={item.label} onPress={() => setWat1Checked((prev) => prev.map((v, j) => j === globalIdx ? !v : v))} style={styles.checkItem}>
                        <View style={[styles.checkbox, { backgroundColor: wat1Checked[globalIdx] ? "#FF4C60" : "transparent", borderColor: wat1Checked[globalIdx] ? "#FF4C60" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                          {wat1Checked[globalIdx] && <Feather name="check" size={12} color="#FFF" />}
                        </View>
                        <Text style={[styles.checkLabel, { color: wat1Checked[globalIdx] ? textMuted : textPrimary, textDecorationLine: wat1Checked[globalIdx] ? "line-through" : "none" }]}>{item.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                  {/* Stimulus observation */}
                  <Text style={[styles.gcsLabel, { color: textPrimary, marginTop: 6 }]}>Stimulus Observation</Text>
                  {WAT1_ITEMS.filter((i) => i.section === "stimulus").map((item) => {
                    const globalIdx = WAT1_ITEMS.findIndex((x) => x.label === item.label);
                    return (
                      <TouchableOpacity key={item.label} onPress={() => setWat1Checked((prev) => prev.map((v, j) => j === globalIdx ? !v : v))} style={styles.checkItem}>
                        <View style={[styles.checkbox, { backgroundColor: wat1Checked[globalIdx] ? "#FF4C60" : "transparent", borderColor: wat1Checked[globalIdx] ? "#FF4C60" : isDark ? "#3D5470" : "#CBD5E1" }]}>
                          {wat1Checked[globalIdx] && <Feather name="check" size={12} color="#FFF" />}
                        </View>
                        <Text style={[styles.checkLabel, { color: wat1Checked[globalIdx] ? textMuted : textPrimary, textDecorationLine: wat1Checked[globalIdx] ? "line-through" : "none" }]}>{item.label}</Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* WAT-1 Total */}
                  <View style={[styles.resultBox, { backgroundColor: wat1Alert ? "#FF4C6015" : "#16A34A15", borderColor: wat1Alert ? "#FF4C6040" : "#16A34A40" }]}>
                    <Text style={[styles.resultLabel, { color: wat1Alert ? "#FF4C60" : "#16A34A" }]}>WAT-1 Score = {wat1Score} / 12</Text>
                    {wat1Alert && (
                      <Text style={[styles.resultNote, { color: "#FF4C60", fontWeight: "700" }]}>
                        Significant withdrawal detected. Consider weaning adjustment.
                      </Text>
                    )}
                    <Text style={[styles.refText, { color: textMuted, marginTop: 4 }]}>
                      {wat1Score < 3 ? "Score < 3 — withdrawal unlikely" : "Score ≥ 3 — monitor closely and adjust sedation/analgesia"}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => setWat1Checked(WAT1_ITEMS.map(() => false))} style={[styles.resetBundleBtn, { justifyContent: "center" }]}>
                    <Feather name="rotate-ccw" size={14} color={textMuted} />
                    <Text style={[styles.resetBundleText, { color: textMuted }]}>Reset WAT-1</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>

        {/* ──────────────── MODULE 9: RENAL / HEPATIC ──────────────── */}
        <View style={styles.sectionWrap}>
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
        <View style={styles.sectionWrap}>
          <SectionHeader title="PEWS Score" icon="activity" color="#FF4C60" open={openSection === "pews"} onToggle={() => toggle("pews")} isDark={isDark} />
          {openSection === "pews" && (
            <View style={[styles.sectionBody, { backgroundColor: cardBg, borderColor: border }]}>
              <Text style={[styles.refText, { color: textMuted }]}>Pediatric Early Warning Score (PEWS) — 3 categories 0–3 each. Total 0–9.</Text>
              {[{ l: "Behavior", v: pewsB, s: setPewsB }, { l: "Cardiovascular", v: pewsCv, s: setPewsCv }, { l: "Respiratory", v: pewsR, s: setPewsR }].map((x) => (
                <View key={x.l} style={styles.inputWrap}>
                  <Text style={[styles.inputLabel, { color: textMuted }]}>{x.l} (0–3)</Text>
                  <TextInput style={[styles.input, { color: textPrimary, backgroundColor: inputBg, borderColor: border }]} value={x.v} onChangeText={x.s} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={textMuted} />
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
});
