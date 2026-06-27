import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
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
import { StarButton } from "@/components/StarButton";
import { useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

const C = Colors.light;

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeader({ title, icon, color, open, onToggle, isDark }: {
  title: string; icon: string; color: string;
  open: boolean; onToggle: () => void; isDark: boolean;
}) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.75}
      style={[sh.header, { backgroundColor: isDark ? "#112240" : "#FFF", borderColor: isDark ? "#233554" : "#E2E8F0" }]}>
      <View style={[sh.icon, { backgroundColor: color + "1A" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <Text style={[sh.title, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>{title}</Text>
      <Feather name={open ? "chevron-up" : "chevron-down"} size={20} color={isDark ? "#8892B0" : "#8A9BB0"} />
    </TouchableOpacity>
  );
}

function InputField({ label, value, onChange, placeholder, unit, isDark }: {
  label: string; value: string; onChange: (t: string) => void;
  placeholder?: string; unit?: string; isDark: boolean;
}) {
  const border = isDark ? "#233554" : "#E2E8F0";
  const bg = isDark ? "#0A192F" : "#F8FAFC";
  const text = isDark ? "#CCD6F6" : "#0D1B2A";
  const muted = isDark ? "#8892B0" : "#8A9BB0";
  return (
    <View style={sh.inputWrap}>
      <Text style={[sh.label, { color: muted }]}>{label}</Text>
      <View style={sh.inputRow}>
        <TextInput
          style={[sh.input, { color: text, backgroundColor: bg, borderColor: border, flex: 1 }]}
          value={value} onChangeText={onChange}
          keyboardType="decimal-pad" placeholder={placeholder ?? "0"}
          placeholderTextColor={muted} />
        {unit ? <Text style={[sh.unit, { color: muted }]}>{unit}</Text> : null}
      </View>
    </View>
  );
}

function ResultBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <View style={[sh.resultBox, { backgroundColor: color + "12", borderColor: color + "40" }]}>
      {children}
    </View>
  );
}

function ResultRow({ label, value, color, large }: { label: string; value: string; color: string; large?: boolean }) {
  return (
    <View style={sh.resultRow}>
      <Text style={[sh.resultLabel, { color: color + "BB" }]}>{label}</Text>
      <Text style={[sh.resultValue, { color, fontSize: large ? 22 : 16 }]}>{value}</Text>
    </View>
  );
}

function InfoBox({ color, title, text, isDark }: { color: string; title: string; text: string; isDark: boolean }) {
  return (
    <View style={[sh.infoBox, { backgroundColor: color + "10", borderColor: color + "30" }]}>
      <Text style={[sh.infoTitle, { color }]}>{title}</Text>
      <Text style={[sh.infoText, { color: isDark ? "#8892B0" : "#475569" }]}>{text}</Text>
    </View>
  );
}

function WarningBox({ color, title, text, isDark }: { color: string; title: string; text: string; isDark: boolean }) {
  return (
    <View style={[sh.infoBox, { backgroundColor: color + "12", borderColor: color + "50" }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <Feather name="alert-circle" size={16} color={color} />
        <Text style={[sh.infoTitle, { color }]}>{title}</Text>
      </View>
      <Text style={[sh.infoText, { color: isDark ? "#8892B0" : "#475569" }]}>{text}</Text>
    </View>
  );
}

function Chip({ label, selected, color, onPress }: { label: string; selected: boolean; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}
      style={[sh.chip, { backgroundColor: selected ? color : "transparent", borderColor: selected ? color : "#64748B" }]}>
      <Text style={[sh.chipText, { color: selected ? "#FFF" : "#64748B" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── ABG Interpretation ───────────────────────────────────────────────────────
function interpretABG(
  pH: number, pco2: number, hco3: number, source: "arterial" | "venous" | "capillary" = "arterial",
  na: number, cl: number, bd: number, wt: number
) {
  if (!pH || !pco2 || !hco3) return null;
  const base = {
    arterial: { phMin: 7.35, phMax: 7.45, pco2Min: 35, pco2Max: 45, pco2Normal: 40 },
    venous: { phMin: 7.31, phMax: 7.41, pco2Min: 40, pco2Max: 50, pco2Normal: 45 },
    capillary: { phMin: 7.35, phMax: 7.45, pco2Min: 35, pco2Max: 45, pco2Normal: 40 },
  };
  const b = base[source];
  const acidBase = pH < b.phMin ? "Acidosis" : pH > b.phMax ? "Alkalosis" : "Normal pH";
  let primary = "";
  let compensation = "";
  let color = "#16A34A";
  let ag: number | null = null;
  let agLabel = "";
  let mixed = "";
  let bicarbDose: number | null = null;
  let kWarning = "";
  let critical = "";

  if (pH < b.phMin) {
    color = "#DC2626";
    if (pco2 > b.pco2Max) {
      primary = "Respiratory Acidosis";
      const expHCO3 = 24 + (pco2 - b.pco2Normal) * 0.1;
      compensation = Math.abs(hco3 - expHCO3) < 3 ? "Appropriate acute compensation" : hco3 > expHCO3 + 3 ? "± Metabolic alkalosis" : "± Metabolic acidosis";
    } else {
      primary = "Metabolic Acidosis";
      const expPCO2 = 1.5 * hco3 + 8;
      if (Math.abs(pco2 - expPCO2) < 2) compensation = "Appropriate compensation (Winter's formula)";
      else if (pco2 > expPCO2 + 2) { compensation = "Inadequate resp. compensation"; mixed = "Mixed: Metabolic Acidosis + Respiratory Acidosis"; }
      else { compensation = "Over-compensation"; mixed = "Mixed: Metabolic Acidosis + Respiratory Alkalosis"; }
      if (na > 0 && cl > 0) {
        ag = Math.round(na - (cl + hco3));
        agLabel = ag > 14 ? `High Anion Gap (HAGMA) = ${ag}` : `Normal Anion Gap (NAGMA) = ${ag}`;
      }
      if (wt > 0 && bd > 0) bicarbDose = +(0.3 * wt * bd).toFixed(1);
      kWarning = "Serum K\u207a drops as acidosis corrects. Monitor for hypokalemia.";
      color = "#E53E3E";
    }
  } else if (pH > b.phMax) {
    color = "#D97706";
    if (pco2 < b.pco2Min) {
      primary = "Respiratory Alkalosis";
      const expHCO3 = 24 - (b.pco2Normal - pco2) * 0.2;
      compensation = Math.abs(hco3 - expHCO3) < 3 ? "Appropriate acute compensation" : "Chronic or mixed disorder";
    } else {
      primary = "Metabolic Alkalosis";
      const expPCO2 = 40 + (hco3 - 24) * 0.7;
      compensation = Math.abs(pco2 - expPCO2) < 2 ? "Appropriate compensation" : "Inadequate or mixed disorder";
    }
  } else {
    primary = "Normal acid-base status";
  }

  if (pH < 7.20 || pH > 7.60) critical = "CRITICAL: Severe Acid-Base Derangement. Immediate intervention required.";

  const hypoxia = pco2 > 50 ? "Hypercapnia present" : pco2 < b.pco2Min ? "Hypocapnia present" : "pCO\u2082 normal";
  return { acidBase, primary, compensation, color, hypoxia, ag, agLabel, mixed, bicarbDose, kWarning, critical };
}

// ─── Status Epilepticus timer ──────────────────────────────────────────────────
function useSeizureTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const reset = useCallback(() => { setRunning(false); setElapsed(0); }, []);
  return { elapsed, running, start: () => setRunning(true), pause: () => setRunning(false), reset };
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function CalcsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { weight: ctxWeight } = useWeight();
  const { isFav, toggleFav } = useFavorites();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (key: string) => setOpenSection((p) => (p === key ? null : key));

  const bg = isDark ? "#0B132B" : "#F0F4F8";
  const cardBg = isDark ? "#112240" : "#FFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const textPrimary = isDark ? "#CCD6F6" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#8A9BB0";

  // ── 1. Electrolyte state ──────────────────────────────────────────────────
  const [eWt, setEWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [eIon, setEIon] = useState<"K" | "Na">("K");
  const [actualK, setActualK] = useState("");
  const [targetK, setTargetK] = useState("4.0");
  const [actualNa, setActualNa] = useState("");
  const [targetNa, setTargetNa] = useState("135");
  const eWtN = parseFloat(eWt) || 0;
  const kDeficit = eIon === "K" ? +((parseFloat(targetK) - parseFloat(actualK)) * 0.3 * eWtN).toFixed(2) : 0;
  const naDeficit = eIon === "Na" ? +((parseFloat(targetNa) - parseFloat(actualNa)) * 0.6 * eWtN).toFixed(1) : 0;
  const kMaxPeriph = +(eWtN * 0.3).toFixed(1);
  const kMaxCentral = +(eWtN * 0.5).toFixed(1);

  // ── 2. ABG state ──────────────────────────────────────────────────────────
  const [abgPH, setAbgPH] = useState("");
  const [abgPCO2, setAbgPCO2] = useState("");
  const [abgHCO3, setAbgHCO3] = useState("");
  const [abgSource, setAbgSource] = useState<"arterial" | "venous" | "capillary">("arterial");
  const [abgNa, setAbgNa] = useState("");
  const [abgCl, setAbgCl] = useState("");
  const [abgBD, setAbgBD] = useState("");
  const [abgWt, setAbgWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const abgResult = interpretABG(parseFloat(abgPH), parseFloat(abgPCO2), parseFloat(abgHCO3), abgSource, parseFloat(abgNa), parseFloat(abgCl), parseFloat(abgBD), parseFloat(abgWt));

  // ── 3. Osmotherapy state ──────────────────────────────────────────────────
  const [osmoWt, setOsmoWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [mDose, setMDose] = useState("0.75");
  const [saline3Dose, setSaline3Dose] = useState("3");
  const osmoWtN = parseFloat(osmoWt) || 0;
  const mDoseN = Math.min(Math.max(parseFloat(mDose) || 0.75, 0.5), 1.0);
  const salineN = Math.min(Math.max(parseFloat(saline3Dose) || 3, 2), 5);
  const mannitolGrams = +(mDoseN * osmoWtN).toFixed(1);
  const mannitolVol20 = +(mannitolGrams / 0.2).toFixed(0);
  const mannitolVol25 = +(mannitolGrams / 0.25).toFixed(0);
  const salineVol = +(salineN * osmoWtN).toFixed(0);
  const mannitolRate = osmoWtN > 0 ? +(mannitolVol20 / 0.5).toFixed(0) : 0;

  // ── 4. Toxicology state ───────────────────────────────────────────────────
  const [toxWt, setToxWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [toxDrug, setToxDrug] = useState<
    "nac" | "naloxone" | "flumazenil" | "charcoal" | "atropine" | "calcium-gluconate" | "glucagon" | "deferoxamine" | "bicarbonate" | "intralipid" | "pyridoxine" | "edta"
  >("nac");
  const [showToxDropdown, setShowToxDropdown] = useState(false);
  const toxWtN = Math.min(parseFloat(toxWt) || 0, 100);
  const nacPhase1 = +(150 * toxWtN).toFixed(0);
  const nacPhase2 = +(50 * toxWtN).toFixed(0);
  const nacPhase3 = +(100 * toxWtN).toFixed(0);
  const nalDose = +(0.01 * toxWtN).toFixed(2);
  const fluDose = +(0.01 * toxWtN).toFixed(2);
  const charcoalDose = +(1 * toxWtN).toFixed(0);
  const charcoalCapped = Math.min(charcoalDose, 50);
  const atropineDose = +(0.05 * toxWtN).toFixed(2);
  const atropineCapped = Math.min(atropineDose, 2);
  const calciumGluconateDose = +(60 * toxWtN).toFixed(0);
  const calciumGluconateCapped = Math.min(calciumGluconateDose, 3000);
  const glucagonDose = +(0.1 * toxWtN).toFixed(2);
  const glucagonCapped = Math.min(glucagonDose, 10);
  const deferoxamineRate = +(15 * toxWtN).toFixed(0);
  const bicarbDose = +(1.5 * toxWtN).toFixed(1);
  const bicarbRange = `${+(1 * toxWtN).toFixed(1)}–${+(2 * toxWtN).toFixed(1)}`;
  const intralipidDose = +(1.5 * toxWtN).toFixed(1);
  const pyridoxineDose = +(70 * toxWtN).toFixed(0);
  const pyridoxineCapped = Math.min(pyridoxineDose, 5000);
  const edtaDose = +(50 * toxWtN).toFixed(0);

  const toxOptions: {
    key: typeof toxDrug;
    label: string;
    color: string;
  }[] = [
    { key: "nac", label: "Paracetamol OD (N-Acetylcysteine)", color: "#0369A1" },
    { key: "naloxone", label: "Opioids OD (Naloxone)", color: "#16A34A" },
    { key: "flumazenil", label: "Benzodiazepines OD (Flumazenil)", color: "#7C3AED" },
    { key: "charcoal", label: "GI Poisoning / Decon (Activated Charcoal)", color: "#374151" },
    { key: "atropine", label: "Organophosphates (Atropine)", color: "#DC2626" },
    { key: "calcium-gluconate", label: "Calcium Channel Blocker OD (Calcium Gluconate)", color: "#0891B2" },
    { key: "glucagon", label: "Beta-Blocker OD (Glucagon)", color: "#D97706" },
    { key: "deferoxamine", label: "Iron Toxicity (Deferoxamine)", color: "#7C3AED" },
    { key: "bicarbonate", label: "TCA Overdose (Sodium Bicarbonate)", color: "#0891B2" },
    { key: "intralipid", label: "Local Anesthetic Toxicity (Intralipid 20%)", color: "#F59E0B" },
    { key: "pyridoxine", label: "Isoniazid / INH Seizures (Pyridoxine)", color: "#16A34A" },
    { key: "edta", label: "Lead Toxicity (CaNa2 EDTA)", color: "#475569" },
  ];
  const toxLabel = toxOptions.find((o) => o.key === toxDrug)?.label || "Select";

  // ── 5. Airway & Lines state ───────────────────────────────────────────────
  const [airAge, setAirAge] = useState("");
  const [airBW, setAirBW] = useState("");
  const airAgeN = parseFloat(airAge) || 0;
  const airBWN = parseFloat(airBW) || 0;
  const uncuffed = airAgeN > 0 ? +(airAgeN / 4 + 4).toFixed(1) : null;
  const cuffed = airAgeN > 0 ? +(airAgeN / 4 + 3.5).toFixed(1) : null;
  const ettDepth = airAgeN > 0 ? +(airAgeN / 2 + 12).toFixed(1) : null;
  const blade = airAgeN < 1 ? "0 (Straight)" : airAgeN < 3 ? "1 (Straight)" : airAgeN < 8 ? "2 (Straight)" : "3 (Curved)";
  const uacLow = airBWN > 0 ? +(airBWN + 9).toFixed(1) : null;
  const uacHigh = airBWN > 0 ? +(3 * airBWN + 9).toFixed(1) : null;
  const uvc = airBWN > 0 ? +(airBWN / 2 + 2.5).toFixed(1) : null;

  // ── 6. Transfusion state ──────────────────────────────────────────────────
  const [tranWt, setTranWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [tranHct, setTranHct] = useState("");
  const [tranTargetHct, setTranTargetHct] = useState("35");
  const tranWtN = parseFloat(tranWt) || 0;
  const prbcSimple = +(tranWtN * 10).toFixed(0);
  const prbcFormula = tranHct && tranTargetHct
    ? +((parseFloat(tranTargetHct) - parseFloat(tranHct)) * tranWtN * 3).toFixed(0) : null;
  const ffpVol = +(tranWtN * 10).toFixed(0);
  const plateletsUnits = Math.ceil(tranWtN / 5);
  const cryoVol = +(tranWtN * 5).toFixed(0);

  // ── 7. Status Epilepticus state ───────────────────────────────────────────
  const [seWt, setSeWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const { elapsed, running, start, pause, reset } = useSeizureTimer();
  const seWtN = Math.min(parseFloat(seWt) || 0, 40);
  const lorzDose = +(0.1 * seWtN).toFixed(2);
  const lorzMax = 4;
  const phenytoinDose = +(20 * seWtN).toFixed(0);
  const phenytoinRate = +(1 * seWtN).toFixed(0);
  const thiopentalMin = +(3 * seWtN).toFixed(0);
  const thiopentalMax = +(5 * seWtN).toFixed(0);
  const phenobarb = +(20 * seWtN).toFixed(0);
  const midazInf = +(seWtN * 0.06).toFixed(2);
  const seStep = elapsed < 300 ? 0 : elapsed < 900 ? 1 : 2;

  // ── 8. Cardiac / Tet Spells state ─────────────────────────────────────────
  const [cardWt, setCardWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [pge1Dose, setPge1Dose] = useState("0.01");
  const cardWtN = parseFloat(cardWt) || 0;
  const pge1Conc = +(500 / 50).toFixed(0);
  const pge1DoseN = parseFloat(pge1Dose) || 0.01;
  const pge1Rate = cardWtN > 0 ? +((pge1DoseN * cardWtN * 60) / pge1Conc).toFixed(2) : null;
  const morphineTet = +(0.1 * cardWtN).toFixed(2);
  const propranololTet = +(0.015 * cardWtN).toFixed(2);
  const phenylephrineTet = +(0.02 * cardWtN).toFixed(2);

  // ── 9. GIR & TPN state ───────────────────────────────────────────────────
  const [girWt, setGirWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [dextPct, setDextPct] = useState("10");
  const [girRate, setGirRate] = useState("");
  const [targetGir, setTargetGir] = useState("");
  const girWtN = parseFloat(girWt) || 0;
  const dextN = parseFloat(dextPct) || 10;
  const girRateN = parseFloat(girRate) || 0;
  const targetGirN = parseFloat(targetGir) || 0;
  const calcGir = girWtN > 0 && girRateN > 0
    ? +((dextN * girRateN * 10) / (girWtN * 60)).toFixed(2) : null;
  const calcRate = girWtN > 0 && targetGirN > 0
    ? +((targetGirN * girWtN * 60) / (dextN * 10)).toFixed(1) : null;

  // ── 10. Burns state ───────────────────────────────────────────────────────
  const [burnWt, setBurnWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [burnBsa, setBurnBsa] = useState("");
  const [burnAge, setBurnAge] = useState<"child" | "infant">("child");
  const burnWtN = parseFloat(burnWt) || 0;
  const burnBsaN = parseFloat(burnBsa) || 0;
  const parkland24 = burnWtN > 0 && burnBsaN > 0 ? +(4 * burnWtN * burnBsaN).toFixed(0) : 0;
  const parklandFirst8Rate = parkland24 > 0 ? Math.round(parkland24 * 0.5 / 8) : 0;
  const parklandNext16Rate = parkland24 > 0 ? Math.round(parkland24 * 0.5 / 16) : 0;
  const maintBurn = burnWtN <= 10 ? burnWtN * 100
    : burnWtN <= 20 ? 1000 + (burnWtN - 10) * 50
    : 1500 + (burnWtN - 20) * 20;
  const totalBurn24 = parkland24 + Math.round(maintBurn);

  // ─── render helpers ───────────────────────────────────────────────────────
  function Body({ children }: { children: React.ReactNode }) {
    return (
      <View style={[sh.body, { backgroundColor: cardBg, borderColor: border }]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[sh.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[sh.topHeader, { paddingTop: topPadding + 12, backgroundColor: isDark ? "#0A192F" : "#FFF" }]}>
        <View style={sh.topHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={[sh.headerTitle, { color: textPrimary }]}>MKashanEdu</Text>
            <Text style={[sh.headerSub, { color: textMuted }]}>
              Pediatric Clinical Guide • Based on Harriet Lane & Nelson's • 95+ drugs
            </Text>
          </View>
          <TouchableOpacity onPress={toggleDark}
            style={[sh.nightBtn, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <Feather name={isDark ? "sun" : "moon"} size={18} color={isDark ? "#FFD700" : "#4A5568"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        keyboardShouldPersistTaps="handled">

        {/* ══ 1. ELECTROLYTE CORRECTION ═════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Electrolyte Correction" icon="zap" color="#0D9488"
            open={openSection === "elec"} onToggle={() => toggle("elec")} isDark={isDark} />
          {openSection === "elec" && (
            <Body>
              <View style={sh.chipRow}>
                <Chip label="K⁺ Potassium" selected={eIon === "K"} color="#0D9488" onPress={() => setEIon("K")} />
                <Chip label="Na⁺ Sodium" selected={eIon === "Na"} color="#1E3A8A" onPress={() => setEIon("Na")} />
              </View>
              <InputField label="Weight (kg)" value={eWt} onChange={setEWt} placeholder="e.g. 15" isDark={isDark} />

              {eIon === "K" ? (
                <>
                  <InputField label="Actual K⁺ (mEq/L)" value={actualK} onChange={setActualK} placeholder="e.g. 2.8" isDark={isDark} />
                  <InputField label="Target K⁺ (mEq/L)" value={targetK} onChange={setTargetK} placeholder="4.0" isDark={isDark} />
                  {kDeficit > 0 && eWtN > 0 && (
                    <ResultBox color="#0D9488">
                      <ResultRow label="K⁺ Deficit" value={`${kDeficit} mEq`} color="#0D9488" large />
                      <ResultRow label="Max peripheral rate" value={`${kMaxPeriph} mEq/hr`} color="#0D9488" />
                      <ResultRow label="Max central rate" value={`${kMaxCentral} mEq/hr`} color="#0D9488" />
                    </ResultBox>
                  )}
                  <InfoBox color="#D97706" title="Safety Rules — K⁺" isDark={isDark}
                    text={"• Never give K+ as IV bolus — FATAL\n• Peripheral: max 40 mEq/L concentration, max 0.3 mEq/kg/hr\n• Central: max 0.5 mEq/kg/hr with continuous ECG monitoring\n• Dilute in NS or D5W; check renal function before correction"} />
                </>
              ) : (
                <>
                  <InputField label="Actual Na⁺ (mEq/L)" value={actualNa} onChange={setActualNa} placeholder="e.g. 122" isDark={isDark} />
                  <InputField label="Target Na⁺ (mEq/L)" value={targetNa} onChange={setTargetNa} placeholder="135" isDark={isDark} />
                  {naDeficit > 0 && eWtN > 0 && (
                    <ResultBox color="#1E3A8A">
                      <ResultRow label="Na⁺ Deficit" value={`${naDeficit} mEq`} color="#1E3A8A" large />
                    </ResultBox>
                  )}
                  <InfoBox color="#DC2626" title="Safety Rules — Na⁺" isDark={isDark}
                    text={"• Correct Na⁺ slowly — max 0.5 mEq/L/hr (10–12 mEq/L per day)\n• Rapid correction of hyponatraemia → Osmotic Demyelination Syndrome\n• Use 3% NaCl ONLY for symptomatic severe hyponatraemia\n• For hypernatraemia: correct over 48–72h to prevent cerebral oedema"} />
                </>
              )}
            </Body>
          )}
        </View>

        {/* ══ 2. ABG ANALYZER ══════════════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="ABG Analyzer" icon="wind" color="#7C3AED"
            open={openSection === "abg"} onToggle={() => toggle("abg")} isDark={isDark} />
          {openSection === "abg" && (
            <Body>
              <Text style={[sh.refText, { color: textMuted }]}>
                {abgSource === "arterial" ? "Normal: pH 7.35–7.45 · pCO₂ 35–45 · HCO₃ 22–26" :
                 abgSource === "venous" ? "Normal VBG: pH 7.31–7.41 · pCO₂ 40–50 · HCO₃ 22–26" :
                 "Normal: pH 7.35–7.45 · pCO₂ 35–45 · HCO₃ 22–26"}
              </Text>
              <View style={sh.chipRow}>
                {(["arterial", "venous", "capillary"] as const).map((s) => (
                  <Chip key={s} label={s[0].toUpperCase() + s.slice(1)} color="#7C3AED" selected={abgSource === s} onPress={() => setAbgSource(s)} />
                ))}
              </View>
              <View style={sh.triRow}>
                <View style={{ flex: 1 }}>
                  <InputField label="pH" value={abgPH} onChange={setAbgPH} placeholder={abgSource === "venous" ? "7.36" : "7.35"} isDark={isDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="pCO₂ (mmHg)" value={abgPCO2} onChange={setAbgPCO2} placeholder={abgSource === "venous" ? "45" : "40"} isDark={isDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="HCO₃ (mEq/L)" value={abgHCO3} onChange={setAbgHCO3} placeholder="24" isDark={isDark} />
                </View>
              </View>
              <View style={sh.triRow}>
                <View style={{ flex: 1 }}>
                  <InputField label="Na⁺ (mEq/L)" value={abgNa} onChange={setAbgNa} placeholder="140" isDark={isDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="Cl⁻ (mEq/L)" value={abgCl} onChange={setAbgCl} placeholder="100" isDark={isDark} />
                </View>
              </View>
              <View style={sh.triRow}>
                <View style={{ flex: 1 }}>
                  <InputField label="Base Deficit (mEq/L)" value={abgBD} onChange={setAbgBD} placeholder="e.g. 5" isDark={isDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="Weight (kg)" value={abgWt} onChange={setAbgWt} placeholder="e.g. 15" isDark={isDark} />
                </View>
              </View>
              {abgResult && (
                <>
                  {abgResult.critical ? (
                    <View style={[sh.resultBox, { backgroundColor: "#FF4C6015", borderColor: "#FF4C6040", marginBottom: 6 }]}>
                      <Text style={[sh.resultValue, { color: "#FF4C60", fontSize: 14 }]}>⚠ {abgResult.critical}</Text>
                    </View>
                  ) : null}
                  <ResultBox color={abgResult.color}>
                    <ResultRow label="Status" value={abgResult.acidBase} color={abgResult.color} large />
                    <ResultRow label="Primary disorder" value={abgResult.agLabel ? `${abgResult.primary} — ${abgResult.agLabel}` : abgResult.primary} color={abgResult.color} />
                    {abgResult.mixed ? <ResultRow label="Mixed disorder" value={abgResult.mixed} color={abgResult.color} /> : null}
                    {abgResult.compensation ? (
                      <ResultRow label="Compensation" value={abgResult.compensation} color={abgResult.color} />
                    ) : null}
                    <ResultRow label="CO₂ note" value={abgResult.hypoxia} color={abgResult.color} />
                  </ResultBox>
                  {abgResult.bicarbDose !== null ? (
                    <View style={[sh.resultBox, { backgroundColor: "#7C3AED15", borderColor: "#7C3AED40" }]}>
                      <Text style={[sh.resultValue, { color: "#7C3AED", fontSize: 14 }]}>ℹ Bicarbonate Replacement: Consider {abgResult.bicarbDose} mEq (or mL of 8.4% NaHCO₃) slow IV infusion</Text>
                    </View>
                  ) : null}
                  {abgResult.kWarning ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <Feather name="alert-triangle" size={12} color="#D97706" />
                      <Text style={[sh.refText, { color: "#D97706" }]}>⚠ {abgResult.kWarning}</Text>
                    </View>
                  ) : null}
                </>
              )}
              <InfoBox color="#7C3AED" title="Stepwise ABG Interpretation" isDark={isDark}
                text={"1. pH → Acidosis or Alkalosis (source-adjusted)\n2. pCO₂ → Primary if matches pH direction\n3. HCO₃ → Primary if matches pH direction\n4. Anion Gap = Na – (Cl + HCO₃) · Normal ~12 (±2)\n5. Winter's formula: Expected pCO₂ = 1.5×HCO₃ + 8 (±2)\n6. Assess mixed disorders · Bicarbonate only if pH < 7.15"} />
            </Body>
          )}
        </View>

        {/* ══ 3. OSMOTHERAPY / RAISED ICP ═════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Osmotherapy · Raised ICP" icon="alert-triangle" color="#EA580C"
            open={openSection === "osmo"} onToggle={() => toggle("osmo")} isDark={isDark} />
          {openSection === "osmo" && (
            <Body>
              <InputField label="Weight (kg)" value={osmoWt} onChange={setOsmoWt} placeholder="e.g. 20" isDark={isDark} />
              <Text style={[sh.sectionLabel, { color: textPrimary }]}>Mannitol (20% or 25%)</Text>
              <InputField label="Dose (0.5–1.0 g/kg)" value={mDose} onChange={setMDose} placeholder="0.75" isDark={isDark} />
              {osmoWtN > 0 && (
                <ResultBox color="#EA580C">
                  <ResultRow label="Mannitol dose" value={`${mannitolGrams} g`} color="#EA580C" large />
                  <ResultRow label="Volume (20% solution)" value={`${mannitolVol20} mL`} color="#EA580C" />
                  <ResultRow label="Volume (25% solution)" value={`${mannitolVol25} mL`} color="#EA580C" />
                  <ResultRow label="Infuse over 30 min at" value={`${mannitolRate} mL/hr`} color="#EA580C" />
                </ResultBox>
              )}
              <Text style={[sh.sectionLabel, { color: textPrimary, marginTop: 10 }]}>3% Hypertonic Saline</Text>
              <InputField label="Dose (2–5 mL/kg)" value={saline3Dose} onChange={setSaline3Dose} placeholder="3" isDark={isDark} />
              {osmoWtN > 0 && (
                <ResultBox color="#1E3A8A">
                  <ResultRow label="3% NaCl volume" value={`${salineVol} mL`} color="#1E3A8A" large />
                  <ResultRow label="Infuse over 30 min at" value={`${Math.round(salineVol / 0.5)} mL/hr`} color="#1E3A8A" />
                </ResultBox>
              )}
              <InfoBox color="#EA580C" title="Raised ICP Protocol" isDark={isDark}
                text={"• Head elevated 30°, neutral position, avoid jugular vein compression\n• Target ICP <20 mmHg, CPP >50 mmHg (age-adjusted)\n• Mannitol: repeat q4–6h; monitor serum osmolality (<320 mOsm/kg)\n• 3% NaCl: target serum Na 150–160 mEq/L\n• Avoid hyperthermia, hyperglycaemia, hypercapnia"} />
            </Body>
          )}
        </View>

        {/* ══ 4. TOXICOLOGY ═══════════════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Toxicology · Antidotes" icon="shield" color="#0369A1"
            open={openSection === "tox"} onToggle={() => toggle("tox")} isDark={isDark} />
          {openSection === "tox" && (
            <Body>
              <InputField label="Weight (kg, max 100)" value={toxWt} onChange={setToxWt} placeholder="e.g. 15" isDark={isDark} />
              <TouchableOpacity
                onPress={() => setShowToxDropdown(true)}
                activeOpacity={0.8}
                style={[sh.toxDropdown, { borderColor: isDark ? "#233554" : "#E2E8F0", backgroundColor: isDark ? "#0A192F" : "#F8FAFC" }]}>
                <Text style={[sh.toxDropdownLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>
                  Select Poison / Antidote
                </Text>
                <View style={sh.toxDropdownRow}>
                  <Text style={[sh.toxDropdownValue, { color: isDark ? "#FFFFFF" : "#0D1B2A" }]}>
                    {toxLabel}
                  </Text>
                  <Feather name="chevron-down" size={18} color={isDark ? "#8892B0" : "#64748B"} />
                </View>
              </TouchableOpacity>
              <Modal
                visible={showToxDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowToxDropdown(false)}>
                <View style={sh.modalOverlay}>
                  <View style={[sh.modalCard, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
                    <View style={sh.modalHeader}>
                      <Text style={[sh.modalTitle, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>
                        Select Poison / Antidote
                      </Text>
                      <TouchableOpacity onPress={() => setShowToxDropdown(false)} style={sh.modalCloseBtn}>
                        <Feather name="x" size={20} color={isDark ? "#8892B0" : "#64748B"} />
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={toxOptions}
                      keyExtractor={(item) => item.key}
                      renderItem={({ item }) => {
                        const selected = toxDrug === item.key;
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setToxDrug(item.key);
                              setShowToxDropdown(false);
                            }}
                            style={[sh.modalOption, {
                              backgroundColor: selected ? item.color + "18" : isDark ? "#0A192F" : "#F8FAFC",
                              borderLeftColor: selected ? item.color : "transparent",
                              borderLeftWidth: selected ? 3 : 0,
                            }]}>
                            <Text style={[sh.modalOptionText, { color: selected ? item.color : isDark ? "#CCD6F6" : "#0D1B2A" }]}>
                              {item.label}
                            </Text>
                            {selected && <Feather name="check" size={18} color={item.color} />}
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                </View>
              </Modal>
              {toxWtN > 0 && (
                <View style={[sh.favRow, { justifyContent: "flex-end" }]}>
                  <StarButton
                    isFav={isFav(`tox-${toxDrug}`)}
                    onToggle={() =>
                      toggleFav({
                        id: `tox-${toxDrug}`,
                        type: "antidote",
                        label: toxLabel,
                        color: toxOptions.find((o) => o.key === toxDrug)?.color || "#0369A1",
                      })
                    }
                  />
                </View>
              )}

              {toxDrug === "nac" && toxWtN > 0 && (
                <>
                  <ResultBox color="#0369A1">
                    <Text style={[sh.resultLabel, { color: "#0369A1" + "BB" }]}>N-Acetylcysteine (Paracetamol Poisoning)</Text>
                    <ResultRow label="Phase 1 — 150 mg/kg in 200 mL D5W over 60 min" value={`${nacPhase1} mg`} color="#0369A1" large />
                    <ResultRow label="Phase 2 — 50 mg/kg in 500 mL D5W over 4 hrs" value={`${nacPhase2} mg`} color="#0369A1" />
                    <ResultRow label="Phase 3 — 100 mg/kg in 1L D5W over 16 hrs" value={`${nacPhase3} mg`} color="#0369A1" />
                  </ResultBox>
                  <InfoBox color="#0369A1" title="NAC Protocol Notes" isDark={isDark}
                    text={"• Start within 8–10 hours of ingestion for maximum efficacy\n• Check paracetamol level at 4h post-ingestion and plot on Rumack-Matthew nomogram\n• Anaphylactoid reactions: slow infusion or interrupt; treat with antihistamine\n• Continue until clinical improvement and LFTs trending down"} />
                </>
              )}
              {toxDrug === "naloxone" && toxWtN > 0 && (
                <>
                  <ResultBox color="#16A34A">
                    <Text style={[sh.resultLabel, { color: "#16A34A" + "BB" }]}>Naloxone — Opioid Reversal</Text>
                    <ResultRow label="Dose (0.01 mg/kg IV, max 2 mg)" value={`${Math.min(nalDose, 2)} mg`} color="#16A34A" large />
                    <ResultRow label="Repeat every 2–3 min if needed" value="Max total 10 mg" color="#16A34A" />
                    <ResultRow label="Infusion (if required)" value={`${+(0.005 * toxWtN).toFixed(3)} mg/kg/hr`} color="#16A34A" />
                  </ResultBox>
                  <InfoBox color="#16A34A" title="Naloxone Notes" isDark={isDark}
                    text={"• Half-life shorter than most opioids — resedation may occur\n• Monitor closely for 4–6 hours after last dose\n• In neonates: 0.01 mg/kg every 2–3 min IV/IM/SC\n• Avoid large bolus in opioid-dependent patients (precipitates withdrawal)"} />
                </>
              )}
              {toxDrug === "flumazenil" && toxWtN > 0 && (
                <>
                  <ResultBox color="#7C3AED">
                    <Text style={[sh.resultLabel, { color: "#7C3AED" + "BB" }]}>Flumazenil — Benzodiazepine Reversal</Text>
                    <ResultRow label="Dose (0.01 mg/kg IV, max 0.2 mg/dose)" value={`${Math.min(fluDose, 0.2)} mg`} color="#7C3AED" large />
                    <ResultRow label="Repeat every 1 min (max 4 doses)" value="Total max 1 mg" color="#7C3AED" />
                  </ResultBox>
                  <InfoBox color="#DC2626" title="⚠ Flumazenil Contraindications" isDark={isDark}
                    text={"• AVOID in BZD-dependent patients (precipitates severe withdrawal/seizures)\n• Avoid in mixed overdose with TCAs (risk of arrhythmia)\n• Short duration (30–60 min) — resedation common; prepare for re-dosing\n• Do NOT use if seizures controlled by BZDs — will unmask seizures"} />
                </>
              )}
              {toxDrug === "charcoal" && toxWtN > 0 && (
                <>
                  <ResultBox color="#374151">
                    <Text style={[sh.resultLabel, { color: "#374151" + "BB" }]}>Activated Charcoal — GI Decontamination</Text>
                    <ResultRow label="Dose (1 g/kg PO/NG, max 50 g)" value={`${charcoalCapped} g`} color="#374151" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Charcoal" isDark={isDark}
                    text={"• Mix with water. Avoid in depressed mental status.\n• NOT for Iron, Lithium, Acids, or Alkalis.\n• Aspiration risk if gag reflex absent — protect airway first.\n• Most effective within 1 hour of ingestion.\n• May cause constipation or vomiting."} />
                </>
              )}
              {toxDrug === "atropine" && toxWtN > 0 && (
                <>
                  <ResultBox color="#DC2626">
                    <Text style={[sh.resultLabel, { color: "#DC2626" + "BB" }]}>Atropine — Organophosphates</Text>
                    <ResultRow label="Dose (0.05 mg/kg IV, max 2 mg)" value={`${atropineCapped} mg`} color="#DC2626" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Atropine" isDark={isDark}
                    text={"• Rapid IV push. Repeat every 5–10 mins until secretions dry.\n• Large doses may be needed (hundreds of mg in severe cases).\n• Monitor HR, pupil size, and bronchial secretions.\n• Continue until atropinization (dry skin, tachycardia, dilated pupils).\n• Combine with pralidoxime (2-PAM) for organophosphate poisoning."} />
                </>
              )}
              {toxDrug === "calcium-gluconate" && toxWtN > 0 && (
                <>
                  <ResultBox color="#0891B2">
                    <Text style={[sh.resultLabel, { color: "#0891B2" + "BB" }]}>Calcium Gluconate 10% — CCB Overdose</Text>
                    <ResultRow label="Dose (60 mg/kg IV, max 3 g)" value={`${calciumGluconateCapped} mg`} color="#0891B2" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Calcium Gluconate" isDark={isDark}
                    text={"• Slow IV over 5–10 mins. Continuous ECG required.\n• Tissue necrosis with extravasation — use central line if possible.\n• NEVER give IV push — fatal bradycardia/asystole.\n• Incompatible with sodium bicarbonate (precipitates).\n• Have calcium gluconate ready for magnesium sulfate toxicity."} />
                </>
              )}
              {toxDrug === "glucagon" && toxWtN > 0 && (
                <>
                  <ResultBox color="#D97706">
                    <Text style={[sh.resultLabel, { color: "#D97706" + "BB" }]}>Glucagon — Beta-Blocker Overdose</Text>
                    <ResultRow label="Dose (0.1 mg/kg IV, max 10 mg)" value={`${glucagonCapped} mg`} color="#D97706" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Glucagon" isDark={isDark}
                    text={"• Direct IV push over 1 min.\n• Hyperglycemia and hyperglycemic response expected.\n• Nausea/vomiting common — antiemetics may be needed.\n• High-dose insulin therapy + glucose is preferred rescue.\n• May need repeated boluses or high-dose infusion 0.05–0.15 mg/kg/hr."} />
                </>
              )}
              {toxDrug === "deferoxamine" && toxWtN > 0 && (
                <>
                  <ResultBox color="#7C3AED">
                    <Text style={[sh.resultLabel, { color: "#7C3AED" + "BB" }]}>Deferoxamine — Iron Toxicity</Text>
                    <ResultRow label="Rate (15 mg/kg/hr IV infusion)" value={`${deferoxamineRate} mg/hr`} color="#7C3AED" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Deferoxamine" isDark={isDark}
                    text={"• Max rate 15 mg/kg/hr. Watch for hypotension.\n• Continue until urine turns pink (vin-rose urine) — indicates iron chelation.\n• May cause acute lung injury (ARDS) at high doses >24 hrs.\n• Monitor for allergic reactions; reduce infusion rate if hypotension.\n• Re-check serum iron and TIBC at 6–8 hrs."} />
                </>
              )}
              {toxDrug === "bicarbonate" && toxWtN > 0 && (
                <>
                  <ResultBox color="#0891B2">
                    <Text style={[sh.resultLabel, { color: "#0891B2" + "BB" }]}>Sodium Bicarbonate — TCA Overdose</Text>
                    <ResultRow label="Dose (1–2 mEq/kg IV)" value={`${bicarbRange} mEq`} color="#0891B2" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Sodium Bicarbonate" isDark={isDark}
                    text={"• Target pH 7.45–7.55 and narrow QRS on ECG.\n• Avoid in respiratory acidosis — worsens intracellular acidosis.\n• Hypernatremia, hyperosmolarity risk with repeated doses.\n• Incompatible with calcium gluconate (precipitates).\n• Check blood gas after each dose."} />
                </>
              )}
              {toxDrug === "intralipid" && toxWtN > 0 && (
                <>
                  <ResultBox color="#F59E0B">
                    <Text style={[sh.resultLabel, { color: "#F59E0B" + "BB" }]}>Intralipid 20% — Local Anesthetic Toxicity</Text>
                    <ResultRow label="Dose (1.5 mL/kg IV bolus)" value={`${intralipidDose} mL`} color="#F59E0B" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Intralipid" isDark={isDark}
                    text={"• Administer rapid bolus, follow with 0.25 mL/kg/min infusion.\n• Maximum 10–12 mL/kg over 30 min.\n• May turn plasma/urine milky white — expected.\n• Continue for 30 min after hemodynamic stability restored.\n• Call for help early; lipid emulsion is a rescue therapy."} />
                </>
              )}
              {toxDrug === "pyridoxine" && toxWtN > 0 && (
                <>
                  <ResultBox color="#16A34A">
                    <Text style={[sh.resultLabel, { color: "#16A34A" + "BB" }]}>Pyridoxine — Isoniazid/TB Drug Seizures</Text>
                    <ResultRow label="Dose (70 mg/kg IV, max 5 g)" value={`${pyridoxineCapped} mg`} color="#16A34A" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — Pyridoxine" isDark={isDark}
                    text={"• Dilute in D5W. Slow IV over 30–60 mins.\n• Administer gram-for-gram with INH if amount ingested is known.\n• Seizures may recur — continue until INH metabolized.\n• Monitor for peripheral neuropathy with chronic use.\n• If IV unavailable, use IM or PO route."} />
                </>
              )}
              {toxDrug === "edta" && toxWtN > 0 && (
                <>
                  <ResultBox color="#475569">
                    <Text style={[sh.resultLabel, { color: "#475569" + "BB" }]}>CaNa2 EDTA — Lead Toxicity</Text>
                    <ResultRow label="Dose (50 mg/kg/day IV)" value={`${edtaDose} mg/day`} color="#475569" large />
                  </ResultBox>
                  <WarningBox color="#DC2626" title="Preparation & Admin — CaNa2 EDTA" isDark={isDark}
                    text={"• Ensure adequate urine output before administration.\n• Renal toxicity risk — monitor creatinine daily.\n• Do NOT confuse with Na2EDTA (disodium EDTA) — causes fatal hypocalcemia.\n• Use CaNa2EDTA only. Give IM with procaine if IV access limited.\n• Baseline and follow-up lead levels required."} />
                </>
              )}
            </Body>
          )}
        </View>

        {/* ══ 5. AIRWAY & LINES ═══════════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Airway & Lines (OETT · UAC · UVC)" icon="cpu" color="#0891B2"
            open={openSection === "airway"} onToggle={() => toggle("airway")} isDark={isDark} />
          {openSection === "airway" && (
            <Body>
              <Text style={[sh.sectionLabel, { color: textPrimary }]}>Endotracheal Tube (OETT)</Text>
              <InputField label="Age (years)" value={airAge} onChange={setAirAge} placeholder="e.g. 4" isDark={isDark} />
              {uncuffed !== null && (
                <ResultBox color="#0891B2">
                  <ResultRow label="Uncuffed OETT (Age/4 + 4)" value={`${uncuffed} mm`} color="#0891B2" large />
                  <ResultRow label="Cuffed OETT (Age/4 + 3.5)" value={`${cuffed} mm`} color="#0891B2" />
                  <ResultRow label="Insertion depth (Age/2 + 12)" value={`${ettDepth} cm at lip`} color="#0891B2" />
                  <ResultRow label="Laryngoscope blade" value={blade} color="#0891B2" />
                </ResultBox>
              )}

              <Text style={[sh.sectionLabel, { color: textPrimary, marginTop: 10 }]}>Umbilical Catheters (Neonates)</Text>
              <InputField label="Birthweight (kg)" value={airBW} onChange={setAirBW} placeholder="e.g. 2.5" isDark={isDark} />
              {uacLow !== null && (
                <ResultBox color="#0D9488">
                  <ResultRow label="UAC low position (BW + 9)" value={`${uacLow} cm`} color="#0D9488" large />
                  <ResultRow label="UAC high position (3×BW + 9)" value={`${uacHigh} cm`} color="#0D9488" />
                  <ResultRow label="UVC depth (BW/2 + 2.5)" value={`${uvc} cm`} color="#0D9488" />
                </ResultBox>
              )}
              <InfoBox color="#0891B2" title="Airway Reference" isDark={isDark}
                text={"• Always have one size smaller and larger tube available\n• Confirm ET position: bilateral breath sounds, CXR (tip at T2–T3)\n• UAC tip: T6–T9 (low) or T6–T8 (high — above diaphragm)\n• UVC tip: junction of IVC and right atrium (T8–T9 on CXR)\n• Confirm catheter position with X-ray before use"} />
            </Body>
          )}
        </View>

        {/* ══ 6. PEDIATRIC TRANSFUSION ════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Pediatric Transfusion" icon="droplet" color="#B91C1C"
            open={openSection === "tran"} onToggle={() => toggle("tran")} isDark={isDark} />
          {openSection === "tran" && (
            <Body>
              <InputField label="Weight (kg)" value={tranWt} onChange={setTranWt} placeholder="e.g. 20" isDark={isDark} />
              <Text style={[sh.refText, { color: textMuted }]}>Optional: Use haematocrit formula for PRBC volume</Text>
              <View style={sh.triRow}>
                <View style={{ flex: 1 }}>
                  <InputField label="Actual Hct (%)" value={tranHct} onChange={setTranHct} placeholder="25" isDark={isDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="Target Hct (%)" value={tranTargetHct} onChange={setTranTargetHct} placeholder="35" isDark={isDark} />
                </View>
              </View>
              {tranWtN > 0 && (
                <ResultBox color="#B91C1C">
                  <ResultRow label="PRBC (10–15 mL/kg standard)" value={`${prbcSimple}–${Math.round(tranWtN * 15)} mL`} color="#B91C1C" large />
                  {prbcFormula !== null && prbcFormula > 0 && (
                    <ResultRow label="PRBC formula (Hct-based, ×3)" value={`${prbcFormula} mL`} color="#B91C1C" />
                  )}
                  <ResultRow label="FFP (10–15 mL/kg)" value={`${ffpVol}–${Math.round(tranWtN * 15)} mL`} color="#B91C1C" />
                  <ResultRow label="Platelets (1 unit / 5 kg)" value={`${plateletsUnits} unit${plateletsUnits > 1 ? "s" : ""}`} color="#B91C1C" />
                  <ResultRow label="Cryoprecipitate (5–10 mL/kg)" value={`${cryoVol}–${Math.round(tranWtN * 10)} mL`} color="#B91C1C" />
                </ResultBox>
              )}
              <InfoBox color="#B91C1C" title="Transfusion Guidelines" isDark={isDark}
                text={"• PRBC: infuse over 3–4 hours (max 5 mL/kg/hr in haemodynamically stable patient)\n• FFP: give within 30 min of thawing; for INR >1.5 with active bleeding\n• Platelets: target >50K for bleeding, >100K pre-surgery\n• Cryoprecipitate: fibrinogen <100 mg/dL or DIC with bleeding\n• Pre-medicate with paracetamol ± chlorphenamine to prevent reactions"} />
            </Body>
          )}
        </View>

        {/* ══ 7. STATUS EPILEPTICUS ════════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Status Epilepticus Pathway" icon="clock" color="#DC2626"
            open={openSection === "seiz"} onToggle={() => toggle("seiz")} isDark={isDark} />
          {openSection === "seiz" && (
            <Body>
              <InputField label="Weight (kg, 0.5–150)" value={seWt} onChange={setSeWt} placeholder="e.g. 18" isDark={isDark} />

              {/* Timer */}
              <View style={[sh.timerBox, { backgroundColor: elapsed >= 900 ? "#DC262618" : elapsed >= 300 ? "#D9770618" : "#16A34A18", borderColor: elapsed >= 900 ? "#DC2626" : elapsed >= 300 ? "#D97706" : "#16A34A" }]}>
                <Text style={[sh.timerTime, { color: elapsed >= 900 ? "#DC2626" : elapsed >= 300 ? "#D97706" : "#16A34A" }]}>{fmtTime(elapsed)}</Text>
                <Text style={[sh.timerStep, { color: isDark ? "#8892B0" : "#475569" }]}>
                  {elapsed < 300 ? "STEP 1 — Benzodiazepines" : elapsed < 900 ? "STEP 2 — Phenytoin / Phenobarbitone" : "STEP 3 — RSI / Anaesthetic agent"}
                </Text>
                <View style={sh.timerBtns}>
                  {!running
                    ? <TouchableOpacity onPress={start} style={[sh.timerBtn, { backgroundColor: "#16A34A" }]}><Text style={sh.timerBtnText}>▶ Start</Text></TouchableOpacity>
                    : <TouchableOpacity onPress={pause} style={[sh.timerBtn, { backgroundColor: "#D97706" }]}><Text style={sh.timerBtnText}>⏸ Pause</Text></TouchableOpacity>}
                  <TouchableOpacity onPress={reset} style={[sh.timerBtn, { backgroundColor: isDark ? "#233554" : "#E2E8F0" }]}>
                    <Text style={[sh.timerBtnText, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>↺ Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {seWtN > 0 && (
                <>
                  {[
                    {
                      step: 1, time: "0–5 min", color: "#16A34A", active: seStep === 0,
                      lines: [
                        `Lorazepam 0.1 mg/kg IV → ${Math.min(lorzDose, lorzMax).toFixed(2)} mg (max 4 mg)`,
                        `OR Diazepam 0.3 mg/kg PR → ${+(0.3 * seWtN).toFixed(2)} mg (max 10 mg)`,
                        "Can repeat BZD once after 5 min if no response",
                      ],
                    },
                    {
                      step: 2, time: "5–15 min", color: "#D97706", active: seStep === 1,
                      lines: [
                        `Phenytoin 20 mg/kg IV → ${phenytoinDose} mg at ≤${phenytoinRate} mg/min (ECG monitor)`,
                        `OR Phenobarbitone 20 mg/kg IV → ${phenobarb} mg at ≤30 mg/min`,
                        `OR Levetiracetam 40–60 mg/kg IV → ${+(40 * seWtN).toFixed(0)}–${+(60 * seWtN).toFixed(0)} mg`,
                      ],
                    },
                    {
                      step: 3, time: ">15 min", color: "#DC2626", active: seStep === 2,
                      lines: [
                        `Thiopental RSI: ${thiopentalMin}–${thiopentalMax} mg IV bolus — INTUBATE`,
                        `Midazolam infusion: start ${midazInf} mg/kg/hr, titrate up`,
                        `Phenobarbitone if not used: ${phenobarb} mg IV`,
                        "ICU admission · EEG · Neurology consult",
                      ],
                    },
                  ].map((s) => (
                    <View key={s.step} style={[sh.seStep, {
                      borderLeftColor: s.color,
                      backgroundColor: s.active ? s.color + "15" : isDark ? "#0A192F" : "#F8FAFC",
                      opacity: !s.active && elapsed > 0 ? 0.6 : 1,
                    }]}>
                      <Text style={[sh.seStepTitle, { color: s.color }]}>STEP {s.step} · {s.time}</Text>
                      {s.lines.map((l, i) => (
                        <Text key={i} style={[sh.seStepLine, { color: isDark ? "#CBD5E1" : "#334155" }]}>
                          {"• "}{l}
                        </Text>
                      ))}
                    </View>
                  ))}
                </>
              )}
            </Body>
          )}
        </View>

        {/* ══ 8. CARDIAC / TET SPELLS ═════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Cardiac · Tet Spells · PGE1" icon="heart" color="#E53E3E"
            open={openSection === "card"} onToggle={() => toggle("card")} isDark={isDark} />
          {openSection === "card" && (
            <Body>
              <InputField label="Weight (kg)" value={cardWt} onChange={setCardWt} placeholder="e.g. 5" isDark={isDark} />
              <Text style={[sh.sectionLabel, { color: textPrimary }]}>PGE1 (Alprostadil) Infusion</Text>
              <Text style={[sh.refText, { color: textMuted }]}>Standard: 500 mcg in 50 mL = 10 mcg/mL</Text>
              <InputField label="Dose (mcg/kg/min, 0.01–0.1)" value={pge1Dose} onChange={setPge1Dose} placeholder="0.01" isDark={isDark} />
              {cardWtN > 0 && pge1Rate !== null && (
                <ResultBox color="#E53E3E">
                  <ResultRow label="PGE1 infusion rate" value={`${pge1Rate} mL/hr`} color="#E53E3E" large />
                  <ResultRow label="Concentration" value="10 mcg/mL (500 mcg/50 mL)" color="#E53E3E" />
                </ResultBox>
              )}
              <InfoBox color="#E53E3E" title="PGE1 Indications & Side Effects" isDark={isDark}
                text={"• Duct-dependent CHD: TGA, pulmonary atresia, critical CoA, HLHS\n• Start at 0.01 mcg/kg/min; increase to 0.05–0.1 if no response\n• Side effects: apnoea (may need intubation), fever, hypotension, seizures\n• Have bag-mask and intubation ready before starting"} />

              <Text style={[sh.sectionLabel, { color: textPrimary, marginTop: 10 }]}>Hypercyanotic (Tet) Spell Management</Text>
              {cardWtN > 0 ? (
                <View style={[sh.tetBox, { backgroundColor: isDark ? "#1C0A0A" : "#FFF1F1", borderColor: "#DC262640" }]}>
                  {[
                    { step: "1", label: "Knee-chest position immediately", sub: "Increases systemic vascular resistance" },
                    { step: "2", label: "100% O₂ via face mask", sub: "Reduces hypoxic pulmonary vasoconstriction" },
                    { step: "3", label: `Morphine ${morphineTet} mg IV/SC (0.1 mg/kg)`, sub: "Reduces infundibular spasm and agitation" },
                    { step: "4", label: `Propranolol ${propranololTet} mg IV slow push (0.01–0.02 mg/kg)`, sub: "Relaxes RVOT spasm; max 1 mg total" },
                    { step: "5", label: `Phenylephrine ${phenylephrineTet} mg IV (0.02 mg/kg)`, sub: "Raises SVR → reduces R→L shunting" },
                    { step: "6", label: "IV fluid bolus 10–20 mL/kg NS", sub: "Maintains preload" },
                    { step: "7", label: "Urgent cardiology consult / surgical repair", sub: "" },
                  ].map((item) => (
                    <View key={item.step} style={sh.tetStep}>
                      <View style={[sh.tetNum, { backgroundColor: "#DC2626" }]}>
                        <Text style={sh.tetNumText}>{item.step}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[sh.tetLabel, { color: textPrimary }]}>{item.label}</Text>
                        {item.sub ? <Text style={[sh.refText, { color: textMuted }]}>{item.sub}</Text> : null}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[sh.refText, { color: textMuted }]}>Enter weight above to see calculated doses</Text>
              )}
            </Body>
          )}
        </View>

        {/* ══ 9. GIR & TPN ════════════════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="GIR & TPN Calculator" icon="bar-chart-2" color="#059669"
            open={openSection === "gir"} onToggle={() => toggle("gir")} isDark={isDark} />
          {openSection === "gir" && (
            <Body>
              <Text style={[sh.refText, { color: textMuted }]}>GIR (mg/kg/min) = (%Dextrose × Rate × 10) / (Weight × 60)</Text>
              <View style={sh.triRow}>
                <View style={{ flex: 1 }}>
                  <InputField label="Weight (kg)" value={girWt} onChange={setGirWt} placeholder="15" isDark={isDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="Dextrose %" value={dextPct} onChange={setDextPct} placeholder="10" isDark={isDark} />
                </View>
              </View>
              <InputField label="Current Rate (mL/hr) → calculates GIR" value={girRate} onChange={setGirRate} placeholder="e.g. 25" isDark={isDark} />
              {calcGir !== null && (
                <ResultBox color="#059669">
                  <ResultRow label="Glucose Infusion Rate" value={`${calcGir} mg/kg/min`} color="#059669" large />
                  <ResultRow label="Neonatal target" value="4–8 mg/kg/min" color="#059669" />
                  <ResultRow label="PICU target" value="3–6 mg/kg/min" color="#059669" />
                </ResultBox>
              )}
              <InputField label="Target GIR (mg/kg/min) → calculates required rate" value={targetGir} onChange={setTargetGir} placeholder="e.g. 5" isDark={isDark} />
              {calcRate !== null && (
                <ResultBox color="#0D9488">
                  <ResultRow label="Required infusion rate" value={`${calcRate} mL/hr`} color="#0D9488" large />
                </ResultBox>
              )}
              <InfoBox color="#059669" title="TPN / GIR Reference" isDark={isDark}
                text={"• Neonates: start GIR 4–6, increase by 1–2 mg/kg/min/day\n• PICU: target GIR 3–5; avoid >8 mg/kg/min (risk of hepatic steatosis)\n• Amino acids: neonates 3–4 g/kg/day; PICU 1.5–2 g/kg/day\n• Lipids (20%): 1–3 g/kg/day; start low and increase\n• Monitor glucose q4–6h; target 5–8 mmol/L (90–145 mg/dL)"} />
            </Body>
          )}
        </View>

        {/* ══ 10. PEDIATRIC BURNS ═════════════════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Pediatric Burns · Parkland Formula" icon="thermometer" color="#B45309"
            open={openSection === "burns"} onToggle={() => toggle("burns")} isDark={isDark} />
          {openSection === "burns" && (
            <Body>
              <Text style={[sh.refText, { color: textMuted }]}>Parkland: 4 × weight (kg) × %TBSA = total RL in 24h</Text>
              <View style={sh.triRow}>
                <View style={{ flex: 1 }}>
                  <InputField label="Weight (kg)" value={burnWt} onChange={setBurnWt} placeholder="20" isDark={isDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="Burn %TBSA" value={burnBsa} onChange={setBurnBsa} placeholder="30" isDark={isDark} />
                </View>
              </View>
              <View style={sh.chipRow}>
                <Chip label="Child (>1 yr)" selected={burnAge === "child"} color="#B45309" onPress={() => setBurnAge("child")} />
                <Chip label="Infant (<1 yr)" selected={burnAge === "infant"} color="#D97706" onPress={() => setBurnAge("infant")} />
              </View>
              {parkland24 > 0 && (
                <ResultBox color="#B45309">
                  <ResultRow label="Total fluid (Ringer's Lactate) 24h" value={`${parkland24} mL`} color="#B45309" large />
                  <ResultRow label="First 8 hrs (50%) rate" value={`${parklandFirst8Rate} mL/hr`} color="#B45309" />
                  <ResultRow label="Next 16 hrs (50%) rate" value={`${parklandNext16Rate} mL/hr`} color="#B45309" />
                  <ResultRow label="+ Maintenance (24h)" value={`${Math.round(maintBurn)} mL/day`} color="#B45309" />
                  <ResultRow label="Grand total fluid 24h" value={`${totalBurn24} mL`} color="#B45309" />
                </ResultBox>
              )}
              <InfoBox color="#B45309" title="Pediatric Burns Notes" isDark={isDark}
                text={"• Use Lund-Browder chart for %TBSA in children (Rule of 9s less accurate)\n• Count time from injury, not from hospital arrival\n• Add maintenance fluids (D5W/0.45% NaCl) to Parkland volume in children\n• Monitor urine output: target 0.5–1 mL/kg/hr; titrate fluids accordingly\n• Colloid (albumin 5%) may be added after 8–12h if haemodynamically unstable\n• Nasogastric feeding: start early once resuscitation stable"} />
            </Body>
          )}
        </View>

        {/* ══ 11. BLOODS / LYTES REFERENCE ═══════════════════════════════ */}
        <View style={sh.sWrap}>
          <SectionHeader title="Bloods & Lytes Reference" icon="droplet" color="#DC2626"
            open={openSection === "bloods"} onToggle={() => toggle("bloods")} isDark={isDark} />
          {openSection === "bloods" && (
            <Body>
              <View style={sh.resultBox}>
                {[
                  { label: "Packed Red Blood Cells", val: "10–15 mL/kg" },
                  { label: "FFP / Platelets", val: "10–20 mL/kg" },
                  { label: "10% Calcium Gluconate", val: "50–100 mg/kg IV" },
                  { label: "KCl (IV replacement)", val: "0.5–1 mEq/kg IV" },
                ].map((r) => (
                  <View key={r.label} style={sh.resultRow}>
                    <Text style={[sh.resultLabel, { color: textPrimary }]}>{r.label}</Text>
                    <Text style={[sh.resultValue, { color: "#DC2626" }]}>{r.val}</Text>
                  </View>
                ))}
              </View>
              <InfoBox color="#DC2626" title="Transfusion Safety" isDark={isDark}
                text={"• Verify blood type & crossmatch before transfusion\n• KCl must be given slowly with cardiac monitoring\n• Monitor calcium levels when using citrate-containing products\n• Platelets: single donor preferred in children\n• PRBCs: volume-restricted in cardiac patients"} />
            </Body>
          )}
        </View>

        <ProfessionalFooter />
      </ScrollView>
    </View>
  );
}

// ─── Shared Stylesheet ────────────────────────────────────────────────────────
const sh = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { paddingHorizontal: 16, paddingBottom: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  topHeaderRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  headerSub: { fontSize: 12, marginTop: 2 },
  nightBtn: { padding: 10, borderRadius: 10, marginLeft: 10 },
  sWrap: { marginHorizontal: 14, marginTop: 10 },
  header: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
  icon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  title: { flex: 1, fontSize: 15, fontWeight: "700" },
  body: { borderWidth: 1, borderTopWidth: 0, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: 14, gap: 10 },
  inputWrap: { gap: 4 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 12, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontWeight: "600" },
  unit: { fontSize: 13, fontWeight: "600", minWidth: 40 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: "700" },
  resultBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 6, marginTop: 4 },
  resultRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 },
  resultLabel: { fontSize: 12, fontWeight: "600", flex: 1 },
  resultValue: { fontWeight: "800", textAlign: "right" },
  infoBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 },
  infoTitle: { fontSize: 13, fontWeight: "700" },
  infoText: { fontSize: 12, lineHeight: 19 },
  refText: { fontSize: 11, lineHeight: 16 },
  triRow: { flexDirection: "row", gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: "700", marginTop: 4 },
  timerBox: { borderWidth: 2, borderRadius: 16, padding: 16, alignItems: "center", gap: 8 },
  timerTime: { fontSize: 48, fontWeight: "900", letterSpacing: -1 },
  timerStep: { fontSize: 13, fontWeight: "700", textAlign: "center" },
  timerBtns: { flexDirection: "row", gap: 10 },
  timerBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  timerBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  seStep: { borderLeftWidth: 4, paddingLeft: 12, paddingVertical: 10, borderRadius: 8, gap: 4 },
  seStepTitle: { fontSize: 14, fontWeight: "800" },
  seStepLine: { fontSize: 13, lineHeight: 19 },
  tetBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 10 },
  tetStep: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  tetNum: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  tetNumText: { color: "#FFF", fontSize: 11, fontWeight: "800" },
  tetLabel: { fontSize: 13, fontWeight: "700", lineHeight: 19 },
  toxDropdown: { borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 4 },
  toxDropdownLabel: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  toxDropdownRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  toxDropdownValue: { fontSize: 14, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "#00000080", justifyContent: "center", alignItems: "center", padding: 20 },
  modalCard: { borderRadius: 16, width: "100%", maxWidth: 380, maxHeight: "80%", overflow: "hidden" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  modalCloseBtn: { padding: 4 },
  modalOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, marginHorizontal: 8, marginVertical: 2, borderRadius: 10 },
  modalOptionText: { fontSize: 14, fontWeight: "600" },
  favRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
});
