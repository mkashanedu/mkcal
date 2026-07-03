import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
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

import {
  FORMULARY_CATEGORIES,
  FORMULARY_DRUGS,
  FormularyDoseFormula,
  calculateFormularyDose,
  mgToVolumeMl,
} from "@/data/formularyData";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";

// ─── Section wrapper ────────────────────────────────────────────────────────
function Section({
  icon,
  title,
  accent,
  children,
  cardBg,
  borderColor,
  textPrimary,
}: {
  icon: string;
  title: string;
  accent: string;
  children: React.ReactNode;
  cardBg: string;
  borderColor: string;
  textPrimary: string;
}) {
  return (
    <View style={[sStyles.section, { backgroundColor: cardBg, borderColor }]}>
      <View style={sStyles.sectionHeader}>
        <View style={[sStyles.sectionIconWrap, { backgroundColor: accent + "18" }]}>
          <Feather name={icon as any} size={14} color={accent} />
        </View>
        <Text style={[sStyles.sectionTitle, { color: accent, fontFamily: "Inter_700Bold" }]}>
          {title.toUpperCase()}
        </Text>
      </View>
      {children}
    </View>
  );
}

// ─── Bullet row ─────────────────────────────────────────────────────────────
function Bullet({ text, color, textColor }: { text: string; color: string; textColor: string }) {
  return (
    <View style={bStyles.row}>
      <View style={[bStyles.dot, { backgroundColor: color }]} />
      <Text style={[bStyles.text, { color: textColor, fontFamily: "Inter_400Regular" }]}>{text}</Text>
    </View>
  );
}

