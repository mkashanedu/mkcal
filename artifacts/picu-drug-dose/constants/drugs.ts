// PICU Drug Reference — Harriet Lane Handbook 23rd Ed, PALS 2025, WHO Pediatric Formulary
export type DrugCategory =
  | "emergency"
  | "analgesic"
  | "sedative"
  | "nmbd"
  | "inotrope"
  | "antibiotic"
  | "antiepileptic"
  | "fluid"
  | "respiratory"
  | "cardiovascular"
  | "antifungal"
  | "steroid"
  | "vitamin";

export interface DoseRange {
  min?: number;
  max?: number;
  value?: number;
  unit: string;
  perKg?: boolean;
  route: string;
  notes?: string;
  maxDose?: string;
  frequency?: string;
  label?: string;
  /** Numeric adult maximum in the same computed unit — triggers red alert if calculated dose exceeds this */
  adultMaxDose_num?: number;
}

export interface RenalAdjustment {
  gfr: string;
  adjustment: string;
}

export interface Drug {
  id: string;
  name: string;
  genericName?: string;
  category: DrugCategory;
  doses: DoseRange[];
  indications: string[];
  /** High-alert drug — requires double-check before administration */
  highAlert?: boolean;
  contraindications?: string[];
  warnings?: string[];
  formulations?: string[];
  notes?: string;
  renalAdjustment?: RenalAdjustment[];
  monitoring?: string[];
  reference?: string;
}

export const CATEGORIES: Record<
  DrugCategory,
  { label: string; icon: string; color: string }
> = {
  emergency: { label: "Emergency", icon: "alert-circle", color: "#6366F1" },
  analgesic: { label: "Analgesics", icon: "activity", color: "#6B2FA0" },
  sedative: { label: "Sedatives", icon: "moon", color: "#1A4F7A" },
  nmbd: { label: "NMBDs / RSI", icon: "zap-off", color: "#7B2D8E" },
  inotrope: { label: "Inotropes", icon: "heart", color: "#7C3AED" },
  antibiotic: { label: "Antibiotics", icon: "shield", color: "#146B35" },
  antiepileptic: { label: "Antiepileptics", icon: "zap", color: "#A05C00" },
  fluid: { label: "Fluids / Electrolytes", icon: "droplet", color: "#0077B6" },
  respiratory: { label: "Respiratory", icon: "wind", color: "#0C7B5C" },
  cardiovascular: { label: "Cardiovascular", icon: "trending-up", color: "#6B2D8E" },
  antifungal: { label: "Antifungals", icon: "cpu", color: "#445566" },
  steroid: { label: "Steroids", icon: "sun", color: "#C06000" },
  vitamin: { label: "Vitamins / Minerals", icon: "plus-circle", color: "#1A7A40" },
};

