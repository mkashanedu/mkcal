import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import Colors from "@/constants/colors";

const C = Colors.light;

export function ProfessionalFooter() {
  const { isDark } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: isDark ? "#1E2D3D" : C.border,
          backgroundColor: isDark ? "#080E18" : "#EDF2F7",
        },
      ]}
    >
      <View style={styles.logoRow}>
        <Feather name="heart" size={14} color="#AE2012" />
        <View style={[styles.dividerDot, { backgroundColor: isDark ? "#2D3748" : C.border }]} />
        <Feather name="activity" size={14} color={C.tint} />
      </View>
      <Text style={[styles.name, { color: isDark ? "#E2E8F0" : C.text }]}>
        Prepared by Staff Kashan Peads ICU
      </Text>
      <View style={[styles.disclaimerBox, { borderColor: isDark ? "#2D3748" : C.border }]}>
        <Feather name="shield" size={10} color={isDark ? "#4A6580" : C.textMuted} />
        <Text style={[styles.disclaimer, { color: isDark ? "#4A6580" : C.textMuted }]}>
          All doses based on Harriet Lane Handbook 23e · PALS 2025 · SSC Pediatric 2024.
          Clinical responsibility rests with the prescribing clinician. Verify against institutional protocols.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 14,
    marginBottom: 8,
    paddingTop: 18,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    gap: 4,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 10,
  },
  disclaimerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  disclaimer: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },
});
