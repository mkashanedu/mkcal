/**
 * VentilatorTool.tsx
 * Ventilator & ABG Management Module
 * Based on PALICC 2023 · Harriet Lane 22e/23e · Hamilton C3 Standards
 */
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Pathology = "normal" | "mild-moderate" | "severe";
type VentTab = "calculator" | "modes" | "protocols";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
// PALICC 2023 / Harriet Lane Vt targets (mL/kg IBW)
const VT_TARGETS: Record<Pathology, { min: number; max: number; label: string; color: string; description: string }> = {
  "normal":         { min: 8,  max: 10, label: "Normal Lungs / Asthma", color: "#0891B2", description: "Physiological tidal volume · Overcome airway resistance · Prolonged expiratory time" },
  "mild-moderate":  { min: 6,  max: 8,  label: "Mild / Moderate PARDS", color: "#D97706", description: "Lung-protective ventilation · PALICC 2023 · Pplat < 28 cmH₂O" },
  "severe":         { min: 4,  max: 6,  label: "Severe PARDS",          color: "#DC2626", description: "Ultra-protective LPV · Permissive hypercapnia · SpO₂ 88–92% acceptable" },
};

// ARDSNet Low PEEP / High FiO₂ Table (PALICC 2023 adapted)
const PEEP_FIO2_TABLE = [
  { fio2: "21–30%",  peepLow: 5,  peepHigh: 5  },
  { fio2: "30–40%",  peepLow: 5,  peepHigh: 8  },
  { fio2: "40–50%",  peepLow: 8,  peepHigh: 10 },
  { fio2: "50–60%",  peepLow: 10, peepHigh: 10 },
  { fio2: "60–70%",  peepLow: 10, peepHigh: 14 },
  { fio2: "70–80%",  peepLow: 14, peepHigh: 14 },
  { fio2: "80–90%",  peepLow: 14, peepHigh: 18 },
  { fio2: "90–100%", peepLow: 18, peepHigh: 24 },
];

// Hamilton C3 Modes Dictionary
const HAMILTON_MODES = [
  {
    name: "APVcmv",
    full: "Adaptive Pressure Ventilation — Controlled Mandatory Ventilation",
    icon: "cpu" as const,
    color: "#0891B2",
    description: "Volume-targeted, pressure-controlled mandatory breaths. Automatically adjusts inspiratory pressure breath-by-breath to deliver the set tidal volume at the lowest possible pressure. Ideal for lung-protective ventilation in PARDS.",
    indication: "PARDS · Post-op · Full ventilatory support needed",
    key_settings: ["Set Vt (mL/kg)", "RR (mandatory)", "PEEP", "FiO₂"],
  },
  {
    name: "APVsimv",
    full: "Adaptive Pressure Ventilation — Synchronized IMV",
    icon: "activity" as const,
    color: "#0D9488",
    description: "Combines APVcmv mandatory breaths with pressure-supported spontaneous breaths. Mandatory breaths are volume-targeted and pressure-limited; spontaneous efforts trigger pressure support above PEEP.",
    indication: "Weaning · Partial support · Transitional ventilation",
    key_settings: ["Set Vt (mandatory breaths)", "RR (mandatory)", "PS level", "PEEP", "FiO₂"],
  },
  {
    name: "PCV+",
    full: "Pressure-Controlled Ventilation",
    icon: "trending-up" as const,
    color: "#7C3AED",
    description: "All breaths are pressure-controlled and mandatory. Delivered volume depends on lung compliance and resistance — monitor Vt carefully. Square wave pressure delivery improves gas distribution.",
    indication: "Neonates · Poor compliance · Full mandatory support",
    key_settings: ["P control (above PEEP)", "RR", "Ti / I:E ratio", "PEEP", "FiO₂"],
  },
  {
    name: "PSIMV+",
    full: "Pressure-Controlled Synchronized IMV",
    icon: "bar-chart-2" as const,
    color: "#6366F1",
    description: "Mandatory breaths are pressure-controlled and synchronized to patient effort; spontaneous breaths above the mandatory rate receive pressure support. Allows gradual reduction of mandatory rate during weaning.",
    indication: "Weaning from full support · Partial support",
    key_settings: ["P control", "RR (mandatory)", "PS level", "Trigger sensitivity", "PEEP", "FiO₂"],
  },
  {
    name: "DuoPAP",
    full: "Duo Positive Airway Pressure",
    icon: "layers" as const,
    color: "#EC4899",
    description: "Biphasic pressure ventilation allowing unrestricted spontaneous breathing at both the high (P high) and low (P low) pressure levels. Maintains lung recruitment while preserving diaphragm activity.",
    indication: "ARDS with preserved respiratory drive · Avoid neuromuscular blockade",
    key_settings: ["P high", "P low", "T high", "T low", "FiO₂"],
  },
  {
    name: "APRV",
    full: "Airway Pressure Release Ventilation",
    icon: "wind" as const,
    color: "#F59E0B",
    description: "Prolonged high-pressure phase (T high: typically 4–6 s) maintains alveolar recruitment, with brief, frequent releases (T low: 0.4–0.8 s) to clear CO₂ while preventing derecruitment. Spontaneous breathing continues throughout.",
    indication: "Refractory hypoxaemia · Severe ARDS · Recruitment strategy",
    key_settings: ["P high (≈ Pplat target)", "P low (= 0)", "T high (4–6 s)", "T low (0.4–0.8 s)", "FiO₂"],
    warning: "Requires preserved respiratory drive. Monitor for auto-PEEP and derecruitment on release.",
  },
  {
    name: "SPONT (PS)",
    full: "Spontaneous / Pressure Support Ventilation",
    icon: "user" as const,
    color: "#16A34A",
    description: "All breaths are patient-triggered and pressure-supported. The patient controls rate, timing, and flow. No backup rate — mandatory minimum respiratory effort required. Reduces work of breathing while supporting patient effort.",
    indication: "Weaning · SBT · Adequate drive confirmed",
    key_settings: ["PS level (cmH₂O above PEEP)", "Trigger sensitivity", "PEEP", "FiO₂"],
    warning: "No backup rate. Ensure adequate respiratory drive before use alone.",
  },
  {
    name: "ASV",
    full: "Adaptive Support Ventilation",
    icon: "zap" as const,
    color: "#EA580C",
    description: "Intelligent closed-loop mode. Automatically adjusts mandatory rate and pressure support level to achieve a clinician-set %MinVol target, minimising work of breathing using the Otis equation. Applies lung-protective rules automatically.",
    indication: "All patients · Post-op · Reduces ventilator-induced injury",
    key_settings: ["%MinVol (typically 100%)", "PEEP", "FiO₂", "Height (for IBW)"],
  },
  {
    name: "NIV / NIV-ST",
    full: "Non-Invasive Ventilation (Spontaneous / Timed)",
    icon: "shield" as const,
    color: "#0EA5E9",
    description: "Delivers IPAP (inspiratory positive airway pressure) and EPAP (expiratory = PEEP) via mask. NIV mode is spontaneous-only; NIV-ST adds a timed backup rate. Includes IntelliTrig for automatic leak compensation — essential for paediatric mask interfaces.",
    indication: "Respiratory failure without intubation · Post-extubation support · Bronchiolitis · Asthma",
    key_settings: ["IPAP", "EPAP", "Backup RR (ST only)", "Ti", "FiO₂", "Leak compensation"],
  },
];

