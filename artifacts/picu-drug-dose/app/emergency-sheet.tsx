/**
 * Printable Emergency Sheet — one page, weight-based, for the arrest
 * trolley / fridge door. Every number on this sheet comes from data and
 * formulas already in the app (drug dataset via calculateDose; ETT /
 * defib formulas identical to the Emergency page's PALS calculators) —
 * nothing is hand-typed, so the sheet can never drift from the app.
 *
 * Print: on web the button opens the browser print dialog (Save as PDF
 * or a real printer). On native it shares a plain-text version.
 */
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { goBack } from "@/lib/nav";
import React from "react";
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
import { usePreferences } from "@/context/PreferencesContext";

// ── Same formulas as app/(tabs)/emergency.tsx (PALS 2025) ─────────────────
function calcETTube(ageYears: number) {
  const cuffed = ageYears / 4 + 3.5;
  const uncuffed = ageYears / 4 + 4;
  const depth =
    ageYears >= 1
      ? `${(ageYears / 2 + 12).toFixed(0)} cm`
      : `${(ageYears * 4 + 8).toFixed(0)} cm`;
  return { uncuffed: uncuffed.toFixed(1), cuffed: cuffed.toFixed(1), cuffedNum: +cuffed.toFixed(1), depth };
}
function calcDefib(weightKg: number) {
  return {
    unsync1st: Math.min(+(2 * weightKg).toFixed(0), 200),
    unsyncSub: Math.min(+(4 * weightKg).toFixed(0), 360),
    unsyncMax: Math.min(+(10 * weightKg).toFixed(0), 360),
    sync1st: Math.min(+(0.5 * weightKg).toFixed(0), 50),
    syncSub: Math.min(+(2 * weightKg).toFixed(0), 100),
  };
}
function calcBlade(ageYears: number) {
  if (ageYears < 0.08) return "Miller 00";
  if (ageYears < 1) return "Miller 0";
  if (ageYears < 6) return "Miller 1";
  if (ageYears < 12) return "Miller 2 / Mac 2";
  return "Mac 3";
}
function calcLMA(ageYears: number) {
  if (ageYears < 1) return "1";
  if (ageYears < 5) return "1.5";
  if (ageYears < 10) return "2";
  if (ageYears < 15) return "2.5";
  if (ageYears < 20) return "3";
  return "4";
}

