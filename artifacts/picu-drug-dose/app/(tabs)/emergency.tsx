import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { DRUGS, calculateDose } from "@/constants/drugs";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useWeight } from "@/context/WeightContext";
import { useDrawer } from "@/context/DrawerContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";
import { StarButton } from "@/components/StarButton";

// ── CPR / Code Blue Timers ───────────────────────────────────────────────────────────────
const CPR_CYCLE_SECS = 120;

function useCPRTimers(epiIntervalSec: number) {
  const [running, setRunning] = useState(false);
  const [cprSecs, setCprSecs] = useState(CPR_CYCLE_SECS);
  const [cprCycle, setCprCycle] = useState(0);
  const [switchAlert, setSwitchAlert] = useState(false);
  const [epiSecs, setEpiSecs] = useState(epiIntervalSec);
  const [epiDue, setEpiDue] = useState(false);
  const [epiCount, setEpiCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const epiIntervalRef = useRef(epiIntervalSec);
  epiIntervalRef.current = epiIntervalSec;

  const start = useCallback(() => {
    setCprSecs(CPR_CYCLE_SECS);
    setEpiSecs(epiIntervalRef.current);
    setCprCycle(0);
    setEpiCount(0);
    setSwitchAlert(false);
    setEpiDue(false);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    setCprSecs(CPR_CYCLE_SECS);
    setEpiSecs(epiIntervalRef.current);
    setCprCycle(0);
    setEpiCount(0);
    setSwitchAlert(false);
    setEpiDue(false);
  }, []);

  const acknowledgeEpi = useCallback(() => setEpiDue(false), []);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCprSecs((prev) => {
        if (prev <= 1) {
          setSwitchAlert(true);
          setCprCycle((c) => c + 1);
          if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
          switchTimeoutRef.current = setTimeout(() => setSwitchAlert(false), 4000);
          return CPR_CYCLE_SECS;
        }
        return prev - 1;
      });
      setEpiSecs((prev) => {
        if (prev <= 1) {
          setEpiDue(true);
          setEpiCount((c) => c + 1);
          return epiIntervalRef.current;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    };
  }, []);

  return { running, cprSecs, cprCycle, switchAlert, epiSecs, epiDue, epiCount, start, stop, acknowledgeEpi };
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

// ── ET Tube, Airway, Defibrillation formulas (Harriet Lane 23e · PALS 2025) ───
function calcETTube(ageYears: number) {
  const cuffed = ageYears / 4 + 3.5;
  const uncuffed = ageYears / 4 + 4;
  const cuffedNum = +(ageYears / 4 + 3.5).toFixed(1);
  const uncuffedStr = uncuffed.toFixed(1);
  const cuffedStr = cuffed.toFixed(1);
  const depth =
    ageYears >= 1
      ? `${(ageYears / 2 + 12).toFixed(0)} cm`
      : `${(ageYears * 4 + 8).toFixed(0)} cm`;
  return { uncuffed: uncuffedStr, cuffed: cuffedStr, cuffedNum, depth };
}

function calcSuctionCatheter(ettubeSize: number) {
  return Math.round(ettubeSize * 2);
}

function calcDefib(weightKg: number) {
  const unsync1st = Math.min(+(2 * weightKg).toFixed(0), 200);
  const unsyncSub = Math.min(+(4 * weightKg).toFixed(0), 360);
  const unsyncMax = Math.min(+(10 * weightKg).toFixed(0), 360);
  const sync1st   = Math.min(+(0.5 * weightKg).toFixed(0), 50);
  const syncSub   = Math.min(+(2 * weightKg).toFixed(0), 100);
  return { unsync1st, unsyncSub, unsyncMax, sync1st, syncSub };
}

// Laryngoscope blade by age (PALS 2025)
function calcBlade(ageYears: number) {
  if (ageYears < 0.08) return "Miller 00";
  if (ageYears < 1)   return "Miller 0";
  if (ageYears < 6)   return "Miller 1";
  if (ageYears < 12)  return "Miller 2 / Mac 2";
  return "Mac 3";
}

// LMA size by AGE (PALS 2025)
function calcLMA(ageYears: number) {
  if (ageYears < 1)   return "1";
  if (ageYears < 5)   return "1.5";
  if (ageYears < 10)  return "2";
  if (ageYears < 15)  return "2.5";
  if (ageYears < 20)  return "3";
  return "4";
}

function calcTargetVitals(ageYears: number) {
  let minHR: number, maxHR: number, minSBP: number;
  if (ageYears < 1) { minHR = 100; maxHR = 160; minSBP = 60; }
  else if (ageYears < 6) { minHR = 80; maxHR = 140; minSBP = 70; }
  else if (ageYears < 12) { minHR = 70; maxHR = 120; minSBP = 80; }
  else { minHR = 60; maxHR = 100; minSBP = 90; }
  return { minHR, maxHR, minSBP };
}

// Weight/Age cross-validation (WHO median approximations)
function checkWeightAge(weightKg: number, ageYears: number): string | null {
  if (ageYears <= 0 || weightKg <= 0) return "Enter Age and Weight to calculate doses";
  const expected =
    ageYears < 1
      ? 3.2 + ageYears * 6
      : ageYears < 13
      ? 9.5 + (ageYears - 1) * 2.5
      : 40 + (ageYears - 13) * 4;
  if (weightKg < expected * 0.45)
    return `Weight ${weightKg} kg very low for age ${ageYears} yrs (expected ~${Math.round(expected)} kg)`;
  if (weightKg > expected * 2.2)
    return `Weight ${weightKg} kg very high for age ${ageYears} yrs (expected ~${Math.round(expected)} kg)`;
  return null;
}

interface HsTsItem {
  label: string;
  action: string;
}

const HsItems: HsTsItem[] = [
  { label: "Hypovolemia", action: "20 mL/kg NS/RL Bolus" },
  { label: "Hypoxia", action: "100% O2, verify ET Tube / DOPE" },
  { label: "Hydrogen Ion (Acidosis)", action: "Ensure ventilation, consider NaBicarb" },
  { label: "Hypo- / Hyperkalemia", action: "CaGluconate for HyperK, Insulin+Dextrose" },
  { label: "Hypothermia", action: "Active warming" },
];

const TsItems: HsTsItem[] = [
  { label: "Tension pneumothorax", action: "Needle decompression" },
  { label: "Tamponade (cardiac)", action: "Pericardiocentesis" },
  { label: "Toxins", action: "Identify antidote" },
  { label: "Thrombosis (pulmonary / coronary)", action: "Thrombolytics / Consult" },
];

interface EmergencyItem {
  label: string;
  dose: string;
  doseSub?: string;
  route: string;
  notes: string;
  color: string;
  warning?: boolean;
  exceedsAdultMax?: boolean;
  adultMaxLabel?: string;
}

export default function EmergencyScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const colors = Colors.light;
  const { weight, setWeight, weightInput, setWeightInput } = useWeight();
  const { isFav, toggleFav } = useFavorites();
  const { openDrawer } = useDrawer();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  // ── Dual Inputs ──────────────────────────────────────────────────────
  const [ageYearsInput, setAgeYearsInput] = useState("2");
  const ageYears = Math.max(0, parseFloat(ageYearsInput) || 0);

  const [localWeightInput, setLocalWeightInput] = useState(weightInput);
  const localWeight = Math.min(Math.max(parseFloat(localWeightInput) || 0.5, 0.5), 150);

  useEffect(() => {
    setLocalWeightInput(weightInput);
  }, [weightInput]);

  const handleWeightChange = useCallback(
    (text: string) => {
      setLocalWeightInput(text);
      const num = parseFloat(text);
      if (!isNaN(num) && num >= 0.5 && num <= 150) {
        setWeight(num);
        setWeightInput(text);
      }
    },
    [setWeight, setWeightInput]
  );

  // ── Equipment (age-based ET/blade/LMA, weight-based defib) ───────────────────
  const ettube = calcETTube(ageYears);
  const defib = calcDefib(localWeight);
  const suctionFr = calcSuctionCatheter(ettube.cuffedNum);
  const blade = calcBlade(ageYears);
  const lma = calcLMA(ageYears);
  const targetVitals = calcTargetVitals(ageYears);
  const mismatchWarning = useMemo(
    () => checkWeightAge(localWeight, ageYears),
    [localWeight, ageYears]
  );

  // Hs & Ts interactive checklist
  const [hsChecked, setHsChecked] = useState<boolean[]>(HsItems.map(() => false));
  const [tsChecked, setTsChecked] = useState<boolean[]>(TsItems.map(() => false));
  const toggleH = (i: number) =>
    setHsChecked((prev) => {
      const c = [...prev];
      c[i] = !c[i];
      return c;
    });
  const toggleT = (i: number) =>
    setTsChecked((prev) => {
      const c = [...prev];
      c[i] = !c[i];
      return c;
    });

  // ── Critical Code Blue Drugs — reordered, all with adult max enforcement ─────────
  const emergencyCards = useMemo((): EmergencyItem[] => {
    const results: EmergencyItem[] = [];
    const w = localWeight;

    // 1. Epinephrine — Cardiac Arrest (RED — most critical)
    const epiDrug = DRUGS.find((d) => d.id === "epinephrine");
    if (epiDrug) {
      const calc = calculateDose(epiDrug.doses[0], w);
      results.push({
        label: "Epinephrine (Cardiac Arrest)",
        dose: calc.dose,
        doseSub: "(10 mcg/kg)",
        route: "IV / IO",
        notes: "0.1 mL/kg of 1:10,000. Repeat q3–5 min. Adult max 1000 mcg.",
        color: "#DC2626",
        warning: true,
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 2. Amiodarone — Pulseless VT/VF
    const amio = DRUGS.find((d) => d.id === "amiodarone");
    if (amio) {
      const calc = calculateDose(amio.doses[0], w);
      results.push({
        label: "Amiodarone (VT/VF)",
        dose: calc.dose,
        doseSub: "(5 mg/kg)",
        route: "IV/IO bolus",
        notes: "Give rapidly. Dilute D5W only. Max 300 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 3. Atropine — Bradycardia
    const atropine = DRUGS.find((d) => d.id === "atropine");
    if (atropine) {
      const calc = calculateDose(atropine.doses[0], w);
      results.push({
        label: "Atropine (Bradycardia)",
        dose: calc.dose,
        doseSub: "(0.02 mg/kg)",
        route: "IV / IO",
        notes: "Min 0.1 mg. Max 1 mg child / 3 mg adolescent.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 4. Adenosine — SVT
    const adenosine = DRUGS.find((d) => d.id === "adenosine");
    if (adenosine) {
      const calc = calculateDose(adenosine.doses[0], w);
      results.push({
        label: "Adenosine (SVT) 1st",
        dose: calc.dose,
        doseSub: "(0.1 mg/kg)",
        route: "IV rapid push + flush",
        notes: "2nd dose: 0.2 mg/kg. Max 6 mg / 12 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 5. Sodium Bicarbonate
    const bicarb = DRUGS.find((d) => d.id === "sodium-bicarbonate");
    if (bicarb) {
      const calc = calculateDose(bicarb.doses[0], w);
      results.push({
        label: "Sodium Bicarbonate",
        dose: calc.dose,
        doseSub: "(1 mEq/kg)",
        route: "IV slow push",
        notes: "Over 5–10 min. After airway secured. Max 50 mEq.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 6. Calcium Gluconate
    const caGlu = DRUGS.find((d) => d.id === "calcium-gluconate");
    if (caGlu) {
      const calc = calculateDose(caGlu.doses[0], w);
      results.push({
        label: "Calcium Gluconate",
        dose: calc.dose,
        doseSub: "(100–200 mg/kg)",
        route: "IV over 5–10 min",
        notes: "10% solution. Cardiac monitor. Max 2000 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 7. Lidocaine — VT/VF alternative
    const lido = DRUGS.find((d) => d.id === "lidocaine");
    if (lido) {
      const calc = calculateDose(lido.doses[0], w);
      results.push({
        label: "Lidocaine (VT/VF alt)",
        dose: calc.dose,
        doseSub: "(1 mg/kg)",
        route: "IV/IO",
        notes: "If amiodarone unavailable. Max 100 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 8. Dextrose D10 (neonates)
    const d10Raw = 2 * w;
    const d10Display = Math.min(Math.round(d10Raw), 25);
    results.push({
      label: "Dextrose D10",
      dose: `${d10Display} mL`,
      doseSub: "(2 mL/kg D10)",
      route: "IV",
      notes: "Neonate max 25 mL. Check glucose 15 min after.",
      color: "#0891B2",
      exceedsAdultMax: d10Raw > 25,
      adultMaxLabel: d10Raw > 25 ? "Max 25 mL D10 neonate — dose capped" : undefined,
    });

    // 9. Dextrose D25 (infants/children)
    const d25Raw = 2 * w;
    const d25Display = Math.min(Math.round(d25Raw), 25);
    results.push({
      label: "Dextrose D25",
      dose: `${d25Display} mL`,
      doseSub: "(2 mL/kg D25)",
      route: "IV",
      notes: "Infant/child. Max 25 mL D25.",
      color: "#0891B2",
      exceedsAdultMax: d25Raw > 25,
      adultMaxLabel: d25Raw > 25 ? "Max 25 mL D25 — dose capped" : undefined,
    });

    // 10. Naloxone
    const nalox = DRUGS.find((d) => d.id === "naloxone");
    if (nalox) {
      const calc = calculateDose(nalox.doses[0], w);
      results.push({
        label: "Naloxone",
        dose: calc.dose,
        doseSub: "(0.01 mg/kg)",
        route: "IV/IM/IN",
        notes: "Repeat q2–3 min. Max 2 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 11. Flumazenil
    const flum = DRUGS.find((d) => d.id === "flumazenil");
    if (flum) {
      const calc = calculateDose(flum.doses[0], w);
      results.push({
        label: "Flumazenil (BZD reversal)",
        dose: calc.dose,
        doseSub: "(0.01 mg/kg)",
        route: "IV",
        notes: "Max 1 mg total. Re-sedation common.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 12. Magnesium Sulfate
    const mgSo4 = DRUGS.find((d) => d.id === "magnesium-sulfate-emergency");
    if (mgSo4) {
      const calc = calculateDose(mgSo4.doses[0], w);
      results.push({
        label: "Magnesium Sulfate",
        dose: calc.dose,
        doseSub: "(25–50 mg/kg)",
        route: "IV over 10–20 min",
        notes: "Torsades / severe asthma. Max 2000 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 13. Lorazepam
    const loraz = DRUGS.find((d) => d.id === "lorazepam");
    if (loraz) {
      const calc = calculateDose(loraz.doses[0], w);
      results.push({
        label: "Lorazepam (Seizures)",
        dose: calc.dose,
        doseSub: "(0.05–0.1 mg/kg)",
        route: "IV/IO",
        notes: "Status epilepticus 1st line. Max 4 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 14. Midazolam IN
    const midaz = DRUGS.find((d) => d.id === "midazolam");
    if (midaz) {
      const inDose = +(0.3 * w).toFixed(2);
      const cappedDose = Math.min(inDose, 10);
      const exceeded = inDose > 10;
      results.push({
        label: "Midazolam IN (Seizures)",
        dose: `${cappedDose} mg`,
        doseSub: "(0.3 mg/kg IN)",
        route: "Intranasal",
        notes: "Divide between nostrils. Max 10 mg.",
        color: "#6366F1",
        exceedsAdultMax: exceeded,
        adultMaxLabel: exceeded ? "Adult max: 10 mg — dose capped" : undefined,
      });
    }

    // 15. Fentanyl IN
    const fent = DRUGS.find((d) => d.id === "fentanyl");
    if (fent) {
      const calc = calculateDose(fent.doses[2], w);
      results.push({
        label: "Fentanyl IN (Pain)",
        dose: calc.dose,
        doseSub: "(1–2 mcg/kg)",
        route: "Intranasal",
        notes: "Max 0.5 mL per nostril. Max 200 mcg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    return results;
  }, [localWeight]);

  // ── CPR / Code Blue Timer State ──────────────────────────────────────────
  const [epiInterval, setEpiInterval] = useState(300);
  const cpr = useCPRTimers(epiInterval);

  const switchBlinkAnim = useRef(new Animated.Value(1)).current;
  const epiBlinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cpr.switchAlert) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(switchBlinkAnim, { toValue: 0.15, duration: 250, useNativeDriver: false }),
          Animated.timing(switchBlinkAnim, { toValue: 1, duration: 250, useNativeDriver: false }),
        ])
      );
      loop.start();
      return () => { loop.stop(); switchBlinkAnim.setValue(1); };
    }
  }, [cpr.switchAlert]);

  useEffect(() => {
    if (cpr.epiDue) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(epiBlinkAnim, { toValue: 0.3, duration: 400, useNativeDriver: false }),
          Animated.timing(epiBlinkAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
        ])
      );
      loop.start();
      return () => { loop.stop(); epiBlinkAnim.setValue(1); };
    }
  }, [cpr.epiDue]);

  const cprColor = cpr.cprSecs <= 15 ? "#DC2626" : cpr.cprSecs <= 30 ? "#EA580C" : "#0891B2";

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0B132B" : "#F0F4F8" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: "#6366F1",
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={openDrawer}
              style={styles.hamburgerBtn}
              activeOpacity={0.7}
            >
              <Feather name="menu" size={20} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
            <Feather name="alert-circle" size={22} color="#FFFFFF" />
            <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>
              MKashanEdu
            </Text>
          </View>
          <TouchableOpacity onPress={toggleDark} style={styles.nightToggle} activeOpacity={0.7}>
            <Feather
              name={isDark ? "sun" : "moon"}
              size={16}
              color={isDark ? "#FFD700" : "rgba(255,255,255,0.85)"}
            />
            <Text style={[styles.nightToggleText, { fontFamily: "Inter_500Medium" }]}>
              {isDark ? "Day" : "Night"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerSubtitle, { fontFamily: "Inter_400Regular" }]}>
          Age: {ageYears} yrs · Weight: {localWeight} kg · HR: {targetVitals.minHR}–{targetVitals.maxHR} · SBP ≥ {targetVitals.minSBP}
        </Text>
        <View style={styles.warningBanner}>
          <Feather name="alert-triangle" size={14} color="#FFFFFF" />
          <Text style={[styles.warningText, { fontFamily: "Inter_500Medium" }]}>
            Always verify doses. For emergency use only.
          </Text>
        </View>
      </View>

      {/* ── PINNED: Dual Inputs + Compact Status Bar + Validation ── */}
      <View
        style={[
          styles.pinnedSection,
          {
            backgroundColor: isDark ? "#112240" : "#FFFFFF",
            borderBottomColor: isDark ? "#233554" : "#E2E8F0",
          },
        ]}
      >
        {/* Dual Inputs */}
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <Text style={[styles.inputLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>
              Age (yrs)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? "#FFFFFF" : "#0D1B2A",
                  backgroundColor: isDark ? "#233554" : "#F0F4F8",
                  borderColor: isDark ? "#3D4770" : "#E2E8F0",
                },
              ]}
              value={ageYearsInput}
              onChangeText={setAgeYearsInput}
              keyboardType="decimal-pad"
              selectTextOnFocus
              maxLength={4}
              placeholder="0"
              placeholderTextColor={isDark ? "#8892B0" : "#8A9BB0"}
            />
          </View>
          <View style={styles.inputWrap}>
            <Text style={[styles.inputLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>
              Weight (kg)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? "#FFFFFF" : "#0D1B2A",
                  backgroundColor: isDark ? "#233554" : "#F0F4F8",
                  borderColor: isDark ? "#3D4770" : "#E2E8F0",
                },
              ]}
              value={localWeightInput}
              onChangeText={handleWeightChange}
              keyboardType="decimal-pad"
              selectTextOnFocus
              maxLength={5}
              placeholder="10"
              placeholderTextColor={isDark ? "#8892B0" : "#8A9BB0"}
            />
          </View>
        </View>

        {/* Compact Status Bar */}
        <View
          style={[
            styles.statusBar,
            {
              backgroundColor: isDark ? "#0B132B" : "#F0F4F8",
              borderColor: isDark ? "#233554" : "#E2E8F0",
            },
          ]}
        >
          {/* CPR Timer */}
          <Animated.View
            style={[
              styles.statusTimer,
              {
                backgroundColor: cpr.switchAlert ? "#DC262622" : cprColor + "1A",
                borderColor: cpr.switchAlert ? "#DC2626" : cprColor,
                opacity: cpr.switchAlert ? switchBlinkAnim : 1,
              },
            ]}
          >
            {cpr.switchAlert ? (
              <Text style={styles.statusAlert}>🔄 SWITCH</Text>
            ) : (
              <>
                <Text style={[styles.statusTimerLabel, { color: cprColor + "BB" }]}>CPR</Text>
                <Text style={[styles.statusTimerValue, { color: cprColor }]}>
                  {fmtTime(cpr.cprSecs)}
                </Text>
              </>
            )}
          </Animated.View>

          {/* Epi Timer */}
          <Animated.View
            style={[
              styles.statusTimer,
              {
                backgroundColor: cpr.epiDue ? "#DC262622" : "#7C3AED12",
                borderColor: cpr.epiDue ? "#DC2626" : "#7C3AED",
                opacity: cpr.epiDue ? epiBlinkAnim : 1,
              },
            ]}
          >
            {cpr.epiDue ? (
              <TouchableOpacity onPress={cpr.acknowledgeEpi} style={{ alignItems: "center" }}>
                <Text style={styles.statusAlertEpi}>💉 EPI</Text>
                <Text style={{ fontSize: 10, color: "#DC2626", fontWeight: "700" }}>
                  TAP = GIVEN
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={[styles.statusTimerLabel, { color: "#7C3AED" }]}>EPI</Text>
                <Text style={[styles.statusTimerValue, { color: "#7C3AED" }]}>
                  {fmtTime(cpr.epiSecs)}
                </Text>
              </>
            )}
          </Animated.View>

          {/* Start/Stop */}
          <TouchableOpacity
            onPress={cpr.running ? cpr.stop : cpr.start}
            style={[styles.statusBtn, { backgroundColor: cpr.running ? "#DC2626" : "#16A34A" }]}
            activeOpacity={0.8}
          >
            <Text style={styles.statusBtnText}>
              {cpr.running ? "■ STOP" : "▶ START"}
            </Text>
          </TouchableOpacity>

          {/* Epi interval chips (only when stopped) */}
          {!cpr.running && (
            <View style={styles.statusChips}>
              {[180, 240, 300].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setEpiInterval(s)}
                  style={[styles.statusChip, epiInterval === s && styles.statusChipActive]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      epiInterval === s && styles.statusChipTextActive,
                    ]}
                  >
                    q{s / 60}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Cross-validation warning */}
        {mismatchWarning && (
          <View
            style={[
              styles.mismatchBanner,
              {
                backgroundColor: isDark ? "#7C2D1222" : "#FEF2F2",
                borderColor: isDark ? "#7C2D12" : "#FCA5A5",
              },
            ]}
          >
            <Feather name="alert-triangle" size={14} color="#DC2626" />
            <Text
              style={[
                styles.mismatchText,
                { color: isDark ? "#FCA5A5" : "#991B1B" },
              ]}
            >
              {mismatchWarning}
            </Text>
          </View>
        )}
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 84 : 90),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Calculators — ET Tube, Blade, LMA, Defibrillator */}
        <View
          style={[
            styles.palsBanner,
            {
              backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
              borderColor: isDark ? "#233554" : "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.palsTitle,
              { color: colors.tint, fontFamily: "Inter_700Bold" },
            ]}
          >
            Emergency Calculators
          </Text>
          <Text
            style={[
              styles.calcSource,
              { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_400Regular" },
            ]}
          >
            PALS 2025 · Harriet Lane 23e
          </Text>

          {/* ET Tube + Airway Equipment */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <View style={styles.ettGrid}>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#112240" : "#EBF8FF", borderColor: isDark ? "#1A4F7A" : "#EBF8FF" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#5A8FC0" : "#1A4F7A", fontFamily: "Inter_500Medium" }]}>Uncuffed</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#93C5FD" : "#1A4F7A", fontFamily: "Inter_700Bold" }]}>{ettube.uncuffed}</Text>
              </View>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#112240" : "#F0FFF4", borderColor: isDark ? "#146B35" : "#F0FFF4" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#6FCF97" : "#146B35", fontFamily: "Inter_500Medium" }]}>Cuffed</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#86EFAC" : "#146B35", fontFamily: "Inter_700Bold" }]}>{ettube.cuffed}</Text>
              </View>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#112240" : "#FEE2E2", borderColor: isDark ? "#DC2626" : "#FEE2E2" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#FCA5A5" : "#991B1B", fontFamily: "Inter_500Medium" }]}>Depth</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#FECACA" : "#DC2626", fontFamily: "Inter_700Bold" }]}>{ettube.depth}</Text>
              </View>
            </View>
            <View style={styles.airwayRow}>
              <View style={[styles.airwayBadge, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
                <Text style={[styles.airwayBadgeLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>Suction</Text>
                <Text style={[styles.airwayBadgeValue, { color: isDark ? "#FFD700" : "#B45309" }]}>{suctionFr} Fr</Text>
              </View>
              <View style={[styles.airwayBadge, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
                <Text style={[styles.airwayBadgeLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>Blade</Text>
                <Text style={[styles.airwayBadgeValue, { color: isDark ? "#FFD700" : "#B45309" }]}>{blade}</Text>
              </View>
              <View style={[styles.airwayBadge, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
                <Text style={[styles.airwayBadgeLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>LMA</Text>
                <Text style={[styles.airwayBadgeValue, { color: isDark ? "#FFD700" : "#B45309" }]}>Size {lma}</Text>
              </View>
            </View>
            <View style={[styles.dopeStrip, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
              <Text style={[styles.dopeLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>DOPE Check</Text>
              <Text style={[styles.dopeText, { color: isDark ? "#8892B0" : "#64748B" }]}>Displacement · Obstruction · Pneumothorax · Equipment failure</Text>
            </View>
          </View>

          {/* Defibrillator */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <Text style={[styles.calcSectionTitle, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_600SemiBold", marginBottom: 10 }]}>
              Defibrillator Energy — {localWeight} kg
            </Text>
            <View style={{ gap: 8 }}>
              <View style={[styles.shockBox, { backgroundColor: isDark ? "#112240" : "#FEE2E2", borderColor: isDark ? "#DC2626" : "#FCA5A5" }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#DC2626" }} />
                  <Text style={[styles.shockType, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>Unsynchronized — VF / pVT</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline" }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FECACA" : "#DC2626" }]}>{defib.unsync1st} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>1st = 2 J/kg (max 200)</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline", marginTop: 4 }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FECACA" : "#DC2626" }]}>{defib.unsyncSub} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>Subsequent = 4 J/kg (max 360)</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline", marginTop: 4 }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FECACA" : "#DC2626" }]}>{defib.unsyncMax} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>Max = 10 J/kg (max 360)</Text>
                </View>
              </View>
              <View style={[styles.shockBox, { backgroundColor: isDark ? "#112240" : "#FEF3C7", borderColor: isDark ? "#D97706" : "#FCD34D" }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#D97706" }} />
                  <Text style={[styles.shockType, { color: isDark ? "#FCD34D" : "#92400E" }]}>Synchronized — SVT / VT with pulse</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline" }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FDE68A" : "#B45309" }]}>{defib.sync1st} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCD34D" : "#92400E" }]}>1st = 0.5 J/kg (max 50)</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline", marginTop: 4 }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FDE68A" : "#B45309" }]}>{defib.syncSub} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCD34D" : "#92400E" }]}>Subsequent = 2 J/kg (max 100)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Critical Code Blue Drug Cards — compact, reordered */}
        {emergencyCards.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.emergencyCard,
              {
                backgroundColor: isDark ? "#112240" : "#FFFFFF",
                borderLeftColor: item.color,
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? "#233554" : "transparent",
                borderLeftWidth: 3,
              },
            ]}
          >
            <View style={styles.cardTopCompact}>
              <Text
                style={[
                  styles.cardLabelCompact,
                  { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {item.label}
              </Text>
              <View style={[styles.routeTagCompact, { backgroundColor: item.color + "22" }]}>
                <Text
                  style={[
                    styles.routeTagTextCompact,
                    { color: item.color, fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  {item.route}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <Text
                style={[
                  styles.cardDoseCompact,
                  { color: item.color, fontFamily: "Inter_800ExtraBold" },
                ]}
              >
                {item.dose}
              </Text>
              {item.doseSub && (
                <Text
                  style={[
                    styles.cardDoseUnitCompact,
                    { color: item.color, fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  {item.doseSub}
                </Text>
              )}
            </View>
            {item.exceedsAdultMax && (
              <View style={styles.adultMaxAlert}>
                <Feather name="alert-octagon" size={12} color="#fff" />
                <Text style={[styles.adultMaxAlertText, { fontFamily: "Inter_700Bold" }]}>
                  {item.adultMaxLabel}
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.cardNotesCompact,
                { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" },
              ]}
            >
              {item.notes}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <StarButton
                isFav={isFav(`emergency-${idx}`)}
                onToggle={() =>
                  toggleFav({
                    id: `emergency-${idx}`,
                    type: "drug",
                    label: item.label,
                    color: item.color,
                    route: item.route,
                  })
                }
                size={16}
                color={item.color}
              />
            </View>
          </View>
        ))}

        {/* Hs & Ts Checklist */}
        <View
          style={[
            styles.palsBanner,
            {
              backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
              borderColor: isDark ? "#233554" : "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.palsTitle,
              { color: colors.tint, fontFamily: "Inter_700Bold" },
            ]}
          >
            Hs & Ts — Reversible Causes
          </Text>
          <View style={styles.htGrid}>
            <View
              style={[
                styles.htCol,
                {
                  backgroundColor: isDark ? "#112240" : "#F0FFF4",
                  borderColor: isDark ? "#146B35" : "#D1FAE5",
                },
              ]}
            >
              <Text style={[styles.htColTitle, { color: isDark ? "#86EFAC" : "#146B35" }]}>H's</Text>
              {HsItems.map((h, i) => (
                <TouchableOpacity key={i} onPress={() => toggleH(i)} style={styles.htRow} activeOpacity={0.7}>
                  <View
                    style={[
                      styles.htCheckbox,
                      {
                        backgroundColor: hsChecked[i] ? (isDark ? "#146B35" : "#16A34A") : "transparent",
                        borderColor: isDark ? "#6FCF97" : "#16A34A",
                      },
                    ]}
                  >
                    {hsChecked[i] && <Feather name="check" size={10} color="#FFFFFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.htLabel, { color: isDark ? "#FFFFFF" : "#0D1B2A" }]}>{h.label}</Text>
                    <Text style={[styles.htAction, { color: isDark ? "#8892B0" : "#64748B" }]}>{h.action}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={[
                styles.htCol,
                {
                  backgroundColor: isDark ? "#112240" : "#FEF2F2",
                  borderColor: isDark ? "#7F1D1D" : "#FECACA",
                },
              ]}
            >
              <Text style={[styles.htColTitle, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>T's</Text>
              {TsItems.map((t, i) => (
                <TouchableOpacity key={i} onPress={() => toggleT(i)} style={styles.htRow} activeOpacity={0.7}>
                  <View
                    style={[
                      styles.htCheckbox,
                      {
                        backgroundColor: tsChecked[i] ? (isDark ? "#7F1D1D" : "#DC2626") : "transparent",
                        borderColor: isDark ? "#FCA5A5" : "#DC2626",
                      },
                    ]}
                  >
                    {tsChecked[i] && <Feather name="check" size={10} color="#FFFFFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.htLabel, { color: isDark ? "#FFFFFF" : "#0D1B2A" }]}>{t.label}</Text>
                    <Text style={[styles.htAction, { color: isDark ? "#8892B0" : "#64748B" }]}>{t.action}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <ProfessionalFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hamburgerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 4, backgroundColor: "rgba(255,255,255,0.15)" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  nightToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  nightToggleText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 10,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warningText: { fontSize: 12, color: "#FFFFFF" },

  // Pinned section
  pinnedSection: {
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  inputRow: { flexDirection: "row", gap: 10 },
  inputWrap: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: "700", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  // Compact Status Bar
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    gap: 6,
  },
  statusTimer: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  statusTimerLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  statusTimerValue: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  statusAlert: { fontSize: 16, fontWeight: "900", color: "#DC2626", textAlign: "center" },
  statusAlertEpi: { fontSize: 16, fontWeight: "900", color: "#DC2626", textAlign: "center" },
  statusBtn: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBtnText: { color: "#FFF", fontSize: 13, fontWeight: "900", letterSpacing: 0.5 },
  statusChips: { flexDirection: "row", gap: 4, alignItems: "center" },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#7C3AED",
  },
  statusChipActive: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
  statusChipText: { fontSize: 11, fontWeight: "700", color: "#7C3AED" },
  statusChipTextActive: { color: "#FFF" },

  // Cross-validation warning
  mismatchBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  mismatchText: { fontSize: 12, fontWeight: "700", flex: 1 },

  // Scroll content
  scrollContent: { padding: 12, gap: 8 },

  // Drug cards — compact
  emergencyCard: {
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 4,
    marginBottom: 6,
  },
  cardTopCompact: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  cardLabelCompact: { fontSize: 12, flex: 1, lineHeight: 16 },
  routeTagCompact: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" },
  routeTagTextCompact: { fontSize: 9, letterSpacing: 0.3 },
  cardDoseCompact: { fontSize: 24, letterSpacing: -0.5 },
  cardDoseUnitCompact: { fontSize: 14 },
  cardNotesCompact: { fontSize: 11, lineHeight: 14 },
  adultMaxAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#B91C1C",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  adultMaxAlertText: {
    fontSize: 10,
    color: "#FFFFFF",
    flex: 1,
    letterSpacing: 0.1,
  },

  // Equipment calculators
  palsBanner: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 6,
  },
  palsTitle: { fontSize: 15, marginBottom: 10 },
  calcSource: { fontSize: 11, marginBottom: 10, marginTop: -6, letterSpacing: 0.3 },
  calcSection: {
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  calcSectionTitle: { fontSize: 12, letterSpacing: 0.3 },
  ettGrid: { flexDirection: "row", gap: 8 },
  ettBox: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  ettLabel: { fontSize: 10 },
  ettValue: { fontSize: 15, textAlign: "center" },
  airwayRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  airwayBadge: {
    flex: 1, borderRadius: 8, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 4, alignItems: "center",
  },
  airwayBadgeLabel: { fontSize: 10, fontWeight: "600", marginBottom: 2 },
  airwayBadgeValue: { fontSize: 13, fontWeight: "700" },
  dopeStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
    flexWrap: "wrap",
  },
  dopeLabel: { fontSize: 10, fontWeight: "700" },
  dopeText: { fontSize: 10, fontWeight: "500" },
  shockBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 2,
  },
  shockType: { fontSize: 12, fontWeight: "700" },
  shockJoules: { fontSize: 18, fontWeight: "700" },
  shockFormula: { fontSize: 10, fontWeight: "500" },

  // Hs & Ts
  htGrid: { flexDirection: "row", gap: 8 },
  htCol: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 6,
  },
  htColTitle: { fontSize: 12, fontWeight: "700" },
  htRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingVertical: 2,
  },
  htCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  htLabel: { fontSize: 11, fontWeight: "600", lineHeight: 15 },
  htAction: { fontSize: 9, fontWeight: "500", lineHeight: 13, marginTop: 1 },
});
