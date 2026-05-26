import { useState } from "react";
import { useWeight } from "@/hooks/use-weight";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Syringe, Activity, Pill } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   DRUG DATABASE
   All calculations are mcg/kg/min for inotropes and mg(or mcg)/kg/hr for sedatives.

   syringeFactor: mg/kg to add to a 50ml syringe using weight-based dilution.
     Formula: Amount(mg) = syringeFactor × weight
     Concentration(mcg/ml) = syringeFactor × weight × 1000 / 50
     Rate(ml/hr) = Dose(mcg/kg/min) × 3 / syringeFactor
   This produces a weight-normalised syringe where rate directly reflects dose.
───────────────────────────────────────────────────────────────────────────*/

interface Drug {
  id: string;
  name: string;
  highAlert: boolean;
  range: string;
  neonateRange?: string;          /* Harriet Lane neonatal-specific range */
  neonateNote?: string;           /* Extra caution for neonates */
  instructions: string;
  extravasation?: string;
  monitoring: string;
  ysite: string;
  concentration: number;          /* mcg/ml for fixed-bag calculation */
  isHourly?: boolean;             /* true = mg or mcg /kg/hr; false = mcg/kg/min */
  syringeFactor?: number;         /* mg/kg in 50ml syringe (inotropes only) */
  syringeUnit?: string;           /* display unit label */
  loadingDose?: string;           /* e.g. Milrinone loading */
}

const INOTROPES: Drug[] = [
  {
    id: "dopamine",
    name: "Dopamine",
    highAlert: false,
    range: "2 – 20 mcg/kg/min",
    neonateRange: "2 – 10 mcg/kg/min",
    neonateNote: "Neonates: start at lowest end; higher doses cause excessive vasoconstriction.",
    instructions: "Dilute 50 mg in D5W/NS to 250 ml (200 mcg/ml). Renal protection <5 mcg/kg/min; Inotrope 5–10; Vasopressor >10.",
    monitoring: "HR, BP, Urine Output, peripheral perfusion.",
    ysite: "Incompatible with alkaline solutions (Sodium Bicarb, Furosemide).",
    concentration: 200,
    syringeFactor: 3,
    syringeUnit: "mcg/kg/min",
  },
  {
    id: "dobutamine",
    name: "Dobutamine",
    highAlert: false,
    range: "2 – 20 mcg/kg/min",
    neonateRange: "2 – 10 mcg/kg/min",
    neonateNote: "Neonates: may cause tachycardia at higher doses. Monitor HR closely.",
    instructions: "Dilute 50 mg in D5W/NS to 250 ml (200 mcg/ml). Indicated for heart failure/low CO. Loses efficacy after 72hrs continuous infusion.",
    monitoring: "HR, BP. Watch for tachycardia, arrhythmias.",
    ysite: "Incompatible with alkaline solutions. Compatible with Dopamine, Heparin.",
    concentration: 200,
    syringeFactor: 3,
    syringeUnit: "mcg/kg/min",
  },
  {
    id: "epinephrine",
    name: "Epinephrine (Adrenaline)",
    highAlert: true,
    range: "0.01 – 1 mcg/kg/min",
    neonateRange: "0.01 – 0.5 mcg/kg/min",
    neonateNote: "Neonates: extreme sensitivity; start at 0.01 mcg/kg/min. Causes hyperglycaemia.",
    instructions: "Dilute 1 mg in 100 ml NS (10 mcg/ml). Central line preferred; peripheral for emergency only.",
    extravasation: "Extravasation risk — causes tissue necrosis. Treat with phentolamine 0.1–0.2 mg/kg SC locally.",
    monitoring: "Continuous ECG, HR, BP, Blood Glucose every 1–2 hrs, SpO2.",
    ysite: "Compatible with Amiodarone, Milrinone, Fentanyl, Dobutamine.",
    concentration: 10,
    syringeFactor: 0.3,
    syringeUnit: "mcg/kg/min",
  },
  {
    id: "norepinephrine",
    name: "Norepinephrine",
    highAlert: true,
    range: "0.01 – 2 mcg/kg/min",
    neonateRange: "0.01 – 1 mcg/kg/min",
    neonateNote: "Neonates: use with extreme caution. Risk of renal / mesenteric ischaemia.",
    instructions: "Dilute 4 mg in 250 ml NS/D5W (16 mcg/ml). Central line mandatory — NEVER give peripherally.",
    extravasation: "Extravasation causes skin/tissue necrosis. Treat immediately with phentolamine 0.1 mg local injection.",
    monitoring: "Continuous invasive BP preferred, HR, urine output, limb perfusion.",
    ysite: "Compatible with Amiodarone, Milrinone, Fentanyl, Vasopressin.",
    concentration: 16,
    syringeFactor: 0.3,
    syringeUnit: "mcg/kg/min",
  },
  {
    id: "milrinone",
    name: "Milrinone",
    highAlert: false,
    range: "0.25 – 0.75 mcg/kg/min",
    neonateRange: "0.2 – 0.5 mcg/kg/min",
    neonateNote: "Neonates: omit loading dose — causes significant hypotension. Start infusion directly.",
    loadingDose: "Optional: 50 mcg/kg IV over 10–15 min (may cause hypotension — omit in neonates).",
    instructions: "Dilute to 200 mcg/ml in NS or D5W. PDE-III inhibitor — inodilatator. Does not cause tachycardia.",
    monitoring: "HR, BP, continuous ECG. Monitor K+ and Mg²⁺ — correct hypokalaemia first.",
    ysite: "Compatible with most drugs. Incompatible with Furosemide (precipitates).",
    concentration: 200,
    syringeFactor: 0.3,
    syringeUnit: "mcg/kg/min",
  },
];

