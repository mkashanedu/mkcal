import { useState } from "react";
import { useWeight } from "@/hooks/use-weight";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle } from "lucide-react";

const INOTROPES = [
  {
    id: "epinephrine",
    name: "Epinephrine",
    highAlert: true,
    range: "0.01 – 1 mcg/kg/min",
    instructions: "Dilute 1mg in 100ml NS (10mcg/ml). Central line preferred.",
    extravasation: "Extravasation risk.",
    monitoring: "HR, BP, Arrhythmias, Blood Glucose.",
    ysite: "Compatible with Amiodarone, Milrinone, Fentanyl.",
    concentration: 10,
  },
  {
    id: "norepinephrine",
    name: "Norepinephrine",
    highAlert: true,
    range: "0.01 – 2 mcg/kg/min",
    instructions: "Dilute 4mg in 250ml NS/D5W (16mcg/ml). Central line mandatory.",
    extravasation: "Extravasation causes necrosis — treat with phentolamine.",
    monitoring: "HR, BP continuous.",
    ysite: "Compatible with Amiodarone, Milrinone, Fentanyl.",
    concentration: 16,
  },
  {
    id: "dopamine",
    name: "Dopamine",
    highAlert: false,
    range: "2 – 20 mcg/kg/min",
    instructions: "Dilute 50mg in D5W/NS to 250ml (200mcg/ml). Renal alert <5, Inotrope 5-10, Vasopressor >10.",
    monitoring: "HR, BP, Urine Output.",
    ysite: "Incompatible with alkaline solutions (Sodium Bicarb).",
    concentration: 200,
  },
  {
    id: "dobutamine",
    name: "Dobutamine",
    highAlert: false,
    range: "2 – 20 mcg/kg/min",
    instructions: "Dilute 50mg in D5W/NS to 250ml (200mcg/ml). For heart failure/low CO.",
    monitoring: "HR, BP. May cause tachycardia.",
    ysite: "Incompatible with alkaline solutions.",
    concentration: 200,
  },
  {
    id: "milrinone",
    name: "Milrinone",
    highAlert: false,
    range: "0.25 – 0.75 mcg/kg/min",
    instructions: "Loading 50mcg/kg over 10min (optional), then infusion. Dilute to 200mcg/ml in NS/D5W.",
    monitoring: "HR, BP, continuous ECG. Monitor K+.",
    ysite: "Compatible with most medications.",
    concentration: 200,
  }
];

const SEDATIVES = [
  {
    id: "fentanyl",
    name: "Fentanyl",
    highAlert: true,
    range: "1 – 4 mcg/kg/hr",
    instructions: "Bolus 1-2 mcg/kg. Dilute 500mcg in 100ml NS (5mcg/ml). Chest wall rigidity with rapid IV push.",
    monitoring: "Respiratory rate, SpO2, HR, BP.",
    ysite: "Compatible with Midazolam, Propofol, Vecuronium.",
    concentration: 5,
    isHourly: true
  },
  {
    id: "midazolam",
    name: "Midazolam",
    highAlert: false,
    range: "0.05 – 0.4 mg/kg/hr",
    instructions: "Bolus 0.05-0.1 mg/kg. Dilute 15mg in 15ml NS (1mg/ml). Respiratory depression risk.",
    monitoring: "Respiratory rate, BP.",
    ysite: "Compatible with NS/D5W, Fentanyl, Morphine.",
    concentration: 1,
    isHourly: true
  }
];

const OTHERS = [
  {
    id: "omeprazole",
    name: "Omeprazole (IV)",
    highAlert: false,
    range: "1 - 2 mg/kg/day",
    instructions: "1 mg/kg/day once daily IV. Severe: 2 mg/kg/day divided 12-hourly. MAX 40 mg/day. Dilute in 100ml NS over 20-30 min.",
    monitoring: "Liver function if prolonged.",
    ysite: "Do not mix with other drugs.",
    concentration: 1, 
    isHourly: true
  }
];

export default function DrugDosing() {
  const [weight, setWeight] = useWeight();
  const [doses, setDoses] = useState<Record<string, string>>({});

  const handleDoseChange = (id: string, val: string) => setDoses(p => ({ ...p, [id]: val }));

  const calculateRate = (drug: any) => {
    if (!weight || !doses[drug.id]) return "0.00";
    const dose = parseFloat(doses[drug.id]);
    if (isNaN(dose)) return "0.00";
    
    if (drug.isHourly) {
      return ((dose * (weight as number)) / drug.concentration).toFixed(2);
    } else {
      return ((dose * (weight as number) * 60) / drug.concentration).toFixed(2);
    }
  };

  const renderDrug = (drug: any) => (
    <div key={drug.id} className="border-b last:border-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-base">{drug.name}</h3>
        {drug.highAlert && <Badge variant="destructive" className="uppercase text-[10px]">High Alert</Badge>}
      </div>
      
      <p className="text-xs text-muted-foreground mb-1"><span className="font-semibold text-foreground">Dilution:</span> {drug.instructions}</p>
      {drug.monitoring && <p className="text-xs text-muted-foreground mb-1"><span className="font-semibold text-foreground">Monitoring:</span> {drug.monitoring}</p>}
      {drug.ysite && <p className="text-xs text-muted-foreground mb-1"><span className="font-semibold text-foreground">Y-Site:</span> {drug.ysite}</p>}
      {drug.extravasation && <p className="text-xs text-destructive font-medium mb-3 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {drug.extravasation}</p>}
      
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <Label className="text-xs">Dose ({drug.range})</Label>
          <Input 
            type="number" 
            value={doses[drug.id] || ""} 
            onChange={e => handleDoseChange(drug.id, e.target.value)}
            placeholder="Dose"
            className="mt-1 h-9"
          />
        </div>
        <div>
          <Label className="text-xs">Rate (ml/hr)</Label>
          <div className="mt-1 h-9 flex items-center px-3 bg-muted rounded-md font-mono text-sm border">
            {calculateRate(drug)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">Drug Dosing</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Label className="text-sm font-semibold">Patient Weight (kg)</Label>
          <Input 
            type="number" 
            value={weight} 
            onChange={e => setWeight(e.target.value ? Number(e.target.value) : "")}
            placeholder="e.g. 15.5"
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={["inotropes"]}>
        <AccordionItem value="inotropes" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline font-bold text-primary">
            Inotropes & Vasopressors
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 space-y-6">
            {INOTROPES.map(renderDrug)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sedatives" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline font-bold text-primary">
            Sedation & Analgesia
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 space-y-6">
            {SEDATIVES.map(renderDrug)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="others" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline font-bold text-primary">
            Other Medications
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 space-y-6">
            {OTHERS.map(renderDrug)}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
