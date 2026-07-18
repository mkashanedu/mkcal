import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { useTheme } from "@/context/ThemeContext";
import { useDrawer } from "@/context/DrawerContext";
import { useWeight, MIN_WEIGHT_KG, MAX_WEIGHT_KG } from "@/context/WeightContext";
import { FORMULARY_CATEGORIES, FORMULARY_DRUGS, FormularyCategory } from "@/data/formularyData";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

export default function FormularyScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { openDrawer } = useDrawer();
  const {
    weight, setWeight, weightInput, setWeightInput, weightUnit, setWeightUnit,
    age, setAge, ageInput, setAgeInput, ageUnit, setAgeUnit,
  } = useWeight();
  const colors = Colors.light;
  const topPadding = insets.top;

  const [profileOpen, setProfileOpen] = useState(false);

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";
  const borderColor = isDark ? "#233554" : "#E4EDF4";
  const inputBg = isDark ? "#0A192F" : "#F0F4F8";
  const accent = "#0891B2";

  const categories = Object.entries(FORMULARY_CATEGORIES) as [
    FormularyCategory,
    (typeof FORMULARY_CATEGORIES)[FormularyCategory]
  ][];

  // Weight display helpers
  const displayWeight =
    weightUnit === "lbs"
      ? `${(weight * 2.20462).toFixed(1)} lbs`
      : `${weight} kg`;
  const displayAge =
    ageUnit === "months" ? `${age} mo` : `${age} yr`;

  function commitWeight(text: string) {
    const num = parseFloat(text);
    if (isNaN(num) || num <= 0) return;
    if (weightUnit === "lbs") {
      const kg = Math.min(Math.max(num / 2.20462, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
      setWeight(parseFloat(kg.toFixed(2)));
    } else {
      const kg = Math.min(Math.max(num, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
      setWeight(parseFloat(kg.toFixed(2)));
    }
  }

  function commitAge(text: string) {
    const num = parseFloat(text);
    if (isNaN(num) || num < 0) return;
    setAge(num);
  }

  function handleWeightUnitToggle(unit: "kg" | "lbs") {
    if (unit === weightUnit) return;
    if (unit === "lbs") {
      const lbs = (weight * 2.20462).toFixed(1);
      setWeightInput(lbs);
    } else {
      setWeightInput(weight.toString());
    }
    setWeightUnit(unit);
  }

  function handleAgeUnitToggle(unit: "years" | "months") {
    if (unit === ageUnit) return;
    setAgeUnit(unit);
    setAgeInput(age.toString());
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { paddingTop: topPadding + 12, backgroundColor: isDark ? "#0A192F" : "#FFFFFF" },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={openDrawer}
            style={[styles.hamburgerBtn, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
            activeOpacity={0.7}
          >
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : colors.tint} />
          </TouchableOpacity>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={[styles.headerTitle, { color: textPrimary, fontFamily: "Inter_700Bold" }]}
              numberOfLines={1}
            >
              Formulary
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: textMuted, fontFamily: "Inter_400Regular" }]}
              numberOfLines={1}
            >
              Non-emergency medications by route
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleDark}
            style={[styles.nightToggle, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
            activeOpacity={0.7}
          >
            <Feather name={isDark ? "sun" : "moon"} size={16} color={isDark ? "#FFD700" : colors.tint} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* ── Quick Patient Profile ── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setProfileOpen((v) => !v)}
          style={[styles.profileCard, { backgroundColor: cardBg, borderColor }]}
        >
          <View style={styles.profileRow}>
            <View style={[styles.profileIconWrap, { backgroundColor: accent + "18" }]}>
              <Feather name="user" size={16} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.profileLabel, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>
                QUICK PATIENT PROFILE
              </Text>
              <Text style={[styles.profileSummary, { color: textPrimary, fontFamily: "Inter_700Bold" }]}>
                {displayWeight} · {displayAge}
              </Text>
            </View>
            <View style={[styles.editBadge, { backgroundColor: accent + "18" }]}>
              <Feather name={profileOpen ? "chevron-up" : "edit-2"} size={14} color={accent} />
              <Text style={[styles.editBadgeText, { color: accent, fontFamily: "Inter_600SemiBold" }]}>
                {profileOpen ? "Done" : "Edit"}
              </Text>
            </View>
          </View>

          {profileOpen && (
            <View style={[styles.profileInputArea, { borderTopColor: borderColor }]}>
              {/* Weight row */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>
                  WEIGHT
                </Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.profileInput, { backgroundColor: inputBg, borderColor: accent + "40", color: textPrimary, fontFamily: "Inter_400Regular" }]}
                    value={weightInput}
                    onChangeText={(t) => { setWeightInput(t); }}
                    onBlur={() => commitWeight(weightInput)}
                    onSubmitEditing={() => commitWeight(weightInput)}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder={weightUnit === "lbs" ? "e.g. 44" : "e.g. 20"}
                    placeholderTextColor={textMuted}
                  />
                  <View style={[styles.unitToggle, { backgroundColor: inputBg, borderColor }]}>
                    {(["kg", "lbs"] as const).map((u) => (
                      <TouchableOpacity
                        key={u}
                        onPress={() => handleWeightUnitToggle(u)}
                        style={[styles.unitBtn, weightUnit === u && { backgroundColor: accent }]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.unitBtnText, { color: weightUnit === u ? "#fff" : textMuted, fontFamily: "Inter_600SemiBold" }]}>
                          {u}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {weightUnit === "lbs" && (
                  <Text style={[styles.convertHint, { color: accent, fontFamily: "Inter_400Regular" }]}>
                    = {weight} kg (stored internally)
                  </Text>
                )}
              </View>

              {/* Age row */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>
                  AGE
                </Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.profileInput, { backgroundColor: inputBg, borderColor: accent + "40", color: textPrimary, fontFamily: "Inter_400Regular" }]}
                    value={ageInput}
                    onChangeText={(t) => { setAgeInput(t); }}
                    onBlur={() => commitAge(ageInput)}
                    onSubmitEditing={() => commitAge(ageInput)}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder="e.g. 5"
                    placeholderTextColor={textMuted}
                  />
                  <View style={[styles.unitToggle, { backgroundColor: inputBg, borderColor }]}>
                    {(["years", "months"] as const).map((u) => (
                      <TouchableOpacity
                        key={u}
                        onPress={() => handleAgeUnitToggle(u)}
                        style={[styles.unitBtn, ageUnit === u && { backgroundColor: accent }]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.unitBtnText, { color: ageUnit === u ? "#fff" : textMuted, fontFamily: "Inter_600SemiBold" }]}>
                          {u === "years" ? "yr" : "mo"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={[styles.profileNote, { backgroundColor: accent + "0D", borderColor: accent + "30" }]}>
                <Feather name="info" size={12} color={accent} style={{ marginRight: 6 }} />
                <Text style={[styles.profileNoteText, { color: accent, fontFamily: "Inter_400Regular" }]}>
                  Weight is saved globally — all drug detail cards will calculate doses for this patient.
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* ── Category Grid ── */}
        <Text style={[styles.sectionLabel, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>
          BROWSE BY CATEGORY
        </Text>
        <View style={styles.grid}>
          {categories.map(([key, cat]) => {
            const count = FORMULARY_DRUGS.filter((d) => d.category === key).length;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => router.push(`/formulary/${key}` as any)}
                activeOpacity={0.85}
                style={[styles.tile, { backgroundColor: cardBg, borderColor }]}
              >
                <View style={[styles.tileIconWrap, { backgroundColor: cat.color + "18" }]}>
                  <Feather name={cat.icon as any} size={26} color={cat.color} />
                </View>
                <Text style={[styles.tileLabel, { color: textPrimary, fontFamily: "Inter_700Bold" }]}>
                  {cat.label}
                </Text>
                <Text style={[styles.tileDesc, { color: textMuted, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
                  {cat.description}
                </Text>
                <View style={[styles.tileCountBadge, { backgroundColor: cat.color + "18" }]}>
                  <Text style={[styles.tileCountText, { color: cat.color, fontFamily: "Inter_600SemiBold" }]}>
                    {count} {count === 1 ? "drug" : "drugs"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <ProfessionalFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 14 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nightToggle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, marginTop: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },

  // ── Patient Profile Card ──
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  profileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  profileLabel: { fontSize: 10, letterSpacing: 0.7, marginBottom: 2 },
  profileSummary: { fontSize: 16, letterSpacing: -0.3 },
  editBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBadgeText: { fontSize: 12 },
  profileInputArea: {
    borderTopWidth: 1,
    padding: 14,
    gap: 14,
  },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 10, letterSpacing: 0.7 },
  inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  profileInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 7,
    fontSize: 16,
  },
  unitToggle: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  unitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unitBtnText: { fontSize: 12 },
  convertHint: { fontSize: 11, marginTop: 2 },
  profileNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 2,
  },
  profileNoteText: { fontSize: 11, lineHeight: 16, flex: 1 },

  // ── Category Grid ──
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    width: "47%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tileIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  tileLabel: { fontSize: 15, letterSpacing: -0.2 },
  tileDesc: { fontSize: 12, lineHeight: 16, minHeight: 32 },
  tileCountBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  tileCountText: { fontSize: 10.5 },
});
