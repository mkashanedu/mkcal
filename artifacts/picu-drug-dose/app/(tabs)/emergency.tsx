import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { DRUGS, calculateDose } from "@/constants/drugs";
import { useTheme } from "@/context/ThemeContext";
import { usePreferences } from "@/context/PreferencesContext";
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
    setSwitchAlert(false);
    setEpiDue(false);
  }, []);

  const acknowledgeEpi = useCallback(() => setEpiDue(false), []);

  const markEpiGiven = useCallback(() => {
    setEpiSecs(epiIntervalRef.current);
    setEpiDue(false);
    setEpiCount((c) => c + 1);
  }, []);

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

  return { running, cprSecs, cprCycle, switchAlert, epiSecs, epiDue, epiCount, start, stop, acknowledgeEpi, markEpiGiven };
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

// ── ET Tube, Airway, Defibrillation (Harriet Lane 24e · PALS 2025 · NALS) ───────────
function calcETTube(ageYears: number) {
  // PALS standard: Cuffed = Age/4 + 3.5, Uncuffed = Age/4 + 4
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

// Hard-coded PALS defibrillation: 1st = 2 J/kg, subsequent = 4 J/kg, max = 10 J/kg
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

// LMA size by WEIGHT (manufacturer / PALS standard sizing)
function calcLMA(weightKg: number) {
  if (weightKg < 5)   return "1";
  if (weightKg < 10)  return "1.5";
  if (weightKg < 20)  return "2";
  if (weightKg < 30)  return "2.5";
  if (weightKg < 50)  return "3";
  if (weightKg < 70)  return "4";
  return "5";
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
    return `Weight ${weightKg} kg low for age ${ageYears.toFixed(1)} yrs (expected ~${Math.round(expected)} kg)`;
  if (weightKg > expected * 2.2)
    return `Weight ${weightKg} kg high for age ${ageYears.toFixed(1)} yrs (expected ~${Math.round(expected)} kg)`;
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
  { label: "Hypoglycemia", action: "Check glucose — D10 2 mL/kg IV" },
  { label: "Hypo- / Hyperkalemia", action: "CaGluconate for HyperK, Insulin+Dextrose" },
  { label: "Hypothermia", action: "Active warming" },
];

const TsItems: HsTsItem[] = [
  { label: "Tension pneumothorax", action: "Needle decompression" },
  { label: "Tamponade (cardiac)", action: "Pericardiocentesis" },
  { label: "Toxins", action: "Identify antidote" },
  { label: "Thrombosis (pulmonary)", action: "Thrombolytics / Consult" },
  { label: "Thrombosis (coronary)", action: "Thrombolytics / Consult" },
];

const PostCodeItems = [
  { label: "Glucose Check", action: "Check & treat hypoglycemia immediately" },
  { label: "Temperature", action: "Target 36–37°C · Avoid hyperthermia" },
  { label: "Neuro Check", action: "Pupils, GCS, seizures? Consider EEG" },
  { label: "Family Update", action: "Clear communication · Offer support" },
  { label: "Team Debrief", action: "Review events, identify learning points" },
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
  const { width: screenWidth } = useWindowDimensions();
  const isNarrow = screenWidth < 600;
  const { isDark, toggleDark } = useTheme();
  const { textScale } = usePreferences();
  const colors = Colors.light;
  const {
    weight: ctxWeight,
    setWeight: setCtxWeight,
    weightInput: ctxWeightInput,
    setWeightInput: setCtxWeightInput,
    weightUnit: ctxWeightUnit,
    setWeightUnit: setCtxWeightUnit,
    age: ctxAge,
    setAge: setCtxAge,
    ageInput: ctxAgeInput,
    setAgeInput: setCtxAgeInput,
    ageConfirmed: ctxAgeConfirmed,
    ageUnit: ctxAgeUnit,
    setAgeUnit: setCtxAgeUnit,
  } = useWeight();
  const { isFav, toggleFav } = useFavorites();
  const { openDrawer } = useDrawer();
  const topPadding = insets.top;

  // ── Precision Inputs with Unit Toggles ───────────────────────────────────────────
  // Weight
  const [weightInput, setWeightInput] = useState(ctxWeightInput);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(ctxWeightUnit);
  const parsedWeight = Number(weightInput);
  const weightInputIsValid =
    weightInput.trim() !== "" && Number.isFinite(parsedWeight) && parsedWeight > 0;
  const weightNum = weightInputIsValid ? parsedWeight : 0;
  const weightKg = weightUnit === "kg" ? weightNum : weightNum * 0.453592;
  const weightValid = Number.isFinite(weightKg) && weightKg > 0;
  const displayWeightKg = weightValid
    ? weightUnit === "kg" ? weightNum : +(weightNum * 0.453592).toFixed(2)
    : 0;
  const weightRangeWarning = weightValid && (weightKg < 0.5 || weightKg > 150);

  const handleWeightChange = useCallback(
    (text: string) => {
      setWeightInput(text);
      const num = Number(text);
      const valid = text.trim() !== "" && Number.isFinite(num) && num > 0;
      const kg = weightUnit === "kg" ? num : num * 0.453592;
      if (valid && Number.isFinite(kg) && kg > 0) {
        setCtxWeight(kg);
      } else {
        // A bad entry must invalidate the shared weight instead of leaving an older
        // patient's value active on another screen.
        setCtxWeight(0);
      }
      setCtxWeightInput(text);
    },
    [weightUnit, setCtxWeight, setCtxWeightInput]
  );

  const toggleWeightUnit = useCallback(() => {
    const next = weightUnit === "kg" ? "lbs" : "kg";
    setWeightUnit(next);
    setCtxWeightUnit(next);
    const currentNum = Number(weightInput);
    if (weightInput.trim() !== "" && Number.isFinite(currentNum) && currentNum > 0) {
      const converted = next === "kg"
        ? +(currentNum * 0.453592).toFixed(1)
        : +(currentNum / 0.453592).toFixed(1);
      setWeightInput(converted.toString());
      setCtxWeightInput(converted.toString());
      const kg = next === "kg" ? converted : converted * 0.453592;
      setCtxWeight(kg);
    } else {
      setCtxWeight(0);
    }
  }, [weightUnit, weightInput, setCtxWeight, setCtxWeightUnit, setCtxWeightInput]);

  // Age
  const ageInput = ctxAgeConfirmed ? ctxAgeInput : "";
  const ageUnit = ctxAgeUnit;
  const parsedAge = Number(ageInput);
  const ageInputIsValid =
    ctxAgeConfirmed && ageInput.trim() !== "" && Number.isFinite(parsedAge) && parsedAge >= 0;
  const ageNum = ageInputIsValid ? parsedAge : 0;
  const ageYears = ageUnit === "years" ? ageNum : ageNum / 12;
  const ageMonths = ageInputIsValid
    ? ageUnit === "years" ? ageNum * 12 : ageNum
    : undefined;
  const [selectedFluid, setSelectedFluid] = useState<string | undefined>(undefined);

  const handleAgeChange = useCallback(
    (text: string) => {
      setCtxAgeInput(text);
      const num = Number(text);
      if (text.trim() !== "" && Number.isFinite(num) && num >= 0) {
        const yrs = ageUnit === "years" ? num : num / 12;
        setCtxAge(yrs);
      }
    },
    [ageUnit, setCtxAge, setCtxAgeInput]
  );

  const toggleAgeUnit = useCallback(() => {
    const next = ageUnit === "years" ? "months" : "years";
    setCtxAgeUnit(next);
    const currentNum = Number(ageInput);
    if (ageInput.trim() !== "" && Number.isFinite(currentNum) && currentNum >= 0) {
      const converted = next === "years"
        ? +(currentNum / 12).toFixed(1)
        : +(currentNum * 12).toFixed(0);
      setCtxAgeInput(converted.toString());
      const yrs = next === "years" ? converted : converted / 12;
      setCtxAge(yrs);
    }
  }, [ageUnit, ageInput, setCtxAge, setCtxAgeUnit, setCtxAgeInput]);

  // Inputs valid?
  const inputsValid = weightValid && ageYears > 0;

  // ── Equipment Calculations ─────────────────────────────────────────────
  const ettube = calcETTube(ageYears);
  const defib = calcDefib(weightKg);
  const suctionFr = calcSuctionCatheter(ettube.cuffedNum);
  const blade = calcBlade(ageYears);
  const lma = calcLMA(weightKg);
  const targetVitals = calcTargetVitals(ageYears);
  const mismatchWarning = useMemo(() => checkWeightAge(weightKg, ageYears), [weightKg, ageYears]);

  // Hs & Ts
  const [hsChecked, setHsChecked] = useState<boolean[]>(HsItems.map(() => false));
  const [tsChecked, setTsChecked] = useState<boolean[]>(TsItems.map(() => false));
  const toggleH = (i: number) => setHsChecked((prev) => { const c = [...prev]; c[i] = !c[i]; return c; });
  const toggleT = (i: number) => setTsChecked((prev) => { const c = [...prev]; c[i] = !c[i]; return c; });

  // Post-Code Checklist
  const [postCodeOpen, setPostCodeOpen] = useState(false);
  const [postCodeChecked, setPostCodeChecked] = useState<boolean[]>(PostCodeItems.map(() => false));
  const togglePostCode = (i: number) => setPostCodeChecked((prev) => { const c = [...prev]; c[i] = !c[i]; return c; });

  // ── Critical Code Blue Drugs ───────────────────────────────────────────
  const emergencyCards = useMemo((): EmergencyItem[] => {
    if (!weightValid) return [];
    const results: EmergencyItem[] = [];
    const w = weightKg;

    // 1. Epinephrine — Cardiac Arrest (0.01 mg/kg = 10 mcg/kg, max 1 mg)
    const epiDrug = DRUGS.find((d) => d.id === "epinephrine");
    if (epiDrug) {
      const calc = calculateDose(epiDrug.doses[0], w);
      const mgDose = +(10 * w / 1000).toFixed(3);
      const cappedMg = epiDrug.doses[0].adultMaxDose_num ? Math.min(mgDose, epiDrug.doses[0].adultMaxDose_num / 1000) : mgDose;
      results.push({
        label: "Epinephrine (Cardiac Arrest)",
        dose: `${cappedMg} mg`,
        doseSub: "(0.01 mg/kg = 10 mcg/kg)",
        route: "IV / IO",
        notes: `0.1 mL/kg of 1:10,000 (0.1 mg/mL). Repeat q3–5 min. Non-shockable: give ASAP. Shockable: after the 2nd shock. Adult max 1 mg.`,
        color: "#DC2626",
        warning: true,
        exceedsAdultMax: mgDose > 1,
        adultMaxLabel: mgDose > 1 ? "Adult max: 1 mg — dose capped" : undefined,
      });
    }

    // 2. Amiodarone — VT/VF (5 mg/kg, max 300 mg)
    const amio = DRUGS.find((d) => d.id === "amiodarone");
    if (amio) {
      const calc = calculateDose(amio.doses[0], w);
      results.push({
        label: "Amiodarone (VT/VF)",
        dose: calc.dose,
        doseSub: "(5 mg/kg)",
        route: "IV/IO bolus",
        notes: "Rapid bolus during CPR. Max 300 mg per dose. May repeat up to 3 total doses (later doses max 150 mg each).",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 3. Atropine — Bradycardia (0.02 mg/kg, max 1 mg child / 3 mg adolescent)
    const atropine = DRUGS.find((d) => d.id === "atropine");
    if (atropine) {
      const calc = calculateDose(atropine.doses[0], w);
      results.push({
        label: "Atropine (Bradycardia)",
        dose: calc.dose,
        doseSub: "(0.02 mg/kg)",
        route: "IV / IO",
        notes: "Min 0.1 mg · Max single dose 0.5 mg (may repeat once). Epinephrine is FIRST for bradycardia — atropine only if increased vagal tone or primary AV block.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 4. Adenosine — SVT (0.1 mg/kg 1st, max 6 mg / 12 mg)
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

    // 5. Sodium Bicarbonate (1 mEq/kg, max 50 mEq)
    const bicarb = DRUGS.find((d) => d.id === "sodium-bicarbonate");
    if (bicarb) {
      const calc = calculateDose(bicarb.doses[0], w);
      results.push({
        label: "Sodium Bicarbonate",
        dose: calc.dose,
        doseSub: "(1 mEq/kg)",
        route: "IV slow push",
        notes: "NOT routine in arrest. Only for: severe metabolic acidosis with good ventilation, sodium-channel blocker toxicity, hyperkalemia. Over 5–10 min, after airway secured. Max 50 mEq.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 6. Calcium Gluconate (100–200 mg/kg, max 2 g)
    const caGlu = DRUGS.find((d) => d.id === "calcium-gluconate");
    if (caGlu) {
      const calc = calculateDose(caGlu.doses[0], w);
      results.push({
        label: "Calcium Gluconate",
        dose: calc.dose,
        doseSub: "(100–200 mg/kg)",
        route: "IV over 5–10 min",
        notes: "NOT routine in arrest. Only for: hyperkalemia, hypocalcemia, calcium-channel blocker overdose, hypermagnesemia. 10% solution, cardiac monitor. Max 2000 mg.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    // 7. Lidocaine (1 mg/kg, max 100 mg)
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

    // 8. Dextrose D10 (2 mL/kg, max 25 mL neonate)
    const d10Raw = 2 * w;
    const d10Display = Math.min(Math.round(d10Raw), 25);
    results.push({
      label: "Dextrose D10",
      dose: `${d10Display} mL`,
      doseSub: "(2 mL/kg D10)",
      route: "IV",
      notes: "Neonate max 25 mL. Check glucose 15 min after.",
      color: "#0D9488",
      exceedsAdultMax: d10Raw > 25,
      adultMaxLabel: d10Raw > 25 ? "Max 25 mL D10 neonate — dose capped" : undefined,
    });

    // 9. Dextrose D25 (2 mL/kg, max 25 mL)
    const d25Raw = 2 * w;
    const d25Display = Math.min(Math.round(d25Raw), 25);
    results.push({
      label: "Dextrose D25",
      dose: `${d25Display} mL`,
      doseSub: "(2 mL/kg D25)",
      route: "IV",
      notes: "Infant/child. Max 25 mL D25.",
      color: "#0D9488",
      exceedsAdultMax: d25Raw > 25,
      adultMaxLabel: d25Raw > 25 ? "Max 25 mL D25 — dose capped" : undefined,
    });

    // 10. Naloxone (0.01 mg/kg, max 2 mg)
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

    // 11. Flumazenil (0.01 mg/kg, max 1 mg)
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

    // 12. Magnesium Sulfate (25–50 mg/kg, max 2 g)
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

    // 13. Lorazepam (0.05–0.1 mg/kg, max 4 mg)
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

    // 14. Midazolam IN (0.3 mg/kg, max 10 mg)
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

    // 15. Fentanyl IN (1–2 mcg/kg, max 100 mcg)
    const fent = DRUGS.find((d) => d.id === "fentanyl");
    if (fent) {
      const calc = calculateDose(fent.doses[2], w);
      results.push({
        label: "Fentanyl IN (Pain)",
        dose: calc.dose,
        doseSub: "(1–2 mcg/kg)",
        route: "Intranasal",
        notes: "Maximum single dose 100 mcg. Max 0.5 mL per nostril.",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    return results;
  }, [weightKg, weightValid]);

  // ── CPR Timer State ─────────────────────────────────────────────────
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

  const cprColor = cpr.cprSecs <= 15 ? "#DC2626" : cpr.cprSecs <= 30 ? "#EA580C" : "#0D9488";

  // ── Alert sounds (Point 7): epi-due and compressor-switch beeps ──
  const alertBeep = (freq: number, times: number) => {
    try {
      const AC = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
      if (!AC) return;
      if (!audioCtx.current) audioCtx.current = new AC();
      const ctx = audioCtx.current;
      if (ctx.state === "suspended") ctx.resume();
      for (let i = 0; i < times; i++) {
        const t0 = ctx.currentTime + i * 0.28;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = freq;
        g.gain.value = 0.09;
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t0);
        o.stop(t0 + 0.12);
      }
    } catch {}
  };
  useEffect(() => { if (cpr.epiDue) alertBeep(880, 3); }, [cpr.epiDue]);
  useEffect(() => { if (cpr.switchAlert) alertBeep(620, 2); }, [cpr.switchAlert]);

  // Show post-code when stopped AND at least one cycle completed
  const showPostCode = !cpr.running && cpr.cprCycle > 0;

  // ── 2025 PALS upgrade: pathways, code log, metronome ──
  const [pathway, setPathway] = useState<"vf" | "pea" | "brady" | "tachy" | "postop">("vf");
  const [codeLog, setCodeLog] = useState<{ kind: string; at: string; detail: string }[]>([]);
  const [metroOn, setMetroOn] = useState(false);
  const metroTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<any>(null);
  const codeElapsed = cpr.cprCycle * CPR_CYCLE_SECS + (CPR_CYCLE_SECS - cpr.cprSecs);
  const epiGivenCount = codeLog.filter((e) => e.kind === "EPI").length;
  const shockGivenCount = codeLog.filter((e) => e.kind === "SHOCK").length;
  const logEpi = () => {
    cpr.markEpiGiven();
    setCodeLog((l) => [...l, { kind: "EPI", at: fmtTime(codeElapsed), detail: `${+Math.min(0.01 * weightKg, 1).toFixed(3)} mg IV/IO` }]);
  };
  const logShock = () => {
    const n = shockGivenCount;
    const j = n === 0 ? defib.unsync1st : defib.unsyncSub;
    setCodeLog((l) => [...l, { kind: "SHOCK", at: fmtTime(codeElapsed), detail: `${j} J — shock ${n + 1}` }]);
  };
  const toggleMetronome = () => {
    if (metroOn) {
      if (metroTimer.current) clearInterval(metroTimer.current);
      metroTimer.current = null;
      setMetroOn(false);
      return;
    }
    try {
      const AC = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
      if (!AC) return;
      if (!audioCtx.current) audioCtx.current = new AC();
      const ctx = audioCtx.current;
      const beep = () => {
        try {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "square";
          o.frequency.value = 880;
          g.gain.value = 0.08;
          o.connect(g);
          g.connect(ctx.destination);
          o.start();
          o.stop(ctx.currentTime + 0.06);
        } catch {}
      };
      if (ctx.state === "suspended") ctx.resume();
      beep();
      metroTimer.current = setInterval(beep, 545);
      setMetroOn(true);
    } catch {}
  };
  useEffect(() => () => { if (metroTimer.current) clearInterval(metroTimer.current); }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#06231D" : "#F0F4F8" }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: "#6366F1" }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={openDrawer} style={styles.hamburgerBtn} activeOpacity={0.7}>
              <Feather name="menu" size={20} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
            <Feather name="alert-circle" size={22} color="#FFFFFF" />
            <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>PeadsCal</Text>
          </View>
          <TouchableOpacity onPress={toggleDark} style={styles.nightToggle} activeOpacity={0.7}>
            <Feather name={isDark ? "sun" : "moon"} size={16} color={isDark ? "#FFD700" : "rgba(255,255,255,0.85)"} />
            <Text style={[styles.nightToggleText, { fontFamily: "Inter_500Medium" }]}>{isDark ? "Day" : "Night"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerSubtitle, { fontFamily: "Inter_400Regular" }]}>
          Age: {ageYears.toFixed(ageUnit === "months" ? 1 : 0)} {ageUnit === "months" ? "mo" : "yrs"} · Weight: {weightValid ? `${displayWeightKg.toFixed(1)} kg` : "invalid"} · HR: {targetVitals.minHR}–{targetVitals.maxHR} · SBP ≥ {targetVitals.minSBP}
        </Text>
        <View style={styles.warningBanner}>
          <Feather name="alert-triangle" size={14} color="#FFFFFF" />
          <Text style={[styles.warningText, { fontFamily: "Inter_500Medium" }]}>
            For educational purposes only. Always verify doses clinically.
          </Text>
        </View>
      </View>

      {/* ── PINNED: Inputs + Status Bar ── */}
      <View style={[styles.pinnedSection, { backgroundColor: isDark ? "#0B352B" : "#FFFFFF", borderBottomColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
        {/* Inputs — vertical stack on mobile (<600 px), side-by-side on tablet/desktop */}
        <View style={[styles.inputRow, { flexDirection: isNarrow ? "column" : "row" }]}>

          {/* ── WEIGHT ── */}
          <View style={[styles.inputWrap, isNarrow && styles.inputWrapFull]}>
            <Text style={[styles.inputFieldLabel, { color: isDark ? "#83ACA1" : "#64748B" }]}>
              WEIGHT
            </Text>
            <View style={styles.inputWithToggle}>
              <TextInput
                style={[styles.inputBox, {
                  color: isDark ? "#FFFFFF" : "#0D1B2A",
                  backgroundColor: isDark ? "#1D5243" : "#F0F4F8",
                  borderColor: !weightValid ? "#DC2626" : isDark ? "#3D4770" : "#CBD5E1",
                }]}
                value={weightInput}
                onChangeText={handleWeightChange}
                keyboardType="decimal-pad"
                selectTextOnFocus
                maxLength={6}
                placeholder={weightUnit === "kg" ? "10" : "22"}
                placeholderTextColor={isDark ? "#83ACA1" : "#8A9BB0"}
              />
              {/* ── KG | LBS pill — horizontal, 44 px tall ── */}
              <View style={[styles.segPill, { backgroundColor: isDark ? "#06231D" : "#E2E8F0" }]}>
                <TouchableOpacity
                  onPress={() => { if (weightUnit !== "kg") toggleWeightUnit(); }}
                  style={[styles.segOption, weightUnit === "kg" && styles.segOptionActiveBlue]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.segOptionText, { color: weightUnit === "kg" ? "#FFFFFF" : (isDark ? "#94A3B8" : "#475569") }]}>
                    KG
                  </Text>
                </TouchableOpacity>
                <View style={[styles.segDivider, { backgroundColor: isDark ? "#1E3A5F" : "#CBD5E1" }]} />
                <TouchableOpacity
                  onPress={() => { if (weightUnit !== "lbs") toggleWeightUnit(); }}
                  style={[styles.segOption, weightUnit === "lbs" && styles.segOptionActiveBlue]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.segOptionText, { color: weightUnit === "lbs" ? "#FFFFFF" : (isDark ? "#94A3B8" : "#475569") }]}>
                    LBS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {!weightValid ? (
              <Text style={styles.weightInputError} accessibilityRole="alert">
                Enter a valid positive weight. Weight-based emergency calculations are disabled.
              </Text>
            ) : weightRangeWarning ? (
              <Text style={styles.weightInputWarning}>
                Weight is outside the usual 0.5–150 kg range. Verify it; calculations use the entered value.
              </Text>
            ) : null}
          </View>

          {/* ── AGE ── */}
          <View style={[styles.inputWrap, isNarrow && styles.inputWrapFull]}>
            <Text style={[styles.inputFieldLabel, { color: isDark ? "#83ACA1" : "#64748B", marginTop: isNarrow ? 10 : 0 }]}>
              AGE
            </Text>
            <View style={styles.inputWithToggle}>
              <TextInput
                style={[styles.inputBox, {
                  color: isDark ? "#FFFFFF" : "#0D1B2A",
                  backgroundColor: isDark ? "#1D5243" : "#F0F4F8",
                  borderColor: isDark ? "#3D4770" : "#CBD5E1",
                }]}
                value={ageInput}
                onChangeText={handleAgeChange}
                keyboardType="decimal-pad"
                selectTextOnFocus
                maxLength={5}
                placeholder={ageUnit === "years" ? "2" : "24"}
                placeholderTextColor={isDark ? "#83ACA1" : "#8A9BB0"}
              />
              {/* ── YRS | MONTHS pill — horizontal, 44 px tall ── */}
              <View style={[styles.segPill, { backgroundColor: isDark ? "#06231D" : "#E2E8F0" }]}>
                <TouchableOpacity
                  onPress={() => { if (ageUnit !== "years") toggleAgeUnit(); }}
                  style={[styles.segOption, ageUnit === "years" && styles.segOptionActiveIndigo]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.segOptionText, { color: ageUnit === "years" ? "#FFFFFF" : (isDark ? "#94A3B8" : "#475569") }]}>
                    YRS
                  </Text>
                </TouchableOpacity>
                <View style={[styles.segDivider, { backgroundColor: isDark ? "#1E3A5F" : "#CBD5E1" }]} />
                <TouchableOpacity
                  onPress={() => { if (ageUnit !== "months") toggleAgeUnit(); }}
                  style={[styles.segOption, ageUnit === "months" && styles.segOptionActiveIndigo]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.segOptionText, { color: ageUnit === "months" ? "#FFFFFF" : (isDark ? "#94A3B8" : "#475569") }]}>
                    MO
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>

        {/* Compact Status Bar */}
        <View style={[styles.statusBar, { backgroundColor: isDark ? "#06231D" : "#F0F4F8", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
          {/* CPR Timer */}
          <Animated.View
            style={[
              styles.statusTimer,
              { backgroundColor: cpr.switchAlert ? "#DC262622" : cprColor + "1A", borderColor: cpr.switchAlert ? "#DC2626" : cprColor, opacity: cpr.switchAlert ? switchBlinkAnim : 1 },
            ]}
          >
            {cpr.switchAlert ? (
              <Text style={styles.statusAlert}>🔄 SWITCH</Text>
            ) : (
              <>
                <Text style={[styles.statusTimerLabel, { color: cprColor + "BB" }]}>CPR</Text>
                <Text style={[styles.statusTimerValue, { color: cprColor, fontSize: Math.round(22 * textScale) }]}>{fmtTime(cpr.cprSecs)}</Text>
              </>
            )}
          </Animated.View>

          {/* Epi Timer */}
          <Animated.View
            style={[
              styles.statusTimer,
              { backgroundColor: cpr.epiDue ? "#DC262622" : "#7C3AED12", borderColor: cpr.epiDue ? "#DC2626" : "#7C3AED", opacity: cpr.epiDue ? epiBlinkAnim : 1 },
            ]}
          >
            {cpr.epiDue ? (
              <TouchableOpacity onPress={cpr.acknowledgeEpi} style={{ alignItems: "center" }}>
                <Text style={styles.statusAlertEpi}>💉 EPI</Text>
                <Text style={{ fontSize: 10, color: "#DC2626", fontWeight: "700" }}>TAP = GIVEN</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={[styles.statusTimerLabel, { color: "#7C3AED" }]}>EPI</Text>
                <Text style={[styles.statusTimerValue, { color: "#7C3AED", fontSize: Math.round(22 * textScale) }]}>{fmtTime(cpr.epiSecs)}</Text>
              </>
            )}
          </Animated.View>

          {/* Start/Stop — disabled if inputs invalid */}
          <TouchableOpacity
            onPress={cpr.running ? cpr.stop : cpr.start}
            disabled={!cpr.running && !inputsValid}
            style={[
              styles.statusBtn,
              { backgroundColor: cpr.running ? "#DC2626" : inputsValid ? "#16A34A" : "#9CA3AF" },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.statusBtnText}>
              {cpr.running ? "■ STOP" : inputsValid ? "▶ START" : "ENTER DATA"}
            </Text>
          </TouchableOpacity>

          {/* Epi interval chips */}
          {!cpr.running && (
            <View style={styles.statusChips}>
              {[180, 240, 300].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setEpiInterval(s)}
                  style={[styles.statusChip, epiInterval === s && styles.statusChipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.statusChipText, epiInterval === s && styles.statusChipTextActive]}>q{s / 60}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Cross-validation warning */}
        {mismatchWarning && (
          <View style={[styles.mismatchBanner, { backgroundColor: isDark ? "#7C2D1222" : "#FEF2F2", borderColor: isDark ? "#7C2D12" : "#FCA5A5" }]}>
            <Feather name="alert-triangle" size={14} color="#DC2626" />
            <Text style={[styles.mismatchText, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>{mismatchWarning}</Text>
          </View>
        )}

        {/* Post-Resuscitation Checklist — appears after code stopped */}
        {showPostCode && (
          <View style={[styles.postCodeCard, { backgroundColor: isDark ? "#041B16" : "#F0FFF4", borderColor: isDark ? "#146B35" : "#D1FAE5" }]}>
            <TouchableOpacity onPress={() => setPostCodeOpen((p) => !p)} style={styles.postCodeHeader} activeOpacity={0.7}>
              <Feather name="clipboard" size={14} color={isDark ? "#6FCF97" : "#146B35"} />
              <Text style={[styles.postCodeTitle, { color: isDark ? "#6FCF97" : "#146B35" }]}>
                Post-Resuscitation Checklist
              </Text>
              <Feather name={postCodeOpen ? "chevron-up" : "chevron-down"} size={14} color={isDark ? "#6FCF97" : "#146B35"} />
            </TouchableOpacity>
            {postCodeOpen && (
              <View style={{ gap: 6, marginTop: 6 }}>
                {PostCodeItems.map((item, i) => (
                  <TouchableOpacity key={i} onPress={() => togglePostCode(i)} style={styles.postCodeRow} activeOpacity={0.7}>
                    <View style={[styles.htCheckbox, { backgroundColor: postCodeChecked[i] ? (isDark ? "#146B35" : "#16A34A") : "transparent", borderColor: isDark ? "#6FCF97" : "#16A34A" }]}>
                      {postCodeChecked[i] && <Feather name="check" size={10} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.htLabel, { color: isDark ? "#FFFFFF" : "#0D1B2A" }]}>{item.label}</Text>
                      <Text style={[styles.htAction, { color: isDark ? "#83ACA1" : "#64748B" }]}>{item.action}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 84 : 90) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ARREST STRIP (P9): the four numbers a code needs first,
            all on one screen for the current weight — no scrolling. ── */}
        {weightValid && (
          <View style={[styles.arrestStrip, { backgroundColor: "#7F1D1D", borderColor: "#DC2626" }]}>
            <Text style={[styles.arrestTitle, { fontFamily: "Inter_700Bold" }]}>
              ARREST — ONE SCREEN · {weightKg} KG
            </Text>
            <View style={styles.arrestGrid}>
              <View style={styles.arrestCell}>
                <Text style={[styles.arrestLabel, { fontFamily: "Inter_600SemiBold" }]}>EPINEPHRINE IV/IO</Text>
                <Text style={[styles.arrestValue, { fontFamily: "Inter_700Bold", fontSize: Math.round(16.5 * textScale) }]}>
                  {(() => {
                    const epi = emergencyCards.find((c) => c.label.startsWith("Epinephrine"));
                    const mg = epi ? parseFloat(epi.dose) : NaN;
                    return Number.isFinite(mg)
                      ? `${mg} mg = ${+(mg * 10).toFixed(1)} mL`
                      : "—";
                  })()}
                </Text>
                <Text style={[styles.arrestSub, { fontFamily: "Inter_400Regular" }]}>of 1:10,000 · q3–5 min</Text>
              </View>
              <View style={styles.arrestCell}>
                <Text style={[styles.arrestLabel, { fontFamily: "Inter_600SemiBold" }]}>AMIODARONE VF/pVT</Text>
                <Text style={[styles.arrestValue, { fontFamily: "Inter_700Bold", fontSize: Math.round(16.5 * textScale) }]}>
                  {emergencyCards.find((c) => c.label.startsWith("Amiodarone"))?.dose ?? "—"}
                </Text>
                <Text style={[styles.arrestSub, { fontFamily: "Inter_400Regular" }]}>5 mg/kg · max 300 mg</Text>
              </View>
              <View style={styles.arrestCell}>
                <Text style={[styles.arrestLabel, { fontFamily: "Inter_600SemiBold" }]}>DEFIB (UNSYNC)</Text>
                <Text style={[styles.arrestValue, { fontFamily: "Inter_700Bold", fontSize: Math.round(16.5 * textScale) }]}>
                  {defib.unsync1st} J → {defib.unsyncSub} J
                </Text>
                <Text style={[styles.arrestSub, { fontFamily: "Inter_400Regular" }]}>max {defib.unsyncMax} J</Text>
              </View>
              <View style={styles.arrestCell}>
                <Text style={[styles.arrestLabel, { fontFamily: "Inter_600SemiBold" }]}>ETT CUFFED</Text>
                <Text style={[styles.arrestValue, { fontFamily: "Inter_700Bold", fontSize: Math.round(16.5 * textScale) }]}>
                  {ettube.cuffed} · {ettube.depth}
                </Text>
                <Text style={[styles.arrestSub, { fontFamily: "Inter_400Regular" }]}>uncuffed {ettube.uncuffed}</Text>
              </View>
              <View style={styles.arrestCell}>
                <Text style={[styles.arrestLabel, { fontFamily: "Inter_600SemiBold" }]}>FLUID BOLUS NS/RL</Text>
                <Text style={[styles.arrestValue, { fontFamily: "Inter_700Bold", fontSize: Math.round(16.5 * textScale) }]}>
                  {Math.round(20 * weightKg)} mL
                </Text>
                <Text style={[styles.arrestSub, { fontFamily: "Inter_400Regular" }]}>20 mL/kg · reassess · up to 40–60 mL/kg</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── HIGH-QUALITY CPR strip + metronome + code log (2025) ── */}
        {weightValid && (
          <View style={[styles.palsBanner, { backgroundColor: isDark ? "#041B16" : "#FFFFFF", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
            <Text style={[styles.palsTitle, { color: "#DC2626", fontFamily: "Inter_700Bold" }]}>High-Quality CPR — AHA 2025</Text>
            <Text style={{ fontSize: Math.round(12.5 * textScale), lineHeight: 19, color: isDark ? "#C9E8DF" : "#0D1B2A", fontFamily: "Inter_400Regular" }}>
              Rate 100–120/min · Depth ≥ ⅓ of chest (infant ≈ 4 cm · child ≈ 5 cm · max 6 cm){"\n"}
              Full recoil · Interruptions &lt; 10 s · Change compressor every 2 min{"\n"}
              Ratio 15:2 (2 rescuers) · 30:2 (single rescuer){"\n"}
              Advanced airway: continuous compressions + 1 breath every 2–3 s (20–30/min){"\n"}
              Monitor ETCO2 + diastolic BP — DBP targets: ≥ 25 mmHg (infant) · ≥ 30 mmHg (child)
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <TouchableOpacity onPress={toggleMetronome} activeOpacity={0.8} style={{ flex: 1, backgroundColor: metroOn ? "#DC2626" : (isDark ? "#0B352B" : "#F1F5F9"), borderWidth: 1, borderColor: "#DC2626", borderRadius: 10, paddingVertical: 10, alignItems: "center" }}>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: metroOn ? "#FFFFFF" : "#DC2626" }}>{metroOn ? "■ STOP METRONOME" : "▶ METRONOME 110/min"}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
              <TouchableOpacity onPress={logEpi} activeOpacity={0.8} style={{ flex: 1, backgroundColor: "#DC2626", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                <Text style={{ fontFamily: "Inter_800ExtraBold", fontSize: 14, color: "#FFFFFF" }}>EPI DIYA ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logShock} activeOpacity={0.8} style={{ flex: 1, backgroundColor: "#B45309", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                <Text style={{ fontFamily: "Inter_800ExtraBold", fontSize: 14, color: "#FFFFFF" }}>SHOCK DIYA ⚡</Text>
              </TouchableOpacity>
              {codeLog.length > 0 && (
                <TouchableOpacity onPress={() => setCodeLog([])} activeOpacity={0.8} style={{ paddingHorizontal: 12, borderRadius: 10, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: isDark ? "#1D5243" : "#E2E8F0" }}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: isDark ? "#83ACA1" : "#64748B" }}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            {codeLog.length > 0 && (
              <View style={{ marginTop: 10, backgroundColor: isDark ? "#0B352B" : "#F8FAFC", borderRadius: 10, padding: 10 }}>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 12.5, color: isDark ? "#FFFFFF" : "#0D1B2A" }}>
                  CODE LOG — Epi ×{epiGivenCount} · Shocks ×{shockGivenCount} · Elapsed ~{fmtTime(codeElapsed)}
                </Text>
                {codeLog.slice(-6).map((e, i) => (
                  <Text key={i} style={{ fontSize: 12, marginTop: 3, color: isDark ? "#A8B8DC" : "#475569", fontFamily: "Inter_400Regular" }}>
                    {e.at} — {e.kind} {e.detail}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Printable one-page emergency sheet for this weight */}
        <Pressable
          onPress={() => router.push("/emergency-sheet" as any)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: isDark ? "#0B352B" : "#FFFFFF",
            borderWidth: 1,
            borderColor: "#DC2626",
            borderRadius: 12,
            paddingVertical: 11,
            marginBottom: 12,
          }}
        >
          <Feather name="printer" size={15} color="#DC2626" />
          <Text style={{ color: "#DC2626", fontFamily: "Inter_600SemiBold", fontSize: 13.5 }}>
            Printable Emergency Sheet — {weightKg} kg
          </Text>
        </Pressable>

        {/* ── PATHWAYS — AHA PALS 2025, step by step for this weight ── */}
        {weightValid && (
          <View style={[styles.palsBanner, { backgroundColor: isDark ? "#041B16" : "#FFFFFF", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
            <Text style={[styles.palsTitle, { color: "#DC2626", fontFamily: "Inter_700Bold" }]}>Pathways — AHA PALS 2025</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {([
                { k: "vf", l: "VF / pVT" },
                { k: "pea", l: "Asystole / PEA" },
                { k: "brady", l: "Bradycardia" },
                { k: "tachy", l: "Tachycardia" },
                { k: "postop", l: "★ Post-Op Cardiac" },
              ] as const).map((c) => (
                <TouchableOpacity key={c.k} onPress={() => setPathway(c.k)} activeOpacity={0.8} style={{ paddingHorizontal: 13, paddingVertical: 9, borderRadius: 999, backgroundColor: pathway === c.k ? "#DC2626" : "transparent", borderWidth: 1, borderColor: "#DC2626" }}>
                  <Text style={{ fontFamily: "Inter_700Bold", fontSize: 12.5, color: pathway === c.k ? "#FFFFFF" : "#DC2626" }}>{c.l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {(() => {
              const epiMg = +Math.min(0.01 * weightKg, 1).toFixed(3);
              const epiMl = +(epiMg * 10).toFixed(1);
              const amioMg = Math.min(5 * weightKg, 300);
              const lidoMg = Math.min(1 * weightKg, 100);
              const atropMg = +Math.min(Math.max(0.02 * weightKg, 0.1), 0.5).toFixed(2);
              const aden1 = +Math.min(0.1 * weightKg, 6).toFixed(1);
              const aden2 = +Math.min(0.2 * weightKg, 12).toFixed(1);
              const syncLo = Math.round(0.5 * weightKg);
              const syncHi = Math.round(1 * weightKg);
              const sync2 = Math.min(2 * weightKg, 100);
              const steps: Record<string, string[]> = {
                vf: [
                  `Shock ${defib.unsync1st} J (2 J/kg) — then CPR 2 min`,
                  "IV / IO access during CPR — do not interrupt compressions",
                  `Shock ${defib.unsyncSub} J (4 J/kg) — then CPR 2 min`,
                  `Epinephrine ${epiMg} mg (${epiMl} mL of 0.1 mg/mL) ASAP — then CPR 2 min`,
                  `Shock ${defib.unsyncSub} J or more (≥ 4 J/kg · max ${defib.unsyncMax} J)`,
                  `Amiodarone ${amioMg} mg (or Lidocaine ${lidoMg} mg) — then CPR 2 min`,
                  "Repeat the cycle: epinephrine every 3–5 min · treat reversible causes (Hs & Ts below)",
                ],
                pea: [
                  `Epinephrine ${epiMg} mg (${epiMl} mL of 0.1 mg/mL) IV/IO — ASAP, repeat every 3–5 min`,
                  "CPR in 2-min cycles — rhythm + pulse check every 2 min",
                  "IV / IO access — consider advanced airway + waveform capnography",
                  "Find and treat the cause — Hs & Ts below (hypovolemia, hypoxia, hypoglycemia, electrolytes…)",
                  `Fluid bolus ${Math.round(20 * weightKg)} mL NS/RL if hypovolemia is possible — reassess`,
                ],
                brady: [
                  "HR < 60/min WITH poor perfusion — hypotension, altered consciousness, signs of shock?",
                  "Support airway + give oxygen — ventilate if needed",
                  "Still < 60 with poor perfusion → START CPR",
                  `Epinephrine ${epiMg} mg IV/IO — repeat every 3–5 min (the FIRST drug)`,
                  `Atropine ${atropMg} mg IV/IO — ONLY if increased vagal tone or primary AV block (may repeat once)`,
                  "Consider cardiac pacing · treat causes: hypoxia, hypothermia, toxins, raised ICP",
                ],
                postop: [
                  "YE RAASTA SIRF UN KE LIYE HE jinki haal hi me cardiac surgery (sternotomy) hui ho — aam PALS se mukhtalif he (CSU-ALS protocol).",
                  "Arrest confirm karo: arterial line waveform flat + pulse nahi. SURGEON aur poori team ko foran bulao — 6 roles pehle se taqseem hon.",
                  `VF / pVT → pehle 3 STACKED shocks, compressions se PEHLE (defib tayyar ho to, 1 minute ke andar): ${defib.unsync1st} J → ${defib.unsyncSub} J → ${defib.unsyncSub} J`,
                  "Asystole / shadeed bradycardia → pehle PACING: epicardial wires pacing box se joro, DDD mode, maximum output — compressions se pehle (wires mojood hon to).",
                  "PEA → pacing OFF karke rhythm dobara dekho (pacing spikes fine VF ko chhupa sakte hein). Fori wajuhat dekho: ventilator disconnect, tension pneumothorax, TAMPONADE, andar khoon behna.",
                  "ROSC na aye → EMERGENCY RESTERNOTOMY 5 MINUTE KE ANDAR, bedside par — tamponade khulega; internal massage, internal defib (external se bohat kam energy) aur epicardial pacing mumkin hogi.",
                  "Epinephrine: routine FULL dose NAHI do — cause theek hote hi shadeed hypertension naye grafts / suture lines ko nuqsan de sakta he. Chhoti titrated dose sirf surgeon / senior clinician ke kehne par (adult protocol reference: 50–100 mcg increments).",
                  "Agar compressions chal rahi hon: arterial systolic > 60 mmHg ka target — na pahunche to tamponade ya bleeding samjho, resternotomy ki taraf barho.",
                  "ROSC ke bad bhi surgeon lazmi maujood rahe — dobara bleeding / tamponade ka khatra. ROSC na aye to ECPR / circulatory support par ghaur.",
                ],
                tachy: [
                  "Pulse present — cardiopulmonary compromise? (hypotension, altered consciousness, shock)",
                  `UNSTABLE → Synchronized cardioversion ${syncLo}–${syncHi} J (0.5–1 J/kg); if no response ${sync2} J (2 J/kg). Sedate if possible — do NOT delay the shock`,
                  `STABLE narrow (QRS ≤ 0.09 s) → sinus tachycardia: treat the cause · SVT: vagal maneuvers, then Adenosine ${aden1} mg rapid IV + flush; 2nd dose ${aden2} mg`,
                  `STABLE wide (QRS > 0.09 s) → expert consultation · consider adenosine if regular + monomorphic · Amiodarone ${amioMg} mg over 20–60 min`,
                ],
              };
              return steps[pathway].map((t, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#FFFFFF", fontFamily: "Inter_800ExtraBold", fontSize: 12 }}>{i + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: Math.round(13 * textScale), lineHeight: 19, color: isDark ? "#C9E8DF" : "#0D1B2A", fontFamily: "Inter_500Medium" }}>{t}</Text>
                </View>
              ));
            })()}
            {pathway === "postop" && (
              <Text style={{ fontSize: 11, color: isDark ? "#83ACA1" : "#64748B", fontStyle: "italic", marginTop: 8, lineHeight: 15 }}>
                Reference: EACTS / STS Cardiac Surgery Arrest (CSU-ALS) protocol · ERC 2025 — cardiac arrest after cardiac surgery
              </Text>
            )}
          </View>
        )}

        {/* Patient drug chart (Point 10) */}
        <Pressable
          onPress={() => router.push("/drug-chart" as any)}
          style={{
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
            backgroundColor: isDark ? "#0B352B" : "#FFFFFF", borderWidth: 1, borderColor: "#059669",
            borderRadius: 12, paddingVertical: 11, marginBottom: 12,
          }}
        >
          <Feather name="clipboard" size={15} color="#059669" />
          <Text style={{ color: "#059669", fontFamily: "Inter_600SemiBold", fontSize: 13.5 }}>
            Patient Drug Chart — print (favorites se)
          </Text>
        </Pressable>

        {/* Emergency Calculators */}
        <View style={[styles.palsBanner, { backgroundColor: isDark ? "#041B16" : "#FFFFFF", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
          <Text style={[styles.palsTitle, { color: colors.tint, fontFamily: "Inter_700Bold" }]}>
            Emergency Calculators
          </Text>
          <Text style={[styles.calcSource, { color: isDark ? "#83ACA1" : "#64748B", fontFamily: "Inter_400Regular" }]}>
            PALS 2025 · Harriet Lane 24e · ACLS
          </Text>

          {/* ET Tube + Airway */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#1D5243" : "#F0F4F8" }]}>
            <View style={styles.ettGrid}>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#0B352B" : "#EBF8FF", borderColor: isDark ? "#1A4F7A" : "#EBF8FF" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#5A8FC0" : "#1A4F7A", fontFamily: "Inter_500Medium" }]}>Uncuffed (mm)</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#93C5FD" : "#1A4F7A", fontFamily: "Inter_700Bold" }]}>{ettube.uncuffed}</Text>
              </View>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#0B352B" : "#F0FFF4", borderColor: isDark ? "#146B35" : "#F0FFF4" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#6FCF97" : "#146B35", fontFamily: "Inter_500Medium" }]}>Cuffed (mm)</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#86EFAC" : "#146B35", fontFamily: "Inter_700Bold" }]}>{ettube.cuffed}</Text>
              </View>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#0B352B" : "#FEE2E2", borderColor: isDark ? "#DC2626" : "#FEE2E2" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#FCA5A5" : "#991B1B", fontFamily: "Inter_500Medium" }]}>Depth</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#FECACA" : "#DC2626", fontFamily: "Inter_700Bold" }]}>{ettube.depth}</Text>
              </View>
            </View>
            <View style={styles.airwayRow}>
              <View style={[styles.airwayBadge, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
                <Text style={[styles.airwayBadgeLabel, { color: isDark ? "#83ACA1" : "#64748B" }]}>Suction</Text>
                <Text style={[styles.airwayBadgeValue, { color: isDark ? "#FFD700" : "#B45309" }]}>{suctionFr} Fr</Text>
              </View>
              <View style={[styles.airwayBadge, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
                <Text style={[styles.airwayBadgeLabel, { color: isDark ? "#83ACA1" : "#64748B" }]}>Blade</Text>
                <Text style={[styles.airwayBadgeValue, { color: isDark ? "#FFD700" : "#B45309" }]}>{blade}</Text>
              </View>
              <View style={[styles.airwayBadge, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
                <Text style={[styles.airwayBadgeLabel, { color: isDark ? "#83ACA1" : "#64748B" }]}>LMA</Text>
                <Text style={[styles.airwayBadgeValue, { color: isDark ? "#FFD700" : "#B45309" }]}>Size {lma}</Text>
              </View>
            </View>
            <View style={[styles.dopeStrip, { backgroundColor: isDark ? "#1A1F3D" : "#F0F4F8", borderColor: isDark ? "#3D4770" : "#E2E8F0" }]}>
              <Text style={[styles.dopeLabel, { color: isDark ? "#83ACA1" : "#64748B" }]}>DOPE Check</Text>
              <Text style={[styles.dopeText, { color: isDark ? "#83ACA1" : "#64748B" }]}>Displacement · Obstruction · Pneumothorax · Equipment failure</Text>
            </View>
          </View>

          {/* Defibrillator — hard-coded PALS */}
          {weightValid && <View style={[styles.calcSection, { borderTopColor: isDark ? "#1D5243" : "#F0F4F8" }]}>
            <Text style={[styles.calcSectionTitle, { color: isDark ? "#83ACA1" : "#64748B", fontFamily: "Inter_600SemiBold", marginBottom: 10 }]}>
              Defibrillator Energy — {weightKg.toFixed(1)} kg
            </Text>
            <View style={{ gap: 8 }}>
              <View style={[styles.shockBox, { backgroundColor: isDark ? "#0B352B" : "#FEE2E2", borderColor: isDark ? "#DC2626" : "#FCA5A5" }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#DC2626" }} />
                  <Text style={[styles.shockType, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>Unsynchronized — VF / pVT</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline" }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FECACA" : "#DC2626", fontSize: Math.round(18 * textScale) }]}>{defib.unsync1st} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>1st = 2 J/kg (max 200)</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline", marginTop: 4 }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FECACA" : "#DC2626", fontSize: Math.round(18 * textScale) }]}>{defib.unsyncSub} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>2nd+ = 4 J/kg (max 360)</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline", marginTop: 4 }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FECACA" : "#DC2626", fontSize: Math.round(18 * textScale) }]}>{defib.unsyncMax} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>Max = 10 J/kg (max 360)</Text>
                </View>
              </View>
              <View style={[styles.shockBox, { backgroundColor: isDark ? "#0B352B" : "#FEF3C7", borderColor: isDark ? "#D97706" : "#FCD34D" }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#D97706" }} />
                  <Text style={[styles.shockType, { color: isDark ? "#FCD34D" : "#92400E" }]}>Synchronized — SVT / VT with pulse</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline" }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FDE68A" : "#B45309", fontSize: Math.round(18 * textScale) }]}>{defib.sync1st} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCD34D" : "#92400E" }]}>1st = 0.5 J/kg (max 50)</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "baseline", marginTop: 4 }}>
                  <Text style={[styles.shockJoules, { color: isDark ? "#FDE68A" : "#B45309", fontSize: Math.round(18 * textScale) }]}>{defib.syncSub} J</Text>
                  <Text style={[styles.shockFormula, { color: isDark ? "#FCD34D" : "#92400E" }]}>Subsequent = 2 J/kg (max 100)</Text>
                </View>
              </View>
            </View>
          </View>}
        </View>

        {/* Critical Drug Cards — grouped: arrest drugs first */}
        {[
          { title: "ARREST — FIRST-LINE DRUGS", arrest: true },
          { title: "MORE EMERGENCY DRUGS", arrest: false },
        ].map((grp) => (
          <View key={grp.title}>
            <Text style={{ fontSize: 12.5, fontFamily: "Inter_700Bold", letterSpacing: 0.5, color: isDark ? "#A8B8DC" : "#4A5568", marginTop: 10, marginBottom: 8 }}>{grp.title}</Text>
            {emergencyCards
              .map((item, idx) => ({ item, idx }))
              .filter(({ item }) => grp.arrest === (item.label.startsWith("Epinephrine") || item.label.startsWith("Amiodarone") || item.label.startsWith("Lidocaine")))
              .map(({ item, idx }) => (
          <View
            key={idx}
            style={[
              styles.emergencyCard,
              {
                backgroundColor: isDark ? "#0B352B" : "#FFFFFF",
                borderLeftColor: item.color,
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? "#1D5243" : "transparent",
                borderLeftWidth: 3,
              },
            ]}
          >
            <View style={styles.cardTopCompact}>
              <Text style={[styles.cardLabelCompact, { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_600SemiBold" }]}>
                {item.label}
              </Text>
              <View style={[styles.routeTagCompact, { backgroundColor: item.color + "22" }]}>
                <Text style={[styles.routeTagTextCompact, { color: item.color, fontFamily: "Inter_600SemiBold" }]}>{item.route}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <Text style={[styles.cardDoseCompact, { color: item.color, fontFamily: "Inter_800ExtraBold" }]}>{item.dose}</Text>
              {item.doseSub && (
                <Text style={[styles.cardDoseUnitCompact, { color: item.color, fontFamily: "Inter_600SemiBold" }]}>{item.doseSub}</Text>
              )}
            </View>
            {item.exceedsAdultMax && (
              <View style={styles.adultMaxAlert}>
                <Feather name="alert-octagon" size={12} color="#fff" />
                <Text style={[styles.adultMaxAlertText, { fontFamily: "Inter_700Bold" }]}>{item.adultMaxLabel}</Text>
              </View>
            )}
            <Text style={[styles.cardNotesCompact, { color: isDark ? "#83ACA1" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
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
          </View>
        ))}

        {/* Choking + Neonatal cards */}
        <View style={[styles.palsBanner, { backgroundColor: isDark ? "#041B16" : "#FFFFFF", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
          <Text style={[styles.palsTitle, { color: colors.tint, fontFamily: "Inter_700Bold" }]}>Choking — Foreign-Body Airway Obstruction (BLS 2025)</Text>
          <Text style={{ fontSize: Math.round(12.5 * textScale), lineHeight: 19, color: isDark ? "#C9E8DF" : "#0D1B2A", fontFamily: "Inter_400Regular" }}>
            Conscious infant (&lt; 1 yr): 5 back blows ↔ 5 chest thrusts — repeat. NO abdominal thrusts. NO blind finger sweeps.{"\n"}
            Child ≥ 1 yr: 5 back blows, then 5 abdominal thrusts — alternate until the object clears or the child becomes unconscious.{"\n"}
            If unconscious: start CPR. Look into the mouth before each ventilation — remove the object only if you can see it.
          </Text>
        </View>
        <View style={[styles.palsBanner, { backgroundColor: isDark ? "#041B16" : "#FFFFFF", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
          <Text style={[styles.palsTitle, { color: colors.tint, fontFamily: "Inter_700Bold" }]}>Neonatal Corner — NRP</Text>
          <Text style={{ fontSize: Math.round(12.5 * textScale), lineHeight: 19, color: isDark ? "#C9E8DF" : "#0D1B2A", fontFamily: "Inter_400Regular" }}>
            Warm · dry · stimulate. HR &lt; 100 → PPV (room air for term babies). HR &lt; 60 despite 30 s of effective PPV → chest compressions.{"\n"}
            Compressions : Ventilation = 3 : 1 (90 + 30 = 120 events/min) · 100% O2 during compressions.{"\n"}
            Epinephrine IV/IO 0.02–0.03 mg/kg (0.2–0.3 mL/kg of 0.1 mg/mL) if HR stays &lt; 60 — repeat every 3–5 min.{"\n"}
            Volume: NS 10 mL/kg if blood loss or shock. Pre-ductal SpO2 targets: 1 min 60–65% · 3 min 70–75% · 5 min 80–85% · 10 min 85–95%.
          </Text>
        </View>

        {/* Hs & Ts */}
        <View style={[styles.palsBanner, { backgroundColor: isDark ? "#041B16" : "#FFFFFF", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
          <Text style={[styles.palsTitle, { color: colors.tint, fontFamily: "Inter_700Bold" }]}>Hs & Ts — Reversible Causes</Text>
          <View style={styles.htGrid}>
            <View style={[styles.htCol, { backgroundColor: isDark ? "#0B352B" : "#F0FFF4", borderColor: isDark ? "#146B35" : "#D1FAE5" }]}>
              <Text style={[styles.htColTitle, { color: isDark ? "#86EFAC" : "#146B35" }]}>H's</Text>
              {HsItems.map((h, i) => (
                <TouchableOpacity key={i} onPress={() => toggleH(i)} style={styles.htRow} activeOpacity={0.7}>
                  <View style={[styles.htCheckbox, { backgroundColor: hsChecked[i] ? (isDark ? "#146B35" : "#16A34A") : "transparent", borderColor: isDark ? "#6FCF97" : "#16A34A" }]}>
                    {hsChecked[i] && <Feather name="check" size={10} color="#FFFFFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.htLabel, { color: isDark ? "#FFFFFF" : "#0D1B2A" }]}>{h.label}</Text>
                    <Text style={[styles.htAction, { color: isDark ? "#83ACA1" : "#64748B" }]}>{h.action}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.htCol, { backgroundColor: isDark ? "#0B352B" : "#FEF2F2", borderColor: isDark ? "#7F1D1D" : "#FECACA" }]}>
              <Text style={[styles.htColTitle, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>T's</Text>
              {TsItems.map((t, i) => (
                <TouchableOpacity key={i} onPress={() => toggleT(i)} style={styles.htRow} activeOpacity={0.7}>
                  <View style={[styles.htCheckbox, { backgroundColor: tsChecked[i] ? (isDark ? "#7F1D1D" : "#DC2626") : "transparent", borderColor: isDark ? "#FCA5A5" : "#DC2626" }]}>
                    {tsChecked[i] && <Feather name="check" size={10} color="#FFFFFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.htLabel, { color: isDark ? "#FFFFFF" : "#0D1B2A" }]}>{t.label}</Text>
                    <Text style={[styles.htAction, { color: isDark ? "#83ACA1" : "#64748B" }]}>{t.action}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── After ROSC targets ── */}
        <View style={[styles.palsBanner, { backgroundColor: isDark ? "#041B16" : "#FFFFFF", borderColor: isDark ? "#1D5243" : "#E2E8F0" }]}>
          <Text style={[styles.palsTitle, { color: "#16A34A", fontFamily: "Inter_700Bold" }]}>After ROSC — Post-Arrest Targets (PALS 2025)</Text>
          <Text style={{ fontSize: Math.round(12.5 * textScale), lineHeight: 19, color: isDark ? "#C9E8DF" : "#0D1B2A", fontFamily: "Inter_400Regular" }}>
            SpO2 94–98% — avoid hypoxia AND hyperoxia.{"\n"}
            Blood pressure: keep SBP above the age floor (≥ {targetVitals.minSBP} mmHg for this age) — continuous arterial BP monitoring if available.{"\n"}
            Temperature: prevent fever — keep ≤ 37.5°C.{"\n"}
            Ventilation: normocapnia — PaCO2 / ETCO2 35–45 mmHg. Do not hyperventilate.{"\n"}
            Glucose: check early — treat hypoglycemia.{"\n"}
            Continuous ECG · BP · SpO2 · ETCO2 monitoring — watch for seizures (consider EEG).
          </Text>
        </View>

        <ProfessionalFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hamburgerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 4, backgroundColor: "rgba(255,255,255,0.15)" },
  header: { paddingHorizontal: 16, paddingBottom: 14 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  headerTitle: { fontSize: 20, color: "#FFFFFF", letterSpacing: -0.5 },
  nightToggle: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  nightToggleText: { fontSize: 12, color: "rgba(255,255,255,0.85)" },
  headerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 10 },
  warningBanner: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  warningText: { fontSize: 12, color: "#FFFFFF" },

  pinnedSection: { borderBottomWidth: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  // Row of the two input blocks — each block is its own isolated flex column, never overlaps its neighbor
  inputRow: { gap: 12 },
  inputWrap: {
    flex: 1,
    minWidth: 0,
    flexBasis: 0,
    minHeight: 60,
    zIndex: 1,
    position: "relative",
  },
  inputWrapFull: { width: "100%", flex: 0, flexBasis: "auto" },

  // Label above each input group
  inputFieldLabel: { fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  weightInputError: {
    color: "#B91C1C",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 5,
  },
  weightInputWarning: {
    color: "#B45309",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    marginTop: 5,
  },

  // Number box + pill toggle: fixed-height row, never wraps so the two never stack on top of each other
  inputWithToggle: { flexDirection: "row", alignItems: "stretch", gap: 8, minHeight: 44, width: "100%" },

  // The number input box — solid opaque background + its own stacking context so text is always on top
  inputBox: {
    flex: 1,
    minWidth: 0,
    flexBasis: 0,
    flexShrink: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
    minHeight: 44,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    zIndex: 2,
    position: "relative",
  },

  // Pill container: horizontal KG|LBS or YRS|MO side-by-side, fixed width so it never gets squeezed into the input box
  segPill: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    flexShrink: 0,
    zIndex: 2,
    position: "relative",
  },

  // Thin divider between the two pill options
  segDivider: { width: 1 },

  // Each pill option — minimum 44×44 for thumb safety
  segOption: { minWidth: 48, minHeight: 44, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" },

  // Active states — teal for weight, indigo for age
  segOptionActiveBlue: { backgroundColor: "#0D9488" },
  segOptionActiveIndigo: { backgroundColor: "#6366F1" },

  // Text inside each pill option
  segOptionText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },

  // Status Bar
  statusBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, padding: 6, gap: 6 },
  statusTimer: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 4, alignItems: "center", justifyContent: "center", minHeight: 52 },
  statusTimerLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  statusTimerValue: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  statusAlert: { fontSize: 16, fontWeight: "900", color: "#DC2626", textAlign: "center" },
  statusAlertEpi: { fontSize: 16, fontWeight: "900", color: "#DC2626", textAlign: "center" },
  statusBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  statusBtnText: { color: "#FFF", fontSize: 13, fontWeight: "900", letterSpacing: 0.5 },
  statusChips: { flexDirection: "row", gap: 4, alignItems: "center" },
  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: "#7C3AED" },
  statusChipActive: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
  statusChipText: { fontSize: 11, fontWeight: "700", color: "#7C3AED" },
  statusChipTextActive: { color: "#FFF" },

  mismatchBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  mismatchText: { fontSize: 12, fontWeight: "700", flex: 1 },

  // Post-Code Checklist
  postCodeCard: { borderRadius: 12, borderWidth: 1, padding: 10 },
  postCodeHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  postCodeTitle: { fontSize: 13, fontWeight: "700", flex: 1 },
  postCodeRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, paddingVertical: 2 },

  scrollContent: { padding: 12, gap: 8 },

  // Drug cards
  emergencyCard: { borderRadius: 12, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, gap: 4, marginBottom: 6 },
  cardTopCompact: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  cardLabelCompact: { fontSize: 12, flex: 1, lineHeight: 16 },
  routeTagCompact: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" },
  routeTagTextCompact: { fontSize: 9, letterSpacing: 0.3 },
  cardDoseCompact: { fontSize: 24, letterSpacing: -0.5 },
  cardDoseUnitCompact: { fontSize: 14 },
  cardNotesCompact: { fontSize: 11, lineHeight: 14 },
  adultMaxAlert: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#B91C1C", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 },
  adultMaxAlertText: { fontSize: 10, color: "#FFFFFF", flex: 1, letterSpacing: 0.1 },

  // Equipment
  arrestStrip: { borderRadius: 14, padding: 14, borderWidth: 1.5, marginBottom: 10 },
  arrestTitle: { color: "#FCA5A5", fontSize: 12.5, letterSpacing: 0.6, marginBottom: 10 },
  arrestGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  arrestCell: { width: "47%", backgroundColor: "#991B1B", borderRadius: 10, padding: 10 },
  arrestLabel: { color: "#FECACA", fontSize: 10.5, letterSpacing: 0.4, marginBottom: 3 },
  arrestValue: { color: "#FFFFFF", fontSize: 16.5 },
  arrestSub: { color: "#FCA5A5", fontSize: 11, marginTop: 2 },
  palsBanner: { borderRadius: 14, padding: 14, borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 6 },
  palsTitle: { fontSize: 15, marginBottom: 10 },
  calcSource: { fontSize: 11, marginBottom: 10, marginTop: -6, letterSpacing: 0.3 },
  calcSection: { borderTopWidth: 1, marginTop: 8, paddingTop: 8 },
  calcSectionTitle: { fontSize: 12, letterSpacing: 0.3 },
  ettGrid: { flexDirection: "row", gap: 8 },
  ettBox: { flex: 1, borderRadius: 10, padding: 10, alignItems: "center", gap: 4, borderWidth: 1 },
  ettLabel: { fontSize: 10 },
  ettValue: { fontSize: 15, textAlign: "center" },
  airwayRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  airwayBadge: { flex: 1, borderRadius: 8, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 4, alignItems: "center" },
  airwayBadgeLabel: { fontSize: 10, fontWeight: "600", marginBottom: 2 },
  airwayBadgeValue: { fontSize: 13, fontWeight: "700" },
  dopeStrip: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, marginTop: 8, flexWrap: "wrap" },
  dopeLabel: { fontSize: 10, fontWeight: "700" },
  dopeText: { fontSize: 10, fontWeight: "500" },
  shockBox: { borderRadius: 10, borderWidth: 1, padding: 10, gap: 2 },
  shockType: { fontSize: 12, fontWeight: "700" },
  shockJoules: { fontSize: 18, fontWeight: "700" },
  shockFormula: { fontSize: 10, fontWeight: "500" },

  // Hs & Ts
  htGrid: { flexDirection: "row", gap: 8 },
  htCol: { flex: 1, borderRadius: 10, borderWidth: 1, padding: 10, gap: 6 },
  htColTitle: { fontSize: 12, fontWeight: "700" },
  htRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, paddingVertical: 2 },
  htCheckbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, alignItems: "center", justifyContent: "center", marginTop: 1 },
  htLabel: { fontSize: 11, fontWeight: "600", lineHeight: 15 },
  htAction: { fontSize: 9, fontWeight: "500", lineHeight: 13, marginTop: 1 },
});
