import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { CATEGORIES, DRUGS } from "@/constants/drugs";
import { INFUSION_DRUGS } from "@/constants/infusions";
import { useDrawer } from "@/context/DrawerContext";
import { useTheme } from "@/context/ThemeContext";

// ── Search index for Tools ────────────────────────────────────────────────────
const SEARCH_TOOLS = [
  { key: "gir",                   title: "GIR Calculator",                  subtitle: "Glucose Infusion Rate · mg/kg/min · Neonates",          icon: "droplet",    color: "#0EA5E9" },
  { key: "big-score",             title: "BIG Score — Pediatric Trauma",    subtitle: "Base Deficit · INR · GCS · Mortality prediction",       icon: "trending-up",color: "#DC2626" },
  { key: "phoenix-sepsis",        title: "Phoenix Sepsis Score 2024",       subtitle: "Respiratory · Cardiovascular · Coagulation · Neuro",    icon: "activity",   color: "#7C3AED" },
  { key: "streptokinase-empyema", title: "Streptokinase — Empyema Protocol",subtitle: "Intrapleural fibrinolysis · ICU Protocol · 3-day",      icon: "shield",     color: "#0D9488" },
  { key: "growth",                title: "Growth Charts — WHO Standards",   subtitle: "Weight-for-age · Z-score · Nutritional status",         icon: "bar-chart-2",color: "#0D9488" },
  { key: "vis",                   title: "VIS / Cardiac & Haemodynamic",    subtitle: "Vasoactive-Inotropic Score · BP Percentile",            icon: "heart",      color: "#E53E3E" },
  { key: "bundles",               title: "PICU Care Bundles",               subtitle: "FASTHUG · VAP · CLABSI · CAUTI daily checklists",       icon: "check-square",color: "#7C3AED" },
  { key: "fluids",                title: "IV Fluids & Dehydration",         subtitle: "Holliday-Segar · Maintenance · Deficit · DKA",          icon: "droplet",    color: "#0EA5E9" },
  { key: "electrolytes",          title: "Electrolyte Correction — K⁺",     subtitle: "Potassium deficit · KCl recipe · Safety checklist",     icon: "zap",        color: "#0891B2" },
  { key: "gcs",                   title: "Pediatric GCS (pGCS)",            subtitle: "Modified GCS for children & infants",                   icon: "activity",   color: "#16A34A" },
  { key: "scores",                title: "Advanced ICU Scores",             subtitle: "FOUR Score · OSI · SIPA · WAT-1 withdrawal scale",      icon: "activity",   color: "#FF4C60" },
  { key: "renal",                 title: "Renal & Hepatic Adjustments",     subtitle: "Schwartz eGFR · Drug dose adjustments by organ fn",     icon: "shield",     color: "#DC2626" },
  { key: "pews",                  title: "PEWS Score",                      subtitle: "Pediatric Early Warning Score · Rapid Response trigger", icon: "activity",  color: "#FF4C60" },
  { key: "apgar",                 title: "APGAR Score (1 & 5 min)",         subtitle: "Neonatal — Appearance · Pulse · Grimace · Activity",    icon: "heart",      color: "#EC4899" },
];

