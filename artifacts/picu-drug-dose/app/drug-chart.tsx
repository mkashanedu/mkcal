/**
 * Patient Drug Chart (Point 10) — a printable one-page chart of the
 * current patient's regular medicines at the current weight.
 * The drug list comes from the user's Favorites (starred drugs); if no
 * drug favorites exist, the most recently used drugs are used instead.
 * Every dose is calculated live from the dataset via calculateDose —
 * nothing is hand-typed.
 */
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { goBack } from "@/lib/nav";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DRUGS, calculateDose } from "@/constants/allDrugs";
import { useWeight } from "@/context/WeightContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useHistory } from "@/context/HistoryContext";
import { usePreferences } from "@/context/PreferencesContext";

export default function DrugChartScreen() {
  const insets = useSafeAreaInsets();
  const { weight, age, ageUnit, ageConfirmed, profiles, activeProfileId } = useWeight();
  const { items } = useFavorites();
  const { entries } = useHistory();
  const { textScale } = usePreferences();
  const styles = makeStyles(textScale);
  const weightValid = Number.isFinite(weight) && weight > 0;
  const ageYears = ageConfirmed && Number.isFinite(age) && age > 0
    ? ageUnit === "years" ? age : age / 12
    : undefined;
  const ageMonths = ageYears !== undefined ? ageYears * 12 : undefined;
  const patient = profiles.find((p) => p.id === activeProfileId);

  const chartDrugs = useMemo(() => {
    const favIds = items.filter((i) => i.type === "drug").map((i) => i.id);
    let drugs = favIds
      .map((id) => DRUGS.find((d) => d.id === id))
      .filter((d): d is (typeof DRUGS)[number] => !!d);
    if (drugs.length === 0) {
      const recentIds: string[] = [];
      for (const e of entries) {
        const did = (e as any).drugId ?? (e as any).id;
        if (typeof did === "string" && !recentIds.includes(did)) recentIds.push(did);
        if (recentIds.length >= 10) break;
      }
      drugs = recentIds
        .map((id) => DRUGS.find((d) => d.id === id))
        .filter((d): d is (typeof DRUGS)[number] => !!d);
    }
    return drugs.slice(0, 14);
  }, [items, entries]);

  const doseText = (drugId: string, doseIdx: number): string => {
    const d = DRUGS.find((x) => x.id === drugId);
    if (!d || !d.doses[doseIdx] || !weightValid) return "—";
    const r = calculateDose(d.doses[doseIdx], weight, ageMonths);
    if (r.dose !== "—" || !r.compatibilityStatus) return r.dose;
    return calculateDose(d.doses[doseIdx], weight, ageMonths ?? 12, "0.9% NaCl").dose;
  };

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const buildText = () => {
    const lines = [
      `PATIENT DRUG CHART — ${patient ? patient.name + " · " : ""}${weight} kg${ageYears !== undefined ? ` · ${ageYears.toFixed(ageYears < 2 ? 1 : 0)} yrs` : ""} · ${today}`,
      ...chartDrugs.flatMap((d) =>
        d.doses.slice(0, 3).map(
          (dd, i) => `• ${d.name} (${dd.label || dd.route || "dose"}): ${doseText(d.id, i)}${dd.frequency ? " · " + dd.frequency : ""}`
        )
      ),
      "Verify every dose before administration. PeadsCal.",
    ];
    return lines.join("\n");
  };

  const handlePrint = async () => {
    if (Platform.OS === "web") {
      try {
        (globalThis as any).window?.print?.();
        return;
      } catch {}
    }
    try {
      await Share.share({ message: buildText(), title: "Patient Drug Chart" });
    } catch {}
  };

  const topOffset = Platform.OS === "web" ? 10 : insets.top;

  return (
    <View style={[styles.screen, { paddingTop: topOffset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => goBack(router)} style={styles.backBtn}>
          <Feather name="arrow-left" size={18} color="#0D1B2A" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable onPress={handlePrint} style={styles.printBtn}>
          <Feather name="printer" size={16} color="#FFFFFF" />
          <Text style={styles.printText}>Print / Share</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sheet}>
          <Text style={[styles.title, { fontFamily: "Inter_800ExtraBold" }]}>
            PATIENT DRUG CHART
          </Text>
          <Text style={[styles.sub, { fontFamily: "Inter_400Regular" }]}>
            {patient ? `Patient: ${patient.name}  ·  ` : ""}Weight: {weight} kg
            {ageYears !== undefined ? `  ·  Age: ${ageYears.toFixed(ageYears < 2 ? 1 : 0)} yrs` : "  ·  Age not set"}
            {`  ·  ${today}`}
          </Text>
          {!weightValid ? (
            <Text style={styles.warn}>Pehle kisi drug page par sahi wazan darj karein.</Text>
          ) : chartDrugs.length === 0 ? (
            <Text style={styles.warn}>
              Chart ke liye koi dawa nahi mili — pehle apni roz ki dawaiyon ko ★ (star) karke Favorites me shamil karein, phir ye chart unhi se ban jayega.
            </Text>
          ) : (
            chartDrugs.map((d) => (
              <View key={d.id} style={styles.drugBlock}>
                <Text style={[styles.drugName, { fontFamily: "Inter_700Bold" }]}>{d.name}</Text>
                {d.doses.slice(0, 3).map((dd, i) => (
                  <View key={i} style={styles.row}>
                    <Text style={[styles.rowLabel, { fontFamily: "Inter_400Regular" }]}>
                      {dd.label || dd.route || "Dose"} {dd.frequency ? `· ${dd.frequency}` : ""}
                    </Text>
                    <Text style={[styles.rowValue, { fontFamily: "Inter_700Bold" }]}>
                      {doseText(d.id, i)}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
          <Text style={[styles.footer, { fontFamily: "Inter_400Regular" }]}>
            Doses calculated by PeadsCal from its verified dataset (Harriet Lane 24e). Verify every dose before administration.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(ts: number) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F0F4F8" },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8 },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8 },
    backText: { fontSize: 14, color: "#0D1B2A", fontFamily: "Inter_600SemiBold" },
    printBtn: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#059669", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
    printText: { color: "#FFFFFF", fontSize: 13.5, fontFamily: "Inter_700Bold" },
    content: { padding: 14, paddingBottom: 30 },
    sheet: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 18, borderWidth: 1, borderColor: "#E2E8F0" },
    title: { fontSize: Math.round(17 * ts), color: "#0D1B2A", letterSpacing: 0.4 },
    sub: { fontSize: Math.round(12 * ts), color: "#475569", marginTop: 4, marginBottom: 10 },
    warn: { fontSize: Math.round(13 * ts), color: "#92400E", lineHeight: 19, fontFamily: "Inter_400Regular" },
    drugBlock: { borderTopWidth: 1, borderTopColor: "#E2E8F0", paddingVertical: 8 },
    drugName: { fontSize: Math.round(13.5 * ts), color: "#0D1B2A", marginBottom: 3 },
    row: { flexDirection: "row", justifyContent: "space-between", gap: 10, paddingVertical: 2 },
    rowLabel: { flex: 1, fontSize: Math.round(12 * ts), color: "#475569" },
    rowValue: { fontSize: Math.round(12.5 * ts), color: "#0D1B2A" },
    footer: { fontSize: Math.round(11 * ts), color: "#64748B", marginTop: 12, lineHeight: 15 },
  });
}
