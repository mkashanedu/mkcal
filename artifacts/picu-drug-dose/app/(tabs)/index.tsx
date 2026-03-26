import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { CATEGORIES, DRUGS, Drug, DrugCategory } from "@/constants/drugs";
import { useWeight } from "@/context/WeightContext";

const ALL = "all" as const;
type FilterTab = DrugCategory | typeof ALL;

export default function DrugListScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors.light;
  const { weight, setWeight, weightInput, setWeightInput } = useWeight();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterTab>(ALL);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites } = useWeight();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const categories: { key: FilterTab; label: string; color: string }[] = [
    { key: ALL, label: "All", color: colors.tint },
    ...Object.entries(CATEGORIES).map(([k, v]) => ({
      key: k as DrugCategory,
      label: v.label,
      color: v.color,
    })),
  ];

  const filtered = useMemo(() => {
    return DRUGS.filter((d) => {
      const matchCat = activeCategory === ALL || d.category === activeCategory;
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.genericName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        d.indications.some((i) =>
          i.toLowerCase().includes(search.toLowerCase())
        );
      const matchFav = !showFavoritesOnly || favorites.includes(d.id);
      return matchCat && matchSearch && matchFav;
    });
  }, [search, activeCategory, showFavoritesOnly, favorites]);

  function handleWeightChange(text: string) {
    setWeightInput(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0 && num <= 150) {
      setWeight(num);
    }
  }

  function renderCategoryPill(item: { key: FilterTab; label: string; color: string }) {
    const isActive = activeCategory === item.key;
    return (
      <Pressable
        key={item.key}
        onPress={() => setActiveCategory(item.key)}
        style={[
          styles.categoryPill,
          {
            backgroundColor: isActive ? item.color : isDark ? "#1E2D3D" : "#F0F4F8",
            borderColor: isActive ? item.color : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.categoryPillText,
            {
              color: isActive ? "#fff" : isDark ? "#8A9BB0" : "#4A5568",
              fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
            },
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  }

  function renderDrugItem({ item }: { item: Drug }) {
    const cat = CATEGORIES[item.category];
    const isFav = favorites.includes(item.id);
    return (
      <Pressable
        onPress={() => router.push({ pathname: "/drug/[id]", params: { id: item.id } })}
        style={({ pressed }) => [
          styles.drugCard,
          {
            backgroundColor: isDark ? "#0F1E2E" : "#FFFFFF",
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        <View
          style={[styles.categoryDot, { backgroundColor: cat.color }]}
        />
        <View style={styles.drugInfo}>
          <Text
            style={[
              styles.drugName,
              { color: isDark ? "#E8F0FE" : "#0D1B2A", fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {item.name}
          </Text>
          {item.genericName ? (
            <Text
              style={[
                styles.genericName,
                { color: isDark ? "#8A9BB0" : "#4A5568", fontFamily: "Inter_400Regular" },
              ]}
            >
              {item.genericName}
            </Text>
          ) : null}
          <Text
            style={[
              styles.indication,
              { color: isDark ? "#5A7A96" : "#8A9BB0", fontFamily: "Inter_400Regular" },
            ]}
            numberOfLines={1}
          >
            {item.indications.slice(0, 2).join(" · ")}
          </Text>
        </View>
        <View style={styles.drugRight}>
          <View style={[styles.catBadge, { backgroundColor: cat.color + "22" }]}>
            <Text style={[styles.catBadgeText, { color: cat.color, fontFamily: "Inter_500Medium" }]}>
              {cat.label}
            </Text>
          </View>
          {isFav && (
            <Feather name="bookmark" size={14} color={colors.accent} style={{ marginTop: 6 }} />
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#080E16" : "#F0F4F8" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: isDark ? "#0A1520" : "#FFFFFF",
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#E8F0FE" : "#0D1B2A", fontFamily: "Inter_700Bold" },
              ]}
            >
              PICU Drug Guide
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: isDark ? "#5A7A96" : "#8A9BB0", fontFamily: "Inter_400Regular" },
              ]}
            >
              Harriet Lane · {DRUGS.length} drugs
            </Text>
          </View>
          <View style={styles.weightBox}>
            <Text
              style={[
                styles.weightLabel,
                { color: colors.tint, fontFamily: "Inter_500Medium" },
              ]}
            >
              Weight (kg)
            </Text>
            <TextInput
              style={[
                styles.weightInput,
                {
                  color: isDark ? "#E8F0FE" : "#0D1B2A",
                  backgroundColor: isDark ? "#1E2D3D" : "#F0F4F8",
                  fontFamily: "Inter_700Bold",
                },
              ]}
              value={weightInput}
              onChangeText={handleWeightChange}
              keyboardType="decimal-pad"
              selectTextOnFocus
              maxLength={5}
            />
          </View>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: isDark ? "#1E2D3D" : "#F0F4F8" },
          ]}
        >
          <Feather name="search" size={16} color={isDark ? "#5A7A96" : "#8A9BB0"} />
          <TextInput
            style={[
              styles.searchInput,
              {
                color: isDark ? "#E8F0FE" : "#0D1B2A",
                fontFamily: "Inter_400Regular",
              },
            ]}
            placeholder="Search drugs, indications..."
            placeholderTextColor={isDark ? "#5A7A96" : "#8A9BB0"}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={isDark ? "#5A7A96" : "#8A9BB0"} />
            </Pressable>
          )}
          <View style={styles.searchDivider} />
          <Pressable onPress={() => setShowFavoritesOnly((v) => !v)}>
            <Feather
              name="bookmark"
              size={16}
              color={showFavoritesOnly ? colors.accent : isDark ? "#5A7A96" : "#8A9BB0"}
            />
          </Pressable>
        </View>

        {/* Category Pills */}
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => renderCategoryPill(item)}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillList}
        />
      </View>

      {/* Drug List */}
      <FlatList
        data={filtered}
        renderItem={renderDrugItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 84 : 90) },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="search" size={40} color={isDark ? "#1E2D3D" : "#E2E8F0"} />
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#5A7A96" : "#8A9BB0", fontFamily: "Inter_500Medium" },
              ]}
            >
              No drugs found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 24, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  weightBox: { alignItems: "flex-end" },
  weightLabel: { fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  weightInput: {
    width: 72,
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  searchDivider: { width: 1, height: 16, backgroundColor: "#CBD5E0", marginHorizontal: 2 },
  pillList: { paddingBottom: 8, gap: 8 },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryPillText: { fontSize: 12 },
  listContent: { padding: 12, gap: 8 },
  drugCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  categoryDot: {
    width: 4,
    height: 48,
    borderRadius: 2,
    flexShrink: 0,
  },
  drugInfo: { flex: 1 },
  drugName: { fontSize: 16, marginBottom: 2 },
  genericName: { fontSize: 13, marginBottom: 3 },
  indication: { fontSize: 12 },
  drugRight: { alignItems: "flex-end" },
  catBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catBadgeText: { fontSize: 10 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16 },
});
