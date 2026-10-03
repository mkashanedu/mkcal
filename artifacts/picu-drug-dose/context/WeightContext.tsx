import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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
  ageConfirmed: boolean;
  ageUnit: "years" | "months";
  setAgeUnit: (u: "years" | "months") => void;

  favorites: string[];
  toggleFavorite: (drugId: string) => void;
  isFavorite: (drugId: string) => boolean;
}

const WeightContext = createContext<WeightContextValue | null>(null);

export function WeightProvider({ children }: { children: React.ReactNode }) {
  const [weight, setWeightState] = useState(10);
  const [weightInput, setWeightInputState] = useState("10");
  const [weightUnit, setWeightUnitState] = useState<"kg" | "lbs">("kg");
  const weightMutationVersion = useRef(0);

  const [age, setAgeState] = useState(2);
  const [ageInput, setAgeInputState] = useState("2");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [ageUnit, setAgeUnitState] = useState<"years" | "months">("years");
  const ageMutationVersion = useRef(0);

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const initialWeightMutationVersion = weightMutationVersion.current;
    AsyncStorage.getItem("picu_weight").then((val) => {
      if (weightMutationVersion.current !== initialWeightMutationVersion) return;
      if (val) {
        const num = parseFloat(val);
        if (Number.isFinite(num) && num > 0) {
          setWeightState(num);
          setWeightInputState(num.toString());
        }
      }
    });
    AsyncStorage.getItem("picu_weight_unit").then((val) => {
      if (val === "kg" || val === "lbs") setWeightUnitState(val);
    });
    const initialAgeMutationVersion = ageMutationVersion.current;
    Promise.all([
      AsyncStorage.getItem("picu_age"),
      AsyncStorage.getItem("picu_age_unit"),
    ]).then(([val, unit]) => {
      if (ageMutationVersion.current !== initialAgeMutationVersion) return;
      const loadedUnit = unit === "months" ? "months" : "years";
      setAgeUnitState(loadedUnit);
      if (val) {
        const num = Number(val);
        if (Number.isFinite(num) && num >= 0) {
          setAgeState(num);
          setAgeConfirmed(true);
          setAgeInputState(loadedUnit === "months" ? (num * 12).toString() : num.toString());
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

  const setWeightInput = useCallback((value: string) => {
    weightMutationVersion.current += 1;
    setWeightInputState(value);
  }, []);

  const setWeight = useCallback((w: number) => {
    weightMutationVersion.current += 1;
    if (!Number.isFinite(w) || w <= 0) {
      setWeightState(0);
      AsyncStorage.removeItem("picu_weight");
      return;
    }
    setWeightState(w);
    AsyncStorage.setItem("picu_weight", w.toString());
  }, []);

  const setWeightUnit = useCallback((u: "kg" | "lbs") => {
    setWeightUnitState(u);
    AsyncStorage.setItem("picu_weight_unit", u);
  }, []);

  const resetWeight = useCallback(() => {
    weightMutationVersion.current += 1;
    setWeightState(10);
    setWeightInputState("10");
    setWeightUnitState("kg");
    AsyncStorage.setItem("picu_weight", "10");
    AsyncStorage.setItem("picu_weight_unit", "kg");
  }, []);

  const setAge = useCallback((a: number) => {
    ageMutationVersion.current += 1;
    if (!Number.isFinite(a) || a < 0) {
      setAgeState(0);
      setAgeConfirmed(false);
      setAgeInputState("");
      AsyncStorage.removeItem("picu_age");
      return;
    }
    setAgeState(a);
    setAgeConfirmed(true);
    AsyncStorage.setItem("picu_age", a.toString());
  }, []);

  const setAgeInput = useCallback((value: string) => {
    ageMutationVersion.current += 1;
    setAgeInputState(value);
    const parsed = Number(value);
    const valid = value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0;
    setAgeConfirmed(valid);
    if (!valid) AsyncStorage.removeItem("picu_age");
  }, []);

  const setAgeUnit = useCallback((u: "years" | "months") => {
    ageMutationVersion.current += 1;
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
        ageConfirmed,
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
