import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useWeight } from "@/context/WeightContext";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { StarButton } from "@/components/StarButton";
import {
  INFUSION_DRUGS,
  InfusionDrug,
  InfusionUnit,
  RecipeResult,
  calculateInfusionRate,
  formatRate,
  ruleOf6Concentration,
  computeRecipe,
} from "@/constants/infusions";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";
import Colors from "@/constants/colors";

const C = Colors.light;

const SYRINGE_SIZES = [10, 20, 30, 40, 50] as const;
type SyringeSize = typeof SYRINGE_SIZES[number];

const INFUSION_CATS = [
  { key: "all",        label: "All",         color: "#0EA5E9", match: [] as string[] },
  { key: "inotrope",  label: "Inotropes",    color: "#7C3AED", match: ["Inotrope", "Vasopressor", "Inodilator"] },
  { key: "sedation",  label: "Sedation",     color: "#805AD5", match: ["Sedative", "Opioid", "Analgosedative", "Analgesic"] },
  { key: "resp",      label: "Respiratory",  color: "#38A169", match: ["Bronchodilator", "Respiratory"] },
  { key: "cardiac",   label: "Cardiac",      color: "#DD6B20", match: ["Antiarrhythmic", "Vasodilator", "Antihypertensive", "Diuretic"] },
  { key: "nmbd",      label: "NMBDs",        color: "#D69E2E", match: ["NMBD"] },
  { key: "other",     label: "Other",        color: "#718096", match: ["Anticoagulant", "Hormone", "Electrolyte", "Antiepileptic"] },
] as const;
type InfusionCatKey = typeof INFUSION_CATS[number]["key"];

const DOSE_UNITS: InfusionUnit[] = [
  "mcg/kg/min",
  "mcg/kg/hr",
  "mg/kg/hr",
  "units/kg/hr",
  "mcg/min",
  "mg/hr",
];

