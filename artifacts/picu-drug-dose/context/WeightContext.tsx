import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export const MIN_WEIGHT_KG = 0.5;
export const MAX_WEIGHT_KG = 150;

interface WeightContextValue {
  weight: number;
  setWeight: (w: number) => void;
  weightInput: string;
  setWeightInput: (s: string) => void;
  weightUnit: "kg" | "lbs";
  setWeightUnit: (u: "kg" | "lbs") => void;
  resetWeight: () => void;

  age: number;
  setAge: (a: number) => void;
  ageInput: string;
  setAgeInput: (s: string) => void;
  ageUnit: "years" | "months";
  setAgeUnit: (u: "years" | "months") => void;

  favorites: string[];
  toggleFavorite: (drugId: string) => void;
  isFavorite: (drugId: string) => boolean;
}

const WeightContext = createContext<WeightContextValue | null>(null);

export function WeightProvider({ children }: { children: React.ReactNode }) {
  const [weight, setWeightState] = useState(10);
  const [weightInput, setWeightInput] = useState("10");
  const [weightUnit, setWeightUnitState] = useState<"kg" | "lbs">("kg");

  const [age, setAgeState] = useState(2);
  const [ageInput, setAgeInput] = useState("2");
  const [ageUnit, setAgeUnitState] = useState<"years" | "months">("years");

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("picu_weight").then((val) => {
      if (val) {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          const clamped = Math.min(Math.max(num, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
          setWeightState(clamped);
          setWeightInput(clamped.toString());
        }
      }
    });
    AsyncStorage.getItem("picu_weight_unit").then((val) => {
      if (val === "kg" || val === "lbs") setWeightUnitState(val);
    });
    AsyncStorage.getItem("picu_age").then((val) => {
      if (val) {
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 0) {
          setAgeState(num);
          setAgeInput(num.toString());
        }
      }
    });
    AsyncStorage.getItem("picu_age_unit").then((val) => {
      if (val === "years" || val === "months") setAgeUnitState(val);
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
    const clamped = Math.min(Math.max(w, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
    setWeightState(clamped);
    AsyncStorage.setItem("picu_weight", clamped.toString());
  }, []);

  const setWeightUnit = useCallback((u: "kg" | "lbs") => {
    setWeightUnitState(u);
    AsyncStorage.setItem("picu_weight_unit", u);
  }, []);

  const resetWeight = useCallback(() => {
    setWeightState(10);
    setWeightInput("10");
    setWeightUnitState("kg");
    AsyncStorage.setItem("picu_weight", "10");
    AsyncStorage.setItem("picu_weight_unit", "kg");
  }, []);

  const setAge = useCallback((a: number) => {
    const clamped = Math.max(a, 0);
    setAgeState(clamped);
    AsyncStorage.setItem("picu_age", clamped.toString());
  }, []);

  const setAgeUnit = useCallback((u: "years" | "months") => {
    setAgeUnitState(u);
    AsyncStorage.setItem("picu_age_unit", u);
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
      value={{
        weight,
        setWeight,
        weightInput,
        setWeightInput,
        weightUnit,
        setWeightUnit,
        resetWeight,
        age,
        setAge,
        ageInput,
        setAgeInput,
        ageUnit,
        setAgeUnit,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
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
