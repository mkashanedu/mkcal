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
  { id: "tpn", name: "TPN (with calcium)", note: "Contains calcium + phosphate — high precipitation risk with added calcium salts." },
];

type PairTuple = [string, string, "C" | "I", string?];

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
];

export type YSiteVerdict =
  | { status: "C"; note?: string }
  | { status: "I"; note?: string }
  | { status: "ND"; note?: string };

const PAIR_MAP = new Map<string, { s: "C" | "I"; note?: string }>();
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
  "Verdicts are taken from Trissel's-based monographs (CHEO, ANMF, Queensland Health) and Kenneally et al., Am J Health-Syst Pharm 2023 — a dedicated Y-site study of CaCl₂ with milrinone, epinephrine, vasopressin and heparin. Compatibility can change with concentration and diluent; confirm unusual combinations with your hospital pharmacy.";
