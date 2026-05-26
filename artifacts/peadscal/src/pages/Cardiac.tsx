import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Cardiac() {
  const [doses, setDoses] = useState({
    dopamine: "",
    dobutamine: "",
    epinephrine: "",
    milrinone: "",
    vasopressin: "",
    norepinephrine: ""
  });
  
  const [qt, setQt] = useState("");
  const [rr, setRr] = useState("");

  const handleDose = (k: string, v: string) => setDoses(p => ({ ...p, [k]: v }));

  const calculateVIS = () => {
    const dop = parseFloat(doses.dopamine) || 0;
    const dob = parseFloat(doses.dobutamine) || 0;
    const epi = parseFloat(doses.epinephrine) || 0;
    const mil = parseFloat(doses.milrinone) || 0;
    const vas = parseFloat(doses.vasopressin) || 0;
    const nor = parseFloat(doses.norepinephrine) || 0;

    return dop + dob + (100 * epi) + (10 * mil) + (10000 * vas) + (100 * nor);
  };

  const vis = calculateVIS();
  let severity = { label: "Low", color: "text-green-500", bg: "bg-green-500/10" };
  if (vis >= 10 && vis <= 20) severity = { label: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10" };
  else if (vis > 20) severity = { label: "High", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20 border" };

  const qtVal = parseFloat(qt);
  const rrVal = parseFloat(rr);
  
  // QTc = QT / sqrt(RR in seconds)
  let qtc = "";
  let qtcAlert = false;
  if (qtVal > 0 && rrVal > 0) {
    const qtcNum = qtVal / Math.sqrt(rrVal / 1000);
    qtc = qtcNum.toFixed(0);
    qtcAlert = qtcNum > 440;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background pb-8">
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-4">Cardiac & Hemodynamic</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="font-bold text-lg mb-4">Vasoactive Inotropic Score</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Dopamine (mcg/kg/min)</Label>
              <Input type="number" value={doses.dopamine} onChange={e => handleDose('dopamine', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Dobutamine (mcg/kg/min)</Label>
              <Input type="number" value={doses.dobutamine} onChange={e => handleDose('dobutamine', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Epinephrine (mcg/kg/min)</Label>
              <Input type="number" value={doses.epinephrine} onChange={e => handleDose('epinephrine', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Norepinephrine (mcg/kg/min)</Label>
              <Input type="number" value={doses.norepinephrine} onChange={e => handleDose('norepinephrine', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Milrinone (mcg/kg/min)</Label>
              <Input type="number" value={doses.milrinone} onChange={e => handleDose('milrinone', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Vasopressin (U/kg/min)</Label>
              <Input type="number" value={doses.vasopressin} onChange={e => handleDose('vasopressin', e.target.value)} className="mt-1" />
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-lg flex items-center justify-between ${severity.bg}`}>
            <div>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Total VIS</p>
              <p className="text-3xl font-bold text-foreground">{vis.toFixed(1)}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold text-lg ${severity.color}`}>{severity.label}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="font-bold text-lg mb-4">Vital Signs Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Age</th>
                  <th className="px-2 py-2">HR</th>
                  <th className="px-2 py-2">RR</th>
                  <th className="px-2 py-2">SBP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="px-2 py-2">Neonate</td><td className="px-2 py-2">100-160</td><td className="px-2 py-2">30-60</td><td className="px-2 py-2">60-90</td></tr>
                <tr className="border-b"><td className="px-2 py-2">1-12m</td><td className="px-2 py-2">100-160</td><td className="px-2 py-2">25-50</td><td className="px-2 py-2">70-100</td></tr>
                <tr className="border-b"><td className="px-2 py-2">1-3y</td><td className="px-2 py-2">90-150</td><td className="px-2 py-2">20-40</td><td className="px-2 py-2">80-110</td></tr>
                <tr className="border-b"><td className="px-2 py-2">3-6y</td><td className="px-2 py-2">80-140</td><td className="px-2 py-2">20-30</td><td className="px-2 py-2">90-110</td></tr>
                <tr className="border-b"><td className="px-2 py-2">6-12y</td><td className="px-2 py-2">70-120</td><td className="px-2 py-2">15-25</td><td className="px-2 py-2">95-115</td></tr>
                <tr><td className="px-2 py-2">12-18y</td><td className="px-2 py-2">60-100</td><td className="px-2 py-2">12-20</td><td className="px-2 py-2">110-130</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6 border-blue-500/20">
        <CardContent className="pt-6">
          <h2 className="font-bold text-lg mb-4">ECG QTc Calculator (Bazett)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">QT Interval (ms)</Label>
              <Input type="number" value={qt} onChange={e => setQt(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">RR Interval (ms)</Label>
              <Input type="number" value={rr} onChange={e => setRr(e.target.value)} className="mt-1" />
            </div>
          </div>
          {qtc && (
            <div className={`mt-4 p-3 rounded-md flex justify-between items-center ${qtcAlert ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
              <span className="font-semibold text-sm">Calculated QTc</span>
              <span className="font-bold text-xl">{qtc} ms</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
