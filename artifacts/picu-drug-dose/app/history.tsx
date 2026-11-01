/**
 * Calculation History — recent dose calculations (drug, weight, result).
 * Local-first; backed up to the user's account when signed in.
 */
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHistory } from "@/context/HistoryContext";
import { useTheme } from "@/context/ThemeContext";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { entries, clearHistory } = useHistory();

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#CCD6F6" : "#0D1B2A";
  const muted = isDark ? "#A8B8DC" : "#4A5568";
  const topOffset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: topOffset + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: isDark ? "#1A2F4A" : "#E8F1F8" }]}>
          <Feather name="arrow-left" size={18} color={text} />
        </Pressable>
        <Text style={[styles.title, { color: text, fontFamily: "Inter_700Bold" }]}>
          Calculation History
        </Text>
        {entries.length > 0 && (
          <Pressable onPress={clearHistory} style={[styles.backBtn, { backgroundColor: isDark ? "#1A2F4A" : "#E8F1F8" }]}>
            <Feather name="trash-2" size={16} color="#DC2626" />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        {entries.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: card }]}>
            <Feather name="clock" size={28} color={muted} />
            <Text style={{ color: muted, fontFamily: "Inter_500Medium", fontSize: 14, marginTop: 10, textAlign: "center" }}>
              No calculations yet.{"\n"}Open any drug and its dose calculation will appear here.
            </Text>
          </View>
        ) : (
          entries.map((e, i) => (
            <Pressable
              key={`${e.drugId}-${e.at}-${i}`}
              onPress={() => router.push(`/drug/${e.drugId}`)}
              style={[styles.row, { backgroundColor: card }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
                  {e.drugName}
                </Text>
                <Text style={{ color: muted, fontFamily: "Inter_400Regular", fontSize: 12.5, marginTop: 2 }}>
                  {e.summary}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: text, fontFamily: "Inter_700Bold", fontSize: 13 }}>
                  {e.weightKg} kg
                </Text>
                <Text style={{ color: muted, fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 }}>
                  {new Date(e.at).toLocaleString([], {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </Pressable>
          ))
        )}
        <Text style={{ color: muted, fontFamily: "Inter_400Regular", fontSize: 11.5, textAlign: "center", marginTop: 14 }}>
          History holds drug names, the weight entered and dose results only — never patient information.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 19, flex: 1 },
  empty: {
    borderRadius: 14,
    padding: 28,
    alignItems: "center",
  },
  row: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
});
