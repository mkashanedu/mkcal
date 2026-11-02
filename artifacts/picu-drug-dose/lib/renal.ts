/**
 * Renal caution flags for drug pages.
 *
 * Two levels, both honest about what the app actually knows:
 *  - "data":    the drug carries a renalAdjustment table in the dataset
 *               (44 drugs) — the flag points at the Renal section that
 *               already exists further down the same page.
 *  - "caution": the drug is well known to be renally cleared / to need
 *               adjustment in renal impairment, but the app has NO renal
 *               dosing table for it — the flag says exactly that and
 *               sends the user to the monograph / pharmacy instead of
 *               inventing numbers.
 */

export interface RenalCaution {
  level: "data" | "caution";
  text: string;
}

// Renally-cleared drugs with no renalAdjustment table in the dataset.
const RENALLY_CLEARED_NO_TABLE = new Set<string>([
  "fx-amikacin-iv",
  "fx-amikacin-sulfate",
  "fx-cefotaxime",
  "fx-cefepime",
  "fx-enoxaparin",
  "fx-lithium",
  "fx-gabapentin",
  "fx-metformin",
  "fx-ganciclovir",
  "fx-valganciclovir",
  "fx-allopurinol",
  "fx-atenolol",
  "fx-valacyclovir",
  "fx-aciclovir-iv",
]);

export function renalCaution(drug: {
  id: string;
  renalAdjustment?: unknown[];
}): RenalCaution | null {
  if (drug.renalAdjustment && drug.renalAdjustment.length > 0) {
    return {
      level: "data",
      text: "This drug has renal dose adjustments — see the Renal section further down this page before prescribing in renal impairment.",
    };
  }
  if (RENALLY_CLEARED_NO_TABLE.has(drug.id)) {
    return {
      level: "caution",
      text: "Renally cleared — dose adjustment is usually required in renal impairment. This app has no renal dosing table for this drug; check the formulary monograph or pharmacy.",
    };
  }
  return null;
}
