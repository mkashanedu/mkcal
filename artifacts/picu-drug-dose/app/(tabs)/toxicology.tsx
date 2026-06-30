import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarButton } from "@/components/StarButton";
import { useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { useDrawer } from "@/context/DrawerContext";
import Colors from "@/constants/colors";

const C = Colors.light;

// ─── Shared helpers ───────────────────────────────────────────────────────────

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

function MaxDoseRow({ value, color }: { value: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: color + "30" }}>
      <Feather name="shield" size={14} color={color} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color }}>Pediatric Max: {value}</Text>
    </View>
  );
}

// ─── Antidote data type ───────────────────────────────────────────────────────

type AntidoteKey =
  | "nac" | "naloxone" | "flumazenil" | "charcoal" | "atropine"
  | "calcium-gluconate" | "glucagon" | "deferoxamine" | "bicarbonate"
  | "intralipid" | "pyridoxine" | "edta"
  | "cyanide" | "digoxin-fab" | "fomepizole" | "methylene-blue";

interface AntidoteOption {
  key: AntidoteKey;
  label: string;
  color: string;
}

const ANTIDOTE_OPTIONS: AntidoteOption[] = [
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
  { key: "cyanide", label: "Cyanide Toxicity (Hydroxocobalamin / Na Thiosulfate)", color: "#991B1B" },
  { key: "digoxin-fab", label: "Digoxin Toxicity (DigiFab)", color: "#B45309" },
  { key: "fomepizole", label: "Methanol / Ethylene Glycol (Fomepizole)", color: "#7C3AED" },
  { key: "methylene-blue", label: "Methaemoglobinaemia (Methylene Blue)", color: "#1E40AF" },
];

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ToxicologyScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { openDrawer } = useDrawer();
  const { weight: ctxWeight } = useWeight();
  const { isFav, toggleFav } = useFavorites();
  const { isFav: isFavGlobal, toggleFav: toggleFavGlobal } = useFavorites();

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const textPrimary = isDark ? "#CCD6F6" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const [toxWt, setToxWt] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [toxDrug, setToxDrug] = useState<AntidoteKey>("nac");
  const [showDropdown, setShowDropdown] = useState(false);
  const [digLevel, setDigLevel] = useState(""); // ng/mL for DigiFab

  const toxWtN = Math.min(parseFloat(toxWt) || 0, 100);
  const digLevelN = parseFloat(digLevel) || 0;

  // ── Computed doses ──
  const nacP1 = +(150 * toxWtN).toFixed(0);
  const nacP2 = +(50 * toxWtN).toFixed(0);
  const nacP3 = +(100 * toxWtN).toFixed(0);
  const nalDose = +(0.01 * toxWtN).toFixed(2);
  const fluDose = +(0.01 * toxWtN).toFixed(2);
  const charcoalDose = +(1 * toxWtN).toFixed(0);
  const charcoalCap = Math.min(charcoalDose, 50);
  const atropineDose = +(0.05 * toxWtN).toFixed(2);
  const atropineCap = Math.min(atropineDose, 2);
  const calciumDose = +(60 * toxWtN).toFixed(0);
  const calciumCap = Math.min(calciumDose, 3000);
  const glucagonDose = +(0.1 * toxWtN).toFixed(2);
  const glucagonCap = Math.min(glucagonDose, 10);
  const deferoxRate = +(15 * toxWtN).toFixed(0);
  const bicarbRange = `${+(1 * toxWtN).toFixed(1)}–${+(2 * toxWtN).toFixed(1)}`;
  const intralipidDose = +(1.5 * toxWtN).toFixed(1);
  const pyridoxineDose = +(70 * toxWtN).toFixed(0);
  const pyridoxineCap = Math.min(pyridoxineDose, 5000);
  const edtaDose = +(50 * toxWtN).toFixed(0);

  // New antidotes
  const hydroxocoDose = +(70 * toxWtN).toFixed(0);
  const hydroxocoCap = Math.min(hydroxocoDose, 5000);
  const thiosulfateDose = +(1.65 * toxWtN).toFixed(1);
  const thiosulfateCap = Math.min(thiosulfateDose, 50);
  const digFabVials = digLevelN > 0 && toxWtN > 0 ? Math.ceil((digLevelN * toxWtN) / 100) : 0;
  const digFabMg = digFabVials * 38;
  const fomepizoleLoad = +(15 * toxWtN).toFixed(0);
  const fomepizoleLoadCap = Math.min(fomepizoleLoad, 1000);
  const fomepizoleMaint = +(10 * toxWtN).toFixed(0);
  const fomepizoleMaintCap = Math.min(fomepizoleMaint, 1000);
  const methyleneDose = +(1 * toxWtN).toFixed(0);
  const methyleneCap = Math.min(+(2 * toxWtN).toFixed(0), 7000); // max 7 mg/kg total, 1-2 per dose
  const methyleneTotalMax = Math.min(+(7 * toxWtN).toFixed(0), 7000);

  const selectedOpt = ANTIDOTE_OPTIONS.find((o) => o.key === toxDrug)!;
  const toxLabel = selectedOpt.label;
  const toxColor = selectedOpt.color;

  function renderAntidote() {
    if (toxWtN <= 0) return null;
    switch (toxDrug) {
      case "nac":
        return (
          <>
            <ResultBox color="#0369A1">
              <Text style={[sh.resultLabel, { color: "#0369A1" + "BB" }]}>N-Acetylcysteine (Paracetamol Poisoning)</Text>
              <ResultRow label="Phase 1 — 150 mg/kg in 200 mL D5W over 60 min" value={`${nacP1} mg`} color="#0369A1" large />
              <ResultRow label="Phase 2 — 50 mg/kg in 500 mL D5W over 4 hrs" value={`${nacP2} mg`} color="#0369A1" />
              <ResultRow label="Phase 3 — 100 mg/kg in 1L D5W over 16 hrs" value={`${nacP3} mg`} color="#0369A1" />
              <MaxDoseRow value="No absolute max; titrate to clinical response" color="#0369A1" />
            </ResultBox>
            <InfoBox color="#0369A1" title="Preparation & Admin — NAC" isDark={isDark}
              text={"Start within 8–10 hours of ingestion for maximum efficacy\nCheck paracetamol level at 4h post-ingestion and plot on Rumack-Matthew nomogram\nAnaphylactoid reactions: slow infusion or interrupt; treat with antihistamine\nContinue until clinical improvement and LFTs trending down"} />
          </>
        );
      case "naloxone":
        return (
          <>
            <ResultBox color="#16A34A">
              <Text style={[sh.resultLabel, { color: "#16A34A" + "BB" }]}>Naloxone — Opioid Reversal</Text>
              <ResultRow label="Dose (0.01 mg/kg IV, max 2 mg)" value={`${Math.min(nalDose, 2)} mg`} color="#16A34A" large />
              <ResultRow label="Repeat every 2–3 min if needed" value="Max total 10 mg" color="#16A34A" />
              <ResultRow label="Infusion (if required)" value={`${+(0.005 * toxWtN).toFixed(3)} mg/kg/hr`} color="#16A34A" />
              <MaxDoseRow value="2 mg/dose IV; max cumulative 10 mg" color="#16A34A" />
            </ResultBox>
            <InfoBox color="#16A34A" title="Preparation & Admin — Naloxone" isDark={isDark}
              text={"Half-life shorter than most opioids — resedation may occur\nMonitor closely for 4–6 hours after last dose\nIn neonates: 0.01 mg/kg every 2–3 min IV/IM/SC\nAvoid large bolus in opioid-dependent patients (precipitates withdrawal)"} />
          </>
        );
      case "flumazenil":
        return (
          <>
            <ResultBox color="#7C3AED">
              <Text style={[sh.resultLabel, { color: "#7C3AED" + "BB" }]}>Flumazenil — Benzodiazepine Reversal</Text>
              <ResultRow label="Dose (0.01 mg/kg IV, max 0.2 mg/dose)" value={`${Math.min(fluDose, 0.2)} mg`} color="#7C3AED" large />
              <ResultRow label="Repeat every 1 min (max 4 doses)" value="Total max 1 mg" color="#7C3AED" />
              <MaxDoseRow value="0.2 mg per dose; total max 1 mg" color="#7C3AED" />
            </ResultBox>
            <WarningBox color="#DC2626" title="⚠ Flumazenil Contraindications" isDark={isDark}
              text={"AVOID in BZD-dependent patients (precipitates severe withdrawal/seizures)\nAvoid in mixed overdose with TCAs (risk of arrhythmia)\nShort duration (30–60 min) — resedation common; prepare for re-dosing\nDo NOT use if seizures controlled by BZDs — will unmask seizures"} />
          </>
        );
      case "charcoal":
        return (
          <>
            <ResultBox color="#374151">
              <Text style={[sh.resultLabel, { color: "#374151" + "BB" }]}>Activated Charcoal — GI Decontamination</Text>
              <ResultRow label="Dose (1 g/kg PO/NG, max 50 g)" value={`${charcoalCap} g`} color="#374151" large />
              <MaxDoseRow value="50 g total (single dose)" color="#374151" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Charcoal" isDark={isDark}
              text={"Mix with water. Avoid in depressed mental status\nNOT for Iron, Lithium, Acids, or Alkalis\nAspiration risk if gag reflex absent — protect airway first\nMost effective within 1 hour of ingestion\nMay cause constipation or vomiting"} />
          </>
        );
      case "atropine":
        return (
          <>
            <ResultBox color="#DC2626">
              <Text style={[sh.resultLabel, { color: "#DC2626" + "BB" }]}>Atropine — Organophosphates</Text>
              <ResultRow label="Dose (0.05 mg/kg IV, max 2 mg)" value={`${atropineCap} mg`} color="#DC2626" large />
              <MaxDoseRow value="2 mg per dose; titrate to atropinization" color="#DC2626" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Atropine" isDark={isDark}
              text={"Rapid IV push. Repeat every 5–10 mins until secretions dry\nLarge doses may be needed (hundreds of mg in severe cases)\nMonitor HR, pupil size, and bronchial secretions\nContinue until atropinization (dry skin, tachycardia, dilated pupils)\nCombine with pralidoxime (2-PAM) for organophosphate poisoning"} />
          </>
        );
      case "calcium-gluconate":
        return (
          <>
            <ResultBox color="#0891B2">
              <Text style={[sh.resultLabel, { color: "#0891B2" + "BB" }]}>Calcium Gluconate 10% — CCB Overdose</Text>
              <ResultRow label="Dose (60 mg/kg IV, max 3 g)" value={`${calciumCap} mg`} color="#0891B2" large />
              <MaxDoseRow value="3,000 mg (3 g) per dose" color="#0891B2" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Calcium Gluconate" isDark={isDark}
              text={"Slow IV over 5–10 mins. Continuous ECG required\nTissue necrosis with extravasation — use central line if possible\nNEVER give IV push — fatal bradycardia/asystole\nIncompatible with sodium bicarbonate (precipitates)\nHave calcium gluconate ready for magnesium sulfate toxicity"} />
          </>
        );
      case "glucagon":
        return (
          <>
            <ResultBox color="#D97706">
              <Text style={[sh.resultLabel, { color: "#D97706" + "BB" }]}>Glucagon — Beta-Blocker Overdose</Text>
              <ResultRow label="Dose (0.1 mg/kg IV, max 10 mg)" value={`${glucagonCap} mg`} color="#D97706" large />
              <MaxDoseRow value="10 mg per dose" color="#D97706" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Glucagon" isDark={isDark}
              text={"Direct IV push over 1 min\nHyperglycemia and hyperglycemic response expected\nNausea/vomiting common — antiemetics may be needed\nHigh-dose insulin therapy + glucose is preferred rescue\nMay need repeated boluses or high-dose infusion 0.05–0.15 mg/kg/hr"} />
          </>
        );
      case "deferoxamine":
        return (
          <>
            <ResultBox color="#7C3AED">
              <Text style={[sh.resultLabel, { color: "#7C3AED" + "BB" }]}>Deferoxamine — Iron Toxicity</Text>
              <ResultRow label="Rate (15 mg/kg/hr IV infusion)" value={`${deferoxRate} mg/hr`} color="#7C3AED" large />
              <MaxDoseRow value="15 mg/kg/hr max rate" color="#7C3AED" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Deferoxamine" isDark={isDark}
              text={"Max rate 15 mg/kg/hr. Watch for hypotension\nContinue until urine turns pink (vin-rose urine) — indicates iron chelation\nMay cause acute lung injury (ARDS) at high doses >24 hrs\nMonitor for allergic reactions; reduce infusion rate if hypotension\nRe-check serum iron and TIBC at 6–8 hrs"} />
          </>
        );
      case "bicarbonate":
        return (
          <>
            <ResultBox color="#0891B2">
              <Text style={[sh.resultLabel, { color: "#0891B2" + "BB" }]}>Sodium Bicarbonate — TCA Overdose</Text>
              <ResultRow label="Dose (1–2 mEq/kg IV)" value={`${bicarbRange} mEq`} color="#0891B2" large />
              <MaxDoseRow value="2 mEq/kg per dose; titrate to pH 7.45–7.55" color="#0891B2" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Sodium Bicarbonate" isDark={isDark}
              text={"Target pH 7.45–7.55 and narrow QRS on ECG\nAvoid in respiratory acidosis — worsens intracellular acidosis\nHypernatremia, hyperosmolarity risk with repeated doses\nIncompatible with calcium gluconate (precipitates)\nCheck blood gas after each dose"} />
          </>
        );
      case "intralipid":
        return (
          <>
            <ResultBox color="#F59E0B">
              <Text style={[sh.resultLabel, { color: "#F59E0B" + "BB" }]}>Intralipid 20% — Local Anesthetic Toxicity</Text>
              <ResultRow label="Dose (1.5 mL/kg IV bolus)" value={`${intralipidDose} mL`} color="#F59E0B" large />
              <MaxDoseRow value="Max 12 mL/kg total over 30 min" color="#F59E0B" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Intralipid" isDark={isDark}
              text={"Administer rapid bolus, follow with 0.25 mL/kg/min infusion\nMaximum 10–12 mL/kg over 30 min\nMay turn plasma/urine milky white — expected\nContinue for 30 min after hemodynamic stability restored\nCall for help early; lipid emulsion is a rescue therapy"} />
          </>
        );
      case "pyridoxine":
        return (
          <>
            <ResultBox color="#16A34A">
              <Text style={[sh.resultLabel, { color: "#16A34A" + "BB" }]}>Pyridoxine — Isoniazid/TB Drug Seizures</Text>
              <ResultRow label="Dose (70 mg/kg IV, max 5 g)" value={`${pyridoxineCap} mg`} color="#16A34A" large />
              <MaxDoseRow value="5,000 mg (5 g) per dose" color="#16A34A" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Pyridoxine" isDark={isDark}
              text={"Dilute in D5W. Slow IV over 30–60 mins\nAdminister gram-for-gram with INH if amount ingested is known\nSeizures may recur — continue until INH metabolized\nMonitor for peripheral neuropathy with chronic use\nIf IV unavailable, use IM or PO route"} />
          </>
        );
      case "edta":
        return (
          <>
            <ResultBox color="#475569">
              <Text style={[sh.resultLabel, { color: "#475569" + "BB" }]}>CaNa2 EDTA — Lead Toxicity</Text>
              <ResultRow label="Dose (50 mg/kg/day IV)" value={`${edtaDose} mg/day`} color="#475569" large />
              <MaxDoseRow value="50 mg/kg/day; max 75 mg/kg/day (severe)" color="#475569" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — CaNa2 EDTA" isDark={isDark}
              text={"Ensure adequate urine output before administration\nRenal toxicity risk — monitor creatinine daily\nDo NOT confuse with Na2EDTA (disodium EDTA) — causes fatal hypocalcemia\nUse CaNa2EDTA only. Give IM with procaine if IV access limited\nBaseline and follow-up lead levels required"} />
          </>
        );
      case "cyanide":
        return (
          <>
            <ResultBox color="#991B1B">
              <Text style={[sh.resultLabel, { color: "#991B1B" + "BB" }]}>Cyanide Toxicity — Hydroxocobalamin / Sodium Thiosulfate</Text>
              <ResultRow label="Hydroxocobalamin (70 mg/kg IV, max 5 g)" value={`${hydroxocoCap} mg`} color="#991B1B" large />
              <ResultRow label="Administered over 15 min" value="Renally excreted as cyanocobalamin" color="#991B1B" />
              <ResultRow label="Sodium Thiosulfate (1.65 mL/kg 25%, max 50 mL)" value={`${thiosulfateCap} mL`} color="#991B1B" />
              <ResultRow label="Administered over 10–20 min (after hydroxocobalamin)" value="Sulfur donor converts CN⁻ → SCN⁻" color="#991B1B" />
              <MaxDoseRow value="Hydroxocobalamin max 5 g; Thiosulfate max 50 mL" color="#991B1B" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Cyanide Antidotes" isDark={isDark}
              text={"Hydroxocobalamin: IV over 15 min; repeat once if needed\nSodium thiosulfate: give AFTER hydroxocobalamin if needed\nMonitor blood pressure — transient hypertension with hydroxocobalamin\nRed discoloration of skin/urine is expected with hydroxocobalamin\nContinue supportive care; monitor lactate and acid-base status"} />
            <InfoBox color="#991B1B" title="Clinical Pearls — Cyanide" isDark={isDark}
              text={"Hydroxocobalamin binds cyanide to form cyanocobalamin (excreted renally)\nSodium thiosulfate donates sulfur to convert cyanide to thiocyanate (less toxic)\nUse both agents together in severe poisoning\nConsider hyperbaric oxygen if refractory despite antidotes"} />
          </>
        );
      case "digoxin-fab":
        return (
          <>
            <ResultBox color="#B45309">
              <Text style={[sh.resultLabel, { color: "#B45309" + "BB" }]}>Digoxin Immune Fab (DigiFab) — Digoxin Toxicity</Text>
              <ResultRow label="DigiFab vials needed" value={digFabVials > 0 ? `${digFabVials} vial${digFabVials > 1 ? "s" : ""}` : "Enter digoxin level"} color="#B45309" large />
              <ResultRow label="Total DigiFab dose" value={`${digFabMg} mg`} color="#B45309" />
              <ResultRow label="Formula" value="Vials = (Digoxin ng/mL × weight kg) / 100" color="#B45309" />
              <MaxDoseRow value="Empiric max 10–20 vials if level unknown" color="#B45309" />
            </ResultBox>
            <InputField label="Serum Digoxin (ng/mL)" value={digLevel} onChange={setDigLevel} placeholder="e.g. 4.2" unit="ng/mL" isDark={isDark} />
            <WarningBox color="#DC2626" title="Preparation & Admin — DigiFab" isDark={isDark}
              text={"Reconstitute each 38 mg vial with 4 mL sterile water; infuse IV over 30 min\nMonitor for reversal of arrhythmias and hyperkalemia\nMay cause hypokalemia as digoxin effect reverses\nIn renal failure, Fab-digoxin complex may accumulate — monitor levels\nEach vial (38 mg) binds ~0.5 mg digoxin"} />
            <InfoBox color="#B45309" title="Clinical Pearls — Digoxin Fab" isDark={isDark}
              text={"Indicated for: life-threatening arrhythmias, K+ >5 mEq/L, acute ingestion >0.1 mg/kg\nCardiac effects reverse within 30–90 min; full effect by 4 hours\nSerum digoxin levels rise post-Fab (bound drug is measured) — do NOT use for monitoring\nConsider in any child with arrhythmia + possible digoxin exposure"} />
          </>
        );
      case "fomepizole":
        return (
          <>
            <ResultBox color="#7C3AED">
              <Text style={[sh.resultLabel, { color: "#7C3AED" + "BB" }]}>Fomepizole (4-MP) — Methanol / Ethylene Glycol</Text>
              <ResultRow label="Loading (15 mg/kg IV, max 1 g)" value={`${fomepizoleLoadCap} mg`} color="#7C3AED" large />
              <ResultRow label="Maintenance (10 mg/kg q12h × 4 doses)" value={`${fomepizoleMaintCap} mg`} color="#7C3AED" />
              <ResultRow label="Then 15 mg/kg q12h until EG <20 mg/dL" value="Titrate to clearance" color="#7C3AED" />
              <MaxDoseRow value="Loading max ~1,000 mg; continue until toxic alcohol cleared" color="#7C3AED" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Fomepizole" isDark={isDark}
              text={"Administer IV over 30 min\nDilute in 100 mL NS or D5W\nIf fomepizole unavailable, use ethanol as alternative\nMonitor ethylene glycol / methanol levels q4–6h\nAdd thiamine (100 mg) and pyridoxine (50 mg) for ethylene glycol to shunt metabolism\nHemodialysis may be needed for severe acidosis or renal failure"} />
            <InfoBox color="#7C3AED" title="Clinical Pearls — Fomepizole" isDark={isDark}
              text={"Fomepizole inhibits alcohol dehydrogenase — blocks toxic metabolite formation\nContinue until ethylene glycol <20 mg/dL AND no metabolic acidosis\nCost is high; if unavailable, IV ethanol is an effective alternative\nConsider dialysis if: pH <7.25, refractory electrolyte disturbances, renal failure, or EG >50 mg/dL"} />
          </>
        );
      case "methylene-blue":
        return (
          <>
            <ResultBox color="#1E40AF">
              <Text style={[sh.resultLabel, { color: "#1E40AF" + "BB" }]}>Methylene Blue — Methaemoglobinaemia</Text>
              <ResultRow label="Dose (1–2 mg/kg IV over 5 min)" value={`${methyleneDose} mg`} color="#1E40AF" large />
              <ResultRow label="Repeat in 1 hour if needed" value={`Max total ${methyleneTotalMax} mg`} color="#1E40AF" />
              <ResultRow label="Max single dose" value={`${methyleneCap} mg`} color="#1E40AF" />
              <MaxDoseRow value="7 mg/kg total cumulative dose" color="#1E40AF" />
            </ResultBox>
            <WarningBox color="#DC2626" title="Preparation & Admin — Methylene Blue" isDark={isDark}
              text={"Slow IV push over 5 min\nActs via NADPH-methemoglobin reductase — reduces MetHb back to Hb\nMonitor SpO2 and ABG — expect rapid cyanosis resolution within 30 min\nMay cause blue/green urine discoloration — benign\nDose-related serotonin syndrome risk at higher doses"} />
            <WarningBox color="#B45309" title="⚠ Absolute Contraindication" isDark={isDark}
              text={"G6PD DEFICIENCY — methylene blue causes severe hemolysis\nTest for G6PD deficiency before administration if time permits\nIf G6PD deficiency confirmed: use exchange transfusion or hyperbaric oxygen\nNeonates are at higher risk for hemolysis — use extreme caution"} />
            <InfoBox color="#1E40AF" title="Clinical Pearls — Methylene Blue" isDark={isDark}
              text={"Indicated for methemoglobin >30% or symptomatic patient\nDapsone, nitrates, and local anesthetics are common causes in children\n1 mg/kg usually sufficient; reserve 2 mg/kg for severe cases\nIf no response, consider underlying NADPH reductase deficiency (rare)"} />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <View style={[sh.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[sh.topHeader, { paddingTop: topPadding + 12, backgroundColor: isDark ? "#0A192F" : "#FFF" }]}>
        <View style={sh.topHeaderRow}>
          <TouchableOpacity
            onPress={openDrawer}
            style={[sh.hamburgerBtn, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
            activeOpacity={0.7}
          >
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : C.tint} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[sh.headerTitle, { color: textPrimary }]}>Toxicology & Antidotes</Text>
            <Text style={[sh.headerSub, { color: textMuted }]}>16 antidotes • Weight-based dosing • Ref: Harriet Lane 23e / Nelson's</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Weight + Selector */}
        <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
          <InputField label="Weight (kg, max 100)" value={toxWt} onChange={setToxWt} placeholder="e.g. 15" isDark={isDark} />

          <TouchableOpacity
            onPress={() => setShowDropdown(true)}
            activeOpacity={0.8}
            style={[sh.toxDropdown, { borderColor: isDark ? "#233554" : "#E2E8F0", backgroundColor: isDark ? "#0A192F" : "#F8FAFC" }]}
          >
            <Text style={[sh.toxDropdownLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>Select Poison / Antidote</Text>
            <View style={sh.toxDropdownRow}>
              <Text style={[sh.toxDropdownValue, { color: isDark ? "#FFFFFF" : "#0D1B2A" }]}>{toxLabel}</Text>
              <Feather name="chevron-down" size={18} color={isDark ? "#8892B0" : "#64748B"} />
            </View>
          </TouchableOpacity>

          <Modal visible={showDropdown} transparent animationType="fade" onRequestClose={() => setShowDropdown(false)}>
            <View style={sh.modalOverlay}>
              <View style={[sh.modalCard, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
                <View style={sh.modalHeader}>
                  <Text style={[sh.modalTitle, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>Select Poison / Antidote</Text>
                  <TouchableOpacity onPress={() => setShowDropdown(false)} style={sh.modalCloseBtn}>
                    <Feather name="x" size={20} color={isDark ? "#8892B0" : "#64748B"} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={ANTIDOTE_OPTIONS}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => {
                    const selected = toxDrug === item.key;
                    return (
                      <TouchableOpacity
                        onPress={() => { setToxDrug(item.key); setShowDropdown(false); }}
                        style={[sh.modalOption, {
                          backgroundColor: selected ? item.color + "18" : isDark ? "#0A192F" : "#F8FAFC",
                          borderLeftColor: selected ? item.color : "transparent",
                          borderLeftWidth: selected ? 3 : 0,
                        }]}
                      >
                        <Text style={[sh.modalOptionText, { color: selected ? item.color : isDark ? "#CCD6F6" : "#0D1B2A" }]}>{item.label}</Text>
                        {selected && <Feather name="check" size={18} color={item.color} />}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </Modal>

          {toxWtN > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 6 }}>
              <StarButton
                isFav={isFavGlobal(`tox-${toxDrug}`)}
                onToggle={() =>
                  toggleFavGlobal({
                    id: `tox-${toxDrug}`,
                    type: "antidote",
                    label: toxLabel,
                    color: toxColor,
                  })
                }
              />
            </View>
          )}

          <View style={{ gap: 10, marginTop: 10 }}>
            {renderAntidote()}
          </View>

          {/* Citation footer */}
          <View style={[sh.citationBox, { backgroundColor: isDark ? "#0A192F" : "#F8FAFD", borderColor: isDark ? "#1E3A5F" : "#E2E8F0" }]}>
            <Feather name="book-open" size={13} color={textMuted} style={{ marginTop: 1 }} />
            <Text style={{ flex: 1, fontSize: 11, color: textMuted, fontFamily: "Inter_400Regular", lineHeight: 16, fontStyle: "italic" }}>
              Reference: All antidote protocols derived from Harriet Lane 23e / Nelson's Pediatrics • Pediatric doses apply to ages ≤1 year unless specified.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sh = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { paddingHorizontal: 16, paddingBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  topHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  hamburgerBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headerSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  inputWrap: { marginBottom: 10 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_500Medium" },
  unit: { fontSize: 13, fontFamily: "Inter_500Medium" },
  resultBox: { borderWidth: 1.5, borderRadius: 12, padding: 12, gap: 6 },
  resultRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 2 },
  resultLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", flex: 1, lineHeight: 16 },
  resultValue: { fontFamily: "Inter_700Bold", textAlign: "right" },
  infoBox: { borderWidth: 1, borderRadius: 10, padding: 10, gap: 4 },
  infoTitle: { fontSize: 12, fontFamily: "Inter_700Bold" },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  toxDropdown: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 4 },
  toxDropdownLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  toxDropdownRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  toxDropdownValue: { fontSize: 15, fontFamily: "Inter_700Bold", flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", paddingHorizontal: 20 },
  modalCard: { borderRadius: 16, maxHeight: "70%", paddingVertical: 12 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  modalTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  modalCloseBtn: { padding: 4 },
  modalOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  modalOptionText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1 },
  citationBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 14, marginBottom: 20 },
});
