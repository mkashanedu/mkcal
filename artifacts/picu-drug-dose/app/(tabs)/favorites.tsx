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

import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useDrawer } from "@/context/DrawerContext";
import { ProfessionalFooter } from "@/components/ProfessionalFooter";

const typeLabels: Record<string, string> = {
  drug: "Drugs",
  antidote: "Antidotes",
  calculator: "Calculators",
  infusion: "Infusions",
  tool: "Tools",
};

const typeIcons: Record<string, string> = {
  drug: "pill",
  antidote: "shield",
  calculator: "sliders",
  infusion: "activity",
  tool: "tool",
};

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { items, removeFav } = useFavorites();
  const { openDrawer } = useDrawer();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const textPrimary = isDark ? "#FFFFFF" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

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
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : "#0891B2"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>
              MKashanEdu
            </Text>
            <Text style={[styles.headerSub, { color: textMuted }]}>
              Pediatric Clinical Guide • Based on Harriet Lane & Nelson's • 95+ drugs
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleDark}
            style={[
              styles.nightBtn,
              { backgroundColor: isDark ? "#233554" : "#F0F4F8" },
            ]}
          >
            <Feather
              name={isDark ? "sun" : "moon"}
              size={18}
              color={isDark ? "#FFD700" : "#4A5568"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        keyboardShouldPersistTaps="handled"
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="star" size={48} color={isDark ? "#233554" : "#CBD5E0"} />
            <Text style={[styles.emptyTitle, { color: textMuted }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, { color: textMuted }]}>
              Tap the star icon on any drug, antidote, or tool to add it here.
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([type, typeItems]) => (
            <View key={type} style={styles.group}>
              <View style={styles.groupHeader}>
                <Feather
                  name={typeIcons[type] as any}
                  size={16}
                  color={textMuted}
                />
                <Text style={[styles.groupTitle, { color: textMuted }]}>
                  {typeLabels[type] || type}
                </Text>
                <Text style={[styles.groupCount, { color: textMuted }]}>
                  {typeItems.length}
                </Text>
              </View>
              {typeItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (item.type === "drug") {
                      router.push({
                        pathname: "/drug/[id]",
                        params: { id: item.id },
                      });
                    }
                    // For other types, navigation can be expanded later
                  }}
                  style={[
                    styles.card,
                    {
                      backgroundColor: cardBg,
                      borderColor: border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.stripe,
                      { backgroundColor: item.color || "#0891B2" },
                    ]}
                  />
                  <View style={styles.cardContent}>
                    <Text
                      style={[
                        styles.cardLabel,
                        { color: textPrimary },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.notes ? (
                      <Text
                        style={[
                          styles.cardNotes,
                          { color: textMuted },
                        ]}
                        numberOfLines={1}
                      >
                        {item.notes}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFav(item.id)}
                    style={styles.removeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="trash-2" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
        <ProfessionalFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hamburgerBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8 },
  header: { paddingHorizontal: 16, paddingBottom: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  headerSub: { fontSize: 12, marginTop: 2 },
  nightBtn: { padding: 10, borderRadius: 10, marginLeft: 10 },
  emptyState: { alignItems: "center", marginTop: 80, paddingHorizontal: 32, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptyText: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  group: { marginHorizontal: 14, marginTop: 12 },
  groupHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  groupTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  groupCount: { fontSize: 12, fontWeight: "600", marginLeft: "auto" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    padding: 12,
    gap: 10,
  },
  stripe: { width: 4, height: 40, borderRadius: 2 },
  cardContent: { flex: 1 },
  cardLabel: { fontSize: 14, fontWeight: "700" },
  cardNotes: { fontSize: 12, marginTop: 2 },
  removeBtn: { padding: 4 },
});
