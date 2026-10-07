// Combined formulary: base 174 drugs + 317 Harriet Lane 24th ed. drugs = 491 total
// This file wires the HL drug batches into the formulary without modifying formularyData.ts
import {
  FORMULARY_DRUGS as BASE_FORMULARY_DRUGS,
  FORMULARY_CATEGORIES,
  type FormularyDrug,
  type FormularyCategory,
} from './formularyData';
import { HL_NEW_DRUGS_1 } from './hlNewDrugs1';
import { HL_NEW_DRUGS_2 } from './hlNewDrugs2';
import { HL_NEW_DRUGS_3 } from './hlNewDrugs3';
import { HL_NEW_DRUGS_4 } from './hlNewDrugs4';

export const FORMULARY_DRUGS: FormularyDrug[] = [
  ...BASE_FORMULARY_DRUGS,
  ...HL_NEW_DRUGS_1,
  ...HL_NEW_DRUGS_2,
  ...HL_NEW_DRUGS_3,
  ...HL_NEW_DRUGS_4,
];

export { FORMULARY_CATEGORIES };
export type { FormularyDrug, FormularyCategory };
