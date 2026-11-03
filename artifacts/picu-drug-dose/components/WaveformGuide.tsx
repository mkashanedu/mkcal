/**
 * WaveformGuide.tsx
 * Ventilator waveform (scalar) teaching diagrams — schematic shapes, not patient data.
 * Five classic patterns: pressure-time, flow-time and volume-time stacked scalars.
 * Standard ventilator-graphics teaching (pressure/flow/volume scalars).
 */
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Line, Path, Svg, Text as SvgText } from "react-native-svg";

// ─── CHART GEOMETRY ───────────────────────────────────────────────────────────
const X0 = 36;            // plot left (after axis labels)
const X1 = 314;           // plot right
const CYCLES = 3;         // breath cycles drawn
const P_TOP = 8;          // pressure plot top
const F_TOP = 76;         // flow plot top
const V_TOP = 144;        // volume plot top
const PLOT_H = 52;        // each plot height
const F_ZERO = F_TOP + PLOT_H / 2; // flow zero line
const SVG_H = V_TOP + PLOT_H + 10;

const COL_P = "#38BDF8";
const COL_F = "#34D399";
const COL_V = "#FBBF24";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mx = (t: number) => X0 + (t / CYCLES) * (X1 - X0);
const myP = (p: number) => P_TOP + (1 - clamp(p, 0, 1)) * PLOT_H;
const myF = (f: number) => F_ZERO - clamp(f, -1, 1) * (PLOT_H / 2 - 3);
const myV = (v: number) => V_TOP + (1 - clamp(v / 1.05, 0, 1)) * PLOT_H;

