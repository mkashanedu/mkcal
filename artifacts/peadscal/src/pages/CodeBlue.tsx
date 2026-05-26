import { useState, useEffect, useRef } from "react";
import { useWeight } from "@/hooks/use-weight";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, HeartPulse } from "lucide-react";

const EMERGENCY_DRUGS = [
  { name: "Epinephrine (1:10,000)", dose: "0.01 mg/kg", max: "1mg", note: "VF/pVT/Asystole/PEA", calc: (w: number) => Math.min(w * 0.01, 1).toFixed(2) + " mg" },
  { name: "Amiodarone", dose: "5 mg/kg", max: "300mg", note: "VF/pVT", calc: (w: number) => Math.min(w * 5, 300).toFixed(1) + " mg" },
  { name: "Adenosine (1st dose)", dose: "0.1 mg/kg", max: "6mg", note: "SVT", calc: (w: number) => Math.min(w * 0.1, 6).toFixed(1) + " mg" },
  { name: "Atropine", dose: "0.02 mg/kg", max: "0.5mg", note: "Bradycardia", calc: (w: number) => Math.max(Math.min(w * 0.02, 0.5), 0.1).toFixed(2) + " mg" },
  { name: "Sodium Bicarbonate", dose: "1 mEq/kg", max: "-", note: "Metabolic acidosis", calc: (w: number) => (w * 1).toFixed(1) + " mEq" },
  { name: "Calcium Gluconate 10%", dose: "60 mg/kg (0.6 ml/kg)", max: "-", note: "Hypocalcemia", calc: (w: number) => `${(w * 60).toFixed(0)} mg / ${(w * 0.6).toFixed(1)} ml` },
];

export default function CodeBlue() {
  const [weight, setWeight] = useWeight();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMetronome, setShowMetronome] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    let metroInterval: NodeJS.Timeout;
    if (isRunning) {
      // 110 bpm = 545ms
      metroInterval = setInterval(() => {
        setShowMetronome(true);
        setTimeout(() => setShowMetronome(false), 150);
      }, 545);
    }
    return () => clearInterval(metroInterval);
  }, [isRunning]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isCycleEnd = time > 0 && time % 120 === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <div className="flex items-center gap-3 mb-6">
        <HeartPulse className="w-8 h-8 text-destructive" />
        <h1 className="text-2xl font-bold text-destructive tracking-tight">Code Blue</h1>
      </div>

      <Card className="mb-6 border-destructive/30 shadow-sm">
        <CardContent className="pt-6">
          <Label className="text-sm font-semibold text-destructive">Patient Weight (kg)</Label>
          <Input 
            type="number" 
            value={weight} 
            onChange={e => setWeight(e.target.value ? Number(e.target.value) : "")}
            className="mt-2 text-lg h-12 border-destructive/20 focus-visible:ring-destructive/30"
          />
        </CardContent>
      </Card>

      <Card className="mb-6 bg-card border-border">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="flex items-center gap-8 mb-6">
            <div className={`w-6 h-6 rounded-full transition-all duration-75 ${showMetronome ? 'bg-destructive scale-110' : 'bg-destructive/20'}`} />
            <div className="text-5xl font-mono font-bold text-foreground">
              {formatTime(time)}
            </div>
            <div className={`w-6 h-6 rounded-full transition-all duration-75 ${showMetronome ? 'bg-destructive scale-110' : 'bg-destructive/20'}`} />
          </div>
          
          {isCycleEnd && (
            <div className="mb-4 text-destructive font-bold animate-pulse text-lg">
              2-MINUTE CYCLE: ASSESS RHYTHM
            </div>
          )}
          
          <div className="flex gap-4">
            <Button 
              size="lg" 
              variant={isRunning ? "outline" : "destructive"}
              onClick={() => setIsRunning(!isRunning)}
              className="w-32"
            >
              {isRunning ? <Square className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isRunning ? "Stop" : "Start"}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => { setIsRunning(false); setTime(0); }}>
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-wider">Compress at 100-120 bpm</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-bold text-lg border-b pb-2 text-foreground">Emergency Drugs</h2>
        {EMERGENCY_DRUGS.map(drug => (
          <div key={drug.name} className="flex justify-between items-center p-3 rounded-lg border bg-card">
            <div>
              <p className="font-bold text-sm text-foreground">{drug.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{drug.dose} • Max: {drug.max}</p>
              <p className="text-xs text-muted-foreground">{drug.note}</p>
            </div>
            <div className="text-right">
              <div className="bg-destructive/10 text-destructive font-bold text-lg px-3 py-1 rounded-md border border-destructive/20">
                {typeof weight === 'number' ? drug.calc(weight) : "-"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <h2 className="font-bold text-lg border-b pb-2 text-foreground">Defibrillation</h2>
        <div className="p-3 rounded-lg border bg-card">
          <p className="font-bold text-sm">VF / Pulseless VT</p>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">1st Shock (2 J/kg):</span>
            <span className="font-bold">{typeof weight === 'number' ? `${Math.min(weight * 2, 360)} J` : "-"}</span>
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span className="text-muted-foreground">2nd Shock (4 J/kg):</span>
            <span className="font-bold">{typeof weight === 'number' ? `${Math.min(weight * 4, 360)} J` : "-"}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
