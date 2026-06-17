import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";

import {
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
import { ProfessionalFooter } from "@/components/ProfessionalFooter";
import { StarButton } from "@/components/StarButton";

// ── ET Tube, Airway, Defibrillation formulas (Harriet Lane 23e · PALS 2025) ───
function calcETTube(ageYears: number) {
  if (ageYears < 1) {
    return { uncuffed: "3.0–3.5", cuffed: "3.0 (premature–3.0)", depth: "9–10 cm at lip", cuffedNum: 3.0 };
  }
  const uncuffed = +(ageYears / 4 + 4).toFixed(1);
  const cuffed   = +(ageYears / 4 + 3.5).toFixed(1);
  const depth    = +(ageYears / 2 + 12).toFixed(1);
  return { uncuffed: `${uncuffed} mm`, cuffed: `${cuffed} mm`, depth: `${depth} cm at lip`, cuffedNum: cuffed };
}

function calcDefib(weightKg: number) {
  const initial    = Math.min(+(2 * weightKg).toFixed(0), 200);
  const subsequent = Math.min(+(4 * weightKg).toFixed(0), 360);
  const maximum    = Math.min(+(10 * weightKg).toFixed(0), 360);
  return { initial, subsequent, maximum };
}

// Suction catheter: Cuffed tube size × 2, round to nearest even French
function calcSuctionCatheter(cuffedMm: number) {
  const raw = cuffedMm * 2;
  return Math.round(raw / 2) * 2;
}

// Laryngoscope blade by age (PALS 2025)
function calcBlade(ageYears: number) {
  if (ageYears < 0.08) return "Miller 00";
  if (ageYears < 1)   return "Miller 0";
  if (ageYears < 6)   return "Miller 1";
  if (ageYears < 12)  return "Miller 2 / Mac 2";
  return "Mac 3";
}

// LMA size by weight (kg)
function calcLMA(weightKg: number) {
  if (weightKg <= 5)    return "1";
  if (weightKg <= 10)   return "1.5";
  if (weightKg <= 20)   return "2";
  if (weightKg <= 30)   return "2.5";
  if (weightKg <= 50)   return "3";
  if (weightKg <= 70)   return "4";
  return "5";
}

// PALS Hs & Ts
const Hs = [
  "Hypovolemia",
  "Hypoxia",
  "Hydrogen ion (Acidosis)",
  "Hypo- / Hyperkalemia",
  "Hypothermia",
];
const Ts = [
  "Tension pneumothorax",
  "Tamponade (cardiac)",
  "Toxins",
  "Thrombosis (pulmonary / coronary)",
];

interface EmergencyItem {
  label: string;
  dose: string;
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
  const { weight } = useWeight();
  const { isFav, toggleFav } = useFavorites();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const [ageYearsInput, setAgeYearsInput] = useState("2");
  const ageYears = Math.max(0, parseFloat(ageYearsInput) || 0);
  const ettube = calcETTube(ageYears);
  const defib = calcDefib(weight);
  const suctionFr = calcSuctionCatheter(ettube.cuffedNum);
  const blade = calcBlade(ageYears);
  const lma = calcLMA(weight);
  const [hsTsOpen, setHsTsOpen] = useState(false);

  const [apgarA, setApgarA] = useState("");
  const [apgarP, setApgarP] = useState("");
  const [apgarG, setApgarG] = useState("");
  const [apgarAc, setApgarAc] = useState("");
  const [apgarR, setApgarR] = useState("");
  const apgarTotal = (parseInt(apgarA) || 0) + (parseInt(apgarP) || 0) + (parseInt(apgarG) || 0) + (parseInt(apgarAc) || 0) + (parseInt(apgarR) || 0);

  const [emBurnWt, setEmBurnWt] = useState("");
  const [emBurnBsa, setEmBurnBsa] = useState("");
  const emBurnTotal = Math.round(3 * (parseFloat(emBurnWt) || 0) * (parseFloat(emBurnBsa) || 0));
  const emBurnFirst8 = Math.round(emBurnTotal / 2);
  const emBurnNext16 = Math.round(emBurnTotal / 2);

  const emergencyCards = useMemo((): EmergencyItem[] => {
    const results: EmergencyItem[] = [];

    const epinephrine = DRUGS.find((d) => d.id === "epinephrine");
    if (epinephrine) {
      const iv = epinephrine.doses[0];
      const calcIV = calculateDose(iv, weight);
      results.push({
        label: "Epinephrine (Cardiac Arrest / Bradycardia)",
        dose: calcIV.dose,
        route: "IV / IO",
        notes: `0.1 mL/kg of 1:10,000 = ${+(0.1 * weight).toFixed(1)} mL. Repeat every 3-5 min.`,
        color: "#6366F1",
        warning: true,
        exceedsAdultMax: calcIV.exceedsAdultMax,
        adultMaxLabel: calcIV.adultMaxLabel,
      });
      const im = epinephrine.doses[1];
      const calcIM = calculateDose(im, weight);
      results.push({
        label: "Epinephrine (Anaphylaxis)",
        dose: calcIM.dose,
        route: "IM Anterolateral thigh",
        notes: "Use 1:1,000 solution. May repeat after 5-15 min.",
        color: "#6366F1",
        warning: true,
        exceedsAdultMax: calcIM.exceedsAdultMax,
        adultMaxLabel: calcIM.adultMaxLabel,
      });
      const inf = epinephrine.doses[2];
      const calcInf = calculateDose(inf, weight);
      results.push({
        label: "Epinephrine (Continuous Infusion)",
        dose: calcInf.dose,
        route: "IV infusion (Central)",
        notes: "Titrate to effect.",
        color: "#6366F1",
        warning: false,
        exceedsAdultMax: calcInf.exceedsAdultMax,
        adultMaxLabel: calcInf.adultMaxLabel,
      });
    }

    const atropine = DRUGS.find((d) => d.id === "atropine");
    if (atropine) {
      const d = atropine.doses[0];
      const calc = calculateDose(d, weight);
      results.push({
        label: "Atropine (Bradycardia)",
        dose: calc.dose,
        route: "IV / IO",
        notes: "Minimum 0.1 mg; max 0.5 mg child / 3 mg adolescent",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    const adenosine = DRUGS.find((d) => d.id === "adenosine");
    if (adenosine) {
      const d = adenosine.doses[0];
      const calc = calculateDose(d, weight);
      const dose2 = +(0.2 * weight).toFixed(2);
      results.push({
        label: "Adenosine (SVT) — 1st Dose",
        dose: calc.dose,
        route: "IV rapid push",
        notes: `2nd dose: ${dose2} mg (max 12 mg) — rapid flush!`,
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    const bicarb = DRUGS.find((d) => d.id === "sodium-bicarbonate");
    if (bicarb) {
      const d = bicarb.doses[0];
      const calc = calculateDose(d, weight);
      results.push({
        label: "Sodium Bicarbonate",
        dose: calc.dose,
        route: "IV",
        notes: "For severe metabolic acidosis",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    const calcGluc = DRUGS.find((d) => d.id === "calcium-gluconate");
    if (calcGluc) {
      const d = calcGluc.doses[0];
      const calcResult = calculateDose(d, weight);
      results.push({
        label: "Calcium Gluconate",
        dose: calcResult.dose,
        route: "IV",
        notes: "Infuse slowly with cardiac monitoring",
        color: "#6366F1",
        exceedsAdultMax: calcResult.exceedsAdultMax,
        adultMaxLabel: calcResult.adultMaxLabel,
      });
    }

    const dextrose = DRUGS.find((d) => d.id === "dextrose");
    if (dextrose) {
      const d10 = +(4 * weight).toFixed(0);
      const d25 = +(2 * weight).toFixed(0);
      const d50 = +(1 * weight).toFixed(0);
      results.push({
        label: "Dextrose (Hypoglycemia)",
        dose: `D10: ${d10} mL · D25: ${d25} mL · D50: ${d50} mL`,
        route: "IV",
        notes: "Neonates: D10 only",
        color: "#6366F1",
      });
    }

    const naloxone = DRUGS.find((d) => d.id === "naloxone");
    if (naloxone) {
      const d = naloxone.doses[0];
      const calc = calculateDose(d, weight);
      results.push({
        label: "Naloxone (Opioid OD)",
        dose: calc.dose,
        route: "IV · IM · IN",
        notes: "IN: use 4 mg/mL atomiser · may repeat every 2–3 min",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    const amiodarone = DRUGS.find((d) => d.id === "amiodarone");
    if (amiodarone) {
      const d = amiodarone.doses[0];
      const calc = calculateDose(d, weight);
      results.push({
        label: "Amiodarone (Pulseless VT/VF)",
        dose: calc.dose,
        route: "IV / IO",
        notes: "Max 300 mg per dose — dilute in D5W only",
        color: "#6366F1",
        warning: true,
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    const lorazepam = DRUGS.find((d) => d.id === "lorazepam");
    if (lorazepam) {
      const d = lorazepam.doses[0];
      const calc = calculateDose(d, weight);
      results.push({
        label: "Lorazepam (Status Epilepticus)",
        dose: calc.dose,
        route: "IV",
        notes: "Max 4 mg; may repeat once after 5 min",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    const midazolam = DRUGS.find((d) => d.id === "midazolam");
    if (midazolam) {
      const inDose = +(0.3 * weight).toFixed(2);
      const cappedDose = Math.min(inDose, 10);
      const exceeded = inDose > 10;
      results.push({
        label: "Midazolam IN (Seizures)",
        dose: `${cappedDose} mg`,
        route: "Intranasal (IN)",
        notes: "0.3 mg/kg via atomiser · divide equally between nostrils · max 10 mg",
        color: "#6366F1",
        exceedsAdultMax: exceeded,
        adultMaxLabel: exceeded ? "Adult max: 10 mg — dose capped" : undefined,
      });
    }

    const fentanyl = DRUGS.find((d) => d.id === "fentanyl");
    if (fentanyl) {
      const d = fentanyl.doses[2];
      const calc = calculateDose(d, weight);
      results.push({
        label: "Fentanyl IN (Procedural Pain)",
        dose: calc.dose,
        route: "Intranasal (IN)",
        notes: "Use atomiser · max 0.5 mL per nostril · max 200 mcg total",
        color: "#6366F1",
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
    }

    return results;
  }, [weight]);

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
            <Feather name="alert-circle" size={22} color="#FFFFFF" />
            <Text
              style={[
                styles.headerTitle,
                { fontFamily: "Inter_700Bold" },
              ]}
            >
              Code Blue / Emergency
            </Text>
          </View>
          {/* Night shift toggle */}
          <TouchableOpacity
            onPress={toggleDark}
            style={styles.nightToggle}
            activeOpacity={0.7}
          >
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
          Weight: {weight} kg · All doses weight-based · Capped at adult max
        </Text>
        <View style={styles.warningBanner}>
          <Feather name="alert-triangle" size={14} color="#FFFFFF" />
          <Text style={[styles.warningText, { fontFamily: "Inter_500Medium" }]}>
            Always verify doses. For emergency use only.
          </Text>
        </View>
      </View>

      {/* Emergency Cards */}
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
                borderLeftWidth: 4,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardTitleRow}>
                <View style={styles.badgeRow}>
                  {item.warning && (
                    <View
                      style={[
                        styles.criticalBadge,
                        {
                          backgroundColor: isDark ? "#6366F120" : item.color + "22",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.criticalText,
                          { color: isDark ? "#6366F1" : item.color, fontFamily: "Inter_700Bold" },
                        ]}
                      >
                        CODE BLUE READY
                      </Text>
                    </View>
                  )}
                  {/* IN route badge for intranasal items */}
                  {(item.route.includes("IN") || item.route.toLowerCase().includes("intranasal")) && (
                    <View style={styles.inBadge}>
                      <Text style={[styles.inBadgeText, { fontFamily: "Inter_700Bold" }]}>
                        IN
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color: isDark ? "#FFFFFF" : "#0D1B2A",
                      fontFamily: "Inter_600SemiBold",
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={[
                    styles.routeTag,
                    { backgroundColor: item.color + "22" },
                  ]}
                >
                  <Text
                    style={[
                      styles.routeTagText,
                      { color: item.color, fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {item.route}
                  </Text>
                </View>
                <StarButton
                  isFav={isFav(`emergency-${idx}`)}
                  onToggle={() =>
                    toggleFav({
                      id: `emergency-${idx}`,
                      type: "drug",
                      label: item.label,
                      color: item.color,
                      notes: item.route,
                    })
                  }
                  size={18}
                  color={item.color}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
              <Text
                style={[
                  styles.cardDose,
                  { color: item.color, fontFamily: "Inter_800ExtraBold" },
                ]}
              >
                {item.dose.split(" ").slice(0, -1).join(" ") || item.dose}
              </Text>
              <Text
                style={[
                  styles.cardDoseUnit,
                  { color: item.color, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {item.dose.split(" ").pop()}
              </Text>
            </View>

            {/* Adult max dose red alert */}
            {item.exceedsAdultMax && (
              <View style={styles.adultMaxAlert}>
                <Feather name="alert-octagon" size={13} color="#fff" />
                <Text style={[styles.adultMaxAlertText, { fontFamily: "Inter_700Bold" }]}>
                  RED ALERT: {item.adultMaxLabel}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.cardNotes,
                {
                  color: isDark ? "#8892B0" : "#8A9BB0",
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              {item.notes}
            </Text>
          </View>
        ))}

        {/* Emergency Calculators — ET Tube & Defibrillation */}
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

          {/* ET Tube section */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <View style={styles.calcSectionHeader}>
              <Text style={[styles.calcSectionTitle, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_600SemiBold" }]}>
                ET Tube Size
              </Text>
              <View style={styles.ageInputWrap}>
                <Text style={[styles.ageLabel, { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
                  Age (yrs):
                </Text>
                <TextInput
                  style={[styles.ageInput, {
                    color: isDark ? "#FFFFFF" : "#0D1B2A",
                    backgroundColor: isDark ? "#233554" : "#F0F4F8",
                    fontFamily: "Inter_700Bold",
                  }]}
                  value={ageYearsInput}
                  onChangeText={setAgeYearsInput}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                  maxLength={4}
                  placeholder="0"
                  placeholderTextColor={isDark ? "#8892B0" : "#8A9BB0"}
                />
              </View>
            </View>
            <View style={styles.ettGrid}>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#112240" : "#EBF8FF", borderColor: isDark ? "#1A4F7A" : "#EBF8FF" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#5A8FC0" : "#1A4F7A", fontFamily: "Inter_500Medium" }]}>Uncuffed</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#93C5FD" : "#1A4F7A", fontFamily: "Inter_700Bold" }]}>
                  {ettube.uncuffed}
                </Text>
              </View>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#112240" : "#F0FFF4", borderColor: isDark ? "#146B35" : "#F0FFF4" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#6FCF97" : "#146B35", fontFamily: "Inter_500Medium" }]}>Cuffed</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#86EFAC" : "#146B35", fontFamily: "Inter_700Bold" }]}>
                  {ettube.cuffed}
                </Text>
              </View>
              <View style={[styles.ettBox, { backgroundColor: isDark ? "#112240" : "#FEE2E2", borderColor: isDark ? "#DC2626" : "#FEE2E2" }]}>
                <Text style={[styles.ettLabel, { color: isDark ? "#FCA5A5" : "#991B1B", fontFamily: "Inter_500Medium" }]}>Depth at lip</Text>
                <Text style={[styles.ettValue, { color: isDark ? "#FECACA" : "#DC2626", fontFamily: "Inter_700Bold" }]}>
                  {ettube.depth}
                </Text>
              </View>
            </View>
            {/* Airway equipment row */}
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
          </View>

          {/* Defibrillator section */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <Text style={[styles.calcSectionTitle, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_600SemiBold", marginBottom: 10 }]}>
              Defibrillator Energy — {weight} kg
            </Text>
            <View style={styles.defibGrid}>
              <View style={[styles.defibBox, { backgroundColor: isDark ? "#112240" : "#FEF3C7", borderColor: isDark ? "#D97706" : "#F59E0B" }]}>
                <Text style={[styles.defibLabel, { color: isDark ? "#FCD34D" : "#92400E", fontFamily: "Inter_500Medium" }]}>
                  1st Shock
                </Text>
                <Text style={[styles.defibJoules, { color: isDark ? "#FDE047" : "#B45309", fontFamily: "Inter_700Bold" }]}>
                  {defib.initial} J
                </Text>
                <Text style={[styles.defibFormula, { color: isDark ? "#F59E0B" : "#D97706", fontFamily: "Inter_400Regular" }]}>
                  2 J/kg
                </Text>
              </View>
              <View style={[styles.defibBox, { backgroundColor: isDark ? "#112240" : "#FEE2E2", borderColor: isDark ? "#DC2626" : "#F87171" }]}>
                <Text style={[styles.defibLabel, { color: isDark ? "#FCA5A5" : "#991B1B", fontFamily: "Inter_500Medium" }]}>
                  Subsequent
                </Text>
                <Text style={[styles.defibJoules, { color: isDark ? "#FECACA" : "#B91C1C", fontFamily: "Inter_700Bold" }]}>
                  {defib.subsequent} J
                </Text>
                <Text style={[styles.defibFormula, { color: isDark ? "#F87171" : "#DC2626", fontFamily: "Inter_400Regular" }]}>
                  4 J/kg
                </Text>
              </View>
              <View style={[styles.defibBox, { backgroundColor: isDark ? "#112240" : "#FCE7F3", borderColor: isDark ? "#DB2777" : "#F9A8D4" }]}>
                <Text style={[styles.defibLabel, { color: isDark ? "#F9A8D4" : "#831843", fontFamily: "Inter_500Medium" }]}>
                  Maximum
                </Text>
                <Text style={[styles.defibJoules, { color: isDark ? "#FBCFE8" : "#9D174D", fontFamily: "Inter_700Bold" }]}>
                  {defib.maximum} J
                </Text>
                <Text style={[styles.defibFormula, { color: isDark ? "#F472B6" : "#BE185D", fontFamily: "Inter_400Regular" }]}>
                  10 J/kg (max 360)
                </Text>
              </View>
            </View>
          </View>
        </View>
          {/* APGAR Score */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <Text style={[styles.calcSectionTitle, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_600SemiBold", marginBottom: 10 }]}>APGAR Score (1 & 5 min)</Text>
            <View style={styles.ettGrid}>
              {[{ l: "Appearance", s: setApgarA, v: apgarA }, { l: "Pulse", s: setApgarP, v: apgarP }, { l: "Grimace", s: setApgarG, v: apgarG }, { l: "Activity", s: setApgarAc, v: apgarAc }, { l: "Respiration", s: setApgarR, v: apgarR }].map((x) => (
                <View key={x.l} style={[styles.ettBox, { backgroundColor: isDark ? "#112240" : "#F0F4F8", borderColor: isDark ? "#233554" : "#E2E8F0" }]}>
                  <Text style={[styles.ettLabel, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_500Medium" }]}>{x.l}</Text>
                  <TextInput style={[styles.ageInput, { color: isDark ? "#FFFFFF" : "#0D1B2A", backgroundColor: isDark ? "#0A192F" : "#FFFFFF", fontFamily: "Inter_700Bold", borderWidth: 1, borderColor: isDark ? "#233554" : "#E2E8F0" }]} value={x.v} onChangeText={x.s} keyboardType="decimal-pad" maxLength={1} placeholder="0" placeholderTextColor={isDark ? "#8892B0" : "#8A9BB0"} />
                </View>
              ))}
            </View>
            <View style={[styles.resultBox, { backgroundColor: apgarTotal >= 7 ? "#16A34A15" : apgarTotal >= 4 ? "#F59E0B15" : "#FEE2E2", borderColor: apgarTotal >= 7 ? "#16A34A40" : apgarTotal >= 4 ? "#F59E0B40" : "#FCA5A5", marginTop: 10 }]}>
              <Text style={[styles.resultLabel, { color: apgarTotal >= 7 ? "#16A34A" : apgarTotal >= 4 ? "#F59E0B" : "#DC2626" }]}>APGAR = {apgarTotal} / 10</Text>
              <Text style={[styles.resultNote, { color: apgarTotal >= 7 ? "#16A34A" : apgarTotal >= 4 ? "#F59E0B" : "#DC2626", fontWeight: "700" }]}>
                {apgarTotal >= 7 ? "Normal" : apgarTotal >= 4 ? "Moderately depressed" : "Severely depressed"}
              </Text>
              <Text style={[styles.refText, { color: isDark ? "#8892B0" : "#64748B", marginTop: 4 }]}>
                {apgarTotal < 7 ? "If HR < 100: PPV. If HR < 60: CPR + Epi" : ""}
              </Text>
            </View>
          </View>

          {/* Parkland Burns (Emergency) */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <Text style={[styles.calcSectionTitle, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_600SemiBold", marginBottom: 10 }]}>Parkland Burns (Emergency Resuscitation)</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputWrap, { flex: 1, marginRight: 6 }]}>
                <Text style={[styles.inputLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>Weight (kg)</Text>
                <TextInput style={[styles.input, { color: isDark ? "#FFFFFF" : "#0D1B2A", backgroundColor: isDark ? "#0A192F" : "#FFFFFF", borderColor: isDark ? "#233554" : "#E2E8F0" }]} value={emBurnWt} onChangeText={setEmBurnWt} keyboardType="decimal-pad" placeholder="e.g. 20" placeholderTextColor={isDark ? "#8892B0" : "#8A9BB0"} />
              </View>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: isDark ? "#8892B0" : "#64748B" }]}>% TBSA</Text>
                <TextInput style={[styles.input, { color: isDark ? "#FFFFFF" : "#0D1B2A", backgroundColor: isDark ? "#0A192F" : "#FFFFFF", borderColor: isDark ? "#233554" : "#E2E8F0" }]} value={emBurnBsa} onChangeText={setEmBurnBsa} keyboardType="decimal-pad" placeholder="e.g. 30" placeholderTextColor={isDark ? "#8892B0" : "#8A9BB0"} />
              </View>
            </View>
            {emBurnTotal > 0 && (
              <View style={[styles.resultBox, { backgroundColor: "#B4530915", borderColor: "#B4530940", marginTop: 10 }]}>
                <Text style={[styles.resultLabel, { color: "#B45309" }]}>Total: {emBurnTotal} mL RL</Text>
                <Text style={[styles.resultNote, { color: "#B45309" }]}>1st 8hrs: {emBurnFirst8} mL · Next 16hrs: {emBurnNext16} mL</Text>
                <Text style={[styles.refText, { color: isDark ? "#8892B0" : "#64748B" }]}>Parkland: 3 × wt × %TBSA. Add maintenance in children.</Text>
              </View>
            )}
          </View>

          {/* Hs & Ts — Reversible Causes */}
          <View style={[styles.calcSection, { borderTopColor: isDark ? "#233554" : "#F0F4F8" }]}>
            <TouchableOpacity
              onPress={() => setHsTsOpen(!hsTsOpen)}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}
              activeOpacity={0.7}
            >
              <Text style={[styles.calcSectionTitle, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_600SemiBold" }]}>
                Reversible Causes (Hs & Ts)
              </Text>
              <Feather name={hsTsOpen ? "chevron-up" : "chevron-down"} size={18} color={isDark ? "#8892B0" : "#64748B"} />
            </TouchableOpacity>
            {hsTsOpen && (
              <View style={{ marginTop: 10, gap: 10 }}>
                {/* Hs */}
                <View style={[styles.htBlock, { backgroundColor: isDark ? "#112240" : "#F0F4F8", borderColor: isDark ? "#233554" : "#E2E8F0" }]}>
                  <Text style={[styles.htTitle, { color: isDark ? "#93C5FD" : "#1E40AF" }]}>Hs — Hypo / Hypo</Text>
                  {Hs.map((h, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isDark ? "#93C5FD" : "#1E40AF" }} />
                      <Text style={[styles.htItem, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>{h}</Text>
                    </View>
                  ))}
                </View>
                {/* Ts */}
                <View style={[styles.htBlock, { backgroundColor: isDark ? "#112240" : "#F0F4F8", borderColor: isDark ? "#233554" : "#E2E8F0" }]}>
                  <Text style={[styles.htTitle, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>Ts — Tension / Toxins</Text>
                  {Ts.map((t, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isDark ? "#FCA5A5" : "#991B1B" }} />
                      <Text style={[styles.htItem, { color: isDark ? "#CCD6F6" : "#0D1B2A" }]}>{t}</Text>
                    </View>
                  ))}
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
  scrollContent: { padding: 12, gap: 10 },
  emergencyCard: {
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitleRow: { flex: 1, gap: 4 },
  badgeRow: { flexDirection: "row", gap: 4, flexWrap: "wrap" },
  criticalBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  criticalText: { fontSize: 9, letterSpacing: 0.5 },
  inBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B0022",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inBadgeText: { fontSize: 9, color: "#6366F1", letterSpacing: 0.5 },
  cardLabel: { fontSize: 14, flex: 1 },
  routeTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  routeTagText: { fontSize: 11 },
  cardDose: { fontSize: 32, letterSpacing: -0.5 },
  cardDoseUnit: { fontSize: 20 },
  adultMaxAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#B91C1C",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  adultMaxAlertText: {
    fontSize: 11,
    color: "#FFFFFF",
    flex: 1,
    letterSpacing: 0.1,
  },
  cardNotes: { fontSize: 12, lineHeight: 16 },
  palsBanner: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  palsTitle: { fontSize: 16, marginBottom: 12 },
  calcSource: { fontSize: 11, marginBottom: 12, marginTop: -8, letterSpacing: 0.3 },
  calcSection: {
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
  calcSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calcSectionTitle: { fontSize: 13, letterSpacing: 0.3 },
  ageInputWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  ageLabel: { fontSize: 13 },
  ageInput: {
    width: 52,
    height: 32,
    borderRadius: 8,
    paddingHorizontal: 6,
    fontSize: 16,
    textAlign: "center",
  },
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

  defibGrid: { flexDirection: "row", gap: 8 },
  defibBox: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    gap: 2,
  },
  defibLabel: { fontSize: 10 },
  defibJoules: { fontSize: 18 },
  defibFormula: { fontSize: 9, textAlign: "center" },

  inputRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  inputWrap: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  resultBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 6, marginTop: 4 },
  resultLabel: { fontSize: 13, fontWeight: "700" },
  resultNote: { fontSize: 12, fontWeight: "700" },
  refRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  refLabel: { fontSize: 13, flex: 1 },
  refValue: { fontSize: 14, textAlign: "right", flex: 1 },
  refText: { fontSize: 11, lineHeight: 16 },
  // Airway equipment row
  airwayRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  airwayBadge: {
    flex: 1, borderRadius: 8, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 4, alignItems: "center",
  },
  airwayBadgeLabel: { fontSize: 10, fontWeight: "600", marginBottom: 2 },
  airwayBadgeValue: { fontSize: 13, fontWeight: "700" },
  // Hs & Ts blocks
  htBlock: { borderRadius: 10, borderWidth: 1, padding: 10 },
  htTitle: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  htItem: { fontSize: 12, lineHeight: 16 },
});
