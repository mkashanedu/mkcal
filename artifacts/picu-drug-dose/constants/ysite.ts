/**
 * Y-Site Compatibility (P12) — verified pairs ONLY.
 *
 * Every C / I verdict below comes from a published, Trissel's-based
 * source consulted for this dataset:
 *  - CHEO Parenteral Monographs (Milrinone, Calcium Chloride, Alprostadil)
 *  - ANMF (Australasian Neonatal Medicines Formulary) monographs:
 *    Milrinone, Dobutamine, Adrenaline — Y-site lists
 *  - Queensland Health Neonatal Monograph: Dopamine — Y-site list
 *  - Kenneally et al., Am J Health-Syst Pharm 2023;80:164-170 —
 *    in-vitro + simulated Y-site study of calcium chloride with
 *    milrinone, epinephrine, vasopressin and heparin
 * Expansion (2026-11-01, +14 drugs): CHEO Parenteral Manual and ANMF
 * monographs for vancomycin, meropenem, piperacillin-tazobactam,
 * cefotaxime, ampicillin, gentamicin, hydrocortisone, phenytoin,
 * lorazepam, ondansetron, dexamethasone, aminophylline and lidocaine,
 * plus Lee et al., Hosp Pharm 2021 (simulated Y-site study) for
 * levetiracetam. Handling of difficult pairs, by rule:
 *  - "COND" = the verdict depends on concentration (note says which).
 *  - Pairs where CHEO and ANMF directly conflict (piperacillin-
 *    tazobactam + sodium bicarbonate) are NOT entered — they return
 *    "no verified data".
 *  - Phenytoin + vasopressin is NOT entered: one CHEO list says
 *    compatible, but phenytoin's own monograph says do not mix.
 *  - Salbutamol IV is NOT included at all: CHEO lists one compatible
 *    drug while ANMF says "do not mix with any other drugs".
 * Pairs that are not listed here return "no verified data" in the app —
 * the checker never guesses. Concentration, diluent and contact time can
 * change a verdict; when in doubt, confirm with the hospital pharmacy.
 */

export interface YSiteDrug {
  id: string;
  name: string;
  note?: string;
}

export const YSITE_DRUGS: YSiteDrug[] = [
  { id: "epinephrine", name: "Epinephrine" },
  { id: "norepinephrine", name: "Norepinephrine" },
  { id: "dopamine", name: "Dopamine" },
  { id: "dobutamine", name: "Dobutamine" },
  { id: "milrinone", name: "Milrinone", note: "Never with furosemide — immediate precipitate." },
  { id: "vasopressin", name: "Vasopressin" },
  { id: "amiodarone", name: "Amiodarone", note: "Precipitates with heparin." },
  { id: "esmolol", name: "Esmolol" },
  { id: "fentanyl", name: "Fentanyl" },
  { id: "morphine", name: "Morphine" },
  { id: "midazolam", name: "Midazolam" },
  { id: "dexmedetomidine", name: "Dexmedetomidine" },
  { id: "propofol", name: "Propofol", note: "Lipid emulsion — a dedicated line is preferred." },
  { id: "ketamine", name: "Ketamine" },
  { id: "furosemide", name: "Furosemide" },
  { id: "insulin", name: "Insulin (Regular)" },
  { id: "heparin", name: "Heparin (UFH)" },
  { id: "magnesium-sulfate", name: "Magnesium Sulfate" },
  { id: "potassium-chloride", name: "Potassium Chloride" },
  { id: "calcium-chloride", name: "Calcium Chloride", note: "Precipitates with phosphate, bicarbonate and ceftriaxone." },
  { id: "calcium-gluconate", name: "Calcium Gluconate", note: "Same calcium rules: no bicarbonate, phosphate or ceftriaxone." },
  { id: "sodium-bicarbonate", name: "Sodium Bicarbonate", note: "Alkaline — inactivates catecholamines; precipitates with calcium." },
  { id: "ceftriaxone", name: "Ceftriaxone", note: "Never with calcium-containing infusions (fatal precipitate risk in neonates)." },
  { id: "pantoprazole", name: "Pantoprazole" },
  { id: "tpn", name: "TPN (with calcium)", note: "Contains calcium + phosphate — high precipitation risk with added calcium salts. Most monograph verdicts below refer to standard amino-acid/dextrose TPN; the exact admixture changes risk — confirm with pharmacy." },
  // ── Expansion (2026-11-01) ──────────────────────────────────────────
  { id: "vancomycin", name: "Vancomycin" },
  { id: "meropenem", name: "Meropenem" },
  { id: "piperacillin-tazobactam", name: "Piperacillin-Tazobactam", note: "Some verdicts are brand-dependent — ANMF's list applies to EDTA-free brands only (not Tazocin EF)." },
  { id: "cefotaxime", name: "Cefotaxime" },
  { id: "ampicillin", name: "Ampicillin" },
  { id: "gentamicin", name: "Gentamicin", note: "Do not mix with beta-lactam antibiotics — flush the line well between them (CHEO class warning)." },
  { id: "hydrocortisone", name: "Hydrocortisone" },
  { id: "phenytoin", name: "Phenytoin", note: "CHEO: do NOT mix with other IV medications — use a dedicated line." },
  { id: "levetiracetam", name: "Levetiracetam", note: "Verdicts rest on one simulated Y-site study (Lee et al. 2021) — fewer sources than the other drugs here." },
  { id: "lorazepam", name: "Lorazepam" },
  { id: "ondansetron", name: "Ondansetron" },
  { id: "dexamethasone", name: "Dexamethasone" },
  { id: "aminophylline", name: "Aminophylline" },
  { id: "lidocaine", name: "Lidocaine" },
];

