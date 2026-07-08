/**
 * Infusion tab — drug selection list.
 * Tapping a drug pill navigates to /infusion/[id] for the full calculator.
 */
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useWeight } from "@/context/WeightContext";
import { useTheme } from "@/context/ThemeContext";
import { useDrawer } from "@/context/DrawerContext";
import { INFUSION_DRUGS } from "@/constants/infusions";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";
import Colors from "@/constants/colors";

const C = Colors.light;

const INFUSION_CATS = [
  { key: "all",       label: "All",         color: "#0EA5E9", match: [] as string[] },
  { key: "inotrope",  label: "Inotropes",   color: "#7C3AED", match: ["Inotrope", "Vasopressor", "Inodilator"] },
  { key: "sedation",  label: "Sedation",    color: "#805AD5", match: ["Sedative", "Opioid", "Analgosedative", "Analgesic"] },
  { key: "resp",      label: "Respiratory", color: "#38A169", match: ["Bronchodilator", "Respiratory"] },
  { key: "cardiac",   label: "Cardiac",     color: "#DD6B20", match: ["Antiarrhythmic", "Vasodilator", "Antihypertensive", "Diuretic"] },
  { key: "nmbd",      label: "NMBDs",       color: "#D69E2E", match: ["NMBD"] },
  { key: "other",     label: "Other",       color: "#718096", match: ["Anticoagulant", "Hormone", "Electrolyte", "Antiepileptic"] },
] as const;
type InfusionCatKey = typeof INFUSION_CATS[number]["key"];

export default function InfusionScreen() {
  const { weightInput: weight, setWeightInput: setWeight } = useWeight();
  const { isDark, toggleDark } = useTheme();
  const { openDrawer } = useDrawer();

  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState<InfusionCatKey>("all");

  const BG    = isDark ? "#0B132B" : C.background;
  const CARD  = isDark ? "#112240" : C.card;
  const BORDER = isDark ? "#233554" : C.border;
  const TEXT  = isDark ? "#FFFFFF" : C.text;
  const MUTED = isDark ? "#8892B0" : C.textMuted;

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: BG }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* ── HEADER ── */}
        <View style={[styles.header, { backgroundColor: CARD, borderBottomColor: BORDER }]}>
          <TouchableOpacity
            onPress={openDrawer}
            style={[styles.hamburgerBtn, { backgroundColor: isDark ? "#0A192F" : "#E8F4F9" }]}
            activeOpacity={0.7}
          >
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : C.tint} />
          </TouchableOpacity>
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
          {/* ── Drug selection section ── */}
          <View style={[styles.section, { backgroundColor: CARD, borderColor: BORDER }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.stepBadge, { backgroundColor: C.tint }]}>
                <Feather name="activity" size={14} color="#fff" />
              </View>
              <Text style={[styles.sectionTitle, { color: TEXT }]}>Select Drug</Text>
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

            {/* Search bar */}
            <View style={[styles.drugSearchBar, { backgroundColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
              <Feather name="search" size={15} color={isDark ? "#4D6E88" : C.tint} />
              <TextInput
                style={[styles.drugSearchInput, { color: TEXT }]}
                value={search}
                onChangeText={setSearch}
                placeholder="Search dopamine, fentanyl, rocuronium…"
                placeholderTextColor={MUTED}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Feather name="x" size={15} color={MUTED} />
                </TouchableOpacity>
              )}
            </View>

            {/* Drug pill grid — tap to navigate */}
            {filteredDrugs.length === 0 ? (
              <View style={styles.noDrugWrap}>
                <Feather name="search" size={28} color={MUTED} />
                <Text style={[styles.noDrugText, { color: MUTED }]}>No drugs match "{search}"</Text>
              </View>
            ) : (
              <View style={styles.drugPillGrid}>
                {filteredDrugs.map((drug) => (
                  <TouchableOpacity
                    key={drug.id}
                    onPress={() => router.push({ pathname: "/infusion/[id]", params: { id: drug.id } })}
                    style={[
                      styles.drugPill,
                      {
                        backgroundColor: isDark ? "#1A2F4E" : "#F1F5F9",
                        borderColor: isDark ? "#2D4A6B" : "#E2E8F0",
                      },
                    ]}
                    activeOpacity={0.72}
                  >
                    <View style={[styles.drugPillDot, { backgroundColor: drug.color }]} />
                    <Text
                      style={[styles.drugPillText, { color: isDark ? "#CCD6F6" : "#1E293B" }]}
                      numberOfLines={2}
                    >
                      {drug.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Empty / hint state */}
          <View style={styles.hintState}>
            <Feather name="activity" size={44} color={C.tint + "33"} />
            <Text style={[styles.hintTitle, { color: TEXT }]}>
              {INFUSION_DRUGS.length} PICU infusion drugs
            </Text>
            <Text style={[styles.hintSubtitle, { color: MUTED }]}>
              Tap any drug above to open its calculator
            </Text>
          </View>

          <ProfessionalFooter />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  hamburgerBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginRight: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  headerLeft: { flex: 1, minWidth: 0, marginRight: 8 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 },
  headerTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  nightBtn: { width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center" },
  weightBadge: { alignItems: "center", width: 80 },
  weightLabel: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 },
  weightInput: {
    borderWidth: 2, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5,
    fontSize: 19, fontWeight: "800", width: 80, textAlign: "center",
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
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 10 },
  stepBadge: { width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "700", flex: 1 },
  stepHint: { fontSize: 11 },
  catChipList: { gap: 7, paddingBottom: 10, paddingTop: 4 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5 },
  catChipText: { fontSize: 12, fontWeight: "600" },
  drugSearchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, marginBottom: 10,
  },
  drugSearchInput: { flex: 1, fontSize: 14, padding: 0 },
  drugPillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  drugPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1.5,
    minWidth: "30%", flexGrow: 1, flexShrink: 1, flexBasis: "30%",
  },
  drugPillDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  drugPillText: { fontSize: 13, fontWeight: "600", flexShrink: 1, lineHeight: 17 },
  noDrugWrap: { alignItems: "center", paddingVertical: 24, gap: 8, width: "100%" },
  noDrugText: { fontSize: 14, fontStyle: "italic", textAlign: "center" },
  hintState: { alignItems: "center", paddingTop: 28, paddingHorizontal: 24, gap: 8 },
  hintTitle: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  hintSubtitle: { fontSize: 13, textAlign: "center" },
});
