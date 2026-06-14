import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
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
import { CATEGORIES, DRUGS, DrugCategory, calculateDose } from "@/constants/drugs";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, useWeight } from "@/context/WeightContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";
import { StarButton } from "@/components/StarButton";

const QUICK_WEIGHTS = [0.5, 1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 70, 100, 150];
const LBS_TO_KG = 0.453592;

// ── ET Tube & Defibrillation formulas (Harriet Lane 23e · PALS 2025) ──────
function calcETTube(ageYears: number) {
  if (ageYears < 1) {
    return { uncuffed: "3.0–3.5", cuffed: "3.0 (premature–3.0)", depth: "9–10 cm at lip" };
  }
  const uncuffed = +(ageYears / 4 + 4).toFixed(1);
  const cuffed   = +(ageYears / 4 + 3.5).toFixed(1);
  const depth    = +(ageYears / 2 + 12).toFixed(1);
  return {
    uncuffed: `${uncuffed} mm`,
    cuffed:   `${cuffed} mm`,
    depth:    `${depth} cm at lip`,
  };
}

function calcDefib(weightKg: number) {
  const initial    = Math.min(+(2 * weightKg).toFixed(0), 200);
  const subsequent = Math.min(+(4 * weightKg).toFixed(0), 360);
  const maximum    = Math.min(+(10 * weightKg).toFixed(0), 360);
  return { initial, subsequent, maximum };
}

