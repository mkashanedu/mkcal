// Infusion Calculator Drug Data — PICU Standard Infusions
// Doses based on Harriet Lane 23e, PALS 2025, SSC Pediatric 2024

export type InfusionUnit =
  | "mcg/kg/min"
  | "mcg/kg/hr"
  | "mg/kg/hr"
  | "units/kg/hr"
  | "mcg/min"
  | "mg/hr"
  | "mL/kg/hr";

export interface StandardConcentration {
  label: string;
  totalDrug_mg: number; // in mg (or units for vasopressin)
  totalVolume_mL: number;
  concentration_per_mL: number; // mg/mL (or units/mL)
  unit: "mg" | "units" | "mcg";
}

export interface InfusionDrug {
  id: string;
  name: string;
  category: string;
  primaryUnit: InfusionUnit;
  alternateUnits?: InfusionUnit[];
  minDose: number;
  maxDose: number;
  typicalDose?: number;
  doseStep?: number;
  color: string;
  indication: string;
  standardConcentrations: StandardConcentration[];
  notes?: string;
  warnings?: string[];
  reference?: string;
}

export const INFUSION_DRUGS: InfusionDrug[] = [
  // ── VASOPRESSORS / INOTROPES ─────────────────────────────────
  {
    id: "dopamine",
    name: "Dopamine",
    category: "Inotrope / Vasopressor",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr", "mg/hr"],
    minDose: 1,
    maxDose: 20,
    typicalDose: 5,
    doseStep: 0.5,
    color: "#B5171A",
    indication: "Cardiogenic/septic shock, symptomatic bradycardia",
    standardConcentrations: [
      { label: "3 mg/kg in 50 mL (Rule of 6)", totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mg", },
      { label: "6 mg/kg in 100 mL", totalDrug_mg: -1, totalVolume_mL: 100, concentration_per_mL: -1, unit: "mg" },
      { label: "400 mg/250 mL (1.6 mg/mL) — standard adult", totalDrug_mg: 400, totalVolume_mL: 250, concentration_per_mL: 1.6, unit: "mg" },
    ],
    notes: "PALS 2025: 3 × weight (kg) mg in 50 mL NS/D5W → 1 mL/hr = 1 mcg/kg/min",
    warnings: ["Central line preferred > 10 mcg/kg/min", "PALS 2025: Norepinephrine preferred for septic shock"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "dobutamine",
    name: "Dobutamine",
    category: "Inotrope",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr", "mg/hr"],
    minDose: 2,
    maxDose: 20,
    typicalDose: 5,
    doseStep: 0.5,
    color: "#C0392B",
    indication: "Cardiogenic shock, low cardiac output",
    standardConcentrations: [
      { label: "3 mg/kg in 50 mL (Rule of 6)", totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mg" },
      { label: "250 mg/250 mL (1 mg/mL)", totalDrug_mg: 250, totalVolume_mL: 250, concentration_per_mL: 1, unit: "mg" },
    ],
    notes: "Rule of 6: 3 × wt (kg) mg in 50 mL → 1 mL/hr = 1 mcg/kg/min",
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "norepinephrine",
    name: "Norepinephrine",
    category: "Vasopressor",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/min", "mg/hr"],
    minDose: 0.01,
    maxDose: 2,
    typicalDose: 0.1,
    doseStep: 0.01,
    color: "#8B0000",
    indication: "Septic/distributive shock (1st line), vasodilation",
    standardConcentrations: [
      { label: "0.1 mg/kg in 50 mL (Rule of 6)", totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mg" },
      { label: "4 mg/250 mL (16 mcg/mL) — standard", totalDrug_mg: 4, totalVolume_mL: 250, concentration_per_mL: 0.016, unit: "mg" },
      { label: "8 mg/250 mL (32 mcg/mL) — concentrated", totalDrug_mg: 8, totalVolume_mL: 250, concentration_per_mL: 0.032, unit: "mg" },
    ],
    warnings: ["Central line MANDATORY"],
    reference: "PALS 2025 | SSC Pediatric 2024",
  },
  {
    id: "epinephrine-infusion",
    name: "Epinephrine",
    category: "Inotrope / Vasopressor",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/min", "mg/hr"],
    minDose: 0.01,
    maxDose: 1.0,
    typicalDose: 0.1,
    doseStep: 0.01,
    color: "#AE2012",
    indication: "Refractory shock, cardiac arrest post-ROSC, anaphylaxis",
    standardConcentrations: [
      { label: "0.03 mg/kg in 50 mL (Rule of 6)", totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mg" },
      { label: "1 mg/250 mL (4 mcg/mL) — dilute", totalDrug_mg: 1, totalVolume_mL: 250, concentration_per_mL: 0.004, unit: "mg" },
      { label: "2 mg/50 mL (40 mcg/mL) — concentrated", totalDrug_mg: 2, totalVolume_mL: 50, concentration_per_mL: 0.04, unit: "mg" },
    ],
    warnings: ["Central line preferred"],
    reference: "PALS 2025",
  },
  {
    id: "milrinone",
    name: "Milrinone",
    category: "Inodilator",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 0.1,
    maxDose: 0.75,
    typicalDose: 0.375,
    doseStep: 0.025,
    color: "#6B2D8E",
    indication: "Low CO after cardiac surgery, cardiomyopathy, high SVR",
    standardConcentrations: [
      { label: "0.3 mg/kg in 50 mL", totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mg" },
      { label: "20 mg/100 mL (200 mcg/mL) — standard", totalDrug_mg: 20, totalVolume_mL: 100, concentration_per_mL: 0.2, unit: "mg" },
    ],
    notes: "Loading dose: 50 mcg/kg IV over 30–60 min (optional; omit if hypotensive)",
    reference: "Harriet Lane 23e",
  },
  {
    id: "vasopressin",
    name: "Vasopressin",
    category: "Vasopressor",
    primaryUnit: "units/kg/hr",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 0.0003,
    maxDose: 0.002,
    typicalDose: 0.0005,
    doseStep: 0.0001,
    color: "#5D3A8E",
    indication: "Catecholamine-resistant septic shock, post-cardiac surgery",
    standardConcentrations: [
      { label: "0.1 units/mL (20 units/200 mL)", totalDrug_mg: 20, totalVolume_mL: 200, concentration_per_mL: 0.1, unit: "units" },
      { label: "0.5 units/mL (20 units/40 mL) — concentrated", totalDrug_mg: 20, totalVolume_mL: 40, concentration_per_mL: 0.5, unit: "units" },
    ],
    reference: "SSC Pediatric 2024",
  },

  // ── SEDATION / ANALGESIA ─────────────────────────────────────
  {
    id: "fentanyl-infusion",
    name: "Fentanyl",
    category: "Opioid Analgesic",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mcg/hr"],
    minDose: 0.5,
    maxDose: 10,
    typicalDose: 2,
    doseStep: 0.25,
    color: "#6B2FA0",
    indication: "ICU analgesia, ventilated patients, procedural analgesia",
    standardConcentrations: [
      { label: "10 mcg/kg in 50 mL (0.2 mcg/kg/mL) → 10 mL/hr = 2 mcg/kg/hr", totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mcg" },
      { label: "50 mcg/mL (500 mcg in 10 mL + 90 mL NS = 100 mL)", totalDrug_mg: 0.5, totalVolume_mL: 100, concentration_per_mL: 0.005, unit: "mg" },
    ],
    notes: "Doses in mcg/kg/hr; multiply by weight for mcg/hr; then divide by concentration for mL/hr",
    reference: "Harriet Lane 23e | SCCM PADIS 2024",
  },
  {
    id: "morphine-infusion",
    name: "Morphine",
    category: "Opioid Analgesic",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mg/hr"],
    minDose: 5,
    maxDose: 40,
    typicalDose: 15,
    doseStep: 2.5,
    color: "#4A235A",
    indication: "ICU analgesia, post-operative pain, dyspnea",
    standardConcentrations: [
      { label: "1 mg/mL standard (1 mg/mL)", totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg" },
      { label: "2 mg/mL concentrated (100 mg/50 mL)", totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg" },
    ],
    warnings: ["Avoid in renal failure — use fentanyl instead", "Accumulation of M6G metabolite"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "midazolam-infusion",
    name: "Midazolam",
    category: "Sedative",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mg/hr"],
    minDose: 30,
    maxDose: 300,
    typicalDose: 100,
    doseStep: 10,
    color: "#1A4F7A",
    indication: "ICU sedation, status epilepticus refractory",
    standardConcentrations: [
      { label: "0.5 mg/mL (25 mg in 50 mL)", totalDrug_mg: 25, totalVolume_mL: 50, concentration_per_mL: 0.5, unit: "mg" },
      { label: "1 mg/mL (50 mg in 50 mL)", totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg" },
    ],
    notes: "1 mg = 1000 mcg; typical range 50–200 mcg/kg/hr",
    reference: "Harriet Lane 23e | SCCM PADIS 2024",
  },
  {
    id: "dexmedetomidine-infusion",
    name: "Dexmedetomidine",
    category: "Sedative (α2 agonist)",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mcg/hr"],
    minDose: 0.1,
    maxDose: 1.5,
    typicalDose: 0.5,
    doseStep: 0.05,
    color: "#0A4F7A",
    indication: "ICU sedation (cooperative), procedural sedation, opioid weaning",
    standardConcentrations: [
      { label: "4 mcg/mL (200 mcg in 50 mL NS)", totalDrug_mg: 0.2, totalVolume_mL: 50, concentration_per_mL: 0.004, unit: "mg" },
      { label: "8 mcg/mL (400 mcg in 50 mL NS)", totalDrug_mg: 0.4, totalVolume_mL: 50, concentration_per_mL: 0.008, unit: "mg" },
    ],
    warnings: ["Bradycardia and hypotension with loading dose"],
    reference: "Harriet Lane 23e | SCCM PADIS 2024",
  },
  {
    id: "propofol-infusion",
    name: "Propofol",
    category: "Sedative",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.5,
    maxDose: 4,
    typicalDose: 2,
    doseStep: 0.25,
    color: "#34495E",
    indication: "ICU sedation (> 3 yr), anesthesia maintenance, status epilepticus",
    standardConcentrations: [
      { label: "10 mg/mL — undiluted (standard)", totalDrug_mg: 200, totalVolume_mL: 20, concentration_per_mL: 10, unit: "mg" },
    ],
    warnings: ["PRIS risk at > 4 mg/kg/hr or > 48 hr", "Avoid in < 1 month"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "ketamine-infusion",
    name: "Ketamine",
    category: "Analgosedation",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.1,
    maxDose: 3,
    typicalDose: 1,
    doseStep: 0.1,
    color: "#1E6B55",
    indication: "ICU analgosedation, refractory status epilepticus, burns",
    standardConcentrations: [
      { label: "1 mg/mL (50 mg in 50 mL)", totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg" },
      { label: "2 mg/mL (100 mg in 50 mL)", totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg" },
    ],
    notes: "Combine with midazolam or propofol for ICU sedation",
    reference: "Harriet Lane 23e",
  },

  // ── RESPIRATORY ──────────────────────────────────────────────
  {
    id: "salbutamol-infusion",
    name: "Salbutamol IV",
    category: "Bronchodilator",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr", "mcg/hr"],
    minDose: 0.1,
    maxDose: 2.0,
    typicalDose: 0.5,
    doseStep: 0.1,
    color: "#0C7B5C",
    indication: "Life-threatening asthma, ICU bronchospasm",
    standardConcentrations: [
      { label: "200 mcg/mL (10 mg in 50 mL NS)", totalDrug_mg: 10, totalVolume_mL: 50, concentration_per_mL: 0.2, unit: "mg" },
      { label: "100 mcg/mL (5 mg in 50 mL NS)", totalDrug_mg: 5, totalVolume_mL: 50, concentration_per_mL: 0.1, unit: "mg" },
    ],
    warnings: ["Hypokalemia, lactic acidosis, tachycardia at high doses"],
    reference: "BTS 2023 | Harriet Lane 23e",
  },
  {
    id: "aminophylline-infusion",
    name: "Aminophylline",
    category: "Bronchodilator",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.3,
    maxDose: 1.1,
    typicalDose: 0.7,
    doseStep: 0.05,
    color: "#006B54",
    indication: "Severe asthma refractory to salbutamol, apnea of prematurity",
    standardConcentrations: [
      { label: "1 mg/mL (250 mg in 250 mL NS) — standard", totalDrug_mg: 250, totalVolume_mL: 250, concentration_per_mL: 1, unit: "mg" },
      { label: "2 mg/mL (500 mg in 250 mL NS)", totalDrug_mg: 500, totalVolume_mL: 250, concentration_per_mL: 2, unit: "mg" },
    ],
    warnings: ["Narrow therapeutic index; check levels; interactions with macrolides, ciprofloxacin"],
    reference: "BTS 2023",
  },

  // ── CARDIOVASCULAR ───────────────────────────────────────────
  {
    id: "nitroprusside-infusion",
    name: "Sodium Nitroprusside",
    category: "Vasodilator",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/min"],
    minDose: 0.1,
    maxDose: 8,
    typicalDose: 2,
    doseStep: 0.25,
    color: "#1A5276",
    indication: "Hypertensive emergency, afterload reduction post-cardiac surgery",
    standardConcentrations: [
      { label: "200 mcg/mL (50 mg in 250 mL D5W)", totalDrug_mg: 50, totalVolume_mL: 250, concentration_per_mL: 0.2, unit: "mg" },
    ],
    warnings: ["Light-protected tubing MANDATORY", "Cyanide toxicity > 4 mcg/kg/min or > 72 hr"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "labetalol-infusion",
    name: "Labetalol",
    category: "Antihypertensive",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.25,
    maxDose: 3,
    typicalDose: 1,
    doseStep: 0.25,
    color: "#2471A3",
    indication: "Hypertensive emergency, post-operative hypertension",
    standardConcentrations: [
      { label: "2 mg/mL (200 mg in 100 mL)", totalDrug_mg: 200, totalVolume_mL: 100, concentration_per_mL: 2, unit: "mg" },
      { label: "1 mg/mL (100 mg in 100 mL)", totalDrug_mg: 100, totalVolume_mL: 100, concentration_per_mL: 1, unit: "mg" },
    ],
    warnings: ["Avoid in asthma, COPD, severe bradycardia"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "furosemide-infusion",
    name: "Furosemide",
    category: "Diuretic",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.05,
    maxDose: 0.5,
    typicalDose: 0.1,
    doseStep: 0.025,
    color: "#117A8B",
    indication: "Fluid overload, oliguria, refractory edema",
    standardConcentrations: [
      { label: "1 mg/mL (50 mg in 50 mL NS) — standard", totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg" },
      { label: "2 mg/mL (100 mg in 50 mL NS) — concentrated", totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg" },
    ],
    warnings: ["Hypokalemia — replace K+", "Ototoxicity with rapid infusion"],
    reference: "Harriet Lane 23e",
  },

  // ── NMBDs (ICU INFUSIONS) ────────────────────────────────────
  {
    id: "atracurium-infusion",
    name: "Atracurium",
    category: "NMBD (ICU Paralysis)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 3,
    maxDose: 15,
    typicalDose: 7,
    doseStep: 0.5,
    color: "#7B2D8E",
    indication: "ICU mechanical ventilation, ARDS, refractory bronchospasm. Preferred in renal/hepatic failure (Hofmann elimination).",
    standardConcentrations: [
      { label: "0.5 mg/mL — 10 mg in 20 mL NS", totalDrug_mg: 10, totalVolume_mL: 20, concentration_per_mL: 0.5, unit: "mg" },
      { label: "1 mg/mL — 50 mg in 50 mL NS", totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg" },
      { label: "2 mg/mL — 100 mg in 50 mL NS (concentrated)", totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg" },
    ],
    notes: "TOF target: 0/4 twitches. Titrate infusion to TOF response. No reversal — allow spontaneous recovery.",
    warnings: ["Inject bolus slowly — histamine release risk", "Ensure deep sedation (RASS −4/−5) before starting"],
    reference: "Harriet Lane 23e | Miller's Anesthesia",
  },
  {
    id: "cisatracurium-infusion",
    name: "Cisatracurium",
    category: "NMBD (ICU Paralysis)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 0.5,
    maxDose: 5,
    typicalDose: 1.5,
    doseStep: 0.25,
    color: "#6B1E7E",
    indication: "ARDS (ACURASYS protocol 48 hr), ICU paralysis preferred in asthma (no histamine release), multi-organ failure.",
    standardConcentrations: [
      { label: "0.4 mg/mL — 8 mg in 20 mL NS", totalDrug_mg: 8, totalVolume_mL: 20, concentration_per_mL: 0.4, unit: "mg" },
      { label: "0.4 mg/mL — 20 mg in 50 mL NS", totalDrug_mg: 20, totalVolume_mL: 50, concentration_per_mL: 0.4, unit: "mg" },
      { label: "0.8 mg/mL — 40 mg in 50 mL NS (concentrated)", totalDrug_mg: 40, totalVolume_mL: 50, concentration_per_mL: 0.8, unit: "mg" },
    ],
    notes: "ACURASYS: ~0.625 mcg/kg/min × 48 hr in early ARDS. Much less laudanosine than atracurium. Minimal histamine release.",
    warnings: ["RASS −4/−5 mandatory before paralysis", "NOT for RSI — onset too slow (3–5 min)"],
    reference: "ACURASYS Trial | PALICC 2023",
  },
  {
    id: "rocuronium-infusion",
    name: "Rocuronium",
    category: "NMBD (ICU Paralysis)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 3,
    maxDose: 15,
    typicalDose: 7,
    doseStep: 0.5,
    color: "#5D1F85",
    indication: "ICU paralysis for ARDS, ICP management, refractory asthma. Reversible with sugammadex.",
    standardConcentrations: [
      { label: "1 mg/mL — 20 mg in 20 mL NS", totalDrug_mg: 20, totalVolume_mL: 20, concentration_per_mL: 1, unit: "mg" },
      { label: "2 mg/mL — 100 mg in 50 mL NS", totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg" },
    ],
    notes: "Key advantage: reversible with sugammadex 4 mg/kg (routine) or 16 mg/kg (emergency). TOF target 0/4.",
    warnings: ["Have sugammadex at bedside", "Ensure deep sedation before paralysis"],
    reference: "Harriet Lane 23e | Miller's Anesthesia",
  },

  // ── ANTICOAGULATION ──────────────────────────────────────────
  {
    id: "heparin",
    name: "Heparin (Unfractionated)",
    category: "Anticoagulant",
    primaryUnit: "units/kg/hr",
    alternateUnits: ["units/hr"],
    minDose: 10,
    maxDose: 40,
    typicalDose: 20,
    doseStep: 2,
    color: "#5D6D7E",
    indication: "DVT/PE treatment, ECMO anticoagulation, line patency",
    standardConcentrations: [
      { label: "100 units/mL (5000 units in 50 mL)", totalDrug_mg: 5000, totalVolume_mL: 50, concentration_per_mL: 100, unit: "units" },
      { label: "50 units/mL (2500 units in 50 mL)", totalDrug_mg: 2500, totalVolume_mL: 50, concentration_per_mL: 50, unit: "units" },
    ],
    notes: "Loading: 75–100 units/kg IV bolus; then start infusion; adjust by APTT",
    warnings: ["APTT target 60–85 sec (prophylaxis) or 1.5–2.5× ULN (treatment)", "Heparin-induced thrombocytopenia (HIT) — check platelets every 2–3 days"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "insulin",
    name: "Insulin (Regular)",
    category: "Hormone",
    primaryUnit: "units/kg/hr",
    alternateUnits: ["units/hr"],
    minDose: 0.01,
    maxDose: 0.2,
    typicalDose: 0.05,
    doseStep: 0.01,
    color: "#1E8449",
    indication: "Hyperglycemia, DKA (after initial fluid resuscitation), hyperkalemia",
    standardConcentrations: [
      { label: "0.5 units/mL (25 units in 50 mL NS)", totalDrug_mg: 25, totalVolume_mL: 50, concentration_per_mL: 0.5, unit: "units" },
      { label: "1 unit/mL (50 units in 50 mL NS) — concentrated", totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "units" },
    ],
    notes: "DKA protocol: 0.05–0.1 units/kg/hr; adjust per glucose; maintain glucose 8–12 mmol/L",
    warnings: ["Hypoglycemia — check glucose hourly", "DKA: do NOT start until K+ > 3.5 mEq/L"],
    reference: "ISPAD 2022 | Harriet Lane 23e",
  },
];

// ─── CALCULATION ENGINE ────────────────────────────────────────────────────────

/**
 * Calculates infusion rate (mL/hr) given:
 *  - desiredDose: the dose the user wants
 *  - doseUnit: unit of desired dose
 *  - weight_kg: patient weight
 *  - concentration_mg_per_mL: drug concentration in mg/mL (or units/mL for vasopressin/heparin/insulin)
 */
export function calculateInfusionRate(
  desiredDose: number,
  doseUnit: InfusionUnit,
  weight_kg: number,
  concentration_per_mL: number // mg/mL or units/mL
): number {
  if (!concentration_per_mL || concentration_per_mL <= 0) return 0;

  let dose_per_mL_per_hr = 0;

  switch (doseUnit) {
    case "mcg/kg/min":
      // convert to mg/hr: dose_mcg/kg/min × weight × 60 / 1000
      dose_per_mL_per_hr = (desiredDose * weight_kg * 60) / (1000 * concentration_per_mL);
      break;
    case "mcg/kg/hr":
      // dose_mcg/kg/hr × weight / 1000 / conc_mg_per_mL
      dose_per_mL_per_hr = (desiredDose * weight_kg) / (1000 * concentration_per_mL);
      break;
    case "mg/kg/hr":
      // dose_mg/kg/hr × weight / conc_mg_per_mL
      dose_per_mL_per_hr = (desiredDose * weight_kg) / concentration_per_mL;
      break;
    case "units/kg/hr":
      // dose_units/kg/hr × weight / conc_units_per_mL
      dose_per_mL_per_hr = (desiredDose * weight_kg) / concentration_per_mL;
      break;
    case "mcg/min":
      // dose_mcg/min × 60 / 1000 / conc_mg_per_mL
      dose_per_mL_per_hr = (desiredDose * 60) / (1000 * concentration_per_mL);
      break;
    case "mg/hr":
      // dose_mg/hr / conc_mg_per_mL
      dose_per_mL_per_hr = desiredDose / concentration_per_mL;
      break;
    case "units/hr":
      dose_per_mL_per_hr = desiredDose / concentration_per_mL;
      break;
    case "mL/kg/hr":
      dose_per_mL_per_hr = desiredDose * weight_kg;
      break;
    default:
      dose_per_mL_per_hr = 0;
  }

  return dose_per_mL_per_hr;
}

/**
 * Calculates the concentration of a weight-based preparation
 * (Rule of 6 style: X mg/kg in Y mL)
 */
export function ruleOf6Concentration(
  multiplier: number, // e.g. 3 for "3×wt mg/50mL" dopamine
  weight_kg: number,
  volume_mL: number
): number {
  return (multiplier * weight_kg) / volume_mL; // mg/mL
}

/**
 * Format mL/hr to display string
 */
export function formatRate(rate: number): string {
  if (rate <= 0 || !isFinite(rate)) return "—";
  if (rate < 1) return rate.toFixed(3) + " mL/hr";
  if (rate < 10) return rate.toFixed(2) + " mL/hr";
  return rate.toFixed(1) + " mL/hr";
}

/**
 * Convert dose between units
 */
export function convertDoseUnit(
  dose: number,
  from: InfusionUnit,
  to: InfusionUnit,
  weight_kg: number
): number {
  // Convert to base: mg/hr first
  let mgPerHr = 0;

  switch (from) {
    case "mcg/kg/min": mgPerHr = (dose * weight_kg * 60) / 1000; break;
    case "mcg/kg/hr": mgPerHr = (dose * weight_kg) / 1000; break;
    case "mg/kg/hr": mgPerHr = dose * weight_kg; break;
    case "mg/hr": mgPerHr = dose; break;
    case "mcg/min": mgPerHr = (dose * 60) / 1000; break;
    case "units/kg/hr": mgPerHr = dose * weight_kg; break;
    default: return dose;
  }

  switch (to) {
    case "mcg/kg/min": return (mgPerHr * 1000) / (weight_kg * 60);
    case "mcg/kg/hr": return (mgPerHr * 1000) / weight_kg;
    case "mg/kg/hr": return mgPerHr / weight_kg;
    case "mg/hr": return mgPerHr;
    case "mcg/min": return (mgPerHr * 1000) / 60;
    default: return dose;
  }
}
