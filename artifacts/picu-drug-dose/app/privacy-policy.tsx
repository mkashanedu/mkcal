import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
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
import { useTheme } from "@/context/ThemeContext";

const teal = Colors.light.tint;

export default function PrivacyPolicyScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const card = isDark ? "#112240" : "#FFFFFF";
  const textPrimary = isDark ? "#E2E8F0" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";
  const border = isDark ? "#233554" : "#E2EFF6";

  const sections = [
    {
      icon: "database",
      color: teal,
      title: "Data We Collect",
      body: "We collect only user preferences (such as favorites and bookmarks) to sync across devices. No medical patient data is ever uploaded to our servers.",
    },
    {
      icon: "shield",
      color: "#16A34A",
      title: "Patient Data",
      body: "This app does not collect, store, or transmit any personally identifiable patient information. All clinical calculations are performed locally on your device.",
    },
    {
      icon: "book-open",
      color: "#D97706",
      title: "Institutional Guidelines",
      body: "Use of this app is subject to your institution's clinical guidelines and policies. Always verify doses against your local formulary and institutional protocols.",
    },
    {
      icon: "alert-triangle",
      color: "#E53E3E",
      title: "Disclaimer",
      body: "For educational purposes by healthcare professionals only. This application does not replace professional medical judgment, clinical expertise, or established institutional protocols. Always consult a qualified clinician before making clinical decisions.",
    },
    {
      icon: "lock",
      color: "#7C3AED",
      title: "Data Security",
      body: "Preference data is stored securely using device-level encryption. We do not share any user data with third parties. You may clear all saved preferences at any time from within the app.",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === "web" ? 20 : insets.top + 12,
            backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
            borderBottomColor: border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: isDark ? "#1A2F4A" : "#F0F4F8" }]}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={18} color={teal} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>
              Privacy Policy
            </Text>
            <Text style={[styles.headerSub, { color: textMuted }]}>
              MKashanEdu Clinical Suite
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro card */}
        <View style={[styles.introCard, { backgroundColor: teal + "14", borderColor: teal + "40" }]}>
          <Feather name="info" size={18} color={teal} />
          <Text style={[styles.introText, { color: teal }]}>
            MKashanEdu Privacy Policy — Last updated: June 2026
          </Text>
        </View>

        {sections.map((s, i) => (
          <View
            key={i}
            style={[styles.section, { backgroundColor: card, borderColor: border }]}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: s.color + "18" }]}>
                <Feather name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>
                {s.title}
              </Text>
            </View>
            <Text style={[styles.sectionBody, { color: textMuted }]}>
              {s.body}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={[styles.footerCard, { backgroundColor: isDark ? "#112240" : "#F8FAFD", borderColor: border }]}>
          <Text style={[styles.footerText, { color: textMuted }]}>
            Prepared By: M. Kashan, RN
          </Text>
          <Text style={[styles.footerSub, { color: isDark ? "#2D4A6A" : "#CBD5E0" }]}>
            Pediatric Clinical Suite · Educational Use Only
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  introCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  sectionBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  footerCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  footerText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  footerSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
});
