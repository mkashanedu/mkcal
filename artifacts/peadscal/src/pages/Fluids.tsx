import { useState } from "react";
import { useWeight } from "@/hooks/use-weight";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FLUID_TYPES = [
  { name: "NS 0.9%", na: "154" },
  { name: "NS 0.45%", na: "77" },
  { name: "Ringer's Lactate", na: "130" },
  { name: "D5W + 0.45% NS", na: "77" },
  { name: "D10W", na: "0" },
];

export default function Fluids() {
  const [weight, setWeight] = useWeight();
  const [dehydration, setDehydration] = useState<number>(0);

  let maintenance = 0;
  if (typeof weight === 'number') {
    if (weight <= 10) maintenance = weight * 100;
    else if (weight <= 20) maintenance = 1000 + (weight - 10) * 50;
    else maintenance = 1500 + (weight - 20) * 20;
  }

  const deficit = typeof weight === 'number' && dehydration > 0 ? (dehydration * weight * 10) : 0;
  const halfDeficit = deficit / 2;

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">IV Fluids</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Label className="text-sm font-semibold">Patient Weight (kg)</Label>
          <Input 
            type="number" 
            value={weight} 
            onChange={e => setWeight(e.target.value ? Number(e.target.value) : "")}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {typeof weight === 'number' && (
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardContent className="pt-6">
            <h2 className="font-bold text-primary border-b border-primary/10 pb-2 mb-4">Holliday-Segar Maintenance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">24hr Total</p>
                <p className="text-2xl font-bold">{maintenance.toFixed(0)} ml</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Hourly Rate</p>
                <p className="text-2xl font-bold">{(maintenance / 24).toFixed(1)} ml/hr</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {typeof weight === 'number' && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="font-bold text-lg mb-4">Dehydration Deficit</h2>
            <div className="flex gap-2 mb-6">
              {[
                { label: "Mild 5%", val: 5 },
                { label: "Mod 10%", val: 10 },
                { label: "Severe 15%", val: 15 }
              ].map(d => (
                <button
                  key={d.val}
                  onClick={() => setDehydration(d.val)}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${dehydration === d.val ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {deficit > 0 && (
              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deficit</p>
                  <p className="text-xl font-bold">{deficit.toFixed(0)} ml</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">First 8 Hours</p>
                    <p className="text-lg font-bold">{halfDeficit.toFixed(0)} ml</p>
                    <p className="text-xs text-muted-foreground">{(halfDeficit/8).toFixed(1)} ml/hr</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Next 16 Hours</p>
                    <p className="text-lg font-bold">{halfDeficit.toFixed(0)} ml</p>
                    <p className="text-xs text-muted-foreground">{(halfDeficit/16).toFixed(1)} ml/hr</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground italic mt-2 border-t pt-2">
                  * Adds to maintenance fluid rate. {dehydration >= 10 ? 'Severe/Moderate requires IV.' : 'Mild consider ORS if tolerated.'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="font-bold text-lg mb-4">Fluid Types (Na+ content)</h2>
          <div className="space-y-2">
            {FLUID_TYPES.map(f => (
              <div key={f.name} className="flex justify-between items-center border-b pb-2 last:border-0 text-sm">
                <span className="font-medium text-foreground">{f.name}</span>
                <span className="text-muted-foreground">{f.na} mEq/L</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