const SEDATIVES: Drug[] = [
  {
    id: "fentanyl",
    name: "Fentanyl",
    highAlert: true,
    range: "1 – 4 mcg/kg/hr (infusion)",
    neonateRange: "0.5 – 2 mcg/kg/hr",
    neonateNote: "Neonates: increased sensitivity, longer half-life. Avoid rapid IV bolus — causes chest wall rigidity.",
    instructions: "Bolus: 1–2 mcg/kg slow IV over 3–5 min. Infusion: dilute 500 mcg in 100 ml NS (5 mcg/ml).",
    monitoring: "Respiratory rate, SpO2, HR, BP, pain/sedation score every 2 hrs.",
    ysite: "Compatible with Midazolam, Propofol, Vecuronium. Incompatible with Thiopental.",
    concentration: 5,
    isHourly: true,
  },
  {
    id: "midazolam",
    name: "Midazolam",
    highAlert: false,
    range: "0.05 – 0.4 mg/kg/hr (infusion)",
    neonateRange: "0.01 – 0.06 mg/kg/hr",
    neonateNote: "Neonates: risk of hypotension and paradoxical agitation. Accumulates in renal/hepatic impairment.",
    instructions: "Bolus: 0.05–0.1 mg/kg IV. Infusion: dilute 15 mg in 15 ml NS (1 mg/ml) or 50 mg in 50 ml NS.",
    monitoring: "Respiratory rate, BP, sedation score (COMFORT-B or SBS). Daily sedation vacation.",
    ysite: "Compatible with NS/D5W, Fentanyl, Morphine, Dopamine. Incompatible with Furosemide.",
    concentration: 1,
    isHourly: true,
  },
];

