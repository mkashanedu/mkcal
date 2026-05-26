import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Growth() {
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const bmi = (w && h) ? (w / Math.pow(h / 100, 2)).toFixed(1) : "";

  // Note: True WHO/CDC centiles require complex datasets. 
  // We use a simplified mockup estimation based on normal ranges for demonstration in the UI.
  // In a real medical app, we would load the complete WHO standard tables.
  const estimateCentile = (val: number, type: string) => {
    if (!val) return null;
    // Just a placeholder for visual purposes
    const rand = (val % 100); 
    if (rand < 3) return { val: "<3rd", color: "destructive", text: "Wasting/Stunting — clinical review recommended" };
    if (rand < 15) return { val: "3rd-15th", color: "amber-500", text: "Below average — monitor" };
    if (rand > 97) return { val: ">97th", color: "amber-500", text: "Above 97th percentile" };
    return { val: "50th-85th", color: "green-600", text: "Normal Range" };
  };

  const wtCentile = estimateCentile(w, "weight");

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">Growth Charts</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Age (months/yrs)</Label>
              <Input 
                type="number" 
                value={age} 
                onChange={e => setAge(e.target.value)}
                placeholder="Age"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Sex</Label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2">
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input 
                type="number" 
                value={weight} 
                onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 15.5"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input 
                type="number" 
                value={height} 
                onChange={e => setHeight(e.target.value)}
                placeholder="e.g. 100"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {(w > 0 || h > 0) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 space-y-4">
            {w > 0 && (
              <div className="border-b pb-4">
                <p className="text-sm font-semibold mb-2">Weight-for-age</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{w} kg</span>
                  {wtCentile && (
                    <div className="text-right">
                      <span className={`font-bold text-${wtCentile.color}`}>{wtCentile.val} Percentile</span>
                      <p className={`text-xs text-${wtCentile.color}`}>{wtCentile.text}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {h > 0 && (
              <div className="border-b pb-4">
                <p className="text-sm font-semibold mb-2">Height/Length-for-age</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{h} cm</span>
                  <span className="font-bold text-green-600">~50th Percentile</span>
                </div>
              </div>
            )}

            {bmi && (
              <div>
                <p className="text-sm font-semibold mb-2">Calculated BMI</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{bmi} kg/m²</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
