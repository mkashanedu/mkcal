/**
 * Y-Site Compatibility Checker (P12) — pick 2–3 IV drugs and see, pair by
 * pair, whether they may share one line/Y-connector. Only verified pairs
 * from Trissel's-based sources are marked; everything else honestly
 * reports "no verified data".
 */
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { goBack } from "@/lib/nav";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  YSITE_DRUGS,
  YSITE_PAIR_COUNT,
  YSITE_SOURCE_NOTE,
  ysiteVerdict,
} from "@/constants/ysite";
import { useTheme } from "@/context/ThemeContext";

export default function YSiteScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);

  const bg = isDark ? "#06231D" : "#F0F9FF";
  const card = isDark ? "#0B352B" : "#FFFFFF";
  const text = isDark ? "#C9E8DF" : "#0D1B2A";
  const muted = isDark ? "#A8B8DC" : "#4A5568";
  const topOffset = Platform.OS === "web" ? 67 : insets.top;

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const pairs = useMemo(() => {
    const out: { a: string; b: string }[] = [];
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        out.push({ a: selected[i], b: selected[j] });
      }
    }
    return out;
  }, [selected]);

  const nameOf = (id: string) => YSITE_DRUGS.find((d) => d.id === id)?.name ?? id;
  const noteOf = (id: string) => YSITE_DRUGS.find((d) => d.id === id)?.note;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: topOffset + 8 }]}>
        <Pressable onPress={() => goBack(router)} style={[styles.backBtn, { backgroundColor: isDark ? "#173F31" : "#E8F1F8" }]}>
          <Feather name="arrow-left" size={18} color={text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: text, fontFamily: "Inter_700Bold" }]}>
            Y-Site Compatibility
          </Text>
          <Text style={{ color: muted, fontFamily: "Inter_400Regular", fontSize: 12 }}>
            {YSITE_PAIR_COUNT} verified pairs · tap 2–3 drugs
          </Text>
        </View>
        {selected.length > 0 && (
          <Pressable onPress={() => setSelected([])} style={[styles.backBtn, { backgroundColor: isDark ? "#173F31" : "#E8F1F8" }]}>
            <Feather name="x" size={16} color={muted} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        {/* Drug picker */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {YSITE_DRUGS.map((d) => {
            const active = selected.includes(d.id);
            return (
              <Pressable
                key={d.id}
                onPress={() => toggle(d.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1.5,
                  backgroundColor: active ? "#0F7668" : card,
                  borderColor: active ? "#0F7668" : isDark ? "#1E3A5F" : "#D6EAF8",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Inter_600SemiBold",
                    color: active ? "#FFFFFF" : text,
                  }}
                >
                  {d.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Verdicts */}
        {pairs.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: card }]}>
            <Feather name="git-merge" size={26} color={muted} />
            <Text style={{ color: muted, fontFamily: "Inter_500Medium", fontSize: 13.5, marginTop: 10, textAlign: "center", lineHeight: 19 }}>
              Select at least 2 drugs to check whether they can
              run through the same line / Y-connector.
            </Text>
          </View>
        ) : (
          pairs.map(({ a, b }) => {
            const v = ysiteVerdict(a, b);
            const color = v.status === "C" ? "#16A34A" : v.status === "I" ? "#DC2626" : "#D97706";
            const label =
              v.status === "C"
                ? "COMPATIBLE — may share a Y-site"
                : v.status === "I"
                  ? "INCOMPATIBLE — do NOT run together"
                  : v.status === "COND"
                    ? "CONDITIONAL — depends on concentration"
                    : "NO VERIFIED DATA";
            return (
              <View key={`${a}|${b}`} style={[styles.verdict, { backgroundColor: card, borderLeftColor: color }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Feather
                    name={v.status === "C" ? "check-circle" : v.status === "I" ? "x-octagon" : v.status === "COND" ? "alert-circle" : "help-circle"}
                    size={19}
                    color={color}
                  />
                  <Text style={{ color, fontFamily: "Inter_700Bold", fontSize: 14.5, flex: 1 }}>
                    {label}
                  </Text>
                </View>
                <Text style={{ color: text, fontFamily: "Inter_600SemiBold", fontSize: 13.5, marginTop: 7 }}>
                  {nameOf(a)}  +  {nameOf(b)}
                </Text>
                {v.note && (
                  <Text style={{ color: muted, fontFamily: "Inter_400Regular", fontSize: 12.5, marginTop: 3, lineHeight: 17 }}>
                    {v.note}
                  </Text>
                )}
              </View>
            );
          })
        )}

        {/* Per-drug standing warnings for anything selected */}
        {selected.map((id) =>
          noteOf(id) ? (
            <View key={`note-${id}`} style={[styles.drugNote, { backgroundColor: isDark ? "#1A1407" : "#FFFBEB", borderColor: "#D97706" }]}>
              <Feather name="alert-triangle" size={14} color="#D97706" />
              <Text style={{ color: isDark ? "#FCD34D" : "#92400E", fontFamily: "Inter_500Medium", fontSize: 12.5, flex: 1, lineHeight: 17 }}>
                {nameOf(id)}: {noteOf(id)}
              </Text>
            </View>
          ) : null
        )}

        <Text style={{ color: muted, fontFamily: "Inter_400Regular", fontSize: 11.5, lineHeight: 16.5, marginTop: 16 }}>
          {YSITE_SOURCE_NOTE}
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
  title: { fontSize: 19 },
  empty: {
    borderRadius: 14,
    padding: 26,
    alignItems: "center",
    marginTop: 18,
  },
  verdict: {
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderLeftWidth: 4,
  },
  drugNote: {
    borderRadius: 12,
    padding: 11,
    marginTop: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
});