function pathFrom(pts: [number, number][]): string {
  return pts
    .map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`)
    .join(" ");
}

type ShapeFn = (t: number) => { p: number; f: number; v: number };

function samplePaths(shape: ShapeFn): { dP: string; dF: string; dV: string } {
  const pPts: [number, number][] = [];
  const fPts: [number, number][] = [];
  const vPts: [number, number][] = [];
  const N = 210;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2.999;
    const s = shape(t);
    pPts.push([mx(t), myP(s.p)]);
    fPts.push([mx(t), myF(s.f)]);
    vPts.push([mx(t), myV(s.v)]);
  }
  return { dP: pathFrom(pPts), dF: pathFrom(fPts), dV: pathFrom(vPts) };
}

// ─── BREATH SHAPES (normalised: p 0–1, f −1–1, v 0–1) ────────────────────────
function normalShape(t: number): { p: number; f: number; v: number } {
  const u = t % 1;
  const TI = 0.32, BASE = 0.16, PEAK = 0.78;
  if (u < TI) {
    const s = u / TI;
    return {
      p: BASE + (PEAK - BASE) * (1 - Math.pow(1 - s, 2)),
      f: 0.85 * Math.min(1, u / 0.035, (TI - u) / 0.035 + 0.15),
      v: Math.pow(s, 0.9),
    };
  }
  const e = u - TI;
  let f = -0.8 * Math.exp(-e * 5.5);
  if (Math.abs(f) < 0.04) f = 0; // expiratory flow settles on zero well before next breath
  let v = Math.exp(-e * 4.5);
  if (v < 0.02) v = 0;
  return { p: BASE + (PEAK - BASE) * Math.exp(-e * 6), f, v };
}

function autoPeepShape(t: number): { p: number; f: number; v: number } {
  const u = t % 1;
  const k = Math.min(Math.floor(t), 2);
  const TI = 0.3;
  const BASE = 0.16 + 0.05 * k, PEAK = 0.82;
  const off = 0.17 * k, offN = 0.17 * (k + 1), VPK = off + 0.52;
  if (u < TI) {
    const s = u / TI;
    return {
      p: BASE + (PEAK - BASE) * (1 - Math.pow(1 - s, 2)),
      f: 0.85 * Math.min(1, u / 0.035, (TI - u) / 0.035 + 0.15),
      v: off + (VPK - off) * Math.pow(s, 0.9),
    };
  }
  const e = u - TI;
  return {
    p: BASE + (PEAK - BASE) * Math.exp(-e * 5),
    f: -0.85 * Math.exp(-e * 2.0), // still ≈ −0.2 when the next breath cuts in — never reaches zero
    v: offN + (VPK - offN) * Math.exp(-e * 3), // exhalation incomplete — baseline steps up
  };
}

function resistanceShape(t: number): { p: number; f: number; v: number } {
  const u = t % 1;
  const TI = 0.38, BASE = 0.15, PEAK = 0.97, PLAT = 0.52;
  if (u < TI) {
    const p = u < 0.07
      ? BASE + (PEAK - BASE) * (u / 0.07) // fast rise to a high PIP
      : PLAT + (PEAK - PLAT) * Math.exp(-(u - 0.07) * 6); // then falls to a normal plateau — wide gap
    return {
      p,
      f: 0.95 * Math.exp(-u * 4.5), // decelerating inspiratory flow
      v: 0.8 * (1 - Math.exp(-u * 4)) / (1 - Math.exp(-TI * 4)),
    };
  }
  const e = u - TI;
  return {
    p: BASE + (PLAT - BASE) * Math.exp(-e * 4),
    f: -0.4 * Math.exp(-e * 2.0), // slow, prolonged expiratory decay
    v: 0.8 * Math.exp(-e * 3.0),
  };
}

function complianceShape(t: number): { p: number; f: number; v: number } {
  const u = t % 1;
  const TI = 0.3, BASE = 0.16, PEAK = 0.95, PLAT = 0.9;
  if (u < TI) {
    const p = u < 0.06
      ? BASE + (PEAK - BASE) * (u / 0.06) // steep rise — stiff lungs
      : PEAK - (u - 0.06) * 0.2; // plateau stays ≈ peak — PIP ≈ Pplat
    return {
      p,
      f: 0.8 * Math.min(1, u / 0.03, (TI - u) / 0.03 + 0.15),
      v: 0.55 * (u / TI), // small delivered volume despite high pressure
    };
  }
  const e = u - TI;
  let f = -0.85 * Math.exp(-e * 8); // short time constant — flow back to zero quickly
  if (Math.abs(f) < 0.04) f = 0;
  return { p: BASE + (PLAT - BASE) * Math.exp(-e * 7), f, v: 0.55 * Math.exp(-e * 6) };
}

function dyssynchronyShape(t: number): { p: number; f: number; v: number } {
  const base = normalShape(t);
  // Patient efforts mid-exhalation that fail to trigger a breath
  const efforts = [0.64, 1.6, 2.68];
  let g = 0;
  for (const c of efforts) g += Math.exp(-Math.pow((t - c) / 0.05, 2));
  g = Math.min(g, 1);
  return {
    p: base.p - 0.09 * g, // small dip on the pressure baseline
    f: base.f + 0.38 * g, // effort bump pulls flow upward — but no breath follows
    v: base.v + 0.07 * g,
  };
}

// ─── PATTERN DATA ─────────────────────────────────────────────────────────────
interface Callout {
  text: string;
  tx: number; ty: number;
  anchor: "start" | "middle" | "end";
  lx1: number; ly1: number; lx2: number; ly2: number;
}
interface Pattern {
  id: string;
  title: string;
  accent: string;
  shape: ShapeFn;
  callout: Callout;
  bullets: string[];
  checks?: string;
}

const PATTERNS: Pattern[] = [
  {
    id: "normal",
    title: "1 · Normal Breath",
    accent: "#34D399",
    shape: normalShape,
    callout: {
      text: "Flow returns to zero",
      tx: 312, ty: 71, anchor: "end",
      lx1: 296, ly1: 73, lx2: 294, ly2: 99,
    },
    bullets: [
      "Pressure rises smoothly to a peak, then falls back to the PEEP level.",
      "Inspiratory flow is steady; expiratory flow decays and returns to ZERO before the next breath.",
      "Volume rises with the breath and returns fully to baseline.",
    ],
  },
  {
    id: "autopeep",
    title: "2 · Auto-PEEP / Air Trapping",
    accent: "#EF4444",
    shape: autoPeepShape,
    callout: {
      text: "Flow does NOT return to zero",
      tx: 200, ty: 71, anchor: "middle",
      lx1: 214, ly1: 73, lx2: 217, ly2: 103,
    },
    bullets: [
      "Key sign: expiratory flow has NOT reached zero when the next breath starts.",
      "Trapped gas stacks up — the volume baseline steps up breath by breath.",
      "Risk: rising airway pressures and falling blood pressure from dynamic hyperinflation.",
    ],
    checks: "First checks: lengthen expiratory time (lower RR, shorter Ti), treat bronchospasm, clear secretions.",
  },
  {
    id: "resistance",
    title: "3 · High Airway Resistance",
    accent: "#F59E0B",
    shape: resistanceShape,
    callout: {
      text: "Wide PIP–Pplat gap",
      tx: 205, ty: 71, anchor: "middle",
      lx1: 180, ly1: 73, lx2: 160, ly2: 36,
    },
    bullets: [
      "PIP is high but the plateau pressure stays normal — a wide PIP–Pplat gap.",
      "Expiratory flow decays slowly and is prolonged — air struggles to get out.",
      "Causes: bronchospasm, secretions, kinked or bitten ETT, narrow tube.",
    ],
    checks: "First checks: suction the ETT, check for kinking or biting, treat bronchospasm.",
  },
  {
    id: "compliance",
    title: "4 · Low Compliance (Stiff Lungs)",
    accent: "#A78BFA",
    shape: complianceShape,
    callout: {
      text: "PIP ≈ Pplat — both high",
      tx: 180, ty: 71, anchor: "middle",
      lx1: 160, ly1: 73, lx2: 147, ly2: 15,
    },
    bullets: [
      "PIP and plateau pressure are both high and CLOSE together (small PIP–Pplat gap).",
      "Pressure rises steeply for only a small delivered volume — stiff lungs.",
      "Causes: ARDS, pulmonary oedema, pneumothorax, abdominal distension.",
    ],
    checks: "First checks: confirm tube position and chest rise, review the ARDS/oedema course, check Vt per kg (IBW).",
  },
  {
    id: "dyssynchrony",
    title: "5 · Ineffective Efforts (Dyssynchrony)",
    accent: "#38BDF8",
    shape: dyssynchronyShape,
    callout: {
      text: "Effort bump — no breath triggered",
      tx: 170, ty: 71, anchor: "middle",
      lx1: 120, ly1: 73, lx2: 95, ly2: 93,
    },
    bullets: [
      "Small effort bumps appear on the pressure/flow baseline but do NOT trigger a breath.",
      "The patient is trying to breathe — wasted efforts raise the work of breathing.",
      "Also watch for double triggering: two breaths stacked with almost no exhalation between them.",
    ],
  },
];

// ─── SINGLE SCALAR CHART ──────────────────────────────────────────────────────
function ScalarChart({ pattern, muted, grid }: { pattern: Pattern; muted: string; grid: string }) {
  const { dP, dF, dV } = samplePaths(pattern.shape);
  const c = pattern.callout;
  return (
    <Svg width="100%" height={SVG_H} viewBox={`0 0 320 ${SVG_H}`}>
      {/* plot baselines */}
      <Line x1={X0} y1={P_TOP + PLOT_H} x2={X1} y2={P_TOP + PLOT_H} stroke={grid} strokeWidth={1} />
      <Line x1={X0} y1={V_TOP + PLOT_H} x2={X1} y2={V_TOP + PLOT_H} stroke={grid} strokeWidth={1} />
      {/* flow zero line */}
      <Line x1={X0} y1={F_ZERO} x2={X1} y2={F_ZERO} stroke={muted} strokeWidth={1} strokeDasharray="4 3" />
      {/* axis labels */}
      <SvgText x={8} y={P_TOP + 29} fontSize={10} fontWeight="700" fill={muted}>P</SvgText>
      <SvgText x={2} y={F_ZERO + 3} fontSize={9} fontWeight="700" fill={muted}>Flow</SvgText>
      <SvgText x={4} y={V_TOP + 29} fontSize={9} fontWeight="700" fill={muted}>Vol</SvgText>
      {/* curves */}
      <Path d={dP} stroke={COL_P} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <Path d={dF} stroke={COL_F} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <Path d={dV} stroke={COL_V} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {/* callout */}
      <Line x1={c.lx1} y1={c.ly1} x2={c.lx2} y2={c.ly2} stroke={pattern.accent} strokeWidth={1.2} />
      <SvgText x={c.tx} y={c.ty} fontSize={9.5} fontWeight="700" fill={pattern.accent} textAnchor={c.anchor}>
        {c.text}
      </SvgText>
    </Svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function WaveformGuide({ isDark }: { isDark: boolean }) {
  const card = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#233554" : "#E2E8F0";
  const tp = isDark ? "#CCD6F6" : "#0D1B2A";
  const tm = isDark ? "#8892B0" : "#8A9BB0";
  const body = isDark ? "#8892B0" : "#475569";
  const panel = isDark ? "#0A192F" : "#F8FAFC";
  const grid = isDark ? "#233554" : "#E2E8F0";

  const legend: { label: string; color: string }[] = [
    { label: "Pressure", color: COL_P },
    { label: "Flow", color: COL_F },
    { label: "Volume", color: COL_V },
  ];

  return (
    <View style={{ gap: 14 }}>
      {/* Header */}
      <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
        <View style={s.cardHeader}>
          <View style={[s.iconBadge, { backgroundColor: "#38BDF81A" }]}>
            <Feather name="activity" size={16} color="#38BDF8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.cardTitle, { color: tp }]}>Ventilator Waveforms — Scalars</Text>
            <Text style={{ fontSize: 11, color: tm, marginTop: 2 }}>
              Pressure · Flow · Volume against time — the three traces to read together.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 14, marginTop: 10 }}>
          {legend.map((l) => (
            <View key={l.label} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: l.color }} />
              <Text style={{ fontSize: 11, color: body, fontWeight: "600" }}>{l.label}</Text>
            </View>
          ))}
        </View>
        <View style={[s.noteBanner, { backgroundColor: "#F59E0B10", borderColor: "#F59E0B30" }]}>
          <Feather name="info" size={13} color="#F59E0B" />
          <Text style={{ fontSize: 11, color: body, flex: 1, lineHeight: 16 }}>
            Diagrams are schematic teaching shapes, not patient data.
          </Text>
        </View>
      </View>

      {/* Pattern cards */}
      {PATTERNS.map((pattern) => (
        <View key={pattern.id} style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: pattern.accent }} />
            <Text style={{ fontSize: 13, fontWeight: "800", color: tp, flex: 1 }}>{pattern.title}</Text>
          </View>

          <View style={{ backgroundColor: panel, borderRadius: 10, paddingVertical: 4 }}>
            <ScalarChart pattern={pattern} muted={tm} grid={grid} />
          </View>

          <View style={{ gap: 5, marginTop: 10 }}>
            {pattern.bullets.map((b, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                <Text style={{ fontSize: 14, color: pattern.accent, marginTop: -2 }}>•</Text>
                <Text style={{ fontSize: 12, color: tp, flex: 1, lineHeight: 18 }}>{b}</Text>
              </View>
            ))}
          </View>

          {pattern.checks ? (
            <View style={[s.noteBanner, { backgroundColor: pattern.accent + "10", borderColor: pattern.accent + "35" }]}>
              <Feather name="check-circle" size={13} color={pattern.accent} />
              <Text style={{ fontSize: 11.5, color: tp, flex: 1, lineHeight: 16 }}>{pattern.checks}</Text>
            </View>
          ) : null}
        </View>
      ))}

      {/* Footer */}
      <Text style={{ fontSize: 11, color: tm, fontStyle: "italic", textAlign: "center", lineHeight: 16 }}>
        Standard ventilator-graphics teaching (pressure/flow/volume scalars)
      </Text>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noteBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
  },
});