// ─── PATHOLOGY PROTOCOLS ──────────────────────────────────────────────────────
const PARDS_PROTOCOL = {
  title: "PARDS — Pediatric Acute Respiratory Distress Syndrome",
  guideline: "PALICC 2023",
  color: "#DC2626",
  icon: "alert-triangle" as const,
  definition: [
    "Acute onset respiratory failure within 7 days of clinical insult",
    "Bilateral infiltrates on CXR (not fully explained by effusions, collapse, or nodules)",
    "Respiratory failure not fully explained by cardiac failure",
    "Oxygenation impairment: OI ≥ 4 or OSI ≥ 5 (on CPAP/NIV ≥ 5 cmH₂O or intubated)",
  ],
  severity: [
    { level: "Mild",     criteria: "OI 4–8  |  OSI 5–7.5",   color: "#D97706" },
    { level: "Moderate", criteria: "OI 8–16  |  OSI 7.5–12.3", color: "#EA580C" },
    { level: "Severe",   criteria: "OI ≥ 16  |  OSI ≥ 12.3",  color: "#DC2626" },
  ],
  strategy: [
    { title: "Lung-Protective Ventilation (LPV)", items: [
      "Tidal Volume: 3–6 mL/kg IBW (severe) · 5–8 mL/kg IBW (mild-moderate)",
      "Plateau Pressure (Pplat): target < 28 cmH₂O (limit ≤ 30 cmH₂O)",
      "Driving Pressure (Pplat − PEEP): target ≤ 15 cmH₂O",
      "PEEP: minimum 5 cmH₂O · titrate to FiO₂ using ARDSNet table",
      "Peak Inspiratory Pressure (PIP): target < 28–30 cmH₂O",
      "Preferred modes: APVcmv · PCV+ with Vt monitoring",
    ]},
    { title: "Oxygenation Targets", items: [
      "SpO₂ 92–98% (mild-moderate PARDS)",
      "SpO₂ 88–92% acceptable in severe PARDS (permissive hypoxaemia)",
      "Avoid FiO₂ > 0.60 if achievable — optimise PEEP first",
    ]},
    { title: "Permissive Hypercapnia", items: [
      "pH target ≥ 7.20 (acceptable pH 7.15 in severe PARDS)",
      "PaCO₂ up to 50–70 mmHg tolerated if pH maintained",
      "Contraindicated: raised ICP, pulmonary hypertension, cardiac dysfunction",
    ]},
    { title: "Adjunct Therapies (Severe PARDS)", items: [
      "Prone positioning: consider if OI ≥ 16 unresponsive to conventional LPV",
      "Neuromuscular blockade (NMB): first 48h if severe, patient-ventilator dyssynchrony",
      "High-frequency oscillatory ventilation (HFOV): salvage if conventional LPV fails",
      "iNO: consider if severe pulmonary hypertension component",
      "Surfactant: not routinely recommended (insufficient evidence in PARDS)",
    ]},
    { title: "Fluid Management", items: [
      "Conservative fluid strategy after initial resuscitation",
      "Target neutral-to-negative fluid balance once haemodynamically stable",
      "Monitor for fluid overload — associated with worse outcomes",
    ]},
  ],
};

