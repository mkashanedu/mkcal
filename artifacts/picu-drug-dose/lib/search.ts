/**
 * Smart drug search (P7) — tolerant matching for busy clinical use:
 *  - plain substring matching (as before)
 *  - brand / alternate names via an alias table (Lasix → Furosemide,
 *    Ventolin → Salbutamol, Acetaminophen → Paracetamol, …)
 *  - small typos: a query of 4+ letters matches a drug-name word within
 *    edit distance 1 (2 for queries of 7+ letters)
 * Pure functions, no imports — safe to use from any screen.
 */

export const DRUG_ALIASES: Record<string, string> = {
  acetaminophen: "paracetamol",
  tylenol: "paracetamol",
  lasix: "furosemide",
  adrenalin: "epinephrine",
  adrenaline: "epinephrine",
  noradrenalin: "norepinephrine",
  noradrenaline: "norepinephrine",
  albuterol: "salbutamol",
  ventolin: "salbutamol",
  rocephin: "ceftriaxone",
  vancocin: "vancomycin",
  meronem: "meropenem",
  precedex: "dexmedetomidine",
  versed: "midazolam",
  ketalar: "ketamine",
  gtn: "nitroglycerin",
  augmentin: "amoxicillin-clavulanate",
  "co-amoxiclav": "amoxicillin-clavulanate",
  coamoxiclav: "amoxicillin-clavulanate",
  zithromax: "azithromycin",
  flagyl: "metronidazole",
  diflucan: "fluconazole",
  brufen: "ibuprofen",
  advil: "ibuprofen",
  mgso4: "magnesium",
  cacl2: "calcium chloride",
  solumedrol: "methylprednisolone",
  medrol: "methylprednisolone",
  decadron: "dexamethasone",
  aminophylline: "aminophylline",
  theophylline: "aminophylline",
  // Pakistani market brand names (verified present in the dataset, Nov 2026)
  panadol: "paracetamol",
  lanoxin: "digoxin",
  inderal: "propranolol",
  aldactone: "spironolactone",
  tegral: "carbamazepine",
  epilim: "sodium valproate",
  rivotril: "clonazepam",
  septran: "co-trimoxazole",
  gravinate: "dimenhydrinate",
  risek: "omeprazole",
  deltacortril: "prednisolone",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[n];
}

/**
 * Does a drug with the given text fields match the user's query?
 * `fields` should include the drug name first (fuzzy matching applies to
 * the name only, so typos never produce wild indication matches).
 */
export function matchesDrugQuery(fields: string[], rawQuery: string): boolean {
  const q = normalize(rawQuery);
  if (!q) return true;

  const normFields = fields.filter(Boolean).map(normalize);
  const name = normFields[0] ?? "";

  // Direct substring on any field.
  if (normFields.some((f) => f.includes(q))) return true;

  // Alias expansion: whole query, and each query token.
  const aliasTargets = new Set<string>();
  if (DRUG_ALIASES[q]) aliasTargets.add(DRUG_ALIASES[q]);
  q.split(" ").forEach((tok) => {
    if (DRUG_ALIASES[tok]) aliasTargets.add(DRUG_ALIASES[tok]);
  });
  for (const t of aliasTargets) {
    if (normFields.some((f) => f.includes(t))) return true;
  }

  // Typo tolerance against the drug name's words.
  if (q.length >= 4 && !q.includes(" ")) {
    const maxDist = q.length >= 7 ? 2 : 1;
    const words = name.split(/[\s-]+/).filter(Boolean);
    for (const w of words) {
      if (Math.abs(w.length - q.length) <= maxDist && editDistance(q, w) <= maxDist) {
        return true;
      }
    }
    // Also allow the query to be a near-prefix of the full name
    // (e.g. "amiodrone" for "amiodarone").
    if (editDistance(q, name.slice(0, q.length)) <= maxDist) return true;
  }

  return false;
}
