import { Link, useLocation } from "wouter";
import { Home, Pill, Activity, Ruler, HeartPulse, Stethoscope, CheckSquare, Droplets, Brain, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/drugs", icon: Pill, label: "Drugs" },
  { href: "/airway", icon: Activity, label: "Airway" },
  { href: "/growth", icon: Ruler, label: "Growth" },
  { href: "/code-blue", icon: HeartPulse, label: "Code Blue" },
  { href: "/cardiac", icon: Stethoscope, label: "Cardiac" },
  { href: "/checklists", icon: CheckSquare, label: "Checklists" },
  { href: "/fluids", icon: Droplets, label: "Fluids" },
  { href: "/gcs", icon: Brain, label: "GCS" },
  { href: "/renal", icon: Beaker, label: "Renal" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-between px-2 overflow-x-auto shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className="flex-1 min-w-[64px]">
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-lg cursor-pointer transition-colors",
              location === item.href
                ? "text-accent"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium truncate w-full text-center">
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