export const DRUGS: Drug[] = [
  // ════════════════════════════════════════════════════════════
  //  EMERGENCY
  // ════════════════════════════════════════════════════════════
  {
    id: "epinephrine",
    name: "Epinephrine",
    genericName: "Adrenaline",
    category: "emergency",
    highAlert: true,
    indications: ["Cardiac arrest", "Anaphylaxis", "Severe bradycardia"],
    doses: [
      { value: 10, unit: "mic/kg", perKg: true, route: "IV/IO", maxDose: "1000 mic", frequency: "Every 3–5 min", label: "Cardiac Arrest", notes: "= 0.1 mL/kg of 1:10,000 solution", adultMaxDose_num: 1000 },
      { min: 10, max: 500, unit: "mic/kg", perKg: true, route: "IM Anterolateral thigh", maxDose: "500 mic", label: "Anaphylaxis", notes: "Use 1:1,000 solution; may repeat after 5–15 min", adultMaxDose_num: 500 },
      { min: 0.01, max: 1.0, unit: "mic/kg/min", perKg: true, route: "IV infusion (Central)", label: "Vasopressor infusion", notes: "Titrate to effect" },
    ],
    warnings: ["PALS 2025: IO route equally effective as IV", "Tissue necrosis with peripheral extravasation", "Ensure adequate IO/IV access before use"],
    formulations: ["1:1,000 (1 mg/mL) — Anaphylaxis IM", "1:10,000 (0.1 mg/mL) — Cardiac arrest IV"],
    monitoring: ["HR, BP, perfusion every 2–5 min", "Urine output, glucose"],
    reference: "PALS 2020 updated 2025 | Harriet Lane 23e",
  },
  {
    id: "atropine",
    name: "Atropine",
    category: "emergency",
    indications: ["Symptomatic bradycardia", "Organophosphate poisoning", "Pre-medication for RSI"],
    doses: [
      { value: 0.02, unit: "mg/kg", perKg: true, route: "IV/IO", maxDose: "1 mg (child), 3 mg (adolescent)", frequency: "May repeat × 1", label: "Bradycardia", notes: "Minimum dose 0.1 mg (paradoxical bradycardia with smaller doses)", adultMaxDose_num: 3 },
      { min: 0.02, max: 0.05, unit: "mg/kg", perKg: true, route: "IV/IO/ET", maxDose: "2 mg", label: "Organophosphate", notes: "Repeat every 5–10 min until secretions dry; may need very large doses" },
    ],
    warnings: ["MINIMUM dose 0.1 mg — smaller doses may worsen bradycardia (vagotonic effect)", "PALS 2025: Not routinely recommended for asystole"],
    formulations: ["0.1 mg/mL", "0.4 mg/mL", "1 mg/mL"],
    monitoring: ["HR, rhythm, secretions"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "adenosine",
    name: "Adenosine",
    category: "emergency",
    indications: ["SVT (Supraventricular Tachycardia)"],
    doses: [
      { value: 0.1, unit: "mg/kg", perKg: true, route: "IV rapid push + saline flush", maxDose: "6 mg", label: "1st Dose", notes: "Use most proximal IV; immediate rapid NS flush 5–10 mL", adultMaxDose_num: 6 },
      { value: 0.2, unit: "mg/kg", perKg: true, route: "IV rapid push + saline flush", maxDose: "12 mg", label: "2nd Dose", notes: "If 1st dose ineffective; wait 1–2 min", adultMaxDose_num: 12 },
    ],
    warnings: ["PALS 2025: Do NOT use for irregular wide-complex tachycardia", "May cause transient AV block, asystole — warn patient", "Ineffective with caffeine (competitive antagonist)"],
    formulations: ["3 mg/mL (2 mL vial)"],
    monitoring: ["Continuous ECG during and after administration"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "amiodarone",
    name: "Amiodarone",
    category: "emergency",
    highAlert: true,
    indications: ["Pulseless VT/VF refractory to defibrillation", "Hemodynamically stable VT", "Atrial fibrillation"],
    doses: [
      { value: 5, unit: "mg/kg", perKg: true, route: "IV/IO bolus", maxDose: "300 mg", label: "Pulseless VT/VF", notes: "PALS 2025: Give rapidly; compatible with D5W only, NOT NS", adultMaxDose_num: 300 },
      { value: 5, unit: "mg/kg", perKg: true, route: "IV infusion over 20–60 min", maxDose: "300 mg per dose", label: "Stable VT/SVT", notes: "Infuse slowly to avoid hypotension; max 15 mg/kg/day", adultMaxDose_num: 300 },
    ],
    warnings: ["Dilute in D5W ONLY — precipitates in NS", "Hypotension with rapid infusion", "QT prolongation — monitor ECG", "PALS 2025 preferred over lidocaine for shock-refractory VF/pVT"],
    formulations: ["50 mg/mL (3 mL amp)"],
    monitoring: ["ECG, BP every 5 min during infusion", "LFTs, TFTs with prolonged use"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "lidocaine",
    name: "Lidocaine",
    category: "emergency",
    highAlert: true,
    indications: ["Pulseless VT/VF (alternative to amiodarone)", "Ventricular arrhythmias"],
    doses: [
      { value: 1, unit: "mg/kg", perKg: true, route: "IV/IO", maxDose: "100 mg", label: "Loading dose", notes: "PALS 2025: Alternative if amiodarone unavailable" },
      { min: 20, max: 50, unit: "mcg/kg/min", perKg: true, route: "IV infusion", label: "Maintenance", notes: "= 1.2–3 mg/kg/hr" },
    ],
    warnings: ["Reduce dose 50% in hepatic impairment", "Toxicity: seizures, arrhythmia"],
    formulations: ["10 mg/mL (1%)", "20 mg/mL (2%)"],
    reference: "PALS 2025",
  },
  {
    id: "sodium-bicarbonate",
    name: "Sodium Bicarbonate",
    category: "emergency",
    indications: ["Severe metabolic acidosis (pH < 7.1)", "Hyperkalemia with ECG changes", "TCA overdose", "Sodium channel blocker poisoning"],
    doses: [
      { value: 1, unit: "mEq/kg", perKg: true, route: "IV slow push", maxDose: "50 mEq", label: "Acute correction", notes: "Infuse over 5–10 min; may repeat based on blood gas", adultMaxDose_num: 50 },
    ],
    warnings: ["WHO 2024: Only after securing airway — worsens intracellular acidosis in respiratory acidosis", "Hyperosmolarity, hypernatremia", "Neonates: use 4.2% (0.5 mEq/mL) to avoid IVH"],
    formulations: ["4.2% (0.5 mEq/mL) — neonates", "8.4% (1 mEq/mL) — infants/children"],
    monitoring: ["Blood gas 15–30 min after each dose", "Serum sodium"],
    reference: "Harriet Lane 23e | WHO Formulary 2024",
  },
  {
    id: "calcium-gluconate",
    name: "Calcium Gluconate",
    category: "emergency",
    indications: ["Symptomatic hypocalcemia", "Hyperkalemia with ECG changes", "Hypermagnesemia", "Calcium channel blocker overdose"],
    doses: [
      { min: 100, max: 200, unit: "mg/kg", perKg: true, route: "IV over 5–10 min", maxDose: "2000 mg (2 g)", label: "Acute hypocalcemia/hyperkalemia", notes: "10% solution (100 mg/mL); cardiac monitoring required" },
    ],
    warnings: ["NEVER give by IV push — fatal bradycardia/asystole", "Incompatible with bicarbonate (precipitates)", "Tissue necrosis with extravasation (use central line if possible)"],
    formulations: ["100 mg/mL (10% solution)"],
    monitoring: ["Continuous ECG during infusion", "Serum calcium after"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "dextrose",
    name: "Dextrose (Glucose)",
    category: "emergency",
    indications: ["Hypoglycemia (glucose < 2.6 mmol/L or < 47 mg/dL)"],
    doses: [
      { min: 2, max: 4, unit: "mL/kg of D10", perKg: true, route: "IV", label: "Neonates (D10 preferred)", notes: "= 0.2–0.4 g/kg; follow with D10W maintenance infusion" },
      { min: 2, max: 4, unit: "mL/kg of D25", perKg: true, route: "IV", label: "Infants / Children", notes: "= 0.5–1 g/kg; max 25 mL D25W" },
    ],
    warnings: ["WHO 2024: D10 preferred in neonates to prevent hyperglycemia and brain injury", "Avoid D50 in children < 12 years"],
    formulations: ["D10W (100 mg/mL)", "D25W (250 mg/mL)", "D50W (500 mg/mL)"],
    monitoring: ["Glucose check 15 min after treatment", "Repeat until glucose > 3.5 mmol/L"],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "naloxone",
    name: "Naloxone",
    genericName: "Narcan",
    category: "emergency",
    indications: ["Opioid overdose/respiratory depression"],
    doses: [
      { value: 0.01, unit: "mg/kg", perKg: true, route: "IV/IM/SC/IN", maxDose: "0.4 mg (child), 2 mg (adolescent)", frequency: "Repeat every 2–3 min", label: "Standard reversal", notes: "Intranasal: use 4 mg/mL IN (0.5 mL each nostril if < 5 kg)" },
      { min: 0.005, max: 0.02, unit: "mg/kg/hr", perKg: true, route: "IV infusion", label: "Continuous infusion", notes: "Use when short-acting naloxone needed repeatedly" },
    ],
    warnings: ["Short duration (30–90 min) — repeat doses often needed for long-acting opioids", "May precipitate acute opioid withdrawal, seizures"],
    formulations: ["0.4 mg/mL", "1 mg/mL", "4 mg/0.1 mL intranasal"],
    reference: "Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "flumazenil",
    name: "Flumazenil",
    category: "emergency",
    indications: ["Benzodiazepine reversal (diagnostic/procedural)"],
    doses: [
      { value: 0.01, unit: "mg/kg", perKg: true, route: "IV", maxDose: "0.2 mg per dose, 1 mg total", frequency: "Repeat every 1 min if needed", notes: "Duration 45–90 min — re-sedation common" },
    ],
    warnings: ["Contraindicated in chronic BZD users — seizure risk", "Do NOT use for TCA overdose"],
    formulations: ["0.1 mg/mL (10 mL vial)"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "magnesium-sulfate-emergency",
    name: "Magnesium Sulfate (Emergency)",
    category: "emergency",
    indications: ["Torsades de pointes", "Severe asthma", "Hypomagnesemia with symptoms"],
    doses: [
      { min: 25, max: 50, unit: "mg/kg", perKg: true, route: "IV over 10–20 min", maxDose: "2000 mg (2 g)", label: "Torsades / Severe asthma", notes: "Faster push for Torsades (over 1–2 min); calcium gluconate is antidote" },
    ],
    warnings: ["Hypotension with rapid infusion", "Respiratory depression at toxic levels", "Have calcium gluconate ready"],
    formulations: ["500 mg/mL (50%)", "200 mg/mL (20%)"],
    monitoring: ["Reflexes, RR, BP", "Serum Mg target 2–3.5 mmol/L"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  ANALGESICS
  // ════════════════════════════════════════════════════════════
  {
    id: "morphine",
    name: "Morphine",
    category: "analgesic",
    indications: ["Severe acute pain", "Post-operative analgesia", "Dyspnea in palliative care"],
    doses: [
      { min: 0.05, max: 0.1, unit: "mg/kg", perKg: true, route: "IV over 5 min", maxDose: "5 mg", frequency: "Every 2–4 hr", label: "IV bolus", adultMaxDose_num: 5 },
      { min: 0.1, max: 0.3, unit: "mg/kg", perKg: true, route: "PO/SC", maxDose: "15 mg", frequency: "Every 4 hr", label: "Oral / Subcutaneous" },
      { min: 0.01, max: 0.04, unit: "mg/kg/hr", perKg: true, route: "IV infusion", label: "Continuous infusion", notes: "Start low, titrate; neonates start at 0.005–0.01 mg/kg/hr" },
    ],
    warnings: ["Respiratory depression — have naloxone available", "Active metabolite (M6G) accumulates in renal failure — use fentanyl instead", "Histamine release — use fentanyl if hemodynamically unstable"],
    formulations: ["1 mg/mL", "5 mg/mL", "10 mg/mL oral solution", "10 mg/mL injection"],
    renalAdjustment: [
      { gfr: "30–50 mL/min/1.73m²", adjustment: "Reduce dose by 25%; increase interval to every 6 hr" },
      { gfr: "10–30 mL/min/1.73m²", adjustment: "Reduce dose by 50%; use every 6–8 hr; avoid M6G accumulation" },
      { gfr: "< 10 mL/min/1.73m²", adjustment: "AVOID or use extreme caution — switch to fentanyl; M6G accumulates and causes prolonged CNS/respiratory depression" },
    ],
    monitoring: ["Pain score, RR, SpO₂, sedation level"],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "fentanyl",
    name: "Fentanyl",
    category: "analgesic",
    indications: ["Severe acute pain", "Procedural analgesia", "Ventilated ICU patients", "Hemodynamically unstable patients (preferred over morphine)"],
    doses: [
      { min: 1, max: 2, unit: "mcg/kg", perKg: true, route: "IV over 3–5 min", maxDose: "100 mcg", frequency: "Every 1–2 hr", label: "IV bolus", adultMaxDose_num: 100 },
      { min: 1, max: 5, unit: "mcg/kg/hr", perKg: true, route: "IV infusion", label: "Continuous infusion", notes: "Ventilated: 1–5 mcg/kg/hr; adjust for tolerance" },
      { min: 10, max: 15, unit: "mcg/kg", perKg: true, route: "IN (intranasal)", maxDose: "200 mcg", label: "Intranasal", notes: "Use atomiser device; max 0.5 mL per nostril" },
    ],
    warnings: ["Rigid chest syndrome with rapid high-dose bolus — have muscle relaxant ready", "100× more potent than morphine", "Accumulation with prolonged infusion (lipophilic)"],
    formulations: ["50 mcg/mL (0.05 mg/mL) in 2 mL and 10 mL vials"],
    renalAdjustment: [
      { gfr: "< 10 mL/min/1.73m²", adjustment: "PREFERRED opioid in renal failure — no active metabolite accumulation; may need dose reduction 25–50% with prolonged use" },
    ],
    monitoring: ["RR, SpO₂, pain score, sedation score (COMFORT-B or FLACC)"],
    reference: "Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "ketamine-analgesic",
    name: "Ketamine (Analgesic/Sedation)",
    category: "analgesic",
    indications: ["Procedural sedation", "Sub-dissociative analgesia", "Burns dressing changes", "RSI induction", "Refractory status epilepticus"],
    doses: [
      { min: 0.1, max: 0.5, unit: "mg/kg", perKg: true, route: "IV slow push", label: "Sub-dissociative (analgesia)", notes: "Does not cause loss of consciousness at this dose" },
      { min: 1, max: 2, unit: "mg/kg", perKg: true, route: "IV over 60 sec", maxDose: "200 mg", label: "Procedural sedation / RSI", notes: "Onset 30–60 sec; duration 10–15 min", adultMaxDose_num: 200 },
      { min: 4, max: 5, unit: "mg/kg", perKg: true, route: "IM", maxDose: "500 mg", label: "IM sedation", notes: "Onset 3–5 min; duration 15–30 min" },
      { min: 0.5, max: 2, unit: "mg/kg/hr", perKg: true, route: "IV infusion", label: "ICU analgosedation", notes: "Combine with benzodiazepine for ICU use" },
    ],
    warnings: ["Increases oral secretions — consider glycopyrrolate 0.005 mg/kg IV pre-treatment", "Emergence reactions — consider midazolam 0.05 mg/kg IV", "Relative contraindication: elevated ICP, severe hypertension, active psychosis"],
    formulations: ["10 mg/mL (vials)", "50 mg/mL (vials)", "100 mg/mL (vials)"],
    renalAdjustment: [
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Use with caution; norketamine metabolite may accumulate; no specific dose adjustment required for single doses" },
    ],
    monitoring: ["BP, HR, SpO₂, emergence reactions"],
    reference: "Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "paracetamol",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    category: "analgesic",
    indications: ["Mild–moderate pain", "Fever", "Adjunct analgesia (opioid-sparing)"],
    doses: [
      { min: 10, max: 15, unit: "mg/kg", perKg: true, route: "IV over 15 min", maxDose: "1000 mg", frequency: "Every 4–6 hr (max 4 doses/day)", label: "IV" },
      { min: 15, max: 20, unit: "mg/kg", perKg: true, route: "PO", maxDose: "1000 mg", frequency: "Every 4–6 hr", label: "Oral", notes: "Max daily: 75 mg/kg or 4 g (whichever less)" },
      { min: 20, max: 30, unit: "mg/kg", perKg: true, route: "PR (rectal)", maxDose: "1000 mg", frequency: "Every 6–8 hr", label: "Rectal (loading dose 30 mg/kg then 20 mg/kg)" },
    ],
    warnings: ["Hepatotoxicity in overdose — N-acetylcysteine antidote", "Reduce dose in hepatic impairment", "WHO 2024: Safe in renal impairment but use minimum effective dose"],
    formulations: ["10 mg/mL IV infusion (100 mL)", "120 mg/5 mL syrup", "250 mg/5 mL syrup", "500 mg tablets"],
    renalAdjustment: [
      { gfr: "10–50 mL/min/1.73m²", adjustment: "Increase dosing interval to every 6 hr" },
      { gfr: "< 10 mL/min/1.73m²", adjustment: "Increase interval to every 8 hr; no dose reduction needed" },
    ],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "analgesic",
    indications: ["Mild–moderate pain", "Fever", "Inflammatory conditions", "Patent ductus arteriosus closure"],
    doses: [
      { min: 5, max: 10, unit: "mg/kg", perKg: true, route: "PO", maxDose: "400 mg", frequency: "Every 6–8 hr (max 40 mg/kg/day)", label: "Oral analgesic/antipyretic" },
    ],
    contraindications: ["Renal impairment (GFR < 30)", "Active GI bleed", "Dehydration/hypovolemia", "< 3 months age", "Platelet dysfunction", "NSAIDs hypersensitivity"],
    warnings: ["WHO 2024: Avoid in dehydrated children — risk of acute kidney injury", "Avoid concomitant use with other NSAIDs or corticosteroids"],
    formulations: ["100 mg/5 mL suspension", "200 mg tablets", "400 mg tablets"],
    renalAdjustment: [
      { gfr: "30–50 mL/min/1.73m²", adjustment: "Use with extreme caution; reduce dose and ensure adequate hydration" },
      { gfr: "< 30 mL/min/1.73m²", adjustment: "AVOID — risk of acute kidney injury, fluid retention, hyperkalemia" },
    ],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "tramadol",
    name: "Tramadol",
    category: "analgesic",
    indications: ["Moderate pain (when simple analgesics insufficient)"],
    doses: [
      { min: 1, max: 2, unit: "mg/kg", perKg: true, route: "IV over 15 min / PO", maxDose: "100 mg", frequency: "Every 4–6 hr (max 400 mg/day)", label: "IV / Oral" },
    ],
    warnings: ["WHO 2024: Avoid in children < 12 years for pain", "Seizure threshold lowered", "Serotonin syndrome risk with SSRIs", "CYP2D6 ultra-metabolizers — risk of respiratory depression"],
    formulations: ["50 mg/mL injection (2 mL amp)", "50 mg capsules", "100 mg SR tablets"],
    renalAdjustment: [
      { gfr: "30–50 mL/min/1.73m²", adjustment: "Reduce dose by 25%; increase interval to every 8 hr" },
      { gfr: "< 30 mL/min/1.73m²", adjustment: "AVOID or use with extreme caution; halve dose and give every 12 hr maximum" },
    ],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  SEDATIVES
  // ════════════════════════════════════════════════════════════
  {
    id: "midazolam",
    name: "Midazolam",
    genericName: "Versed",
    category: "sedative",
    indications: ["Procedural sedation", "Status epilepticus", "ICU sedation", "Pre-medication"],
    doses: [
      { min: 0.05, max: 0.1, unit: "mg/kg", perKg: true, route: "IV over 2 min", maxDose: "5 mg", label: "IV procedural sedation", adultMaxDose_num: 5 },
      { min: 0.2, max: 0.3, unit: "mg/kg", perKg: true, route: "Intranasal (atomiser)", maxDose: "10 mg", label: "IN seizure/sedation", notes: "0.3 mg/kg IN for acute seizures (PALS 2025)", adultMaxDose_num: 10 },
      { min: 0.3, max: 0.5, unit: "mg/kg", perKg: true, route: "PO/Buccal", maxDose: "20 mg", label: "Buccal / Oral pre-medication" },
      { min: 0.05, max: 0.2, unit: "mg/kg/hr", perKg: true, route: "IV infusion", label: "ICU sedation infusion", notes: "Target RASS 0 to −2 for light sedation per PICU protocol" },
    ],
    warnings: ["Respiratory depression — monitor SpO₂", "Paradoxical agitation (especially toddlers)", "PALS 2025: IN midazolam 0.2 mg/kg equivalent to IV lorazepam for first-line seizures"],
    formulations: ["1 mg/mL (5 mL)", "5 mg/mL (2 mL, 10 mL)"],
    renalAdjustment: [
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Reduce dose by 25–50%; active metabolite (1-OH-midazolam) accumulates — risk of prolonged sedation" },
    ],
    monitoring: ["SpO₂, RR, RASS/Comfort-B score, BP"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "dexmedetomidine",
    name: "Dexmedetomidine",
    genericName: "Precedex",
    category: "sedative",
    indications: ["ICU sedation (cooperative sedation)", "Procedural sedation", "Opioid/benzodiazepine weaning", "Non-intubated procedural sedation"],
    doses: [
      { min: 0.2, max: 1.5, unit: "mcg/kg/hr", perKg: true, route: "IV infusion", label: "ICU sedation", notes: "Start at 0.2–0.4 mcg/kg/hr; titrate every 30 min; no loading dose recommended in hemodynamically unstable" },
      { min: 0.5, max: 1.0, unit: "mcg/kg", perKg: true, route: "IV over 10 min (loading)", maxDose: "40 mcg", label: "Loading dose (stable patients only)", notes: "Omit if hypotensive" },
    ],
    warnings: ["Bradycardia, hypotension — monitor closely, especially loading dose", "Does not provide seizure prophylaxis", "No respiratory depression (advantage over BZD/opioids)"],
    formulations: ["200 mcg/2 mL (100 mcg/mL) — dilute to 4–8 mcg/mL for infusion"],
    renalAdjustment: [
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Start at lower end (0.2 mcg/kg/hr); metabolites may accumulate — titrate carefully" },
    ],
    monitoring: ["HR, BP every 30 min", "Sedation score (RASS/Comfort-B)"],
    reference: "Harriet Lane 23e | SCCM PADIS 2024",
  },
  {
    id: "propofol",
    name: "Propofol",
    category: "sedative",
    indications: ["Anesthesia induction", "Procedural sedation", "ICU sedation (> 3 years, short-term)"],
    doses: [
      { min: 1, max: 2.5, unit: "mg/kg", perKg: true, route: "IV slowly", label: "Induction", notes: "Titrate 40 mg every 10 sec until induction" },
      { min: 1, max: 4, unit: "mg/kg/hr", perKg: true, route: "IV infusion", label: "Sedation", notes: "PICU: max 48 hr; max 4 mg/kg/hr; daily check for PRIS signs" },
    ],
    warnings: ["PROPOFOL INFUSION SYNDROME (PRIS): > 4 mg/kg/hr or > 48 hr — metabolic acidosis, rhabdomyolysis, cardiac failure", "CONTRAINDICATED in < 1 month", "Avoid in egg/soy allergy", "Pain on injection — pre-treat with lidocaine"],
    formulations: ["10 mg/mL (1%) emulsion"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "No dose adjustment needed; however monitor acid-base balance as PRIS mimics lactic acidosis" },
    ],
    monitoring: ["CK, lactate, TG daily if prolonged use", "ECG for new RBBB/ST changes (early PRIS sign)"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "chloral-hydrate",
    name: "Chloral Hydrate",
    category: "sedative",
    indications: ["Procedural sedation for imaging (MRI, EEG)", "Short-term sedation (< 4 years)"],
    doses: [
      { min: 50, max: 100, unit: "mg/kg", perKg: true, route: "PO / PR", maxDose: "2000 mg", label: "Standard sedation dose", notes: "Usual: 75 mg/kg; onset 30–60 min; effect 1–4 hr" },
    ],
    warnings: ["Respiratory depression — have airway equipment ready", "Avoid in hepatic/renal impairment", "Avoid in neonates (accumulation of trichloroethanol metabolite)"],
    formulations: ["500 mg/5 mL syrup"],
    renalAdjustment: [
      { gfr: "< 50 mL/min/1.73m²", adjustment: "AVOID — trichloroethanol metabolite accumulates; use alternative agent" },
    ],
    reference: "Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  NMBDs / RSI DRUGS
  // ════════════════════════════════════════════════════════════
  {
    id: "suxamethonium",
    name: "Suxamethonium",
    genericName: "Succinylcholine — Scoline / Kinz",
    category: "nmbd",
    indications: ["Rapid sequence intubation (RSI) — 1st choice for short procedure", "Laryngospasm", "Emergency intubation requiring rapid onset"],
    doses: [
      { value: 1.5, unit: "mg/kg", perKg: true, route: "IV", maxDose: "150 mg", label: "RSI — Children (IV)", notes: "Onset 30–60 sec; duration 4–6 min. PALS 2025: 1.5–2 mg/kg for RSI." },
      { value: 2, unit: "mg/kg", perKg: true, route: "IV", maxDose: "200 mg", label: "RSI — Neonates / Infants", notes: "Higher dose needed in infants due to larger Vd" },
      { value: 4, unit: "mg/kg", perKg: true, route: "IM", maxDose: "150 mg", label: "IM (no IV access)", notes: "Onset 3–4 min IM; use only if IV/IO unavailable" },
    ],
    contraindications: [
      "Hyperkalemia (K⁺ > 5.5 mEq/L) — causes 0.5–1 mEq/L K⁺ rise → fatal cardiac arrest",
      "Crush injury / burns (> 24 hr onset) — risk of massive hyperkalemia",
      "Denervation injury / prolonged immobility (> 5 days)",
      "Malignant hyperthermia susceptibility or family history",
      "Personal or family history of myopathy",
      "Acute rhabdomyolysis",
    ],
    warnings: [
      "⚠️ AVOID in crush injury, burns after 24 hr, prolonged ICU immobility — fatal hyperkalemia",
      "Bradycardia (especially 2nd dose / children < 5 yr) — pre-treat with atropine 0.02 mg/kg IV",
      "Malignant hyperthermia trigger — have dantrolene available",
      "Pseudocholinesterase deficiency — prolonged block (hours) — support ventilation",
      "PALS 2025: Rocuronium 1.2 mg/kg + sugammadex preferred if succinylcholine contraindicated",
    ],
    formulations: ["50 mg/mL (2 mL amp = 100 mg)", "20 mg/mL multi-dose vial"],
    monitoring: ["SpO₂, HR, ETCO₂, train-of-four (TOF) for repeat dosing"],
    reference: "PALS 2025 | Harriet Lane 23e | Miller's Anesthesia",
  },
  {
    id: "ketamine-rsi",
    name: "Ketamine (RSI / Induction)",
    genericName: "Kinz — RSI induction agent",
    category: "nmbd",
    indications: ["RSI induction (hemodynamically unstable patients)", "Procedural sedation induction", "Status asthmaticus with intubation"],
    doses: [
      { min: 1, max: 2, unit: "mg/kg", perKg: true, route: "IV over 30–60 sec", maxDose: "200 mg", label: "RSI induction — standard", notes: "Onset 30–60 sec; duration 5–10 min. Preferred in shock/bronchospasm." },
      { min: 1.5, max: 2, unit: "mg/kg", perKg: true, route: "IV", label: "Status asthmaticus with impending respiratory failure", notes: "Bronchodilatory and induction combined — ideal in severe asthma" },
      { min: 4, max: 6, unit: "mg/kg", perKg: true, route: "IM", maxDose: "500 mg", label: "IM induction (no IV access)", notes: "Onset 3–5 min; use when IV/IO not feasible" },
    ],
    warnings: [
      "Increases secretions — give glycopyrrolate 0.005 mg/kg IV (or atropine) before",
      "Emergence agitation — can give midazolam 0.05 mg/kg to reduce",
      "Use cautiously if elevated ICP suspected (avoid in isolated head trauma without hypotension)",
      "PALS 2025: Ketamine is the preferred induction agent in hemodynamically unstable children",
    ],
    formulations: ["10 mg/mL (20 mL vial)", "50 mg/mL (10 mL vial)", "100 mg/mL (10 mL vial)"],
    monitoring: ["BP, HR, SpO₂, airway secretions"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "rocuronium",
    name: "Rocuronium",
    genericName: "Esmeron",
    category: "nmbd",
    indications: ["RSI (preferred non-depolarizing NMBD)", "Neuromuscular blockade for intubation", "ICU paralysis for mechanical ventilation", "Status asthmaticus refractory to treatment"],
    doses: [
      { value: 1.2, unit: "mg/kg", perKg: true, route: "IV", maxDose: "120 mg", label: "RSI dose (high-dose)", notes: "Onset 60 sec at 1.2 mg/kg — equivalent to succinylcholine onset. Reversible with sugammadex 16 mg/kg." },
      { value: 0.6, unit: "mg/kg", perKg: true, route: "IV", maxDose: "60 mg", label: "Routine intubation dose", notes: "Onset 90–120 sec; duration 30–45 min. Sugammadex 4 mg/kg reversal." },
      { min: 0.1, max: 0.2, unit: "mg/kg", perKg: true, route: "IV", label: "Maintenance bolus", notes: "Give when TOF count 1–2 returns; usually every 20–30 min" },
      { min: 5, max: 12, unit: "mcg/kg/min", perKg: true, route: "IV infusion (ICU)", label: "Continuous ICU infusion", notes: "For refractory bronchospasm, ARDS prone positioning, ICP management" },
    ],
    warnings: [
      "REVERSAL MANDATORY: Sugammadex 16 mg/kg (RSI dose) or 4 mg/kg (routine) — have at bedside",
      "No analgesic or sedative effect — MUST give adequate sedation/analgesia before paralysis",
      "Awareness under paralysis — confirm deep sedation (RASS −4 or −5) before/during paralysis",
      "Prolonged block with hepatic failure (rocuronium is hepatically metabolised)",
    ],
    formulations: ["10 mg/mL (5 mL vial = 50 mg)", "10 mg/mL (10 mL vial = 100 mg)"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "Primarily hepatic metabolism — no renal dose adjustment. Severe hepatic impairment: prolonged duration, reduce maintenance dose by 30–50%" },
    ],
    monitoring: ["Train-of-four (TOF) monitoring — target 0–1/4 twitches during ICU paralysis", "Sedation level (BIS if available)", "ETCO₂, airway pressures"],
    reference: "PALS 2025 | Harriet Lane 23e | Miller's Anesthesia",
  },
  {
    id: "atracurium",
    name: "Atracurium",
    genericName: "Tracrium",
    category: "nmbd",
    indications: ["Neuromuscular blockade for intubation", "ICU mechanical ventilation paralysis", "Preferred in hepatic/renal failure (Hofmann elimination)"],
    doses: [
      { min: 0.3, max: 0.6, unit: "mg/kg", perKg: true, route: "IV over 30–60 sec", maxDose: "60 mg", label: "Intubation / bolus", notes: "Standard: 0.5 mg/kg. Onset 2–3 min; duration 20–35 min." },
      { min: 0.1, max: 0.2, unit: "mg/kg", perKg: true, route: "IV", frequency: "Every 15–25 min as needed", label: "Maintenance bolus" },
      { min: 5, max: 10, unit: "mcg/kg/min", perKg: true, route: "IV infusion", label: "ICU continuous infusion", notes: "Start at 5–9 mcg/kg/min; titrate by TOF monitoring" },
    ],
    warnings: [
      "Laudanosine metabolite can accumulate in hepatic failure and cause seizures — monitor",
      "Histamine release with rapid injection — inject slowly over 60 sec; bronchospasm/hypotension possible",
      "No reversal agent (neostigmine only partial) — allow spontaneous recovery or use TOF monitoring",
      "No analgesic or sedative effect — ensure adequate sedation before paralysis",
      "Advantage: Hofmann elimination — safe in severe renal AND hepatic failure",
    ],
    formulations: ["10 mg/mL (2.5 mL = 25 mg amp)", "10 mg/mL (5 mL = 50 mg vial)"],
    renalAdjustment: [
      { gfr: "Any (including dialysis)", adjustment: "No dose adjustment needed — Hofmann elimination is spontaneous (pH/temperature-dependent), not organ-dependent. Preferred NMBD in multi-organ failure." },
    ],
    monitoring: ["TOF monitoring (target 0–1/4 twitch for ICU paralysis)", "Temperature and pH (affect Hofmann elimination rate)", "Laudanosine levels if prolonged use > 72 hr (reference lab)"],
    reference: "Harriet Lane 23e | Miller's Anesthesia",
  },
  {
    id: "cisatracurium",
    name: "Cisatracurium",
    genericName: "Nimbex",
    category: "nmbd",
    indications: ["ICU mechanical ventilation (preferred NMBD in ARDS)", "Neuromuscular blockade in hepatic/renal failure", "ARDS early paralysis (ACURASYS protocol)"],
    doses: [
      { min: 0.1, max: 0.2, unit: "mg/kg", perKg: true, route: "IV", maxDose: "20 mg", label: "Intubation bolus", notes: "Onset 3–5 min; duration 40–75 min. Slower onset than atracurium — NOT for RSI." },
      { value: 0.1, unit: "mg/kg", perKg: true, route: "IV", frequency: "Every 20–40 min", label: "Maintenance bolus" },
      { min: 1, max: 3, unit: "mcg/kg/min", perKg: true, route: "IV infusion", label: "ICU continuous infusion (ARDS)", notes: "ACURASYS: 37.5 mcg/kg/hr = ~0.625 mcg/kg/min × 48 hr in early ARDS. Typical 1–3 mcg/kg/min." },
    ],
    warnings: [
      "NOT suitable for RSI — onset too slow (3–5 min)",
      "Much less histamine release than atracurium — preferred in asthma/haemodynamic instability",
      "No analgesic or sedative effect — mandatory sedation/analgesia during paralysis",
      "Laudanosine accumulates less than atracurium (cisatracurium produces 5× less laudanosine)",
      "ACURASYS trial: 48 hr cisatracurium infusion in moderate-severe ARDS reduces 90-day mortality",
    ],
    formulations: ["2 mg/mL (10 mL vial = 20 mg)", "2 mg/mL (20 mL vial = 40 mg)"],
    renalAdjustment: [
      { gfr: "Any (including dialysis)", adjustment: "No dose adjustment — Hofmann elimination. PREFERRED NMBD for ICU patients with multi-organ failure (less laudanosine than atracurium)." },
    ],
    monitoring: ["TOF monitoring (target 0/4 for ARDS protocol)", "Sedation depth (RASS −4 to −5 during paralysis)", "Spontaneous breathing efforts during ARDS paralysis"],
    reference: "Harriet Lane 23e | ACURASYS Trial | PALICC 2023",
  },
  {
    id: "vecuronium",
    name: "Vecuronium",
    genericName: "Norcuron",
    category: "nmbd",
    indications: ["Intubation and neuromuscular blockade", "ICU paralysis (intermediate duration)", "Cardiovascular stability required (no histamine release)"],
    doses: [
      { min: 0.1, max: 0.2, unit: "mg/kg", perKg: true, route: "IV", maxDose: "20 mg", label: "Intubation bolus", notes: "Onset 2–3 min; duration 25–40 min. No cardiovascular effects." },
      { min: 0.05, max: 0.1, unit: "mg/kg", perKg: true, route: "IV", frequency: "Every 20–35 min", label: "Maintenance bolus" },
      { min: 0.8, max: 1.2, unit: "mcg/kg/min", perKg: true, route: "IV infusion", label: "Continuous infusion", notes: "Titrate by TOF monitoring; tolerance develops — may need dose increase" },
    ],
    warnings: [
      "Active 3-desacetyl metabolite accumulates in renal failure — prolonged block",
      "No histamine release — preferred when haemodynamic stability needed",
      "No analgesic or sedative effect — ensure adequate analgosedation",
    ],
    formulations: ["4 mg/vial (lyophilised — reconstitute with 2 mL WFI = 2 mg/mL)", "10 mg/vial"],
    renalAdjustment: [
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Prolonged block — active 3-OH metabolite accumulates. Use atracurium or cisatracurium instead in severe renal failure." },
    ],
    monitoring: ["TOF monitoring mandatory in ICU", "Duration prolonged in renal/hepatic failure"],
    reference: "Harriet Lane 23e | Miller's Anesthesia",
  },
  {
    id: "sugammadex",
    name: "Sugammadex",
    genericName: "Bridion — Rocuronium/Vecuronium reversal",
    category: "nmbd",
    indications: ["Reversal of rocuronium or vecuronium blockade", "Immediate reversal after RSI dose rocuronium (can't intubate, can't oxygenate — CICO)"],
    doses: [
      { value: 2, unit: "mg/kg", perKg: true, route: "IV", maxDose: "200 mg", label: "Routine reversal (TOF count ≥ 2)", notes: "Give when TOF count returns to 2/4. Full reversal in 3 min." },
      { value: 4, unit: "mg/kg", perKg: true, route: "IV", maxDose: "400 mg", label: "Deep block reversal (TOF count 1 or PTC 1–2)", notes: "Use when TOF count = 1 or Post-tetanic count 1–2." },
      { value: 16, unit: "mg/kg", perKg: true, route: "IV rapid bolus", maxDose: "1600 mg", label: "EMERGENCY reversal (CICO after RSI rocuronium)", notes: "PALS 2025: 16 mg/kg IV STAT for cannot intubate/cannot oxygenate (CICO) scenario. Full reversal in 3 min." },
    ],
    warnings: [
      "ONLY reverses rocuronium and vecuronium — NO effect on succinylcholine, atracurium, cisatracurium",
      "Re-curarisation possible if inadequate dose — confirm TOF ratio ≥ 0.9 before extubation",
      "Anaphylaxis (0.3%) — have epinephrine available",
      "Binds oral contraceptives — advise additional contraception for 7 days",
    ],
    formulations: ["200 mg/2 mL (100 mg/mL) vials"],
    renalAdjustment: [
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Use with caution — sugammadex-rocuronium complex may accumulate; however reversal still effective. Avoid re-dosing within 24 hr." },
    ],
    monitoring: ["TOF monitoring before and after reversal", "SpO₂, RR after reversal"],
    reference: "PALS 2025 | Harriet Lane 23e | Miller's Anesthesia",
  },
  {
    id: "neostigmine",
    name: "Neostigmine",
    genericName: "Prostigmin — with glycopyrrolate",
    category: "nmbd",
    indications: ["Reversal of non-depolarizing NMBDs (atracurium, vecuronium, rocuronium)", "Myasthenia gravis treatment"],
    doses: [
      { min: 0.05, max: 0.07, unit: "mg/kg", perKg: true, route: "IV over 1–2 min", maxDose: "5 mg", label: "NMBD reversal", notes: "Always give WITH glycopyrrolate 0.01 mg/kg IV (or atropine 0.02 mg/kg) to prevent bradycardia. Only effective if TOF ≥ 2/4." },
    ],
    warnings: [
      "ALWAYS co-administer with glycopyrrolate or atropine — bradycardia/asystole risk",
      "Only partially reverses deep block (TOF 0/4) — use sugammadex for deep vecuronium/rocuronium block",
      "Ineffective against succinylcholine — may prolong phase II block",
      "Bronchospasm risk — use glycopyrrolate (not atropine) in asthmatic patients",
    ],
    formulations: ["0.5 mg/mL (1 mL amp)", "2.5 mg/mL (1 mL amp)"],
    reference: "Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  INOTROPES / VASOPRESSORS
  // ════════════════════════════════════════════════════════════
  {
    id: "dopamine",
    name: "Dopamine",
    category: "inotrope",
    indications: ["Cardiogenic shock", "Septic shock (2nd line)", "Symptomatic bradycardia (refractory to atropine)"],
    doses: [
      { min: 2, max: 5, unit: "mic/kg/min", perKg: true, route: "IV infusion (Central preferred)", label: "Renal / Mesenteric (low dose)", notes: "PALS 2025: 'Renal dose' concept no longer supported — this range has inotropic effect" },
      { min: 5, max: 10, unit: "mic/kg/min", perKg: true, route: "IV infusion (Central preferred)", label: "Inotropic dose", notes: "Increases cardiac output; β1-adrenergic effect dominant" },
      { min: 10, max: 20, unit: "mic/kg/min", perKg: true, route: "IV infusion (Central line)", label: "Vasopressor dose", notes: "α1-adrenergic; consider adding norepinephrine for vasopressor effect" },
    ],
    warnings: ["PALS 2025: Norepinephrine preferred over dopamine for septic shock in children", "Central line MANDATORY at > 10 mcg/kg/min", "Tissue necrosis with extravasation — use phentolamine 5 mg/5 mL NS if extravasated"],
    formulations: ["40 mg/mL (5 mL)", "160 mg/mL (5 mL)"],
    monitoring: ["HR, BP, cardiac rhythm, urine output every 15–30 min", "Peripheral perfusion"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "dobutamine",
    name: "Dobutamine",
    category: "inotrope",
    indications: ["Cardiogenic shock", "Low cardiac output syndrome (post-cardiac surgery)", "Septic shock with myocardial dysfunction"],
    doses: [
      { min: 2, max: 20, unit: "mic/kg/min", perKg: true, route: "IV infusion", label: "Inotropic support", notes: "Start at 5 mic/kg/min; titrate to hemodynamic response; max 40 mic/kg/min reported" },
    ],
    warnings: ["May worsen hypotension (vasodilatory) — use with vasopressor if MAP low", "Tachycardia and arrhythmias at high doses", "NOT a vasopressor — no vasoconstrictive effect"],
    formulations: ["12.5 mg/mL (20 mL vial)"],
    monitoring: ["Cardiac output, SvO₂, HR, BP, lactate"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "norepinephrine",
    name: "Norepinephrine",
    genericName: "Noradrenaline",
    category: "inotrope",
    indications: ["Vasodilatory/distributive shock (first-line)", "Septic shock", "Anaphylaxis (after epinephrine)"],
    doses: [
      { min: 0.01, max: 2.0, unit: "mic/kg/min", perKg: true, route: "IV infusion (Central line)", label: "Vasopressor", notes: "PALS 2025: First-line vasopressor for fluid-refractory septic shock; start 0.05–0.1 mic/kg/min" },
    ],
    warnings: ["MANDATORY central line — significant necrosis risk with peripheral extravasation", "PALS 2025: Higher doses (> 1 mcg/kg/min) signal need for additional agents or ECMO consideration"],
    formulations: ["1 mg/mL (4 mL amp)", "4 mg/mL concentrate"],
    monitoring: ["Invasive arterial BP preferred", "Peripheral circulation, urine output, lactate clearance"],
    reference: "PALS 2025 | SSC Pediatric 2024",
  },
  {
    id: "epinephrine-infusion",
    name: "Epinephrine Infusion",
    genericName: "Adrenaline infusion",
    category: "inotrope",
    indications: ["Refractory septic shock", "Anaphylaxis (post-initial IM)", "Cardiogenic shock", "Post-cardiac arrest"],
    doses: [
      { min: 0.01, max: 1.0, unit: "mic/kg/min", perKg: true, route: "IV infusion (Central line)", label: "Inotrope / vasopressor", notes: "Low: 0.01–0.1 (inotropic); High: 0.1–1.0 (vasopressor/inotrope combined)" },
    ],
    warnings: ["Higher doses may increase myocardial oxygen demand and cause arrhythmias", "Monitor for hyperglycemia and hypokalemia at high doses"],
    formulations: ["1 mg/mL (1 mL amp) — dilute for infusion"],
    monitoring: ["Continuous ECG, invasive arterial BP, glucose, lactate"],
    reference: "PALS 2025 | SSC Pediatric 2024",
  },
  {
    id: "milrinone",
    name: "Milrinone",
    category: "inotrope",
    indications: ["Low cardiac output post-cardiac surgery", "Cardiomyopathy with high SVR", "Refractory heart failure"],
    doses: [
      { value: 50, unit: "mic/kg", perKg: true, route: "IV over 30–60 min (loading)", label: "Loading dose (optional)", notes: "OMIT loading dose if hypotensive — causes vasodilation" },
      { min: 0.25, max: 0.75, unit: "mic/kg/min", perKg: true, route: "IV infusion", label: "Maintenance infusion", notes: "Start 0.25 mic/kg/min; increase by 0.25 every 30 min; typical target 0.5 mic/kg/min" },
    ],
    warnings: ["Vasodilation and hypotension — withhold loading dose if MAP borderline", "PDE3 inhibitor (different mechanism from catecholamines — useful in catecholamine resistance)"],
    formulations: ["1 mg/mL (10 mL, 20 mL vials)"],
    renalAdjustment: [
      { gfr: "20–50 mL/min/1.73m²", adjustment: "Reduce infusion to 0.2 mcg/kg/min" },
      { gfr: "< 20 mL/min/1.73m²", adjustment: "Reduce infusion to 0.1–0.15 mcg/kg/min; milrinone renally cleared" },
    ],
    monitoring: ["Cardiac output monitoring, BP every 15 min", "UO, renal function"],
    reference: "Harriet Lane 23e | AHA Pediatric HF 2024",
  },
  {
    id: "vasopressin",
    name: "Vasopressin",
    category: "inotrope",
    indications: ["Refractory vasodilatory shock (catecholamine-resistant)", "Septic shock adjunct", "Post-cardiac surgery vasodilation"],
    doses: [
      { min: 0.0003, max: 0.002, unit: "units/kg/min", perKg: true, route: "IV infusion (Central)", label: "Vasopressor", notes: "Typical: 0.0005–0.001 units/kg/min; does NOT work in units/kg/min the same way — check weight-based carefully" },
    ],
    warnings: ["Mesenteric, digital ischemia at high doses", "Hyponatremia risk (antidiuretic effect)", "Not a pure vasopressor — also has V2 receptor antidiuretic effect"],
    formulations: ["20 units/mL (1 mL amp)"],
    monitoring: ["Serum sodium, UO, peripheral circulation (digital ischemia monitoring)"],
    reference: "SSC Pediatric 2024 | Harriet Lane 23e",
  },
  {
    id: "levosimendan",
    name: "Levosimendan",
    category: "inotrope",
    indications: ["Acute decompensated HF (catecholamine-independent)", "Low cardiac output refractory to conventional inotropes"],
    doses: [
      { min: 0.05, max: 0.2, unit: "mcg/kg/min", perKg: true, route: "IV infusion over 24 hr", label: "Continuous infusion", notes: "Loading dose 6–12 mcg/kg over 10 min (omit if hypotensive); effects last 7–9 days" },
    ],
    warnings: ["Hypotension — avoid loading dose in BP-unstable patients", "QTc prolongation"],
    formulations: ["2.5 mg/mL (5 mL vial)"],
    reference: "ESC Pediatric HF Guidelines 2024",
  },

  // ════════════════════════════════════════════════════════════
  //  ANTIBIOTICS
  // ════════════════════════════════════════════════════════════
  {
    id: "ampicillin",
    name: "Ampicillin",
    category: "antibiotic",
    indications: ["Neonatal sepsis (combined with gentamicin)", "Meningitis (Group B Strep, Listeria)", "Pneumonia (non-severe)"],
    doses: [
      { min: 50, max: 100, unit: "mg/kg/dose", perKg: true, route: "IV over 15–30 min", maxDose: "2000 mg", frequency: "Every 6 hr", label: "Standard" },
      { min: 100, max: 200, unit: "mg/kg/day", perKg: true, route: "IV", maxDose: "12 g/day", frequency: "Divided every 4 hr", label: "Meningitis", notes: "Higher dose for CNS penetration" },
    ],
    formulations: ["250 mg", "500 mg", "1 g vials"],
    renalAdjustment: [
      { gfr: "10–30 mL/min/1.73m²", adjustment: "Every 6–8 hr (standard), every 8–12 hr (meningitis doses)" },
      { gfr: "< 10 mL/min/1.73m²", adjustment: "Every 8–12 hr; seizure risk with accumulation" },
    ],
    reference: "Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "gentamicin",
    name: "Gentamicin",
    category: "antibiotic",
    indications: ["Gram-negative sepsis", "Neonatal sepsis (combined)", "Endocarditis (synergy)"],
    doses: [
      { min: 4, max: 5, unit: "mg/kg/dose", perKg: true, route: "IV over 30 min", frequency: "Every 24 hr (once-daily preferred > 1 month)", label: "Children > 1 month (ODD)", notes: "Harriet Lane: 7.5 mg/kg/day in 3 divided doses also acceptable" },
      { min: 4, max: 5, unit: "mg/kg/dose", perKg: true, route: "IV over 30 min", frequency: "Every 36–48 hr", label: "Neonates (term)", notes: "Neonates < 30 wk: 5 mg/kg every 48–72 hr" },
    ],
    warnings: ["Nephrotoxic and ototoxic — use shortest effective course", "Monitor levels: trough < 1 mg/L, peak 5–10 mg/L", "Ensure adequate hydration"],
    formulations: ["10 mg/mL", "40 mg/mL"],
    renalAdjustment: [
      { gfr: "40–60 mL/min/1.73m²", adjustment: "Extend interval to every 36 hr; monitor levels" },
      { gfr: "20–40 mL/min/1.73m²", adjustment: "Extend to every 48 hr; level monitoring mandatory" },
      { gfr: "< 20 mL/min/1.73m²", adjustment: "Extend to every 72–96 hr OR dose by drug level monitoring; consider alternative" },
    ],
    monitoring: ["Serum creatinine and gentamicin levels every 48–72 hr", "Urine output"],
    reference: "Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "ceftriaxone",
    name: "Ceftriaxone",
    category: "antibiotic",
    indications: ["Meningitis", "Sepsis", "Pneumonia", "Fever in sickle cell disease", "Lyme disease"],
    doses: [
      { min: 50, max: 100, unit: "mg/kg/day", perKg: true, route: "IV over 30 min / IM", maxDose: "4000 mg/day", frequency: "Once or twice daily", label: "Standard", notes: "Once daily for most indications" },
      { value: 100, unit: "mg/kg/day", perKg: true, route: "IV", maxDose: "4000 mg/day", frequency: "Once or twice daily", label: "Meningitis", notes: "PALS 2025: 100 mg/kg/day (divide q12h for meningitis)" },
    ],
    warnings: ["AVOID in neonates < 28 days — displaces bilirubin, risk of kernicterus", "NEVER mix with calcium-containing IV fluids (precipitates)", "Risk of biliary sludge with prolonged use"],
    formulations: ["250 mg", "1 g", "2 g vials"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "No dose adjustment needed (predominantly hepatic elimination); increase interval if severe combined renal+hepatic impairment" },
    ],
    reference: "PALS 2025 | Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "vancomycin",
    name: "Vancomycin",
    category: "antibiotic",
    indications: ["MRSA infections", "CoNS bacteremia", "CNS infections (with rifampicin)", "Confirmed/suspected resistant gram-positive infection"],
    doses: [
      { min: 15, max: 20, unit: "mg/kg/dose", perKg: true, route: "IV over 60–90 min", maxDose: "3000 mg/day", frequency: "Every 6 hr", label: "Standard dosing", notes: "Harriet Lane 23e: AUC/MIC 400–600 mg·h/L is target (preferred over trough-only)" },
      { min: 40, max: 60, unit: "mg/kg/day", perKg: true, route: "IV", maxDose: "3000 mg/day", frequency: "Divided every 6 hr", label: "CNS infections", notes: "Higher doses for meningitis; adjust by AUC monitoring" },
    ],
    warnings: ["Red man syndrome with rapid infusion (histamine release) — slow to > 60 min", "Nephrotoxicity — especially with aminoglycosides", "AUC-guided monitoring preferred over trough-only; target AUC 400–600"],
    formulations: ["500 mg", "1 g vials (reconstitute to 5–10 mg/mL)"],
    renalAdjustment: [
      { gfr: "40–60 mL/min/1.73m²", adjustment: "Every 8–12 hr; check AUC or trough (target trough 10–15 mcg/mL)" },
      { gfr: "20–40 mL/min/1.73m²", adjustment: "Every 12–24 hr; mandatory AUC monitoring" },
      { gfr: "< 20 mL/min/1.73m²", adjustment: "Every 24–72 hr; dose only after level < 10 mcg/mL; IDSA recommends AUC-guided dosing" },
    ],
    monitoring: ["AUC/MIC or trough levels, SCr every 48–72 hr"],
    reference: "Harriet Lane 23e | IDSA Vancomycin TDM 2020",
  },
  {
    id: "meropenem",
    name: "Meropenem",
    category: "antibiotic",
    indications: ["Severe/complicated sepsis", "Multi-drug resistant organisms", "Febrile neutropenia (high-risk)", "CNS infection (meningitis)"],
    doses: [
      { min: 20, max: 40, unit: "mg/kg/dose", perKg: true, route: "IV over 15–30 min", maxDose: "2000 mg per dose", frequency: "Every 8 hr", label: "Standard infection" },
      { value: 40, unit: "mg/kg/dose", perKg: true, route: "IV over 30 min", maxDose: "2000 mg per dose", frequency: "Every 8 hr", label: "Meningitis / CNS infection" },
      { min: 20, max: 40, unit: "mg/kg/dose", perKg: true, route: "IV extended infusion over 3–4 hr", maxDose: "2000 mg per dose", frequency: "Every 8 hr", label: "Extended infusion (MDR organisms)", notes: "PK/PD optimisation for MIC > 2 mg/L organisms" },
    ],
    warnings: ["Seizures at high doses — especially in renal impairment", "Carbapenem stewardship — restrict to resistant organisms"],
    formulations: ["500 mg", "1 g vials"],
    renalAdjustment: [
      { gfr: "26–50 mL/min/1.73m²", adjustment: "Standard dose every 12 hr" },
      { gfr: "10–25 mL/min/1.73m²", adjustment: "50% dose every 12 hr" },
      { gfr: "< 10 mL/min/1.73m²", adjustment: "50% dose every 24 hr; supplement after HD" },
    ],
    reference: "Harriet Lane 23e",
  },
  {
    id: "piperacillin-tazobactam",
    name: "Pip-Tazo",
    genericName: "Piperacillin-Tazobactam",
    category: "antibiotic",
    indications: ["Broad-spectrum coverage", "Febrile neutropenia", "Hospital-acquired pneumonia", "Intra-abdominal infection"],
    doses: [
      { min: 90, max: 100, unit: "mg/kg/dose (pip component)", perKg: true, route: "IV over 30 min", maxDose: "4500 mg per dose", frequency: "Every 6–8 hr", label: "Standard" },
      { min: 90, max: 100, unit: "mg/kg/dose (pip component)", perKg: true, route: "IV extended infusion over 4 hr", maxDose: "4500 mg per dose", frequency: "Every 8 hr", label: "Extended infusion (MDR)", notes: "PK/PD advantage for organisms with higher MIC" },
    ],
    formulations: ["2.25 g", "3.375 g", "4.5 g vials"],
    renalAdjustment: [
      { gfr: "20–40 mL/min/1.73m²", adjustment: "Reduce to every 8 hr" },
      { gfr: "< 20 mL/min/1.73m²", adjustment: "Reduce to every 12 hr; supplement post-dialysis" },
    ],
    reference: "Harriet Lane 23e",
  },
  {
    id: "acyclovir",
    name: "Acyclovir",
    category: "antibiotic",
    indications: ["HSV encephalitis", "Neonatal HSV (systemic)", "Severe varicella zoster", "Immunocompromised VZV/HSV"],
    doses: [
      { value: 20, unit: "mg/kg/dose", perKg: true, route: "IV over 1 hr", frequency: "Every 8 hr for 14–21 days", label: "HSV encephalitis / Neonatal HSV", notes: "Neonates: 20 mg/kg IV q8h × 14–21 days (WHO 2024)" },
      { value: 10, unit: "mg/kg/dose", perKg: true, route: "IV over 1 hr", frequency: "Every 8 hr for 7–10 days", label: "Herpes zoster / Severe varicella", notes: "10 mg/kg q8h for VZV in immunocompromised" },
    ],
    warnings: ["Nephrotoxic with rapid infusion — give over MINIMUM 1 hr with adequate hydration (10 mL/kg before dose)", "Acyclovir crystalluria — ensure urine output > 1 mL/kg/hr"],
    formulations: ["250 mg vials (25 mg/mL when reconstituted)"],
    renalAdjustment: [
      { gfr: "25–50 mL/min/1.73m²", adjustment: "Standard dose every 12 hr" },
      { gfr: "10–25 mL/min/1.73m²", adjustment: "Standard dose every 24 hr" },
      { gfr: "< 10 mL/min/1.73m²", adjustment: "50% dose every 24 hr; supplement post-HD" },
    ],
    monitoring: ["Serum creatinine and urine output daily", "BUN"],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "linezolid",
    name: "Linezolid",
    category: "antibiotic",
    indications: ["MRSA (alternative to vancomycin)", "VRE infections", "CNS MRSA infection"],
    doses: [
      { value: 10, unit: "mg/kg/dose", perKg: true, route: "IV over 30–120 min / PO", maxDose: "600 mg", frequency: "Every 8 hr (< 12 yr); Every 12 hr (> 12 yr)", label: "Standard" },
    ],
    warnings: ["Serotonin syndrome with SSRIs/MAOIs", "Myelosuppression with prolonged use (> 2 weeks) — monitor CBC weekly", "MAO inhibitor — food interactions"],
    formulations: ["2 mg/mL IV solution (300 mL)", "600 mg tablets", "100 mg/5 mL oral suspension"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "No dose adjustment required; however two primary metabolites accumulate in severe renal failure — significance uncertain" },
    ],
    reference: "Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  ANTIEPILEPTICS
  // ════════════════════════════════════════════════════════════
  {
    id: "lorazepam",
    name: "Lorazepam",
    genericName: "Ativan",
    category: "antiepileptic",
    indications: ["Status epilepticus (1st line IV)", "Acute seizures"],
    doses: [
      { min: 0.05, max: 0.1, unit: "mg/kg", perKg: true, route: "IV/IO", maxDose: "4 mg", frequency: "May repeat once after 5 min", label: "Status epilepticus — 1st line", notes: "PALS 2025: Preferred first-line IV BZD over diazepam", adultMaxDose_num: 4 },
    ],
    warnings: ["Respiratory depression — airway management ready", "PALS 2025: If IV unavailable, use IN midazolam 0.2 mg/kg or IM midazolam 0.2 mg/kg"],
    formulations: ["2 mg/mL", "4 mg/mL"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "midazolam-seizure",
    name: "Midazolam (Seizure)",
    category: "antiepileptic",
    indications: ["Status epilepticus (when IV unavailable)", "Pre-hospital seizure", "Acute seizure in community"],
    doses: [
      { min: 0.2, max: 0.3, unit: "mg/kg", perKg: true, route: "Intranasal (atomiser)", maxDose: "10 mg", label: "1st line — no IV access", notes: "PALS 2025: 0.2 mg/kg IN; as effective as IV lorazepam for out-of-hospital seizures" },
      { min: 0.1, max: 0.2, unit: "mg/kg", perKg: true, route: "IM", maxDose: "10 mg", label: "IM alternative" },
      { value: 0.5, unit: "mg/kg", perKg: true, route: "Buccal", maxDose: "10 mg", label: "Buccal midazolam", notes: "Licensed formulation preferred" },
    ],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "levetiracetam",
    name: "Levetiracetam",
    genericName: "Keppra",
    category: "antiepileptic",
    indications: ["Status epilepticus (2nd line after BZD)", "Seizure maintenance therapy"],
    doses: [
      { min: 40, max: 60, unit: "mg/kg", perKg: true, route: "IV over 5–15 min", maxDose: "4500 mg", label: "Loading — Status epilepticus 2nd line", notes: "Harriet Lane 23e: 40–60 mg/kg IV is now evidence-based loading dose" },
      { min: 20, max: 40, unit: "mg/kg/day", perKg: true, route: "IV / PO", maxDose: "3000 mg/day", frequency: "Divided every 12 hr", label: "Maintenance dose", notes: "Adjust based on seizure control and tolerance" },
    ],
    warnings: ["Behavioral side effects: agitation, aggression (especially in children)", "Few drug interactions — advantage over phenytoin"],
    formulations: ["100 mg/mL IV solution", "500 mg tablets", "100 mg/mL oral solution"],
    renalAdjustment: [
      { gfr: "30–50 mL/min/1.73m²", adjustment: "Reduce dose by 25%; every 12 hr" },
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Reduce dose by 50%; supplement post-dialysis" },
    ],
    monitoring: ["Renal function", "CBC (rare cytopenias)"],
    reference: "Harriet Lane 23e | PALS 2025",
  },
  {
    id: "phenobarbital",
    name: "Phenobarbital",
    category: "antiepileptic",
    indications: ["Status epilepticus (3rd line)", "Neonatal seizures (1st line)", "Seizure maintenance"],
    doses: [
      { min: 20, max: 40, unit: "mg/kg", perKg: true, route: "IV at ≤ 2 mg/kg/min", maxDose: "1000 mg", label: "SE loading dose", notes: "Harriet Lane 23e: Up to 40 mg/kg for refractory SE; max infusion rate 1–2 mg/kg/min" },
      { min: 20, max: 40, unit: "mg/kg", perKg: true, route: "IV at ≤ 1 mg/kg/min", maxDose: "400 mg", label: "Neonatal seizures", notes: "First-line for neonates; may need 40 mg/kg total" },
      { min: 3, max: 5, unit: "mg/kg/day", perKg: true, route: "IV / PO", frequency: "Once daily", label: "Maintenance", notes: "Target level 20–40 mcg/mL" },
    ],
    warnings: ["Respiratory depression and hypotension with high-dose loading — airway management essential", "Sedation can mask neurological deterioration"],
    formulations: ["200 mg/mL injection", "15 mg/5 mL elixir", "30 mg tablets"],
    renalAdjustment: [
      { gfr: "< 10 mL/min/1.73m²", adjustment: "Increase interval to every 24–48 hr; monitor levels" },
    ],
    monitoring: ["Drug levels (target 20–40 mcg/mL)", "RR, BP during loading"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "fosphenytoin",
    name: "Fosphenytoin",
    category: "antiepileptic",
    indications: ["Status epilepticus (2nd line)", "Seizure prophylaxis post-neurotrauma"],
    doses: [
      { min: 20, max: 30, unit: "mg PE/kg", perKg: true, route: "IV/IM at ≤ 3 mg PE/kg/min", maxDose: "1500 mg PE", label: "Loading dose — SE 2nd line", notes: "Dosed in phenytoin equivalents (PE); can infuse 3× faster than phenytoin" },
      { min: 4, max: 6, unit: "mg PE/kg/day", perKg: true, route: "IV / IM", frequency: "Every 12–24 hr", label: "Maintenance" },
    ],
    warnings: ["Dosed in PHENYTOIN EQUIVALENTS (PE) — 1.5 mg fosphenytoin = 1 mg PE", "Cardiac monitoring mandatory — QT prolongation, arrhythmia", "Safer than phenytoin peripherally (no purple glove syndrome)"],
    formulations: ["75 mg PE/mL (10 mL vial)"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "No fosphenytoin dose adjustment; phenytoin free fraction increases in renal failure — target unbound level 1–2 mcg/mL" },
    ],
    monitoring: ["ECG, BP during infusion", "Drug levels (total 10–20, free 1–2 mcg/mL)"],
    reference: "PALS 2025 | Harriet Lane 23e",
  },
  {
    id: "pyridoxine",
    name: "Pyridoxine (Seizure)",
    genericName: "Vitamin B6 — for seizures",
    category: "antiepileptic",
    indications: ["Pyridoxine-dependent epilepsy", "Isoniazid/INH overdose seizures"],
    doses: [
      { value: 100, unit: "mg", perKg: false, route: "IV over 5 min", label: "Pyridoxine-dependent epilepsy (empirical trial)", notes: "If pyridoxine-responsive: seizures stop within minutes; if no response, try another 100 mg" },
      { value: 1, unit: "g per gram of INH ingested", perKg: false, route: "IV", maxDose: "5 g", label: "INH overdose", notes: "If unknown INH dose: give 5 g IV; may repeat" },
    ],
    formulations: ["50 mg/mL injection"],
    reference: "Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  STEROIDS
  // ════════════════════════════════════════════════════════════
  {
    id: "hydrocortisone",
    name: "Hydrocortisone",
    category: "steroid",
    indications: ["Adrenal crisis", "Refractory vasodilatory shock (relative AI)", "Severe croup (alternative)", "Congenital adrenal hyperplasia (stress dosing)"],
    doses: [
      { min: 2, max: 4, unit: "mg/kg", perKg: true, route: "IV bolus", maxDose: "100 mg", label: "Adrenal crisis / Stress dose", notes: "WHO 2024: Give immediately in suspected adrenal crisis before investigations" },
      { min: 2, max: 4, unit: "mg/kg/day", perKg: true, route: "IV/IM", frequency: "Divided every 6 hr", label: "Maintenance in adrenal crisis", notes: "= 50–100 mg/m²/day" },
      { min: 1, max: 2, unit: "mg/kg/day", perKg: true, route: "IV infusion", maxDose: "200 mg/day", frequency: "Every 6–8 hr", label: "SSC 2024: Refractory septic shock adjunct", notes: "SSC Pediatric 2024: Consider in catecholamine-refractory shock; 1–2 mg/kg/day (max 50 mg q6h)" },
    ],
    warnings: ["Hyperglycemia, hypertension, immunosuppression with prolonged use"],
    formulations: ["100 mg/2 mL", "200 mg/2 mL vials"],
    monitoring: ["Blood glucose every 2–4 hr", "BP, electrolytes"],
    reference: "SSC Pediatric 2024 | WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "dexamethasone",
    name: "Dexamethasone",
    category: "steroid",
    indications: ["Croup (laryngotracheobronchitis)", "Post-extubation stridor", "Bacterial meningitis (adjunct)", "Cerebral edema", "Anti-emetic"],
    doses: [
      { value: 0.6, unit: "mg/kg", perKg: true, route: "PO / IV / IM", maxDose: "16 mg", label: "Croup — single dose", notes: "WHO 2024: Single dose equally effective; PO preferred if tolerated" },
      { value: 0.15, unit: "mg/kg/dose", perKg: true, route: "IV", frequency: "Every 6 hr × 4 days", maxDose: "10 mg per dose", label: "Bacterial meningitis", notes: "Give BEFORE or WITH first antibiotic dose; most benefit for H. influenzae type b" },
      { min: 0.25, max: 0.5, unit: "mg/kg", perKg: true, route: "IV", frequency: "Every 6 hr × 3–4 doses", maxDose: "10 mg per dose", label: "Post-extubation / airway edema" },
      { min: 0.1, max: 0.15, unit: "mg/kg/dose", perKg: true, route: "IV/PO", frequency: "Every 6 hr", maxDose: "8 mg per dose", label: "Cerebral edema / anti-emetic" },
    ],
    warnings: ["Avoid live vaccines", "Hyperglycemia"],
    formulations: ["4 mg/mL injection", "1 mg/mL oral solution", "0.5 mg tablets"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "No dose adjustment; monitor glucose and electrolytes" },
    ],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "methylprednisolone",
    name: "Methylprednisolone",
    genericName: "Solu-Medrol",
    category: "steroid",
    indications: ["Status asthmaticus", "Anaphylaxis (adjunct after epinephrine)", "Acute ARDS (selected cases)", "Autoimmune/inflammatory disease"],
    doses: [
      { min: 1, max: 2, unit: "mg/kg", perKg: true, route: "IV", maxDose: "60 mg", frequency: "Every 4–6 hr", label: "Status asthmaticus", notes: "WHO 2024: Start 1 mg/kg IV q6h; taper to PO prednisolone as improves" },
      { min: 1, max: 2, unit: "mg/kg", perKg: true, route: "IV", maxDose: "125 mg", label: "Anaphylaxis (adjunct)", notes: "After epinephrine; does not replace epinephrine" },
      { min: 10, max: 30, unit: "mg/kg", perKg: true, route: "IV over 30–60 min", maxDose: "1000 mg", label: "Pulse therapy (autoimmune)", frequency: "Daily × 3 days" },
    ],
    formulations: ["40 mg", "125 mg", "500 mg", "1 g vials"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "No dose adjustment; monitor glucose and electrolytes" },
    ],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "prednisolone",
    name: "Prednisolone",
    category: "steroid",
    indications: ["Asthma exacerbation", "Croup (mild alternative)", "Nephrotic syndrome", "Inflammatory conditions"],
    doses: [
      { min: 1, max: 2, unit: "mg/kg/day", perKg: true, route: "PO", maxDose: "60 mg/day", frequency: "Once or twice daily", label: "Standard" },
      { value: 2, unit: "mg/kg/day", perKg: true, route: "PO", maxDose: "60 mg/day", frequency: "Once daily for 4 weeks", label: "Nephrotic syndrome induction", notes: "WHO 2024: 2 mg/kg/day × 4 weeks, then 1.5 mg/kg alt day × 4 weeks" },
    ],
    formulations: ["5 mg/5 mL solution", "5 mg tablets", "25 mg tablets"],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  RESPIRATORY
  // ════════════════════════════════════════════════════════════
  {
    id: "salbutamol",
    name: "Salbutamol",
    genericName: "Albuterol",
    category: "respiratory",
    indications: ["Acute asthma / bronchospasm", "Bronchiolitis (trial)", "Hyperkalemia"],
    doses: [
      { min: 0.15, max: 0.3, unit: "mg/kg", perKg: true, route: "Nebulized", maxDose: "10 mg", frequency: "Every 20 min × 3, then reassess", label: "Acute asthma", notes: "Mild: 2.5 mg (< 20 kg) or 5 mg (> 20 kg); Severe: 0.3 mg/kg q20min continuous" },
      { min: 0.3, max: 0.5, unit: "mg/kg/hr", perKg: true, route: "Nebulized (continuous)", maxDose: "15 mg/hr", label: "Severe/critical asthma continuous nebulization" },
      { min: 4, max: 10, unit: "puffs", perKg: false, route: "MDI + spacer", label: "Inhaler (MDI) — preferred if adequate technique", notes: "4 puffs mild, 8–10 puffs moderate/severe; MDI + spacer as effective as nebulizer" },
      { min: 5, max: 10, unit: "mcg/kg IV bolus", perKg: true, route: "IV bolus over 1–5 min", maxDose: "250 mcg", label: "IV bolus (severe asthma, ICU only)" },
      { min: 0.1, max: 2.0, unit: "mcg/kg/min", perKg: true, route: "IV infusion (ICU only)", label: "IV infusion for life-threatening asthma" },
    ],
    warnings: ["WHO 2024: MDI + spacer equally effective as nebulizer for mild–moderate asthma", "Hypokalemia, tachycardia, tremor", "Lactic acidosis with high-dose IV salbutamol"],
    formulations: ["2.5 mg/2.5 mL unit dose nebules", "5 mg/2.5 mL nebule", "100 mcg/actuation MDI", "0.5 mg/mL IV"],
    monitoring: ["HR, SpO₂, PEFR, wheeze, potassium (IV use)"],
    reference: "GINA 2024 | WHO PF 2024 | BTS Guidelines 2023",
  },
  {
    id: "ipratropium",
    name: "Ipratropium Bromide",
    genericName: "Atrovent",
    category: "respiratory",
    indications: ["Acute severe/life-threatening asthma (add-on to salbutamol)", "COPD exacerbation"],
    doses: [
      { value: 0.25, unit: "mg/dose", perKg: false, route: "Nebulized", frequency: "Every 20 min × 3, then every 4–6 hr", label: "< 5 years", notes: "GINA 2024: Add to salbutamol in moderate–severe asthma" },
      { value: 0.5, unit: "mg/dose", perKg: false, route: "Nebulized", frequency: "Every 20 min × 3, then every 4–6 hr", label: "≥ 5 years" },
    ],
    warnings: ["Not for maintenance — only acute use", "Avoid contact with eyes (pupil dilation, angle-closure glaucoma risk)"],
    formulations: ["250 mcg/mL (1 mL nebules)", "500 mcg/2 mL (2 mL nebules)"],
    reference: "GINA 2024 | Harriet Lane 23e",
  },
  {
    id: "aminophylline",
    name: "Aminophylline",
    category: "respiratory",
    indications: ["Severe life-threatening asthma refractory to inhaled bronchodilators", "Apnea of prematurity"],
    doses: [
      { min: 5, max: 6, unit: "mg/kg", perKg: true, route: "IV over 20–30 min (loading)", maxDose: "500 mg", label: "Loading dose (if not already on theophylline)", notes: "OMIT loading dose if patient already on theophylline — check level first" },
      { min: 0.5, max: 1.0, unit: "mg/kg/hr", perKg: true, route: "IV infusion (maintenance)", label: "Maintenance infusion", notes: "Infants 6–11 mo: 0.7; 1–9 yr: 1.0; > 9 yr: 0.7 mg/kg/hr. Target 10–20 mcg/mL" },
      { min: 5, max: 6, unit: "mg/kg/day", perKg: true, route: "IV/PO", frequency: "Every 6–8 hr", label: "Apnea of prematurity (maintenance)", notes: "Target theophylline level 5–10 mcg/mL for apnea" },
    ],
    warnings: ["Narrow therapeutic index — toxicity: tachycardia, arrhythmia, seizures, vomiting", "Drug interactions: macrolides, ciprofloxacin, antiepileptics all affect levels", "Monitor serum levels before each IV dose adjustment"],
    formulations: ["25 mg/mL (10 mL amp = 250 mg)"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "Mainly hepatic metabolism; reduce dose in hepatic impairment; levels guide dosing" },
    ],
    monitoring: ["Theophylline levels (target 10–20 mcg/mL for asthma; 5–10 mcg/mL for apnea)", "ECG, HR, RR"],
    reference: "BTS 2023 | Harriet Lane 23e",
  },
  {
    id: "magnesium-asthma",
    name: "Magnesium Sulfate (Asthma)",
    category: "respiratory",
    indications: ["Severe acute asthma refractory to inhaled bronchodilators and steroids"],
    doses: [
      { min: 25, max: 40, unit: "mg/kg", perKg: true, route: "IV over 20 min", maxDose: "2000 mg (2 g)", label: "Severe asthma (GINA Step 5)", notes: "GINA 2024: Recommended in severe asthma not responding to first-line therapy" },
      { value: 150, unit: "mg per nebulization", perKg: false, route: "Nebulized isotonic MgSO4", label: "Nebulized (mild–moderate, adjunct to salbutamol)", notes: "Use isotonic solution; add to salbutamol nebulizer; limited evidence" },
    ],
    warnings: ["Monitor for hypotension (give over 20 min)", "Respiratory depression at toxic levels > 4 mmol/L", "Calcium gluconate antidote"],
    formulations: ["50% (500 mg/mL) — dilute to 10% or 20% for infusion"],
    monitoring: ["BP, RR, reflexes, SpO₂", "Serum Mg: target 1.5–2.5 mmol/L for bronchodilation"],
    reference: "GINA 2024 | BTS 2023",
  },
  {
    id: "surfactant",
    name: "Surfactant (Beractant)",
    genericName: "Survanta / Poractant (Curosurf)",
    category: "respiratory",
    indications: ["Neonatal RDS (prophylaxis/rescue)", "NICU ventilated preterm"],
    doses: [
      { value: 100, unit: "mg/kg (Beractant)", perKg: true, route: "Intratracheal (instilled)", frequency: "May repeat every 6 hr up to 4 doses", label: "Beractant (Survanta) — 4 mL/kg", notes: "Divide dose into 4 aliquots; position neonate in different positions" },
      { value: 100, unit: "mg/kg (Poractant)", perKg: true, route: "Intratracheal (bolus)", frequency: "May repeat 100 mg/kg at 6 & 12 hr", label: "Poractant (Curosurf) — 1.25 mL/kg", notes: "Faster instillation; 200 mg/kg initial dose in severe RDS" },
    ],
    warnings: ["SpO₂ may transiently drop during instillation — monitor closely", "Endotracheal tube must be confirmed in correct position", "Prophylaxis: < 27 wk within 30 min of birth"],
    formulations: ["Beractant 25 mg/mL (4 mL/kg)", "Poractant 80 mg/mL (1.25 mL/kg)"],
    monitoring: ["SpO₂, chest Xray, ABG within 1–2 hr", "Reduce FiO₂ and ventilator settings promptly after dose"],
    reference: "WHO PF 2024 | Harriet Lane 23e | ERS 2023",
  },
  {
    id: "heliox",
    name: "Heliox (Helium-Oxygen)",
    category: "respiratory",
    indications: ["Severe upper airway obstruction (croup, post-extubation stridor)", "Severe asthma with air trapping"],
    doses: [
      { value: 70, unit: "% He : 30% O₂ mixture", perKg: false, route: "Facemask / Closed circuit", label: "Standard mix", notes: "Reduces work of breathing by decreasing turbulent flow; requires FiO₂ < 0.4" },
    ],
    warnings: ["Cannot use if FiO₂ requirement > 0.4 (insufficient He concentration)", "Not a definitive treatment — buys time for definitive therapy"],
    reference: "BTS 2023",
  },
  {
    id: "budesonide-nebulized",
    name: "Budesonide (Nebulized)",
    category: "respiratory",
    indications: ["Croup (moderate alternative to dexamethasone)", "Acute asthma (add-on inhaled steroid)"],
    doses: [
      { value: 2, unit: "mg", perKg: false, route: "Nebulized", label: "Croup — single dose", notes: "Single 2 mg dose; PO/IM dexamethasone preferred; use nebulized if oral route not possible" },
    ],
    formulations: ["0.5 mg/2 mL", "1 mg/2 mL nebulizer suspension"],
    reference: "WHO PF 2024",
  },
  {
    id: "furosemide-respiratory",
    name: "Furosemide (Pulmonary edema)",
    category: "respiratory",
    indications: ["Acute cardiogenic pulmonary edema", "Fluid overload with respiratory compromise"],
    doses: [
      { min: 0.5, max: 2, unit: "mg/kg", perKg: true, route: "IV over 5–10 min", maxDose: "40 mg", frequency: "Every 6–12 hr", label: "IV bolus" },
      { min: 0.05, max: 0.4, unit: "mg/kg/hr", perKg: true, route: "IV continuous infusion", label: "Continuous infusion", notes: "For diuretic-resistant fluid overload; more predictable diuresis" },
    ],
    warnings: ["Hypokalemia, hyponatremia — replace electrolytes", "Ototoxicity with rapid infusion"],
    formulations: ["10 mg/mL injection"],
    renalAdjustment: [
      { gfr: "20–50 mL/min/1.73m²", adjustment: "Higher doses may be needed (reduced tubular secretion)" },
      { gfr: "< 20 mL/min/1.73m²", adjustment: "Use IV route; very high doses may be required; consider combined with metolazone" },
    ],
    reference: "Harriet Lane 23e | AHA 2024",
  },

  // ════════════════════════════════════════════════════════════
  //  CARDIOVASCULAR
  // ════════════════════════════════════════════════════════════
  {
    id: "furosemide",
    name: "Furosemide",
    genericName: "Lasix",
    category: "cardiovascular",
    indications: ["Pulmonary edema", "Fluid overload", "Hypertension", "Hypercalcemia"],
    doses: [
      { min: 0.5, max: 2, unit: "mg/kg", perKg: true, route: "IV over 5 min", maxDose: "40 mg", frequency: "Every 6–12 hr", label: "IV bolus" },
      { min: 1, max: 3, unit: "mg/kg", perKg: true, route: "PO", maxDose: "80 mg", frequency: "Every 6–12 hr", label: "Oral" },
      { min: 0.05, max: 0.4, unit: "mg/kg/hr", perKg: true, route: "IV infusion", label: "Continuous infusion" },
    ],
    warnings: ["Hypokalemia, hyponatremia, metabolic alkalosis", "Ototoxicity with rapid IV push"],
    formulations: ["10 mg/mL injection", "20 mg/5 mL oral solution", "40 mg tablets"],
    renalAdjustment: [
      { gfr: "20–50 mL/min/1.73m²", adjustment: "Increase dose (reduced tubular secretion reduces effect)" },
      { gfr: "< 20 mL/min/1.73m²", adjustment: "High doses often required; IV preferred; combine with spironolactone" },
    ],
    monitoring: ["UO (target 1–3 mL/kg/hr)", "Electrolytes daily", "Weight"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "digoxin",
    name: "Digoxin",
    category: "cardiovascular",
    indications: ["SVT (rate control)", "Atrial fibrillation/flutter (rate control)", "Heart failure with reduced EF"],
    doses: [
      { min: 20, max: 30, unit: "mcg/kg total loading", perKg: true, route: "IV", maxDose: "1000 mcg", label: "Total digitalizing dose (TDD) — IV", notes: "Give 50% TDD stat, then 25% at 8 hr and 25% at 16 hr; full digitalization over 24 hr" },
      { min: 5, max: 10, unit: "mcg/kg/day", perKg: true, route: "IV/PO", frequency: "Divided twice daily", label: "Maintenance", notes: "Start 12 hr after loading; level target 0.8–2 ng/mL" },
    ],
    warnings: ["Narrow therapeutic index — toxicity: bradycardia, AV block, vomiting, visual changes", "Hypokalemia increases toxicity — keep K+ > 3.5 mEq/L", "Digoxin immune Fab (Digibind) for toxicity"],
    formulations: ["0.25 mg/mL injection", "50 mcg/mL pediatric elixir", "62.5 mcg tablets"],
    renalAdjustment: [
      { gfr: "30–50 mL/min/1.73m²", adjustment: "Reduce maintenance dose by 25–35%; check levels" },
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Reduce maintenance dose by 50%; every 36–48 hr; mandatory level monitoring" },
    ],
    monitoring: ["Digoxin levels 6–8 hr post-dose; ECG; K+, Mg, Ca, renal function"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "propranolol",
    name: "Propranolol",
    category: "cardiovascular",
    indications: ["SVT", "Hypertension", "Thyrotoxicosis", "Infantile hemangioma"],
    doses: [
      { min: 0.01, max: 0.1, unit: "mg/kg", perKg: true, route: "IV over 10 min", maxDose: "3 mg", label: "IV — SVT/arrhythmia", notes: "Have atropine and calcium gluconate ready" },
      { min: 1, max: 4, unit: "mg/kg/day", perKg: true, route: "PO", maxDose: "60 mg/day", frequency: "Divided every 6–8 hr", label: "Oral — HTN/SVT" },
      { value: 1, unit: "mg/kg/day", perKg: true, route: "PO", frequency: "Twice daily; increase by 0.5 mg/kg/day every 2 weeks to max 3 mg/kg/day", label: "Infantile hemangioma", notes: "Propranolol 1 mg/kg/day divided twice daily; first dose in hospital setting" },
    ],
    warnings: ["Avoid in asthma (bronchospasm)", "Hypoglycemia in neonates/infants", "Do NOT stop abruptly — rebound hypertension/tachycardia"],
    formulations: ["1 mg/mL injection", "10 mg/5 mL oral solution", "10 mg tablets"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "Primarily hepatic; reduce dose in severe hepatic impairment; no renal dose adjustment" },
    ],
    reference: "Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "captopril",
    name: "Captopril",
    category: "cardiovascular",
    indications: ["Hypertension", "Heart failure (ACE inhibitor)", "Chronic kidney disease with proteinuria"],
    doses: [
      { min: 0.05, max: 0.5, unit: "mg/kg/dose", perKg: true, route: "PO", maxDose: "12.5 mg/dose", frequency: "Every 8–12 hr", label: "Children", notes: "Start 0.05–0.1 mg/kg; titrate every 1–2 days" },
      { min: 0.01, max: 0.05, unit: "mg/kg/dose", perKg: true, route: "PO", maxDose: "0.5 mg/dose", frequency: "Every 8 hr", label: "Neonates", notes: "Very cautious dosing in neonates — profound hypotension risk" },
    ],
    warnings: ["First-dose hypotension — give with patient supine", "Hyperkalemia — avoid with K+ > 5.5 mEq/L or K+ sparing diuretics", "Contraindicated in bilateral renal artery stenosis"],
    formulations: ["12.5 mg", "25 mg tablets", "compounded 1 mg/mL oral solution"],
    renalAdjustment: [
      { gfr: "10–30 mL/min/1.73m²", adjustment: "Reduce dose by 50%; every 12–18 hr" },
      { gfr: "< 10 mL/min/1.73m²", adjustment: "Reduce dose by 75%; every 24 hr; monitor K+ and Cr closely" },
    ],
    monitoring: ["BP, serum Cr, K+ 1 week after starting and after each dose change"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "sodium-nitroprusside",
    name: "Sodium Nitroprusside",
    category: "cardiovascular",
    indications: ["Hypertensive emergency", "Severe afterload reduction (cardiac surgery)"],
    doses: [
      { min: 0.5, max: 8, unit: "mcg/kg/min", perKg: true, route: "IV infusion (Central, light-protected)", label: "Hypertensive emergency", notes: "Start 0.5 mcg/kg/min; titrate every 5 min; MUST use light-protected tubing; max 72 hr" },
    ],
    warnings: ["CYANIDE TOXICITY with prolonged use (> 72 hr) or > 4 mcg/kg/min", "Monitor for metabolic acidosis (cyanide marker)", "Avoid in hepatic/renal impairment if possible — thiocyanate accumulation", "Cover tubing with light-protective foil"],
    formulations: ["50 mg vials (dilute in D5W)"],
    renalAdjustment: [
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Thiocyanate accumulates — limit to < 72 hr; monitor lactate and cyanide levels" },
    ],
    monitoring: ["Invasive arterial BP continuously", "Lactate, thiocyanate levels if > 2 mcg/kg/min > 48 hr"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "labetalol",
    name: "Labetalol",
    category: "cardiovascular",
    indications: ["Hypertensive emergency", "Post-operative hypertension"],
    doses: [
      { min: 0.2, max: 1, unit: "mg/kg", perKg: true, route: "IV over 2 min", maxDose: "40 mg", frequency: "Every 10 min as needed", label: "IV bolus" },
      { min: 0.25, max: 3, unit: "mg/kg/hr", perKg: true, route: "IV infusion", maxDose: "3 mg/kg/hr", label: "IV infusion" },
      { min: 2, max: 3, unit: "mg/kg/day", perKg: true, route: "PO", maxDose: "1200 mg/day", frequency: "Divided twice daily", label: "Oral maintenance" },
    ],
    warnings: ["Avoid in asthma (bronchospasm)", "Bradycardia, hypotension"],
    formulations: ["5 mg/mL injection (20 mL)", "100 mg tablets", "200 mg tablets"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "Primarily hepatic metabolism; use with caution in severe hepatic impairment; no renal dose change" },
    ],
    reference: "Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  FLUIDS / ELECTROLYTES
  // ════════════════════════════════════════════════════════════
  {
    id: "normal-saline",
    name: "Normal Saline (0.9% NaCl)",
    category: "fluid",
    indications: ["Volume resuscitation", "Dehydration", "Hyponatremia (isotonic)", "Drug diluent"],
    doses: [
      { min: 10, max: 20, unit: "mL/kg", perKg: true, route: "IV rapid infusion", maxDose: "500 mL per bolus", frequency: "Repeat up to 3 boluses (60 mL/kg total) in sepsis shock", label: "Fluid resuscitation bolus", notes: "PALS 2025: 10–20 mL/kg; titrate; avoid > 60 mL/kg without senior review" },
    ],
    warnings: ["Hyperchloremic metabolic acidosis with large volumes", "SSC 2024: Balanced crystalloids (Hartmann's/PlasmaLyte) preferred for maintenance after initial resuscitation"],
    formulations: ["100 mL", "250 mL", "500 mL", "1000 mL bags"],
    reference: "PALS 2025 | SSC Pediatric 2024",
  },
  {
    id: "hartmanns",
    name: "Hartmann's (Lactated Ringer's)",
    category: "fluid",
    indications: ["Volume resuscitation (preferred balanced crystalloid)", "Maintenance fluid", "Burns resuscitation"],
    doses: [
      { min: 10, max: 20, unit: "mL/kg", perKg: true, route: "IV", maxDose: "500 mL per bolus", label: "Resuscitation bolus", notes: "SSC Pediatric 2024: Preferred balanced crystalloid over NS for resuscitation" },
    ],
    warnings: ["SSC 2024: Preferred over NS for large volume resuscitation (less hyperchloremic acidosis)", "Contains lactate — avoid in hepatic failure"],
    formulations: ["500 mL", "1000 mL bags"],
    reference: "SSC Pediatric 2024",
  },
  {
    id: "potassium-chloride",
    name: "Potassium Chloride (KCl)",
    category: "fluid",
    indications: ["Hypokalemia correction", "Potassium maintenance"],
    doses: [
      { min: 0.25, max: 0.5, unit: "mEq/kg/hr", perKg: true, route: "IV (Central line preferred)", maxDose: "20 mEq/hr absolute maximum", label: "IV correction", notes: "Max peripheral concentration: 40 mEq/L; central: 60–80 mEq/L; cardiac monitoring required" },
      { min: 1, max: 4, unit: "mEq/kg/day", perKg: true, route: "PO / IV infusion in maintenance fluids", label: "Maintenance potassium" },
    ],
    warnings: ["⚠️ NEVER GIVE IV BOLUS — fatal cardiac arrest", "Continuous cardiac monitoring at > 0.3 mEq/kg/hr", "Max peripheral concentration: 40 mEq/L"],
    formulations: ["2 mEq/mL concentrate (must dilute before use)"],
    monitoring: ["Serum K+ every 2–4 hr during IV correction", "Continuous ECG"],
    reference: "Harriet Lane 23e | WHO PF 2024",
  },
  {
    id: "calcium-maintenance",
    name: "Calcium Gluconate (Maintenance)",
    category: "fluid",
    indications: ["Hypocalcemia (maintenance)", "Post-parathyroid surgery", "Neonatal hypocalcemia"],
    doses: [
      { min: 200, max: 500, unit: "mg/kg/day", perKg: true, route: "IV infusion (continuous)", maxDose: "9000 mg/day", label: "Continuous maintenance", notes: "Add to IV fluids; typical 1 mmol/kg/day = ~200 mg/kg/day elemental Ca" },
      { min: 500, max: 750, unit: "mg/kg/day", perKg: true, route: "PO (divided doses)", label: "Oral maintenance" },
    ],
    formulations: ["100 mg/mL (10% solution) IV", "500 mg tablets", "1000 mg effervescent tablets"],
    monitoring: ["Serum calcium 8–12 hrly during IV", "Phosphate, magnesium (cofactors)"],
    reference: "Harriet Lane 23e",
  },
  {
    id: "sodium-correction",
    name: "Sodium Chloride 3% (Hypertonic)",
    category: "fluid",
    indications: ["Symptomatic severe hyponatremia (Na < 125 mEq/L with seizures/coma)", "Elevated ICP (cerebral herniation)"],
    doses: [
      { min: 3, max: 5, unit: "mL/kg", perKg: true, route: "IV over 15–30 min (central preferred)", maxDose: "100 mL", label: "Symptomatic hyponatremia / Acute ICP crisis", notes: "Raises Na by ~3–5 mEq/L per 5 mL/kg; maximum correction rate: 10–12 mEq/L per 24 hr" },
    ],
    warnings: ["Overcorrection risk: Osmotic Demyelination Syndrome if Na raised > 12 mEq/L in 24 hr", "Central line STRONGLY preferred — hypertonic causes severe phlebitis", "Monitor Na every 2–4 hr"],
    formulations: ["3% NaCl (513 mEq/L) — prepared in pharmacy"],
    monitoring: ["Serum Na every 2 hr initially", "Neurological status"],
    reference: "Harriet Lane 23e | Neurocritical Care Society 2024",
  },
  {
    id: "albumin",
    name: "Albumin",
    category: "fluid",
    indications: ["Hypoalbuminemia (albumin < 20 g/L with edema)", "Volume expansion in sepsis", "Spontaneous bacterial peritonitis", "Large-volume paracentesis"],
    doses: [
      { min: 10, max: 20, unit: "mL/kg", perKg: true, route: "IV over 60 min", label: "Volume expansion (4.5%)", notes: "SSC 2024: Albumin appropriate for resuscitation in children with severe sepsis" },
      { min: 1, max: 2, unit: "g/kg", perKg: true, route: "IV (20%) over 2–4 hr", label: "Severe hypoalbuminemia (20%)", notes: "Use 20% for protein replacement (hepatic failure, nephrotic syndrome)" },
    ],
    warnings: ["SSC Pediatric 2024: Albumin may be used for fluid resuscitation but not routinely preferred over balanced crystalloids"],
    formulations: ["4.5% (human albumin solution 45 g/L)", "20% (human albumin solution 200 g/L)"],
    reference: "SSC Pediatric 2024 | Harriet Lane 23e",
  },
  {
    id: "glucose-insulin",
    name: "Glucose-Insulin (Hyperkalemia)",
    category: "fluid",
    indications: ["Hyperkalemia with ECG changes (transcellular shift — temporary)"],
    doses: [
      { min: 0.5, max: 1, unit: "g/kg glucose", perKg: true, route: "IV over 30 min", label: "Glucose component (D25 or D10)", notes: "Combine with insulin: 0.1 units/kg regular insulin (max 10 units) given separately or mixed" },
    ],
    warnings: ["Onset 30–60 min; duration 4–6 hr — temporary measure only", "Monitor glucose every 30 min — risk of hypoglycemia", "Must treat underlying cause concurrently"],
    formulations: ["D10W or D25W + Regular Insulin (Actrapid) 1 unit/10 mL D10"],
    monitoring: ["Serum K+ every 1–2 hr", "Glucose every 30 min", "Continuous ECG"],
    reference: "Harriet Lane 23e",
  },

  // ════════════════════════════════════════════════════════════
  //  ANTIFUNGALS
  // ════════════════════════════════════════════════════════════
  {
    id: "fluconazole",
    name: "Fluconazole",
    category: "antifungal",
    indications: ["Invasive candidiasis (non-severe)", "Fungal prophylaxis in PICU", "Mucosal candidiasis"],
    doses: [
      { min: 6, max: 12, unit: "mg/kg/day", perKg: true, route: "IV over 30–60 min / PO", maxDose: "800 mg", frequency: "Once daily", label: "Invasive candidiasis", notes: "Loading dose: 12 mg/kg on Day 1; then 6–12 mg/kg/day" },
      { min: 3, max: 6, unit: "mg/kg", perKg: true, route: "PO/IV", maxDose: "200 mg", frequency: "Once daily", label: "Prophylaxis" },
    ],
    warnings: ["QTc prolongation — check baseline ECG", "Multiple CYP450 drug interactions (warfarin, phenytoin, cyclosporin)", "Not for Candida krusei or glabrata (inherent resistance)"],
    formulations: ["2 mg/mL IV solution (100 mL)", "50 mg capsules", "200 mg capsules", "50 mg/5 mL suspension"],
    renalAdjustment: [
      { gfr: "< 50 mL/min/1.73m²", adjustment: "Reduce maintenance dose by 50%; loading dose unchanged" },
    ],
    monitoring: ["ECG (QTc)", "LFTs, renal function", "Drug interactions review"],
    reference: "Harriet Lane 23e | IDSA 2024",
  },
  {
    id: "amphotericin-b",
    name: "Amphotericin B (Liposomal)",
    genericName: "AmBisome",
    category: "antifungal",
    indications: ["Invasive aspergillosis (first-line)", "Invasive candidiasis (resistant/severe)", "Cryptococcal meningitis", "Visceral leishmaniasis"],
    doses: [
      { min: 3, max: 5, unit: "mg/kg/day", perKg: true, route: "IV over 2 hr", label: "Invasive aspergillosis / severe candidiasis", notes: "Liposomal preferred (AmBisome) — less nephrotoxic than conventional" },
      { value: 5, unit: "mg/kg/day", perKg: true, route: "IV over 2 hr", label: "Cryptococcal meningitis", notes: "5 mg/kg/day + flucytosine; continue until cultures negative × 2 weeks" },
    ],
    warnings: ["Still nephrotoxic — monitor Cr daily", "Infusion-related reactions (fever, rigors) — pre-medicate with paracetamol ± hydrocortisone 1 mg/kg IV", "Hypokalemia, hypomagnesemia common"],
    formulations: ["50 mg lyophilized vials (AmBisome)"],
    renalAdjustment: [
      { gfr: "< 30 mL/min/1.73m²", adjustment: "Liposomal form preferred (less nephrotoxicity); reduce dose by 25–50% if Cr rises > 2× baseline; ensure adequate hydration" },
    ],
    monitoring: ["Serum Cr daily", "K+, Mg twice weekly", "Full blood count"],
    reference: "Harriet Lane 23e | IDSA 2024",
  },
  {
    id: "caspofungin",
    name: "Caspofungin",
    category: "antifungal",
    indications: ["Invasive aspergillosis (2nd line)", "Invasive candidiasis", "Empirical antifungal in febrile neutropenia"],
    doses: [
      { value: 70, unit: "mg/m² (Day 1 loading)", perKg: false, route: "IV over 60 min", maxDose: "70 mg", label: "Loading dose (Day 1)" },
      { value: 50, unit: "mg/m² (maintenance)", perKg: false, route: "IV over 60 min", maxDose: "70 mg", frequency: "Once daily from Day 2", label: "Maintenance" },
    ],
    warnings: ["Dose by BSA in children (not weight)", "Hepatic dose adjustment required"],
    formulations: ["50 mg", "70 mg vials"],
    renalAdjustment: [
      { gfr: "Any", adjustment: "No renal dose adjustment required — echinocandins are not renally eliminated" },
    ],
    monitoring: ["LFTs weekly"],
    reference: "Harriet Lane 23e | IDSA 2024",
  },

  // ════════════════════════════════════════════════════════════
  //  VITAMINS / MINERALS
  // ════════════════════════════════════════════════════════════
  {
    id: "vitamin-k",
    name: "Vitamin K (Phytomenadione)",
    category: "vitamin",
    indications: ["Vitamin K deficiency bleeding (VKDB)", "Oral anticoagulant reversal", "Neonatal prophylaxis"],
    doses: [
      { value: 1, unit: "mg", perKg: false, route: "IM", label: "Neonatal prophylaxis", notes: "All neonates: 1 mg IM at birth (WHO 2024)" },
      { value: 0.3, unit: "mg/kg", perKg: true, route: "IV slow (over 20 min) / IM", maxDose: "10 mg", label: "VKDB / Anticoagulant reversal", notes: "IV must be slow — risk of anaphylaxis; IM preferred if non-emergency" },
      { min: 2.5, max: 5, unit: "mg", perKg: false, route: "PO", frequency: "Daily", label: "Cholestatic liver disease (prophylaxis)", notes: "Water-soluble form (menadiol) or colloidal IV formulation if malabsorption" },
    ],
    warnings: ["IV anaphylaxis risk — always dilute and give slowly; have epinephrine ready", "Only partially corrects anticoagulant reversal — FFP/PCC for acute bleed"],
    formulations: ["10 mg/mL (1 mL)", "Neonatal 1 mg/0.5 mL"],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "zinc-sulfate",
    name: "Zinc Sulfate",
    category: "vitamin",
    indications: ["Zinc deficiency", "Diarrhea treatment adjunct (WHO)", "Short bowel syndrome"],
    doses: [
      { value: 10, unit: "mg/day", perKg: false, route: "PO", frequency: "Once daily × 10–14 days", label: "< 6 months (WHO diarrhea protocol)" },
      { value: 20, unit: "mg/day", perKg: false, route: "PO", frequency: "Once daily × 10–14 days", label: "≥ 6 months (WHO diarrhea protocol)", notes: "WHO 2024: Adjunct to ORS in acute diarrhea; reduces duration and severity" },
    ],
    formulations: ["10 mg/5 mL syrup", "20 mg dispersible tablets"],
    reference: "WHO PF 2024",
  },
  {
    id: "thiamine",
    name: "Thiamine (Vitamin B1)",
    category: "vitamin",
    indications: ["Thiamine deficiency (Wernicke's)", "High-risk malnourished (refeeding syndrome prevention)", "Maple syrup urine disease"],
    doses: [
      { min: 50, max: 100, unit: "mg/day", perKg: false, route: "IV over 30 min / IM / PO", label: "Deficiency / Refeeding prophylaxis", notes: "Give BEFORE carbohydrates in malnourished children" },
    ],
    warnings: ["IV anaphylaxis risk (dilute; give slowly over 30 min)", "Give BEFORE glucose in Wernicke's risk — glucose alone can precipitate acute deficiency"],
    formulations: ["100 mg/mL injection (2 mL amp)", "100 mg tablets"],
    reference: "WHO PF 2024 | Harriet Lane 23e",
  },
  {
    id: "vitamin-d",
    name: "Vitamin D (Cholecalciferol / Ergocalciferol)",
    category: "vitamin",
    indications: ["Vitamin D deficiency / rickets", "Hypoparathyroidism", "Chronic renal failure (use calcitriol)"],
    doses: [
      { min: 1000, max: 2000, unit: "IU/day", perKg: false, route: "PO", label: "Deficiency (< 1 year)", notes: "Infants: 1000–2000 IU/day × 3 months; then maintenance 400–800 IU/day" },
      { min: 2000, max: 6000, unit: "IU/day", perKg: false, route: "PO", label: "Deficiency (1–12 years)", notes: "2000–6000 IU/day × 3 months; then maintenance 600–1000 IU/day" },
    ],
    formulations: ["400 IU/drop solution", "1000 IU capsules", "50,000 IU weekly tablets"],
    reference: "WHO PF 2024 | Endocrine Society 2024",
  },
];

export function calculateDose(
  doseRange: DoseRange,
  weightKg: number
): { dose: string; range: string; exceedsAdultMax?: boolean; adultMaxLabel?: string } {
  if (!doseRange.perKg) {
    const val = doseRange.value !== undefined
      ? doseRange.value
      : doseRange.min !== undefined ? doseRange.min : 0;
    const rangeStr = doseRange.min !== undefined && doseRange.max !== undefined
      ? `${doseRange.min} – ${doseRange.max} ${doseRange.unit}`
      : `${val} ${doseRange.unit}`;
    return { dose: rangeStr, range: "(fixed dose)" };
  }

  const unitStr = doseRange.unit.replace("/kg", "").replace("kg", "");

  if (doseRange.value !== undefined) {
    const calc = +(doseRange.value * weightKg).toFixed(3);
    const exceedsAdultMax =
      doseRange.adultMaxDose_num !== undefined && calc > doseRange.adultMaxDose_num;
    const displayDose = exceedsAdultMax
      ? `${doseRange.adultMaxDose_num} ${unitStr}`
      : `${calc} ${unitStr}`;
    return {
      dose: displayDose,
      range: `(${doseRange.value} ${doseRange.unit})`,
      exceedsAdultMax,
      adultMaxLabel: exceedsAdultMax
        ? `Adult max: ${doseRange.adultMaxDose_num} ${unitStr} — dose capped`
        : undefined,
    };
  }

  if (doseRange.min !== undefined && doseRange.max !== undefined) {
    const calcMin = +(doseRange.min * weightKg).toFixed(3);
    const calcMax = +(doseRange.max * weightKg).toFixed(3);
    const exceedsAdultMax =
      doseRange.adultMaxDose_num !== undefined && calcMax > doseRange.adultMaxDose_num;
    const displayMax = exceedsAdultMax
      ? doseRange.adultMaxDose_num
      : calcMax;
    return {
      dose: `${calcMin} – ${displayMax} ${unitStr}`,
      range: `(${doseRange.min} – ${doseRange.max} ${doseRange.unit})`,
      exceedsAdultMax,
      adultMaxLabel: exceedsAdultMax
        ? `Adult max: ${doseRange.adultMaxDose_num} ${unitStr} — upper limit capped`
        : undefined,
    };
  }
  return { dose: "—", range: "—" };
}
