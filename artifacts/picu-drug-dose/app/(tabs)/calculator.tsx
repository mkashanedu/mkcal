import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { CATEGORIES, DRUGS, DrugCategory } from "@/constants/drugs";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, useWeight } from "@/context/WeightContext";
import { useDrawer } from "@/context/DrawerContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";
import { StarButton } from "@/components/StarButton";

const QUICK_WEIGHTS = [0.5, 1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 70, 100, 150];
const LBS_TO_KG = 0.453592;

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const colors = Colors.light;
  const { weight, setWeight, weightInput, setWeightInput, resetWeight } = useWeight();
  const { isFav, toggleFav } = useFavorites();
  const { openDrawer } = useDrawer();

  const [selectedCategory, setSelectedCategory] = useState<DrugCategory | null>(null);
  const [search, setSearch] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [lbsInput, setLbsInput] = useState("");
  const [weightWarning, setWeightWarning] = useState(false);
  const [ageInput, setAgeInput] = useState("");
  const [ageUnit, setAgeUnit] = useState<"yrs" | "mths">("yrs");
  const topPadding = insets.top;

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
    return DRUGS.filter((d) => {
      const matchCat = !selectedCategory || d.category === selectedCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.genericName?.toLowerCase().includes(q) ?? false) ||
        d.indications?.some((i) => i.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

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
          <TouchableOpacity
            onPress={openDrawer}
            style={[styles.hamburgerBtn, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
            activeOpacity={0.7}
          >
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : Colors.light.tint} />
          </TouchableOpacity>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_700Bold" },
              ]}
              numberOfLines={1}
            >
              MKashanEdu
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" },
              ]}
            >
              Pediatric Clinical Guide • Based on Harriet Lane & Nelson's • 95+ drugs
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

        {/* Compact 2-row input grid: Weight + Age */}
        <View style={[styles.inputGrid, { backgroundColor: isDark ? "#233554" : "#F8FAFC" }]}>
          {/* Row 1 — Weight */}
          <View style={styles.inputRow}>
            <Feather name="user" size={13} color={colors.tint} />
            <Text style={[styles.inputRowLabel, { color: isDark ? "#CCD6F6" : "#4A5568", fontFamily: "Inter_500Medium" }]}>
              Weight
            </Text>
            <TextInput
              style={[
                styles.compactInput,
                {
                  color: weightWarning ? "#E53E3E" : isDark ? "#FFFFFF" : "#0D1B2A",
                  backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
                  fontFamily: "Inter_700Bold",
                  borderColor: weightWarning ? "#E53E3E" : "transparent",
                  borderWidth: weightWarning ? 1.5 : 0,
                },
              ]}
              value={displayInput}
              onChangeText={handleWeightChange}
              keyboardType="decimal-pad"
              selectTextOnFocus
              maxLength={6}
              placeholder="–"
              placeholderTextColor={isDark ? "#4D6E88" : "#CBD5E0"}
            />
            <View style={[styles.pillGroup, { backgroundColor: isDark ? "#0A192F" : "#E8EDF2" }]}>
              {(["kg", "lbs"] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => handleUnitToggle(u)}
                  style={[styles.pill, weightUnit === u && { backgroundColor: colors.tint }]}
                >
                  <Text style={[styles.pillText, { color: weightUnit === u ? "#fff" : isDark ? "#8892B0" : "#4A5568", fontFamily: "Inter_600SemiBold" }]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {weightUnit === "lbs" && weight > 0 && (
              <Text style={[styles.convText, { color: colors.tint, fontFamily: "Inter_600SemiBold" }]}>
                ={weight}kg
              </Text>
            )}
            <View style={styles.resetMiniSpacer} />
            <TouchableOpacity onPress={handleReset} style={styles.resetMini} activeOpacity={0.7}>
              <Feather name="rotate-ccw" size={12} color={isDark ? "#8892B0" : "#4A5568"} />
            </TouchableOpacity>
          </View>

          {weightWarning && (
            <Text style={styles.weightWarning}>
              ⚠ {MIN_WEIGHT_KG}–{MAX_WEIGHT_KG} kg — dose capped
            </Text>
          )}

          {/* Row 2 — Age */}
          <View style={styles.inputRow}>
            <Feather name="clock" size={13} color={colors.tint} />
            <Text style={[styles.inputRowLabel, { color: isDark ? "#CCD6F6" : "#4A5568", fontFamily: "Inter_500Medium" }]}>
              Age
            </Text>
            <TextInput
              style={[
                styles.compactInput,
                {
                  color: isDark ? "#FFFFFF" : "#0D1B2A",
                  backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
                  fontFamily: "Inter_700Bold",
                },
              ]}
              value={ageInput}
              onChangeText={setAgeInput}
              keyboardType="decimal-pad"
              selectTextOnFocus
              maxLength={4}
              placeholder="–"
              placeholderTextColor={isDark ? "#4D6E88" : "#CBD5E0"}
            />
            <View style={[styles.pillGroup, { backgroundColor: isDark ? "#0A192F" : "#E8EDF2" }]}>
              {(["yrs", "mths"] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setAgeUnit(u)}
                  style={[styles.pill, ageUnit === u && { backgroundColor: colors.tint }]}
                >
                  <Text style={[styles.pillText, { color: ageUnit === u ? "#fff" : isDark ? "#8892B0" : "#4A5568", fontFamily: "Inter_600SemiBold" }]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick weight pills */}
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
                    backgroundColor: weight === w ? colors.tint : isDark ? "#0D1B2A" : "#FFFFFF",
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

        {/* Search bar */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
          <Feather name="search" size={16} color={isDark ? "#4D6E88" : Colors.light.tint} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}
            placeholder="Search drugs, indications..."
            placeholderTextColor={isDark ? "#8892B0" : "#8A9BB0"}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={isDark ? "#8892B0" : "#8A9BB0"} />
            </Pressable>
          )}
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

      {/* Scrollable content — flex:1 so it fills all remaining space */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 84 : 90) },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
                {/* Tappable area → full drug detail (Harriet Lane/Nelson's) */}
                <TouchableOpacity
                  style={styles.drugBlockTapArea}
                  onPress={() => router.push({ pathname: "/drug/[id]", params: { id: drug.id } })}
                  activeOpacity={0.75}
                >
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
                  <Feather name="chevron-right" size={16} color={cat.color} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
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
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 4,
    marginRight: 4,
  },
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
  // Compact 2-row input grid
  inputGrid: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputRowLabel: {
    fontSize: 12,
    width: 44,
  },
  compactInput: {
    width: 70,
    height: 32,
    borderRadius: 8,
    paddingHorizontal: 6,
    fontSize: 17,
    textAlign: "center",
  },
  pillGroup: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillText: { fontSize: 11 },
  convText: { fontSize: 11 },
  resetMiniSpacer: { flex: 1 },
  resetMini: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  weightWarning: {
    fontSize: 10,
    color: "#E53E3E",
    fontWeight: "700",
    marginLeft: 4,
  },
  quickWeightList: { gap: 5, paddingTop: 2 },
  quickWeightBtn: {
    width: 40,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  quickWeightText: { fontSize: 12 },
  catList: { gap: 6, paddingBottom: 10 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  catChipText: { fontSize: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  scrollContent: { padding: 12, gap: 10 },

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
    gap: 0,
  },
  drugBlockTapArea: {
    flex: 1,
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