const OTHERS: Drug[] = [
  {
    id: "omeprazole",
    name: "Inj. Risek (Omeprazole IV)",
    highAlert: false,
    range: "1 – 2 mg/kg/day",
    neonateRange: "0.5 – 1 mg/kg/day",
    neonateNote: "Neonates: limited data. Use 0.5 mg/kg/day; monitor for hepatotoxicity.",
    instructions: "Standard: 1 mg/kg/day IV once daily. Severe/GI bleed: 2 mg/kg/day divided 12-hourly. MAX 40 mg/day. Reconstitute in 100 ml NS; infuse over 20–30 min.",
    monitoring: "Liver function if prolonged >2 weeks. Magnesium levels on long-term use.",
    ysite: "Do not mix with other drugs. Flush line before/after.",
    concentration: 1,
    isHourly: false,
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────────────────────────────────────────*/

function SyringeCard({ drug, weight }: { drug: Drug; weight: number }) {
  const [dose, setDose] = useState("");

  if (!drug.syringeFactor) return null;

  const factor = drug.syringeFactor;
  const amountMg = (factor * weight).toFixed(2);
  const concMcgMl = ((factor * weight * 1000) / 50).toFixed(1);

  /* Rate (ml/hr) = Dose(mcg/kg/min) × 3 / factor */
  const parsedDose = parseFloat(dose);
  const rate = !isNaN(parsedDose) && parsedDose > 0
    ? ((parsedDose * 3) / factor).toFixed(2)
    : "—";

  return (
    <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-950/30 dark:border-teal-800 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Syringe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide">
          50 ml Syringe Preparation (Weight-Based)
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="rounded bg-white dark:bg-teal-900/40 p-2 border border-teal-100 dark:border-teal-800">
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium uppercase">Add to 50 ml</p>
          <p className="text-sm font-bold text-teal-800 dark:text-teal-200">{amountMg} mg</p>
        </div>
        <div className="rounded bg-white dark:bg-teal-900/40 p-2 border border-teal-100 dark:border-teal-800">
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium uppercase">Concentration</p>
          <p className="text-sm font-bold text-teal-800 dark:text-teal-200">{concMcgMl} mcg/ml</p>
        </div>
        <div className="rounded bg-white dark:bg-teal-900/40 p-2 border border-teal-100 dark:border-teal-800">
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium uppercase">Rate</p>
          <p className="text-sm font-bold text-teal-800 dark:text-teal-200">{rate} ml/hr</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-xs text-teal-700 dark:text-teal-300 whitespace-nowrap">Dose (mcg/kg/min)</Label>
        <Input
          type="number"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
          placeholder="Enter dose"
          className="h-8 text-sm border-teal-300 dark:border-teal-700"
        />
      </div>
      <p className="text-[10px] text-teal-600 dark:text-teal-500 mt-2">
        Formula: Add ({factor} mg/kg × {weight} kg) to make up 50 ml with NS or D5W.
        Rate (ml/hr) = Dose × {(3 / factor).toFixed(0)}
      </p>
    </div>
  );
}

function DrugCard({ drug, weight }: { drug: Drug; weight: number }) {
  const [dose, setDose] = useState("");
  const isNeonate = weight > 0 && weight < 5;

  const calculateRate = () => {
    if (!weight || !dose) return "0.00";
    const d = parseFloat(dose);
    if (isNaN(d) || d <= 0) return "0.00";
    if (drug.isHourly) {
      /* mg(or mcg)/kg/hr → ml/hr */
      return ((d * weight) / drug.concentration).toFixed(2);
    }
    /* mcg/kg/min → ml/hr */
    return ((d * weight * 60) / drug.concentration).toFixed(2);
  };

  const maxDayDose = drug.id === "omeprazole" && weight > 0
    ? Math.min(2 * weight, 40).toFixed(0)
    : null;

  return (
    <div className="border-b last:border-0 pb-5 last:pb-0 pt-2">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div>
          <h3 className="font-semibold text-base leading-tight">{drug.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isNeonate && drug.neonateRange ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Neonate range: {drug.neonateRange}
              </span>
            ) : (
              <span>Dose: {drug.range}</span>
            )}
          </p>
        </div>
        {drug.highAlert && (
          <Badge variant="destructive" className="text-[10px] uppercase shrink-0">
            High Alert
          </Badge>
        )}
      </div>

      {/* Neonatal warning */}
      {isNeonate && drug.neonateNote && (
        <div className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-2 mb-3">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{drug.neonateNote}</span>
        </div>
      )}

      {/* Loading dose */}
      {drug.loadingDose && (
        <p className="text-xs text-muted-foreground mb-1.5">
          <span className="font-semibold text-foreground">Loading:</span> {drug.loadingDose}
        </p>
      )}

      {/* Drug details */}
      <p className="text-xs text-muted-foreground mb-1">
        <span className="font-semibold text-foreground">Dilution:</span> {drug.instructions}
      </p>
      {drug.monitoring && (
        <p className="text-xs text-muted-foreground mb-1">
          <span className="font-semibold text-foreground">Monitoring:</span> {drug.monitoring}
        </p>
      )}
      {drug.ysite && (
        <p className="text-xs text-muted-foreground mb-1">
          <span className="font-semibold text-foreground">Y-Site:</span> {drug.ysite}
        </p>
      )}
      {drug.extravasation && (
        <p className="text-xs text-destructive font-medium mb-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {drug.extravasation}
        </p>
      )}

      {/* Max dose display for omeprazole */}
      {maxDayDose && (
        <p className="text-xs font-semibold text-primary mb-2">
          Max daily dose for {weight} kg: {maxDayDose} mg/day
        </p>
      )}

      {/* Rate calculator */}
      {drug.id !== "omeprazole" && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <Label className="text-xs">
              Dose ({drug.isHourly ? drug.range.split(" ")[0] + " range" : "mcg/kg/min"})
            </Label>
            <Input
              type="number"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="Enter dose"
              className="mt-1 h-9"
              data-testid={`input-dose-${drug.id}`}
            />
          </div>
          <div>
            <Label className="text-xs">Rate (ml/hr)</Label>
            <div
              className="mt-1 h-9 flex items-center px-3 bg-muted rounded-md font-mono text-sm border"
              data-testid={`display-rate-${drug.id}`}
            >
              {weight > 0 ? calculateRate() : "—"}
            </div>
          </div>
        </div>
      )}

      {/* 50 ml syringe prep (inotropes only) */}
      {weight > 0 && drug.syringeFactor && (
        <SyringeCard drug={drug} weight={weight} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────*/

export default function DrugDosing() {
  const [weight, setWeight] = useWeight();
  const wNum = typeof weight === "number" ? weight : parseFloat(String(weight)) || 0;
  const isNeonate = wNum > 0 && wNum < 5;

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-24">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-1">Drug Dosing</h1>
      <p className="text-xs text-muted-foreground mb-4">
        Harriet Lane Handbook · Nelson Textbook of Pediatrics
      </p>

      {/* Weight input */}
      <Card className="mb-4">
        <CardContent className="pt-5 pb-4">
          <Label className="text-sm font-semibold">Patient Weight (kg)</Label>
          <Input
            type="number"
            value={weight === "" ? "" : weight}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
            placeholder="e.g. 15.5"
            className="mt-2"
            data-testid="input-weight"
          />
          {isNeonate && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-3 h-3" />
              <span className="font-semibold">Neonatal weight detected (&lt;5 kg) — neonatal dose ranges shown below.</span>
            </div>
          )}
          {wNum > 0 && !isNeonate && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Pediatric doses apply. All infusion rates auto-calculated.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Accordion sections */}
      <Accordion type="multiple" className="w-full space-y-3" defaultValue={["inotropes"]}>

        {/* ── INOTROPES ── */}
        <AccordionItem value="inotropes" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">Inotropes &amp; Vasopressors</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 space-y-1 divide-y divide-border">
            {INOTROPES.map((drug) => (
              <DrugCard key={drug.id} drug={drug} weight={wNum} />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* ── SEDATION ── */}
        <AccordionItem value="sedatives" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">Sedation &amp; Analgesia</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 space-y-1 divide-y divide-border">
            {SEDATIVES.map((drug) => (
              <DrugCard key={drug.id} drug={drug} weight={wNum} />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* ── OTHER ── */}
        <AccordionItem value="others" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">Other Medications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 space-y-1 divide-y divide-border">
            {OTHERS.map((drug) => (
              <DrugCard key={drug.id} drug={drug} weight={wNum} />
            ))}
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
