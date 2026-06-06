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
          backgroundColor: isDark ? "#0C1420" : "#F0F9FF",
        },
      ]}
    >
      <View style={styles.logoRow}>
        <View style={[styles.iconPill, { backgroundColor: C.tint + "20" }]}>
          <Feather name="activity" size={13} color={C.tint} />
        </View>
        <View style={[styles.iconPill, { backgroundColor: "#DC262620" }]}>
          <Feather name="heart" size={13} color="#DC2626" />
        </View>
      </View>
      <Text style={[styles.name, { color: isDark ? "#E2EDF8" : "#0A1628", fontFamily: "Inter_700Bold" }]}>
        Prepared by Staff Kashan Peads ICU
      </Text>
      <Text style={[styles.disclaimer, { color: isDark ? "#4A6580" : "#7A95AA", fontFamily: "Inter_400Regular" }]}>
        Harriet Lane 23e · PALS 2025 · SSC Pediatric 2024
      </Text>
      <Text style={[styles.disclaimer, { color: isDark ? "#334D66" : "#A0B4C4", fontFamily: "Inter_400Regular" }]}>
        Clinical responsibility rests with the prescribing clinician.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    letterSpacing: 0.1,
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
