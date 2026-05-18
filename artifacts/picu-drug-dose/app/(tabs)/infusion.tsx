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
import {
  INFUSION_DRUGS,
  InfusionDrug,
  InfusionUnit,
  calculateInfusionRate,
  formatRate,
  ruleOf6Concentration,
} from "@/constants/infusions";
import Colors from "@/constants/colors";

const C = Colors.light;

const DOSE_UNITS: InfusionUnit[] = [
  "mcg/kg/min",
  "mcg/kg/hr",
  "mg/kg/hr",
  "units/kg/hr",
  "mcg/min",
  "mg/hr",
];

// ── QUICK VOLUME PRESETS ────────────────────────────────────────────────────
const VOLUME_PRESETS = [
  { label: "10 mL", sublabel: "Sedation", value: "10" },
  { label: "20 mL", sublabel: "Sedation", value: "20" },
  { label: "50 mL", sublabel: "Inotropes", value: "50" },
  { label: "100 mL", sublabel: "Standard", value: "100" },
];

// ──────────────────────────────────────────────────────────────────────────────
// DRUG SEARCH ITEM
// ──────────────────────────────────────────────────────────────────────────────
function DrugSearchItem({
  drug,
  selected,
  onSelect,
}: {
  drug: InfusionDrug;
  selected: boolean;
  onSelect: (d: InfusionDrug) => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.drugSearchItem,
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
        <Text style={[styles.drugSearchName, selected && { color: drug.color }]}>
          {drug.name}
        </Text>
        <Text style={styles.drugSearchCategory}>{drug.category}</Text>
      </View>
      {selected && (
        <Feather name="check-circle" size={18} color={drug.color} />
      )}
    </TouchableOpacity>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// CONCENTRATION MODE TYPES
// ──────────────────────────────────────────────────────────────────────────────
type ConcMode = "standard" | "dilution";

// ──────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ──────────────────────────────────────────────────────────────────────────────
export default function InfusionScreen() {
  const { weightInput: weight, setWeightInput: setWeight } = useWeight();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<InfusionDrug | null>(null);
  const [selectedConcIdx, setSelectedConcIdx] = useState(0);
  const [doseInput, setDoseInput] = useState("");
  const [doseUnit, setDoseUnit] = useState<InfusionUnit>("mcg/kg/min");

  // Concentration mode
  const [concMode, setConcMode] = useState<ConcMode>("standard");
  // Custom dilution inputs
  const [dilutionDrug_mg, setDilutionDrug_mg] = useState("");
  const [dilutionVol_mL, setDilutionVol_mL] = useState("50");
  // Fallback: manual mg/mL entry
  const [manualConc_mgmL, setManualConc_mgmL] = useState("");
  // Epinephrine-specific vascular access
  const [epiAccessType, setEpiAccessType] = useState<"peripheral" | "cvc_standard" | "cvc_concentrated">("peripheral");
  const [epiSyringeML, setEpiSyringeML] = useState(50);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const weightNum = parseFloat(weight) || 0;
  const doseNum = parseFloat(doseInput) || 0;

  const filteredDrugs = useMemo(
    () =>
      INFUSION_DRUGS.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.category.toLowerCase().includes(search.toLowerCase()) ||
          d.indication.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

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
      setManualConc_mgmL("");
      setEpiAccessType("peripheral");
      setEpiSyringeML(50);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  // ── Epinephrine vascular-access config ───────────────────────
  const EPI_CONFIGS = {
    peripheral:        { label: "Peripheral IV",         conc_mcg_ml: 20, conc_mg_ml: 0.02, vials50mL: 1, warning: "Safe for peripheral lines · max 5 mcg/kg/min" },
    cvc_standard:      { label: "CVC — Standard",        conc_mcg_ml: 40, conc_mg_ml: 0.04, vials50mL: 2, warning: "Central line required" },
    cvc_concentrated:  { label: "CVC — Concentrated",    conc_mcg_ml: 60, conc_mg_ml: 0.06, vials50mL: 3, warning: "Central line — concentrated, verify access" },
  } as const;

  // ── Concentration calculation ─────────────────────────────────
  const concentration = useMemo((): number => {
    if (!selectedDrug) return 0;

    // Special case: Epinephrine infusion uses vascular-access based concentrations
    if (selectedDrug.id === "epinephrine-infusion") {
      return EPI_CONFIGS[epiAccessType].conc_mg_ml;
    }

    if (concMode === "dilution") {
      const mg = parseFloat(dilutionDrug_mg);
      const mL = parseFloat(dilutionVol_mL);
      if (mg > 0 && mL > 0) return mg / mL;
      return 0;
    }

    // standard
    const c = selectedDrug.standardConcentrations[selectedConcIdx];
    if (!c) return 0;
    if (c.totalDrug_mg === -1) {
      const multiplier = parseFloat(c.label.split(" ")[0]) || 0;
      return ruleOf6Concentration(multiplier, weightNum, c.totalVolume_mL);
    }
    return c.concentration_per_mL;
  }, [
    concMode,
    dilutionDrug_mg,
    dilutionVol_mL,
    selectedDrug,
    selectedConcIdx,
    weightNum,
  ]);

  const rateMLhr = useMemo(() => {
    if (!doseNum || !weightNum || !concentration) return 0;
    return calculateInfusionRate(doseNum, doseUnit, weightNum, concentration);
  }, [doseNum, doseUnit, weightNum, concentration]);

  const rateStr = formatRate(rateMLhr);
  const rateValid = rateMLhr > 0 && isFinite(rateMLhr);

  // Derived dilution display
  const dilutionConc = useMemo(() => {
    const mg = parseFloat(dilutionDrug_mg);
    const mL = parseFloat(dilutionVol_mL);
    if (mg > 0 && mL > 0) return mg / mL;
    return 0;
  }, [dilutionDrug_mg, dilutionVol_mL]);

  const unitOptions = selectedDrug
    ? [selectedDrug.primaryUnit, ...(selectedDrug.alternateUnits ?? [])].filter(
        (u, i, a) => a.indexOf(u) === i
      )
    : DOSE_UNITS;

  const isEpinephrine = selectedDrug?.id === "epinephrine-infusion";

  const epiConfig = EPI_CONFIGS[epiAccessType];
  const epiScale = epiSyringeML / 50;
  const epiDrugML = +(epiConfig.vials50mL * epiScale).toFixed(2);
  const epiDiluentML = +(epiSyringeML - epiDrugML).toFixed(2);

  const EPI_SYRINGE_OPTIONS = [10, 20, 30, 50];
  const EPI_ACCESS_OPTIONS: Array<{ key: "peripheral" | "cvc_standard" | "cvc_concentrated"; label: string; sub: string; color: string }> = [
    { key: "peripheral",       label: "Peripheral IV",       sub: `20 mcg/mL`,  color: "#2563EB" },
    { key: "cvc_standard",     label: "CVC — Standard",      sub: `40 mcg/mL`,  color: "#9333EA" },
    { key: "cvc_concentrated", label: "CVC — Concentrated",  sub: `60 mcg/mL`,  color: "#DC2626" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Infusion Calculator</Text>
            <Text style={styles.headerSubtitle}>mL/hr for infusion pump</Text>
          </View>
          <View style={styles.weightBadge}>
            <Text style={styles.weightLabel}>WEIGHT (KG)</Text>
            <TextInput
              style={styles.weightInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="—"
              placeholderTextColor={C.textMuted}
              selectTextOnFocus
            />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══════════════════════════════════════════════
              STEP 1 — SELECT DRUG
          ══════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.stepRow}>
              <View style={[styles.stepBadge, selectedDrug && { backgroundColor: selectedDrug.color }]}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.stepLabel}>Select Drug</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.drugSelector,
                selectedDrug && {
                  borderColor: selectedDrug.color,
                  borderWidth: 2,
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
                    <Text style={styles.selectedDrugCategory}>
                      {selectedDrug.category}
                    </Text>
                  </View>
                  <Feather
                    name={showSearch ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={C.textMuted}
                  />
                </View>
              ) : (
                <View style={styles.selectedDrugRow}>
                  <Feather name="search" size={18} color={C.textMuted} style={{ marginRight: 10 }} />
                  <Text style={{ color: C.textMuted, fontSize: 15 }}>
                    Search drug…
                  </Text>
                  <Feather name="chevron-down" size={18} color={C.textMuted} />
                </View>
              )}
            </TouchableOpacity>

            {showSearch && (
              <View style={styles.searchDropdown}>
                <View style={styles.searchInputRow}>
                  <Feather name="search" size={16} color={C.textMuted} />
                  <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Dopamine, fentanyl, atracurium…"
                    placeholderTextColor={C.textMuted}
                    autoFocus
                    returnKeyType="search"
                  />
                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch("")}>
                      <Feather name="x" size={16} color={C.textMuted} />
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
                    />
                  )}
                  style={{ maxHeight: 300 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>

          {selectedDrug && (
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* ══════════════════════════════════════════════
                  STEP 2 — DOSE
              ══════════════════════════════════════════════ */}
              <View style={styles.section}>
                <View style={styles.stepRow}>
                  <View style={[styles.stepBadge, { backgroundColor: selectedDrug.color }]}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={styles.stepLabel}>Desired Dose</Text>
                </View>

                <View style={styles.doseRow}>
                  <TextInput
                    style={[styles.doseInput, { borderColor: selectedDrug.color }]}
                    value={doseInput}
                    onChangeText={setDoseInput}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={C.textMuted}
                    selectTextOnFocus
                  />
                  <View style={styles.doseRangeBox}>
                    <Text style={styles.doseRangeLabel}>Normal Range</Text>
                    <Text style={[styles.doseRange, { color: selectedDrug.color }]}>
                      {selectedDrug.minDose} – {selectedDrug.maxDose}
                    </Text>
                    <Text style={styles.doseRangeUnit}>{selectedDrug.primaryUnit}</Text>
                  </View>
                </View>

                {selectedDrug.typicalDose !== undefined && (
                  <TouchableOpacity
                    style={styles.typicalBtn}
                    onPress={() => setDoseInput(String(selectedDrug.typicalDose))}
                  >
                    <Feather name="zap" size={12} color={selectedDrug.color} />
                    <Text style={[styles.typicalBtnText, { color: selectedDrug.color }]}>
                      Typical dose: {selectedDrug.typicalDose} {selectedDrug.primaryUnit}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Unit selector */}
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
                          doseUnit === u && { color: "#fff", fontWeight: "700" },
                        ]}
                      >
                        {u}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* ══════════════════════════════════════════════
                  STEP 3 — CONCENTRATION / DILUTION
              ══════════════════════════════════════════════ */}
              <View style={styles.section}>
                <View style={styles.stepRow}>
                  <View style={[styles.stepBadge, { backgroundColor: selectedDrug.color }]}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                  <Text style={styles.stepLabel}>Concentration / Dilution</Text>
                </View>

                {isEpinephrine ? (
                  /* ── EPINEPHRINE VASCULAR ACCESS MODULE ───────── */
                  <View>
                    {/* Access type selector */}
                    <Text style={styles.epiSectionLabel}>Vascular Access</Text>
                    <View style={styles.epiAccessRow}>
                      {EPI_ACCESS_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt.key}
                          style={[
                            styles.epiAccessBtn,
                            epiAccessType === opt.key && {
                              backgroundColor: opt.color,
                              borderColor: opt.color,
                            },
                          ]}
                          onPress={() => setEpiAccessType(opt.key)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.epiAccessBtnLabel,
                              epiAccessType === opt.key && { color: "#fff" },
                            ]}
                          >
                            {opt.label}
                          </Text>
                          <Text
                            style={[
                              styles.epiAccessBtnSub,
                              epiAccessType === opt.key && { color: "rgba(255,255,255,0.8)" },
                            ]}
                          >
                            {opt.sub}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Syringe size */}
                    <Text style={[styles.epiSectionLabel, { marginTop: 12 }]}>Syringe Volume</Text>
                    <View style={styles.epiSyringeRow}>
                      {EPI_SYRINGE_OPTIONS.map((ml) => (
                        <TouchableOpacity
                          key={ml}
                          style={[
                            styles.epiSyringeBtn,
                            epiSyringeML === ml && {
                              backgroundColor: selectedDrug.color,
                              borderColor: selectedDrug.color,
                            },
                          ]}
                          onPress={() => setEpiSyringeML(ml)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.epiSyrBtnText,
                              epiSyringeML === ml && { color: "#fff" },
                            ]}
                          >
                            {ml} mL
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Preparation instructions */}
                    <View
                      style={[
                        styles.epiPrepCard,
                        { borderColor: selectedDrug.color, backgroundColor: selectedDrug.color + "0D" },
                      ]}
                    >
                      <View style={styles.epiPrepHeader}>
                        <Feather name="droplet" size={14} color={selectedDrug.color} />
                        <Text style={[styles.epiPrepTitle, { color: selectedDrug.color }]}>
                          Preparation — {epiSyringeML} mL Syringe
                        </Text>
                      </View>
                      <View style={styles.epiPrepRow}>
                        <View style={styles.epiPrepItem}>
                          <Text style={styles.epiPrepItemLabel}>Epinephrine (1 mg/mL)</Text>
                          <Text style={[styles.epiPrepItemValue, { color: selectedDrug.color }]}>
                            {epiDrugML} mL
                          </Text>
                          <Text style={styles.epiPrepItemSub}>
                            ({epiConfig.vials50mL * epiScale < 1
                              ? `${epiDrugML} mL of 1 vial`
                              : `${epiConfig.vials50mL * epiScale >= 1
                                  ? `${+(epiConfig.vials50mL * epiScale).toFixed(1)} vial(s)`
                                  : `${epiDrugML} mL`}`})
                          </Text>
                        </View>
                        <Text style={styles.epiPrepPlus}>+</Text>
                        <View style={styles.epiPrepItem}>
                          <Text style={styles.epiPrepItemLabel}>NS / D5W (diluent)</Text>
                          <Text style={[styles.epiPrepItemValue, { color: C.tint }]}>
                            {epiDiluentML} mL
                          </Text>
                          <Text style={styles.epiPrepItemSub}>to make {epiSyringeML} mL total</Text>
                        </View>
                      </View>
                      <View style={styles.epiConcRow}>
                        <Text style={styles.epiConcLabel}>Final Concentration</Text>
                        <Text style={[styles.epiConcValue, { color: selectedDrug.color }]}>
                          {epiConfig.conc_mcg_ml} mcg/mL ({epiConfig.conc_mg_ml * 1000} mcg/mL)
                        </Text>
                      </View>
                    </View>

                    {/* Access warning */}
                    <View style={styles.epiWarnRow}>
                      <Feather name="alert-triangle" size={12} color="#B7791F" />
                      <Text style={styles.epiWarnText}>{epiConfig.warning}</Text>
                    </View>
                  </View>
                ) : (<>
                {/* Mode tabs */}
                <View style={styles.modeTabs}>
                  <TouchableOpacity
                    style={[
                      styles.modeTab,
                      concMode === "standard" && {
                        backgroundColor: selectedDrug.color,
                        borderColor: selectedDrug.color,
                      },
                    ]}
                    onPress={() => setConcMode("standard")}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="list"
                      size={14}
                      color={concMode === "standard" ? "#fff" : C.textSecondary}
                    />
                    <Text
                      style={[
                        styles.modeTabText,
                        concMode === "standard" && { color: "#fff" },
                      ]}
                    >
                      Standard Mix
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeTab,
                      concMode === "dilution" && {
                        backgroundColor: selectedDrug.color,
                        borderColor: selectedDrug.color,
                      },
                    ]}
                    onPress={() => setConcMode("dilution")}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="droplet"
                      size={14}
                      color={concMode === "dilution" ? "#fff" : C.textSecondary}
                    />
                    <Text
                      style={[
                        styles.modeTabText,
                        concMode === "dilution" && { color: "#fff" },
                      ]}
                    >
                      My Dilution
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ── MODE A: STANDARD CONCENTRATIONS ── */}
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
                                isSelected && { borderColor: selectedDrug.color },
                              ]}
                            >
                              {isSelected && (
                                <View
                                  style={[
                                    styles.radioInner,
                                    { backgroundColor: selectedDrug.color },
                                  ]}
                                />
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.stdConcLabel,
                                  isSelected && { color: selectedDrug.color },
                                ]}
                              >
                                {c.label}
                              </Text>
                              {isWeightBased && weightNum > 0 && (
                                <Text style={styles.stdConcNote}>
                                  For {weightNum} kg → {(multiplier * weightNum).toFixed(1)} mg in{" "}
                                  {c.totalVolume_mL} mL ={" "}
                                  <Text style={{ color: selectedDrug.color, fontWeight: "700" }}>
                                    {calcConc.toFixed(3)} mg/mL
                                  </Text>
                                </Text>
                              )}
                              {!isWeightBased && (
                                <Text style={styles.stdConcNote}>
                                  Concentration:{" "}
                                  <Text style={{ color: selectedDrug.color, fontWeight: "700" }}>
                                    {calcConc.toFixed(3)} mg/mL
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

                {/* ── MODE B: CUSTOM DILUTION CALCULATOR ── */}
                {concMode === "dilution" && (
                  <View style={styles.dilutionContainer}>
                    <Text style={styles.dilutionHelp}>
                      Enter how you prepared the syringe
                    </Text>

                    {/* Drug amount row */}
                    <View style={styles.dilutionRow}>
                      <View style={styles.dilutionInputGroup}>
                        <Text style={styles.dilutionLabel}>Drug Amount</Text>
                        <View style={styles.dilutionInputRow}>
                          <TextInput
                            style={[
                              styles.dilutionInput,
                              { borderColor: selectedDrug.color },
                            ]}
                            value={dilutionDrug_mg}
                            onChangeText={setDilutionDrug_mg}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 50"
                            placeholderTextColor={C.textMuted}
                            selectTextOnFocus
                          />
                          <Text style={styles.dilutionUnit}>mg</Text>
                        </View>
                      </View>

                      <View style={styles.dilutionDivider}>
                        <Text style={styles.dilutionIn}>in</Text>
                      </View>

                      <View style={styles.dilutionInputGroup}>
                        <Text style={styles.dilutionLabel}>Total Volume</Text>
                        <View style={styles.dilutionInputRow}>
                          <TextInput
                            style={[
                              styles.dilutionInput,
                              { borderColor: selectedDrug.color },
                            ]}
                            value={dilutionVol_mL}
                            onChangeText={setDilutionVol_mL}
                            keyboardType="decimal-pad"
                            placeholder="50"
                            placeholderTextColor={C.textMuted}
                            selectTextOnFocus
                          />
                          <Text style={styles.dilutionUnit}>mL</Text>
                        </View>
                      </View>
                    </View>

                    {/* Volume quick buttons */}
                    <View style={styles.volPresetRow}>
                      {VOLUME_PRESETS.map((p) => (
                        <TouchableOpacity
                          key={p.value}
                          style={[
                            styles.volPreset,
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
                              dilutionVol_mL === p.value && { color: "#fff" },
                            ]}
                          >
                            {p.label}
                          </Text>
                          <Text
                            style={[
                              styles.volPresetSub,
                              dilutionVol_mL === p.value && { color: "rgba(255,255,255,0.8)" },
                            ]}
                          >
                            {p.sublabel}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Result: concentration */}
                    {dilutionConc > 0 ? (
                      <View
                        style={[
                          styles.dilutionResult,
                          { borderColor: selectedDrug.color, backgroundColor: selectedDrug.color + "0E" },
                        ]}
                      >
                        <Feather name="check-circle" size={16} color={selectedDrug.color} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.dilutionResultLabel}>Calculated Concentration</Text>
                          <Text style={[styles.dilutionResultValue, { color: selectedDrug.color }]}>
                            {dilutionConc.toFixed(4)} mg/mL
                          </Text>
                          <Text style={styles.dilutionResultSub}>
                            {parseFloat(dilutionDrug_mg).toFixed(1)} mg in{" "}
                            {parseFloat(dilutionVol_mL).toFixed(0)} mL syringe
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.dilutionPlaceholder}>
                        <Feather name="info" size={14} color={C.textMuted} />
                        <Text style={styles.dilutionPlaceholderText}>
                          Fill in drug amount and volume to calculate concentration
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Active concentration summary */}
                {concentration > 0 && (
                  <View
                    style={[
                      styles.concSummaryBar,
                      { borderColor: selectedDrug.color + "40" },
                    ]}
                  >
                    <Feather name="layers" size={13} color={selectedDrug.color} />
                    <Text style={styles.concSummaryText}>
                      Using:{" "}
                      <Text style={{ color: selectedDrug.color, fontWeight: "800" }}>
                        {concentration.toFixed(4)} mg/mL
                      </Text>
                    </Text>
                  </View>
                )}
              </>)}
              </View>

              {/* ══════════════════════════════════════════════
                  RESULT BOX
              ══════════════════════════════════════════════ */}
              <View
                style={[
                  styles.resultBox,
                  rateValid
                    ? { borderColor: selectedDrug.color, borderWidth: 2 }
                    : { borderColor: C.border },
                ]}
              >
                <View style={styles.resultHeader}>
                  <Feather
                    name="activity"
                    size={20}
                    color={rateValid ? selectedDrug.color : C.textMuted}
                  />
                  <Text style={styles.resultHeaderLabel}>Infusion Pump Rate</Text>
                </View>

                <Text
                  style={[
                    styles.resultRate,
                    { color: rateValid ? selectedDrug.color : C.textMuted },
                  ]}
                >
                  {rateStr}
                </Text>

                {rateValid && (
                  <>
                    <View style={styles.resultDivider} />
                    <View style={styles.resultGrid}>
                      <ResultDetail label="Drug" value={selectedDrug.name} />
                      <ResultDetail label="Dose" value={`${doseInput} ${doseUnit}`} />
                      <ResultDetail label="Weight" value={`${weight} kg`} />
                      <ResultDetail
                        label="Concentration"
                        value={`${concentration.toFixed(4)} mg/mL`}
                      />
                    </View>
                  </>
                )}

                {!rateValid && (
                  <Text style={styles.resultPlaceholder}>
                    Complete all steps above to calculate pump rate
                  </Text>
                )}
              </View>

              {/* Notes, warnings, reference */}
              {selectedDrug.notes && (
                <View style={styles.noteCard}>
                  <Feather name="book-open" size={13} color={C.tint} style={{ marginTop: 1 }} />
                  <Text style={styles.noteCardText}>{selectedDrug.notes}</Text>
                </View>
              )}
              {(selectedDrug.warnings ?? []).map((w, i) => (
                <View key={i} style={styles.warnCard}>
                  <Feather name="alert-triangle" size={13} color="#B7791F" style={{ marginTop: 1 }} />
                  <Text style={styles.warnCardText}>{w}</Text>
                </View>
              ))}
              {selectedDrug.reference && (
                <Text style={styles.refText}>Ref: {selectedDrug.reference}</Text>
              )}
            </Animated.View>
          )}

          {/* ── Empty state ── */}
          {!selectedDrug && (
            <View style={styles.emptyState}>
              <Feather name="activity" size={52} color={C.tint + "33"} />
              <Text style={styles.emptyTitle}>Select a drug to begin</Text>
              <Text style={styles.emptySubtitle}>
                Dopamine, norepinephrine, fentanyl, midazolam, atracurium, cisatracurium, heparin, and 20+ ICU drugs
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20 }}
                contentContainerStyle={{ gap: 8 }}
              >
                {INFUSION_DRUGS.slice(0, 10).map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.quickChip, { borderColor: d.color }]}
                    onPress={() => handleDrugSelect(d)}
                  >
                    <View
                      style={[
                        styles.drugDot,
                        { backgroundColor: d.color, width: 7, height: 7, borderRadius: 3.5 },
                      ]}
                    />
                    <Text style={[styles.quickChipText, { color: d.color }]}>{d.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ResultDetail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultDetail}>
      <Text style={styles.resultDetailLabel}>{label}</Text>
      <Text style={styles.resultDetailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  scroll: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  weightBadge: { alignItems: "center" },
  weightLabel: {
    fontSize: 9,
    color: C.tint,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  weightInput: {
    borderWidth: 2,
    borderColor: C.tint,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 20,
    fontWeight: "800",
    color: C.tint,
    minWidth: 72,
    textAlign: "center",
    backgroundColor: C.tint + "10",
  },

  section: {
    backgroundColor: C.card,
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
      web: { boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
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
    backgroundColor: C.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: { color: "#fff", fontSize: 13, fontWeight: "800" },
  stepLabel: { fontSize: 16, fontWeight: "700", color: C.text },

  drugSelector: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    padding: 14,
    backgroundColor: C.background,
  },
  selectedDrugRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drugDot: { width: 10, height: 10, borderRadius: 5 },
  selectedDrugName: { fontSize: 16, fontWeight: "700" },
  selectedDrugCategory: { fontSize: 12, color: C.textMuted, marginTop: 2 },

  searchDropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    backgroundColor: C.card,
    overflow: "hidden",
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: C.text },
  drugSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
    borderLeftWidth: 0,
  },
  drugSearchName: { fontSize: 14, fontWeight: "600", color: C.text },
  drugSearchCategory: { fontSize: 11, color: C.textMuted, marginTop: 2 },

  // Dose
  doseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },
  doseInput: {
    fontSize: 36,
    fontWeight: "900",
    color: C.text,
    borderBottomWidth: 3,
    paddingBottom: 4,
    minWidth: 120,
    letterSpacing: -1,
  },
  doseRangeBox: { alignItems: "flex-end", flex: 1 },
  doseRangeLabel: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  doseRange: { fontSize: 15, fontWeight: "800", marginTop: 2 },
  doseRangeUnit: { fontSize: 10, color: C.textMuted, marginTop: 1 },
  typicalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  typicalBtnText: { fontSize: 13, fontWeight: "600" },
  unitRow: { paddingTop: 4, gap: 8 },
  unitChip: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  unitChipText: { fontSize: 13, color: C.textSecondary, fontWeight: "600" },

  // Concentration mode tabs
  modeTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.background,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textSecondary,
  },

  // Standard concentrations
  standardConcList: { gap: 10 },
  standardConcItem: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
  },
  radioRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  radioInner: { width: 9, height: 9, borderRadius: 4.5 },
  stdConcLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
    marginBottom: 4,
  },
  stdConcNote: { fontSize: 12, color: C.textMuted, lineHeight: 18 },

  // Custom dilution calculator
  dilutionContainer: { gap: 12 },
  dilutionHelp: {
    fontSize: 13,
    color: C.textMuted,
    fontStyle: "italic",
    marginBottom: 4,
  },
  dilutionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dilutionInputGroup: { flex: 1 },
  dilutionLabel: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  dilutionInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dilutionInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
  },
  dilutionUnit: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textSecondary,
  },
  dilutionDivider: {
    alignItems: "center",
    paddingTop: 22,
  },
  dilutionIn: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textMuted,
  },
  volPresetRow: {
    flexDirection: "row",
    gap: 8,
  },
  volPreset: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.background,
    gap: 2,
  },
  volPresetLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: C.textSecondary,
  },
  volPresetSub: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "600",
  },
  dilutionResult: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
  },
  dilutionResultLabel: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  dilutionResultValue: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  dilutionResultSub: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
  },
  dilutionPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: C.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  dilutionPlaceholderText: {
    flex: 1,
    fontSize: 13,
    color: C.textMuted,
    fontStyle: "italic",
  },
  concSummaryBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: C.background,
  },
  concSummaryText: {
    fontSize: 13,
    color: C.textSecondary,
  },

  // Result
  resultBox: {
    margin: 14,
    marginTop: 12,
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16 },
      android: { elevation: 6 },
      web: { boxShadow: "0 6px 24px rgba(0,0,0,0.1)" },
    }),
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  resultHeaderLabel: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  resultRate: {
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 64,
  },
  resultPlaceholder: {
    fontSize: 14,
    color: C.textMuted,
    marginTop: 8,
    fontStyle: "italic",
  },
  resultDivider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },
  resultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  resultDetail: { minWidth: "40%" },
  resultDetailLabel: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  resultDetailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
  },

  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 12,
    backgroundColor: C.tint + "0E",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: C.tint,
  },
  noteCardText: { flex: 1, fontSize: 13, color: C.textSecondary, lineHeight: 19 },
  warnCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#D97706",
  },
  warnCardText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 19 },
  refText: {
    marginHorizontal: 14,
    marginBottom: 8,
    fontSize: 11,
    color: C.textMuted,
    fontStyle: "italic",
  },

  emptyState: { margin: 24, alignItems: "center", paddingTop: 20 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: C.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  quickChipText: { fontSize: 13, fontWeight: "700" },

  // ── Epinephrine vascular access styles ─────────────────────
  epiSectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 4,
  },
  epiAccessRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  epiAccessBtn: {
    flex: 1,
    minWidth: 90,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: "center",
    gap: 2,
    backgroundColor: C.card,
  },
  epiAccessBtnLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.text,
    textAlign: "center",
  },
  epiAccessBtnSub: {
    fontSize: 10,
    fontWeight: "600",
    color: C.textSecondary,
    textAlign: "center",
  },
  epiSyringeRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  epiSyringeBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: "center",
    backgroundColor: C.card,
  },
  epiSyrBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textSecondary,
  },
  epiPrepCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  epiPrepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  epiPrepTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  epiPrepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  epiPrepItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  epiPrepItemLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textSecondary,
    textAlign: "center",
  },
  epiPrepItemValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  epiPrepItemSub: {
    fontSize: 10,
    color: C.textMuted,
    textAlign: "center",
  },
  epiPrepPlus: {
    fontSize: 20,
    fontWeight: "700",
    color: C.textSecondary,
  },
  epiConcRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  epiConcLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textSecondary,
  },
  epiConcValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  epiWarnRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    padding: 9,
  },
  epiWarnText: {
    flex: 1,
    fontSize: 11,
    color: "#92400E",
    fontWeight: "500",
    lineHeight: 16,
  },
});
