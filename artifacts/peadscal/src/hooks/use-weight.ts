import { useState, useEffect } from "react";

export function useWeight() {
  const [weight, setWeight] = useState<number | "">(() => {
    const saved = localStorage.getItem("peadscal_weight");
    return saved ? parseFloat(saved) : "";
  });

  useEffect(() => {
    if (weight !== "") {
      localStorage.setItem("peadscal_weight", weight.toString());
    } else {
      localStorage.removeItem("peadscal_weight");
    }
  }, [weight]);

  return [weight, setWeight] as const;
}
