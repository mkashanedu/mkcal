import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { CATEGORIES, DRUGS, calculateDose } from "@/constants/allDrugs";
import { INFUSION_DRUGS } from "@/constants/infusions";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useHistory } from "@/context/HistoryContext";
import { usePreferences } from "@/context/PreferencesContext";
import { StarButton } from "@/components/StarButton";
import { highAlertInfo } from "@/lib/highAlert";
import { renalCaution } from "@/lib/renal";

export default function DrugDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = Colors.light;
  const { weight, age, ageUnit, ageConfirmed, setWeight, setAge, setAgeUnit, weightUnit } = useWeight();
  const ageMonths =
    ageConfirmed && Number.isFinite(age) && age > 0
      ? ageUnit === "years"
        ? age * 12
        : age
      : undefined;
  const { isFav, toggleFav } = useFavorites();
  const { addEntry } = useHistory();
  const { textScale } = usePreferences();
  const weightValid = Number.isFinite(weight) && weight > 0;

  const drug = DRUGS.find((d) => d.id === id);

  // ── Editable patient fields (P6): local text state, committed to the one
  // global WeightContext on blur/submit, so a change here applies app-wide.
  const [wText, setWText] = useState<string | null>(null);
  const [aText, setAText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const weightDisplay =
    wText ??
    (weightUnit === "lbs"
      ? String(Math.round(weight * 2.20462 * 10) / 10)
      : String(weight));
  const ageDisplay = aText ?? (ageConfirmed ? String(age) : "");
  const commitWeight = () => {
    if (wText === null) return;
    const parsed = parseFloat(wText.replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      setWeight(weightUnit === "lbs" ? parsed * 0.453592 : parsed);
    }
    setWText(null);
  };
  const commitAge = () => {
    if (aText === null) return;
    const parsed = parseFloat(aText.replace(",", "."));
    if (Number.isFinite(parsed) && parsed >= 0) setAge(parsed);
    setAText(null);
  };
  const switchAgeUnit = (u: "years" | "months") => {
    if (u === ageUnit) return;
    if (ageConfirmed && Number.isFinite(age)) {
      setAge(u === "months" ? age * 12 : Math.round((age / 12) * 10) / 10);
    }
    setAgeUnit(u);
    setAText(null);
  };

  // ── Infusion match (P8): does this drug have a full infusion setup?
  const infusionMatch = useMemo(() => {
    if (!drug) return null;
    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/\b(sulfate|sulphate|hydrochloride|hcl|sodium|iv)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
    const dn = norm(drug.name);
    const dg = drug.genericName ? norm(drug.genericName) : "";
    return (
      INFUSION_DRUGS.find((inf) => {
        const n = norm(inf.name);
        return n === dn || (dg !== "" && n === dg) || dn.startsWith(n) || n.startsWith(dn);
      }) ?? null
    );
  }, [drug]);

  // ── History (P10): log this calculation (drug + weight + headline dose).
  useEffect(() => {
    if (!drug || !weightValid) return;
    const first = drug.doses[0];
    if (!first) return;
    const calc = calculateDose(first, weight, ageMonths);
    addEntry({
      drugId: drug.id,
      drugName: drug.name,
      weightKg: weight,
      summary: `${first.route}: ${calc.dose}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drug?.id, weight]);

  if (!drug) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#0B132B" : "#F0F9FF", justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_500Medium", fontSize: 16 }}>
          Drug not found
        </Text>
      </View>
    );
  }

  const cat = CATEGORIES[drug.category];
  // Category colors are tuned for light backgrounds; in dark mode they are
  // lightened so dose values and badges stay readable on the dark cards.
  const themed = (hex: string) => (isDark ? lightenColor(hex, 0.5) : hex);
  const accent = themed(cat.color);
  const danger = themed(colors.danger);
  const f = isFav(drug.id);
  // Web: no native status-bar/header above this screen — a large top offset
  // was leaving a tall empty band in the coloured header (user feedback
  // 2026-11-01). Native keeps the safe-area inset.
  const topOffset = Platform.OS === "web" ? 10 : insets.top;

  // ── High-alert (extra batch): badge + double-check banner. Display only.
  const ha = highAlertInfo(drug);
  const renal = renalCaution(drug);

  // ── Weight plausibility (extra batch): a valid-but-unusual weight gets a
  // verify banner. Calculations are NOT blocked or changed.
  const weightWarning: string | null = !weightValid
    ? null
    : weight < 1
      ? `Weight ${weight} kg is extremely low for a child — please re-check the weight before giving any dose.`
      : weight < 2
        ? `Weight ${weight} kg is very low — please confirm this weight before giving any dose.`
        : weight > 80
          ? `Weight ${weight} kg is unusually high for a child — please re-check the weight; adult maximum doses may apply.`
          : weight > 60
            ? `Weight ${weight} kg is high for a child — please confirm the weight; most doses are capped at the adult maximum.`
            : null;

  // ── Copy / Share dose summary (extra batch): plain-text summary of what
  // is already on screen, for handover notes / WhatsApp. No patient data.
  const buildSummary = () => {
    const lines: string[] = [];
    lines.push(`PeadsCal — ${drug.name}${drug.genericName ? ` (${drug.genericName})` : ""}`);
    lines.push(
      `Patient: ${weight} kg${ageConfirmed ? `, age ${age} ${ageUnit}` : ""}`
    );
    if (ha.high) lines.push(`⚠ HIGH ALERT${ha.reason ? ` — ${ha.reason}` : ""}: double-check before giving.`);
    drug.doses.forEach((dose) => {
      const calc = calculateDose(dose, weight, ageMonths);
      let line = `• ${dose.route}: ${calc.dose} ${calc.range}`;
      if (dose.frequency) line += ` — ${dose.frequency}`;
      if (dose.maxDose) line += ` (Max: ${dose.maxDose})`;
      if (calc.exceedsAdultMax && calc.adultMaxLabel) line += ` ⚠ ${calc.adultMaxLabel}`;
      lines.push(line);
    });
    lines.push("Verify against the prescription before administration.");
    return lines.join("\n");
  };
  const handleShareDose = async () => {
    const text = buildSummary();
    if (Platform.OS === "web") {
      try {
        const nav: any = (globalThis as any).navigator;
        if (nav?.clipboard?.writeText) {
          await nav.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        }
      } catch {}
      // Clipboard unavailable (permissions/insecure context) — fall through to Share.
    }
    try {
      await Share.share({ message: text, title: `${drug.name} dose summary` });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0B132B" : "#F0F9FF" }]}>
      {/* Custom Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topOffset + 12,
            backgroundColor: cat.color,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() =>
              toggleFav({
                id: drug.id,
                type: "drug",
                label: drug.name,
                color: cat.color,
                category: cat.label,
                notes: drug.indications.slice(0, 2).join(" · "),
              })
            }
            style={styles.backBtn}
          >
            <Feather
              name={f ? "star" : "star"}
              size={22}
              color={f ? "#F59E0B" : "rgba(255,255,255,0.7)"}
            />
          </Pressable>
        </View>

        <View style={styles.headerContent}>
          {/* Category + HIGH ALERT badges share ONE row (compact header). */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <View style={[styles.catBadge, { backgroundColor: "rgba(255,255,255,0.25)", marginBottom: 0 }]}>
              <Text style={[styles.catBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                {cat.label}
              </Text>
            </View>
            {ha.high && (
              <View style={[styles.catBadge, { backgroundColor: "#B91C1C", flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 0 }]}>
                <Feather name="alert-octagon" size={11} color="#FFFFFF" />
                <Text style={[styles.catBadgeText, { fontFamily: "Inter_700Bold" }]}>
                  HIGH ALERT
                </Text>
              </View>
            )}
            {renal && (
              <View style={[styles.catBadge, { backgroundColor: "#D97706", flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 0 }]}>
                <Feather name="alert-triangle" size={11} color="#FFFFFF" />
                <Text style={[styles.catBadgeText, { fontFamily: "Inter_700Bold" }]}>
                  RENAL — CHECK DOSE
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.drugTitle, { fontFamily: "Inter_700Bold" }]}>
            {drug.name}
          </Text>
          {drug.genericName && (
            <Text style={[styles.genericTitle, { fontFamily: "Inter_400Regular" }]}>
              {drug.genericName}
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Renal caution (this batch): amber note under the header when the
            drug needs renal dose attention. */}
        {renal && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "flex-start",
              backgroundColor: isDark ? "#1A1407" : "#FFFBEB",
              borderWidth: 1,
              borderColor: "#D97706",
              borderRadius: 12,
              padding: 11,
              marginBottom: 12,
            }}
          >
            <Feather name="alert-triangle" size={14} color="#D97706" />
            <Text style={{ color: isDark ? "#FCD34D" : "#92400E", fontFamily: "Inter_500Medium", fontSize: 12.5, flex: 1, lineHeight: 17 }}>
              {renal.text}
            </Text>
          </View>
        )}

        {/* Patient Card — weight & age editable here (P6). One global
            weight/age for the whole app: editing here updates everywhere. */}
        <View
          style={[
            styles.patientCard,
            { backgroundColor: isDark ? "#112240" : "#FFFFFF" },
          ]}
        >
          <View style={styles.patientHead}>
            <Feather name="user" size={15} color={colors.tint} />
            <Text
              style={[
                styles.patientHeadText,
                { color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_600SemiBold" },
              ]}
            >
              {weightValid ? "Calculated for this patient" : "Weight invalid — calculations disabled"}
            </Text>
            <Feather name="edit-2" size={12} color={isDark ? "#A8B8DC" : "#8A9BB0"} />
          </View>
          <View style={styles.patientRow}>
            <View style={styles.patientField}>
              <Text style={[styles.patientLabel, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_500Medium" }]}>
                Weight ({weightUnit})
              </Text>
              <TextInput
                style={[
                  styles.patientInput,
                  {
                    color: colors.tint,
                    borderColor: isDark ? "#1E3A5F" : "#D6EAF8",
                    backgroundColor: isDark ? "#0A192F" : "#F4F9FC",
                    fontFamily: "Inter_700Bold",
                  },
                ]}
                value={weightDisplay}
                onChangeText={setWText}
                onBlur={commitWeight}
                onSubmitEditing={commitWeight}
                keyboardType="decimal-pad"
                selectTextOnFocus
              />
            </View>
            <View style={styles.patientField}>
              <Text style={[styles.patientLabel, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_500Medium" }]}>
                Age
              </Text>
              <View style={styles.ageRow}>
                <TextInput
                  style={[
                    styles.patientInput,
                    styles.ageInput,
                    {
                      color: colors.tint,
                      borderColor: isDark ? "#1E3A5F" : "#D6EAF8",
                      backgroundColor: isDark ? "#0A192F" : "#F4F9FC",
                      fontFamily: "Inter_700Bold",
                    },
                  ]}
                  value={ageDisplay}
                  onChangeText={setAText}
                  onBlur={commitAge}
                  onSubmitEditing={commitAge}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={isDark ? "#3A5070" : "#B0BEC5"}
                  selectTextOnFocus
                />
                <Pressable
                  onPress={() => switchAgeUnit("years")}
                  style={[styles.unitChip, { backgroundColor: ageUnit === "years" ? colors.tint : isDark ? "#0A192F" : "#EDF2F7" }]}
                >
                  <Text style={{ fontSize: 11, color: ageUnit === "years" ? "#FFFFFF" : isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_600SemiBold" }}>yrs</Text>
                </Pressable>
                <Pressable
                  onPress={() => switchAgeUnit("months")}
                  style={[styles.unitChip, { backgroundColor: ageUnit === "months" ? colors.tint : isDark ? "#0A192F" : "#EDF2F7" }]}
                >
                  <Text style={{ fontSize: 11, color: ageUnit === "months" ? "#FFFFFF" : isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_600SemiBold" }}>mo</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <Text style={[styles.patientHint, { color: isDark ? "#5B6B8C" : "#A0AEC0", fontFamily: "Inter_400Regular" }]}>
            Tap a value to change it — the new weight &amp; age apply across the whole app.
          </Text>
        </View>
        {!weightValid && (
          <View style={styles.invalidWeightNotice}>
            <Feather name="alert-triangle" size={14} color="#FFFFFF" />
            <Text style={[styles.invalidWeightText, { fontFamily: "Inter_600SemiBold" }]}>
              Enter a valid positive weight to calculate weight-based doses.
            </Text>
          </View>
        )}
        {weightWarning && (
          <View style={styles.weightWarningNotice}>
            <Feather name="alert-triangle" size={14} color="#FFFFFF" />
            <Text style={[styles.invalidWeightText, { fontFamily: "Inter_600SemiBold" }]}>
              {weightWarning}
            </Text>
          </View>
        )}
        {ha.high && (
          <View style={styles.highAlertBanner}>
            <Feather name="alert-octagon" size={15} color="#FFFFFF" />
            <Text style={[styles.invalidWeightText, { fontFamily: "Inter_600SemiBold" }]}>
              HIGH ALERT{ha.reason ? ` — ${ha.reason}` : ""}. Double-check the dose, concentration and calculation with a second nurse before giving.
            </Text>
          </View>
        )}

        {/* Doses */}
        <SectionHeader title="Dosing" icon="activity" color={accent} isDark={isDark} />
        <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
          {drug.doses.map((dose, i) => {
            const calc = calculateDose(dose, weight, ageMonths);
            return (
              <View
                key={i}
                style={[
                  styles.doseBlock,
                  {
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderTopColor: isDark ? "#0A192F" : "#EBF5FB",
                  },
                ]}
              >
                <View style={styles.doseTop}>
                  <View style={[styles.routeBadge, { backgroundColor: accent + "22" }]}>
                    <Feather name="arrow-right-circle" size={12} color={accent} />
                    <Text style={[styles.routeText, { color: accent, fontFamily: "Inter_600SemiBold" }]}>
                      {dose.route}
                    </Text>
                  </View>
                  {dose.frequency && (
                    <Text style={[styles.freqText, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
                      {dose.frequency}
                    </Text>
                  )}
                </View>
                <View style={styles.doseCalcRow}>
                  <View>
                    <Text style={[styles.calcLabel, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
                      Calculated Dose
                    </Text>
                    <Text style={[styles.calcValue, { color: accent, fontFamily: "Inter_700Bold", fontSize: Math.round(24 * textScale) }]}>
                      {calc.dose}
                    </Text>
                    <Text style={[styles.perKgText, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular", fontSize: Math.round(11 * textScale) }]}>
                      {calc.range}
                    </Text>
                  </View>
                  {dose.maxDose && (
                    <View style={[styles.maxDoseBox, { backgroundColor: danger + "15" }]}>
                      <Text style={[styles.maxDoseLabel, { color: danger, fontFamily: "Inter_500Medium" }]}>
                        Max Dose
                      </Text>
                      <Text style={[styles.maxDoseValue, { color: danger, fontFamily: "Inter_700Bold", fontSize: Math.round(14 * textScale) }]}>
                        {dose.maxDose}
                      </Text>
                    </View>
                  )}
                </View>
                {calc.exceedsAdultMax && calc.adultMaxLabel && (
                  <View style={styles.maxDoseWarning}>
                    <Feather name="alert-octagon" size={15} color="#FFFFFF" />
                    <Text style={[styles.maxDoseWarningText, { fontFamily: "Inter_700Bold" }]}>
                      {calc.adultMaxLabel}
                    </Text>
                  </View>
                )}
                {!calc.exceedsAdultMax && calc.nearCap && calc.doseCap !== undefined && (
                  <View style={styles.nearCapWarning}>
                    <Feather name="alert-triangle" size={14} color="#FFFFFF" />
                    <Text style={[styles.maxDoseWarningText, { fontFamily: "Inter_600SemiBold" }]}>
                      Close to the maximum dose ({calc.doseCap} {calc.doseCapUnit}) — verify the weight and the prescribed dose.
                    </Text>
                  </View>
                )}
                {dose.notes && (
                  <View style={[styles.noteBox, { backgroundColor: isDark ? "#0A192F" : "#F4F9FC" }]}>
                    <Feather name="info" size={12} color={isDark ? "#A8B8DC" : "#8A9BB0"} />
                    <Text style={[styles.noteText, { color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_400Regular", fontSize: Math.round(12 * textScale), lineHeight: Math.round(17 * textScale) }]}>
                      {dose.notes}
                    </Text>
                  </View>
                )}
                {calc.compatibilityMessage && (
                  <View style={[styles.noteBox, { backgroundColor: isDark ? "#0A192F" : "#F4F9FC" }]}>
                    <Feather name="droplet" size={12} color={isDark ? "#A8B8DC" : "#8A9BB0"} />
                    <Text style={[styles.noteText, { color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_400Regular", fontSize: Math.round(12 * textScale), lineHeight: Math.round(17 * textScale) }]}>
                      {calc.compatibilityMessage}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Copy / Share dose summary (extra batch) */}
        <Pressable
          onPress={handleShareDose}
          style={[
            styles.card,
            styles.shareBtn,
            { backgroundColor: copied ? "#15803D" : isDark ? "#112240" : "#FFFFFF" },
          ]}
        >
          <Feather name={copied ? "check" : "share-2"} size={16} color={copied ? "#FFFFFF" : colors.tint} />
          <Text
            style={{
              fontSize: 14.5,
              color: copied ? "#FFFFFF" : isDark ? "#CCD6F6" : "#0D1B2A",
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {copied ? "Copied — paste it in your handover note" : "Copy / Share Dose Summary"}
          </Text>
        </Pressable>

        {/* Infusion Setup (P8) — only for drugs that run as infusions;
            opens the full setup exactly as built in the Infusions section. */}
        {infusionMatch && (
          <>
            <SectionHeader title="Infusion Setup" icon="activity" color={accent} isDark={isDark} />
            <Pressable
              onPress={() => router.push(`/infusion/${infusionMatch.id}`)}
              style={[styles.card, styles.infusionCard, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}
            >
              <View style={[styles.infusionIcon, { backgroundColor: infusionMatch.color + "22" }]}>
                <Feather name="droplet" size={18} color={infusionMatch.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_600SemiBold" }}>
                  {infusionMatch.name} infusion
                </Text>
                <Text style={{ fontSize: 12.5, color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_400Regular", marginTop: 2 }}>
                  {infusionMatch.minDose}–{infusionMatch.maxDose} {infusionMatch.primaryUnit} · {infusionMatch.standardConcentrations.length} standard concentrations
                </Text>
                <Text style={{ fontSize: 12.5, color: colors.tint, fontFamily: "Inter_600SemiBold", marginTop: 4 }}>
                  Open full infusion setup →
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={isDark ? "#3A5070" : "#CBD5E0"} />
            </Pressable>
          </>
        )}

        {/* Indications */}
        <SectionHeader title="Indications" icon="check-circle" color={accent} isDark={isDark} />
        <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
          {drug.indications.map((ind, i) => (
            <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
              <View style={[styles.listDot, { backgroundColor: accent }]} />
              <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                {ind}
              </Text>
            </View>
          ))}
        </View>

        {/* Contraindications */}
        {drug.contraindications && drug.contraindications.length > 0 && (
          <>
            <SectionHeader title="Contraindications" icon="x-circle" color={danger} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              {drug.contraindications.map((c, i) => (
                <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                  <View style={[styles.listDot, { backgroundColor: danger }]} />
                  <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {c}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Warnings */}
        {drug.warnings && drug.warnings.length > 0 && (
          <>
            <SectionHeader title="Warnings" icon="alert-triangle" color={themed("#E67E22")} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              {drug.warnings.map((w, i) => (
                <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                  <Feather name="alert-triangle" size={14} color={themed("#E67E22")} />
                  <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {w}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Formulations */}
        {drug.formulations && drug.formulations.length > 0 && (
          <>
            <SectionHeader title="Formulations" icon="package" color={isDark ? "#A8B8DC" : "#8A9BB0"} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              <View style={styles.formulationsRow}>
                {drug.formulations.map((f, i) => (
                  <View key={i} style={[styles.formulationTag, { backgroundColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                    <Text style={[styles.formulationText, { color: isDark ? "#A8B8DC" : "#4A5568", fontFamily: "Inter_400Regular" }]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Renal Dose Adjustments */}
        {drug.renalAdjustment && drug.renalAdjustment.length > 0 && (
          <>
            <SectionHeader title="Renal Dose Adjustment" icon="filter" color={themed("#0C7B9C")} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF", overflow: "visible" }]}>
              <View style={[styles.renalHeader, { backgroundColor: themed("#0C7B9C") + "18", borderBottomWidth: 1, borderBottomColor: isDark ? "#233554" : "#E8F4F8" }]}>
                <Text style={[styles.renalHeaderCell, { color: themed("#0C7B9C"), flex: 1, fontFamily: "Inter_600SemiBold" }]}>GFR (mL/min/1.73m²)</Text>
                <Text style={[styles.renalHeaderCell, { color: themed("#0C7B9C"), flex: 2, fontFamily: "Inter_600SemiBold" }]}>Adjustment</Text>
              </View>
              {drug.renalAdjustment.map((r, i) => (
                <View
                  key={i}
                  style={[
                    styles.renalRow,
                    { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" },
                  ]}
                >
                  <View style={[styles.renalGfrBox, { flex: 1 }]}>
                    <Text style={[styles.renalGfr, { color: themed("#0C7B9C"), fontFamily: "Inter_600SemiBold" }]}>
                      {r.gfr}
                    </Text>
                  </View>
                  <Text style={[styles.renalAdjText, { flex: 2, color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {r.adjustment}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Monitoring Parameters */}
        {drug.monitoring && drug.monitoring.length > 0 && (
          <>
            <SectionHeader title="Monitoring" icon="eye" color={themed("#6B2D8E")} isDark={isDark} />
            <View style={[styles.card, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
              {drug.monitoring.map((m, i) => (
                <View key={i} style={[styles.listRow, { borderTopWidth: i === 0 ? 0 : 1, borderTopColor: isDark ? "#0A192F" : "#EBF5FB" }]}>
                  <Feather name="check" size={14} color={themed("#6B2D8E")} />
                  <Text style={[styles.listText, { color: isDark ? "#CCD6F6" : "#0D1B2A", fontFamily: "Inter_400Regular" }]}>
                    {m}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Reference */}
        {drug.reference && (
          <View style={styles.referenceRow}>
            <Feather name="book-open" size={12} color={isDark ? "#A8B8DC" : "#8A9BB0"} />
            <Text style={[styles.referenceText, { color: isDark ? "#A8B8DC" : "#8A9BB0", fontFamily: "Inter_400Regular" }]}>
              {drug.reference}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function lightenColor(hex: string, amount: number): string {
  const n = hex.replace("#", "");
  const full = n.length === 3 ? n.split("").map((c) => c + c).join("") : n;
  const num = parseInt(full, 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((num >> 16) & 255);
  const g = mix((num >> 8) & 255);
  const b = mix(num & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function SectionHeader({
  title,
  icon,
  color,
  isDark,
}: {
  title: string;
  icon: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Feather name={icon as any} size={14} color={color} />
      <Text style={[styles.sectionTitle, { color, fontFamily: "Inter_600SemiBold" }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 12 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  headerContent: { paddingHorizontal: 20, gap: 4 },
  catBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4 },
  catBadgeText: { color: "#FFFFFF", fontSize: 11 },
  drugTitle: { fontSize: 23, color: "#FFFFFF", letterSpacing: -0.5 },
  genericTitle: { fontSize: 14, color: "rgba(255,255,255,0.75)" },
  scrollContent: { padding: 12, gap: 6 },
  weightBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  weightBannerText: { fontSize: 13, flex: 1 },
  weightBannerValue: { fontSize: 18 },
  patientCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
  },
  patientHead: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 10 },
  patientHeadText: { fontSize: 13, flex: 1 },
  patientRow: { flexDirection: "row", gap: 12 },
  patientField: { flex: 1 },
  patientLabel: { fontSize: 11.5, marginBottom: 5 },
  patientInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 17,
  },
  ageRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ageInput: { flex: 1 },
  unitChip: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 8 },
  patientHint: { fontSize: 11, marginTop: 9 },
  infusionCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  infusionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  invalidWeightNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#B91C1C",
  },
  invalidWeightText: { color: "#FFFFFF", fontSize: 13, flex: 1, lineHeight: 18 },
  weightWarningNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#D97706",
  },
  highAlertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#B91C1C",
  },
  nearCapWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#D97706",
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingVertical: 13,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    marginTop: 10,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  doseBlock: { padding: 14, gap: 10 },
  doseTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  routeText: { fontSize: 12 },
  freqText: { fontSize: 12 },
  doseCalcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  calcLabel: { fontSize: 11, marginBottom: 2 },
  calcValue: { fontSize: 24, letterSpacing: -0.5 },
  perKgText: { fontSize: 11, marginTop: 2 },
  maxDoseBox: { padding: 10, borderRadius: 8, alignItems: "center" },
  maxDoseLabel: { fontSize: 10, marginBottom: 2 },
  maxDoseValue: { fontSize: 14 },
  maxDoseWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#B91C1C",
  },
  maxDoseWarningText: { color: "#FFFFFF", fontSize: 13, flex: 1, lineHeight: 18 },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  noteText: { fontSize: 12, flex: 1, lineHeight: 17 },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  listText: { fontSize: 14, flex: 1, lineHeight: 20 },
  formulationsRow: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 8 },
  formulationTag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  formulationText: { fontSize: 13 },
  renalHeader: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  renalHeaderCell: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 },
  renalRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "flex-start",
    gap: 8,
  },
  renalGfrBox: {},
  renalGfr: { fontSize: 13 },
  renalAdjText: { fontSize: 13, lineHeight: 19 },
  referenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginTop: 4,
  },
  referenceText: { fontSize: 12, fontStyle: "italic" },
});
