/**
 * High-alert medication helper.
 *
 * A drug is shown as HIGH ALERT when either:
 *  1. its data entry already carries `highAlert: true` (hand-checked list), or
 *  2. its (normalised) name matches the curated list below — based on the
 *     ISMP high-alert medication classes for acute / paediatric care:
 *     adrenergic infusions, anticoagulants, thrombolytics, insulin,
 *     concentrated electrolytes, opioids, neuromuscular blockers and
 *     narrow-therapeutic-index drugs.
 *
 * The list is matched on exact normalised names (never substrings), so oral
 * supplements etc. are not flagged by accident — e.g. "Potassium
 * Supplements" (oral) is NOT flagged, while "Potassium Chloride (KCl)"
 * (the IV concentrate entry) is. This helper never changes any dose; it
 * only drives a visual badge and a double-check reminder.
 */

export interface HighAlertInfo {
  high: boolean;
  /** Short class label for the badge/banner, e.g. "Opioid". */
  reason?: string;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\b(hcl|hydrochloride)\b/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Normalised name -> class label. Canonical (hand-checked) entries. */
const HIGH_ALERT_BY_NAME: Record<string, string> = {
  // Adrenergic / vasoactive infusions & emergency adrenergics
  "epinephrine": "Adrenergic — verify concentration",
  "epinephrine 1 1000": "Adrenergic — verify concentration",
  "epinephrine infusion": "Adrenergic infusion",
  "norepinephrine": "Vasoactive infusion",
  "dopamine": "Vasoactive infusion",
  "dobutamine": "Vasoactive infusion",
  "milrinone": "Vasoactive infusion",
  "vasopressin": "Vasoactive infusion",
  "terlipressin": "Vasoactive",
  "levosimendan": "Vasoactive infusion",
  "sodium nitroprusside": "Vasoactive infusion — cyanide risk",
  "labetalol": "IV antihypertensive",
  // Anticoagulants / thrombolytics
  "heparin": "Anticoagulant",
  "enoxaparin": "Anticoagulant",
  "warfarin": "Anticoagulant",
  "dabigatran etexilate mesylate": "Anticoagulant",
  "rivaroxaban": "Anticoagulant",
  "alteplase": "Thrombolytic",
  // Insulin
  "glucose insulin": "Insulin — hypoglycaemia risk",
  "insulin": "Insulin — hypoglycaemia risk",
  // Concentrated electrolytes
  "potassium chloride kcl": "Concentrated electrolyte",
  "potassium chloride": "Concentrated electrolyte",
  "sodium chloride 3%": "Hypertonic saline",
  "calcium chloride 10%": "Concentrated electrolyte",
  "magnesium sulfate": "IV electrolyte — respiratory depression risk",
  "sodium bicarbonate": "Concentrated electrolyte",
  // Opioids
  "fentanyl": "Opioid",
  "morphine": "Opioid",
  "hydromorphone": "Opioid",
  "oxycodone": "Opioid",
  "methadone": "Opioid — long half-life",
  "nalbuphine": "Opioid",
  // Neuromuscular blockers
  "rocuronium": "Neuromuscular blocker — airway",
  "atracurium": "Neuromuscular blocker — airway",
  "cisatracurium": "Neuromuscular blocker — airway",
  "vecuronium": "Neuromuscular blocker — airway",
  "suxamethonium": "Neuromuscular blocker — airway",
  // Narrow therapeutic index / otherwise hand-flagged classes
  "digoxin": "Narrow therapeutic index",
  "amiodarone": "Antiarrhythmic",
  "lidocaine": "Antiarrhythmic / local anaesthetic",
  "propofol": "Sedative infusion — PRIS risk",
  "epoprostenol": "Prostacyclin infusion — never interrupt",
  "treprostinil": "Prostacyclin infusion — never interrupt",
  "alprostadil": "Prostaglandin infusion — apnoea risk",
};

export function highAlertInfo(drug: {
  name: string;
  genericName?: string;
  highAlert?: boolean;
}): HighAlertInfo {
  const candidates = [drug.name, drug.genericName ?? ""]
    .map(norm)
    .filter((s) => s.length > 0);
  for (const c of candidates) {
    const reason = HIGH_ALERT_BY_NAME[c];
    if (reason) return { high: true, reason };
  }
  if (drug.highAlert) return { high: true, reason: "High-alert medication" };
  return { high: false };
}

export function isHighAlertDrug(drug: {
  name: string;
  genericName?: string;
  highAlert?: boolean;
}): boolean {
  return highAlertInfo(drug).high;
}