function isIntranasalRoute(route: string): boolean {
  const r = route.toLowerCase();
  return r.includes("intranasal") || r.includes("/ in") || r.startsWith("in ") || r === "in";
}

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const colors = Colors.light;
  const { weight, setWeight, weightInput, setWeightInput, resetWeight } = useWeight();
  const { isFav, toggleFav } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState<DrugCategory | null>(null);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [lbsInput, setLbsInput] = useState("");
  const [weightWarning, setWeightWarning] = useState(false);
  const [ageYearsInput, setAgeYearsInput] = useState("2");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const ageYears = Math.max(0, parseFloat(ageYearsInput) || 0);
  const ettube   = calcETTube(ageYears);
  const defib    = calcDefib(weight);

  function handleWeightChange(text: string) {
    if (weightUnit === "kg") {
      setWeightInput(text);
      const num = parseFloat(text);
      if (!isNaN(num) && num > 0) {
        if (num > MAX_WEIGHT_KG) {
          setWeight(MAX_WEIGHT_KG);
          setWeightWarning(true);
        } else if (num < MIN_WEIGHT_KG) {
          setWeightWarning(true);
        } else {
          setWeight(num);
          setWeightWarning(false);
        }
      } else {
        setWeightWarning(false);
      }
    } else {
      setLbsInput(text);
      const lbs = parseFloat(text);
      if (!isNaN(lbs) && lbs > 0) {
        const kg = +(lbs * LBS_TO_KG).toFixed(1);
        const clamped = Math.min(Math.max(kg, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
        setWeight(clamped);
        setWeightInput(clamped.toString());
        setWeightWarning(kg > MAX_WEIGHT_KG || kg < MIN_WEIGHT_KG);
      }
    }
  }

  function handleUnitToggle(unit: "kg" | "lbs") {
    setWeightUnit(unit);
    setWeightWarning(false);
    if (unit === "lbs" && weight > 0) {
      setLbsInput((+(weight / LBS_TO_KG).toFixed(1)).toString());
    }
  }

  function handleReset() {
    resetWeight();
    setWeightWarning(false);
    if (weightUnit === "lbs") setLbsInput("");
  }

  const displayInput = weightUnit === "kg" ? weightInput : lbsInput;

  const drugsToShow = useMemo(() => {
    if (!selectedCategory) return DRUGS;
    return DRUGS.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const categories = Object.entries(CATEGORIES) as [DrugCategory, typeof CATEGORIES[DrugCategory]][];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0B132B" : "#F0F4F8" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_700Bold" },
              ]}
              numberOfLines={1}
            >
              Dose Calculator
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" },
              ]}
            >
              Weight-based dosing for all ages
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleDark}
            style={[
              styles.nightToggle,
              { backgroundColor: isDark ? "#233554" : "#F0F4F8" },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name={isDark ? "sun" : "moon"}
              size={18}
              color={isDark ? "#FFD700" : "#4A5568"}
            />
            <Text
              style={[
                styles.nightToggleText,
                { color: isDark ? "#FFD700" : "#4A5568", fontFamily: "Inter_500Medium" },
              ]}
            >
              {isDark ? "Day" : "Night"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weight Section */}
        <View
          style={[
            styles.weightSection,
            { backgroundColor: isDark ? "#233554" : "#F8FAFC" },
          ]}
        >
          {/* Unit toggle */}
          <View style={styles.unitToggleRow}>
            <Feather name="user" size={16} color={colors.tint} />
            <Text
              style={[
                styles.weightLabel,
                { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_500Medium" },
              ]}
            >
              Patient Weight
            </Text>
            <View style={[styles.unitToggleWrap, { backgroundColor: isDark ? "#0A192F" : "#E8EDF2" }]}>
              {(["kg", "lbs"] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => handleUnitToggle(u)}
                  style={[
                    styles.unitToggleBtn,
                    weightUnit === u && { backgroundColor: colors.tint },
                  ]}
                >
                  <Text
                    style={[
                      styles.unitToggleBtnText,
                      {
                        color: weightUnit === u ? "#fff" : isDark ? "#8892B0" : "#4A5568",
                        fontFamily: "Inter_600SemiBold",
                      },
                    ]}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.weightInputRow}>
            <View style={styles.weightInputContainer}>
              <TextInput
                style={[
                  styles.weightInput,
                  {
                    color: weightWarning ? "#E53E3E" : isDark ? "#FFFFFF" : "#0D1B2A",
                    backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
                    fontFamily: "Inter_700Bold",
                    borderColor: weightWarning ? "#E53E3E" : "transparent",
                    borderWidth: weightWarning ? 2 : 0,
                  },
                ]}
                value={displayInput}
                onChangeText={handleWeightChange}
                keyboardType="decimal-pad"
                selectTextOnFocus
                maxLength={6}
              />
              <Text
                style={[
                  styles.kgLabel,
                  { color: colors.tint, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {weightUnit}
              </Text>
            </View>

            {/* Reset button */}
            <TouchableOpacity
              onPress={handleReset}
              style={[styles.resetBtn, { backgroundColor: isDark ? "#0A192F" : "#E2E8F0" }]}
              activeOpacity={0.7}
            >
              <Feather name="rotate-ccw" size={14} color={isDark ? "#8892B0" : "#4A5568"} />
              <Text style={[styles.resetText, { color: isDark ? "#8892B0" : "#4A5568", fontFamily: "Inter_500Medium" }]}>
                Reset
              </Text>
            </TouchableOpacity>

            {weightUnit === "lbs" && weight > 0 && (
              <View style={[styles.kgConvBadge, { backgroundColor: colors.tint + "18", borderColor: colors.tint + "40" }]}>
                <Feather name="refresh-cw" size={11} color={colors.tint} />
                <Text style={[styles.kgConvText, { color: colors.tint, fontFamily: "Inter_700Bold" }]}>
                  {weight} kg
                </Text>
              </View>
            )}
          </View>

          {weightWarning && (
            <Text style={styles.weightWarning}>
              ⚠ Weight range: {MIN_WEIGHT_KG}–{MAX_WEIGHT_KG} kg — dose capped
            </Text>
          )}

          {/* Quick Weight Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickWeightList}
          >
            {QUICK_WEIGHTS.map((w) => (
              <Pressable
                key={w}
                onPress={() => {
                  setWeight(w);
                  setWeightInput(w.toString());
                  setWeightWarning(false);
                  if (weightUnit === "lbs") {
                    setLbsInput((+(w / LBS_TO_KG).toFixed(1)).toString());
                  }
                }}
                style={[
                  styles.quickWeightBtn,
                  {
                    backgroundColor:
                      weight === w
                        ? colors.tint
                        : isDark
                        ? "#0D1B2A"
                        : "#FFFFFF",
                    borderColor: weight === w ? colors.tint : isDark ? "#233554" : "#E2E8F0",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quickWeightText,
                    {
                      color: weight === w ? "#FFFFFF" : isDark ? "#8892B0" : "#4A5568",
                      fontFamily: weight === w ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {w}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={[
              styles.catChip,
              {
                backgroundColor: selectedCategory === null ? colors.tint : isDark ? "#233554" : "#F0F4F8",
              },
            ]}
          >
            <Text
              style={[
                styles.catChipText,
                {
                  color: selectedCategory === null ? "#fff" : isDark ? "#8892B0" : "#4A5568",
                  fontFamily: "Inter_500Medium",
                },
              ]}
            >
              All
            </Text>
          </Pressable>
          {categories.map(([key, val]) => (
            <Pressable
              key={key}
              onPress={() => setSelectedCategory(key)}
              style={[
                styles.catChip,
                {
                  backgroundColor:
                    selectedCategory === key ? val.color : isDark ? "#233554" : "#F0F4F8",
                },
              ]}
            >
              <Text
                style={[
                  styles.catChipText,
                  {
                    color: selectedCategory === key ? "#fff" : isDark ? "#8892B0" : "#4A5568",
                    fontFamily: "Inter_500Medium",
                  },
                ]}
              >
                {val.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 84 : 90) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Emergency Calculators ── */}
        <View style={[styles.emergencyCalcCard, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
          <View style={styles.emergencyCalcHeader}>
            <Feather name="zap" size={16} color="#E53E3E" />
            <Text style={[styles.emergencyCalcTitle, { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_700Bold" }]}>
              Emergency Calculators
            </Text>
            <Text style={[styles.emergencyCalcSub, { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
              PALS 2025 · Harriet Lane 23e
            </Text>
          </View>

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

        {/* Drug list */}
        {drugsToShow.map((drug) => {
          const cat = CATEGORIES[drug.category];
          return (
            <View
              key={drug.id}
              style={[
                styles.drugBlock,
                { backgroundColor: isDark ? "#112240" : "#FFFFFF" },
              ]}
            >
              <View style={styles.drugBlockHeader}>
                <View style={[styles.catStripe, { backgroundColor: cat.color }]} />
                <View style={{ flex: 1 }}>
                  <View style={styles.drugNameRow}>
                    <Text
                      style={[
                        styles.drugBlockName,
                        { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_600SemiBold" },
                      ]}
                    >
                      {drug.name}
                    </Text>
                    {drug.highAlert && (
                      <View style={styles.highAlertBadge}>
                        <Text style={styles.highAlertText}>⚠ HIGH ALERT</Text>
                      </View>
                    )}
                  </View>
                  {drug.genericName ? (
                    <Text
                      style={[
                        styles.drugBlockGeneric,
                        { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" },
                      ]}
                    >
                      {drug.genericName}
                    </Text>
                  ) : null}
                </View>
                <View style={[styles.catTag, { backgroundColor: cat.color + "22" }]}>
                  <Text style={[styles.catTagText, { color: cat.color, fontFamily: "Inter_500Medium" }]}>
                    {cat.label}
                  </Text>
                </View>
                <StarButton
                  isFav={isFav(drug.id)}
                  onToggle={() =>
                    toggleFav({
                      id: drug.id,
                      type: "drug",
                      label: drug.name,
                      color: cat.color,
                      category: cat.label,
                    })
                  }
                  size={18}
                  color={cat.color}
                />
              </View>

              {drug.doses.map((dose, i) => {
                const calc = calculateDose(dose, weight);
                const isIN = isIntranasalRoute(dose.route);
                return (
                  <View
                    key={i}
                    style={[
                      styles.doseRow,
                      {
                        borderTopColor: isDark ? "#233554" : "#F0F4F8",
                        borderTopWidth: i === 0 ? 0 : 1,
                      },
                    ]}
                  >
                    <View style={styles.doseLeft}>
                      <View
                        style={[
                          styles.routeBadge,
                          isIN
                            ? { backgroundColor: "#FF6B0022" }
                            : { backgroundColor: isDark ? "#233554" : "#F0F4F8" },
                        ]}
                      >
                        {isIN && (
                          <Text style={[styles.inPill, { fontFamily: "Inter_700Bold" }]}>IN</Text>
                        )}
                        <Text
                          style={[
                            styles.routeText,
                            {
                              color: isIN ? "#D4500A" : colors.tint,
                              fontFamily: "Inter_600SemiBold",
                            },
                          ]}
                        >
                          {dose.route}
                        </Text>
                      </View>
                      {dose.frequency ? (
                        <Text
                          style={[
                            styles.freqText,
                            { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" },
                          ]}
                        >
                          {dose.frequency}
                        </Text>
                      ) : null}
                      {dose.notes ? (
                        <Text
                          style={[
                            styles.noteText,
                            { color: isDark ? "#8892B0" : "#94A8C0", fontFamily: "Inter_400Regular" },
                          ]}
                          numberOfLines={2}
                        >
                          {dose.notes}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.doseRight}>
                      <Text
                        style={[
                          styles.calcDose,
                          { color: colors.tint, fontFamily: "Inter_700Bold" },
                        ]}
                        numberOfLines={2}
                        adjustsFontSizeToFit
                      >
                        {calc.dose}
                      </Text>
                      <Text
                        style={[
                          styles.doseRange,
                          { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" },
                        ]}
                        numberOfLines={1}
                      >
                        {calc.range}
                      </Text>
                      {calc.exceedsAdultMax && (
                        <View style={styles.adultMaxAlert}>
                          <Feather name="alert-triangle" size={10} color="#B91C1C" />
                          <Text style={[styles.adultMaxAlertText, { fontFamily: "Inter_700Bold" }]}>
                            {calc.adultMaxLabel}
                          </Text>
                        </View>
                      )}
                      {!calc.exceedsAdultMax && dose.maxDose ? (
                        <Text
                          style={[
                            styles.maxDose,
                            { color: colors.danger, fontFamily: "Inter_500Medium" },
                          ]}
                          numberOfLines={1}
                        >
                          Max: {dose.maxDose}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
        <ProfessionalFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 10,
  },
  headerTitle: { fontSize: 24, letterSpacing: -0.5, marginBottom: 2 },
  headerSubtitle: { fontSize: 13 },
  nightToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
    flexShrink: 0,
  },
  nightToggleText: { fontSize: 13 },
  weightSection: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  unitToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  weightLabel: { flex: 1, fontSize: 15 },
  unitToggleWrap: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  unitToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  unitToggleBtnText: { fontSize: 13 },
  weightInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  weightInputContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  weightInput: {
    width: 96,
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 8,
    fontSize: 22,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  kgLabel: { fontSize: 16 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  resetText: { fontSize: 13 },
  weightWarning: {
    fontSize: 11,
    color: "#E53E3E",
    fontWeight: "700",
    marginBottom: 8,
  },
  kgConvBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  kgConvText: { fontSize: 16 },
  quickWeightList: { gap: 6 },
  quickWeightBtn: {
    width: 44,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  quickWeightText: { fontSize: 13 },
  catList: { gap: 6, paddingBottom: 10 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  catChipText: { fontSize: 12 },
  scrollContent: { padding: 12, gap: 10 },

  // Emergency Calculators card
  emergencyCalcCard: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  emergencyCalcHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    paddingBottom: 10,
  },
  emergencyCalcTitle: { fontSize: 15, flex: 1 },
  emergencyCalcSub: { fontSize: 11 },
  calcSection: {
    borderTopWidth: 1,
    padding: 14,
  },
  calcSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
  },
  ettLabel: { fontSize: 10, color: "#475569" },
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

  // Drug blocks
  drugBlock: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  drugBlockHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  catStripe: { width: 4, height: 40, borderRadius: 2, flexShrink: 0 },
  drugNameRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  drugBlockName: { fontSize: 15 },
  highAlertBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  highAlertText: {
    fontSize: 9,
    color: "#92400E",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  drugBlockGeneric: { fontSize: 12, marginTop: 1 },
  catTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  catTagText: { fontSize: 10 },
  doseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    paddingTop: 10,
    gap: 8,
  },
  doseLeft: { flex: 1, gap: 4 },
  routeBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  inPill: {
    fontSize: 9,
    color: "#D4500A",
    backgroundColor: "#FF6B0033",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    letterSpacing: 0.3,
  },
  routeText: { fontSize: 11 },
  freqText: { fontSize: 11 },
  noteText: { fontSize: 11, lineHeight: 16 },
  doseRight: { alignItems: "flex-end", maxWidth: 160, gap: 2 },
  calcDose: { fontSize: 16, textAlign: "right" },
  doseRange: { fontSize: 11, textAlign: "right" },
  maxDose: { fontSize: 11, textAlign: "right" },
  adultMaxAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 2,
  },
  adultMaxAlertText: {
    fontSize: 9,
    color: "#B91C1C",
    letterSpacing: 0.1,
  },
});
