import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const BUNDLES = [
  {
    id: "vap",
    name: "VAP Bundle",
    items: [
      { id: "vap-1", text: "Head of bed elevation 30–45°" },
      { id: "vap-2", text: "Oral hygiene with chlorhexidine 0.12% every 6hrs" },
      { id: "vap-3", text: "Suction only when clinically indicated" },
      { id: "vap-4", text: "Cuff pressure maintained 20–30 cmH2O" },
      { id: "vap-5", text: "Spontaneous breathing trial assessed daily" },
      { id: "vap-6", text: "Sedation vacation assessed daily" },
      { id: "vap-7", text: "Gastric residuals checked" },
      { id: "vap-8", text: "DVT prophylaxis assessed" },
    ]
  },
  {
    id: "clabsi",
    name: "CLABSI Bundle",
    items: [
      { id: "clabsi-1", text: "Hand hygiene performed before line access" },
      { id: "clabsi-2", text: "Maximal sterile barrier during insertion" },
      { id: "clabsi-3", text: "Chlorhexidine skin antisepsis (2% in 70% IPA)" },
      { id: "clabsi-4", text: "Optimal catheter site selection (avoid femoral if possible)" },
      { id: "clabsi-5", text: "Daily review of line necessity — remove if no longer needed" },
      { id: "clabsi-6", text: "Dressing integrity checked and intact" },
      { id: "clabsi-7", text: "Needleless connector disinfected before access" },
      { id: "clabsi-8", text: "Line documented in care bundle log" },
    ]
  }
];

export default function Checklists() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [shiftDate, setShiftDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const saved = localStorage.getItem(`peadscal_bundles_${shiftDate}`);
    if (saved) setChecked(JSON.parse(saved));
    else setChecked({});
  }, [shiftDate]);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(`peadscal_bundles_${shiftDate}`, JSON.stringify(next));
  };

  const markAll = (bundleId: string, state: boolean) => {
    const bundle = BUNDLES.find(b => b.id === bundleId);
    if (!bundle) return;
    const next = { ...checked };
    bundle.items.forEach(i => next[i.id] = state);
    setChecked(next);
    localStorage.setItem(`peadscal_bundles_${shiftDate}`, JSON.stringify(next));
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">Care Bundles</h1>
      
      <Card className="mb-4">
        <CardContent className="pt-4 pb-4 flex items-center justify-between">
          <span className="text-sm font-semibold">Date / Shift</span>
          <Input 
            type="date" 
            value={shiftDate} 
            onChange={(e) => setShiftDate(e.target.value)}
            className="w-[160px] h-8"
          />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground mb-6">
        Complete bundle compliance reduces infection risk by &gt;50% (IHI Protocol).
      </p>

      {BUNDLES.map(bundle => {
        const total = bundle.items.length;
        const completed = bundle.items.filter(i => checked[i.id]).length;
        const pct = Math.round((completed / total) * 100);

        return (
          <Card key={bundle.id} className="mb-6 shadow-sm border-border/80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">{bundle.name}</h2>
                <span className="font-bold text-primary">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2 mb-6" />
              
              <div className="space-y-4">
                {bundle.items.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Checkbox 
                      id={item.id} 
                      checked={!!checked[item.id]} 
                      onCheckedChange={() => toggle(item.id)}
                      className="mt-1"
                    />
                    <label 
                      htmlFor={item.id}
                      className={`text-sm leading-snug cursor-pointer ${checked[item.id] ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button size="sm" variant="outline" onClick={() => markAll(bundle.id, true)} className="flex-1">Mark All</Button>
                <Button size="sm" variant="outline" onClick={() => markAll(bundle.id, false)} className="flex-1">Clear All</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
