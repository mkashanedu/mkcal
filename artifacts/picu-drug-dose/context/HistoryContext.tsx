/**
 * Calculation history — the most recent drug-dose calculations the user
 * looked at (drug, weight used, and the headline result). Stored locally
 * in AsyncStorage; when the user is signed in, SyncBridge also backs the
 * list up to Firestore under their account. No patient identifiers are
 * ever stored — only drug names, the weight entered, and dose text.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export interface HistoryEntry {
  drugId: string;
  drugName: string;
  weightKg: number;
  summary: string;
  at: number; // epoch ms
}

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (e: Omit<HistoryEntry, "at">) => void;
  clearHistory: () => void;
  replaceAll: (entries: HistoryEntry[]) => void;
}

const STORAGE_KEY = "picu_calc_history_v1";
const MAX_ENTRIES = 30;

const HistoryContext = createContext<HistoryContextValue>({
  entries: [],
  addEntry: () => {},
  clearHistory: () => {},
  replaceAll: () => {},
});

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) setEntries(parsed.slice(0, MAX_ENTRIES));
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => {
        loadedRef.current = true;
      });
  }, []);

  const persist = useCallback((next: HistoryEntry[]) => {
    setEntries(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const addEntry = useCallback(
    (e: Omit<HistoryEntry, "at">) => {
      if (!loadedRef.current) return;
      setEntries((prev) => {
        const filtered = prev.filter(
          (x) => !(x.drugId === e.drugId && Math.abs(x.weightKg - e.weightKg) < 0.001)
        );
        const next = [{ ...e, at: Date.now() }, ...filtered].slice(0, MAX_ENTRIES);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const clearHistory = useCallback(() => persist([]), [persist]);

  const replaceAll = useCallback(
    (next: HistoryEntry[]) => persist(next.slice(0, MAX_ENTRIES)),
    [persist]
  );

  return (
    <HistoryContext.Provider value={{ entries, addEntry, clearHistory, replaceAll }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}
