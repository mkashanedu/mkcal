import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export function ProfessionalFooter() {
  const { isDark } = useTheme();
  const D = isDark;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: D ? "#112240" : "#F0F9FF",
          borderColor: D ? "#233554" : "#E4EDF4",
          borderLeftWidth: D ? 4 : 0,
          borderLeftColor: D ? "#6366F1" : "transparent",
          borderWidth: D ? 1 : 0,
        },
      ]}
    >
      <Text style={[styles.line1, { color: D ? "#8892B0" : "#64748B" }]}>
        MKashanEdu Clinical Reference V1.0.0
      </Text>
      <Text style={[styles.line2, { color: D ? "#FFFFFF" : "#0F172A" }]}>
        Prepared By: M. Kashan, RN
      </Text>
      <Text style={[styles.line3, { color: D ? "#00B48A" : "#0D9488" }]}>
        Peads ICU & Cardiac Specialist
      </Text>
      <Text style={[styles.line4, { color: D ? "#5A7094" : "#94A3B8" }]}>
        Disclaimer: For educational/reference purposes only. Always verify doses.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 14,
    marginBottom: 12,
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    gap: 4,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 4 },
      web: { boxShadow: "0 4px 16px rgba(0,0,0,0.10)" },
    }),
  },
  line1: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  line2: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  line3: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
    marginTop: 1,
  },
  line4: {
    fontSize: 10,
    fontStyle: "italic",
    lineHeight: 14,
    textAlign: "center",
    marginTop: 4,
  },
});
