import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export const MAX_WEIGHT_KG = 40;

interface WeightContextValue {
  weight: number;
  setWeight: (w: number) => void;
  weightInput: string;
  setWeightInput: (s: string) => void;
  resetWeight: () => void;
  favorites: string[];
  toggleFavorite: (drugId: string) => void;
  isFavorite: (drugId: string) => boolean;
}

const WeightContext = createContext<WeightContextValue | null>(null);

export function WeightProvider({ children }: { children: React.ReactNode }) {
  const [weight, setWeightState] = useState(10);
  const [weightInput, setWeightInput] = useState("10");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("picu_weight").then((val) => {
      if (val) {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          const capped = Math.min(num, MAX_WEIGHT_KG);
          setWeightState(capped);
          setWeightInput(capped.toString());
        }
      }
    });
    AsyncStorage.getItem("picu_favorites").then((val) => {
      if (val) {
        try {
          setFavorites(JSON.parse(val));
        } catch {}
      }
    });
  }, []);

  const setWeight = useCallback((w: number) => {
    const capped = Math.min(w, MAX_WEIGHT_KG);
    setWeightState(capped);
    AsyncStorage.setItem("picu_weight", capped.toString());
  }, []);

  const resetWeight = useCallback(() => {
    setWeightState(10);
    setWeightInput("10");
    AsyncStorage.setItem("picu_weight", "10");
  }, []);

  const toggleFavorite = useCallback(
    (drugId: string) => {
      setFavorites((prev) => {
        const updated = prev.includes(drugId)
          ? prev.filter((id) => id !== drugId)
          : [...prev, drugId];
        AsyncStorage.setItem("picu_favorites", JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const isFavorite = useCallback(
    (drugId: string) => favorites.includes(drugId),
    [favorites]
  );

  return (
    <WeightContext.Provider
      value={{ weight, setWeight, weightInput, setWeightInput, resetWeight, favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </WeightContext.Provider>
  );
}

export function useWeight() {
  const ctx = useContext(WeightContext);
  if (!ctx) throw new Error("useWeight must be used within WeightProvider");
  return ctx;
}