// ─── Dose card ──────────────────────────────────────────────────────────────
function DoseCard({
  dose,
  index,
  weightKg,
  accent,
  cardBg,
  borderColor,
  textPrimary,
  textMuted,
  isDark,
  defaultConcMgPerMl,
}: {
  dose: FormularyDoseFormula;
  index: number;
  weightKg: number;
  accent: string;
  cardBg: string;
  borderColor: string;
  textPrimary: string;
  textMuted: string;
  isDark: boolean;
  defaultConcMgPerMl?: number;
}) {
  const result = calculateFormularyDose(dose, weightKg);

  // Determine whether this dose is convertible to a volume.
  // Only mass units (mg, mcg) make sense for mL conversion.
  const unitLower = dose.unit.toLowerCase();
  const isMcg = unitLower.includes("mcg");
  const isMg = !isMcg && unitLower.includes("mg");
  const isConvertible = isMg || isMcg;
  // Factor to convert the raw dose number to mg (mcg ÷ 1000)
  const toMgFactor = isMcg ? 0.001 : 1;

  // Pre-fill the concentration input from the drug's known formulation
  const defaultConcStr = defaultConcMgPerMl ? String(defaultConcMgPerMl) : "";
  const [concInput, setConcInput] = useState(defaultConcStr);
  const concValue = concInput !== "" ? parseFloat(concInput) : undefined;

  // Extract the leading numeric value from the calculated dose string
  const numMatch = result.calculated.match(/^([\d.]+)/);
  const rawNum = numMatch ? parseFloat(numMatch[1]) : null;
  const mgNum = rawNum !== null ? rawNum * toMgFactor : null;
  const effectiveConc = concValue && concValue > 0 ? concValue : undefined;
  const volumeMl =
    isConvertible && mgNum !== null && effectiveConc
      ? mgToVolumeMl(mgNum, effectiveConc)
      : null;

  return (
    <View
      style={[
        dStyles.card,
        {
          backgroundColor: isDark ? "#0A192F" : "#F8FFFE",
          borderColor: accent + "30",
          borderLeftColor: accent,
        },
      ]}
    >
      {/* Route badge */}
      <View style={dStyles.routeRow}>
        <View style={[dStyles.routeBadge, { backgroundColor: accent + "20" }]}>
          <Text style={[dStyles.routeText, { color: accent, fontFamily: "Inter_600SemiBold" }]}>
            {dose.route}
          </Text>
        </View>
        {dose.frequency && (
          <Text style={[dStyles.freqText, { color: textMuted, fontFamily: "Inter_400Regular" }]}>
            {dose.frequency}
          </Text>
        )}
      </View>

      {/* Calculated dose */}
      <View style={dStyles.calcRow}>
        <Text style={[dStyles.calcDose, { color: textPrimary, fontFamily: "Inter_700Bold" }]}>
          {result.calculated}
        </Text>
        <Text style={[dStyles.formula, { color: textMuted, fontFamily: "Inter_400Regular" }]}>
          {result.formula}
        </Text>
      </View>

      {/* Capped warning */}
      {result.exceedsMax && (
        <View style={[dStyles.capWarn, { backgroundColor: "#F59E0B18", borderColor: "#F59E0B50" }]}>
          <Feather name="alert-triangle" size={13} color="#F59E0B" style={{ marginRight: 5 }} />
          <Text style={[dStyles.capText, { color: "#B45309", fontFamily: "Inter_500Medium" }]}>
            {result.maxLabel}
          </Text>
        </View>
      )}

      {/* Max dose label */}
      {dose.maxDose && !result.exceedsMax && (
        <Text style={[dStyles.maxLabel, { color: textMuted, fontFamily: "Inter_400Regular" }]}>
          Max: {dose.maxDose}
        </Text>
      )}

      {/* Notes */}
      {dose.notes && (
        <Text style={[dStyles.notes, { color: textMuted, fontFamily: "Inter_400Regular" }]}>
          {dose.notes}
        </Text>
      )}

      {/* Volume conversion — only for mass-unit doses (mg / mcg) */}
      {isConvertible && (
        <View style={[dStyles.volSection, { borderTopColor: borderColor }]}>
          <Text style={[dStyles.volLabel, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>
            VOLUME CONVERSION{isMcg ? " (mcg → mg → mL)" : ""}
          </Text>
          <View style={dStyles.volRow}>
            <TextInput
              style={[
                dStyles.concInput,
                {
                  backgroundColor: isDark ? "#112240" : "#F0F4F8",
                  borderColor: accent + "40",
                  color: textPrimary,
                  fontFamily: "Inter_400Regular",
                },
              ]}
              placeholder="Conc. (mg/mL)"
              placeholderTextColor={textMuted}
              keyboardType="decimal-pad"
              value={concInput}
              onChangeText={setConcInput}
            />
            <Text style={[dStyles.volResult, { color: accent, fontFamily: "Inter_700Bold" }]}>
              {volumeMl !== null ? `= ${volumeMl} mL` : "—"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Main screen ────────────────────────────────────────────────────────────
export default function FormularyDrugDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { weight } = useWeight();

  const drug = FORMULARY_DRUGS.find((d) => d.id === id);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const cardBg = isDark ? "#112240" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";
  const borderColor = isDark ? "#233554" : "#E4EDF4";

  if (!drug) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: textPrimary, fontSize: 16, fontFamily: "Inter_500Medium" }}>Drug not found.</Text>
      </View>
    );
  }

  const cat = FORMULARY_CATEGORIES[drug.category];
  const accent = cat.color;
  const weightKg = weight ?? 10; // fallback for calculation display

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: accent }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={[styles.catPill, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
            <Feather name={cat.icon as any} size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={[styles.catPillText, { fontFamily: "Inter_600SemiBold" }]}>
              {cat.label}
            </Text>
          </View>
        </View>

        <View style={styles.headerContent}>
          <Text style={[styles.drugName, { fontFamily: "Inter_700Bold" }]}>
            {drug.name}
          </Text>
          {drug.genericName && (
            <Text style={[styles.genericName, { fontFamily: "Inter_400Regular" }]}>
              {drug.genericName}
            </Text>
          )}
          <Text style={[styles.drugClass, { fontFamily: "Inter_500Medium" }]}>
            {drug.drugClass}
          </Text>
        </View>

        {/* Weight banner */}
        <View style={[styles.weightBanner, { backgroundColor: "rgba(0,0,0,0.18)" }]}>
          <Feather name="user" size={13} color="rgba(255,255,255,0.85)" style={{ marginRight: 6 }} />
          <Text style={[styles.weightText, { fontFamily: "Inter_500Medium" }]}>
            {weight ? `Doses calculated for ${weight} kg` : "Set patient weight for dose calculation"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── 1. Indications & Contraindications ── */}
        <Section icon="check-circle" title="Indications & Contraindications" accent={accent} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary}>
          <Text style={[sStyles.subhead, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>Indications</Text>
          {drug.indications.map((ind, i) => (
            <Bullet key={i} text={ind} color={accent} textColor={textPrimary} />
          ))}
          <View style={[sStyles.divider, { backgroundColor: borderColor }]} />
          <Text style={[sStyles.subhead, { color: "#DC2626", fontFamily: "Inter_600SemiBold" }]}>Contraindications</Text>
          {drug.contraindications.map((ci, i) => (
            <Bullet key={i} text={ci} color="#DC2626" textColor={textPrimary} />
          ))}
        </Section>

        {/* ── 2. Dosing ── */}
        <Section icon="activity" title="Dosing" accent={accent} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary}>
          {!weight && (
            <View style={[dStyles.noWeightWarn, { backgroundColor: "#F59E0B14", borderColor: "#F59E0B40" }]}>
              <Feather name="alert-circle" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
              <Text style={[dStyles.noWeightText, { color: "#92400E", fontFamily: "Inter_400Regular" }]}>
                Set patient weight (calculator tab) for accurate dosing.
              </Text>
            </View>
          )}
          {drug.dosing.map((dose, i) => (
            <DoseCard
              key={i}
              dose={dose}
              index={i}
              weightKg={weightKg}
              accent={accent}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textMuted={textMuted}
              isDark={isDark}
              defaultConcMgPerMl={drug.concentrationMgPerMl}
            />
          ))}
          {drug.formulations && drug.formulations.length > 0 && (
            <View style={[dStyles.formulations, { borderTopColor: borderColor }]}>
              <Text style={[dStyles.formulationsLabel, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>
                AVAILABLE FORMULATIONS
              </Text>
              {drug.formulations.map((f, i) => (
                <Text key={i} style={[dStyles.formulationItem, { color: textPrimary, fontFamily: "Inter_400Regular" }]}>
                  • {f}
                </Text>
              ))}
            </View>
          )}
        </Section>

        {/* ── 3. Metabolism & Excretion ── */}
        <Section icon="zap" title="Metabolism & Excretion" accent={accent} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary}>
          <View style={meStyles.row}>
            <View style={[meStyles.label, { backgroundColor: accent + "14" }]}>
              <Text style={[meStyles.labelText, { color: accent, fontFamily: "Inter_700Bold" }]}>M</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[meStyles.header, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>Metabolism</Text>
              <Text style={[meStyles.body, { color: textPrimary, fontFamily: "Inter_400Regular" }]}>{drug.metabolism}</Text>
            </View>
          </View>
          <View style={[meStyles.separator, { backgroundColor: borderColor }]} />
          <View style={meStyles.row}>
            <View style={[meStyles.label, { backgroundColor: accent + "14" }]}>
              <Text style={[meStyles.labelText, { color: accent, fontFamily: "Inter_700Bold" }]}>E</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[meStyles.header, { color: textMuted, fontFamily: "Inter_600SemiBold" }]}>Excretion</Text>
              <Text style={[meStyles.body, { color: textPrimary, fontFamily: "Inter_400Regular" }]}>{drug.excretion}</Text>
            </View>
          </View>
        </Section>

        {/* ── 4. Clinical Monitoring ── */}
        <Section icon="eye" title="Clinical Monitoring" accent={accent} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary}>
          <Text style={[sStyles.sectionNote, { color: textMuted, fontFamily: "Inter_400Regular" }]}>
            Watch for the following parameters:
          </Text>
          {drug.monitoring.map((item, i) => (
            <View key={i} style={[monStyles.item, { borderColor: accent + "25", backgroundColor: accent + "08" }]}>
              <Feather name="monitor" size={13} color={accent} style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={[monStyles.text, { color: textPrimary, fontFamily: "Inter_400Regular" }]}>{item}</Text>
            </View>
          ))}
        </Section>

        {/* ── 5. Adverse Reactions ── */}
        <Section icon="alert-triangle" title="Adverse Reactions" accent="#DC2626" cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary}>
          {drug.adverseReactions.map((rxn, i) => (
            <View key={i} style={[arStyles.item, { borderColor: "#DC262625", backgroundColor: "#DC262608" }]}>
              <Feather name="alert-circle" size={13} color="#DC2626" style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={[arStyles.text, { color: textPrimary, fontFamily: "Inter_400Regular" }]}>{rxn}</Text>
            </View>
          ))}
        </Section>

        {/* ── Reference footer ── */}
        {drug.reference && (
          <View style={[styles.refFooter, { borderColor }]}>
            <Feather name="book-open" size={13} color={textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.refText, { color: textMuted, fontFamily: "Inter_400Regular" }]}>
              Reference: {drug.reference}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── StyleSheets ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  catPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  catPillText: { fontSize: 12, color: "#FFFFFF" },
  headerContent: { paddingHorizontal: 20, gap: 3 },
  drugName: { fontSize: 24, color: "#FFFFFF", letterSpacing: -0.5 },
  genericName: { fontSize: 14, color: "rgba(255,255,255,0.75)" },
  drugClass: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 2 },
  weightBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  weightText: { fontSize: 12, color: "rgba(255,255,255,0.9)" },
  scrollContent: { padding: 16, gap: 12 },
  refFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 4,
  },
  refText: { fontSize: 12 },
});

