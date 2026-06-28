// Infusion Calculator Drug Data — PICU Standard Infusions
// Doses: Harriet Lane Handbook 23e | PALS 2025 | SSC Pediatric 2024

export type InfusionUnit =
  | "mcg/kg/min"
  | "mcg/kg/hr"
  | "mg/kg/hr"
  | "units/kg/hr"
  | "mcg/min"
  | "mcg/hr"
  | "mg/hr"
  | "mmol/hr"
  | "mL/kg/hr"
  | "units/hr";

export interface StandardConcentration {
  label: string;
  totalDrug_mg: number;   // -1 = weight-based; otherwise mg (or units for unit drugs)
  totalVolume_mL: number;
  concentration_per_mL: number; // mg/mL (or units/mL for units drugs); -1 if weight-based
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
  /** Stock vial concentration (mg/mL or units/mL for unit-based drugs) */
  vialConc_per_mL: number;
  /** Human-readable vial label, e.g. "1 mg/mL ampoule" */
  vialLabel: string;
  /** Preferred diluent */
  diluent: string;
  notes?: string;
  warnings?: string[];
  reference?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DRUG LIST
// ─────────────────────────────────────────────────────────────────────────────
export const INFUSION_DRUGS: InfusionDrug[] = [

  // ══════════════════════════════════════════════════════════════
  //  INOTROPES & VASOPRESSORS
  // ══════════════════════════════════════════════════════════════
  {
    id: "dopamine",
    name: "Dopamine",
    category: "Inotrope / Vasopressor",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 2,
    maxDose: 20,
    typicalDose: 5,
    doseStep: 0.5,
    color: "#7C3AED",
    indication: "Cardiogenic/septic shock, symptomatic bradycardia",
    vialConc_per_mL: 40,
    vialLabel: "200 mg/5 mL vial (40 mg/mL)",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "4000 mcg/mL — 50 mL Syringe (5 mL drug + 45 mL diluent)",
        totalDrug_mg: 200, totalVolume_mL: 50, concentration_per_mL: 4, unit: "mg",
      },
      {
        label: "4000 mcg/mL — 30 mL Syringe (3 mL drug + 27 mL diluent)",
        totalDrug_mg: 120, totalVolume_mL: 30, concentration_per_mL: 4, unit: "mg",
      },
      {
        label: "2000 mcg/mL — 100 mL Chamber (5 mL drug + 95 mL diluent)",
        totalDrug_mg: 200, totalVolume_mL: 100, concentration_per_mL: 2, unit: "mg",
      },
    ],
    notes: "Recipe: 5 mL Dopamine (1 vial, 40 mg/mL) + 45 mL NS/D5W = 50 mL @ 4000 mcg/mL  |  3 mL + 27 mL = 30 mL @ 4000 mcg/mL  |  5 mL + 95 mL = 100 mL @ 2000 mcg/mL",
    warnings: [
      "Central line MANDATORY at > 10 mcg/kg/min",
      "PALS 2025: Norepinephrine preferred for septic shock",
      "Tissue necrosis with extravasation — use phentolamine if extravasated",
    ],
    reference: "PALS 2025 | Harriet Lane 23e",
  },

  {
    id: "dobutamine",
    name: "Dobutamine",
    category: "Inotrope",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 2,
    maxDose: 20,
    typicalDose: 5,
    doseStep: 0.5,
    color: "#7C3AED",
    indication: "Cardiogenic shock, low cardiac output syndrome",
    vialConc_per_mL: 40,
    vialLabel: "200 mg/5 mL vial (40 mg/mL)",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "4000 mcg/mL — 50 mL Syringe (5 mL drug + 45 mL diluent)",
        totalDrug_mg: 200, totalVolume_mL: 50, concentration_per_mL: 4, unit: "mg",
      },
      {
        label: "4000 mcg/mL — 30 mL Syringe (3 mL drug + 27 mL diluent)",
        totalDrug_mg: 120, totalVolume_mL: 30, concentration_per_mL: 4, unit: "mg",
      },
      {
        label: "2000 mcg/mL — 100 mL Chamber (5 mL drug + 95 mL diluent)",
        totalDrug_mg: 200, totalVolume_mL: 100, concentration_per_mL: 2, unit: "mg",
      },
    ],
    notes: "Recipe: 5 mL Dobutamine (1 vial, 40 mg/mL) + 45 mL NS/D5W = 50 mL @ 4000 mcg/mL  |  3 mL + 27 mL = 30 mL @ 4000 mcg/mL  |  5 mL + 95 mL = 100 mL @ 2000 mcg/mL",
    warnings: ["Vasodilatory — may worsen hypotension; add vasopressor if MAP low"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },

  {
    id: "norepinephrine",
    name: "Norepinephrine",
    category: "Vasopressor",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/min"],
    minDose: 0.01,
    maxDose: 1.0,
    typicalDose: 0.1,
    doseStep: 0.01,
    color: "#7C3AED",
    indication: "Septic/distributive shock — 1st line vasopressor (PALS 2025)",
    vialConc_per_mL: 1,
    vialLabel: "1 mg/mL ampoule (4 mg/4 mL)",
    diluent: "D5W or NS",
    standardConcentrations: [
      {
        label: "20 mcg/mL — 1 mg in 50 mL (Peripheral max)",
        totalDrug_mg: 1, totalVolume_mL: 50, concentration_per_mL: 0.02, unit: "mg",
      },
      {
        label: "40 mcg/mL — 2 mg in 50 mL (CVC Standard)",
        totalDrug_mg: 2, totalVolume_mL: 50, concentration_per_mL: 0.04, unit: "mg",
      },
      {
        label: "60 mcg/mL — 3 mg in 50 mL (CVC Concentrated)",
        totalDrug_mg: 3, totalVolume_mL: 50, concentration_per_mL: 0.06, unit: "mg",
      },
    ],
    warnings: [
      "Central line MANDATORY — severe tissue necrosis with peripheral extravasation",
      "Peripheral route: ONLY 20 mcg/mL, monitor site continuously",
    ],
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
    color: "#6366F1",
    indication: "Refractory shock, post-cardiac arrest ROSC, anaphylaxis",
    vialConc_per_mL: 1,
    vialLabel: "1 mg/mL ampoule (Adrenaline)",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "0.03 mg/kg in 50 mL (Rule of 6)",
        totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mg",
      },
      {
        label: "20 mcg/mL — 1 mg in 50 mL (Peripheral)",
        totalDrug_mg: 1, totalVolume_mL: 50, concentration_per_mL: 0.02, unit: "mg",
      },
      {
        label: "40 mcg/mL — 2 mg in 50 mL (CVC Standard)",
        totalDrug_mg: 2, totalVolume_mL: 50, concentration_per_mL: 0.04, unit: "mg",
      },
      {
        label: "60 mcg/mL — 3 mg in 50 mL (CVC Concentrated)",
        totalDrug_mg: 3, totalVolume_mL: 50, concentration_per_mL: 0.06, unit: "mg",
      },
    ],
    warnings: [
      "Central line preferred — peripheral: max 20 mcg/mL only",
      "Monitor for hyperglycemia and hypokalemia at high doses",
    ],
    reference: "PALS 2025",
  },

  {
    id: "milrinone",
    name: "Milrinone",
    category: "Inodilator (Inotrope)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 0.1,
    maxDose: 1.0,
    typicalDose: 0.375,
    doseStep: 0.025,
    color: "#6B2D8E",
    indication: "Low CO post-cardiac surgery, cardiomyopathy with high SVR",
    vialConc_per_mL: 1,
    vialLabel: "1 mg/mL vial (10 mg/10 mL or 20 mg/20 mL)",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "100 mcg/mL — 50 mL Syringe (5 mL drug + 45 mL diluent)",
        totalDrug_mg: 5, totalVolume_mL: 50, concentration_per_mL: 0.1, unit: "mg",
      },
      {
        label: "100 mcg/mL — 30 mL Syringe (3 mL drug + 27 mL diluent)",
        totalDrug_mg: 3, totalVolume_mL: 30, concentration_per_mL: 0.1, unit: "mg",
      },
      {
        label: "200 mcg/mL — 50 mL Syringe (10 mL drug + 40 mL diluent)",
        totalDrug_mg: 10, totalVolume_mL: 50, concentration_per_mL: 0.2, unit: "mg",
      },
      {
        label: "200 mcg/mL — 30 mL Syringe (6 mL drug + 24 mL diluent)",
        totalDrug_mg: 6, totalVolume_mL: 30, concentration_per_mL: 0.2, unit: "mg",
      },
    ],
    notes: "Loading dose (optional): 50 mcg/kg IV over 30–60 min. OMIT if hypotensive.",
    warnings: ["Vasodilatory — withhold loading dose if MAP borderline"],
    reference: "Harriet Lane 23e",
  },

  {
    id: "vasopressin",
    name: "Vasopressin",
    category: "Vasopressor",
    primaryUnit: "units/kg/hr",
    alternateUnits: ["units/hr"],
    minDose: 0.0003,
    maxDose: 0.002,
    typicalDose: 0.0005,
    doseStep: 0.0001,
    color: "#5D3A8E",
    indication: "Catecholamine-resistant septic shock, post-cardiac surgery vasodilation",
    vialConc_per_mL: 20,
    vialLabel: "20 units/mL ampoule (1 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "0.1 units/mL — 20 units in 200 mL",
        totalDrug_mg: 20, totalVolume_mL: 200, concentration_per_mL: 0.1, unit: "units",
      },
      {
        label: "0.5 units/mL — 20 units in 40 mL (concentrated)",
        totalDrug_mg: 20, totalVolume_mL: 40, concentration_per_mL: 0.5, unit: "units",
      },
    ],
    warnings: ["Mesenteric and digital ischemia at high doses", "Antidiuretic effect — monitor serum Na"],
    reference: "SSC Pediatric 2024",
  },

  {
    id: "levosimendan",
    name: "Levosimendan",
    category: "Inodilator (Inotrope)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 0.05,
    maxDose: 0.2,
    typicalDose: 0.1,
    doseStep: 0.025,
    color: "#7B1E8A",
    indication: "Acute decompensated HF refractory to catecholamines, post-cardiac surgery low output",
    vialConc_per_mL: 2.5,
    vialLabel: "2.5 mg/mL vial (5 mL = 12.5 mg)",
    diluent: "D5W",
    standardConcentrations: [
      {
        label: "0.025 mg/mL — 2.5 mg in 100 mL D5W",
        totalDrug_mg: 2.5, totalVolume_mL: 100, concentration_per_mL: 0.025, unit: "mg",
      },
      {
        label: "0.05 mg/mL — 5 mg in 100 mL D5W (concentrated)",
        totalDrug_mg: 5, totalVolume_mL: 100, concentration_per_mL: 0.05, unit: "mg",
      },
    ],
    notes: "Loading dose (optional): 6–12 mcg/kg over 10 min — omit if hypotensive. Effects last 7–9 days.",
    warnings: ["Hypotension — avoid loading in haemodynamically unstable", "QTc prolongation"],
    reference: "ESC Pediatric HF Guidelines 2024",
  },

  // ══════════════════════════════════════════════════════════════
  //  SEDATION & ANALGESIA
  // ══════════════════════════════════════════════════════════════
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
    vialConc_per_mL: 0.05,
    vialLabel: "50 mcg/mL ampoule (0.05 mg/mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "10 mcg/kg in 50 mL (Weight-based)",
        totalDrug_mg: -1, totalVolume_mL: 50, concentration_per_mL: -1, unit: "mcg",
      },
      {
        label: "10 mcg/mL — 500 mcg in 50 mL NS",
        totalDrug_mg: 0.5, totalVolume_mL: 50, concentration_per_mL: 0.01, unit: "mg",
      },
      {
        label: "25 mcg/mL — 1250 mcg in 50 mL NS (concentrated)",
        totalDrug_mg: 1.25, totalVolume_mL: 50, concentration_per_mL: 0.025, unit: "mg",
      },
    ],
    notes: "Weight-based: 10 mcg/kg in 50 mL NS → rate (mL/hr) = dose (mcg/kg/hr) × 5",
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
    indication: "ICU analgesia, post-operative pain, dyspnea, comfort care",
    vialConc_per_mL: 10,
    vialLabel: "10 mg/mL ampoule",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "1 mg/mL — 50 mg in 50 mL NS",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 100 mg in 50 mL NS (concentrated)",
        totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg",
      },
    ],
    warnings: [
      "Avoid in renal failure — M6G metabolite accumulates → use fentanyl instead",
      "Respiratory depression — have naloxone at bedside",
    ],
    reference: "Harriet Lane 23e",
  },

  {
    id: "midazolam-infusion",
    name: "Midazolam",
    category: "Sedative (Benzodiazepine)",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mg/hr"],
    minDose: 30,
    maxDose: 300,
    typicalDose: 100,
    doseStep: 10,
    color: "#1A4F7A",
    indication: "ICU sedation, refractory status epilepticus (SE), procedural sedation",
    vialConc_per_mL: 5,
    vialLabel: "5 mg/mL ampoule",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "0.5 mg/mL — 25 mg in 50 mL NS",
        totalDrug_mg: 25, totalVolume_mL: 50, concentration_per_mL: 0.5, unit: "mg",
      },
      {
        label: "1 mg/mL — 50 mg in 50 mL NS",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 100 mg in 50 mL NS (concentrated, CVC)",
        totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg",
      },
    ],
    notes: "1 mg = 1000 mcg. For SE: start 0.05–0.2 mg/kg/hr (50–200 mcg/kg/hr); titrate up.",
    warnings: ["Tolerance develops with prolonged use", "Propylene glycol toxicity at high doses > 72 hr"],
    reference: "Harriet Lane 23e | SCCM PADIS 2024",
  },

  {
    id: "dexmedetomidine-infusion",
    name: "Dexmedetomidine",
    category: "Sedative (α2-Agonist)",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mcg/hr"],
    minDose: 0.1,
    maxDose: 1.5,
    typicalDose: 0.5,
    doseStep: 0.05,
    color: "#0A4F7A",
    indication: "Cooperative ICU sedation, procedural, opioid/benzodiazepine weaning",
    vialConc_per_mL: 0.1,
    vialLabel: "200 mcg/2 mL vial (0.1 mg/mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "4 mcg/mL — 200 mcg in 50 mL NS",
        totalDrug_mg: 0.2, totalVolume_mL: 50, concentration_per_mL: 0.004, unit: "mg",
      },
      {
        label: "8 mcg/mL — 400 mcg in 50 mL NS",
        totalDrug_mg: 0.4, totalVolume_mL: 50, concentration_per_mL: 0.008, unit: "mg",
      },
    ],
    warnings: ["Bradycardia and hypotension with loading dose — load cautiously"],
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
    indication: "ICU sedation (> 3 yr), anesthesia maintenance, refractory SE",
    vialConc_per_mL: 10,
    vialLabel: "10 mg/mL emulsion (undiluted)",
    diluent: "Undiluted (use as-is)",
    standardConcentrations: [
      {
        label: "10 mg/mL — undiluted (standard)",
        totalDrug_mg: 200, totalVolume_mL: 20, concentration_per_mL: 10, unit: "mg",
      },
    ],
    warnings: [
      "PRIS (Propofol Infusion Syndrome) at > 4 mg/kg/hr or > 48 hr — monitor TG, CK, pH",
      "AVOID in children < 16 yr for ICU sedation > 48 hr per FDA warning",
      "Contains soy/egg — allergy check",
    ],
    reference: "Harriet Lane 23e",
  },

  {
    id: "ketamine-infusion",
    name: "Ketamine",
    category: "Analgosedative",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.1,
    maxDose: 3,
    typicalDose: 1,
    doseStep: 0.1,
    color: "#1E6B55",
    indication: "ICU analgosedation, refractory SE, bronchospasm, burns, procedural",
    vialConc_per_mL: 10,
    vialLabel: "10 mg/mL vial (200 mg/20 mL)",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "1 mg/mL — 50 mg in 50 mL NS",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 100 mg in 50 mL NS",
        totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg",
      },
    ],
    notes: "Co-administer with midazolam or propofol to prevent emergence dysphoria.",
    reference: "Harriet Lane 23e",
  },

  {
    id: "nalbuphine-infusion",
    name: "Nalbuphine (Kinz)",
    category: "Opioid Analgesic",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mg/hr"],
    minDose: 10,
    maxDose: 160,
    typicalDose: 40,
    doseStep: 5,
    color: "#5D3A70",
    indication: "Post-operative analgesia, ICU analgesia, procedural pain",
    vialConc_per_mL: 10,
    vialLabel: "10 mg/mL ampoule (Kinz — 10 mg/1 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "1 mg/mL — 50 mg (5 mL vial) in 50 mL NS",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 100 mg (10 mL vial) in 50 mL NS",
        totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg",
      },
    ],
    notes: "Stock vial: 10 mg/mL (Kinz 10 mg/1 mL). Working concentrations: 1 mg/mL or 2 mg/mL. Max 160 mcg/kg/hr. Less respiratory depression than morphine.",
    warnings: ["May precipitate withdrawal in opioid-dependent patients"],
    reference: "Harriet Lane 23e",
  },

  {
    id: "clonidine-infusion",
    name: "Clonidine",
    category: "Sedation Adjunct (α2-Agonist)",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mcg/hr"],
    minDose: 0.5,
    maxDose: 2,
    typicalDose: 1,
    doseStep: 0.1,
    color: "#2C5F8A",
    indication: "ICU sedation adjunct, opioid/benzodiazepine weaning, hypertension",
    vialConc_per_mL: 0.15,
    vialLabel: "150 mcg/mL ampoule (0.15 mg/mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "3 mcg/mL — 150 mcg in 50 mL NS",
        totalDrug_mg: 0.15, totalVolume_mL: 50, concentration_per_mL: 0.003, unit: "mg",
      },
      {
        label: "6 mcg/mL — 300 mcg in 50 mL NS",
        totalDrug_mg: 0.3, totalVolume_mL: 50, concentration_per_mL: 0.006, unit: "mg",
      },
    ],
    notes: "Useful for opioid weaning, night-time sedation in PICU. Do not stop abruptly.",
    warnings: ["Bradycardia, hypotension", "Rebound hypertension if stopped abruptly"],
    reference: "Harriet Lane 23e",
  },

  {
    id: "lorazepam-infusion",
    name: "Lorazepam",
    category: "Antiepileptic / Sedative",
    primaryUnit: "mcg/kg/hr",
    alternateUnits: ["mg/hr"],
    minDose: 10,
    maxDose: 100,
    typicalDose: 30,
    doseStep: 5,
    color: "#1B4F72",
    indication: "Refractory status epilepticus (continuous infusion protocol)",
    vialConc_per_mL: 4,
    vialLabel: "4 mg/mL ampoule (2 mg/0.5 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "0.2 mg/mL — 10 mg in 50 mL NS",
        totalDrug_mg: 10, totalVolume_mL: 50, concentration_per_mL: 0.2, unit: "mg",
      },
      {
        label: "0.4 mg/mL — 20 mg in 50 mL NS",
        totalDrug_mg: 20, totalVolume_mL: 50, concentration_per_mL: 0.4, unit: "mg",
      },
    ],
    notes: "For refractory SE. Midazolam infusion preferred. Propylene glycol accumulation risk at high doses.",
    warnings: ["Propylene glycol toxicity with prolonged high-dose infusion", "Respiratory depression — ensure intubation ready"],
    reference: "Harriet Lane 23e | Neurocritical Care Society 2024",
  },

  // ══════════════════════════════════════════════════════════════
  //  RESPIRATORY / BRONCHODILATORS
  // ══════════════════════════════════════════════════════════════
  {
    id: "salbutamol-infusion",
    name: "Salbutamol IV",
    category: "Bronchodilator (β2-Agonist)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr", "mcg/hr"],
    minDose: 0.1,
    maxDose: 2.0,
    typicalDose: 0.5,
    doseStep: 0.1,
    color: "#0C7B5C",
    indication: "Life-threatening / ICU-refractory bronchospasm, severe asthma",
    vialConc_per_mL: 0.5,
    vialLabel: "0.5 mg/mL ampoule (5 mg/10 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "100 mcg/mL — 5 mg in 50 mL NS",
        totalDrug_mg: 5, totalVolume_mL: 50, concentration_per_mL: 0.1, unit: "mg",
      },
      {
        label: "200 mcg/mL — 10 mg in 50 mL NS",
        totalDrug_mg: 10, totalVolume_mL: 50, concentration_per_mL: 0.2, unit: "mg",
      },
    ],
    warnings: ["Hypokalemia — check K+ every 4 hr", "Lactic acidosis and tachycardia at high doses"],
    reference: "BTS 2023 | Harriet Lane 23e",
  },

  {
    id: "aminophylline-infusion",
    name: "Aminophylline",
    category: "Bronchodilator (Xanthine)",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.3,
    maxDose: 1.1,
    typicalDose: 0.7,
    doseStep: 0.05,
    color: "#006B54",
    indication: "Severe asthma refractory to salbutamol/MgSO4, apnea of prematurity",
    vialConc_per_mL: 25,
    vialLabel: "25 mg/mL ampoule (250 mg/10 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "1 mg/mL — 250 mg in 250 mL NS",
        totalDrug_mg: 250, totalVolume_mL: 250, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 500 mg in 250 mL NS",
        totalDrug_mg: 500, totalVolume_mL: 250, concentration_per_mL: 2, unit: "mg",
      },
    ],
    warnings: [
      "Narrow therapeutic index — target 10–20 mcg/mL (asthma), 5–10 mcg/mL (apnea)",
      "Drug interactions: macrolides, ciprofloxacin, carbamazepine",
    ],
    reference: "BTS 2023 | Harriet Lane 23e",
  },

  {
    id: "terbutaline-infusion",
    name: "Terbutaline IV",
    category: "Bronchodilator (β2-Agonist)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 0.1,
    maxDose: 10,
    typicalDose: 0.5,
    doseStep: 0.1,
    color: "#0B6E4F",
    indication: "Life-threatening asthma (alternative to salbutamol IV), bronchospasm",
    vialConc_per_mL: 0.5,
    vialLabel: "0.5 mg/mL ampoule (1 mg/2 mL)",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "20 mcg/mL — 1 mg in 50 mL NS",
        totalDrug_mg: 1, totalVolume_mL: 50, concentration_per_mL: 0.02, unit: "mg",
      },
      {
        label: "50 mcg/mL — 2.5 mg in 50 mL NS",
        totalDrug_mg: 2.5, totalVolume_mL: 50, concentration_per_mL: 0.05, unit: "mg",
      },
    ],
    warnings: ["Tachycardia, hypokalemia", "ECG monitoring mandatory during infusion"],
    reference: "BTS 2023 | Harriet Lane 23e",
  },

  // ══════════════════════════════════════════════════════════════
  //  CARDIOVASCULAR / ANTIHYPERTENSIVE / ANTIARRHYTHMIC
  // ══════════════════════════════════════════════════════════════
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
    vialConc_per_mL: 10,
    vialLabel: "50 mg/vial → reconstitute to 10 mg/mL then dilute",
    diluent: "D5W ONLY (light-protected)",
    standardConcentrations: [
      {
        label: "200 mcg/mL — 50 mg in 250 mL D5W",
        totalDrug_mg: 50, totalVolume_mL: 250, concentration_per_mL: 0.2, unit: "mg",
      },
      {
        label: "400 mcg/mL — 100 mg in 250 mL D5W (concentrated)",
        totalDrug_mg: 100, totalVolume_mL: 250, concentration_per_mL: 0.4, unit: "mg",
      },
    ],
    warnings: [
      "⚠️ CYANIDE TOXICITY: > 4 mcg/kg/min or > 72 hr — monitor lactate",
      "MUST use light-protected tubing — cover entirely with foil",
      "Avoid in hepatic/renal impairment if possible",
    ],
    reference: "Harriet Lane 23e",
  },

  {
    id: "labetalol-infusion",
    name: "Labetalol",
    category: "Antihypertensive (α+β Blocker)",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.25,
    maxDose: 3,
    typicalDose: 1,
    doseStep: 0.25,
    color: "#2471A3",
    indication: "Hypertensive emergency, post-operative hypertension",
    vialConc_per_mL: 5,
    vialLabel: "5 mg/mL ampoule (100 mg/20 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "1 mg/mL — 100 mg in 100 mL NS",
        totalDrug_mg: 100, totalVolume_mL: 100, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 200 mg in 100 mL NS",
        totalDrug_mg: 200, totalVolume_mL: 100, concentration_per_mL: 2, unit: "mg",
      },
    ],
    warnings: ["Avoid in asthma and severe bradycardia", "Bradycardia, hypotension"],
    reference: "Harriet Lane 23e",
  },

  {
    id: "amiodarone-infusion",
    name: "Amiodarone",
    category: "Antiarrhythmic",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mg/hr"],
    minDose: 5,
    maxDose: 15,
    typicalDose: 10,
    doseStep: 1,
    color: "#6E4000",
    indication: "Post-cardiac arrest arrhythmia, VT/VF suppression, SVT (rate control)",
    vialConc_per_mL: 50,
    vialLabel: "50 mg/mL ampoule (150 mg/3 mL or 300 mg/6 mL)",
    diluent: "D5W ONLY",
    standardConcentrations: [
      {
        label: "1.2 mg/mL — 300 mg in 250 mL D5W",
        totalDrug_mg: 300, totalVolume_mL: 250, concentration_per_mL: 1.2, unit: "mg",
      },
      {
        label: "2 mg/mL — 500 mg in 250 mL D5W (maintenance)",
        totalDrug_mg: 500, totalVolume_mL: 250, concentration_per_mL: 2, unit: "mg",
      },
    ],
    notes: "Loading: 5 mg/kg IV over 20–60 min; Maintenance: 5–15 mg/kg/day infusion.",
    warnings: [
      "MUST use D5W only — precipitates in NS",
      "QTc prolongation — continuous ECG monitoring",
      "Phlebitis with peripheral admin — CVC preferred > 2 mg/mL",
    ],
    reference: "PALS 2025 | Harriet Lane 23e",
  },

  {
    id: "nitroglycerin-infusion",
    name: "Nitroglycerin (GTN)",
    category: "Vasodilator",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/min", "mg/hr"],
    minDose: 0.1,
    maxDose: 10,
    typicalDose: 1,
    doseStep: 0.1,
    color: "#117A8B",
    indication: "Post-cardiac surgery hypertension, pulmonary hypertension, ischemia",
    vialConc_per_mL: 5,
    vialLabel: "5 mg/mL ampoule (25 mg/5 mL or 50 mg/10 mL)",
    diluent: "D5W or NS (non-PVC line)",
    standardConcentrations: [
      {
        label: "100 mcg/mL — 25 mg in 250 mL D5W",
        totalDrug_mg: 25, totalVolume_mL: 250, concentration_per_mL: 0.1, unit: "mg",
      },
      {
        label: "200 mcg/mL — 50 mg in 250 mL D5W",
        totalDrug_mg: 50, totalVolume_mL: 250, concentration_per_mL: 0.2, unit: "mg",
      },
    ],
    warnings: ["Use non-PVC tubing — GTN adsorbs to PVC", "Headache, hypotension, tachycardia"],
    reference: "Harriet Lane 23e",
  },

  {
    id: "lidocaine-infusion",
    name: "Lidocaine",
    category: "Antiarrhythmic",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mg/kg/hr", "mg/hr"],
    minDose: 10,
    maxDose: 50,
    typicalDose: 20,
    doseStep: 5,
    color: "#1A5276",
    indication: "Ventricular arrhythmias, local anesthetic adjunct, refractory SE",
    vialConc_per_mL: 10,
    vialLabel: "1% solution (10 mg/mL) vial",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "2 mg/mL — 500 mg in 250 mL D5W",
        totalDrug_mg: 500, totalVolume_mL: 250, concentration_per_mL: 2, unit: "mg",
      },
      {
        label: "4 mg/mL — 1000 mg in 250 mL D5W",
        totalDrug_mg: 1000, totalVolume_mL: 250, concentration_per_mL: 4, unit: "mg",
      },
    ],
    notes: "Loading bolus: 1 mg/kg IV over 2 min before starting infusion. Then 20–50 mcg/kg/min.",
    warnings: ["CNS toxicity (seizures, tinnitus) at high levels", "Cardiac toxicity — ECG monitoring"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },

  // ══════════════════════════════════════════════════════════════
  //  DIURETICS & ELECTROLYTES
  // ══════════════════════════════════════════════════════════════
  {
    id: "furosemide-infusion",
    name: "Furosemide",
    category: "Diuretic (Loop)",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mcg/kg/min"],
    minDose: 0.05,
    maxDose: 0.5,
    typicalDose: 0.1,
    doseStep: 0.025,
    color: "#117A8B",
    indication: "Fluid overload, oliguria, acute pulmonary edema, refractory edema",
    vialConc_per_mL: 10,
    vialLabel: "10 mg/mL ampoule",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "1 mg/mL — 50 mg in 50 mL NS",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 100 mg in 50 mL NS (concentrated)",
        totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg",
      },
    ],
    warnings: ["Hypokalemia — replace K+", "Ototoxicity — avoid rapid bolus infusion"],
    reference: "Harriet Lane 23e",
  },

  {
    id: "magnesium-infusion",
    name: "Magnesium Sulfate",
    category: "Electrolyte / Bronchodilator",
    primaryUnit: "mg/kg/hr",
    alternateUnits: ["mmol/hr"],
    minDose: 20,
    maxDose: 75,
    typicalDose: 40,
    doseStep: 5,
    color: "#285E61",
    indication: "Severe asthma (GINA Step 5), hypomagnesemia, arrhythmias, eclampsia",
    vialConc_per_mL: 500,
    vialLabel: "50% (500 mg/mL) vial — MUST dilute before use",
    diluent: "NS or D5W",
    standardConcentrations: [
      {
        label: "10 mg/mL — 500 mg in 50 mL NS",
        totalDrug_mg: 500, totalVolume_mL: 50, concentration_per_mL: 10, unit: "mg",
      },
      {
        label: "20 mg/mL — 1000 mg in 50 mL NS (concentrated)",
        totalDrug_mg: 1000, totalVolume_mL: 50, concentration_per_mL: 20, unit: "mg",
      },
    ],
    notes: "Loading dose for asthma: 25–40 mg/kg (max 2 g) IV over 20 min. 1 g MgSO4 = 4 mmol Mg²⁺.",
    warnings: [
      "Monitor reflexes, RR, BP — respiratory depression at toxic levels > 4 mmol/L",
      "⚠️ 50% vial VERY CONCENTRATED — always dilute before infusion",
      "Calcium gluconate antidote — keep at bedside",
    ],
    reference: "GINA 2024 | Harriet Lane 23e",
  },

  // ══════════════════════════════════════════════════════════════
  //  NMBDs (ICU INFUSIONS)
  // ══════════════════════════════════════════════════════════════
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
    indication: "ICU mechanical ventilation, ARDS, multi-organ failure (Hofmann elimination)",
    vialConc_per_mL: 2,
    vialLabel: "2 mg/mL vial (10 mg/5 mL or 25 mg/12.5 mL or 50 mg/25 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "0.5 mg/mL — 25 mg (12.5 mL vial) in 50 mL NS",
        totalDrug_mg: 25, totalVolume_mL: 50, concentration_per_mL: 0.5, unit: "mg",
      },
      {
        label: "1 mg/mL — 50 mg (25 mL vial) in 50 mL NS",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "1 mg/mL — 100 mg (50 mL vial) in 100 mL NS",
        totalDrug_mg: 100, totalVolume_mL: 100, concentration_per_mL: 1, unit: "mg",
      },
    ],
    notes: "TOF target: 0–1/4 twitches. Hofmann elimination — safe in renal AND hepatic failure.",
    warnings: [
      "MANDATORY deep sedation (RASS −4/−5) before and during paralysis",
      "No analgesic effect — ensure adequate analgesia",
      "Histamine release — inject boluses slowly",
    ],
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
    indication: "ARDS (ACURASYS protocol 48 hr), ICU paralysis — minimal histamine release",
    vialConc_per_mL: 2,
    vialLabel: "2 mg/mL vial (20 mg/10 mL or 40 mg/20 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "0.4 mg/mL — 20 mg in 50 mL NS",
        totalDrug_mg: 20, totalVolume_mL: 50, concentration_per_mL: 0.4, unit: "mg",
      },
      {
        label: "0.8 mg/mL — 40 mg in 50 mL NS (concentrated)",
        totalDrug_mg: 40, totalVolume_mL: 50, concentration_per_mL: 0.8, unit: "mg",
      },
    ],
    notes: "ACURASYS: ~0.625 mcg/kg/min × 48 hr in early ARDS. Less laudanosine than atracurium.",
    warnings: ["RASS −4/−5 mandatory before paralysis", "NOT for RSI — onset 3–5 min"],
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
    indication: "ICU paralysis for ARDS, ICP management, refractory bronchospasm",
    vialConc_per_mL: 5,
    vialLabel: "5 mg/mL vial (50 mg/10 mL or 100 mg/20 mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "1 mg/mL — 50 mg (10 mL vial) in 50 mL NS",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "mg",
      },
      {
        label: "2 mg/mL — 100 mg (20 mL vial) in 50 mL NS",
        totalDrug_mg: 100, totalVolume_mL: 50, concentration_per_mL: 2, unit: "mg",
      },
      {
        label: "1 mg/mL — 100 mg (20 mL vial) in 100 mL NS",
        totalDrug_mg: 100, totalVolume_mL: 100, concentration_per_mL: 1, unit: "mg",
      },
    ],
    notes: "Key advantage: fully reversible with sugammadex 4 mg/kg (routine) or 16 mg/kg (emergency CICO).",
    warnings: ["Have sugammadex at bedside", "Deep sedation mandatory before paralysis"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },

  {
    id: "vecuronium-infusion",
    name: "Vecuronium",
    category: "NMBD (ICU Paralysis)",
    primaryUnit: "mcg/kg/min",
    alternateUnits: ["mcg/kg/hr"],
    minDose: 0.5,
    maxDose: 2,
    typicalDose: 1,
    doseStep: 0.1,
    color: "#4A1580",
    indication: "ICU neuromuscular blockade — no histamine release, cardiovascular stability",
    vialConc_per_mL: 2,
    vialLabel: "2 mg/mL (reconstituted: 10 mg vial + 5 mL WFI = 2 mg/mL)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "0.1 mg/mL — 5 mg (2.5 mL) in 50 mL NS",
        totalDrug_mg: 5, totalVolume_mL: 50, concentration_per_mL: 0.1, unit: "mg",
      },
      {
        label: "0.2 mg/mL — 10 mg (5 mL) in 50 mL NS",
        totalDrug_mg: 10, totalVolume_mL: 50, concentration_per_mL: 0.2, unit: "mg",
      },
      {
        label: "0.4 mg/mL — 20 mg (10 mL) in 50 mL NS",
        totalDrug_mg: 20, totalVolume_mL: 50, concentration_per_mL: 0.4, unit: "mg",
      },
    ],
    notes: "Onset 2–3 min. TOF monitoring mandatory. Active metabolite accumulates in renal failure — use atracurium/cisatracurium instead.",
    warnings: ["Active 3-OH metabolite accumulates in renal failure → prolonged block", "Deep sedation mandatory"],
    reference: "Harriet Lane 23e | Miller's Anesthesia",
  },

  // ══════════════════════════════════════════════════════════════
  //  ANTICOAGULATION
  // ══════════════════════════════════════════════════════════════
  {
    id: "heparin",
    name: "Heparin (UFH)",
    category: "Anticoagulant",
    primaryUnit: "units/kg/hr",
    alternateUnits: ["units/hr"],
    minDose: 10,
    maxDose: 40,
    typicalDose: 20,
    doseStep: 2,
    color: "#5D6D7E",
    indication: "DVT/PE treatment, ECMO anticoagulation, line patency, catheter thrombosis",
    vialConc_per_mL: 1000,
    vialLabel: "1000 units/mL vial",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "100 units/mL — 5000 units in 50 mL NS",
        totalDrug_mg: 5000, totalVolume_mL: 50, concentration_per_mL: 100, unit: "units",
      },
      {
        label: "50 units/mL — 2500 units in 50 mL NS (low-dose)",
        totalDrug_mg: 2500, totalVolume_mL: 50, concentration_per_mL: 50, unit: "units",
      },
    ],
    notes: "Loading: 75–100 units/kg IV bolus (max 5000 units). Adjust infusion by APTT ratio 1.5–2.5× normal.",
    warnings: [
      "APTT target 60–85 sec (prophylaxis) or 1.5–2.5× ULN (treatment)",
      "HIT — check platelets every 2–3 days",
    ],
    reference: "Harriet Lane 23e",
  },

  // ══════════════════════════════════════════════════════════════
  //  HORMONES
  // ══════════════════════════════════════════════════════════════
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
    indication: "Hyperglycemia, DKA (after fluid resuscitation), hyperkalemia (transcellular shift)",
    vialConc_per_mL: 100,
    vialLabel: "100 units/mL vial (Actrapid / Humulin R)",
    diluent: "NS",
    standardConcentrations: [
      {
        label: "0.5 units/mL — 25 units in 50 mL NS",
        totalDrug_mg: 25, totalVolume_mL: 50, concentration_per_mL: 0.5, unit: "units",
      },
      {
        label: "1 unit/mL — 50 units in 50 mL NS (concentrated)",
        totalDrug_mg: 50, totalVolume_mL: 50, concentration_per_mL: 1, unit: "units",
      },
    ],
    notes: "DKA: 0.05–0.1 units/kg/hr. Maintain glucose 8–12 mmol/L. Do NOT start until K⁺ > 3.5 mEq/L.",
    warnings: [
      "Hypoglycemia — check glucose hourly",
      "DKA: withhold if K⁺ < 3.5 mEq/L until repleted",
    ],
    reference: "ISPAD 2022 | Harriet Lane 23e",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL RECIPE CALCULATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export interface RecipeResult {
  drugML: number;
  diluentML: number;
  syringeML: number;
  totalAmountStr: string;    // e.g. "50 mg" or "5000 units" or "500 mcg"
  finalConcStr: string;      // e.g. "1 mg/mL" or "100 mcg/mL" or "100 units/mL"
  finalConc_per_mL: number;  // in base units (mg/mL or units/mL)
  isValid: boolean;
  tooConcentrated: boolean;  // drugML > syringeML
  tooSmall: boolean;         // drugML < 0.05 mL (impractical)
}

