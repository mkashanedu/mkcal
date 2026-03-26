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
  StandardConcentration,
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
      style={[styles.drugSearchItem, selected && { backgroundColor: drug.color + "22", borderColor: drug.color }]}
      onPress={() => onSelect(drug)}
      activeOpacity={0.7}
    >
      <View style={[styles.drugDot, { backgroundColor: drug.color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.drugSearchName, selected && { color: drug.color }]}>{drug.name}</Text>
        <Text style={styles.drugSearchCategory}>{drug.category}</Text>
      </View>
      {selected && <Feather name="check-circle" size={18} color={drug.color} />}
    </TouchableOpacity>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// CONCENTRATION PICKER
// ──────────────────────────────────────────────────────────────────────────────
function ConcentrationPicker({
  drug,
  selected,
  onSelect,
  weight,
}: {
  drug: InfusionDrug;
  selected: number;
  onSelect: (idx: number) => void;
  weight: number;
}) {
  return (
    <View style={styles.concContainer}>
      {drug.standardConcentrations.map((c, idx) => {
        const isWeightBased = c.totalDrug_mg === -1;
        const displayConc = isWeightBased
          ? ruleOf6Concentration(
              Number(c.label.split(" ")[0]), // multiplier from label "3 mg/kg..."
              weight,
              c.totalVolume_mL
            )
          : c.concentration_per_mL;
        const concStr = displayConc > 0 ? ` — ${displayConc.toFixed(3)} mg/mL` : "";

        return (
          <TouchableOpacity
            key={idx}
            style={[
              styles.concOption,
              selected === idx && { borderColor: drug.color, backgroundColor: drug.color + "18" },
            ]}
            onPress={() => onSelect(idx)}
            activeOpacity={0.7}
          >
            <View style={styles.concRow}>
              <View style={[styles.radioOuter, selected === idx && { borderColor: drug.color }]}>
                {selected === idx && <View style={[styles.radioInner, { backgroundColor: drug.color }]} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.concLabel, selected === idx && { color: drug.color }]}>
                  {c.label}
                </Text>
                {isWeightBased && weight > 0 && (
                  <Text style={styles.concNote}>For {weight} kg: {(Number(c.label.split(" ")[0]) * weight).toFixed(1)} mg in {c.totalVolume_mL} mL{concStr}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

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
  const [customConc, setCustomConc] = useState("");
  const [useCustomConc, setUseCustomConc] = useState(false);
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
      setUseCustomConc(false);
      setCustomConc("");
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  const getConcentration = (): number => {
    if (useCustomConc) return parseFloat(customConc) || 0;
    if (!selectedDrug) return 0;
    const c = selectedDrug.standardConcentrations[selectedConcIdx];
    if (!c) return 0;
    if (c.totalDrug_mg === -1) {
      const multiplier = parseFloat(c.label.split(" ")[0]) || 0;
      return ruleOf6Concentration(multiplier, weightNum, c.totalVolume_mL);
    }
    return c.concentration_per_mL;
  };

  const concentration = getConcentration();

  const rateMLhr = useMemo(() => {
    if (!doseNum || !weightNum || !concentration) return 0;
    return calculateInfusionRate(doseNum, doseUnit, weightNum, concentration);
  }, [doseNum, doseUnit, weightNum, concentration]);

  const rateStr = formatRate(rateMLhr);
  const rateValid = rateMLhr > 0 && isFinite(rateMLhr);

  const unitOptions = selectedDrug
    ? [selectedDrug.primaryUnit, ...(selectedDrug.alternateUnits ?? [])].filter(
        (u, i, a) => a.indexOf(u) === i
      )
    : DOSE_UNITS;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Infusion Calculator</Text>
            <Text style={styles.headerSubtitle}>mL/hr output for infusion pump</Text>
          </View>
          {/* Weight badge */}
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
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── STEP 1: Drug Search ── */}
          <View style={styles.section}>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}><Text style={styles.stepNumber}>1</Text></View>
              <Text style={styles.stepLabel}>Select Drug</Text>
            </View>

            {/* Drug selector button */}
            <TouchableOpacity
              style={[
                styles.drugSelector,
                selectedDrug && { borderColor: selectedDrug.color, borderWidth: 1.5 },
              ]}
              onPress={() => setShowSearch((s) => !s)}
              activeOpacity={0.8}
            >
              {selectedDrug ? (
                <View style={styles.selectedDrugRow}>
                  <View style={[styles.drugDot, { backgroundColor: selectedDrug.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.selectedDrugName, { color: selectedDrug.color }]}>
                      {selectedDrug.name}
                    </Text>
                    <Text style={styles.selectedDrugCategory}>{selectedDrug.category}</Text>
                  </View>
                  <Feather name={showSearch ? "chevron-up" : "chevron-down"} size={18} color={C.textMuted} />
                </View>
              ) : (
                <View style={styles.selectedDrugRow}>
                  <Feather name="search" size={18} color={C.textMuted} style={{ marginRight: 10 }} />
                  <Text style={{ color: C.textMuted, fontSize: 15 }}>Search drug (dopamine, fentanyl…)</Text>
                  <Feather name="chevron-down" size={18} color={C.textMuted} />
                </View>
              )}
            </TouchableOpacity>

            {/* Search dropdown */}
            {showSearch && (
              <View style={styles.searchDropdown}>
                <View style={styles.searchInputRow}>
                  <Feather name="search" size={16} color={C.textMuted} />
                  <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Type to filter…"
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
                  style={{ maxHeight: 280 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>

          {selectedDrug && (
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* ── STEP 2: Dose Input ── */}
              <View style={styles.section}>
                <View style={styles.stepRow}>
                  <View style={styles.stepBadge}><Text style={styles.stepNumber}>2</Text></View>
                  <Text style={styles.stepLabel}>Enter Desired Dose</Text>
                </View>

                <View style={styles.doseInputRow}>
                  <TextInput
                    style={[styles.doseInput, { borderColor: selectedDrug.color }]}
                    value={doseInput}
                    onChangeText={setDoseInput}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={C.textMuted}
                    selectTextOnFocus
                  />
                  <View style={{ flex: 1 }} />
                  <View style={styles.doseRangeBox}>
                    <Text style={styles.doseRangeLabel}>Range</Text>
                    <Text style={styles.doseRange}>
                      {selectedDrug.minDose} – {selectedDrug.maxDose}
                    </Text>
                  </View>
                </View>

                {/* Typical dose hint */}
                {selectedDrug.typicalDose && (
                  <TouchableOpacity
                    style={styles.hintChip}
                    onPress={() => setDoseInput(String(selectedDrug.typicalDose))}
                  >
                    <Feather name="zap" size={12} color={selectedDrug.color} />
                    <Text style={[styles.hintChipText, { color: selectedDrug.color }]}>
                      Typical: {selectedDrug.typicalDose} {doseUnit}
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
                        doseUnit === u && { backgroundColor: selectedDrug.color, borderColor: selectedDrug.color },
                      ]}
                      onPress={() => setDoseUnit(u)}
                    >
                      <Text style={[styles.unitChipText, doseUnit === u && { color: "#fff" }]}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* ── STEP 3: Concentration ── */}
              <View style={styles.section}>
                <View style={styles.stepRow}>
                  <View style={styles.stepBadge}><Text style={styles.stepNumber}>3</Text></View>
                  <Text style={styles.stepLabel}>Select Concentration</Text>
                </View>

                {/* Standard concentrations */}
                {!useCustomConc && (
                  <ConcentrationPicker
                    drug={selectedDrug}
                    selected={selectedConcIdx}
                    onSelect={setSelectedConcIdx}
                    weight={weightNum}
                  />
                )}

                {/* Custom concentration toggle */}
                <TouchableOpacity
                  style={[styles.customToggle, useCustomConc && { borderColor: selectedDrug.color }]}
                  onPress={() => setUseCustomConc((v) => !v)}
                >
                  <View style={[styles.radioOuter, useCustomConc && { borderColor: selectedDrug.color }]}>
                    {useCustomConc && <View style={[styles.radioInner, { backgroundColor: selectedDrug.color }]} />}
                  </View>
                  <Text style={[styles.customToggleText, useCustomConc && { color: selectedDrug.color }]}>
                    Custom concentration
                  </Text>
                </TouchableOpacity>

                {useCustomConc && (
                  <View style={styles.customConcInputRow}>
                    <TextInput
                      style={[styles.customConcInput, { borderColor: selectedDrug.color }]}
                      value={customConc}
                      onChangeText={setCustomConc}
                      keyboardType="decimal-pad"
                      placeholder="e.g. 0.5"
                      placeholderTextColor={C.textMuted}
                      selectTextOnFocus
                    />
                    <Text style={styles.customConcUnit}>mg/mL</Text>
                  </View>
                )}

                {concentration > 0 && (
                  <View style={styles.concSummary}>
                    <Feather name="info" size={13} color={C.tint} />
                    <Text style={styles.concSummaryText}>
                      Using: <Text style={{ color: C.tint, fontWeight: "700" }}>{concentration.toFixed(4)} mg/mL</Text> (or units/mL)
                    </Text>
                  </View>
                )}
              </View>

              {/* ── RESULT BOX ── */}
              <View style={[styles.resultBox, rateValid && { borderColor: selectedDrug.color }]}>
                <View style={styles.resultHeader}>
                  <Feather name="activity" size={20} color={rateValid ? selectedDrug.color : C.textMuted} />
                  <Text style={styles.resultHeaderText}>Pump Rate</Text>
                </View>

                <Text style={[styles.resultRate, { color: rateValid ? selectedDrug.color : C.textMuted }]}>
                  {rateStr}
                </Text>

                {rateValid && (
                  <>
                    <View style={styles.resultDivider} />
                    <View style={styles.resultDetailRow}>
                      <ResultDetail label="Drug" value={selectedDrug.name} />
                      <ResultDetail label="Dose" value={`${doseInput} ${doseUnit}`} />
                      <ResultDetail label="Weight" value={`${weight} kg`} />
                      <ResultDetail label="Conc." value={`${concentration.toFixed(4)} mg/mL`} />
                    </View>
                  </>
                )}

                {!rateValid && (
                  <Text style={styles.resultPlaceholder}>
                    Enter dose, weight & concentration to calculate
                  </Text>
                )}
              </View>

              {/* ── Drug notes & warnings ── */}
              {selectedDrug.notes && (
                <View style={styles.infoCard}>
                  <Feather name="book-open" size={14} color={C.tint} style={{ marginRight: 8, marginTop: 1 }} />
                  <Text style={styles.infoCardText}>{selectedDrug.notes}</Text>
                </View>
              )}
              {selectedDrug.warnings && selectedDrug.warnings.map((w, i) => (
                <View key={i} style={styles.warningCard}>
                  <Feather name="alert-triangle" size={13} color="#B7791F" style={{ marginRight: 8, marginTop: 1 }} />
                  <Text style={styles.warningCardText}>{w}</Text>
                </View>
              ))}

              {selectedDrug.reference && (
                <Text style={styles.referenceText}>Ref: {selectedDrug.reference}</Text>
              )}
            </Animated.View>
          )}

          {/* Indication hint below search */}
          {!selectedDrug && (
            <View style={styles.emptyState}>
              <Feather name="activity" size={48} color={C.tint + "44"} />
              <Text style={styles.emptyTitle}>Select a drug above</Text>
              <Text style={styles.emptySubtitle}>
                Choose from dopamine, norepinephrine, fentanyl, midazolam, heparin, and 20+ ICU infusion drugs
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
                {INFUSION_DRUGS.slice(0, 8).map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.quickChip, { borderColor: d.color }]}
                    onPress={() => handleDrugSelect(d)}
                  >
                    <View style={[styles.drugDot, { backgroundColor: d.color, width: 8, height: 8, borderRadius: 4 }]} />
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
  headerTitle: { fontSize: 22, fontWeight: "800", color: C.text, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  weightBadge: { alignItems: "center" },
  weightLabel: { fontSize: 9, color: C.tint, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 },
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
    backgroundColor: C.tint + "0F",
  },

  section: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    }),
  },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  stepBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: C.tint, justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  stepNumber: { color: "#fff", fontSize: 12, fontWeight: "800" },
  stepLabel: { fontSize: 16, fontWeight: "700", color: C.text },

  drugSelector: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: C.background,
  },
  selectedDrugRow: { flexDirection: "row", alignItems: "center" },
  drugDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  selectedDrugName: { fontSize: 16, fontWeight: "700" },
  selectedDrugCategory: { fontSize: 12, color: C.textMuted, marginTop: 2 },

  searchDropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
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
    borderWidth: 0,
    borderRadius: 0,
  },
  drugSearchName: { fontSize: 14, fontWeight: "600", color: C.text },
  drugSearchCategory: { fontSize: 11, color: C.textMuted, marginTop: 1 },

  doseInputRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  doseInput: {
    fontSize: 32,
    fontWeight: "800",
    color: C.text,
    borderBottomWidth: 2,
    paddingBottom: 4,
    minWidth: 120,
    letterSpacing: -0.5,
  },
  doseRangeBox: { alignItems: "flex-end" },
  doseRangeLabel: { fontSize: 10, color: C.textMuted, fontWeight: "600", letterSpacing: 0.5 },
  doseRange: { fontSize: 13, color: C.textSecondary, fontWeight: "600", marginTop: 2 },

  hintChip: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 5,
  },
  hintChipText: { fontSize: 12, fontWeight: "600" },

  unitRow: { paddingTop: 14, gap: 8 },
  unitChip: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  unitChipText: { fontSize: 13, color: C.textSecondary, fontWeight: "600" },

  concContainer: { gap: 10 },
  concOption: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
  },
  concRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: C.border,
    justifyContent: "center", alignItems: "center",
    marginTop: 1,
  },
  radioInner: { width: 8, height: 8, borderRadius: 4 },
  concLabel: { fontSize: 13, fontWeight: "600", color: C.text },
  concNote: { fontSize: 11, color: C.textMuted, marginTop: 3 },

  customToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  customToggleText: { fontSize: 14, color: C.textSecondary, fontWeight: "600" },
  customConcInputRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 10 },
  customConcInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 24,
    fontWeight: "800",
    color: C.text,
  },
  customConcUnit: { fontSize: 15, color: C.textSecondary, fontWeight: "600" },

  concSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: C.tint + "0E",
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  concSummaryText: { fontSize: 13, color: C.textSecondary },

  resultBox: {
    margin: 16,
    marginTop: 14,
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: C.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 4 },
      web: { boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
    }),
  },
  resultHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  resultHeaderText: { fontSize: 13, color: C.textMuted, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  resultRate: { fontSize: 52, fontWeight: "900", letterSpacing: -2, lineHeight: 58 },
  resultPlaceholder: { fontSize: 14, color: C.textMuted, marginTop: 8, fontStyle: "italic" },
  resultDivider: { height: 1, backgroundColor: C.border, marginVertical: 14 },
  resultDetailRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  resultDetail: { minWidth: "40%" },
  resultDetailLabel: { fontSize: 10, color: C.textMuted, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 },
  resultDetailValue: { fontSize: 14, fontWeight: "700", color: C.text },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: C.tint + "0E",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: C.tint,
  },
  infoCardText: { flex: 1, fontSize: 13, color: C.textSecondary, lineHeight: 19 },
  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#D97706",
  },
  warningCardText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 19 },
  referenceText: { marginHorizontal: 16, marginBottom: 8, fontSize: 11, color: C.textMuted, fontStyle: "italic" },

  emptyState: { margin: 24, alignItems: "center", paddingTop: 20 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: C.text, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: C.textMuted, textAlign: "center", marginTop: 8, lineHeight: 21 },

  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    gap: 6,
  },
  quickChipText: { fontSize: 13, fontWeight: "700" },
});