const sStyles = StyleSheet.create({
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 11, letterSpacing: 0.9 },
  subhead: { fontSize: 11, letterSpacing: 0.6, marginTop: 2, marginBottom: 2 },
  divider: { height: 1, marginVertical: 8 },
  sectionNote: { fontSize: 12, marginBottom: 2 },
});

const bStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginVertical: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  text: { fontSize: 13, lineHeight: 20, flex: 1 },
});

const dStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    gap: 8,
    marginTop: 4,
  },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  routeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  routeText: { fontSize: 11 },
  freqText: { fontSize: 12 },
  calcRow: { gap: 2 },
  calcDose: { fontSize: 22, letterSpacing: -0.5 },
  formula: { fontSize: 12 },
  capWarn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  capText: { fontSize: 12, flex: 1 },
  maxLabel: { fontSize: 12 },
  notes: { fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  volSection: { borderTopWidth: 1, paddingTop: 10, gap: 6 },
  volLabel: { fontSize: 10, letterSpacing: 0.7 },
  volRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  concInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 8 : 5,
    fontSize: 14,
  },
  volResult: { fontSize: 18, minWidth: 80, textAlign: "right" },
  noWeightWarn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  noWeightText: { fontSize: 12, flex: 1 },
  formulations: { borderTopWidth: 1, paddingTop: 10, gap: 4 },
  formulationsLabel: { fontSize: 10, letterSpacing: 0.7, marginBottom: 2 },
  formulationItem: { fontSize: 13, lineHeight: 20 },
});

const meStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  label: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  labelText: { fontSize: 14 },
  header: { fontSize: 11, letterSpacing: 0.5, marginBottom: 3 },
  body: { fontSize: 13, lineHeight: 20 },
  separator: { height: 1, marginVertical: 10 },
});

const monStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 3,
  },
  text: { fontSize: 13, lineHeight: 19, flex: 1 },
});

const arStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 3,
  },
  text: { fontSize: 13, lineHeight: 19, flex: 1 },
});