export function computeRecipe(
  drug: InfusionDrug,
  concIdx: number,
  weightKg: number,
  syringeML: number,
): RecipeResult | null {
  const stdConc = drug.standardConcentrations[concIdx];
  if (!stdConc || !drug.vialConc_per_mL || drug.vialConc_per_mL <= 0) return null;

  const vialConc = drug.vialConc_per_mL;
  const isWeightBased = stdConc.totalDrug_mg === -1;
  const isUnitsDrug = stdConc.unit === "units";
  const isMcgDrug = stdConc.unit === "mcg";

  let totalAmount: number;  // in base unit (mg or units)
  let finalConc: number;    // in base unit per mL (mg/mL or units/mL)

  if (isWeightBased) {
    if (weightKg <= 0) return null;
    const multiplier = parseFloat(stdConc.label.split(" ")[0]) || 0;
    if (multiplier <= 0) return null;

    if (isMcgDrug) {
      // multiplier is in mcg/kg → scale to current syringe size
      const totalMcg = multiplier * weightKg * (syringeML / stdConc.totalVolume_mL);
      totalAmount = totalMcg / 1000;                    // convert mcg → mg
      finalConc = totalAmount / syringeML;              // mg/mL
    } else {
      // mg/kg or units/kg
      totalAmount = multiplier * weightKg * (syringeML / stdConc.totalVolume_mL);
      finalConc = totalAmount / syringeML;
    }
  } else {
    finalConc = stdConc.concentration_per_mL;
    totalAmount = finalConc * syringeML;
  }

  const drugML = totalAmount / vialConc;
  const diluentML = syringeML - drugML;

  // ── Format total drug amount ──
  let totalAmountStr: string;
  if (isUnitsDrug) {
    totalAmountStr = `${Math.round(totalAmount).toLocaleString()} units`;
  } else if (isMcgDrug || (!isUnitsDrug && totalAmount < 1 && totalAmount > 0)) {
    totalAmountStr = `${(totalAmount * 1000).toFixed(0)} mcg`;
  } else {
    totalAmountStr = totalAmount >= 10
      ? `${totalAmount.toFixed(1)} mg`
      : `${totalAmount.toFixed(2)} mg`;
  }

  // ── Format final concentration ──
  let finalConcStr: string;
  if (isUnitsDrug) {
    finalConcStr = `${finalConc.toFixed(2)} units/mL`;
  } else if (finalConc >= 1) {
    finalConcStr = `${(finalConc * 1000).toFixed(0)} mcg/mL`;
  } else if (isMcgDrug || finalConc < 1) {
    // Show everything below 1 mg/mL in mcg/mL for clarity
    const mcgVal = finalConc * 1000;
    finalConcStr = `${mcgVal < 1 ? mcgVal.toFixed(2) : mcgVal.toFixed(0)} mcg/mL`;
  } else {
    finalConcStr = `${finalConc.toFixed(4)} mg/mL`;
  }

  const isValid = drugML > 0 && diluentML >= 0 && isFinite(drugML) && isFinite(diluentML);

  return {
    drugML,
    diluentML,
    syringeML,
    totalAmountStr,
    finalConcStr,
    finalConc_per_mL: finalConc,
    isValid,
    tooConcentrated: drugML > syringeML,
    tooSmall: drugML < 0.05 && isValid,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// INFUSION RATE CALCULATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export function calculateInfusionRate(
  desiredDose: number,
  doseUnit: InfusionUnit,
  weight_kg: number,
  concentration_per_mL: number,
): number {
  if (!concentration_per_mL || concentration_per_mL <= 0) return 0;

  switch (doseUnit) {
    case "mcg/kg/min":
      return (desiredDose * weight_kg * 60) / (1000 * concentration_per_mL);
    case "mcg/kg/hr":
      return (desiredDose * weight_kg) / (1000 * concentration_per_mL);
    case "mg/kg/hr":
      return (desiredDose * weight_kg) / concentration_per_mL;
    case "units/kg/hr":
      return (desiredDose * weight_kg) / concentration_per_mL;
    case "mcg/min":
      return (desiredDose * 60) / (1000 * concentration_per_mL);
    case "mg/hr":
      return desiredDose / concentration_per_mL;
    case "units/hr":
      return desiredDose / concentration_per_mL;
    case "mL/kg/hr":
      return desiredDose * weight_kg;
    default:
      return 0;
  }
}

export function ruleOf6Concentration(
  multiplier: number,
  weight_kg: number,
  volume_mL: number,
): number {
  return (multiplier * weight_kg) / volume_mL;
}

export function formatRate(rate: number): string {
  if (rate <= 0 || !isFinite(rate)) return "—";
  if (rate < 1) return rate.toFixed(3) + " mL/hr";
  if (rate < 10) return rate.toFixed(2) + " mL/hr";
  return rate.toFixed(1) + " mL/hr";
}

export function convertDoseUnit(
  dose: number,
  from: InfusionUnit,
  to: InfusionUnit,
  weight_kg: number,
): number {
  let mgPerHr = 0;
  switch (from) {
    case "mcg/kg/min": mgPerHr = (dose * weight_kg * 60) / 1000; break;
    case "mcg/kg/hr":  mgPerHr = (dose * weight_kg) / 1000; break;
    case "mg/kg/hr":   mgPerHr = dose * weight_kg; break;
    case "mg/hr":      mgPerHr = dose; break;
    case "mcg/min":    mgPerHr = (dose * 60) / 1000; break;
    case "units/kg/hr":mgPerHr = dose * weight_kg; break;
    default: return dose;
  }
  switch (to) {
    case "mcg/kg/min": return (mgPerHr * 1000) / (weight_kg * 60);
    case "mcg/kg/hr":  return (mgPerHr * 1000) / weight_kg;
    case "mg/kg/hr":   return mgPerHr / weight_kg;
    case "mg/hr":      return mgPerHr;
    case "mcg/min":    return (mgPerHr * 1000) / 60;
    default: return dose;
  }
}