const ASTHMA_PROTOCOL = {
  title: "Status Asthmaticus — Ventilator Strategy",
  guideline: "Harriet Lane 22e/23e",
  color: "#7C3AED",
  icon: "wind" as const,
  strategy: [
    { title: "Goals of Mechanical Ventilation", items: [
      "Buy time for bronchodilators to work — ventilator support is temporising",
      "Avoid dynamic hyperinflation (auto-PEEP / breath stacking)",
      "Permissive hypercapnia accepted — avoid barotrauma",
      "Low respiratory rate (10–14/min) to allow full exhalation",
    ]},
    { title: "Recommended Settings (Harriet Lane)", items: [
      "Mode: Volume control (e.g., APVcmv) for consistent Vt delivery",
      "Tidal Volume: 8–10 mL/kg — normal lung targets (not ARDS)",
      "Respiratory Rate: 10–14/min (low) — prioritise expiratory time",
      "I:E Ratio: 1:3 to 1:4 (prolonged expiratory phase) — critical",
      "PEEP: LOW (3–5 cmH₂O) or even 0 — avoid worsening air trapping",
      "Peak Flow: high (to shorten Ti and lengthen Te)",
      "FiO₂: titrate to SpO₂ ≥ 92%",
    ]},
    { title: "Target Blood Gas Limits", items: [
      "pH: permissive hypercapnia — accept pH ≥ 7.20",
      "PaCO₂: may rise to 60–80 mmHg — tolerate if pH maintained",
      "Avoid aggressive hyperventilation — worsens dynamic hyperinflation",
    ]},
    { title: "Monitor for Complications", items: [
      "Auto-PEEP / breath stacking: disconnect briefly and observe recoil",
      "Pneumothorax: asymmetric breath sounds, sudden desaturation, ↑ PIP",
      "Haemodynamic compromise: auto-PEEP ↓ venous return → hypotension",
      "Circuit obstruction: mucus plugging, kinked ETT — check peak pressure trend",
    ]},
    { title: "Sedation Strategy", items: [
      "Ketamine infusion: bronchodilator + dissociative anaesthetic — first choice",
      "Ketamine bolus: 1–2 mg/kg IV for induction / procedural use",
      "Propofol infusion: bronchodilator properties (caution: PRIS in paediatrics)",
      "Avoid histamine-releasing agents (morphine) — may worsen bronchospasm",
      "Deep sedation + NMB initially — reduce dyssynchrony and barotrauma risk",
    ]},
    { title: "Concurrent Pharmacotherapy", items: [
      "Continuous salbutamol nebulisation (via ventilator circuit adaptor)",
      "Ipratropium bromide: 250–500 mcg q4–6h via circuit adaptor",
      "IV salbutamol infusion: 0.1–0.5 mcg/kg/min (escalate as needed)",
      "IV magnesium sulphate: 25–50 mg/kg over 20 min (max 2 g) — if not already given",
      "IV methylprednisolone: 1–2 mg/kg/dose q6–12h",
      "Heliox (70:30 He:O₂): improves gas flow in turbulent airways — adjunct",
    ]},
  ],
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function VentilatorTool() {
  const { isDark } = useTheme();
  const { weight: ctxWeight } = useWeight();

  // Theme colours
  const bg    = isDark ? "#0B132B" : "#F0F4F8";
  const card  = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const tp    = isDark ? "#CCD6F6" : "#0D1B2A";
  const tm    = isDark ? "#8892B0" : "#8A9BB0";
  const inputBg = isDark ? "#0A192F" : "#F8FAFC";

  // Tab navigation
  const [activeTab, setActiveTab] = useState<VentTab>("calculator");

  // ── Calculator state ──────────────────────────────────────────────────────
  const [weight, setWeight] = useState(ctxWeight > 0 ? ctxWeight.toString() : "");
  const [pathology, setPathology] = useState<Pathology>("mild-moderate");
  const [pip, setPip]       = useState("");
  const [pplat, setPplat]   = useState("");
  const [peep, setPeep]     = useState("");
  const [rr, setRr]         = useState("");
  const [fio2, setFio2]     = useState("");
  const [expandedMode, setExpandedMode] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("definition");

  const wt      = parseFloat(weight) || 0;
  const pipNum  = parseFloat(pip) || 0;
  const pplatNum = parseFloat(pplat) || 0;
  const peepNum = parseFloat(peep) || 0;
  const rrNum   = parseFloat(rr) || 0;
  const fio2Num = parseFloat(fio2) || 0;

  const target = VT_TARGETS[pathology];

  // Tidal volume targets
  const vtMin   = wt > 0 ? +(wt * target.min).toFixed(0) : null;
  const vtMax   = wt > 0 ? +(wt * target.max).toFixed(0) : null;
  const vtMid   = vtMin !== null && vtMax !== null ? Math.round((vtMin + vtMax) / 2) : null;

  // Minute ventilation (using midpoint Vt)
  const mv = vtMid !== null && rrNum > 0 ? +((rrNum * vtMid) / 1000).toFixed(2) : null;

  // Pressure checks
  const drivingPressure = pplatNum > 0 && peepNum >= 0 ? +(pplatNum - peepNum).toFixed(1) : null;
  const pplatOk  = pplatNum > 0 ? pplatNum < 28 : null;
  const dpOk     = drivingPressure !== null ? drivingPressure <= 15 : null;
  const pipOk    = pipNum > 0 ? pipNum < 30 : null;
  const peepOk   = peepNum > 0 ? peepNum >= 5 : null;

  // PEEP-FiO₂ suggestion for severe PARDS
  const peepSuggestion = (() => {
    if (pathology !== "severe" || fio2Num <= 0) return null;
    const row = PEEP_FIO2_TABLE.find((r, i) => {
      if (i === 0) return fio2Num <= 30;
      const prevMax = [30, 40, 50, 60, 70, 80, 90][i - 1];
      const curMax  = [30, 40, 50, 60, 70, 80, 90, 100][i];
      return fio2Num > prevMax && fio2Num <= curMax;
    }) ?? PEEP_FIO2_TABLE[PEEP_FIO2_TABLE.length - 1];
    return row;
  })();

  // ── Helpers ───────────────────────────────────────────────────────────────
  function statusBadge(ok: boolean | null, good: string, warn: string, bad: string) {
    if (ok === null) return { text: "—", color: tm };
    if (ok) return { text: good, color: "#16A34A" };
    return { text: bad, color: "#DC2626" };
  }

  function InputRow({ label, value, onChange, unit, placeholder }: {
    label: string; value: string; onChange: (v: string) => void;
    unit?: string; placeholder?: string;
  }) {
    return (
      <View style={s.inputRow}>
        <Text style={[s.inputLabel, { color: tm }]}>{label}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <TextInput
            style={[s.input, { color: tp, backgroundColor: inputBg, borderColor: border }]}
            value={value} onChangeText={onChange}
            keyboardType="decimal-pad"
            placeholder={placeholder ?? "—"}
            placeholderTextColor={tm}
          />
          {unit ? <Text style={{ fontSize: 12, color: tm, minWidth: 52 }}>{unit}</Text> : null}
        </View>
      </View>
    );
  }

  function PressureCheck({ label, value, ok, target: tgt }: {
    label: string; value: string | null; ok: boolean | null; target: string;
  }) {
    const color = ok === null ? tm : ok ? "#16A34A" : "#DC2626";
    return (
      <View style={[s.pressureRow, { borderColor: color + "40" }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: tm, fontWeight: "600" }}>{label}</Text>
          <Text style={{ fontSize: 10, color: tm, marginTop: 1 }}>Target: {tgt}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color }}>{value ?? "—"}</Text>
          {ok !== null && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <Feather name={ok ? "check-circle" : "alert-circle"} size={11} color={color} />
              <Text style={{ fontSize: 10, color, fontWeight: "700" }}>{ok ? "OK" : "EXCEED"}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Calculator Tab
  // ─────────────────────────────────────────────────────────────────────────
  function renderCalculator() {
    return (
      <View style={{ gap: 14 }}>

        {/* Pathology Selector */}
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={s.cardHeader}>
            <View style={[s.iconBadge, { backgroundColor: target.color + "1A" }]}>
              <Feather name="sliders" size={16} color={target.color} />
            </View>
            <Text style={[s.cardTitle, { color: tp }]}>Pathology / Ventilation Strategy</Text>
          </View>
          <View style={{ gap: 8, marginTop: 10 }}>
            {(["normal", "mild-moderate", "severe"] as Pathology[]).map((p) => {
              const t = VT_TARGETS[p];
              const sel = pathology === p;
              return (
                <TouchableOpacity
                  key={p} onPress={() => setPathology(p)}
                  style={[s.pathBtn, {
                    borderColor: sel ? t.color : border,
                    backgroundColor: sel ? t.color + "14" : isDark ? "#0A192F" : "#F8FAFC",
                  }]}
                  activeOpacity={0.75}
                >
                  <View style={[s.pathDot, { backgroundColor: sel ? t.color : (isDark ? "#233554" : "#CBD5E1") }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: sel ? t.color : tp }}>{t.label}</Text>
                    <Text style={{ fontSize: 11, color: tm, marginTop: 2 }}>Vt {t.min}–{t.max} mL/kg · {t.description.split(" · ")[0]}</Text>
                  </View>
                  {sel && <Feather name="check-circle" size={16} color={t.color} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Patient Weight */}
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={s.cardHeader}>
            <View style={[s.iconBadge, { backgroundColor: "#0891B215" }]}>
              <Feather name="user" size={16} color="#0891B2" />
            </View>
            <Text style={[s.cardTitle, { color: tp }]}>Patient Weight</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <InputRow label="Weight (IBW preferred)" value={weight} onChange={setWeight} unit="kg" placeholder="kg" />
            {ctxWeight > 0 && (
              <TouchableOpacity onPress={() => setWeight(ctxWeight.toString())}
                style={{ marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Feather name="link" size={12} color="#0891B2" />
                <Text style={{ fontSize: 12, color: "#0891B2", fontWeight: "600" }}>
                  Use global weight: {ctxWeight} kg
                </Text>
              </TouchableOpacity>
            )}
            <View style={[s.infoBanner, { backgroundColor: "#0891B210", borderColor: "#0891B230", marginTop: 10 }]}>
              <Feather name="info" size={13} color="#0891B2" />
              <Text style={{ fontSize: 11, color: isDark ? "#8892B0" : "#475569", flex: 1, lineHeight: 16 }}>
                Use Ideal Body Weight (IBW) for tidal volume calculation, especially in obese patients.
                IBW estimation: Boys: 50 + 2.3 × (height in cm − 152.4) / 2.54 · Girls: 45.5 + 2.3 × (height in cm − 152.4) / 2.54
              </Text>
            </View>
          </View>
        </View>

        {/* Tidal Volume Calculator */}
        {wt > 0 && (
          <View style={[s.card, { backgroundColor: card, borderColor: target.color + "50", borderWidth: 2 }]}>
            <View style={s.cardHeader}>
              <View style={[s.iconBadge, { backgroundColor: target.color + "1A" }]}>
                <Feather name="wind" size={16} color={target.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.cardTitle, { color: tp }]}>Tidal Volume Targets</Text>
                <Text style={{ fontSize: 11, color: target.color, fontWeight: "700", marginTop: 2 }}>
                  {target.label} · PALICC 2023 / Harriet Lane
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 12, gap: 10 }}>
              {/* Vt Range */}
              <View style={[s.vtBox, { backgroundColor: target.color + "12", borderColor: target.color + "40" }]}>
                <Text style={{ fontSize: 12, color: target.color + "CC", fontWeight: "700", marginBottom: 6 }}>
                  TIDAL VOLUME RANGE
                </Text>
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 11, color: tm }}>Minimum</Text>
                    <Text style={{ fontSize: 28, fontWeight: "900", color: target.color }}>{vtMin}</Text>
                    <Text style={{ fontSize: 11, color: tm }}>mL</Text>
                  </View>
                  <Text style={{ fontSize: 24, color: tm, marginBottom: 8 }}>–</Text>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 11, color: tm }}>Maximum</Text>
                    <Text style={{ fontSize: 28, fontWeight: "900", color: target.color }}>{vtMax}</Text>
                    <Text style={{ fontSize: 11, color: tm }}>mL</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 11, color: tm }}>Start</Text>
                    <Text style={{ fontSize: 22, fontWeight: "800", color: tp }}>{vtMid}</Text>
                    <Text style={{ fontSize: 11, color: tm }}>mL</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 11, color: tm, marginTop: 8 }}>
                  {target.min}–{target.max} mL/kg × {wt} kg · STRICT LIMIT: 4–10 mL/kg absolute
                </Text>
              </View>

              {/* Minute Ventilation */}
              {rrNum > 0 && mv !== null && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10,
                  borderRadius: 10, backgroundColor: isDark ? "#0A192F" : "#F0F9FF",
                  borderWidth: 1, borderColor: "#0891B230" }}>
                  <Feather name="activity" size={16} color="#0891B2" />
                  <View>
                    <Text style={{ fontSize: 11, color: tm }}>Estimated Minute Ventilation (using midpoint Vt)</Text>
                    <Text style={{ fontSize: 18, fontWeight: "800", color: "#0891B2" }}>
                      {mv} L/min
                    </Text>
                    <Text style={{ fontSize: 11, color: tm }}>{rrNum} breaths/min × {vtMid} mL</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Respiratory Rate & I:E */}
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={s.cardHeader}>
            <View style={[s.iconBadge, { backgroundColor: "#16A34A15" }]}>
              <Feather name="clock" size={16} color="#16A34A" />
            </View>
            <Text style={[s.cardTitle, { color: tp }]}>Respiratory Rate & I:E Ratio</Text>
          </View>
          <View style={{ marginTop: 10, gap: 8 }}>
            <InputRow label="Respiratory Rate" value={rr} onChange={setRr} unit="breaths/min" placeholder="e.g. 20" />

            {/* Age-based RR guidance */}
            <View style={[s.infoBanner, { backgroundColor: "#16A34A10", borderColor: "#16A34A30" }]}>
              <Feather name="info" size={13} color="#16A34A" />
              <Text style={{ fontSize: 11, color: isDark ? "#8892B0" : "#475569", flex: 1, lineHeight: 16 }}>
                Age-based RR guide: Neonate 40–60 · Infant 30–40 · 1–5 yr 20–30 · 6–11 yr 18–24 · ≥12 yr 12–20
              </Text>
            </View>

            {/* I:E guidance */}
            <View style={[s.infoBanner, {
              backgroundColor: pathology === "normal" ? "#7C3AED10" : "#0891B210",
              borderColor: pathology === "normal" ? "#7C3AED30" : "#0891B230",
            }]}>
              <Feather name="sliders" size={13} color={pathology === "normal" ? "#7C3AED" : "#0891B2"} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: pathology === "normal" ? "#7C3AED" : "#0891B2", marginBottom: 2 }}>
                  {pathology === "normal" ? "Asthma I:E Target: 1:3 to 1:4 (prolonged expiration)" : "Standard I:E: 1:2"}
                </Text>
                <Text style={{ fontSize: 11, color: isDark ? "#8892B0" : "#475569", lineHeight: 16 }}>
                  {pathology === "normal"
                    ? "Critical in asthma: prolonged expiratory time prevents auto-PEEP and dynamic hyperinflation. Low PEEP (3–5 cmH₂O) or even 0."
                    : "Adjust Ti to optimise gas distribution. In PARDS, avoid auto-PEEP."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* FiO₂ & PEEP */}
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={s.cardHeader}>
            <View style={[s.iconBadge, { backgroundColor: "#D9770615" }]}>
              <Feather name="droplet" size={16} color="#D97706" />
            </View>
            <Text style={[s.cardTitle, { color: tp }]}>FiO₂ & PEEP</Text>
          </View>
          <View style={{ marginTop: 10, gap: 8 }}>
            <InputRow label="FiO₂" value={fio2} onChange={setFio2} unit="%" placeholder="e.g. 40" />
            <InputRow label="PEEP" value={peep} onChange={setPeep} unit="cmH₂O" placeholder="e.g. 8" />

            {/* PEEP check */}
            {peepNum > 0 && (
              <View style={[s.infoBanner, {
                backgroundColor: peepOk === false ? "#DC262610" : "#16A34A10",
                borderColor: peepOk === false ? "#DC262630" : "#16A34A30",
              }]}>
                <Feather name={peepOk === false ? "alert-triangle" : "check-circle"} size={13}
                  color={peepOk === false ? "#DC2626" : "#16A34A"} />
                <Text style={{ fontSize: 12, color: peepOk === false ? "#DC2626" : "#16A34A", flex: 1, fontWeight: "600" }}>
                  {peepOk === false
                    ? "PEEP < 5 cmH₂O — minimum 5 cmH₂O required for ARDS diagnosis (PALICC 2023)"
                    : `PEEP ${peepNum} cmH₂O — meets minimum threshold (≥ 5 cmH₂O)`}
                </Text>
              </View>
            )}

            {/* PEEP-FiO₂ table for severe PARDS */}
            {pathology === "severe" && (
              <View style={{ marginTop: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Feather name="table" size={13} color="#DC2626" />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#DC2626" }}>
                    ARDSNet PEEP-FiO₂ Table — Severe PARDS
                  </Text>
                </View>
                {PEEP_FIO2_TABLE.map((row, i) => {
                  const highlighted = peepSuggestion === row;
                  return (
                    <View key={i} style={[s.tableRow, {
                      backgroundColor: highlighted ? "#DC262615" : (i % 2 === 0 ? (isDark ? "#0A192F" : "#F8FAFC") : "transparent"),
                      borderColor: highlighted ? "#DC2626" : "transparent",
                      borderWidth: highlighted ? 1.5 : 0,
                      borderRadius: highlighted ? 8 : 0,
                    }]}>
                      <Text style={{ fontSize: 12, color: highlighted ? "#DC2626" : tp, fontWeight: highlighted ? "700" : "500", flex: 1 }}>
                        FiO₂ {row.fio2}
                      </Text>
                      <Text style={{ fontSize: 12, color: highlighted ? "#DC2626" : tm, fontWeight: highlighted ? "700" : "500" }}>
                        PEEP {row.peepLow === row.peepHigh ? row.peepLow : `${row.peepLow}–${row.peepHigh}`} cmH₂O
                      </Text>
                      {highlighted && <Feather name="arrow-left" size={12} color="#DC2626" style={{ marginLeft: 6 }} />}
                    </View>
                  );
                })}
                {peepSuggestion && (
                  <View style={[s.infoBanner, { backgroundColor: "#DC262610", borderColor: "#DC262630", marginTop: 8 }]}>
                    <Feather name="target" size={13} color="#DC2626" />
                    <Text style={{ fontSize: 12, color: "#DC2626", flex: 1, fontWeight: "600" }}>
                      For FiO₂ {fio2}%: Target PEEP {peepSuggestion.peepLow === peepSuggestion.peepHigh
                        ? peepSuggestion.peepLow
                        : `${peepSuggestion.peepLow}–${peepSuggestion.peepHigh}`} cmH₂O
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Pressure Monitoring */}
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={s.cardHeader}>
            <View style={[s.iconBadge, { backgroundColor: "#DC262615" }]}>
              <Feather name="bar-chart-2" size={16} color="#DC2626" />
            </View>
            <Text style={[s.cardTitle, { color: tp }]}>Pressure Safety Checks</Text>
          </View>
          <View style={{ marginTop: 10, gap: 8 }}>
            <InputRow label="Peak Inspiratory Pressure (PIP)" value={pip} onChange={setPip} unit="cmH₂O" placeholder="cmH₂O" />
            <InputRow label="Plateau Pressure (Pplat)" value={pplat} onChange={setPplat} unit="cmH₂O" placeholder="cmH₂O" />

            {/* Derived values */}
            {(pipNum > 0 || pplatNum > 0) && (
              <View style={{ gap: 8, marginTop: 6 }}>
                <PressureCheck
                  label="Peak Inspiratory Pressure (PIP)"
                  value={pipNum > 0 ? `${pipNum} cmH₂O` : null}
                  ok={pipNum > 0 ? pipNum < 30 : null}
                  target="< 28–30 cmH₂O"
                />
                <PressureCheck
                  label="Plateau Pressure (Pplat)"
                  value={pplatNum > 0 ? `${pplatNum} cmH₂O` : null}
                  ok={pplatNum > 0 ? pplatNum < 28 : null}
                  target="< 28 cmH₂O (limit ≤ 30)"
                />
                {drivingPressure !== null && (
                  <PressureCheck
                    label="Driving Pressure (Pplat − PEEP)"
                    value={`${drivingPressure} cmH₂O`}
                    ok={drivingPressure <= 15}
                    target="≤ 15 cmH₂O"
                  />
                )}
              </View>
            )}

            {/* Overall safety alert */}
            {(pplatNum > 0 || pipNum > 0) && (() => {
              const anyBreach = (pplatNum > 0 && pplatNum >= 28) || (pipNum > 0 && pipNum >= 30) || (drivingPressure !== null && drivingPressure > 15);
              const critical = (pplatNum > 0 && pplatNum >= 30) || (pipNum > 0 && pipNum >= 35);
              if (!anyBreach) return null;
              return (
                <View style={[s.alertBanner, {
                  backgroundColor: critical ? "#DC262615" : "#D9770615",
                  borderColor: critical ? "#DC2626" : "#D97706",
                }]}>
                  <Feather name="alert-triangle" size={16} color={critical ? "#DC2626" : "#D97706"} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "800", color: critical ? "#DC2626" : "#D97706", marginBottom: 4 }}>
                      {critical ? "CRITICAL: Pressure limit exceeded" : "WARNING: Pressure threshold exceeded"}
                    </Text>
                    <Text style={{ fontSize: 12, color: isDark ? "#8892B0" : "#475569", lineHeight: 17 }}>
                      {critical
                        ? "Immediate action required: Reduce Vt or PC · Increase PEEP · Consider NMB · Reassess lung mechanics"
                        : "Consider reducing tidal volume or pressure control · Check compliance · Reassess pathology"}
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>
        </View>

        {/* Summary Box */}
        {wt > 0 && (
          <View style={[s.card, { backgroundColor: isDark ? "#0F1F2E" : "#F0F9FF", borderColor: "#0891B240", borderWidth: 1.5 }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Feather name="clipboard" size={16} color="#0891B2" />
              <Text style={[s.cardTitle, { color: "#0891B2" }]}>Initial Settings Summary</Text>
            </View>
            {[
              { label: "Mode", value: pathology === "normal" ? "APVcmv (Volume control)" : "APVcmv or PCV+" },
              { label: "Tidal Volume", value: vtMin && vtMax ? `${vtMin}–${vtMax} mL  (${target.min}–${target.max} mL/kg)` : "—" },
              { label: "PEEP", value: pathology === "severe" ? "Titrate to FiO₂ (ARDSNet table)" : pathology === "normal" ? "3–5 cmH₂O (low)" : "5–10 cmH₂O" },
              { label: "Pplat target", value: "< 28 cmH₂O" },
              { label: "Driving Pressure", value: "≤ 15 cmH₂O" },
              { label: "PIP limit", value: "< 28–30 cmH₂O" },
              { label: "I:E Ratio", value: pathology === "normal" ? "1:3 to 1:4 (prolonged exp.)" : "1:2" },
              { label: "SpO₂ target", value: pathology === "severe" ? "88–92% (permissive hypoxaemia)" : "92–98%" },
              { label: "pH target", value: "≥ 7.20 (permissive hypercapnia)" },
            ].map((row) => (
              <View key={row.label} style={{ flexDirection: "row", paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: isDark ? "#1A2A4A" : "#E2F4FB" }}>
                <Text style={{ fontSize: 12, color: tm, flex: 1 }}>{row.label}</Text>
                <Text style={{ fontSize: 12, fontWeight: "700", color: tp, flex: 1.5, textAlign: "right" }}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={[s.disclaimer, { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
          <Feather name="shield" size={14} color={tm} style={{ marginTop: 1 }} />
          <Text style={{ fontSize: 11, color: tm, flex: 1, lineHeight: 16, fontStyle: "italic" }}>
            Calculations based on PALICC 2023, Harriet Lane 22e/23e. Hamilton C3 is a registered trademark of Hamilton Medical. For educational use only. Verify all settings with physician orders before implementation.
          </Text>
        </View>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Hamilton C3 Modes Tab
  // ─────────────────────────────────────────────────────────────────────────
  function renderModes() {
    return (
      <View style={{ gap: 10 }}>
        {/* Header */}
        <View style={[s.card, { backgroundColor: "#0891B215", borderColor: "#0891B240" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather name="cpu" size={20} color="#0891B2" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#0891B2" }}>Hamilton C3 — Mode Dictionary</Text>
              <Text style={{ fontSize: 11, color: tm, marginTop: 2 }}>
                Hamilton Medical · {HAMILTON_MODES.length} ventilation modes · Tap to expand
              </Text>
            </View>
          </View>
        </View>

        {HAMILTON_MODES.map((mode) => {
          const expanded = expandedMode === mode.name;
          return (
            <TouchableOpacity
              key={mode.name}
              onPress={() => setExpandedMode(expanded ? null : mode.name)}
              activeOpacity={0.85}
              style={[s.card, {
                backgroundColor: card,
                borderColor: expanded ? mode.color + "60" : border,
                borderWidth: expanded ? 1.5 : 1,
              }]}
            >
              {/* Left stripe */}
              <View style={[s.stripe, { backgroundColor: mode.color }]} />

              {/* Header row */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingLeft: 10 }}>
                <View style={[s.iconBadge, { backgroundColor: mode.color + "1A", width: 44, height: 44 }]}>
                  <Feather name={mode.icon} size={20} color={mode.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: "900", color: mode.color }}>{mode.name}</Text>
                    {mode.warning && (
                      <View style={{ backgroundColor: "#DC262620", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 9, fontWeight: "800", color: "#DC2626" }}>CAUTION</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 11, color: tm, marginTop: 1 }} numberOfLines={expanded ? 0 : 1}>
                    {mode.full}
                  </Text>
                </View>
                <Feather name={expanded ? "chevron-up" : "chevron-down"} size={18} color={tm} />
              </View>

              {/* Expanded content */}
              {expanded && (
                <View style={{ paddingLeft: 10, marginTop: 14, gap: 12 }}>
                  {/* Description */}
                  <Text style={{ fontSize: 13, color: tp, lineHeight: 20 }}>{mode.description}</Text>

                  {/* Indication */}
                  <View style={[s.infoBanner, { backgroundColor: mode.color + "10", borderColor: mode.color + "30" }]}>
                    <Feather name="check" size={13} color={mode.color} />
                    <Text style={{ fontSize: 12, color: isDark ? "#8892B0" : "#475569", flex: 1 }}>
                      <Text style={{ fontWeight: "700", color: mode.color }}>Indication: </Text>
                      {mode.indication}
                    </Text>
                  </View>

                  {/* Key settings */}
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: mode.color, marginBottom: 6 }}>KEY SETTINGS</Text>
                    <View style={{ gap: 4 }}>
                      {mode.key_settings.map((setting, i) => (
                        <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: mode.color, marginTop: 5 }} />
                          <Text style={{ fontSize: 12, color: tp, flex: 1, lineHeight: 18 }}>{setting}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Warning */}
                  {mode.warning && (
                    <View style={[s.alertBanner, { backgroundColor: "#DC262612", borderColor: "#DC262640" }]}>
                      <Feather name="alert-triangle" size={14} color="#DC2626" />
                      <Text style={{ fontSize: 12, color: isDark ? "#8892B0" : "#475569", flex: 1, lineHeight: 17 }}>
                        <Text style={{ fontWeight: "700", color: "#DC2626" }}>Warning: </Text>
                        {mode.warning}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Disclaimer */}
        <View style={[s.disclaimer, { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
          <Feather name="shield" size={14} color={tm} style={{ marginTop: 1 }} />
          <Text style={{ fontSize: 11, color: tm, flex: 1, lineHeight: 16, fontStyle: "italic" }}>
            Hamilton C3 is a registered trademark of Hamilton Medical AG. Mode descriptions are for educational reference only. Consult the Hamilton C3 operator manual for complete clinical guidance.
          </Text>
        </View>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Protocols Tab
  // ─────────────────────────────────────────────────────────────────────────
  function ProtocolSection({ title, items, color }: { title: string; items: string[]; color: string }) {
    const key = title;
    const open = expandedSection === key;
    return (
      <View style={{ borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: isDark ? "#233554" : "#E2E8F0" }}>
        <TouchableOpacity
          onPress={() => setExpandedSection(open ? null : key)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12,
            backgroundColor: open ? color + "10" : (isDark ? "#0A192F" : "#F8FAFC") }}
          activeOpacity={0.8}
        >
          <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color={color} />
          <Text style={{ flex: 1, fontSize: 13, fontWeight: "700", color: open ? color : tp }}>{title}</Text>
        </TouchableOpacity>
        {open && (
          <View style={{ padding: 12, gap: 6, backgroundColor: card }}>
            {items.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                <Text style={{ fontSize: 14, color, marginTop: -2 }}>•</Text>
                <Text style={{ fontSize: 12, color: tp, flex: 1, lineHeight: 18 }}>{item}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  function renderProtocols() {
    return (
      <View style={{ gap: 14 }}>

        {/* ── PARDS ── */}
        <View style={[s.card, { backgroundColor: card, borderColor: "#DC262640", borderWidth: 1.5 }]}>
          <View style={[s.stripe, { backgroundColor: "#DC2626" }]} />
          <View style={{ paddingLeft: 10 }}>
            {/* Protocol header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <View style={[s.iconBadge, { backgroundColor: "#DC262615" }]}>
                <Feather name={PARDS_PROTOCOL.icon} size={18} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "900", color: "#DC2626" }}>{PARDS_PROTOCOL.title}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <View style={{ backgroundColor: "#DC262620", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: "800", color: "#DC2626" }}>{PARDS_PROTOCOL.guideline}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Definition */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "800", color: tm, letterSpacing: 0.5, marginBottom: 8 }}>DIAGNOSTIC CRITERIA</Text>
              {PARDS_PROTOCOL.definition.map((d, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#DC262615",
                    alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Text style={{ fontSize: 10, fontWeight: "800", color: "#DC2626" }}>{i + 1}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: tp, flex: 1, lineHeight: 18 }}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Severity */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "800", color: tm, letterSpacing: 0.5, marginBottom: 8 }}>SEVERITY CLASSIFICATION</Text>
              <View style={{ gap: 6 }}>
                {PARDS_PROTOCOL.severity.map((s_) => (
                  <View key={s_.level} style={{ flexDirection: "row", alignItems: "center", gap: 10,
                    padding: 10, borderRadius: 8,
                    backgroundColor: s_.color + "12", borderWidth: 1, borderColor: s_.color + "30" }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s_.color }} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: s_.color, width: 70 }}>{s_.level}</Text>
                    <Text style={{ fontSize: 12, color: tp, flex: 1 }}>{s_.criteria}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Strategy sections */}
            <Text style={{ fontSize: 12, fontWeight: "800", color: tm, letterSpacing: 0.5, marginBottom: 8 }}>MANAGEMENT STRATEGY</Text>
            <View style={{ gap: 8 }}>
              {PARDS_PROTOCOL.strategy.map((section) => (
                <ProtocolSection key={section.title} title={section.title} items={section.items} color="#DC2626" />
              ))}
            </View>
          </View>
        </View>

        {/* ── Asthma ── */}
        <View style={[s.card, { backgroundColor: card, borderColor: "#7C3AED40", borderWidth: 1.5 }]}>
          <View style={[s.stripe, { backgroundColor: "#7C3AED" }]} />
          <View style={{ paddingLeft: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <View style={[s.iconBadge, { backgroundColor: "#7C3AED15" }]}>
                <Feather name={ASTHMA_PROTOCOL.icon} size={18} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "900", color: "#7C3AED" }}>{ASTHMA_PROTOCOL.title}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <View style={{ backgroundColor: "#7C3AED20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: "800", color: "#7C3AED" }}>{ASTHMA_PROTOCOL.guideline}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={{ fontSize: 12, fontWeight: "800", color: tm, letterSpacing: 0.5, marginBottom: 8 }}>STRATEGY & PROTOCOLS</Text>
            <View style={{ gap: 8 }}>
              {ASTHMA_PROTOCOL.strategy.map((section) => (
                <ProtocolSection key={section.title} title={section.title} items={section.items} color="#7C3AED" />
              ))}
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={[s.disclaimer, { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }]}>
          <Feather name="shield" size={14} color={tm} style={{ marginTop: 1 }} />
          <Text style={{ fontSize: 11, color: tm, flex: 1, lineHeight: 16, fontStyle: "italic" }}>
            Calculations based on PALICC 2023, Harriet Lane 22e/23e. Hamilton C3 is a registered trademark of Hamilton Medical. For educational use only. Verify with physician orders.
          </Text>
        </View>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ROOT RENDER
  // ─────────────────────────────────────────────────────────────────────────
  const TABS: { key: VentTab; label: string; icon: string; color: string }[] = [
    { key: "calculator", label: "Calculator",  icon: "sliders",   color: "#0891B2" },
    { key: "modes",      label: "C3 Modes",    icon: "cpu",       color: "#7C3AED" },
    { key: "protocols",  label: "Protocols",   icon: "file-text", color: "#DC2626" },
  ];

  return (
    <View style={{ gap: 0 }}>
      {/* Tab bar */}
      <View style={[s.tabBar, { backgroundColor: card, borderColor: border }]}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[s.tabBtn, {
                borderBottomWidth: active ? 2.5 : 0,
                borderBottomColor: tab.color,
                backgroundColor: active ? tab.color + "10" : "transparent",
              }]}
              activeOpacity={0.75}
            >
              <Feather name={tab.icon as any} size={14} color={active ? tab.color : tm} />
              <Text style={{ fontSize: 12, fontWeight: active ? "800" : "500", color: active ? tab.color : tm }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <View style={{ padding: 0, paddingTop: 14 }}>
        {activeTab === "calculator" && renderCalculator()}
        {activeTab === "modes"      && renderModes()}
        {activeTab === "protocols"  && renderProtocols()}
      </View>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 2,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    }),
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 5,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
      web: { boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  pathBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  pathDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    width: 80,
  },
  vtBox: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
  },
  pressureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
});
