import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { CATEGORIES, DRUGS, DrugCategory, calculateDose } from "@/constants/drugs";
import { useWeight } from "@/context/WeightContext";

const QUICK_WEIGHTS = [3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 70];

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors.light;
  const { weight, setWeight, weightInput, setWeightInput } = useWeight();

  const [selectedCategory, setSelectedCategory] = useState<DrugCategory | null>(null);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  function handleWeightChange(text: string) {
    setWeightInput(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0 && num <= 150) {
      setWeight(num);
    }
  }

  const drugsToShow = useMemo(() => {
    if (!selectedCategory) return DRUGS;
    return DRUGS.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const categories = Object.entries(CATEGORIES) as [DrugCategory, typeof CATEGORIES[DrugCategory]][];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#080E16" : "#F0F4F8" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: isDark ? "#0A1520" : "#FFFFFF",
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? "#E8F0FE" : "#0D1B2A", fontFamily: "Inter_700Bold" },
          ]}
        >
          Dose Calculator
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: isDark ? "#5A7A96" : "#8A9BB0", fontFamily: "Inter_400Regular" },
          ]}
        >
          Enter patient weight to calculate doses
        </Text>

        {/* Weight Section */}
        <View
          style={[
            styles.weightSection,
            { backgroundColor: isDark ? "#1E2D3D" : "#F8FAFC" },
          ]}
        >
          <View style={styles.weightInputRow}>
            <Feather name="user" size={20} color={colors.tint} />
            <Text
              style={[
                styles.weightInputLabel,
                { color: isDark ? "#E8F0FE" : "#0D1B2A", fontFamily: "Inter_500Medium" },
              ]}
            >
              Patient Weight
            </Text>
            <View style={styles.weightInputContainer}>
              <TextInput
                style={[
                  styles.weightInput,
                  {
                    color: isDark ? "#E8F0FE" : "#0D1B2A",
                    backgroundColor: isDark ? "#0D1B2A" : "#FFFFFF",
                    fontFamily: "Inter_700Bold",
                  },
                ]}
                value={weightInput}
                onChangeText={handleWeightChange}
                keyboardType="decimal-pad"
                selectTextOnFocus
                maxLength={5}
              />
              <Text
                style={[
                  styles.kgLabel,
                  { color: colors.tint, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                kg
              </Text>
            </View>
          </View>

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
                    borderColor: weight === w ? colors.tint : isDark ? "#1E2D3D" : "#E2E8F0",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quickWeightText,
                    {
                      color: weight === w ? "#FFFFFF" : isDark ? "#8A9BB0" : "#4A5568",
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
                backgroundColor: selectedCategory === null ? colors.tint : isDark ? "#1E2D3D" : "#F0F4F8",
              },
            ]}
          >
            <Text
              style={[
                styles.catChipText,
                {
                  color: selectedCategory === null ? "#fff" : isDark ? "#8A9BB0" : "#4A5568",
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
                    selectedCategory === key ? val.color : isDark ? "#1E2D3D" : "#F0F4F8",
                },
              ]}
            >
              <Text
                style={[
                  styles.catChipText,
                  {
                    color: selectedCategory === key ? "#fff" : isDark ? "#8A9BB0" : "#4A5568",
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

      {/* Drug Dose Table */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 84 : 90) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {drugsToShow.map((drug) => {
          const cat = CATEGORIES[drug.category];
          return (
            <View
              key={drug.id}
              style={[
                styles.drugBlock,
                { backgroundColor: isDark ? "#0F1E2E" : "#FFFFFF" },
              ]}
            >
              <View style={styles.drugBlockHeader}>
                <View style={[styles.catStripe, { backgroundColor: cat.color }]} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.drugBlockName,
                      { color: isDark ? "#E8F0FE" : "#0D1B2A", fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {drug.name}
                  </Text>
                  {drug.genericName ? (
                    <Text
                      style={[
                        styles.drugBlockGeneric,
                        { color: isDark ? "#5A7A96" : "#8A9BB0", fontFamily: "Inter_400Regular" },
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
              </View>

              {drug.doses.map((dose, i) => {
                const calc = calculateDose(dose, weight);
                return (
                  <View
                    key={i}
                    style={[
                      styles.doseRow,
                      {
                        borderTopColor: isDark ? "#1E2D3D" : "#F0F4F8",
                        borderTopWidth: i === 0 ? 0 : 1,
                      },
                    ]}
                  >
                    <View style={styles.doseLeft}>
                      <View style={[styles.routeBadge, { backgroundColor: isDark ? "#1E2D3D" : "#F0F4F8" }]}>
                        <Text
                          style={[
                            styles.routeText,
                            { color: colors.tint, fontFamily: "Inter_600SemiBold" },
                          ]}
                        >
                          {dose.route}
                        </Text>
                      </View>
                      {dose.frequency ? (
                        <Text
                          style={[
                            styles.freqText,
                            { color: isDark ? "#5A7A96" : "#8A9BB0", fontFamily: "Inter_400Regular" },
                          ]}
                        >
                          {dose.frequency}
                        </Text>
                      ) : null}
                      {dose.notes ? (
                        <Text
                          style={[
                            styles.noteText,
                            { color: isDark ? "#4A6A88" : "#94A8C0", fontFamily: "Inter_400Regular" },
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
                          { color: isDark ? "#5A7A96" : "#8A9BB0", fontFamily: "Inter_400Regular" },
                        ]}
                        numberOfLines={1}
                      >
                        {calc.range}
                      </Text>
                      {dose.maxDose ? (
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
  headerTitle: { fontSize: 24, letterSpacing: -0.5, marginBottom: 2 },
  headerSubtitle: { fontSize: 13, marginBottom: 14 },
  weightSection: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  weightInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  weightInputLabel: { flex: 1, fontSize: 15 },
  weightInputContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  weightInput: {
    width: 80,
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 22,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  kgLabel: { fontSize: 16 },
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
  catStripe: { width: 4, height: 40, borderRadius: 2 },
  drugBlockName: { fontSize: 15 },
  drugBlockGeneric: { fontSize: 12, marginTop: 1 },
  catTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catTagText: { fontSize: 10 },
  doseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    paddingTop: 10,
    gap: 8,
  },
  doseLeft: { flex: 1, gap: 4 },
  routeBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  routeText: { fontSize: 11 },
  freqText: { fontSize: 11 },
  noteText: { fontSize: 11, lineHeight: 16 },
  doseRight: { alignItems: "flex-end", maxWidth: 160, gap: 2 },
  calcDose: { fontSize: 16, textAlign: "right" },
  doseRange: { fontSize: 11, textAlign: "right" },
  maxDose: { fontSize: 11, textAlign: "right" },
});
