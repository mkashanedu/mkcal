// Unified calculator dataset: the hand-checked calculator drugs
// (constants/drugs.ts) plus the formulary drugs converted into calculator
// format (constants/formularyConverted.ts). The hand-checked entries come
// first and are canonical — converted entries never duplicate them.
import { DRUGS as BASE_DRUGS, type Drug } from "./drugs";
import { CONVERTED_DRUGS } from "./formularyConverted";

export const DRUGS: Drug[] = [...BASE_DRUGS, ...CONVERTED_DRUGS];

export { CATEGORIES, calculateDose } from "./drugs";
export type { Drug, DrugCategory, DoseRange } from "./drugs";
