import { useState } from "react";
import { useWeight } from "@/hooks/use-weight";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Airway() {
  const [weight, setWeight] = useWeight();
  const [age, setAge] = useState<string>("");

  const ageNum = parseFloat(age);
  const weightNum = typeof weight === "number" ? weight : 0;

  let uncuffed = "";
  let cuffed = "";
  let depth = "";
  let suction = "";
  let blade = "";

  if (!isNaN(ageNum)) {
    if (ageNum < 1) {
      uncuffed = "3.0 – 3.5";
      cuffed = "3.0";
      blade = "Miller 0–1 (Straight)";
    } else {
      uncuffed = ((ageNum / 4) + 4).toFixed(1);
      cuffed = ((ageNum / 4) + 3.5).toFixed(1);
      if (ageNum >= 1 && ageNum < 3) blade = "Miller 1 / Mac 2";
      else if (ageNum >= 3 && ageNum <= 8) blade = "Mac 2–3";
      else blade = "Mac 3";
    }

    const depthByAge = (ageNum / 2) + 12;
    const depthByWeight = weightNum ? weightNum + 6 : 0;
    const recommendedDepth = Math.max(depthByAge, depthByWeight);
    
    depth = weightNum 
      ? `${depthByAge.toFixed(1)} (by age) / ${depthByWeight.toFixed(1)} (by wt) — Rec: ${recommendedDepth.toFixed(1)}`
      : `${depthByAge.toFixed(1)} (by age)`;
      
    suction = (parseFloat(uncuffed) * 2).toFixed(0);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">Airway / OETT</h1>

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Age (years)</Label>
              <Input 
                type="number" 
                value={age} 
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 4"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input 
                type="number" 
                value={weight} 
                onChange={e => setWeight(e.target.value ? Number(e.target.value) : "")}
                placeholder="e.g. 16"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!isNaN(ageNum) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Uncuffed ETT</p>
                <p className="text-lg font-bold text-foreground">{uncuffed} mm ID</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Cuffed ETT</p>
                <p className="text-lg font-bold text-foreground">{cuffed} mm ID</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Insertion Depth (at lip)</p>
                <p className="text-base font-semibold text-foreground">{depth} cm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Suction Catheter</p>
                <p className="text-base font-semibold text-foreground">{suction} Fr</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Blade</p>
                <p className="text-base font-semibold text-foreground">{blade}</p>
              </div>
            </div>

            <Alert className="mt-4 bg-background">
              <AlertDescription className="text-xs">
                Always have one size smaller and larger ready.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