const VOLUME_PRESETS = [
  { label: "10 mL", sublabel: "Small", value: "10" },
  { label: "20 mL", sublabel: "Medium", value: "20" },
  { label: "50 mL", sublabel: "Standard", value: "50" },
  { label: "100 mL", sublabel: "Large", value: "100" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DRUG SEARCH ITEM
// ─────────────────────────────────────────────────────────────────────────────
function DrugSearchItem({
  drug,
  selected,
  onSelect,
  textColor,
  borderColor,
}: {
  drug: InfusionDrug;
  selected: boolean;
  onSelect: (d: InfusionDrug) => void;
  textColor: string;
  borderColor: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.drugSearchItem,
        { borderBottomColor: borderColor },
        selected && {
          backgroundColor: drug.color + "18",
          borderLeftWidth: 3,
          borderLeftColor: drug.color,
        },
      ]}
      onPress={() => onSelect(drug)}
      activeOpacity={0.7}
    >
      <View style={[styles.drugDot, { backgroundColor: drug.color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.drugSearchName, { color: selected ? drug.color : textColor }]}>
          {drug.name}
        </Text>
        <Text style={[styles.drugSearchCategory, { color: C.textMuted }]}>{drug.category}</Text>
      </View>
      {selected && <Feather name="check-circle" size={18} color={drug.color} />}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECIPE CARD — Universal preparation display
// ─────────────────────────────────────────────────────────────────────────────
function RecipeCard({
  recipe,
  drug,
  diluent,
  vialLabel,
  isDark,
}: {
  recipe: RecipeResult;
  drug: InfusionDrug;
  diluent: string;
  vialLabel: string;
  isDark: boolean;
}) {
  const CARD_BG = isDark ? "#0B132B" : "#FFFFFF";
  const MUTED = isDark ? "#8892B0" : C.textMuted;
  const SEC = isDark ? "#8892B0" : C.textSecondary;
  const TEXT = isDark ? "#CCD6F6" : C.text;
  const BORDER = isDark ? "#233554" : C.border;

  const drugMLStr =
    recipe.drugML < 0.1
      ? recipe.drugML.toFixed(3)
      : recipe.drugML < 10
        ? recipe.drugML.toFixed(2)
        : recipe.drugML.toFixed(1);
  const diluentMLStr =
    recipe.diluentML < 1
      ? recipe.diluentML.toFixed(2)
      : recipe.diluentML.toFixed(1);

  return (
    <View
      style={[
        styles.recipeCard,
        {
          borderColor: drug.color,
          backgroundColor: drug.color + "0A",
        },
      ]}
    >
      {/* Header */}
      <View style={styles.recipeHeader}>
        <Feather name="clipboard" size={14} color={drug.color} />
        <Text style={[styles.recipeTitle, { color: drug.color }]}>
          Preparation — {recipe.syringeML} mL Syringe
        </Text>
      </View>

      {/* Ingredients row */}
      <View style={styles.recipeIngredients}>
        {/* Drug from vial */}
        <View style={[styles.recipeItem, { backgroundColor: drug.color + "15", borderColor: drug.color + "40" }]}>
          <Feather name="droplet" size={11} color={drug.color} />
          <Text style={[styles.recipeItemLabel, { color: drug.color }]}>{drug.name}</Text>
          <Text style={[styles.recipeItemSub, { color: SEC }]}>({vialLabel})</Text>
          <Text style={[styles.recipeItemValue, { color: drug.color }]}>{drugMLStr} mL</Text>
          <Text style={[styles.recipeItemAmt, { color: MUTED }]}>{recipe.totalAmountStr}</Text>
        </View>

        <View style={styles.recipePlusCol}>
          <Text style={[styles.recipePlus, { color: MUTED }]}>+</Text>
        </View>

        {/* Diluent */}
        <View style={[styles.recipeItem, { backgroundColor: "#2563EB18", borderColor: "#2563EB40" }]}>
          <Feather name="droplet" size={11} color="#2563EB" />
          <Text style={[styles.recipeItemLabel, { color: "#2563EB" }]}>{diluent}</Text>
          <Text style={[styles.recipeItemSub, { color: SEC }]}>(diluent)</Text>
          <Text style={[styles.recipeItemValue, { color: "#2563EB" }]}>{diluentMLStr} mL</Text>
          <Text style={[styles.recipeItemAmt, { color: MUTED }]}>to fill</Text>
        </View>

        <View style={styles.recipePlusCol}>
          <Text style={[styles.recipePlus, { color: MUTED }]}>=</Text>
        </View>

        {/* Total */}
        <View style={[styles.recipeItem, { backgroundColor: isDark ? "#0A192F" : "#F8FAFD", borderColor: BORDER }]}>
          <Feather name="circle" size={11} color={SEC} />
          <Text style={[styles.recipeItemLabel, { color: TEXT }]}>Total</Text>
          <Text style={[styles.recipeItemSub, { color: MUTED }]}>(syringe)</Text>
          <Text style={[styles.recipeItemValue, { color: TEXT }]}>{recipe.syringeML} mL</Text>
          <Text style={[styles.recipeItemAmt, { color: MUTED }]}>ready</Text>
        </View>
      </View>

      {/* Final concentration bar */}
      <View style={[styles.recipeConcBar, { borderTopColor: drug.color + "30" }]}>
        <View style={styles.recipeConcLeft}>
          <Feather name="layers" size={12} color={drug.color} />
          <Text style={[styles.recipeConcLabel, { color: SEC }]}>Final Concentration</Text>
        </View>
        <Text style={[styles.recipeConcValue, { color: drug.color }]}>
          {recipe.finalConcStr}
        </Text>
      </View>

      {/* Warning for very small volumes */}
      {recipe.tooSmall && (
        <View style={styles.recipeWarnRow}>
          <Feather name="alert-triangle" size={11} color="#B7791F" />
          <Text style={styles.recipeWarnText}>
            Drug volume is very small ({drugMLStr} mL) — use a tuberculin syringe for precision
          </Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
type ConcMode = "standard" | "dilution";

export default function InfusionScreen() {
  const { weightInput: weight, setWeightInput: setWeight } = useWeight();
  const { isDark, toggleDark } = useTheme();
  const { isFav, toggleFav } = useFavorites();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [catFilter, setCatFilter] = useState<InfusionCatKey>("all");
  const [selectedDrug, setSelectedDrug] = useState<InfusionDrug | null>(null);
  const [selectedConcIdx, setSelectedConcIdx] = useState(0);
  const [doseInput, setDoseInput] = useState("");
  const [doseUnit, setDoseUnit] = useState<InfusionUnit>("mcg/kg/min");
  const [concMode, setConcMode] = useState<ConcMode>("standard");
  const [dilutionDrug_mg, setDilutionDrug_mg] = useState("");
  const [dilutionVol_mL, setDilutionVol_mL] = useState("50");
  const [syringeML, setSyringeML] = useState<SyringeSize>(50);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Theme tokens ──
  const BG   = isDark ? "#0B132B" : C.background;
  const CARD = isDark ? "#112240" : C.card;
  const BORDER = isDark ? "#233554" : C.border;
  const TEXT = isDark ? "#FFFFFF" : C.text;
  const MUTED = isDark ? "#8892B0" : C.textMuted;
  const SEC  = isDark ? "#CCD6F6" : C.textSecondary;

  const weightNum = parseFloat(weight) || 0;
  const doseNum = parseFloat(doseInput) || 0;

  const filteredDrugs = useMemo(() => {
    const catDef = INFUSION_CATS.find((c) => c.key === catFilter);
    return INFUSION_DRUGS.filter((d) => {
      const matchCat =
        catFilter === "all" ||
        (catDef && catDef.match.length > 0 && catDef.match.some((m) => d.category.includes(m)));
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase()) ||
        d.indication.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, catFilter]);

  const handleDrugSelect = useCallback(
    (drug: InfusionDrug) => {
      setSelectedDrug(drug);
      setShowSearch(false);
      setSearch("");
      setSelectedConcIdx(0);
      setDoseInput(String(drug.typicalDose ?? drug.minDose));
      setDoseUnit(drug.primaryUnit);
      setConcMode("standard");
      setDilutionDrug_mg("");
      setDilutionVol_mL("50");
      setSyringeML(50);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  // ── Concentration (mg/mL or units/mL) ──
  const concentration = useMemo((): number => {
    if (!selectedDrug) return 0;
    if (concMode === "dilution") {
      const mg = parseFloat(dilutionDrug_mg);
      const mL = parseFloat(dilutionVol_mL);
      if (mg > 0 && mL > 0) return mg / mL;
      return 0;
    }
    const c = selectedDrug.standardConcentrations[selectedConcIdx];
    if (!c) return 0;
    if (c.totalDrug_mg === -1) {
      const multiplier = parseFloat(c.label.split(" ")[0]) || 0;
      return ruleOf6Concentration(multiplier, weightNum, c.totalVolume_mL);
    }
    return c.concentration_per_mL;
  }, [concMode, dilutionDrug_mg, dilutionVol_mL, selectedDrug, selectedConcIdx, weightNum]);

  const rateMLhr = useMemo(() => {
    if (!doseNum || !weightNum || !concentration) return 0;
    return calculateInfusionRate(doseNum, doseUnit, weightNum, concentration);
  }, [doseNum, doseUnit, weightNum, concentration]);

  // ── Universal recipe card ──
  const recipe = useMemo((): RecipeResult | null => {
    if (!selectedDrug || concMode !== "standard") return null;
    return computeRecipe(selectedDrug, selectedConcIdx, weightNum, syringeML);
  }, [selectedDrug, selectedConcIdx, weightNum, syringeML, concMode]);

  const dilutionConc = useMemo(() => {
    const mg = parseFloat(dilutionDrug_mg);
    const mL = parseFloat(dilutionVol_mL);
    if (mg > 0 && mL > 0) return mg / mL;
    return 0;
  }, [dilutionDrug_mg, dilutionVol_mL]);

  const rateStr = formatRate(rateMLhr);
  const rateValid = rateMLhr > 0 && isFinite(rateMLhr);

  const unitOptions = selectedDrug
    ? [selectedDrug.primaryUnit, ...(selectedDrug.alternateUnits ?? [])].filter(
        (u, i, a) => a.indexOf(u) === i
      )
    : DOSE_UNITS;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: BG }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* ══ HEADER ══ */}
        <View style={[styles.header, { backgroundColor: CARD, borderBottomColor: BORDER }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: TEXT }]} numberOfLines={1}>
              MKashanEdu
            </Text>
            <Text style={[styles.headerSubtitle, { color: MUTED }]} numberOfLines={1}>
              Pediatric Clinical Guide • Based on Harriet Lane & Nelson's • 95+ drugs
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.nightBtn, { backgroundColor: isDark ? "#0A192F" : "#E8F4F9" }]}
              onPress={toggleDark}
              activeOpacity={0.8}
            >
              <Feather name={isDark ? "sun" : "moon"} size={15} color={isDark ? "#F6E05E" : C.tint} />
            </TouchableOpacity>
            <View style={styles.weightBadge}>
              <Text style={[styles.weightLabel, { color: C.tint }]}>WT (KG)</Text>
              <TextInput
                style={[styles.weightInput, { color: C.tint, borderColor: C.tint, backgroundColor: C.tint + "10" }]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="—"
                placeholderTextColor={C.textMuted}
                selectTextOnFocus
              />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══════════════════════════════════════
              STEP 1 — SELECT DRUG
          ══════════════════════════════════════ */}
          <View style={[styles.section, { backgroundColor: CARD, borderColor: BORDER }]}>
            <View style={styles.stepRow}>
              <View style={[styles.stepBadge, selectedDrug ? { backgroundColor: selectedDrug.color } : { backgroundColor: C.tint }]}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={[styles.stepLabel, { color: TEXT }]}>Select Drug</Text>
              {selectedDrug && (
                <StarButton
                  isFav={isFav(selectedDrug.id)}
                  onToggle={() =>
                    toggleFav({
                      id: selectedDrug.id,
                      type: "infusion",
                      label: selectedDrug.name,
                      color: selectedDrug.color,
                    })
                  }
                  size={18}
                  color={selectedDrug.color}
                />
              )}
              <Text style={[styles.stepHint, { color: MUTED }]}>{filteredDrugs.length} available</Text>
            </View>

            {/* Category filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catChipList}
            >
              {INFUSION_CATS.map((cat) => {
                const isActive = catFilter === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => {
                      setCatFilter(cat.key as InfusionCatKey);
                      setSelectedDrug(null);
                      setShowSearch(false);
                      setSearch("");
                    }}
                    style={[
                      styles.catChip,
                      {
                        backgroundColor: isActive ? cat.color : isDark ? "#233554" : "#F1F5F9",
                        borderColor: isActive ? cat.color : "transparent",
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.catChipText, { color: isActive ? "#FFFFFF" : MUTED }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.drugSelector,
                {
                  borderColor: selectedDrug ? selectedDrug.color : BORDER,
                  backgroundColor: BG,
                  borderWidth: selectedDrug ? 2 : 1.5,
                },
              ]}
              onPress={() => setShowSearch((s) => !s)}
              activeOpacity={0.8}
            >
              {selectedDrug ? (
                <View style={styles.selectedDrugRow}>
                  <View style={[styles.drugDot, { backgroundColor: selectedDrug.color, width: 12, height: 12, borderRadius: 6 }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.selectedDrugName, { color: selectedDrug.color }]}>
                      {selectedDrug.name}
                    </Text>
                    <Text style={[styles.selectedDrugCategory, { color: MUTED }]}>
                      {selectedDrug.category}
                    </Text>
                  </View>
                  <Feather name={showSearch ? "chevron-up" : "chevron-down"} size={18} color={MUTED} />
                </View>
              ) : (
                <View style={styles.selectedDrugRow}>
                  <Feather name="search" size={18} color={MUTED} style={{ marginRight: 10 }} />
                  <Text style={{ color: MUTED, fontSize: 15, flex: 1 }}>Search dopamine, fentanyl, atracurium…</Text>
                  <Feather name="chevron-down" size={18} color={MUTED} />
                </View>
              )}
            </TouchableOpacity>

            {showSearch && (
              <View style={[styles.searchDropdown, { backgroundColor: CARD, borderColor: BORDER }]}>
                <View style={[styles.searchInputRow, { borderBottomColor: BORDER }]}>
                  <Feather name="search" size={16} color={MUTED} />
                  <TextInput
                    style={[styles.searchInput, { color: TEXT }]}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Dopamine, fentanyl, rocuronium…"
                    placeholderTextColor={MUTED}
                    autoFocus
                    returnKeyType="search"
                  />
                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch("")}>
                      <Feather name="x" size={16} color={MUTED} />
                    </TouchableOpacity>
                  )}
                </View>
                <FlatList
                  data={filteredDrugs}
                  keyExtractor={(d) => d.id}
                  renderItem={({ item }) => (
                    <DrugSearchItem
                      drug={item}
                      selected={selectedDrug?.id === item.id}
                      onSelect={handleDrugSelect}
                      textColor={TEXT}
                      borderColor={BORDER}
                    />
                  )}
                  style={{ maxHeight: 320 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>

          {selectedDrug && (
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* ══════════════════════════════════════
                  STEP 2 — DESIRED DOSE
              ══════════════════════════════════════ */}
              <View style={[styles.section, { backgroundColor: CARD, borderColor: BORDER }]}>
                <View style={styles.stepRow}>
                  <View style={[styles.stepBadge, { backgroundColor: selectedDrug.color }]}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={[styles.stepLabel, { color: TEXT }]}>Desired Dose</Text>
                </View>

                <View style={styles.doseRow}>
                  <TextInput
                    style={[styles.doseInput, { borderColor: selectedDrug.color, color: TEXT }]}
                    value={doseInput}
                    onChangeText={setDoseInput}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={MUTED}
                    selectTextOnFocus
                  />
                  <View style={styles.doseRangeBox}>
                    <Text style={[styles.doseRangeLabel, { color: MUTED }]}>Normal Range</Text>
                    <Text style={[styles.doseRange, { color: selectedDrug.color }]}>
                      {selectedDrug.minDose} – {selectedDrug.maxDose}
                    </Text>
                    <Text style={[styles.doseRangeUnit, { color: MUTED }]}>
                      {selectedDrug.primaryUnit}
                    </Text>
                  </View>
                </View>

                {selectedDrug.typicalDose !== undefined && (
                  <TouchableOpacity
                    style={styles.typicalBtn}
                    onPress={() => setDoseInput(String(selectedDrug.typicalDose))}
                  >
                    <Feather name="zap" size={12} color={selectedDrug.color} />
                    <Text style={[styles.typicalBtnText, { color: selectedDrug.color }]}>
                      Typical: {selectedDrug.typicalDose} {selectedDrug.primaryUnit}
                    </Text>
                  </TouchableOpacity>
                )}

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.unitRow}
                >
                  {unitOptions.map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={[
                        styles.unitChip,
                        { borderColor: BORDER, backgroundColor: BG },
                        doseUnit === u && {
                          backgroundColor: selectedDrug.color,
                          borderColor: selectedDrug.color,
                        },
                      ]}
                      onPress={() => setDoseUnit(u)}
                    >
                      <Text
                        style={[
                          styles.unitChipText,
                          { color: SEC },
                          doseUnit === u && { color: "#fff", fontWeight: "700" },
                        ]}
                      >
                        {u}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* ══════════════════════════════════════
                  STEP 3 — CONCENTRATION / DILUTION
              ══════════════════════════════════════ */}
              <View style={[styles.section, { backgroundColor: CARD, borderColor: BORDER }]}>
                <View style={styles.stepRow}>
                  <View style={[styles.stepBadge, { backgroundColor: selectedDrug.color }]}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                  <Text style={[styles.stepLabel, { color: TEXT }]}>Concentration</Text>
                </View>

                {/* Mode tabs */}
                <View style={[styles.modeTabs, { backgroundColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                  {(["standard", "dilution"] as ConcMode[]).map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[
                        styles.modeTab,
                        { backgroundColor: "transparent" },
                        concMode === mode && {
                          backgroundColor: selectedDrug.color,
                        },
                      ]}
                      onPress={() => setConcMode(mode)}
                      activeOpacity={0.8}
                    >
                      <Feather
                        name={mode === "standard" ? "list" : "droplet"}
                        size={13}
                        color={concMode === mode ? "#fff" : SEC}
                      />
                      <Text
                        style={[
                          styles.modeTabText,
                          { color: SEC },
                          concMode === mode && { color: "#fff" },
                        ]}
                      >
                        {mode === "standard" ? "Standard Mix" : "My Dilution"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* ── STANDARD CONCENTRATIONS ── */}
                {concMode === "standard" && (
                  <View style={styles.standardConcList}>
                    {selectedDrug.standardConcentrations.map((c, idx) => {
                      const isWeightBased = c.totalDrug_mg === -1;
                      const multiplier = isWeightBased
                        ? parseFloat(c.label.split(" ")[0]) || 0
                        : 0;
                      const calcConc = isWeightBased
                        ? ruleOf6Concentration(multiplier, weightNum, c.totalVolume_mL)
                        : c.concentration_per_mL;
                      const isSelected = selectedConcIdx === idx;

                      return (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.standardConcItem,
                            {
                              borderColor: BORDER,
                              backgroundColor: BG,
                            },
                            isSelected && {
                              borderColor: selectedDrug.color,
                              backgroundColor: selectedDrug.color + "12",
                            },
                          ]}
                          onPress={() => setSelectedConcIdx(idx)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.radioRow}>
                            <View
                              style={[
                                styles.radioOuter,
                                { borderColor: BORDER },
                                isSelected && { borderColor: selectedDrug.color },
                              ]}
                            >
                              {isSelected && (
                                <View
                                  style={[styles.radioInner, { backgroundColor: selectedDrug.color }]}
                                />
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.stdConcLabel,
                                  { color: TEXT },
                                  isSelected && { color: selectedDrug.color },
                                ]}
                              >
                                {c.label}
                              </Text>
                              {isWeightBased && weightNum > 0 && (
                                <Text style={[styles.stdConcNote, { color: MUTED }]}>
                                  For {weightNum} kg →{" "}
                                  {(multiplier * weightNum).toFixed(
                                    c.unit === "mcg" ? 0 : 1
                                  )}{" "}
                                  {c.unit} in {c.totalVolume_mL} mL ={" "}
                                  <Text style={{ color: selectedDrug.color, fontWeight: "700" }}>
                                    {calcConc < 0.1
                                      ? (calcConc * 1000).toFixed(2) + " mcg/mL"
                                      : calcConc >= 1
                                        ? (calcConc * 1000).toFixed(0) + " mcg/mL"
                                        : calcConc.toFixed(4) + " mg/mL"}
                                  </Text>
                                </Text>
                              )}
                              {!isWeightBased && (
                                <Text style={[styles.stdConcNote, { color: MUTED }]}>
                                  Concentration:{" "}
                                  <Text style={{ color: selectedDrug.color, fontWeight: "700" }}>
                                    {calcConc < 0.1
                                      ? (calcConc * 1000).toFixed(2) + " mcg/mL"
                                      : calcConc >= 1
                                        ? (calcConc * 1000).toFixed(0) + " mcg/mL"
                                        : calcConc.toFixed(4) + " mg/mL"}
                                  </Text>
                                </Text>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* ── CUSTOM DILUTION ── */}
                {concMode === "dilution" && (
                  <View style={styles.dilutionContainer}>
                    <Text style={[styles.dilutionHelp, { color: MUTED }]}>
                      Enter how you prepared the syringe
                    </Text>

                    <View style={styles.dilutionRow}>
                      <View style={styles.dilutionInputGroup}>
                        <Text style={[styles.dilutionLabel, { color: MUTED }]}>Drug Amount</Text>
                        <View style={styles.dilutionInputRow}>
                          <TextInput
                            style={[
                              styles.dilutionInput,
                              { borderColor: selectedDrug.color, color: TEXT },
                            ]}
                            value={dilutionDrug_mg}
                            onChangeText={setDilutionDrug_mg}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 50"
                            placeholderTextColor={MUTED}
                            selectTextOnFocus
                          />
                          <Text style={[styles.dilutionUnit, { color: SEC }]}>mg</Text>
                        </View>
                      </View>

                      <View style={styles.dilutionDivider}>
                        <Text style={[styles.dilutionIn, { color: MUTED }]}>in</Text>
                      </View>

                      <View style={styles.dilutionInputGroup}>
                        <Text style={[styles.dilutionLabel, { color: MUTED }]}>Total Volume</Text>
                        <View style={styles.dilutionInputRow}>
                          <TextInput
                            style={[
                              styles.dilutionInput,
                              { borderColor: selectedDrug.color, color: TEXT },
                            ]}
                            value={dilutionVol_mL}
                            onChangeText={setDilutionVol_mL}
                            keyboardType="decimal-pad"
                            placeholder="50"
                            placeholderTextColor={MUTED}
                            selectTextOnFocus
                          />
                          <Text style={[styles.dilutionUnit, { color: SEC }]}>mL</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.volPresetRow}>
                      {VOLUME_PRESETS.map((p) => (
                        <TouchableOpacity
                          key={p.value}
                          style={[
                            styles.volPreset,
                            { borderColor: BORDER, backgroundColor: BG },
                            dilutionVol_mL === p.value && {
                              backgroundColor: selectedDrug.color,
                              borderColor: selectedDrug.color,
                            },
                          ]}
                          onPress={() => setDilutionVol_mL(p.value)}
                        >
                          <Text
                            style={[
                              styles.volPresetLabel,
                              { color: SEC },
                              dilutionVol_mL === p.value && { color: "#fff" },
                            ]}
                          >
                            {p.label}
                          </Text>
                          <Text
                            style={[
                              styles.volPresetSub,
                              { color: MUTED },
                              dilutionVol_mL === p.value && { color: "rgba(255,255,255,0.8)" },
                            ]}
                          >
                            {p.sublabel}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {dilutionConc > 0 ? (
                      <View
                        style={[
                          styles.dilutionResult,
                          { borderColor: selectedDrug.color, backgroundColor: selectedDrug.color + "0E" },
                        ]}
                      >
                        <Feather name="check-circle" size={16} color={selectedDrug.color} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.dilutionResultLabel, { color: MUTED }]}>
                            Calculated Concentration
                          </Text>
                          <Text style={[styles.dilutionResultValue, { color: selectedDrug.color }]}>
                            {(() => {
                              const mcg = dilutionConc * 1000;
                              return dilutionConc >= 1
                                ? mcg.toFixed(0) + " mcg/mL"
                                : mcg < 1
                                  ? mcg.toFixed(2) + " mcg/mL"
                                  : mcg.toFixed(0) + " mcg/mL";
                            })()}
                          </Text>
                          <Text style={[styles.dilutionResultSub, { color: MUTED }]}>
                            {parseFloat(dilutionDrug_mg).toFixed(1)} mg in{" "}
                            {parseFloat(dilutionVol_mL).toFixed(0)} mL syringe
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={[styles.dilutionPlaceholder, { backgroundColor: BG, borderColor: BORDER }]}>
                        <Feather name="info" size={14} color={MUTED} />
                        <Text style={[styles.dilutionPlaceholderText, { color: MUTED }]}>
                          Fill in drug amount and volume to calculate concentration
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Active concentration summary */}
                {concentration > 0 && (
                  <View style={[styles.concSummaryBar, { borderColor: selectedDrug.color + "40", backgroundColor: BG }]}>
                    <Feather name="layers" size={13} color={selectedDrug.color} />
                    <Text style={[styles.concSummaryText, { color: SEC }]}>
                      Active:{" "}
                      <Text style={{ color: selectedDrug.color, fontWeight: "800" }}>
                        {(() => {
                          const mcg = concentration * 1000;
                          return concentration >= 1
                            ? mcg.toFixed(0) + " mcg/mL"
                            : mcg < 1
                              ? mcg.toFixed(2) + " mcg/mL"
                              : mcg.toFixed(0) + " mcg/mL";
                        })()}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              {/* ══════════════════════════════════════
                  STEP 4 — SYRINGE SIZE + RECIPE CARD
              ══════════════════════════════════════ */}
              {concMode === "standard" && (
                <View style={[styles.section, { backgroundColor: CARD, borderColor: BORDER }]}>
                  <View style={styles.stepRow}>
                    <View style={[styles.stepBadge, { backgroundColor: selectedDrug.color }]}>
                      <Text style={styles.stepNumber}>4</Text>
                    </View>
                    <Text style={[styles.stepLabel, { color: TEXT }]}>Syringe Size & Recipe</Text>
                  </View>

                  {/* Syringe size selector */}
                  <View style={[styles.syringeRow, { backgroundColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                    {SYRINGE_SIZES.map((ml) => (
                      <TouchableOpacity
                        key={ml}
                        style={[
                          styles.syringeBtn,
                          {
                            backgroundColor: "transparent",
                          },
                          syringeML === ml && {
                            backgroundColor: selectedDrug.color,
                          },
                        ]}
                        onPress={() => setSyringeML(ml)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.syringeBtnText,
                            { color: MUTED },
                            syringeML === ml && { color: "#fff", fontWeight: "800" },
                          ]}
                        >
                          {ml} mL
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Vial info chip */}
                  <View style={[styles.vialInfoRow, { backgroundColor: selectedDrug.color + "12", borderColor: selectedDrug.color + "30" }]}>
                    <Feather name="package" size={12} color={selectedDrug.color} />
                    <Text style={[styles.vialInfoText, { color: selectedDrug.color }]}>
                      Stock vial: {selectedDrug.vialLabel}
                    </Text>
                  </View>

                  {/* Recipe card output */}
                  {recipe === null && weightNum <= 0 && (
                    <View style={[styles.recipePlaceholder, { backgroundColor: BG, borderColor: BORDER }]}>
                      <Feather name="info" size={14} color={MUTED} />
                      <Text style={[styles.recipePlaceholderText, { color: MUTED }]}>
                        Enter patient weight above to see preparation recipe
                      </Text>
                    </View>
                  )}

                  {recipe?.tooConcentrated && (
                    <View style={styles.recipeErrorCard}>
                      <Feather name="alert-circle" size={16} color="#DC2626" />
                      <Text style={styles.recipeErrorText}>
                        Drug volume ({recipe.drugML.toFixed(1)} mL) exceeds syringe size ({syringeML} mL).
                        Choose a larger syringe or a more dilute concentration.
                      </Text>
                    </View>
                  )}

                  {recipe?.isValid && !recipe.tooConcentrated && (
                    <RecipeCard
                      recipe={recipe}
                      drug={selectedDrug}
                      diluent={selectedDrug.diluent}
                      vialLabel={selectedDrug.vialLabel}
                      isDark={isDark}
                    />
                  )}
                </View>
              )}

              {/* ══════════════════════════════════════
                  RESULT — PUMP RATE
              ══════════════════════════════════════ */}
              <View
                style={[
                  styles.resultBox,
                  { backgroundColor: CARD, borderColor: BORDER },
                  rateValid && { borderColor: selectedDrug.color, borderWidth: 2 },
                ]}
              >
                <View style={styles.resultHeader}>
                  <Feather
                    name="activity"
                    size={20}
                    color={rateValid ? selectedDrug.color : MUTED}
                  />
                  <Text style={[styles.resultHeaderLabel, { color: MUTED }]}>
                    Infusion Pump Rate
                  </Text>
                </View>

                <Text
                  style={[
                    styles.resultRate,
                    { color: rateValid ? selectedDrug.color : MUTED },
                  ]}
                >
                  {rateStr}
                </Text>

                {rateValid && (
                  <>
                    <View style={[styles.resultDivider, { backgroundColor: BORDER }]} />
                    <View style={styles.resultGrid}>
                      <ResultDetail label="Drug" value={selectedDrug.name} textColor={TEXT} mutedColor={MUTED} />
                      <ResultDetail label="Dose" value={`${doseInput} ${doseUnit}`} textColor={TEXT} mutedColor={MUTED} />
                      <ResultDetail label="Weight" value={`${weight} kg`} textColor={TEXT} mutedColor={MUTED} />
                      <ResultDetail
                        label="Concentration"
                        value={(() => {
                          const mcg = concentration * 1000;
                          return concentration >= 1
                            ? `${mcg.toFixed(0)} mcg/mL`
                            : mcg < 1
                              ? `${mcg.toFixed(2)} mcg/mL`
                              : `${mcg.toFixed(0)} mcg/mL`;
                        })()}
                        textColor={TEXT}
                        mutedColor={MUTED}
                      />
                    </View>
                  </>
                )}

                {!rateValid && (
                  <Text style={[styles.resultPlaceholder, { color: MUTED }]}>
                    Complete all steps above to calculate pump rate
                  </Text>
                )}
              </View>

              {/* Notes, warnings, reference */}
              {selectedDrug.notes && (
                <View style={[styles.noteCard, { backgroundColor: C.tint + "0E" }]}>
                  <Feather name="book-open" size={13} color={C.tint} style={{ marginTop: 1 }} />
                  <Text style={[styles.noteCardText, { color: SEC }]}>{selectedDrug.notes}</Text>
                </View>
              )}
              {(selectedDrug.warnings ?? []).map((w, i) => (
                <View key={i} style={styles.warnCard}>
                  <Feather name="alert-triangle" size={13} color="#B7791F" style={{ marginTop: 1 }} />
                  <Text style={styles.warnCardText}>{w}</Text>
                </View>
              ))}
              {selectedDrug.reference && (
                <Text style={[styles.refText, { color: MUTED }]}>
                  Ref: {selectedDrug.reference}
                </Text>
              )}
            </Animated.View>
          )}

          {/* Empty state */}
          {!selectedDrug && (
            <View style={styles.emptyState}>
              <Feather name="activity" size={52} color={C.tint + "33"} />
              <Text style={[styles.emptyTitle, { color: TEXT }]}>
                Select a drug to begin
              </Text>
              <Text style={[styles.emptySubtitle, { color: MUTED }]}>
                {INFUSION_DRUGS.length} PICU drugs · Instant syringe recipe · mL/hr pump rate
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20 }}
                contentContainerStyle={{ gap: 8 }}
              >
                {INFUSION_DRUGS.slice(0, 12).map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.quickChip, { borderColor: d.color }]}
                    onPress={() => handleDrugSelect(d)}
                  >
                    <View
                      style={[styles.drugDot, { backgroundColor: d.color, width: 7, height: 7, borderRadius: 3.5 }]}
                    />
                    <Text style={[styles.quickChipText, { color: d.color }]}>{d.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <ProfessionalFooter />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ResultDetail({
  label,
  value,
  textColor,
  mutedColor,
}: {
  label: string;
  value: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <View style={styles.resultDetail}>
      <Text style={[styles.resultDetailLabel, { color: mutedColor }]}>{label}</Text>
      <Text style={[styles.resultDetailValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 11, marginTop: 2 },

  nightBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  weightBadge: { alignItems: "center", width: 80 },
  weightLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  weightInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 19,
    fontWeight: "800",
    width: 80,
    textAlign: "center",
  },

  section: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 20,
    padding: 18,
    borderWidth: 0,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 16 },
      android: { elevation: 4 },
      web: { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
    }),
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: { color: "#fff", fontSize: 13, fontWeight: "800" },
  stepLabel: { fontSize: 16, fontWeight: "700", flex: 1 },
  stepHint: { fontSize: 11 },

  drugSelector: {
    borderRadius: 14,
    padding: 14,
  },
  selectedDrugRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  drugDot: { width: 10, height: 10, borderRadius: 5 },
  selectedDrugName: { fontSize: 16, fontWeight: "700" },
  selectedDrugCategory: { fontSize: 12, marginTop: 2 },

  searchDropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  drugSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    gap: 10,
  },
  drugSearchName: { fontSize: 14, fontWeight: "600" },
  drugSearchCategory: { fontSize: 11, marginTop: 2 },

  // Dose
  doseRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 10 },
  doseInput: {
    fontSize: 36,
    fontWeight: "900",
    borderBottomWidth: 3,
    paddingBottom: 4,
    minWidth: 120,
    letterSpacing: -1,
  },
  doseRangeBox: { alignItems: "flex-end", flex: 1 },
  doseRangeLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  doseRange: { fontSize: 15, fontWeight: "800", marginTop: 2 },
  doseRangeUnit: { fontSize: 10, marginTop: 1 },
  typicalBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  typicalBtnText: { fontSize: 13, fontWeight: "600" },
  unitRow: { paddingTop: 4, gap: 8 },
  unitChip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  unitChipText: { fontSize: 13, fontWeight: "600" },

  // Concentration modes
  modeTabs: { flexDirection: "row", gap: 6, marginBottom: 14, borderRadius: 100, padding: 4 },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 0,
  },
  modeTabText: { fontSize: 13, fontWeight: "700" },

  standardConcList: { gap: 10 },
  standardConcItem: {
    borderWidth: 0,
    borderRadius: 14,
    padding: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 2 },
      web: { boxShadow: "0 2px 10px rgba(0,0,0,0.07)" },
    }),
  },
  radioRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    justifyContent: "center", alignItems: "center", marginTop: 1, flexShrink: 0,
  },
  radioInner: { width: 9, height: 9, borderRadius: 4.5 },
  stdConcLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  stdConcNote: { fontSize: 12, lineHeight: 18 },

  // Custom dilution
  dilutionContainer: { gap: 12 },
  dilutionHelp: { fontSize: 13, fontStyle: "italic", marginBottom: 4 },
  dilutionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dilutionInputGroup: { flex: 1 },
  dilutionLabel: {
    fontSize: 11, fontWeight: "700", letterSpacing: 0.5,
    textTransform: "uppercase", marginBottom: 6,
  },
  dilutionInputRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dilutionInput: {
    flex: 1, borderWidth: 2, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 22, fontWeight: "800", textAlign: "center",
  },
  dilutionUnit: { fontSize: 14, fontWeight: "700" },
  dilutionDivider: { alignItems: "center", paddingTop: 22 },
  dilutionIn: { fontSize: 16, fontWeight: "700" },
  volPresetRow: { flexDirection: "row", gap: 8 },
  volPreset: {
    flex: 1, alignItems: "center", paddingVertical: 10,
    borderRadius: 12, borderWidth: 1.5, gap: 2,
  },
  volPresetLabel: { fontSize: 14, fontWeight: "800" },
  volPresetSub: { fontSize: 10, fontWeight: "600" },
  dilutionResult: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 2, borderRadius: 14, padding: 14,
  },
  dilutionResultLabel: {
    fontSize: 10, fontWeight: "700", letterSpacing: 0.5,
    textTransform: "uppercase", marginBottom: 3,
  },
  dilutionResultValue: { fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  dilutionResultSub: { fontSize: 12, marginTop: 2 },
  dilutionPlaceholder: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 12, borderRadius: 10, borderWidth: 1,
  },
  dilutionPlaceholderText: { flex: 1, fontSize: 13, fontStyle: "italic" },
  concSummaryBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginTop: 14, padding: 10, borderRadius: 10, borderWidth: 1,
  },
  concSummaryText: { fontSize: 13 },

  // Syringe size
  syringeRow: { flexDirection: "row", gap: 6, marginBottom: 12, padding: 4, borderRadius: 100 },
  syringeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    borderWidth: 0,
  },
  syringeBtnText: { fontSize: 13, fontWeight: "700" },

  // Vial info
  vialInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 12,
  },
  vialInfoText: { fontSize: 12, fontWeight: "600", flex: 1 },

  // Recipe placeholders / errors
  recipePlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  recipePlaceholderText: { flex: 1, fontSize: 13, fontStyle: "italic" },
  recipeErrorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  recipeErrorText: { flex: 1, fontSize: 13, color: "#DC2626", fontWeight: "500" },

  // Recipe card
  recipeCard: {
    borderWidth: 0,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 14 },
      android: { elevation: 4 },
      web: { boxShadow: "0 4px 18px rgba(0,0,0,0.10)" },
    }),
  },
  recipeHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  recipeTitle: { fontSize: 14, fontWeight: "700" },
  recipeIngredients: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 4,
  },
  recipeItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  recipeItemLabel: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  recipeItemSub: { fontSize: 9, textAlign: "center" },
  recipeItemValue: { fontSize: 20, fontWeight: "900", textAlign: "center", marginTop: 2 },
  recipeItemAmt: { fontSize: 10, textAlign: "center" },
  recipePlusCol: { justifyContent: "center", paddingHorizontal: 2 },
  recipePlus: { fontSize: 18, fontWeight: "700" },
  recipeConcBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  recipeConcLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  recipeConcLabel: { fontSize: 12, fontWeight: "600" },
  recipeConcValue: { fontSize: 16, fontWeight: "800" },
  recipeWarnRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    padding: 9,
  },
  recipeWarnText: { flex: 1, fontSize: 11, color: "#92400E", fontWeight: "500", lineHeight: 16 },

  // Result
  resultBox: {
    margin: 14,
    marginTop: 12,
    borderRadius: 24,
    padding: 24,
    borderWidth: 0,
    ...Platform.select({
      ios: { shadowColor: "#0891B2", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.20, shadowRadius: 24 },
      android: { elevation: 8 },
      web: { boxShadow: "0 8px 32px rgba(8,145,178,0.18)" },
    }),
  },
  resultHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  resultHeaderLabel: {
    fontSize: 12, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase",
  },
  resultRate: { fontSize: 56, fontWeight: "900", letterSpacing: -2, lineHeight: 64 },
  resultPlaceholder: { fontSize: 14, marginTop: 8, fontStyle: "italic" },
  resultDivider: { height: 1, marginVertical: 14 },
  resultGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  resultDetail: { minWidth: "40%" },
  resultDetailLabel: {
    fontSize: 10, fontWeight: "700", letterSpacing: 0.5,
    textTransform: "uppercase", marginBottom: 3,
  },
  resultDetailValue: { fontSize: 14, fontWeight: "700" },

  noteCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    marginHorizontal: 14, marginBottom: 8, padding: 12,
    borderRadius: 12, borderLeftWidth: 3, borderLeftColor: C.tint,
  },
  noteCardText: { flex: 1, fontSize: 13, lineHeight: 19 },
  warnCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    marginHorizontal: 14, marginBottom: 8, padding: 12,
    backgroundColor: "#FFFBEB", borderRadius: 12,
    borderLeftWidth: 3, borderLeftColor: "#D97706",
  },
  warnCardText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 19 },
  refText: { marginHorizontal: 14, marginBottom: 8, fontSize: 11, fontStyle: "italic" },

  emptyState: { margin: 24, alignItems: "center", paddingTop: 20 },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 22 },
  quickChip: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 6,
  },
  quickChipText: { fontSize: 13, fontWeight: "700" },
  catChipList: { gap: 7, paddingBottom: 10, paddingTop: 4 },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  catChipText: { fontSize: 12, fontWeight: "600" },
});
