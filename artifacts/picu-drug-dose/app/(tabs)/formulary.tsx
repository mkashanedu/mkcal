import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useDrawer } from "@/context/DrawerContext";
import { FORMULARY_CATEGORIES, FORMULARY_DRUGS, FormularyCategory } from "@/data/formularyData";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

export default function FormularyScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { openDrawer } = useDrawer();
  const colors = Colors.light;
  const topPadding = insets.top;

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";

  const categories = Object.entries(FORMULARY_CATEGORIES) as [
    FormularyCategory,
    (typeof FORMULARY_CATEGORIES)[FormularyCategory]
  ][];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
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

      <View style={styles.content}>
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
                style={[styles.tile, { backgroundColor: cardBg, borderColor: isDark ? "#233554" : "#E4EDF4" }]}
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
      </View>

      <ProfessionalFooter />
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
  content: { flex: 1, padding: 16 },
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
