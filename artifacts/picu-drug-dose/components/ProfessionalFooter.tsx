import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { APP_VERSION, DATA_UPDATED } from "@/lib/appInfo";

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
          borderLeftColor: D ? "#0D9488" : "transparent",
          borderWidth: D ? 1 : 0,
        },
      ]}
    >
      <View style={[styles.badge, { backgroundColor: D ? "#0D9488" : "#0D9488" }]}>
        <Feather name="activity" size={16} color="#FFFFFF" />
      </View>
      <Text style={[styles.line1, { color: D ? "#8892B0" : "#64748B" }]}>
        PeadsCal · Pediatric Clinical Reference
      </Text>
      <Text style={[styles.byline, { color: D ? "#5A7094" : "#94A3B8" }]}>
        Developed &amp; maintained by
      </Text>
      <Text style={[styles.line2, { color: D ? "#FFFFFF" : "#0F172A" }]}>
        M. Kashan, RN
      </Text>
      <View style={[styles.divider, { backgroundColor: D ? "#233554" : "#E4EDF4" }]} />
      <Text style={[styles.refs, { color: D ? "#8892B0" : "#64748B" }]}>
        References: Harriet Lane 24e · Nelson Pediatrics 22e · PALS 2025
      </Text>
      <Text style={[styles.meta, { color: D ? "#5A7094" : "#94A3B8" }]}>
        Version {APP_VERSION} · Data updated {DATA_UPDATED}
      </Text>
      <Text style={[styles.line4, { color: D ? "#5A7094" : "#94A3B8" }]}>
        Disclaimer: For educational &amp; clinical reference only. Always verify every dose before administration.
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
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  line1: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
  byline: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.4,
    marginTop: 6,
  },
  line2: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  line3: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
    marginTop: 1,
    textAlign: "center",
  },
  divider: {
    height: 1,
    alignSelf: "stretch",
    marginVertical: 8,
  },
  refs: {
    fontSize: 10.5,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 15,
  },
  meta: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  line4: {
    fontSize: 10,
    fontStyle: "italic",
    lineHeight: 14,
    textAlign: "center",
    marginTop: 4,
  },
});
