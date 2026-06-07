import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { DRUGS, calculateDose } from "@/constants/drugs";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

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
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const emergencyCards = useMemo((): EmergencyItem[] => {
    const results: EmergencyItem[] = [];

    const epinephrine = DRUGS.find((d) => d.id === "epinephrine");
    if (epinephrine) {
      const d = epinephrine.doses[0];
      const calc = calculateDose(d, weight);
      results.push({
        label: "Epinephrine (Cardiac Arrest)",
        dose: calc.dose,
        route: "IV / IO",
        notes: `0.1 mL/kg of 1:10,000 = ${+(0.1 * weight).toFixed(1)} mL`,
        color: "#6366F1",
        warning: true,
        exceedsAdultMax: calc.exceedsAdultMax,
        adultMaxLabel: calc.adultMaxLabel,
      });
      const anaph = epinephrine.doses[1];
      const calcIM = calculateDose(anaph, weight);
      results.push({
        label: "Epinephrine (Anaphylaxis)",
        dose: calcIM.dose,
        route: "IM · IN (0.01 mg/kg)",
        notes: "IM: 1:1,000 solution · IN: use atomiser, both nostrils",
        color: "#6366F1",
        warning: true,
        exceedsAdultMax: calcIM.exceedsAdultMax,
        adultMaxLabel: calcIM.adultMaxLabel,
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

        {/* PALS Quick Reference */}
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
            PALS Quick Reference
          </Text>

          {[
            {
              label: "CPR Rate",
              value: "100–120 compressions/min",
              color: "#6366F1",
            },
            {
              label: "Compression Depth",
              value: "≥ 1/3 AP chest depth",
              color: "#6366F1",
            },
            {
              label: "Defibrillation",
              value: `${2 * weight} J (2 J/kg) → ${4 * weight} J (4 J/kg)`,
              color: "#6366F1",
            },
            {
              label: "ET Tube Size",
              value: `~${Math.round((weight / 4 + 4) * 10) / 10} mm (uncuffed)`,
              color: "#6366F1",
            },
            {
              label: "ETT Depth (oral)",
              value: `~${Math.round((weight / 2 + 12) * 10) / 10} cm at lip`,
              color: "#6366F1",
            },
          ].map((ref) => (
            <View
              key={ref.label}
              style={[
                styles.refRow,
                { borderBottomColor: isDark ? "#233554" : "#F0F4F8" },
              ]}
            >
              <Text
                style={[
                  styles.refLabel,
                  {
                    color: isDark ? "#8892B0" : "#4A5568",
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                {ref.label}
              </Text>
              <Text
                style={[
                  styles.refValue,
                  { color: ref.color, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {ref.value}
              </Text>
            </View>
          ))}
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
  refRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  refLabel: { fontSize: 13, flex: 1 },
  refValue: { fontSize: 14, textAlign: "right", flex: 1 },
});
