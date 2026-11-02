/**
 * Indication-based search — type a CONDITION, get its drugs.
 *
 * Each group below was built from the app's own dataset: a drug is in a
 * group only when its indications (or, for a few arrest/RSI drugs, its
 * dose labels) in constants/drugs.ts / formularyConverted.ts name that
 * condition. No drug was added from memory alone. Groups are deliberately
 * tight and acute-care focused; the ordinary indication-substring search
 * still runs alongside, so maintenance drugs remain findable by typing
 * their condition too.
 *
 * DKA group added once the calculator gained a standalone Insulin
 * (Regular) entry (DKA infusion 0.05–0.1 units/kg/hr, ISPAD 2022).
 * DKA fluids themselves live in the Fluids tool.
 */

export interface ConditionGroup {
  id: string;
  label: string;
  aliases: string[];
  drugIds: string[];
}

export const CONDITION_GROUPS: ConditionGroup[] = [
  {
    id: "seizure",
    label: "Seizures / Status Epilepticus",
    aliases: ["seizure", "seizures", "status epilepticus", "fits", "convulsion", "convulsions", "epilepsy"],
    drugIds: ["midazolam", "midazolam-seizure", "lorazepam", "levetiracetam", "phenobarbital", "fosphenytoin", "sodium-valproate-iv", "fx-phenytoin", "fx-diazepam", "pyridoxine"],
  },
  {
    id: "anaphylaxis",
    label: "Anaphylaxis",
    aliases: ["anaphylaxis", "anaphylactic"],
    drugIds: ["epinephrine", "epinephrine-infusion", "methylprednisolone", "fx-chlorphenamine"],
  },
  {
    id: "arrest",
    label: "Cardiac Arrest / Resuscitation",
    aliases: ["cardiac arrest", "arrest", "cpr", "resuscitation", "code blue"],
    drugIds: ["epinephrine", "amiodarone", "lidocaine", "atropine", "magnesium-sulfate-emergency"],
  },
  {
    id: "shock",
    label: "Shock",
    aliases: ["shock", "septic shock", "cardiogenic shock", "hypotension"],
    drugIds: ["norepinephrine", "epinephrine-infusion", "dopamine", "dobutamine", "vasopressin", "hydrocortisone"],
  },
  {
    id: "hyperkalemia",
    label: "Hyperkalemia",
    aliases: ["hyperkalemia", "hyperkalaemia", "high potassium"],
    drugIds: ["glucose-insulin", "insulin-regular", "calcium-gluconate", "calcium-chloride", "sodium-bicarbonate", "salbutamol"],
  },
  {
    id: "hypoglycemia",
    label: "Hypoglycemia",
    aliases: ["hypoglycemia", "hypoglycaemia", "low sugar", "low glucose"],
    drugIds: ["dextrose"],
  },
  {
    id: "dka",
    label: "Diabetic Ketoacidosis (DKA)",
    aliases: ["dka", "diabetic ketoacidosis", "ketoacidosis"],
    drugIds: ["insulin-regular"],
  },
  {
    id: "asthma",
    label: "Asthma / Bronchospasm",
    aliases: ["asthma", "bronchospasm", "wheeze", "wheezing", "status asthmaticus"],
    drugIds: ["salbutamol", "ipratropium", "magnesium-asthma", "magnesium-sulfate-emergency", "methylprednisolone", "prednisolone", "aminophylline", "fx-terbutaline-sulfate", "ketamine-rsi"],
  },
  {
    id: "croup",
    label: "Croup / Stridor",
    aliases: ["croup", "stridor", "laryngotracheobronchitis"],
    drugIds: ["dexamethasone", "fx-epinephrine-1-1000", "fx-racemic-epinephrine-2-25", "budesonide-nebulized", "prednisolone", "heliox"],
  },
  {
    id: "meningitis",
    label: "Meningitis",
    aliases: ["meningitis"],
    drugIds: ["ceftriaxone", "fx-cefotaxime", "ampicillin", "meropenem", "dexamethasone", "fx-benzylpenicillin-iv"],
  },
  {
    id: "pain",
    label: "Pain / Analgesia",
    aliases: ["pain", "analgesia", "analgesic"],
    drugIds: ["morphine", "fentanyl", "paracetamol", "ibuprofen", "ketamine-analgesic", "tramadol", "nalbuphine", "fx-ketorolac", "fx-hydromorphone-hcl", "fx-oxycodone", "fx-methadone-hcl"],
  },
  {
    id: "sedation",
    label: "Sedation",
    aliases: ["sedation", "sedative", "procedural sedation"],
    drugIds: ["midazolam", "dexmedetomidine", "propofol", "ketamine-analgesic", "chloral-hydrate", "fx-etomidate"],
  },
  {
    id: "rsi",
    label: "RSI / Intubation",
    aliases: ["rsi", "intubation", "rapid sequence"],
    drugIds: ["ketamine-rsi", "rocuronium", "suxamethonium", "atracurium", "vecuronium", "fx-etomidate"],
  },
  {
    id: "arrhythmia",
    label: "Arrhythmia",
    aliases: ["arrhythmia", "svt", "tachycardia", "bradycardia", "torsades"],
    drugIds: ["adenosine", "amiodarone", "atropine", "lidocaine", "digoxin", "propranolol", "magnesium-sulfate-emergency"],
  },
  {
    id: "hypertension",
    label: "Hypertension",
    aliases: ["hypertension", "hypertensive emergency", "high bp"],
    drugIds: ["sodium-nitroprusside", "labetalol", "captopril", "furosemide", "fx-amlodipine", "fx-enalapril"],
  },
  {
    id: "poisoning",
    label: "Poisoning / Overdose",
    aliases: ["poisoning", "overdose", "antidote"],
    drugIds: ["naloxone", "fx-n-acetylcysteine-iv", "fx-acetylcysteine", "atropine", "fx-methylene-blue", "fx-pralidoxime-chloride-atropine", "pyridoxine"],
  },
  {
    id: "reversal",
    label: "Reversal Agents",
    aliases: ["reversal", "reverse paralysis"],
    drugIds: ["naloxone", "flumazenil", "sugammadex", "neostigmine"],
  },
  {
    id: "sepsis",
    label: "Sepsis",
    aliases: ["sepsis", "septic", "septicemia", "septicaemia", "severe infection", "blood infection"],
    drugIds: ["ampicillin", "gentamicin", "ceftriaxone", "meropenem", "ceftazidime", "fx-flucloxacillin", "fx-amikacin-iv", "fx-ciprofloxacin-iv", "fx-clindamycin-iv", "albumin"],
  },
  {
    id: "pneumonia",
    label: "Pneumonia",
    aliases: ["pneumonia", "chest infection"],
    drugIds: ["ampicillin", "ceftriaxone", "piperacillin-tazobactam", "ceftazidime", "fx-amoxicillin", "fx-amoxicillin-clavulanate", "fx-azithromycin", "fx-clarithromycin", "fx-co-trimoxazole", "fx-erythromycin", "fx-amikacin-iv", "fx-clindamycin-iv", "fx-metronidazole-iv"],
  },
  {
    id: "uti",
    label: "Urinary Tract Infection (UTI)",
    aliases: ["uti", "urinary tract infection", "urinary infection", "pyelonephritis"],
    drugIds: ["fx-amoxicillin", "fx-amoxicillin-clavulanate", "fx-cephalexin", "fx-ciprofloxacin", "fx-ciprofloxacin-iv", "fx-co-trimoxazole", "fx-nitrofurantoin", "fx-trimethoprim", "fx-amikacin-iv"],
  },
  {
    id: "heart-failure",
    label: "Heart Failure",
    aliases: ["heart failure", "cardiac failure", "low cardiac output", "pulmonary edema", "pulmonary oedema"],
    drugIds: ["dobutamine", "milrinone", "levosimendan", "digoxin", "furosemide-respiratory", "captopril", "fx-enalapril", "fx-losartan", "fx-spironolactone"],
  },
  {
    id: "bleeding",
    label: "Bleeding",
    aliases: ["bleeding", "hemorrhage", "haemorrhage", "coagulopathy", "gi bleed", "variceal"],
    drugIds: ["tranexamic-acid", "vitamin-k", "fx-desmopressin", "terlipressin", "pantoprazole-iv", "fx-omeprazole-iv"],
  },
  {
    id: "hypocalcemia",
    label: "Hypocalcemia",
    aliases: ["hypocalcemia", "hypocalcaemia", "low calcium"],
    drugIds: ["calcium-gluconate", "calcium-chloride", "calcium-maintenance", "fx-calcium-citrate"],
  },
  {
    id: "vomiting",
    label: "Vomiting / Antiemetics",
    aliases: ["vomiting", "emesis", "nausea", "antiemetic"],
    drugIds: ["ondansetron", "fx-domperidone", "fx-metoclopramide", "fx-granisetron", "fx-promethazine", "fx-hydroxyzine"],
  },
  {
    id: "constipation",
    label: "Constipation",
    aliases: ["constipation", "laxative"],
    drugIds: ["fx-lactulose", "fx-bisacodyl", "fx-senna", "fx-glycerin", "fx-mineral-oil"],
  },
  {
    id: "fungal",
    label: "Fungal Infections",
    aliases: ["fungal", "fungal infection", "candidiasis", "aspergillosis", "candida"],
    drugIds: ["fluconazole", "amphotericin-b", "caspofungin", "fx-nystatin"],
  },
  {
    id: "malaria",
    label: "Malaria",
    aliases: ["malaria"],
    drugIds: ["fx-chloroquine", "fx-hydroxychloroquine", "fx-quinidine"],
  },
  {
    id: "raised-icp",
    label: "Raised ICP / Cerebral Edema",
    aliases: ["raised icp", "intracranial", "cerebral edema", "cerebral oedema", "brain edema", "herniation"],
    drugIds: ["fx-mannitol-iv", "sodium-correction", "dexamethasone"],
  },
  {
    id: "hypertensive-crisis",
    label: "Hypertensive Crisis",
    aliases: ["hypertensive crisis", "hypertensive emergency", "hypertensive urgency"],
    drugIds: ["sodium-nitroprusside", "labetalol"],
  },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The condition group a query refers to, if any. */
export function conditionForQuery(rawQuery: string): ConditionGroup | null {
  const q = normalize(rawQuery);
  if (q.length < 3) return null;
  for (const g of CONDITION_GROUPS) {
    for (const a of g.aliases) {
      if (q === a) return g;
      // "seiz" → seizure group; "status epi" → status epilepticus.
      if (q.length >= 4 && a.startsWith(q)) return g;
      // "acute seizure management" → contains the alias as a phrase.
      if (a.length >= 5 && q.includes(a)) return g;
    }
  }
  return null;
}

/** Drug ids belonging to the condition the query names (empty if none). */
export function drugIdsForConditionQuery(rawQuery: string): Set<string> {
  const g = conditionForQuery(rawQuery);
  return new Set(g ? g.drugIds : []);
}
