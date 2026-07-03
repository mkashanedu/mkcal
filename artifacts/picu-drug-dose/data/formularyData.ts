// PICU Formulary — non-emergency medications (Tablets, Syrups, Nebulizers, IV Infusions)
// Reference: Harriet Lane Handbook 23rd Ed · Nelson Textbook of Pediatrics 22nd Ed
//
// HOW TO ADD A NEW DRUG:
// 1. Pick the correct `category` below.
// 2. Copy an existing entry in FORMULARY_DRUGS as a template and fill in every field.
// 3. `dosing[]` supports the same weight-based calculation engine as the rest of the
//    app (`value`/`min`/`max` + `perKg` + `unit`). For Syrups / IV Infusions you can
//    also set `concentrationMgPerMl` so the detail screen can convert the calculated
//    mg dose into a volume (mL) automatically — the clinician can override it live.
// 4. Every field maps 1:1 onto a section of the Drug Detail Template:
//    name/drugClass -> "Drug Name & Class"
//    indications/contraindications -> "Indications & Contraindications"
//    dosing/concentrationMgPerMl -> "Dosing (Formula-based with concentration input)"
//    metabolism/excretion -> "Metabolism & Excretion"
//    monitoring -> "Clinical Monitoring"
//    adverseReactions -> "Adverse Reactions"

export type FormularyCategory = "tablet" | "syrup" | "nebulizer" | "ivInfusion";

export interface FormularyDoseFormula {
  /** Fixed single dose, e.g. { value: 15, unit: "mg/kg", perKg: true } */
  value?: number;
  /** Dose range minimum, used together with `max` */
  min?: number;
  /** Dose range maximum, used together with `min` */
  max?: number;
  unit: string;
  perKg?: boolean;
  route: string;
  frequency?: string;
  maxDose?: string;
  /** Numeric adult/absolute maximum in the same computed unit — calculated dose is capped and flagged */
  adultMaxDose_num?: number;
  notes?: string;
}

export interface FormularyDrug {
  id: string;
  name: string;
  genericName?: string;
  /** Pharmacological class, e.g. "Beta-2 Agonist (Bronchodilator)" */
  drugClass: string;
  category: FormularyCategory;

  indications: string[];
  contraindications: string[];

  dosing: FormularyDoseFormula[];
  /** Default liquid concentration (mg/mL) used to pre-fill the concentration input for volume conversion */
  concentrationMgPerMl?: number;
  formulations?: string[];

  metabolism: string;
  excretion: string;

  monitoring: string[];
  adverseReactions: string[];

  reference?: string;
}

export const FORMULARY_CATEGORIES: Record<
  FormularyCategory,
  { label: string; icon: string; color: string; description: string }
> = {
  tablet: {
    label: "Tablets",
    icon: "circle",
    color: "#0891B2",
    description: "Oral solid dose forms",
  },
  syrup: {
    label: "Syrups",
    icon: "droplet",
    color: "#7C3AED",
    description: "Oral liquid suspensions & solutions",
  },
  nebulizer: {
    label: "Nebulizers",
    icon: "wind",
    color: "#0D9488",
    description: "Inhaled nebulized therapy",
  },
  ivInfusion: {
    label: "IV Infusions",
    icon: "activity",
    color: "#D97706",
    description: "Intravenous non-emergency infusions",
  },
};

