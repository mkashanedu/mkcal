import { useWeight } from "@/hooks/use-weight";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Pill, Activity, Ruler, HeartPulse, Stethoscope, 
  CheckSquare, Droplets, Brain, Beaker 
} from "lucide-react";

const MODULES = [
  { href: "/drugs", icon: Pill, label: "Drug Dosing", color: "text-blue-500" },
  { href: "/code-blue", icon: HeartPulse, label: "Code Blue", color: "text-red-500" },
  { href: "/airway", icon: Activity, label: "Airway & ETT", color: "text-teal-500" },
  { href: "/fluids", icon: Droplets, label: "IV Fluids", color: "text-blue-400" },
  { href: "/gcs", icon: Brain, label: "Pediatric GCS", color: "text-purple-500" },
  { href: "/cardiac", icon: Stethoscope, label: "Cardiac/VIS", color: "text-rose-500" },
  { href: "/renal", icon: Beaker, label: "Renal/Hepatic", color: "text-amber-500" },
  { href: "/growth", icon: Ruler, label: "Growth Charts", color: "text-green-500" },
  { href: "/checklists", icon: CheckSquare, label: "Care Bundles", color: "text-indigo-500" },
];

export default function Home() {
  const [weight, setWeight] = useWeight();

  return (
    <div className="min-h-[100dvh] flex flex-col pt-6 px-4 bg-background">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary tracking-tight">PeadsCal</h1>
        <p className="text-sm text-muted-foreground mt-1">Pediatric Clinical Calculator</p>
      </div>

      <Card className="mb-8 border-primary/20 shadow-sm">
        <CardContent className="pt-6">
          <Label htmlFor="global-weight" className="text-sm font-semibold text-foreground mb-2 block">
            Current Patient Weight (kg)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="global-weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g. 15.5"
              className="text-lg h-12"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Weight is saved across all modules automatically.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {MODULES.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="h-full cursor-pointer hover:bg-accent/5 transition-colors border-border/50 active:scale-95 duration-200">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
                <mod.icon className={`w-8 h-8 ${mod.color}`} />
                <span className="text-[11px] font-medium leading-tight">{mod.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
