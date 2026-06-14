import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type FavItemType = "drug" | "antidote" | "calculator" | "infusion" | "tool";

export interface FavItem {
  id: string;
  type: FavItemType;
  label: string;
  color: string;
  category?: string;
  route?: string;
  notes?: string;
}

interface FavoritesContextValue {
  items: FavItem[];
  isFav: (id: string) => boolean;
  toggleFav: (item: FavItem) => void;
  removeFav: (id: string) => void;
  drugFavIds: string[];
  antidoteFavIds: string[];
  calcFavIds: string[];
  infusionFavIds: string[];
  toolFavIds: string[];
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "picu_favorites_v2";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([]);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val) as FavItem[];
          if (Array.isArray(parsed)) setItems(parsed);
        } catch {}
      }
    });
  }, []);

  // Persist whenever items change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const isFav = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggleFav = useCallback((item: FavItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  const removeFav = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const drugFavIds = items.filter((i) => i.type === "drug").map((i) => i.id);
  const antidoteFavIds = items.filter((i) => i.type === "antidote").map((i) => i.id);
  const calcFavIds = items.filter((i) => i.type === "calculator").map((i) => i.id);
  const infusionFavIds = items.filter((i) => i.type === "infusion").map((i) => i.id);
  const toolFavIds = items.filter((i) => i.type === "tool").map((i) => i.id);

  return (
    <FavoritesContext.Provider
      value={{
        items,
        isFav,
        toggleFav,
        removeFav,
        drugFavIds,
        antidoteFavIds,
        calcFavIds,
        infusionFavIds,
        toolFavIds,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
