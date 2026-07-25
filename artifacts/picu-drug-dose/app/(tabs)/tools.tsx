/**
 * Tools tab — clean navigation grid.
 * Each card navigates to /tool/[id] for the full-screen calculator.
 */
import { Feather } from "@expo/vector-icons";
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
import { router } from "expo-router";

import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useDrawer } from "@/context/DrawerContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

const C = Colors.light;

const CLINICAL_CALCULATORS = [
  {
    key: "ventilator",
    title: "Ventilator & ABG Management",
    subtitle: "Vt · PEEP · Pplat · Driving Pressure · Hamilton C3 Modes · PARDS & Asthma Protocols",
    icon: "wind",
    color: "#0891B2",
    badge: "NEW",
  },
  {
    key: "gir",
    title: "GIR Calculator",
    subtitle: "Glucose Infusion Rate · IV rate + dextrose% + weight → mg/kg/min",
    icon: "droplet",
    color: "#0EA5E9",
    badge: "NEW",
  },
  {
    key: "big-score",
    title: "BIG Score — Pediatric Trauma",
    subtitle: "Base Deficit + (2.5 × INR) + (15 − GCS) · Mortality prediction",
    icon: "trending-up",
    color: "#DC2626",
    badge: "NEW",
  },
  {
    key: "phoenix-sepsis",
    title: "Phoenix Sepsis Score 2024",
    subtitle: "Respiratory · Cardiovascular · Coagulation · Neurological domains",
    icon: "activity",
    color: "#7C3AED",
    badge: "NEW",
  },
];

const ICU_PROTOCOLS = [
  {
    key: "streptokinase-empyema",
    title: "Streptokinase — Empyema Thoracis",
    subtitle: "Intrapleural fibrinolysis · Age-based dosing · 3-day protocol",
    icon: "shield",
    color: "#0D9488",
    badge: "NEW",
  },
];

