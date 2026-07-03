import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  FORMULARY_CATEGORIES,
  FORMULARY_DRUGS,
  FormularyCategory,
} from "@/data/formularyData";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";

export default function FormularyCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { weight } = useWeight();
  const [search, setSearch] = useState("");

  const cat = FORMULARY_CATEGORIES[category as FormularyCategory];
  const drugs = useMemo(
    () =>
      FORMULARY_DRUGS.filter(
        (d) =>
          d.category === category &&
          (search.trim() === "" ||
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.drugClass.toLowerCase().includes(search.toLowerCase()) ||
            d.indications.some((i) =>
              i.toLowerCase().includes(search.toLowerCase())
            ))
      ),
    [category, search]
  );

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";
  const borderColor = isDark ? "#233554" : "#E4EDF4";
  const inputBg = isDark ? "#0A192F" : "#F0F4F8";
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  if (!cat) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: textPrimary, fontSize: 16, fontFamily: "Inter_500Medium" }}>
          Category not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? "#0A192F" : "#FFFFFF", borderBottomColor: borderColor }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: isDark ? "#233554" : "#F0F4F8" }]}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={isDark ? "#8892B0" : cat.color} />
          </TouchableOpacity>
          <View style={[styles.catIconWrap, { backgroundColor: cat.color + "20" }]}>
            <Feather name={cat.icon as any} size={18} color={cat.color} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.headerTitle, { color: textPrimary, fontFamily: "Inter_700Bold" }]} numberOfLines={1}>
              {cat.label}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textMuted, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
              {drugs.length} {drugs.length === 1 ? "medication" : "medications"}
              {weight ? ` · ${weight} kg` : ""}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: inputBg, borderColor }]}>
          <Feather name="search" size={15} color={textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary, fontFamily: "Inter_400Regular" }]}
            placeholder="Search drugs, class, indication…"
            placeholderTextColor={textMuted}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          {search.length > 0 && Platform.OS !== "ios" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={drugs}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Feather name="inbox" size={32} color={textMuted} style={{ marginBottom: 10 }} />
            <Text style={[styles.emptyText, { color: textMuted, fontFamily: "Inter_400Regular" }]}>
              {search ? "No drugs match your search." : "No drugs in this category yet."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/formulary/drug/${item.id}` as any)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: cardBg,
                borderColor,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            {/* Color accent strip */}
            <View style={[styles.accentStrip, { backgroundColor: cat.color }]} />

            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={[styles.drugName, { color: textPrimary, fontFamily: "Inter_700Bold" }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.genericName && (
                    <Text
                      style={[styles.genericName, { color: textMuted, fontFamily: "Inter_400Regular" }]}
                      numberOfLines={1}
                    >
                      {item.genericName}
                    </Text>
                  )}
                  <Text
                    style={[styles.drugClass, { color: cat.color, fontFamily: "Inter_600SemiBold" }]}
                    numberOfLines={1}
                  >
                    {item.drugClass}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={textMuted} style={{ marginTop: 4 }} />
              </View>

              {/* Indications preview */}
              <View style={styles.tagsRow}>
                {item.indications.slice(0, 3).map((ind, i) => (
                  <View
                    key={i}
                    style={[styles.tag, { backgroundColor: cat.color + "14", borderColor: cat.color + "30" }]}
                  >
                    <Text style={[styles.tagText, { color: cat.color, fontFamily: "Inter_500Medium" }]}>
                      {ind}
                    </Text>
                  </View>
                ))}
                {item.indications.length > 3 && (
                  <View style={[styles.tag, { backgroundColor: isDark ? "#1C2541" : "#F1F5F9", borderColor }]}>
                    <Text style={[styles.tagText, { color: textMuted, fontFamily: "Inter_500Medium" }]}>
                      +{item.indications.length - 3} more
                    </Text>
                  </View>
                )}
              </View>

              {/* Dose formula preview */}
              {item.dosing[0] && (
                <View style={[styles.dosePreview, { borderTopColor: borderColor }]}>
                  <Feather name="activity" size={12} color={textMuted} style={{ marginRight: 5 }} />
                  <Text style={[styles.dosePreviewText, { color: textMuted, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
                    {item.dosing[0].perKg
                      ? `${item.dosing[0].value ?? `${item.dosing[0].min}–${item.dosing[0].max}`} ${item.dosing[0].unit}`
                      : `${item.dosing[0].value ?? `${item.dosing[0].min}–${item.dosing[0].max}`} ${item.dosing[0].unit} (fixed)`}
                    {item.dosing[0].route ? ` · ${item.dosing[0].route}` : ""}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, marginTop: 1 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  searchInput: { flex: 1, fontSize: 14 },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  accentStrip: { width: 4 },
  cardBody: { flex: 1, padding: 14, gap: 8 },
  cardTop: { flexDirection: "row", alignItems: "flex-start" },
  drugName: { fontSize: 16, letterSpacing: -0.2 },
  genericName: { fontSize: 12, marginTop: 1 },
  drugClass: { fontSize: 12, marginTop: 4 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: { fontSize: 11 },
  dosePreview: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 2,
  },
  dosePreviewText: { fontSize: 12, flex: 1 },
  emptyWrap: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 14, textAlign: "center" },
});
