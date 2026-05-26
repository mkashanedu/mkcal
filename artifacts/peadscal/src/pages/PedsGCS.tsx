import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const GCS_ITEMS = {
  eye: [
    { val: 4, text: "Spontaneous" },
    { val: 3, text: "To voice/sound" },
    { val: 2, text: "To pain" },
    { val: 1, text: "None" }
  ],
  verbal: [
    { val: 5, text: "Alert/coos/babbles (infant) / Oriented (child)" },
    { val: 4, text: "Less than usual ability / Confused" },
    { val: 3, text: "Crying but consolable / Inappropriate words" },
    { val: 2, text: "Moaning to pain / Incomprehensible sounds" },
    { val: 1, text: "None" }
  ],
  motor: [
    { val: 6, text: "Obeys commands / Normal spontaneous movement" },
    { val: 5, text: "Localizes pain / Withdraws to touch" },
    { val: 4, text: "Withdraws to pain" },
    { val: 3, text: "Abnormal flexion (Decorticate)" },
    { val: 2, text: "Abnormal extension (Decerebrate)" },
    { val: 1, text: "None" }
  ]
};

export default function PedsGCS() {
  const [scores, setScores] = useState({ e: 0, v: 0, m: 0 });

  const total = scores.e && scores.v && scores.m ? scores.e + scores.v + scores.m : 0;
  
  let severity = { label: "Complete all sections", color: "text-muted-foreground", bg: "bg-muted" };
  if (total >= 13) severity = { label: "Mild", color: "text-green-600", bg: "bg-green-600/10 border-green-600/20 border" };
  else if (total >= 9) severity = { label: "Moderate", color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/20 border" };
  else if (total > 0) severity = { label: "Severe — Intubation Risk", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20 border" };

  const renderSection = (title: string, key: 'e'|'v'|'m', options: any[]) => (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-3">{title}</h2>
      <div className="space-y-2">
        {options.map(opt => (
          <div 
            key={opt.val}
            onClick={() => setScores(s => ({ ...s, [key]: opt.val }))}
            className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${scores[key] === opt.val ? 'bg-accent/10 border-accent/40 shadow-sm' : 'bg-card hover:bg-muted'}`}
          >
            <span className={`text-sm font-medium ${scores[key] === opt.val ? 'text-accent' : 'text-foreground'}`}>{opt.text}</span>
            <span className={`text-lg font-bold ${scores[key] === opt.val ? 'text-accent' : 'text-muted-foreground'}`}>{opt.val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">Pediatric GCS</h1>
      
      {total > 0 && (
        <Card className={`mb-6 ${severity.bg}`}>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Total Score</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold">{total}</p>
                <p className="text-sm text-muted-foreground">/ 15</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-lg ${severity.color}`}>{severity.label}</p>
              <p className="text-xs text-muted-foreground mt-1">Reassess in 30 mins</p>
            </div>
          </CardContent>
        </Card>
      )}

      {renderSection("Eye Opening (E)", 'e', GCS_ITEMS.eye)}
      {renderSection("Verbal Response (V)", 'v', GCS_ITEMS.verbal)}
      {renderSection("Motor Response (M)", 'm', GCS_ITEMS.motor)}

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
