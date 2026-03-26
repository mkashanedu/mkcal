export type DrugCategory =
  | "emergency"
  | "analgesic"
  | "sedative"
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
}

export interface Drug {
  id: string;
  name: string;
  genericName?: string;
  category: DrugCategory;
  doses: DoseRange[];
  indications: string[];
  contraindications?: string[];
  sideEffects?: string[];
  warnings?: string[];
  formulations?: string[];
  notes?: string;
}

export const CATEGORIES: Record<
  DrugCategory,
  { label: string; icon: string; color: string }
> = {
  emergency: { label: "Emergency", icon: "alert-circle", color: "#AE2012" },
  analgesic: { label: "Analgesics", icon: "activity", color: "#7B2D8B" },
  sedative: { label: "Sedatives", icon: "moon", color: "#1A5276" },
  inotrope: {
    label: "Inotropes/Vasopressors",
    icon: "heart",
    color: "#C0392B",
  },
  antibiotic: { label: "Antibiotics", icon: "shield", color: "#1E8449" },
  antiepileptic: {
    label: "Antiepileptics",
    icon: "zap",
    color: "#B7770D",
  },
  fluid: { label: "Fluids/Electrolytes", icon: "droplet", color: "#2E86AB" },
  respiratory: { label: "Respiratory", icon: "wind", color: "#16A085" },
  cardiovascular: {
    label: "Cardiovascular",
    icon: "trending-up",
    color: "#8E44AD",
  },
  antifungal: { label: "Antifungals", icon: "cpu", color: "#5D6D7E" },
  steroid: { label: "Steroids", icon: "sun", color: "#E67E22" },
  vitamin: { label: "Vitamins/Supplements", icon: "plus-circle", color: "#27AE60" },
};