const EMERGENCY_TERMS = ["emergency", "resus", "cpr", "code", "cardiac", "arrest", "pals", "acls", "defib", "adrenaline", "epinephrine"];

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  icon: string;
  module: string;
  moduleColor: string;
  routePath: string;
  routeParams?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { openDrawer } = useDrawer();
  const colors = Colors.light;

  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  const bg         = isDark ? "#0B132B" : "#F0F9FF";
  const card       = isDark ? "#0E2A45" : "#FFFFFF";
  const border     = isDark ? "#1E3A5F" : "#E2EFF6";
  const tp         = isDark ? "#FFFFFF" : "#0D1B2A";
  const tm         = isDark ? "#8892B0" : "#64748B";
  const searchBg   = isDark ? "#0D2137" : "#EFF6FF";
  const searchBdr  = isDark ? "#1E3A5F" : "#BAE6FD";

  const q = searchQuery.trim().toLowerCase();
  const showResults = q.length >= 1;

  // ── Search across all modules ───────────────────────────────────────
  const results = useMemo((): SearchResult[] => {
    if (q.length < 1) return [];
    const out: SearchResult[] = [];

    // Emergency — keyword match
    const isEmergencyQuery = EMERGENCY_TERMS.some((t) => t.startsWith(q) || q.startsWith(t.slice(0, 3)));
    if (isEmergencyQuery) {
      out.push({
        id: "_emergency",
        label: "EMERGENCY / RESUSCITATION",
        sublabel: "Code Blue · PALS · Rapid reference",
        color: "#DC2626",
        icon: "alert-triangle",
        module: "Emergency",
        moduleColor: "#DC2626",
        routePath: "/(tabs)/emergency",
      });
    }

    // Drugs — name match first, then indication match
    const drugNameHits   = DRUGS.filter((d) => d.name.toLowerCase().includes(q));
    const drugIndHits    = DRUGS.filter(
      (d) =>
        !d.name.toLowerCase().includes(q) &&
        d.indications.some((i) => i.toLowerCase().includes(q))
    );
    [...drugNameHits, ...drugIndHits].slice(0, 12).forEach((d) => {
      const cat = CATEGORIES[d.category];
      out.push({
        id: "d-" + d.id,
        label: d.name,
        sublabel: cat.label + (d.highAlert ? " · ⚠ High Alert" : ""),
        color: cat.color,
        icon: cat.icon,
        module: "Calculator",
        moduleColor: "#0891B2",
        routePath: "/drug/[id]",
        routeParams: { id: d.id },
      });
    });

    // Infusions — name first, then indication/category
    const infNameHits  = INFUSION_DRUGS.filter((d) => d.name.toLowerCase().includes(q));
    const infOtherHits = INFUSION_DRUGS.filter(
      (d) =>
        !d.name.toLowerCase().includes(q) &&
        (d.indication.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
    );
    [...infNameHits, ...infOtherHits].slice(0, 6).forEach((d) => {
      out.push({
        id: "i-" + d.id,
        label: d.name,
        sublabel: "Infusion · " + d.category,
        color: d.color,
        icon: "activity",
        module: "Infusion",
        moduleColor: "#7C3AED",
        routePath: "/infusion/[id]",
        routeParams: { id: d.id },
      });
    });

    // Tools
    SEARCH_TOOLS.filter(
      (t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)
    )
      .slice(0, 5)
      .forEach((t) => {
        out.push({
          id: "tool-" + t.key,
          label: t.title,
          sublabel: t.subtitle,
          color: t.color,
          icon: t.icon,
          module: "Tools",
          moduleColor: "#16A34A",
          routePath: "/tool/[id]",
          routeParams: { id: t.key },
        });
      });

    return out.slice(0, 20);
  }, [q]);

  function handleResultPress(r: SearchResult) {
    setSearchQuery("");
    Keyboard.dismiss();
    setTimeout(() => {
      if (r.routeParams) {
        router.push({ pathname: r.routePath as any, params: r.routeParams });
      } else {
        router.push(r.routePath as any);
      }
    }, 60);
  }

  function clearSearch() {
    setSearchQuery("");
    inputRef.current?.blur();
  }

  // ─────────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>

      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
            borderBottomColor: border,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={openDrawer}
            style={[styles.iconBtn, { backgroundColor: isDark ? "#0D2137" : "#EFF6FF" }]}
            activeOpacity={0.7}
          >
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : colors.tint} />
          </TouchableOpacity>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.headerTitle, { color: tp }]} numberOfLines={1}>
              MKashanEdu
            </Text>
            <Text style={[styles.headerSub, { color: tm }]}>
              Pediatric Clinical Suite
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleDark}
            style={[styles.iconBtn, { backgroundColor: isDark ? "#0D2137" : "#EFF6FF" }]}
            activeOpacity={0.7}
          >
            <Feather
              name={isDark ? "sun" : "moon"}
              size={16}
              color={isDark ? "#FFD700" : colors.tint}
            />
          </TouchableOpacity>
        </View>

        {/* ── Search bar ── */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: searchBg, borderColor: searchBdr },
          ]}
        >
          <Feather name="search" size={16} color={colors.tint} style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: tp }]}
            placeholder="Search drugs, infusions, tools..."
            placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={[styles.clearBtn, { backgroundColor: isDark ? "#1E3A5F" : "#CBD5E1" }]}>
                <Feather name="x" size={11} color={tm} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Body: relative container for overlay ── */}
      <View style={{ flex: 1, position: "relative" }}>

        {/* ── Search results overlay ── */}
        {showResults && (
          <>
            {/* Tap-outside-to-dismiss backdrop */}
            <Pressable
              style={[StyleSheet.absoluteFill, { zIndex: 90 }]}
              onPress={clearSearch}
            />

            <View
              style={[
                styles.resultsPanel,
                {
                  backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
                  borderColor: border,
                  ...Platform.select({
                    ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 20 },
                    android: { elevation: 12 },
                    web: { boxShadow: "0 8px 32px rgba(0,0,0,0.14)" },
                  }),
                },
              ]}
            >
              {results.length === 0 ? (
                /* No results */
                <View style={styles.noResults}>
                  <Feather name="search" size={28} color={tm} />
                  <Text style={[styles.noResultsTitle, { color: tp }]}>
                    No results for "{searchQuery}"
                  </Text>
                  <Text style={[styles.noResultsSub, { color: tm }]}>
                    Try a drug name, indication, or tool name
                  </Text>
                </View>
              ) : (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {/* Result count */}
                  <View style={styles.resultsMeta}>
                    <Text style={[styles.resultsMetaText, { color: tm }]}>
                      {results.length} result{results.length !== 1 ? "s" : ""} across all modules
                    </Text>
                  </View>

                  {results.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      onPress={() => handleResultPress(r)}
                      activeOpacity={0.7}
                      style={[
                        styles.resultItem,
                        { borderBottomColor: isDark ? "#112240" : "#F1F5F9" },
                      ]}
                    >
                      {/* Coloured left accent */}
                      <View style={[styles.resultAccent, { backgroundColor: r.color }]} />

                      {/* Icon */}
                      <View style={[styles.resultIcon, { backgroundColor: r.color + "18" }]}>
                        <Feather name={r.icon as any} size={14} color={r.color} />
                      </View>

                      {/* Text */}
                      <View style={styles.resultText}>
                        <Text
                          style={[styles.resultLabel, { color: tp }]}
                          numberOfLines={1}
                        >
                          {r.label}
                        </Text>
                        <Text
                          style={[styles.resultSublabel, { color: tm }]}
                          numberOfLines={1}
                        >
                          {r.sublabel}
                        </Text>
                      </View>

                      {/* Module badge */}
                      <View
                        style={[
                          styles.moduleBadge,
                          { backgroundColor: r.moduleColor + "18" },
                        ]}
                      >
                        <Text style={[styles.moduleBadgeText, { color: r.moduleColor }]}>
                          {r.module}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <View style={{ height: 8 }} />
                </ScrollView>
              )}
            </View>
          </>
        )}

        {/* ── Dashboard buttons ── */}
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dose Calculator */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/calculator" as any)}
            activeOpacity={0.85}
            style={[
              styles.mainButton,
              {
                backgroundColor: card,
                borderColor: colors.tint,
                shadowColor: colors.tint,
              },
            ]}
          >
            <View style={[styles.mainButtonIcon, { backgroundColor: colors.tint + "18" }]}>
              <Feather name="sliders" size={32} color={colors.tint} />
            </View>
            <View style={styles.mainButtonText}>
              <Text style={[styles.mainButtonTitle, { color: tp }]}>Dose Calculator</Text>
              <Text style={[styles.mainButtonDesc, { color: tm }]}>
                Weight-based drug doses · 96+ medications
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color={colors.tint} />
          </TouchableOpacity>

          {/* Emergency */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/emergency" as any)}
            activeOpacity={0.85}
            style={[
              styles.mainButton,
              styles.emergencyButton,
              {
                backgroundColor: "#DC2626",
                borderColor: "#B91C1C",
                shadowColor: "#DC2626",
              },
            ]}
          >
            <View style={[styles.mainButtonIcon, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Feather name="alert-triangle" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.mainButtonText}>
              <Text style={[styles.mainButtonTitle, { color: "#FFFFFF" }]}>EMERGENCY</Text>
              <Text style={[styles.mainButtonDesc, { color: "rgba(255,255,255,0.8)" }]}>
                RESUSCITATION · Rapid reference
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Tools & Protocols */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/tools" as any)}
            activeOpacity={0.85}
            style={[
              styles.mainButton,
              {
                backgroundColor: isDark ? "#0A2318" : "#FFFFFF",
                borderColor: "#16A34A",
                shadowColor: "#16A34A",
              },
            ]}
          >
            <View style={[styles.mainButtonIcon, { backgroundColor: "#16A34A18" }]}>
              <Feather name="tool" size={32} color="#16A34A" />
            </View>
            <View style={styles.mainButtonText}>
              <Text style={[styles.mainButtonTitle, { color: tp }]}>
                Tools &amp; Protocols
              </Text>
              <Text style={[styles.mainButtonDesc, { color: tm }]}>
                GIR · BIG Score · Phoenix Sepsis · ICU Protocols
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#16A34A" />
          </TouchableOpacity>

          <Text style={[styles.hint, { color: isDark ? "#3A5070" : "#B0C4D8" }]}>
            All other modules accessible via the menu ☰
          </Text>
        </ScrollView>
      </View>

      {/* ── Footer ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={[styles.footerText, { color: isDark ? "#3A5070" : "#B0C4D8" }]}>
          Prepared By: M. Kashan, RN
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 3 },
      web: { boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
    }),
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  // Results panel
  resultsPanel: {
    position: "absolute",
    top: 8,
    left: 12,
    right: 12,
    zIndex: 100,
    borderRadius: 18,
    borderWidth: 1,
    maxHeight: 440,
    overflow: "hidden",
  },
  noResults: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  noResultsTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  noResultsSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  resultsMeta: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsMetaText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    gap: 10,
    overflow: "hidden",
  },
  resultAccent: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: 2,
    marginLeft: 6,
  },
  resultIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  resultText: { flex: 1, minWidth: 0 },
  resultLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.1,
  },
  resultSublabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  moduleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 0,
  },
  moduleBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },

  // Dashboard content
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 16,
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16 },
      android: { elevation: 6 },
      web: { boxShadow: "0 6px 20px rgba(0,0,0,0.10)" },
    }),
  },
  emergencyButton: {
    borderWidth: 0,
    ...Platform.select({
      ios: { shadowOpacity: 0.3 },
      android: { elevation: 8 },
    }),
  },
  mainButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  mainButtonText: { flex: 1 },
  mainButtonTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  mainButtonDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 4,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