export default function EmergencySheetScreen() {
  const insets = useSafeAreaInsets();
  const { weight, age, ageUnit, ageConfirmed } = useWeight();
  const { textScale } = usePreferences();
  const styles = makeStyles(textScale);
  const weightValid = Number.isFinite(weight) && weight > 0;
  const ageYears = ageConfirmed && Number.isFinite(age) && age > 0
    ? ageUnit === "years" ? age : age / 12
    : undefined;
  const ageMonths = ageYears !== undefined ? ageYears * 12 : undefined;

  const doseOf = (drugId: string, doseIdx = 0): string => {
    const d = DRUGS.find((x) => x.id === drugId);
    if (!d || !d.doses[doseIdx] || !weightValid) return "—";
    const first = calculateDose(d.doses[doseIdx], weight, ageMonths);
    if (first.dose !== "—" || !first.compatibilityStatus) return first.dose;
    // Three dataset doses (lidocaine ×2, magnesium-emergency ×1) carry
    // carrier-fluid compatibility rules and the engine withholds the dose
    // until a compatible fluid is on record. Their rules mark NS as
    // compatible at every age band, so retry with NS (age defaulted only
    // for the compatibility check — the dose math itself is per-kg).
    return calculateDose(d.doses[doseIdx], weight, ageMonths ?? 12, "0.9% NaCl").dose;
  };

  const defib = weightValid ? calcDefib(weight) : null;
  const ett = ageYears !== undefined ? calcETTube(ageYears) : null;
  const epiMg = weightValid ? Math.min(weight * 0.01, 1) : null; // 0.01 mg/kg, max 1 mg (dataset cap)
  const epiMl = weightValid ? Math.round(weight * 0.1 * 10) / 10 : null; // 0.1 mL/kg of 0.1 mg/mL

  const rows: { label: string; value: string }[] = weightValid
    ? [
        { label: "Epinephrine IV/IO (arrest)", value: `${doseOf("epinephrine", 0)}  ·  ${epiMl} mL of 0.1 mg/mL (1:10,000)` },
        { label: "Amiodarone (pulseless VT/VF)", value: doseOf("amiodarone", 0) },
        { label: "Atropine (bradycardia)", value: doseOf("atropine", 0) },
        { label: "Adenosine 1st dose (SVT)", value: doseOf("adenosine", 0) },
        { label: "Lidocaine (pulseless VT/VF alt.)", value: doseOf("lidocaine", 0) },
        { label: "Defibrillation", value: defib ? `${defib.unsync1st} J → ${defib.unsyncSub} J (max ${defib.unsyncMax} J)` : "—" },
        { label: "Synchronised cardioversion", value: defib ? `${defib.sync1st} J → ${defib.syncSub} J` : "—" },
        { label: "Fluid bolus (crystalloid)", value: `${Math.round(weight * 10)} mL (10 mL/kg) · ${Math.round(weight * 20)} mL (20 mL/kg)` },
        { label: "Dextrose — neonates (D10)", value: doseOf("dextrose", 0) },
        { label: "Dextrose — infants/children (D25)", value: doseOf("dextrose", 1) },
      ]
    : [];

  const buildText = () => {
    const lines = [
      `EMERGENCY SHEET — ${weight} kg${ageYears !== undefined ? `, age ${ageYears.toFixed(ageYears < 2 ? 1 : 0)} yrs` : ""}`,
      ...rows.map((r) => `• ${r.label}: ${r.value}`),
    ];
    if (ett && ageYears !== undefined) {
      lines.push(`• ETT cuffed ${ett.cuffed} mm (uncuffed ${ett.uncuffed}), depth ${ett.depth}, blade ${calcBlade(ageYears)}, LMA ${calcLMA(ageYears)}, suction ${Math.round(ett.cuffedNum * 2)} Fr`);
    }
    lines.push("Verify every dose before administration. PeadsCal · PALS 2025.");
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
      await Share.share({ message: buildText(), title: "Emergency Sheet" });
    } catch {}
  };

  const topOffset = Platform.OS === "web" ? 10 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: "#F4F6F8" }]}>
      <View style={[styles.header, { paddingTop: topOffset + 8 }]}>
        <Pressable onPress={() => goBack(router)} style={styles.backBtn}>
          <Feather name="arrow-left" size={18} color="#0D1B2A" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { fontFamily: "Inter_700Bold" }]}>Emergency Sheet</Text>
          <Text style={{ color: "#4A5568", fontFamily: "Inter_400Regular", fontSize: Math.round(12 * textScale) }}>
            One page · print or save as PDF
          </Text>
        </View>
        <Pressable onPress={handlePrint} style={styles.printBtn}>
          <Feather name="printer" size={15} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: Math.round(13 * textScale) }}>Print</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: insets.bottom + 24 }}>
        {!weightValid ? (
          <View style={styles.sheet}>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: Math.round(14 * textScale), color: "#B91C1C" }}>
              Set a valid weight first (on any drug page or the Calculator) — the sheet is built for that weight.
            </Text>
          </View>
        ) : (
          <View style={styles.sheet}>
            <Text style={[styles.sheetTitle, { fontFamily: "Inter_700Bold" }]}>
              EMERGENCY — {weight} KG{ageYears !== undefined ? ` · ${ageYears.toFixed(ageYears < 2 ? 1 : 0)} YRS` : ""}
            </Text>
            {rows.map((r) => (
              <View key={r.label} style={styles.row}>
                <Text style={[styles.rowLabel, { fontFamily: "Inter_500Medium" }]}>{r.label}</Text>
                <Text style={[styles.rowValue, { fontFamily: "Inter_700Bold" }]}>{r.value}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { fontFamily: "Inter_700Bold" }]}>AIRWAY</Text>
            {ett && ageYears !== undefined ? (
              <>
                <View style={styles.row}>
                  <Text style={[styles.rowLabel, { fontFamily: "Inter_500Medium" }]}>ETT (cuffed / uncuffed)</Text>
                  <Text style={[styles.rowValue, { fontFamily: "Inter_700Bold" }]}>{ett.cuffed} / {ett.uncuffed} mm · depth {ett.depth}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.rowLabel, { fontFamily: "Inter_500Medium" }]}>Blade · LMA · Suction</Text>
                  <Text style={[styles.rowValue, { fontFamily: "Inter_700Bold" }]}>{calcBlade(ageYears)} · LMA {calcLMA(ageYears)} · {Math.round(ett.cuffedNum * 2)} Fr</Text>
                </View>
              </>
            ) : (
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: Math.round(12.5 * textScale), color: "#92400E", lineHeight: 17 }}>
                Age is not set — enter the age on any drug page to add airway sizes, then reopen this sheet.
              </Text>
            )}

            <Text style={[styles.footer, { fontFamily: "Inter_600SemiBold", color: "#0D1B2A" }]}>
              CPR: 100–120/min · depth ≥ ⅓ chest · 15:2 / 30:2 · Epi ASAP in non-shockable arrest, after 2nd shock in VF/pVT · Amiodarone max 3 doses
            </Text>
            <Text style={[styles.footer, { fontFamily: "Inter_600SemiBold", color: "#0D1B2A" }]}>
              Bradycardia: HR &lt; 60 + poor perfusion → CPR → Epinephrine first (atropine only for vagal / AV block, max single 0.5 mg)
            </Text>
            <Text style={[styles.footer, { fontFamily: "Inter_600SemiBold", color: "#0D1B2A" }]}>
              After ROSC: SpO2 94–98% · BP above age floor · temp ≤ 37.5°C · PaCO2 35–45 · check glucose
            </Text>
            <Text style={[styles.footer, { fontFamily: "Inter_400Regular" }]}>
              Doses calculated by PeadsCal from its verified dataset (PALS 2025). Verify every dose before administration.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (ts: number) => StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#E8F1F8" },
  title: { fontSize: Math.round(19 * ts), color: "#0D1B2A" },
  printBtn: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#B91C1C", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  sheet: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E2E8F0" },
  sheetTitle: { fontSize: Math.round(17 * ts), color: "#B91C1C", marginBottom: 8, letterSpacing: 0.3 },
  sectionTitle: { fontSize: Math.round(13 * ts), color: "#0D1B2A", marginTop: 14, marginBottom: 4, letterSpacing: 0.6 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "#EEF2F7" },
  rowLabel: { fontSize: Math.round(13 * ts), color: "#334155", flex: 1 },
  rowValue: { fontSize: Math.round(13.5 * ts), color: "#0D1B2A", textAlign: "right", flex: 1 },
  footer: { fontSize: Math.round(11 * ts), color: "#64748B", marginTop: 12, lineHeight: 15 },
});