export const FORMULARY_DRUGS: FormularyDrug[] = [
  // ════════════════════════════════════════════════════════════
  //  TABLETS
  // ════════════════════════════════════════════════════════════
  {
    id: "f-paracetamol-tab",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    drugClass: "Analgesic / Antipyretic",
    category: "tablet",
    indications: ["Mild-moderate pain", "Fever"],
    contraindications: ["Severe hepatic impairment", "Known hypersensitivity"],
    dosing: [
      { value: 15, unit: "mg/kg", perKg: true, route: "Oral", frequency: "Every 4–6 hr, max 4 doses/day", maxDose: "1000 mg/dose", adultMaxDose_num: 1000, notes: "Do not exceed 75 mg/kg/day (child) or 4 g/day (adult)" },
    ],
    formulations: ["500 mg tablet", "250 mg tablet"],
    metabolism: "Hepatic — conjugation (glucuronidation/sulfation); minor CYP2E1 pathway produces hepatotoxic NAPQI metabolite",
    excretion: "Renal excretion of glucuronide/sulfate conjugates (>90%); <5% excreted unchanged",
    monitoring: ["Temperature response", "Liver function if prolonged/high-dose use", "Signs of overdose (nausea, hepatotoxicity)"],
    adverseReactions: ["Hepatotoxicity in overdose", "Rare rash/hypersensitivity", "Rare thrombocytopenia"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "f-ibuprofen-tab",
    name: "Ibuprofen",
    drugClass: "NSAID (Non-selective COX inhibitor)",
    category: "tablet",
    indications: ["Mild-moderate pain", "Fever", "Inflammation"],
    contraindications: ["Age < 6 months", "Active GI bleeding/peptic ulcer", "Renal impairment", "Dehydration"],
    dosing: [
      { min: 5, max: 10, unit: "mg/kg", perKg: true, route: "Oral", frequency: "Every 6–8 hr, max 4 doses/day", maxDose: "400 mg/dose", adultMaxDose_num: 400 },
    ],
    formulations: ["200 mg tablet", "400 mg tablet"],
    metabolism: "Hepatic — CYP2C9 oxidation to inactive metabolites",
    excretion: "Renal (~90% as metabolites), remainder in bile/feces",
    monitoring: ["Renal function with prolonged use", "GI symptoms/occult bleeding", "Hydration status"],
    adverseReactions: ["GI upset, peptic ulceration", "Renal impairment (esp. if dehydrated)", "Bronchospasm in aspirin-sensitive asthma"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "f-prednisolone-tab",
    name: "Prednisolone",
    drugClass: "Corticosteroid (Glucocorticoid)",
    category: "tablet",
    indications: ["Acute asthma exacerbation", "Croup", "Nephrotic syndrome", "Anti-inflammatory/immunosuppressive"],
    contraindications: ["Systemic fungal infection", "Live vaccine administration during high-dose therapy"],
    dosing: [
      { value: 1, unit: "mg/kg", perKg: true, route: "Oral", frequency: "Once daily", maxDose: "40 mg/dose", adultMaxDose_num: 40, notes: "Asthma: 1–2 mg/kg/day for 3–5 days" },
    ],
    formulations: ["5 mg tablet", "25 mg tablet"],
    metabolism: "Hepatic — reversible interconversion with prednisone via 11-beta-hydroxysteroid dehydrogenase",
    excretion: "Renal, primarily as metabolites",
    monitoring: ["Blood glucose", "Blood pressure", "Growth (long-term use)", "Adrenal suppression with prolonged courses"],
    adverseReactions: ["Hyperglycemia", "Mood/behavior changes", "GI upset", "Adrenal suppression with long-term use", "Growth suppression"],
    reference: "Harriet Lane 23e | Nelson's 22e",
  },

  // ════════════════════════════════════════════════════════════
  //  SYRUPS
  // ════════════════════════════════════════════════════════════
  {
    id: "f-amoxicillin-syrup",
    name: "Amoxicillin",
    drugClass: "Beta-lactam Antibiotic (Aminopenicillin)",
    category: "syrup",
    indications: ["Otitis media", "Community-acquired pneumonia", "Streptococcal pharyngitis", "UTI"],
    contraindications: ["Penicillin allergy", "Infectious mononucleosis (risk of rash)"],
    dosing: [
      { min: 25, max: 45, unit: "mg/kg/day", perKg: true, route: "Oral, divided BID", frequency: "Every 12 hr", maxDose: "875 mg/dose", adultMaxDose_num: 875, notes: "High-dose (80–90 mg/kg/day) for resistant otitis media" },
    ],
    concentrationMgPerMl: 25,
    formulations: ["125 mg/5 mL suspension", "250 mg/5 mL suspension"],
    metabolism: "Minimal hepatic metabolism (~30%); mostly excreted unchanged",
    excretion: "Renal — tubular secretion and glomerular filtration (~60% unchanged in urine)",
    monitoring: ["Clinical response at 48–72 hr", "Signs of allergic reaction", "GI tolerance"],
    adverseReactions: ["Diarrhea", "Maculopapular rash (esp. with concurrent viral infection)", "Hypersensitivity/anaphylaxis", "C. difficile colitis (rare)"],
    reference: "Harriet Lane 23e | Nelson's 22e",
  },
  {
    id: "f-ondansetron-syrup",
    name: "Ondansetron",
    drugClass: "5-HT3 Receptor Antagonist (Antiemetic)",
    category: "syrup",
    indications: ["Nausea/vomiting (gastroenteritis, post-op, chemotherapy)"],
    contraindications: ["Congenital long QT syndrome", "Concurrent apomorphine use"],
    dosing: [
      { value: 0.15, unit: "mg/kg", perKg: true, route: "Oral", frequency: "Every 8 hr PRN", maxDose: "8 mg/dose", adultMaxDose_num: 8 },
    ],
    concentrationMgPerMl: 0.8,
    formulations: ["4 mg/5 mL solution"],
    metabolism: "Hepatic — extensive CYP3A4, CYP1A2, CYP2D6 mediated hydroxylation",
    excretion: "Renal (~5% unchanged), remainder as metabolites in urine/feces",
    monitoring: ["ECG/QTc if risk factors present", "Resolution of nausea/vomiting", "Electrolytes if prolonged vomiting"],
    adverseReactions: ["Headache", "Constipation/diarrhea", "QT prolongation (dose-dependent)", "Transient transaminase elevation"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "f-salbutamol-syrup",
    name: "Salbutamol",
    genericName: "Albuterol",
    drugClass: "Short-Acting Beta-2 Agonist",
    category: "syrup",
    indications: ["Mild wheeze/bronchospasm (adjunct, oral form)"],
    contraindications: ["Tachyarrhythmia", "Hypersensitivity to sympathomimetics"],
    dosing: [
      { value: 0.1, unit: "mg/kg", perKg: true, route: "Oral", frequency: "Every 6–8 hr", maxDose: "4 mg/dose", adultMaxDose_num: 4 },
    ],
    concentrationMgPerMl: 0.4,
    formulations: ["2 mg/5 mL syrup"],
    metabolism: "Hepatic sulfate conjugation",
    excretion: "Renal, mostly as sulfate conjugate",
    monitoring: ["Heart rate", "Tremor", "Response to therapy (oral route less effective than inhaled)"],
    adverseReactions: ["Tachycardia", "Tremor", "Hypokalemia (high dose)", "Nervousness/agitation"],
    reference: "Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  NEBULIZERS
  // ════════════════════════════════════════════════════════════
  {
    id: "f-salbutamol-neb",
    name: "Salbutamol",
    genericName: "Albuterol",
    drugClass: "Short-Acting Beta-2 Agonist (SABA)",
    category: "nebulizer",
    indications: ["Acute asthma exacerbation", "Bronchospasm", "Bronchiolitis (trial dose)"],
    contraindications: ["Hypersensitivity to salbutamol", "Tachyarrhythmia (relative)"],
    dosing: [
      { value: 0.15, unit: "mg/kg", perKg: true, route: "Nebulized", frequency: "Every 20 min × 3 then PRN", maxDose: "5 mg/dose", adultMaxDose_num: 5, notes: "Minimum dose 2.5 mg regardless of weight; dilute to 3 mL with NS" },
    ],
    concentrationMgPerMl: 5,
    formulations: ["Nebules 2.5 mg/2.5 mL", "Nebules 5 mg/2.5 mL"],
    metabolism: "Minimal systemic absorption via inhaled route; hepatic sulfate conjugation of absorbed fraction",
    excretion: "Renal, mostly as sulfate conjugate and unchanged drug",
    monitoring: ["Respiratory rate, work of breathing", "Oxygen saturation", "Heart rate (tachycardia common)", "Response to bronchodilator (peak flow if age-appropriate)"],
    adverseReactions: ["Tachycardia", "Tremor", "Hypokalemia with frequent dosing", "Paradoxical bronchospasm (rare)"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "f-ipratropium-neb",
    name: "Ipratropium Bromide",
    drugClass: "Anticholinergic Bronchodilator",
    category: "nebulizer",
    indications: ["Acute severe asthma (adjunct to SABA)", "Bronchospasm"],
    contraindications: ["Hypersensitivity to atropine/derivatives", "Soy/peanut allergy (formulation-dependent)"],
    dosing: [
      { value: 250, unit: "mcg", route: "Nebulized", frequency: "Every 20 min × 3 then every 4–6 hr", maxDose: "500 mcg/dose", notes: "Fixed dose — not weight-based. <12 yr: 250 mcg; ≥12 yr: 500 mcg", adultMaxDose_num: 500 },
    ],
    concentrationMgPerMl: 0.25,
    formulations: ["Nebules 250 mcg/mL", "Nebules 500 mcg/2 mL"],
    metabolism: "Minimal systemic metabolism — poor systemic absorption via inhaled route",
    excretion: "Primarily biliary/fecal; small renal fraction unchanged",
    monitoring: ["Respiratory status", "Heart rate", "Urinary retention (rare)", "Dry mouth"],
    adverseReactions: ["Dry mouth", "Cough/paradoxical bronchospasm", "Blurred vision if sprayed in eyes", "Urinary retention (rare)"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "f-budesonide-neb",
    name: "Budesonide",
    drugClass: "Inhaled Corticosteroid",
    category: "nebulizer",
    indications: ["Croup", "Persistent asthma (maintenance)"],
    contraindications: ["Active untreated respiratory tract infection (relative, use caution)"],
    dosing: [
      { value: 2, unit: "mg", route: "Nebulized", frequency: "Single dose (croup) or BID (asthma)", notes: "Croup: 2 mg single dose regardless of weight" },
    ],
    concentrationMgPerMl: 0.5,
    formulations: ["Respules 0.5 mg/2 mL", "Respules 1 mg/2 mL"],
    metabolism: "Hepatic — extensive first-pass CYP3A4 metabolism to low-activity metabolites",
    excretion: "Renal and fecal, as metabolites",
    monitoring: ["Stridor/work of breathing (croup)", "Growth with long-term use", "Oral candidiasis risk"],
    adverseReactions: ["Oral candidiasis", "Hoarseness/dysphonia", "Cough", "Growth suppression with prolonged high-dose use"],
    reference: "Harriet Lane 23e | Nelson's 22e",
  },

  // ════════════════════════════════════════════════════════════
  //  IV INFUSIONS
  // ════════════════════════════════════════════════════════════
  {
    id: "f-ceftriaxone-iv",
    name: "Ceftriaxone",
    drugClass: "3rd Generation Cephalosporin",
    category: "ivInfusion",
    indications: ["Meningitis", "Community-acquired pneumonia", "Sepsis", "Complicated UTI"],
    contraindications: ["Hyperbilirubinemic neonates", "Concurrent IV calcium in neonates", "Cephalosporin allergy"],
    dosing: [
      { min: 50, max: 100, unit: "mg/kg/day", perKg: true, route: "IV infusion over 30 min", frequency: "Once daily or divided BID", maxDose: "4000 mg/day", adultMaxDose_num: 4000, notes: "Meningitis: 100 mg/kg/day divided q12h" },
    ],
    concentrationMgPerMl: 10,
    formulations: ["Vial 250 mg, 500 mg, 1 g, 2 g (reconstitute per protocol)"],
    metabolism: "Not hepatically metabolized — excreted largely unchanged",
    excretion: "Renal (~60%) and biliary/fecal (~40%)",
    monitoring: ["Renal function", "Signs of biliary sludging (prolonged use)", "Clinical response/CRP trend", "Avoid with IV calcium-containing solutions"],
    adverseReactions: ["Biliary pseudolithiasis", "Diarrhea", "Injection site reaction", "Hypersensitivity/anaphylaxis", "Rare kernicterus risk in neonates"],
    reference: "Harriet Lane 23e | Nelson's 22e",
  },
  {
    id: "f-vancomycin-iv",
    name: "Vancomycin",
    drugClass: "Glycopeptide Antibiotic",
    category: "ivInfusion",
    indications: ["MRSA infections", "Severe gram-positive sepsis", "CNS infections (with resistant organisms)"],
    contraindications: ["Known anaphylaxis to vancomycin"],
    dosing: [
      { value: 15, unit: "mg/kg/dose", perKg: true, route: "IV infusion over 60 min (min)", frequency: "Every 6 hr", maxDose: "2000 mg/dose", adultMaxDose_num: 2000, notes: "Infuse no faster than 10 mg/min to avoid red man syndrome" },
    ],
    concentrationMgPerMl: 5,
    formulations: ["Vial 500 mg, 1 g (reconstitute and dilute per protocol)"],
    metabolism: "Minimal metabolism — excreted almost entirely unchanged",
    excretion: "Renal — glomerular filtration (~80–90% unchanged); dose adjustment required in renal impairment",
    monitoring: ["Trough levels (target per institutional protocol)", "Renal function (BUN/creatinine)", "Hearing (ototoxicity with prolonged/high levels)", "Infusion site for phlebitis"],
    adverseReactions: ["Red man syndrome (rate-related)", "Nephrotoxicity", "Ototoxicity", "Phlebitis at infusion site", "Neutropenia (prolonged use)"],
    reference: "Harriet Lane 23e | Nelson's 22e",
  },
  {
    id: "f-maintenance-fluid-iv",
    name: "Maintenance IV Fluids",
    genericName: "0.9% NaCl + 5% Dextrose (typical)",
    drugClass: "Crystalloid Fluid / Electrolyte Replacement",
    category: "ivInfusion",
    indications: ["Maintenance hydration", "NPO status", "Inability to tolerate oral intake"],
    contraindications: ["Fluid overload states (caution)", "Severe hyponatremia (fluid choice must be individualized)"],
    dosing: [
      { value: 4, unit: "mL/kg/hr", perKg: true, route: "IV infusion", notes: "Holliday-Segar: 4 mL/kg/hr for first 10 kg" },
      { value: 2, unit: "mL/kg/hr", perKg: true, route: "IV infusion", notes: "+ 2 mL/kg/hr for next 10 kg (11–20 kg)" },
      { value: 1, unit: "mL/kg/hr", perKg: true, route: "IV infusion", notes: "+ 1 mL/kg/hr for each kg > 20 kg" },
    ],
    formulations: ["0.9% NaCl + 5% Dextrose ± KCl per electrolytes"],
    metabolism: "Not applicable — crystalloid solution",
    excretion: "Renal (water and electrolytes)",
    monitoring: ["Daily weight", "Urine output (target ≥1 mL/kg/hr)", "Serum electrolytes every 12–24 hr", "Fluid balance chart"],
    adverseReactions: ["Fluid overload / pulmonary edema", "Hyponatremia (esp. hypotonic fluids)", "Electrolyte derangement"],
    reference: "Harriet Lane 23e — Holliday-Segar method",
  },
];

export function calculateFormularyDose(
  dose: FormularyDoseFormula,
  weightKg: number
): { calculated: string; formula: string; exceedsMax?: boolean; maxLabel?: string } {
  const unitStr = dose.unit.replace("/kg", "").replace("kg", "");

  if (!dose.perKg) {
    if (dose.min !== undefined && dose.max !== undefined) {
      return { calculated: `${dose.min} – ${dose.max} ${dose.unit}`, formula: "(fixed dose)" };
    }
    return { calculated: `${dose.value ?? "—"} ${dose.unit}`, formula: "(fixed dose)" };
  }

  if (dose.value !== undefined) {
    const calc = +(dose.value * weightKg).toFixed(3);
    const exceedsMax = dose.adultMaxDose_num !== undefined && calc > dose.adultMaxDose_num;
    const finalDose = exceedsMax ? dose.adultMaxDose_num! : calc;
    return {
      calculated: `${finalDose} ${unitStr}`,
      formula: `(${dose.value} ${dose.unit})`,
      exceedsMax,
      maxLabel: exceedsMax ? `Max: ${dose.adultMaxDose_num} ${unitStr} — dose capped` : undefined,
    };
  }

  if (dose.min !== undefined && dose.max !== undefined) {
    const calcMin = +(dose.min * weightKg).toFixed(3);
    const calcMax = +(dose.max * weightKg).toFixed(3);
    const exceedsMax = dose.adultMaxDose_num !== undefined && calcMax > dose.adultMaxDose_num;
    const displayMax = exceedsMax ? dose.adultMaxDose_num! : calcMax;
    return {
      calculated: `${calcMin} – ${displayMax} ${unitStr}`,
      formula: `(${dose.min} – ${dose.max} ${dose.unit})`,
      exceedsMax,
      maxLabel: exceedsMax ? `Max: ${dose.adultMaxDose_num} ${unitStr} — upper limit capped` : undefined,
    };
  }

  return { calculated: "—", formula: "—" };
}

/** Converts a calculated mg dose string (e.g. "150 mg") into a volume in mL given a concentration in mg/mL. */
export function mgToVolumeMl(mgDose: number, concentrationMgPerMl: number): number | null {
  if (!concentrationMgPerMl || concentrationMgPerMl <= 0) return null;
  return +(mgDose / concentrationMgPerMl).toFixed(2);
}