type PairTuple = [string, string, "C" | "I" | "COND", string?];

/** [drugA, drugB, verdict, optional note] — order of A/B does not matter. */
const PAIRS: PairTuple[] = [
  // ── Milrinone (ANMF + CHEO monographs) ────────────────────────────────
  ["milrinone", "epinephrine", "C"],
  ["milrinone", "norepinephrine", "C"],
  ["milrinone", "dopamine", "C"],
  ["milrinone", "dobutamine", "C"],
  ["milrinone", "vasopressin", "C", "Also tested together in the AJHP 2023 simulated Y-site study."],
  ["milrinone", "amiodarone", "C"],
  ["milrinone", "fentanyl", "C"],
  ["milrinone", "morphine", "C"],
  ["milrinone", "midazolam", "C"],
  ["milrinone", "dexmedetomidine", "C"],
  ["milrinone", "propofol", "C"],
  ["milrinone", "ketamine", "C"],
  ["milrinone", "insulin", "C"],
  ["milrinone", "heparin", "C"],
  ["milrinone", "magnesium-sulfate", "C"],
  ["milrinone", "potassium-chloride", "C"],
  ["milrinone", "calcium-chloride", "C", "Confirmed in the AJHP 2023 Y-site study."],
  ["milrinone", "calcium-gluconate", "C"],
  ["milrinone", "furosemide", "I", "Immediate precipitate — never run together (CHEO / Trissel's)."],

  // ── Calcium chloride (CHEO monograph + AJHP 2023 study) ───────────────
  ["calcium-chloride", "epinephrine", "C", "Confirmed in the AJHP 2023 Y-site study."],
  ["calcium-chloride", "norepinephrine", "C"],
  ["calcium-chloride", "dopamine", "C"],
  ["calcium-chloride", "vasopressin", "C", "Confirmed in the AJHP 2023 Y-site study."],
  ["calcium-chloride", "fentanyl", "C"],
  ["calcium-chloride", "morphine", "C"],
  ["calcium-chloride", "midazolam", "C"],
  ["calcium-chloride", "dexmedetomidine", "C"],
  ["calcium-chloride", "furosemide", "C"],
  ["calcium-chloride", "heparin", "C", "One phosphate-buffered heparin formulation (2 units/mL premix) precipitated in the AJHP 2023 study — check the formulation."],
  ["calcium-chloride", "sodium-bicarbonate", "I", "Forms calcium carbonate precipitate."],
  ["calcium-chloride", "ceftriaxone", "I", "Calcium–ceftriaxone precipitate; potentially fatal in neonates."],
  ["calcium-chloride", "tpn", "I", "Calcium–phosphate precipitation risk."],
  ["calcium-chloride", "pantoprazole", "I"],

  // ── Calcium gluconate (calcium rules; ANMF/Queensland lists) ──────────
  ["calcium-gluconate", "epinephrine", "C"],
  ["calcium-gluconate", "dopamine", "C"],
  ["calcium-gluconate", "dobutamine", "C"],
  ["calcium-gluconate", "sodium-bicarbonate", "I", "Forms calcium carbonate precipitate."],
  ["calcium-gluconate", "ceftriaxone", "I", "Calcium–ceftriaxone precipitate; potentially fatal in neonates."],

  // ── Epinephrine (Victorian/ANMF adrenaline monograph) ─────────────────
  ["epinephrine", "dobutamine", "C"],
  ["epinephrine", "dopamine", "C"],
  ["epinephrine", "amiodarone", "C"],
  ["epinephrine", "fentanyl", "C"],
  ["epinephrine", "midazolam", "C"],
  ["epinephrine", "dexmedetomidine", "C"],
  ["epinephrine", "ketamine", "C"],
  ["epinephrine", "furosemide", "C"],
  ["epinephrine", "heparin", "C"],
  ["epinephrine", "magnesium-sulfate", "C"],
  ["epinephrine", "vasopressin", "C", "Tested together in the AJHP 2023 simulated Y-site study."],
  ["epinephrine", "sodium-bicarbonate", "I", "Alkaline solutions inactivate epinephrine."],

  // ── Other catecholamines vs bicarbonate (same alkaline rule) ──────────
  ["norepinephrine", "sodium-bicarbonate", "I", "Alkaline solutions inactivate catecholamines."],
  ["dopamine", "sodium-bicarbonate", "I", "Alkaline solutions inactivate catecholamines."],
  ["dobutamine", "sodium-bicarbonate", "I", "Alkaline solutions inactivate catecholamines."],

  // ── Dopamine (Queensland monograph Y-site list) ───────────────────────
  ["dopamine", "dobutamine", "C"],
  ["dopamine", "norepinephrine", "C"],
  ["dopamine", "fentanyl", "C"],
  ["dopamine", "morphine", "C"],
  ["dopamine", "midazolam", "C"],
  ["dopamine", "furosemide", "C"],
  ["dopamine", "heparin", "C"],
  ["dopamine", "potassium-chloride", "C"],

  // ── Dobutamine (ANMF monograph Y-site list) ───────────────────────────
  ["dobutamine", "fentanyl", "C"],
  ["dobutamine", "morphine", "C"],
  ["dobutamine", "midazolam", "C"],
  ["dobutamine", "dexmedetomidine", "C"],
  ["dobutamine", "ketamine", "C"],
  ["dobutamine", "insulin", "C"],
  ["dobutamine", "magnesium-sulfate", "C"],
  ["dobutamine", "potassium-chloride", "C"],
  ["dobutamine", "calcium-chloride", "C"],

  // ── Amiodarone ────────────────────────────────────────────────────────
  ["amiodarone", "heparin", "I", "Amiodarone precipitates with heparin — use a separate line."],

  // ════════════════════════════════════════════════════════════════════
  // EXPANSION (2026-11-01) — CHEO / ANMF monographs, Lee et al. 2021.
  // ════════════════════════════════════════════════════════════════════

  // ── Vancomycin (CHEO + ANMF monographs) ───────────────────────────────
  ["vancomycin", "fentanyl", "C"],
  ["vancomycin", "midazolam", "C"],
  ["vancomycin", "morphine", "C"],
  ["vancomycin", "tpn", "C"],
  ["vancomycin", "magnesium-sulfate", "C"],
  ["vancomycin", "dexmedetomidine", "C"],
  ["vancomycin", "potassium-chloride", "C"],
  ["vancomycin", "calcium-gluconate", "C", "ANMF calcium gluconate monograph. No source was found for vancomycin + calcium CHLORIDE — that pair stays 'no data'."],
  ["vancomycin", "heparin", "COND", "Compatible ONLY at heparin 0.5–1 unit/mL (line-patency concentrations). INCOMPATIBLE above 1 unit/mL (CHEO)."],
  ["vancomycin", "meropenem", "C"],
  ["vancomycin", "lorazepam", "C"],
  ["vancomycin", "ondansetron", "C"],
  ["vancomycin", "levetiracetam", "C", "Lee et al. 2021 simulated Y-site study (both 5 mg/mL)."],

  // ── Meropenem (CHEO monograph) ────────────────────────────────────────
  ["meropenem", "furosemide", "C"],
  ["meropenem", "morphine", "C"],
  ["meropenem", "norepinephrine", "C"],
  ["meropenem", "potassium-chloride", "C", "KCl up to 40 mmol/L (CHEO)."],
  ["meropenem", "tpn", "C"],
  ["meropenem", "heparin", "C"],
  ["meropenem", "aminophylline", "C"],
  ["meropenem", "dexamethasone", "C"],
  ["meropenem", "ondansetron", "I"],

  // ── Piperacillin-Tazobactam (CHEO + ANMF) ─────────────────────────────
  ["piperacillin-tazobactam", "dopamine", "C"],
  ["piperacillin-tazobactam", "magnesium-sulfate", "C"],
  ["piperacillin-tazobactam", "morphine", "C"],
  ["piperacillin-tazobactam", "potassium-chloride", "C"],
  ["piperacillin-tazobactam", "tpn", "C"],
  ["piperacillin-tazobactam", "calcium-gluconate", "C"],
  ["piperacillin-tazobactam", "dexmedetomidine", "C"],
  ["piperacillin-tazobactam", "furosemide", "C"],
  ["piperacillin-tazobactam", "heparin", "C"],
  ["piperacillin-tazobactam", "milrinone", "C"],
  ["piperacillin-tazobactam", "vasopressin", "C"],
  ["piperacillin-tazobactam", "aminophylline", "C", "ANMF monograph — EDTA-free brands only."],
  ["piperacillin-tazobactam", "dexamethasone", "C"],
  ["piperacillin-tazobactam", "hydrocortisone", "C", "ANMF monograph — EDTA-free brands only."],
  ["piperacillin-tazobactam", "ondansetron", "C"],
  ["piperacillin-tazobactam", "lorazepam", "C"],
  ["piperacillin-tazobactam", "amiodarone", "I"],
  ["piperacillin-tazobactam", "dobutamine", "I"],
  ["piperacillin-tazobactam", "insulin", "I"],
  ["piperacillin-tazobactam", "midazolam", "I"],
  ["piperacillin-tazobactam", "vancomycin", "I"],
  ["piperacillin-tazobactam", "gentamicin", "I", "CHEO + ANMF: incompatible — separate the two by 30–60 min. The manufacturer label allows Y-site only under strict dose/concentration/diluent conditions (never the frozen premix)."],
  ["piperacillin-tazobactam", "levetiracetam", "COND", "Compatible at piperacillin-tazobactam 33.75 mg/mL, INCOMPATIBLE at 45 mg/mL (Lee et al. 2021)."],

  // ── Cefotaxime (CHEO monographs 2021 + 2022) ──────────────────────────
  ["cefotaxime", "calcium-gluconate", "C"],
  ["cefotaxime", "dexmedetomidine", "C"],
  ["cefotaxime", "fentanyl", "C"],
  ["cefotaxime", "heparin", "C"],
  ["cefotaxime", "potassium-chloride", "C"],
  ["cefotaxime", "midazolam", "C"],
  ["cefotaxime", "milrinone", "C"],
  ["cefotaxime", "morphine", "C"],
  ["cefotaxime", "tpn", "C"],
  ["cefotaxime", "magnesium-sulfate", "C"],
  ["cefotaxime", "insulin", "C"],
  ["cefotaxime", "lorazepam", "C"],
  ["cefotaxime", "pantoprazole", "I"],
  ["cefotaxime", "vancomycin", "I"],
  ["cefotaxime", "sodium-bicarbonate", "I"],
  ["cefotaxime", "gentamicin", "I", "CHEO: aminoglycosides must be separated from cefotaxime (class statement)."],
  ["cefotaxime", "aminophylline", "I"],

  // ── Ampicillin (CHEO monograph) ───────────────────────────────────────
  ["ampicillin", "heparin", "C"],
  ["ampicillin", "morphine", "C"],
  ["ampicillin", "potassium-chloride", "C"],
  ["ampicillin", "dexmedetomidine", "C"],
  ["ampicillin", "propofol", "C"],
  ["ampicillin", "hydrocortisone", "C"],
  ["ampicillin", "dopamine", "I"],
  ["ampicillin", "epinephrine", "I"],
  ["ampicillin", "gentamicin", "I"],
  ["ampicillin", "ketamine", "I"],
  ["ampicillin", "midazolam", "I"],
  ["ampicillin", "tpn", "I"],
  ["ampicillin", "vancomycin", "I"],
  ["ampicillin", "ondansetron", "I"],

  // ── Gentamicin (CHEO monograph) ───────────────────────────────────────
  ["gentamicin", "heparin", "COND", "Compatible ONLY at heparin 0.5–1 unit/mL. INCOMPATIBLE above 1 unit/mL (CHEO)."],
  ["gentamicin", "morphine", "C"],
  ["gentamicin", "potassium-chloride", "C"],
  ["gentamicin", "tpn", "C"],
  ["gentamicin", "lorazepam", "C"],
  ["gentamicin", "ondansetron", "C"],
  ["gentamicin", "sodium-bicarbonate", "C"],
  ["gentamicin", "calcium-gluconate", "C"],
  ["gentamicin", "dexmedetomidine", "C"],
  ["gentamicin", "furosemide", "I"],
  ["gentamicin", "propofol", "I"],

  // ── Hydrocortisone (CHEO monograph) ───────────────────────────────────
  ["hydrocortisone", "morphine", "C"],
  ["hydrocortisone", "tpn", "C"],
  ["hydrocortisone", "calcium-gluconate", "C"],
  ["hydrocortisone", "lidocaine", "C"],
  ["hydrocortisone", "heparin", "C"],
  ["hydrocortisone", "lorazepam", "C"],
  ["hydrocortisone", "ondansetron", "C"],
  ["hydrocortisone", "epinephrine", "C"],
  ["hydrocortisone", "potassium-chloride", "C"],
  ["hydrocortisone", "insulin", "C"],

  // ── Phenytoin (CHEO: do not mix — incompatible list) ──────────────────
  ["phenytoin", "potassium-chloride", "I"],
  ["phenytoin", "hydrocortisone", "I"],
  ["phenytoin", "morphine", "I"],
  ["phenytoin", "lidocaine", "I"],
  ["phenytoin", "propofol", "I"],
  ["phenytoin", "dexmedetomidine", "I"],
  ["phenytoin", "norepinephrine", "I"],
  ["phenytoin", "insulin", "I"],
  ["phenytoin", "dobutamine", "I"],
  ["phenytoin", "tpn", "I", "Vancouver Coastal Health Y-site chart with parenteral nutrition (Trissel-based)."],

  // ── Levetiracetam (Lee et al., Hosp Pharm 2021) ───────────────────────
  ["levetiracetam", "dexmedetomidine", "C"],
  ["levetiracetam", "norepinephrine", "C"],
  ["levetiracetam", "propofol", "C"],
  ["levetiracetam", "vasopressin", "C"],

  // ── Lorazepam (CHEO monograph) ────────────────────────────────────────
  ["lorazepam", "dexamethasone", "C"],
  ["lorazepam", "fentanyl", "C"],
  ["lorazepam", "furosemide", "C"],
  ["lorazepam", "heparin", "C"],
  ["lorazepam", "potassium-chloride", "C"],
  ["lorazepam", "morphine", "C"],
  ["lorazepam", "tpn", "C"],
  ["lorazepam", "dexmedetomidine", "C"],
  ["lorazepam", "ondansetron", "I"],

  // ── Ondansetron (CHEO monograph) ──────────────────────────────────────
  ["ondansetron", "dexamethasone", "C"],
  ["ondansetron", "dopamine", "C"],
  ["ondansetron", "fentanyl", "C"],
  ["ondansetron", "heparin", "C"],
  ["ondansetron", "magnesium-sulfate", "C"],
  ["ondansetron", "morphine", "C"],
  ["ondansetron", "potassium-chloride", "C"],
  ["ondansetron", "propofol", "C"],
  ["ondansetron", "tpn", "C"],
  ["ondansetron", "furosemide", "I"],
  ["ondansetron", "sodium-bicarbonate", "I"],

  // ── Dexamethasone (CHEO + ANMF monographs) ────────────────────────────
  ["dexamethasone", "dexmedetomidine", "C"],
  ["dexamethasone", "fentanyl", "C"],
  ["dexamethasone", "furosemide", "C"],
  ["dexamethasone", "heparin", "C"],
  ["dexamethasone", "potassium-chloride", "C", "KCl up to 40 mmol/L (CHEO)."],
  ["dexamethasone", "ketamine", "C"],
  ["dexamethasone", "milrinone", "C"],
  ["dexamethasone", "morphine", "C"],
  ["dexamethasone", "tpn", "C"],
  ["dexamethasone", "midazolam", "I"],
  ["dexamethasone", "pantoprazole", "I"],
  ["dexamethasone", "vancomycin", "I"],
  ["dexamethasone", "calcium-gluconate", "I"],

  // ── Aminophylline (from other drugs' CHEO/ANMF monographs) ───────────
  ["aminophylline", "potassium-chloride", "C"],
  ["aminophylline", "insulin", "C"],
  ["aminophylline", "pantoprazole", "C"],
  ["aminophylline", "norepinephrine", "I"],
  ["aminophylline", "dobutamine", "I"],
  ["aminophylline", "midazolam", "I"],

  // ── Lidocaine (CHEO monograph) ────────────────────────────────────────
  ["lidocaine", "amiodarone", "C"],
  ["lidocaine", "morphine", "C"],
  ["lidocaine", "dobutamine", "C"],
  ["lidocaine", "dopamine", "C"],
  ["lidocaine", "tpn", "C"],
  ["lidocaine", "propofol", "C"],
  ["lidocaine", "insulin", "C"],
  ["lidocaine", "potassium-chloride", "C"],
  ["lidocaine", "norepinephrine", "I"],
];

