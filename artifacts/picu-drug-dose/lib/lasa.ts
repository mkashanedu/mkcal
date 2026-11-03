/**
 * LASA — look-alike / sound-alike drug name pairs (Point 5).
 * Only pairs where BOTH drugs exist in the PeadsCal dataset
 * (verified against constants/allDrugs.ts, Nov 2026).
 */
export const LASA_PAIRS: { a: string; aName: string; b: string; bName: string }[] = [
  { a: "dopamine", aName: "Dopamine", b: "dobutamine", bName: "Dobutamine" },
  { a: "epinephrine", aName: "Epinephrine", b: "norepinephrine", bName: "Norepinephrine" },
  { a: "amiodarone", aName: "Amiodarone", b: "fx-amlodipine", bName: "Amlodipine" },
  { a: "fx-hydralazine-hydrochloride", aName: "Hydralazine", b: "fx-hydroxyzine", bName: "Hydroxyzine" },
  { a: "prednisolone", aName: "Prednisolone", b: "methylprednisolone", bName: "Methylprednisolone" },
];

export function lasaPartner(drugId: string): { id: string; name: string } | null {
  for (const p of LASA_PAIRS) {
    if (p.a === drugId) return { id: p.b, name: p.bName };
    if (p.b === drugId) return { id: p.a, name: p.aName };
  }
  return null;
}
