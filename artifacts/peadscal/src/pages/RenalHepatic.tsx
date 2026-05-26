import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DRUGS = [
  { name: "Vancomycin", normal: "15mg/kg q6h", mild: "Extend interval", mod: "Therapeutic drug monitoring mandatory", hepatic: "-" },
  { name: "Gentamicin", normal: "5-7mg/kg q24h", mild: "Extend to 24-48h", mod: "Avoid without TDM", hepatic: "-" },
  { name: "Acyclovir", normal: "10mg/kg q8h", mild: "No change", mod: "Reduce dose by 50% (<25 GFR)", hepatic: "-" },
  { name: "Fluconazole", normal: "6-12mg/kg q24h", mild: "Reduce dose 50%", mod: "Reduce dose 50%", hepatic: "-" },
  { name: "Meropenem", normal: "20-40mg/kg q8h", mild: "1g q12h", mod: "500mg q24h (<10 GFR)", hepatic: "-" },
  { name: "Morphine", normal: "0.05-0.1mg/kg", mild: "Caution (active metabolite)", mod: "Avoid/Reduce", hepatic: "Avoid" },
  { name: "Midazolam", normal: "0.1mg/kg", mild: "No change", mod: "No change", hepatic: "Avoid prolonged infusion" },
];

export default function RenalHepatic() {
  const [ht, setHt] = useState("");
  const [cr, setCr] = useState("");

  const height = parseFloat(ht);
  const creat = parseFloat(cr);

  // eGFR (ml/min/1.73m²) = (0.413 × Height in cm) / Serum Creatinine (mg/dl)
  const egfr = (height && creat) ? ((0.413 * height) / creat).toFixed(1) : "";

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">Renal & Hepatic</h1>
      
      <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6">
          <h2 className="font-bold text-lg mb-4 text-amber-700 dark:text-amber-500">eGFR Estimator (Schwartz)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Height (cm)</Label>
              <Input type="number" value={ht} onChange={e => setHt(e.target.value)} className="mt-1 bg-background" />
            </div>
            <div>
              <Label>Serum Cr (mg/dl)</Label>
              <Input type="number" value={cr} onChange={e => setCr(e.target.value)} className="mt-1 bg-background" />
            </div>
          </div>
          {egfr && (
            <div className="mt-4 flex items-center justify-between border-t border-amber-500/20 pt-4">
              <span className="text-sm font-semibold uppercase text-amber-800 dark:text-amber-400">Est. GFR</span>
              <span className="text-2xl font-bold text-amber-600">{egfr} ml/min</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {DRUGS.map(d => (
          <Card key={d.name}>
            <CardContent className="pt-4 pb-4">
              <h3 className="font-bold text-base mb-2 text-primary">{d.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Normal</span>
                  <span className="font-medium text-right">{d.normal}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Mild Renal (30-60)</span>
                  <span className="font-medium text-right text-amber-600">{d.mild}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Severe Renal (&lt;30)</span>
                  <span className="font-medium text-right text-destructive">{d.mod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hepatic</span>
                  <span className="font-medium text-right text-amber-600">{d.hepatic}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