export type YSiteVerdict =
  | { status: "C"; note?: string }
  | { status: "I"; note?: string }
  | { status: "COND"; note?: string }
  | { status: "ND"; note?: string };

const PAIR_MAP = new Map<string, { s: "C" | "I" | "COND"; note?: string }>();
for (const [a, b, s, note] of PAIRS) {
  PAIR_MAP.set([a, b].sort().join("|"), { s, note });
}

export function ysiteVerdict(aId: string, bId: string): YSiteVerdict {
  if (aId === bId) return { status: "ND", note: "Same drug selected twice." };
  const hit = PAIR_MAP.get([aId, bId].sort().join("|"));
  if (!hit) {
    return {
      status: "ND",
      note: "No verified data for this pair in the sources used — check Trissel's or ask the hospital pharmacy. Do not assume compatibility.",
    };
  }
  return { status: hit.s, note: hit.note };
}

export const YSITE_PAIR_COUNT = PAIRS.length;

export const YSITE_SOURCE_NOTE =
  "Verdicts are taken from Trissel's-based monographs (CHEO, ANMF, Queensland Health), Kenneally et al., Am J Health-Syst Pharm 2023 (CaCl₂ Y-site study) and Lee et al., Hosp Pharm 2021 (levetiracetam). AMBER 'Conditional' pairs depend on concentration — read the note. Pairs where sources conflict are shown as 'no verified data', never guessed. Salbutamol IV is not listed: its sources conflict (ANMF: do not mix with any other drug). Compatibility can change with concentration and diluent; confirm unusual combinations with your hospital pharmacy.";