export const DRUGS: Drug[] = [
  // ─── EMERGENCY ───────────────────────────────────────────────────────────────
  {
    id: "epinephrine",
    name: "Epinephrine",
    genericName: "Adrenaline",
    category: "emergency",
    indications: ["Cardiac arrest", "Anaphylaxis", "Severe bradycardia"],
    doses: [
      {
        value: 0.01,
        unit: "mg/kg",
        perKg: true,
        route: "IV/IO",
        maxDose: "1 mg",
        frequency: "Every 3–5 min",
        notes: "For cardiac arrest (0.1 mL/kg of 1:10,000)",
      },
      {
        min: 0.1,
        max: 0.5,
        unit: "mg/kg",
        perKg: true,
        route: "IM",
        maxDose: "0.5 mg",
        notes: "For anaphylaxis (use 1:1,000 solution)",
      },
      {
        min: 0.01,
        max: 1.0,
        unit: "mcg/kg/min",
        perKg: true,
        route: "IV infusion",
        notes: "Vasopressor support",
      },
    ],
    warnings: ["Monitor HR and BP closely", "Tissue necrosis with extravasation"],
    formulations: ["1:1,000 (1 mg/mL)", "1:10,000 (0.1 mg/mL)"],
  },
  {
    id: "atropine",
    name: "Atropine",
    category: "emergency",
    indications: [
      "Symptomatic bradycardia",
      "Organophosphate poisoning",
      "Pre-medication",
    ],
    doses: [
      {
        min: 0.02,
        max: 0.02,
        value: 0.02,
        unit: "mg/kg",
        perKg: true,
        route: "IV/IO",
        maxDose: "0.5 mg (child), 1 mg (adolescent)",
        notes: "Minimum dose: 0.1 mg (to avoid paradoxical bradycardia)",
      },
    ],
    warnings: ["Min dose 0.1 mg; smaller doses may cause paradoxical bradycardia"],
    formulations: ["0.1 mg/mL", "0.4 mg/mL", "1 mg/mL"],
  },
  {
    id: "adenosine",
    name: "Adenosine",
    category: "emergency",
    indications: ["SVT", "Paroxysmal supraventricular tachycardia"],
    doses: [
      {
        value: 0.1,
        unit: "mg/kg",
        perKg: true,
        route: "IV rapid push",
        maxDose: "6 mg (1st dose)",
        notes: "1st dose: 0.1 mg/kg (max 6 mg); 2nd dose: 0.2 mg/kg (max 12 mg)",
      },
    ],
    warnings: [
      "Administer via central or proximal peripheral IV",
      "Follow with rapid saline flush",
    ],
    formulations: ["3 mg/mL"],
  },
  {
    id: "amiodarone",
    name: "Amiodarone",
    category: "emergency",
    indications: [
      "Pulseless VT/VF",
      "Stable wide-complex tachycardia",
      "Atrial fibrillation",
    ],
    doses: [
      {
        value: 5,
        unit: "mg/kg",
        perKg: true,
        route: "IV/IO",
        maxDose: "300 mg",
        notes: "For pulseless VT/VF; may repeat up to 15 mg/kg/day",
      },
      {
        min: 5,
        max: 5,
        value: 5,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        notes: "For stable tachyarrhythmia; infuse over 20–60 min",
      },
    ],
    warnings: ["Dilute in D5W; incompatible with normal saline", "Monitor for hypotension"],
    formulations: ["50 mg/mL"],
  },
  {
    id: "sodium-bicarbonate",
    name: "Sodium Bicarbonate",
    category: "emergency",
    indications: ["Severe metabolic acidosis", "Hyperkalemia", "TCA overdose"],
    doses: [
      {
        value: 1,
        unit: "mEq/kg",
        perKg: true,
        route: "IV",
        notes: "May repeat as needed based on blood gas",
      },
    ],
    warnings: [
      "Do NOT give in respiratory acidosis without securing airway",
      "Causes hyperosmolarity",
    ],
    formulations: ["4.2% (0.5 mEq/mL)", "8.4% (1 mEq/mL)"],
  },
  {
    id: "calcium-gluconate",
    name: "Calcium Gluconate",
    category: "emergency",
    indications: ["Hypocalcemia", "Hyperkalemia", "Calcium channel blocker toxicity"],
    doses: [
      {
        min: 100,
        max: 200,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "2000 mg",
        notes: "Infuse over 5–10 min with cardiac monitoring",
      },
    ],
    warnings: ["Risk of bradycardia if given rapidly", "Incompatible with bicarbonate"],
    formulations: ["100 mg/mL (10% solution)"],
  },
  {
    id: "dextrose",
    name: "Dextrose (D50/D25/D10)",
    category: "emergency",
    indications: ["Hypoglycemia"],
    doses: [
      {
        min: 0.5,
        max: 1,
        unit: "g/kg",
        perKg: true,
        route: "IV",
        notes: "Neonates: D10 2–4 mL/kg; Infants: D25 2–4 mL/kg; Children: D50 1–2 mL/kg",
      },
    ],
    warnings: ["Use D10 in neonates to avoid hyperglycemia"],
    formulations: ["D10W", "D25W", "D50W"],
  },
  {
    id: "naloxone",
    name: "Naloxone",
    genericName: "Narcan",
    category: "emergency",
    indications: ["Opioid overdose/reversal"],
    doses: [
      {
        value: 0.01,
        unit: "mg/kg",
        perKg: true,
        route: "IV/IM/IN",
        maxDose: "2 mg",
        notes: "May repeat every 2–3 min; infusion 0.005–0.02 mg/kg/hr for sustained reversal",
      },
    ],
    warnings: ["May precipitate acute opioid withdrawal", "Short duration — monitor closely"],
    formulations: ["0.4 mg/mL", "1 mg/mL"],
  },
  {
    id: "flumazenil",
    name: "Flumazenil",
    category: "emergency",
    indications: ["Benzodiazepine reversal"],
    doses: [
      {
        value: 0.01,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "0.2 mg per dose, 1 mg total",
        notes: "May repeat every minute up to max 1 mg",
      },
    ],
    warnings: ["May cause seizures in chronic BZD users", "Short duration — monitor closely"],
    formulations: ["0.1 mg/mL"],
  },

  // ─── ANALGESICS ──────────────────────────────────────────────────────────────
  {
    id: "morphine",
    name: "Morphine",
    category: "analgesic",
    indications: ["Severe pain", "Post-operative analgesia", "Dyspnea"],
    doses: [
      {
        min: 0.05,
        max: 0.1,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "4–5 mg",
        frequency: "Every 2–4 hr",
      },
      {
        min: 0.01,
        max: 0.04,
        unit: "mg/kg/hr",
        perKg: true,
        route: "IV infusion",
        notes: "Continuous analgesia",
      },
    ],
    warnings: [
      "Respiratory depression risk — have naloxone ready",
      "Avoid in renal failure (metabolite accumulation)",
    ],
    formulations: ["1 mg/mL", "2 mg/mL", "4 mg/mL", "10 mg/mL"],
  },
  {
    id: "fentanyl",
    name: "Fentanyl",
    category: "analgesic",
    indications: ["Severe pain", "Procedural sedation analgesia", "Ventilated patients"],
    doses: [
      {
        min: 1,
        max: 2,
        unit: "mcg/kg",
        perKg: true,
        route: "IV",
        maxDose: "100 mcg",
        frequency: "Every 1–2 hr",
      },
      {
        min: 1,
        max: 5,
        unit: "mcg/kg/hr",
        perKg: true,
        route: "IV infusion",
        notes: "Continuous sedation/analgesia",
      },
    ],
    warnings: [
      "Rigid chest syndrome with rapid high-dose bolus",
      "100× more potent than morphine",
    ],
    formulations: ["50 mcg/mL (0.05 mg/mL)"],
  },
  {
    id: "ketamine-analgesic",
    name: "Ketamine (Analgesic)",
    category: "analgesic",
    indications: ["Procedural analgesia", "Sub-dissociative analgesia"],
    doses: [
      {
        min: 0.1,
        max: 0.5,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        notes: "Sub-dissociative dose for pain",
      },
      {
        min: 4,
        max: 5,
        unit: "mg/kg",
        perKg: true,
        route: "IM",
        notes: "Intramuscular dosing",
      },
    ],
    warnings: ["Increase secretions — consider atropine", "Emergence phenomenon"],
    formulations: ["10 mg/mL", "50 mg/mL", "100 mg/mL"],
  },
  {
    id: "paracetamol",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    category: "analgesic",
    indications: ["Mild–moderate pain", "Fever"],
    doses: [
      {
        min: 10,
        max: 15,
        unit: "mg/kg",
        perKg: true,
        route: "IV/PO",
        maxDose: "1000 mg",
        frequency: "Every 4–6 hr",
      },
      {
        min: 15,
        max: 20,
        unit: "mg/kg",
        perKg: true,
        route: "PR (rectal)",
        maxDose: "1000 mg",
        frequency: "Every 6 hr",
        notes: "Max daily: 75 mg/kg or 4 g (whichever less)",
      },
    ],
    warnings: ["Hepatotoxicity in overdose", "Reduce dose in hepatic impairment"],
    formulations: ["120 mg/5 mL syrup", "500 mg tablets", "10 mg/mL IV"],
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "analgesic",
    indications: ["Mild–moderate pain", "Fever", "Anti-inflammatory"],
    doses: [
      {
        min: 5,
        max: 10,
        unit: "mg/kg",
        perKg: true,
        route: "PO",
        maxDose: "400–600 mg",
        frequency: "Every 6–8 hr",
        notes: "Max daily: 40 mg/kg or 2400 mg",
      },
    ],
    contraindications: ["Renal impairment", "Dehydration", "Active GI bleed", "< 3 months"],
    formulations: ["100 mg/5 mL suspension", "200 mg tablets"],
  },
  {
    id: "tramadol",
    name: "Tramadol",
    category: "analgesic",
    indications: ["Moderate pain"],
    doses: [
      {
        min: 1,
        max: 2,
        unit: "mg/kg",
        perKg: true,
        route: "IV/PO",
        maxDose: "100 mg",
        frequency: "Every 4–6 hr",
      },
    ],
    warnings: ["Avoid in hepatic/renal failure", "Seizure risk", "Avoid < 12 years for pain"],
    formulations: ["50 mg capsules", "50 mg/mL injection"],
  },

  // ─── SEDATIVES ───────────────────────────────────────────────────────────────
  {
    id: "midazolam",
    name: "Midazolam",
    genericName: "Versed",
    category: "sedative",
    indications: ["Procedural sedation", "Seizures", "ICU sedation"],
    doses: [
      {
        min: 0.05,
        max: 0.1,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "5 mg",
        notes: "Procedural sedation",
      },
      {
        min: 0.2,
        max: 0.3,
        unit: "mg/kg",
        perKg: true,
        route: "IN (intranasal)",
        maxDose: "10 mg",
        notes: "0.3 mg/kg IN for seizures",
      },
      {
        min: 0.05,
        max: 0.2,
        unit: "mg/kg/hr",
        perKg: true,
        route: "IV infusion",
        notes: "ICU sedation",
      },
    ],
    warnings: ["Respiratory depression — monitor closely", "Paradoxical reaction in children"],
    formulations: ["1 mg/mL", "5 mg/mL"],
  },
  {
    id: "propofol",
    name: "Propofol",
    category: "sedative",
    indications: ["Induction of anesthesia", "ICU sedation > 3 years"],
    doses: [
      {
        min: 1,
        max: 2.5,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        notes: "Induction",
      },
      {
        min: 1,
        max: 4,
        unit: "mg/kg/hr",
        perKg: true,
        route: "IV infusion",
        notes: "Sedation (max duration 48 hr at this rate)",
      },
    ],
    warnings: [
      "PROPOFOL INFUSION SYNDROME with prolonged high-dose use",
      "Avoid in egg/soy allergy",
      "Avoid in < 1 month",
    ],
    formulations: ["10 mg/mL (1%)"],
  },
  {
    id: "ketamine-sedation",
    name: "Ketamine (Sedation)",
    category: "sedative",
    indications: [
      "Procedural sedation",
      "RSI induction",
      "Burns dressing changes",
    ],
    doses: [
      {
        min: 1,
        max: 2,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        notes: "Dissociative sedation; onset in 1 min",
      },
      {
        min: 4,
        max: 5,
        unit: "mg/kg",
        perKg: true,
        route: "IM",
        notes: "Onset 3–5 min",
      },
    ],
    warnings: [
      "Emergence reactions — consider midazolam",
      "Increases secretions — consider atropine pre-medication",
    ],
    formulations: ["10 mg/mL", "50 mg/mL", "100 mg/mL"],
  },
  {
    id: "dexmedetomidine",
    name: "Dexmedetomidine",
    genericName: "Precedex",
    category: "sedative",
    indications: ["ICU sedation", "Procedural sedation", "Weaning from mechanical ventilation"],
    doses: [
      {
        min: 0.2,
        max: 0.7,
        unit: "mcg/kg/hr",
        perKg: true,
        route: "IV infusion",
        notes: "Loading dose: 0.5–1 mcg/kg over 10 min (optional)",
      },
    ],
    warnings: [
      "Bradycardia and hypotension",
      "Does not suppress seizures",
    ],
    formulations: ["200 mcg/2 mL (100 mcg/mL)"],
  },
  {
    id: "chloral-hydrate",
    name: "Chloral Hydrate",
    category: "sedative",
    indications: ["Procedural sedation (imaging)", "Short-term sedation"],
    doses: [
      {
        min: 25,
        max: 100,
        unit: "mg/kg",
        perKg: true,
        route: "PO/PR",
        maxDose: "2000 mg",
        notes: "Usual dose 50–75 mg/kg",
      },
    ],
    warnings: ["Avoid in hepatic/renal impairment", "Respiratory depression"],
    formulations: ["500 mg/5 mL syrup"],
  },

  // ─── INOTROPES / VASOPRESSORS ────────────────────────────────────────────────
  {
    id: "dopamine",
    name: "Dopamine",
    category: "inotrope",
    indications: ["Cardiogenic shock", "Septic shock", "Bradycardia"],
    doses: [
      {
        min: 2,
        max: 20,
        unit: "mcg/kg/min",
        perKg: true,
        route: "IV infusion",
        notes:
          "Low: 2–5 (renal); Mid: 5–10 (cardiac); High: 10–20 (vasopressor)",
      },
    ],
    warnings: ["Tissue necrosis with extravasation — use central line", "Monitor for arrhythmias"],
    formulations: ["40 mg/mL", "80 mg/mL", "160 mg/mL"],
  },
  {
    id: "dobutamine",
    name: "Dobutamine",
    category: "inotrope",
    indications: ["Cardiogenic shock", "Low cardiac output"],
    doses: [
      {
        min: 2,
        max: 20,
        unit: "mcg/kg/min",
        perKg: true,
        route: "IV infusion",
      },
    ],
    warnings: ["May worsen hypotension", "Tachycardia at high doses"],
    formulations: ["12.5 mg/mL"],
  },
  {
    id: "norepinephrine",
    name: "Norepinephrine",
    genericName: "Noradrenaline",
    category: "inotrope",
    indications: ["Vasodilatory shock", "Septic shock"],
    doses: [
      {
        min: 0.01,
        max: 2,
        unit: "mcg/kg/min",
        perKg: true,
        route: "IV infusion",
        notes: "Titrate to target MAP",
      },
    ],
    warnings: ["Central line preferred", "Tissue necrosis with extravasation"],
    formulations: ["1 mg/mL", "4 mg/mL"],
  },
  {
    id: "milrinone",
    name: "Milrinone",
    category: "inotrope",
    indications: ["Low cardiac output", "Post-cardiac surgery"],
    doses: [
      {
        min: 0.25,
        max: 0.75,
        unit: "mcg/kg/min",
        perKg: true,
        route: "IV infusion",
        notes: "Loading dose: 50 mcg/kg over 10 min (may omit if hypotensive)",
      },
    ],
    warnings: ["May worsen hypotension — avoid loading dose if BP low"],
    formulations: ["1 mg/mL"],
  },
  {
    id: "vasopressin",
    name: "Vasopressin",
    category: "inotrope",
    indications: ["Refractory vasodilatory shock", "Adjunct in septic shock"],
    doses: [
      {
        min: 0.0003,
        max: 0.002,
        unit: "units/kg/min",
        perKg: true,
        route: "IV infusion",
        notes: "Typically 0.0003–0.002 units/kg/min",
      },
    ],
    warnings: ["Risk of hyponatremia", "Mesenteric ischemia at high doses"],
    formulations: ["20 units/mL"],
  },

  // ─── ANTIBIOTICS ─────────────────────────────────────────────────────────────
  {
    id: "ampicillin",
    name: "Ampicillin",
    category: "antibiotic",
    indications: ["Meningitis", "Sepsis (neonates)", "GBS infection"],
    doses: [
      {
        min: 50,
        max: 100,
        unit: "mg/kg/dose",
        perKg: true,
        route: "IV",
        maxDose: "2000 mg",
        frequency: "Every 6 hr (every 4 hr for meningitis)",
      },
    ],
    formulations: ["250 mg vials", "500 mg vials", "1 g vials"],
  },
  {
    id: "gentamicin",
    name: "Gentamicin",
    category: "antibiotic",
    indications: ["Gram-negative sepsis", "Meningitis (combined)", "Endocarditis"],
    doses: [
      {
        min: 2.5,
        max: 7.5,
        unit: "mg/kg/dose",
        perKg: true,
        route: "IV",
        frequency: "Every 8–24 hr (depending on age)",
        notes: "Neonates: 4–5 mg/kg every 36–48 hr; Older: 7.5 mg/kg/day ÷ q8h",
      },
    ],
    warnings: ["Nephrotoxic and ototoxic", "Monitor drug levels", "Avoid in renal failure"],
    formulations: ["10 mg/mL", "40 mg/mL"],
  },
  {
    id: "cefotaxime",
    name: "Cefotaxime",
    category: "antibiotic",
    indications: ["Meningitis", "Sepsis", "Pneumonia"],
    doses: [
      {
        min: 50,
        max: 200,
        unit: "mg/kg/day",
        perKg: true,
        route: "IV",
        maxDose: "12 g/day",
        notes: "Divided every 6–8 hr; 200 mg/kg/day for meningitis",
      },
    ],
    formulations: ["500 mg vials", "1 g vials", "2 g vials"],
  },
  {
    id: "ceftriaxone",
    name: "Ceftriaxone",
    category: "antibiotic",
    indications: ["Meningitis", "Sepsis", "Pneumonia", "Lyme disease"],
    doses: [
      {
        min: 50,
        max: 100,
        unit: "mg/kg/day",
        perKg: true,
        route: "IV/IM",
        maxDose: "4 g/day",
        frequency: "Once or twice daily",
        notes: "100 mg/kg/day for meningitis",
      },
    ],
    warnings: ["Avoid in neonates (< 28 days) — bilirubin displacement", "Avoid with calcium-containing IV fluids"],
    formulations: ["500 mg vials", "1 g vials", "2 g vials"],
  },
  {
    id: "vancomycin",
    name: "Vancomycin",
    category: "antibiotic",
    indications: ["MRSA infection", "CNS infections", "Coagulase-negative staph"],
    doses: [
      {
        min: 15,
        max: 20,
        unit: "mg/kg/dose",
        perKg: true,
        route: "IV",
        frequency: "Every 6–8 hr",
        notes: "Target AUC/MIC 400–600; Infuse over ≥60 min",
      },
    ],
    warnings: [
      "Monitor vancomycin AUC (preferred over trough levels)",
      "Red man syndrome — slow infusion rate",
      "Nephrotoxicity",
    ],
    formulations: ["500 mg vials", "1 g vials"],
  },
  {
    id: "meropenem",
    name: "Meropenem",
    category: "antibiotic",
    indications: [
      "Severe sepsis",
      "Multi-drug resistant organisms",
      "Meningitis",
    ],
    doses: [
      {
        min: 20,
        max: 40,
        unit: "mg/kg/dose",
        perKg: true,
        route: "IV",
        maxDose: "2 g per dose",
        frequency: "Every 8 hr",
        notes: "40 mg/kg/dose for CNS infections",
      },
    ],
    formulations: ["500 mg vials", "1 g vials"],
  },
  {
    id: "piperacillin-tazobactam",
    name: "Pip-Tazo",
    genericName: "Piperacillin-Tazobactam",
    category: "antibiotic",
    indications: ["Broad-spectrum coverage", "Febrile neutropenia", "Pneumonia"],
    doses: [
      {
        min: 75,
        max: 100,
        unit: "mg/kg/dose (pip component)",
        perKg: true,
        route: "IV",
        maxDose: "4.5 g per dose",
        frequency: "Every 6–8 hr",
      },
    ],
    formulations: ["2.25 g vials", "3.375 g vials", "4.5 g vials"],
  },
  {
    id: "acyclovir",
    name: "Acyclovir",
    category: "antibiotic",
    indications: ["Herpes encephalitis", "Neonatal HSV", "Severe varicella"],
    doses: [
      {
        min: 10,
        max: 20,
        unit: "mg/kg/dose",
        perKg: true,
        route: "IV",
        frequency: "Every 8 hr",
        notes: "20 mg/kg for neonatal HSV/encephalitis; infuse over 1 hr",
      },
    ],
    warnings: ["Nephrotoxic — ensure adequate hydration", "Adjust dose in renal impairment"],
    formulations: ["25 mg/mL powder for reconstitution"],
  },

  // ─── ANTIEPILEPTICS ──────────────────────────────────────────────────────────
  {
    id: "phenobarbital",
    name: "Phenobarbital",
    category: "antiepileptic",
    indications: ["Status epilepticus", "Neonatal seizures", "Seizure prophylaxis"],
    doses: [
      {
        min: 15,
        max: 20,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "1000 mg",
        notes: "Loading dose; infuse at ≤1 mg/kg/min; may repeat 5–10 mg/kg",
      },
      {
        min: 3,
        max: 5,
        unit: "mg/kg/day",
        perKg: true,
        route: "IV/PO",
        notes: "Maintenance dose; once or twice daily",
      },
    ],
    warnings: ["Respiratory depression — have airway support ready"],
    formulations: ["60 mg/mL", "200 mg/mL injection"],
  },
  {
    id: "levetiracetam",
    name: "Levetiracetam",
    genericName: "Keppra",
    category: "antiepileptic",
    indications: ["Status epilepticus", "Seizure management"],
    doses: [
      {
        min: 20,
        max: 60,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "4500 mg",
        notes: "Loading dose; infuse over 5–15 min",
      },
      {
        min: 20,
        max: 60,
        unit: "mg/kg/day",
        perKg: true,
        route: "IV/PO",
        notes: "Maintenance; divided twice daily",
      },
    ],
    formulations: ["100 mg/mL solution", "500 mg tablets"],
  },
  {
    id: "phenytoin",
    name: "Phenytoin",
    category: "antiepileptic",
    indications: ["Status epilepticus", "Seizure prophylaxis"],
    doses: [
      {
        min: 15,
        max: 20,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "1500 mg",
        notes: "Loading dose; infuse at ≤1 mg/kg/min (max 50 mg/min)",
      },
    ],
    warnings: [
      "Purple glove syndrome with peripheral extravasation",
      "Cardiac arrhythmias with rapid infusion",
      "Only compatible with Normal Saline",
    ],
    formulations: ["50 mg/mL"],
  },
  {
    id: "fosphenytoin",
    name: "Fosphenytoin",
    category: "antiepileptic",
    indications: ["Status epilepticus", "Seizure prophylaxis"],
    doses: [
      {
        min: 15,
        max: 20,
        unit: "mg PE/kg",
        perKg: true,
        route: "IV/IM",
        maxDose: "1500 mg PE",
        notes: "Loading dose; can infuse faster than phenytoin (max 150 mg PE/min)",
      },
    ],
    warnings: ["Dosed in phenytoin equivalents (PE)", "Less irritating than phenytoin"],
    formulations: ["75 mg PE/mL"],
  },
  {
    id: "diazepam",
    name: "Diazepam",
    genericName: "Valium",
    category: "antiepileptic",
    indications: ["Acute seizures", "Status epilepticus"],
    doses: [
      {
        min: 0.1,
        max: 0.3,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "10 mg",
        notes: "IV or rectal; may repeat once after 5 min",
      },
      {
        min: 0.5,
        max: 0.5,
        unit: "mg/kg",
        perKg: true,
        route: "PR (rectal)",
        maxDose: "20 mg",
      },
    ],
    warnings: ["Respiratory depression", "Rectal gel available for home seizure management"],
    formulations: ["5 mg/mL injection", "2.5 mg/5 mg rectal gel"],
  },
  {
    id: "lorazepam",
    name: "Lorazepam",
    genericName: "Ativan",
    category: "antiepileptic",
    indications: ["Acute seizures", "Status epilepticus"],
    doses: [
      {
        min: 0.05,
        max: 0.1,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "4 mg",
        notes: "May repeat once after 5 min",
      },
    ],
    warnings: ["Respiratory depression", "Preferred IV benzodiazepine for seizures"],
    formulations: ["2 mg/mL", "4 mg/mL"],
  },

  // ─── STEROIDS ────────────────────────────────────────────────────────────────
  {
    id: "hydrocortisone",
    name: "Hydrocortisone",
    category: "steroid",
    indications: ["Adrenal crisis", "Refractory shock", "Severe croup (alternative)"],
    doses: [
      {
        value: 1,
        unit: "mg/kg/dose",
        perKg: true,
        route: "IV",
        maxDose: "100 mg",
        frequency: "Every 6 hr",
        notes: "For adrenal crisis or refractory shock",
      },
      {
        min: 2,
        max: 4,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "100 mg",
        notes: "Stress dose for known adrenal insufficiency",
      },
    ],
    formulations: ["100 mg/2 mL", "500 mg/4 mL"],
  },
  {
    id: "dexamethasone",
    name: "Dexamethasone",
    category: "steroid",
    indications: ["Croup", "Meningitis (adjunct)", "Airway edema", "Anti-emetic"],
    doses: [
      {
        value: 0.6,
        unit: "mg/kg",
        perKg: true,
        route: "PO/IV/IM",
        maxDose: "16 mg",
        notes: "For croup; single dose usually sufficient",
      },
      {
        min: 0.15,
        max: 0.6,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        notes: "Airway edema: 0.25 mg/kg q6h; Meningitis: 0.15 mg/kg q6h × 4 days",
      },
    ],
    formulations: ["4 mg/mL", "10 mg/mL", "0.5 mg tablets"],
  },
  {
    id: "methylprednisolone",
    name: "Methylprednisolone",
    genericName: "Solu-Medrol",
    category: "steroid",
    indications: ["Status asthmaticus", "Anaphylaxis", "Autoimmune disease", "Spinal cord injury"],
    doses: [
      {
        min: 1,
        max: 2,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "60–125 mg",
        frequency: "Every 4–6 hr",
        notes: "Asthma: 1–2 mg/kg/day in 2 divided doses; max 60 mg/day",
      },
    ],
    formulations: ["40 mg vials", "125 mg vials", "500 mg vials", "1 g vials"],
  },
  {
    id: "prednisolone",
    name: "Prednisolone",
    category: "steroid",
    indications: ["Asthma", "Croup", "Nephrotic syndrome", "Inflammatory conditions"],
    doses: [
      {
        min: 1,
        max: 2,
        unit: "mg/kg/day",
        perKg: true,
        route: "PO",
        maxDose: "60 mg/day",
        notes: "Usually given once or twice daily",
      },
    ],
    formulations: ["5 mg/5 mL solution", "5 mg tablets", "25 mg tablets"],
  },

  // ─── RESPIRATORY ─────────────────────────────────────────────────────────────
  {
    id: "salbutamol",
    name: "Salbutamol",
    genericName: "Albuterol",
    category: "respiratory",
    indications: ["Acute asthma", "Bronchospasm", "Hyperkalemia"],
    doses: [
      {
        min: 0.15,
        max: 0.3,
        unit: "mg/kg",
        perKg: true,
        route: "Nebulized",
        maxDose: "10 mg",
        notes: "Severe asthma: continuous nebulization 0.5 mg/kg/hr",
      },
      {
        min: 0.01,
        max: 0.02,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "0.25 mg bolus",
        notes: "IV bolus for severe asthma; infusion 0.1–2 mcg/kg/min",
      },
    ],
    formulations: ["2.5 mg/2.5 mL nebules", "0.5 mg/mL nebule", "100 mcg MDI"],
  },
  {
    id: "ipratropium",
    name: "Ipratropium Bromide",
    genericName: "Atrovent",
    category: "respiratory",
    indications: ["Acute asthma (add-on)", "COPD exacerbation"],
    doses: [
      {
        min: 0.25,
        max: 0.5,
        unit: "mg",
        perKg: false,
        route: "Nebulized",
        frequency: "Every 20 min × 3, then as needed",
        notes: "< 5 kg: 0.25 mg; ≥ 5 kg: 0.5 mg",
      },
    ],
    formulations: ["0.25 mg/mL nebules", "0.5 mg/2.5 mL"],
  },
  {
    id: "surfactant",
    name: "Surfactant (Beractant)",
    genericName: "Survanta",
    category: "respiratory",
    indications: ["RDS (Respiratory Distress Syndrome) in neonates"],
    doses: [
      {
        value: 100,
        unit: "mg/kg",
        perKg: true,
        route: "Intratracheal",
        notes: "4 mL/kg; may repeat every 6 hr up to 4 doses",
      },
    ],
    formulations: ["25 mg/mL (4 mL/kg = 100 mg/kg)"],
  },
  {
    id: "aminophylline",
    name: "Aminophylline",
    category: "respiratory",
    indications: ["Severe asthma refractory to beta-2 agonists", "Apnea of prematurity"],
    doses: [
      {
        min: 5,
        max: 6,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        notes: "Loading dose; infuse over 20–30 min",
      },
      {
        min: 0.5,
        max: 1,
        unit: "mg/kg/hr",
        perKg: true,
        route: "IV infusion",
        notes: "Maintenance; target levels 10–20 mcg/mL",
      },
    ],
    warnings: ["Narrow therapeutic index", "Monitor serum levels", "Risk of arrhythmia and seizures"],
    formulations: ["250 mg/10 mL (25 mg/mL)"],
  },
  {
    id: "magnesium-sulfate",
    name: "Magnesium Sulfate",
    category: "respiratory",
    indications: ["Severe asthma", "Hypomagnesemia", "Torsades de pointes"],
    doses: [
      {
        min: 25,
        max: 50,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "2000 mg",
        notes: "For severe asthma; infuse over 20 min",
      },
    ],
    warnings: ["Monitor for hypotension and respiratory depression", "Calcium gluconate is antidote"],
    formulations: ["500 mg/mL (50% solution)", "200 mg/mL (20% solution)"],
  },

  // ─── CARDIOVASCULAR ───────────────────────────────────────────────────────────
  {
    id: "digoxin",
    name: "Digoxin",
    category: "cardiovascular",
    indications: ["SVT", "Atrial flutter/fibrillation", "Heart failure"],
    doses: [
      {
        min: 8,
        max: 10,
        unit: "mcg/kg",
        perKg: true,
        route: "IV",
        maxDose: "500 mcg",
        notes: "Total digitalizing dose divided: 50% then 25% then 25% over 24 hr",
      },
    ],
    warnings: [
      "Narrow therapeutic index — target level 0.5–2 ng/mL",
      "Toxicity risk — check K+ before giving",
    ],
    formulations: ["0.25 mg/mL injection", "50 mcg/mL pediatric elixir"],
  },
  {
    id: "propranolol",
    name: "Propranolol",
    category: "cardiovascular",
    indications: ["SVT", "Hypertension", "Thyrotoxicosis", "Infantile hemangioma"],
    doses: [
      {
        min: 0.01,
        max: 0.1,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "3 mg",
        notes: "Infuse over 5–10 min with cardiac monitoring",
      },
      {
        min: 1,
        max: 4,
        unit: "mg/kg/day",
        perKg: true,
        route: "PO",
        maxDose: "60 mg/day",
        frequency: "Divided every 6–8 hr",
      },
    ],
    warnings: ["Avoid in asthma", "May cause hypoglycemia"],
    formulations: ["1 mg/mL injection", "10 mg/5 mL oral solution"],
  },
  {
    id: "captopril",
    name: "Captopril",
    category: "cardiovascular",
    indications: ["Hypertension", "Heart failure"],
    doses: [
      {
        min: 0.05,
        max: 0.5,
        unit: "mg/kg/dose",
        perKg: true,
        route: "PO",
        maxDose: "6.25 mg per dose",
        frequency: "Every 8–12 hr",
        notes: "Start at low dose; neonates: 0.01–0.05 mg/kg/dose",
      },
    ],
    warnings: ["May cause hypotension, hyperkalemia, renal impairment"],
    formulations: ["12.5 mg tablets", "25 mg tablets"],
  },
  {
    id: "furosemide",
    name: "Furosemide",
    genericName: "Lasix",
    category: "cardiovascular",
    indications: ["Pulmonary edema", "Fluid overload", "Hypertension"],
    doses: [
      {
        min: 0.5,
        max: 2,
        unit: "mg/kg",
        perKg: true,
        route: "IV",
        maxDose: "40 mg",
        frequency: "Every 6–12 hr",
      },
      {
        min: 0.5,
        max: 6,
        unit: "mg/kg/hr",
        perKg: true,
        route: "IV infusion",
        notes: "Continuous infusion",
      },
    ],
    warnings: ["Monitor electrolytes — hypokalemia, hyponatremia", "Ototoxicity with rapid infusion"],
    formulations: ["10 mg/mL injection", "20 mg/5 mL oral solution"],
  },

  // ─── FLUIDS / ELECTROLYTES ────────────────────────────────────────────────────
  {
    id: "normal-saline",
    name: "Normal Saline (0.9% NaCl)",
    category: "fluid",
    indications: ["Volume resuscitation", "Dehydration", "Fluid bolus"],
    doses: [
      {
        min: 10,
        max: 20,
        unit: "mL/kg",
        perKg: true,
        route: "IV",
        maxDose: "1000 mL",
        notes: "Fluid bolus for resuscitation; may repeat up to 60 mL/kg in sepsis",
      },
    ],
    formulations: ["100 mL", "250 mL", "500 mL", "1000 mL bags"],
  },
  {
    id: "potassium-chloride",
    name: "Potassium Chloride (KCl)",
    category: "fluid",
    indications: ["Hypokalemia"],
    doses: [
      {
        min: 0.25,
        max: 0.5,
        unit: "mEq/kg",
        perKg: true,
        route: "IV",
        maxDose: "20 mEq per dose",
        notes: "Max infusion rate: 0.5 mEq/kg/hr (max 20 mEq/hr); via central line preferred",
      },
    ],
    warnings: [
      "NEVER give IV push — fatal if given rapidly",
      "Central line preferred for > 40 mEq/L concentration",
      "Continuous cardiac monitoring required",
    ],
    formulations: ["2 mEq/mL concentrate"],
  },
  {
    id: "albumin",
    name: "Albumin (4.5% / 20%)",
    category: "fluid",
    indications: ["Hypoalbuminemia", "Volume expansion in sepsis/nephrotic syndrome"],
    doses: [
      {
        min: 10,
        max: 20,
        unit: "mL/kg",
        perKg: true,
        route: "IV",
        notes: "Use 4.5% for volume expansion; 20% for severe hypoalbuminemia",
      },
    ],
    formulations: ["4.5% solution", "20% solution"],
  },

  // ─── ANTIFUNGALS ─────────────────────────────────────────────────────────────
  {
    id: "fluconazole",
    name: "Fluconazole",
    category: "antifungal",
    indications: ["Candidiasis", "Fungal prophylaxis in PICU"],
    doses: [
      {
        min: 6,
        max: 12,
        unit: "mg/kg/day",
        perKg: true,
        route: "IV/PO",
        maxDose: "800 mg",
        frequency: "Once daily",
        notes: "Loading dose: 12 mg/kg; Maintenance: 6–12 mg/kg",
      },
    ],
    warnings: ["QT prolongation", "Drug interactions — check CYP450"],
    formulations: ["2 mg/mL IV solution", "50 mg capsules"],
  },
  {
    id: "amphotericin-b",
    name: "Amphotericin B",
    category: "antifungal",
    indications: ["Invasive fungal infections", "Aspergillosis", "Cryptococcal meningitis"],
    doses: [
      {
        min: 3,
        max: 5,
        unit: "mg/kg/day",
        perKg: true,
        route: "IV",
        notes: "Liposomal formulation preferred; infuse over 2 hr",
      },
    ],
    warnings: [
      "Nephrotoxic — monitor renal function and electrolytes",
      "Pre-medicate with paracetamol and diphenhydramine",
    ],
    formulations: ["50 mg powder", "Liposomal 50 mg vials"],
  },

  // ─── VITAMINS / SUPPLEMENTS ───────────────────────────────────────────────────
  {
    id: "vitamin-k",
    name: "Vitamin K (Phytomenadione)",
    category: "vitamin",
    indications: ["Vitamin K deficiency bleeding", "Anticoagulant reversal", "Neonatal prophylaxis"],
    doses: [
      {
        value: 0.3,
        unit: "mg/kg",
        perKg: true,
        route: "IM/IV",
        maxDose: "10 mg",
        notes: "Neonatal: 1 mg IM at birth; Prophylaxis: 0.3 mg/kg IV/IM",
      },
    ],
    warnings: ["IV must be given slowly to avoid anaphylaxis"],
    formulations: ["1 mg/0.5 mL neonatal", "10 mg/mL adult"],
  },
  {
    id: "pyridoxine",
    name: "Pyridoxine (Vitamin B6)",
    category: "vitamin",
    indications: ["Pyridoxine-dependent seizures", "INH toxicity"],
    doses: [
      {
        min: 50,
        max: 100,
        unit: "mg",
        perKg: false,
        route: "IV",
        notes: "For pyridoxine-dependent seizures or INH overdose; may give up to 1 g",
      },
    ],
    formulations: ["50 mg/mL injection"],
  },
];

export function calculateDose(
  doseRange: DoseRange,
  weightKg: number
): { dose: string; range: string } {
  if (!doseRange.perKg) {
    const val = doseRange.value || doseRange.min || 0;
    return {
      dose: `${val} ${doseRange.unit}`,
      range: doseRange.min && doseRange.max
        ? `${doseRange.min} – ${doseRange.max} ${doseRange.unit}`
        : `${val} ${doseRange.unit}`,
    };
  }

  if (doseRange.value !== undefined) {
    const calculated = +(doseRange.value * weightKg).toFixed(3);
    return {
      dose: `${calculated} ${doseRange.unit.replace("/kg", "")}`,
      range: `(${doseRange.value} ${doseRange.unit})`,
    };
  }

  if (doseRange.min !== undefined && doseRange.max !== undefined) {
    const calcMin = +(doseRange.min * weightKg).toFixed(3);
    const calcMax = +(doseRange.max * weightKg).toFixed(3);
    return {
      dose: `${calcMin} – ${calcMax} ${doseRange.unit.replace("/kg", "")}`,
      range: `(${doseRange.min} – ${doseRange.max} ${doseRange.unit})`,
    };
  }

  return { dose: "—", range: "—" };
}