const TOOL_SECTIONS = [
  {
    key: "growth",
    title: "Growth Charts — WHO Standards",
    subtitle: "Weight-for-age · Z-score · Nutritional status · FTT detection",
    icon: "bar-chart-2",
    color: "#0D9488",
  },
  {
    key: "vis",
    title: "VIS / Cardiac & Haemodynamic",
    subtitle: "Vasoactive-Inotropic Score · BP Percentile · Normal Vitals",
    icon: "heart",
    color: "#E53E3E",
  },
  {
    key: "bundles",
    title: "PICU Care Bundles",
    subtitle: "FASTHUG · VAP · CLABSI · CAUTI daily checklists",
    icon: "check-square",
    color: "#7C3AED",
  },
  {
    key: "fluids",
    title: "IV Fluids & Dehydration",
    subtitle: "Holliday-Segar · Maintenance · Deficit · DKA · Resuscitation",
    icon: "droplet",
    color: "#0EA5E9",
  },
  {
    key: "electrolytes",
    title: "Electrolyte Correction — K⁺",
    subtitle: "Potassium deficit · KCl recipe · Safety checklist",
    icon: "zap",
    color: "#0891B2",
  },
  {
    key: "gcs",
    title: "Pediatric GCS (pGCS)",
    subtitle: "Modified GCS for children & infants · Eye · Verbal · Motor",
    icon: "activity",
    color: "#16A34A",
  },
  {
    key: "scores",
    title: "Advanced ICU Scores",
    subtitle: "FOUR Score · OSI · SIPA · WAT-1 withdrawal scale",
    icon: "activity",
    color: "#FF4C60",
  },
  {
    key: "renal",
    title: "Renal & Hepatic Adjustments",
    subtitle: "Schwartz eGFR · Drug dose adjustments by organ function",
    icon: "shield",
    color: "#DC2626",
  },
  {
    key: "pews",
    title: "PEWS Score",
    subtitle: "Pediatric Early Warning Score · Rapid Response trigger",
    icon: "activity",
    color: "#FF4C60",
  },
  {
    key: "apgar",
    title: "APGAR Score (1 & 5 min)",
    subtitle: "Neonatal assessment · Appearance · Pulse · Grimace · Activity · Respiration",
    icon: "heart",
    color: "#EC4899",
  },
];

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { isFav } = useFavorites();
  const { openDrawer } = useDrawer();

  const bg = isDark ? "#0B132B" : "#F0F4F8";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const textPrimary = isDark ? "#CCD6F6" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#8A9BB0";

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 12, backgroundColor: isDark ? "#0A192F" : "#FFFFFF" },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={openDrawer}
            style={[styles.hamburgerBtn, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
            activeOpacity={0.7}
          >
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : C.tint} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>MKashanEdu</Text>
            <Text style={[styles.headerSub, { color: textMuted }]}>
              Pediatric Clinical Guide • Based on Harriet Lane & Nelson's • 96+ drugs
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleDark}
            style={[styles.nightToggle, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
          >
            <Feather name={isDark ? "sun" : "moon"} size={18} color={isDark ? "#FFD700" : "#4A5568"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingHorizontal: 14, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page heading ── */}
        <View style={{ marginBottom: 18 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: textPrimary, letterSpacing: -0.4 }}>
            Tools &amp; Protocols
          </Text>
          <Text style={{ fontSize: 13, color: textMuted, marginTop: 3 }}>
            {CLINICAL_CALCULATORS.length + ICU_PROTOCOLS.length + TOOL_SECTIONS.length} tools · Tap any card to open
          </Text>
        </View>

        {/* ── CLINICAL CALCULATORS ── */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#233554" : "#E2E8F0" }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#0EA5E915", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Feather name="cpu" size={12} color="#0EA5E9" />
            <Text style={{ fontSize: 11, fontWeight: "800", color: "#0EA5E9", letterSpacing: 0.5 }}>CLINICAL CALCULATORS</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#233554" : "#E2E8F0" }} />
        </View>

        {CLINICAL_CALCULATORS.map((tool) => {
          const fav = isFav("tool-" + tool.key);
          return (
            <TouchableOpacity
              key={tool.key}
              onPress={() => router.push({ pathname: "/tool/[id]", params: { id: tool.key } })}
              activeOpacity={0.75}
              style={[
                styles.toolCard,
                {
                  backgroundColor: cardBg,
                  borderColor: tool.color + "40",
                  borderWidth: 1.5,
                  ...Platform.select({
                    ios: { shadowColor: tool.color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8 },
                    android: { elevation: 3 },
                    web: { boxShadow: `0 2px 10px ${tool.color}20` },
                  }),
                },
              ]}
            >
              <View style={[styles.stripe, { backgroundColor: tool.color }]} />
              <View style={[styles.iconWrap, { backgroundColor: tool.color + "1A" }]}>
                <Feather name={tool.icon as any} size={20} color={tool.color} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <Text style={[styles.toolTitle, { color: textPrimary }]} numberOfLines={1}>
                    {tool.title}
                  </Text>
                  <View style={{ backgroundColor: tool.color, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                    <Text style={{ fontSize: 8, fontWeight: "800", color: "#FFFFFF" }}>{tool.badge}</Text>
                  </View>
                </View>
                <Text style={[styles.toolSubtitle, { color: textMuted }]} numberOfLines={2}>
                  {tool.subtitle}
                </Text>
              </View>
              <View style={{ alignItems: "center", gap: 6 }}>
                {fav && <View style={[styles.favDot, { backgroundColor: tool.color }]} />}
                <Feather name="chevron-right" size={18} color={tool.color} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── ICU PROTOCOLS ── */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8, marginBottom: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#233554" : "#E2E8F0" }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#0D948815", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Feather name="file-text" size={12} color="#0D9488" />
            <Text style={{ fontSize: 11, fontWeight: "800", color: "#0D9488", letterSpacing: 0.5 }}>ICU PROTOCOLS</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#233554" : "#E2E8F0" }} />
        </View>

        {ICU_PROTOCOLS.map((tool) => {
          const fav = isFav("tool-" + tool.key);
          return (
            <TouchableOpacity
              key={tool.key}
              onPress={() => router.push({ pathname: "/tool/[id]", params: { id: tool.key } })}
              activeOpacity={0.75}
              style={[
                styles.toolCard,
                {
                  backgroundColor: cardBg,
                  borderColor: tool.color + "40",
                  borderWidth: 1.5,
                  ...Platform.select({
                    ios: { shadowColor: tool.color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8 },
                    android: { elevation: 3 },
                    web: { boxShadow: `0 2px 10px ${tool.color}20` },
                  }),
                },
              ]}
            >
              <View style={[styles.stripe, { backgroundColor: tool.color }]} />
              <View style={[styles.iconWrap, { backgroundColor: tool.color + "1A" }]}>
                <Feather name={tool.icon as any} size={20} color={tool.color} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <Text style={[styles.toolTitle, { color: textPrimary }]} numberOfLines={1}>
                    {tool.title}
                  </Text>
                  <View style={{ backgroundColor: tool.color, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                    <Text style={{ fontSize: 8, fontWeight: "800", color: "#FFFFFF" }}>{tool.badge}</Text>
                  </View>
                </View>
                <Text style={[styles.toolSubtitle, { color: textMuted }]} numberOfLines={2}>
                  {tool.subtitle}
                </Text>
              </View>
              <View style={{ alignItems: "center", gap: 6 }}>
                {fav && <View style={[styles.favDot, { backgroundColor: tool.color }]} />}
                <Feather name="chevron-right" size={18} color={tool.color} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── CLINICAL TOOLS ── */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8, marginBottom: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#233554" : "#E2E8F0" }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: isDark ? "#233554" : "#F0F4F8", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Feather name="tool" size={12} color={textMuted} />
            <Text style={{ fontSize: 11, fontWeight: "800", color: textMuted, letterSpacing: 0.5 }}>CLINICAL TOOLS</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#233554" : "#E2E8F0" }} />
        </View>

        {TOOL_SECTIONS.map((tool) => {
          const fav = isFav("tool-" + tool.key);
          return (
            <TouchableOpacity
              key={tool.key}
              onPress={() => router.push({ pathname: "/tool/[id]", params: { id: tool.key } })}
              activeOpacity={0.75}
              style={[
                styles.toolCard,
                {
                  backgroundColor: cardBg,
                  borderColor: border,
                  ...Platform.select({
                    ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
                    android: { elevation: 2 },
                    web: { boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
                  }),
                },
              ]}
            >
              <View style={[styles.stripe, { backgroundColor: tool.color }]} />
              <View style={[styles.iconWrap, { backgroundColor: tool.color + "1A" }]}>
                <Feather name={tool.icon as any} size={20} color={tool.color} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.toolTitle, { color: textPrimary }]} numberOfLines={1}>
                  {tool.title}
                </Text>
                <Text style={[styles.toolSubtitle, { color: textMuted }]} numberOfLines={2}>
                  {tool.subtitle}
                </Text>
              </View>
              <View style={{ alignItems: "center", gap: 6 }}>
                {fav && <View style={[styles.favDot, { backgroundColor: tool.color }]} />}
                <Feather name="chevron-right" size={18} color={tool.color} />
              </View>
            </TouchableOpacity>
          );
        })}

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
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginRight: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  headerSub: { fontSize: 12, marginTop: 2 },
  nightToggle: { padding: 10, borderRadius: 10, marginLeft: 10 },

  toolCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
    gap: 12,
    overflow: "hidden",
  },
  stripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginLeft: 8,
  },
  toolTitle: { fontSize: 14, fontWeight: "700", marginBottom: 3 },
  toolSubtitle: { fontSize: 11, lineHeight: 16 },
  favDot: { width: 7, height: 7, borderRadius: 3.5 },
});
