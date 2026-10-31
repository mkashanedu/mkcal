import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { CATEGORIES, DRUGS, calculateDose } from "@/constants/allDrugs";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { useFavorites } from "@/context/FavoritesContext";
import { StarButton } from "@/components/StarButton";

export default function DrugDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = Colors.light;
  const { weight, age, ageUnit, ageConfirmed } = useWeight();
  const ageMonths =
    ageConfirmed && Number.isFinite(age) && age > 0
      ? ageUnit === "years"
        ? age * 12
        : age
      : undefined;
  const { isFav, toggleFav } = useFavorites();
  const weightValid = Number.isFinite(weight) && weight > 0;

  const drug = DRUGS.find((d) => d.id === id);

  if (!drug) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#0B132B" : "#F0F9FF", justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_500Medium", fontSize: 16 }}>
          Drug not found
        </Text>
      </View>
    );
  }

  const cat = CATEGORIES[drug.category];
  // Category colors are tuned for light backgrounds; in dark mode they are
  // lightened so dose values and badges stay readable on the dark cards.
  const themed = (hex: string) => (isDark ? lightenColor(hex, 0.5) : hex);
  const accent = themed(cat.color);
  const danger = themed(colors.danger);
  const f = isFav(drug.id);
  const topOffset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0B132B" : "#F0F9FF" }]}>
      {/* Custom Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topOffset + 12,
            backgroundColor: cat.color,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() =>
              toggleFav({
                id: drug.id,
                type: "drug",
                label: drug.name,
                color: cat.color,
                category: cat.label,
                notes: drug.indications.slice(0, 2).join(" · "),
              })
            }
            style={styles.backBtn}
          >
            <Feather
              name={f ? "star" : "star"}
              size={22}
              color={f ? "#F59E0B" : "rgba(255,255,255,0.7)"}
            />
          </Pressable>
        </View>

        <View style={styles.headerContent}>
          <View style={[styles.catBadge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
            <Text style={[styles.catBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
              {cat.label}
            </Text>
          </View>
          <Text style={[styles.drugTitle, { fontFamily: "Inter_700Bold" }]}>
            {drug.name}
          </Text>
          {drug.genericName && (
            <Text style={[styles.genericTitle, { fontFamily: "Inter_400Regular" }]}>
              {drug.genericName}
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Weight Banner */}
        <View
          style={[
            styles.weightBanner,
            { backgroundColor: isDark ? "#112240" : "#FFFFFF" },
          ]}
        >
          <Feather name="user" size={16} color={colors.tint} />
          <Text
            style={[
              styles.weightBannerText,
              { color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_400Regular" },
            ]}
          >
            {weightValid ? "Calculated for" : "Weight invalid — calculations disabled"}
          </Text>
          <Text
            style={[
              styles.weightBannerValue,
              { color: colors.tint, fontFamily: "Inter_700Bold" },
            ]}
          >
            {weightValid ? `${weight} kg` : "Invalid"}
          </Text>
        </View>
        {!weightValid && (
          <View style={styles.invalidWeightNotice}>
            <Feather name="alert-triangle" size={14} color="#FFFFFF" />
            <Text style={[styles.invalidWeightText, { fontFamily: "Inter_600SemiBold" }]}>
              Enter a valid positive weight to calculate weight-based doses.
            </Text>
          </View>
        )}

        {/* Doses */}
        <SectionHeader title="Dosing" icon="activity" color={accent} isDark={isDark} />
        <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
          {drug.doses.map((dose, i) => {
            const calc = calculateDose(dose, weight, ageMonths);
            return (
              <View
                key={i}
                style={[
                  styles.doseBlock,
                  {
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderTopColor: isDark ? "#0A192F" : "#EBF5FB",
                  },
                ]}
              >
                <View style={styles.doseTop}>
                  <View style={[styles.routeBadge, { backgroundColor: accent + "22" }]}>
                    <Feather name="arrow-right-circle" size={12} color={accent} />
                    <Text style={[styles.routeText, { color: accent, fontFamily: "Inter_600SemiBold" }]}>
                      {dose.route}
                    </Text>
                  </View>
                  {dose.frequency && (
                    <Text style={[styles.freqText, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
                      {dose.frequency}
                    </Text>
                  )}
                </View>
                <View style={styles.doseCalcRow}>
                  <View>
                    <Text style={[styles.calcLabel, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
                      Calculated Dose
                    </Text>
                    <Text style={[styles.calcValue, { color: accent, fontFamily: "Inter_700Bold" }]}>
                      {calc.dose}
                    </Text>
                    <Text style={[styles.perKgText, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
                      {calc.range}
                    </Text>
                  </View>
                  {dose.maxDose && (
                    <View style={[styles.maxDoseBox, { backgroundColor: danger + "15" }]}>
                      <Text style={[styles.maxDoseLabel, { color: danger, fontFamily: "Inter_500Medium" }]}>
                        Max Dose
                      </Text>
                      <Text style={[styles.maxDoseValue, { color: danger, fontFamily: "Inter_700Bold" }]}>
                        {dose.maxDose}
                      </Text>
                    </View>
                  )}
                </View>
                {calc.exceedsAdultMax && calc.adultMaxLabel && (
                  <View style={styles.maxDoseWarning}>
                    <Feather name="alert-octagon" size={15} color="#FFFFFF" />
                    <Text style={[styles.maxDoseWarningText, { fontFamily: "Inter_700Bold" }]}>
                      {calc.adultMaxLabel}
                    </Text>
                  </View>
                )}
                {dose.notes && (
                  <View style={[styles.noteBox, { backgroundColor: isDark ? "#0A192F" : "#F4F9FC" }]}>
                    <Feather name="info" size={12} color={isDark ? "#A8B8DC" : "#8A9BB0"} />
                    <Text style={[styles.noteText, { color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_400Regular" }]}>
                      {dose.notes}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Indications */}
        <SectionHeader title="Indications" icon="check-circle" color={accent} isDark={isDark} />
        <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
          {drug.indications.map((ind, i) => (
            <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
              <View style={[styles.listDot, { backgroundColor: accent }]} />
              <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                {ind}
              </Text>
            </View>
          ))}
        </View>

        {/* Contraindications */}
        {drug.contraindications && drug.contraindications.length > 0 && (
          <>
            <SectionHeader title="Contraindications" icon="x-circle" color={danger} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              {drug.contraindications.map((c, i) => (
                <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                  <View style={[styles.listDot, { backgroundColor: danger }]} />
                  <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {c}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Warnings */}
        {drug.warnings && drug.warnings.length > 0 && (
          <>
            <SectionHeader title="Warnings" icon="alert-triangle" color={themed("#E67E22")} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              {drug.warnings.map((w, i) => (
                <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                  <Feather name="alert-triangle" size={14} color={themed("#E67E22")} />
                  <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {w}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Formulations */}
        {drug.formulations && drug.formulations.length > 0 && (
          <>
            <SectionHeader title="Formulations" icon="package" color={isDark ? "#A8B8DC" : "#8A9BB0"} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              <View style={styles.formulationsRow}>
                {drug.formulations.map((f, i) => (
                  <View key={i} style={[styles.formulationTag, { backgroundColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                    <Text style={[styles.formulationText, { color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_400Regular" }]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Renal Dose Adjustments */}
        {drug.renalAdjustment && drug.renalAdjustment.length > 0 && (
          <>
            <SectionHeader title="Renal Dose Adjustment" icon="filter" color={themed("#0C7B9C")} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF", overflow: "visible" }]}>
              <View style={[styles.renalHeader, { backgroundColor: themed("#0C7B9C") + "18", borderBottomWidth: 1, borderBottomColor: isDark ? "#233554" : "#E8F4F8" }]}>
                <Text style={[styles.renalHeaderCell, { color: themed("#0C7B9C"), flex: 1, fontFamily: "Inter_600SemiBold" }]}>GFR (mL/min/1.73m²)</Text>
                <Text style={[styles.renalHeaderCell, { color: themed("#0C7B9C"), flex: 2, fontFamily: "Inter_600SemiBold" }]}>Adjustment</Text>
              </View>
              {drug.renalAdjustment.map((r, i) => (
                <View
                  key={i}
                  style={[
                    styles.renalRow,
                    { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" },
                  ]}
                >
                  <View style={[styles.renalGfrBox, { flex: 1 }]}>
                    <Text style={[styles.renalGfr, { color: themed("#0C7B9C"), fontFamily: "Inter_600SemiBold" }]}>
                      {r.gfr}
                    </Text>
                  </View>
                  <Text style={[styles.renalAdjText, { flex: 2, color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {r.adjustment}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Monitoring Parameters */}
        {drug.monitoring && drug.monitoring.length > 0 && (
          <>
            <SectionHeader title="Monitoring" icon="eye" color={themed("#6B2D8E")} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              {drug.monitoring.map((m, i) => (
                <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                  <Feather name="check" size={14} color={themed("#6B2D8E")} />
                  <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {m}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Reference */}
        {drug.reference && (
          <View style={styles.referenceRow}>
            <Feather name="book-open" size={12} color={isDark ? "#A8B8DC" : "#8A9BB0"} />
            <Text style={[styles.referenceText, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
              {drug.reference}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function lightenColor(hex: string, amount: number): string {
  const n = hex.replace("#", "");
  const full = n.length === 3 ? n.split("").map((c) => c + c).join("") : n;
  const num = parseInt(full, 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((num >> 16) & 255);
  const g = mix((num >> 8) & 255);
  const b = mix(num & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function SectionHeader({
  title,
  icon,
  color,
  isDark,
}: {
  title: string;
  icon: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Feather name={icon as any} size={14} color={color} />
      <Text style={[styles.sectionTitle, { color, fontFamily: "Inter_600SemiBold" }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  headerContent: { paddingHorizontal: 20, gap: 6 },
  catBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4 },
  catBadgeText: { color: "#FFFFFF", fontSize: 11 },
  drugTitle: { fontSize: 28, color: "#FFFFFF", letterSpacing: -0.5 },
  genericTitle: { fontSize: 16, color: "rgba(255,255,255,0.75)" },
  scrollContent: { padding: 12, gap: 6 },
  weightBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  weightBannerText: { fontSize: 13, flex: 1 },
  weightBannerValue: { fontSize: 18 },
  invalidWeightNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#B91C1C",
  },
  invalidWeightText: { color: "#FFFFFF", fontSize: 13, flex: 1, lineHeight: 18 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    marginTop: 10,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  doseBlock: { padding: 14, gap: 10 },
  doseTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  routeText: { fontSize: 12 },
  freqText: { fontSize: 12 },
  doseCalcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  calcLabel: { fontSize: 11, marginBottom: 2 },
  calcValue: { fontSize: 24, letterSpacing: -0.5 },
  perKgText: { fontSize: 11, marginTop: 2 },
  maxDoseBox: { padding: 10, borderRadius: 8, alignItems: "center" },
  maxDoseLabel: { fontSize: 10, marginBottom: 2 },
  maxDoseValue: { fontSize: 14 },
  maxDoseWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#B91C1C",
  },
  maxDoseWarningText: { color: "#FFFFFF", fontSize: 13, flex: 1, lineHeight: 18 },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  noteText: { fontSize: 12, flex: 1, lineHeight: 17 },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  listText: { fontSize: 14, flex: 1, lineHeight: 20 },
  formulationsRow: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 8 },
  formulationTag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  formulationText: { fontSize: 13 },
  renalHeader: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  renalHeaderCell: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 },
  renalRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "flex-start",
    gap: 8,
  },
  renalGfrBox: {},
  renalGfr: { fontSize: 13 },
  renalAdjText: { fontSize: 13, lineHeight: 19 },
  referenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginTop: 4,
  },
  referenceText: { fontSize: 12, fontStyle: "italic" },
});
