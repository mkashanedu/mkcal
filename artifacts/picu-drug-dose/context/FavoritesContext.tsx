import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { firestore } from "@/lib/firebase";

export type FavItemType =
  | "drug"
  | "antidote"
  | "calculator"
  | "infusion"
  | "tool"
  | "formulary";

export interface FavItem {
  id: string;
  type: FavItemType;
  label: string;
  color: string;
  category?: string;
  route?: string;
  notes?: string;
}

export type FavoritesSyncStatus = "idle" | "syncing" | "synced" | "error";

interface FavoritesContextValue {
  items: FavItem[];
  isFav: (id: string) => boolean;
  toggleFav: (item: FavItem) => void;
  removeFav: (id: string) => void;
  syncNow: () => Promise<boolean>;
  syncStatus: FavoritesSyncStatus;
  syncMessage: string;
  drugFavIds: string[];
  antidoteFavIds: string[];
  calcFavIds: string[];
  infusionFavIds: string[];
  toolFavIds: string[];
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = "picu_favorites_v2";

function favoriteDocId(id: string) {
  return encodeURIComponent(id);
}

function favoritesCollection(uid: string) {
  return collection(firestore, "users", uid, "favorites");
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<FavItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<FavoritesSyncStatus>("idle");
  const [syncMessage, setSyncMessage] = useState("");

  // Anonymous/offline fallback. A signed-in user's Firestore snapshot becomes
  // authoritative as soon as it is available.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        try {
          const parsed = JSON.parse(value) as FavItem[];
          if (Array.isArray(parsed)) setItems(parsed);
        } catch {
          // Ignore malformed legacy local data.
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const writeFavorite = useCallback(
    async (item: FavItem, uid: string) => {
      await setDoc(
        doc(firestore, "users", uid, "favorites", favoriteDocId(item.id)),
        { ...item, updatedAt: serverTimestamp() },
        { merge: true }
      );
    },
    []
  );

  const deleteFavorite = useCallback(async (id: string, uid: string) => {
    await deleteDoc(doc(firestore, "users", uid, "favorites", favoriteDocId(id)));
  }, []);

  const applyRemoteSnapshot = useCallback((remoteItems: FavItem[]) => {
    setItems(remoteItems);
    setSyncStatus("synced");
    setSyncMessage("Favorites synced");
  }, []);

  // Subscribe to the user's cloud favorites after Firebase restores the
  // session. This also keeps multiple signed-in devices in sync in real time.
  useEffect(() => {
    if (!user?.id) {
      setSyncStatus("idle");
      setSyncMessage("");
      return;
    }

    let active = true;
    setSyncStatus("syncing");
    setSyncMessage("Syncing favorites…");

    const unsubscribe = onSnapshot(
      favoritesCollection(user.id),
      (snapshot) => {
        if (!active) return;
        const remoteItems = snapshot.docs.map((favorite) => favorite.data() as FavItem);
        applyRemoteSnapshot(remoteItems);
      },
      () => {
        if (!active) return;
        setSyncStatus("error");
        setSyncMessage("Cloud sync unavailable; saved locally");
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [applyRemoteSnapshot, user?.id]);

  const syncNow = useCallback(async () => {
    if (!user?.id) {
      setSyncStatus("error");
      setSyncMessage("Sign in to sync favorites");
      return false;
    }

    setSyncStatus("syncing");
    setSyncMessage("Syncing favorites…");
    try {
      const snapshot = await getDocs(favoritesCollection(user.id));
      const remoteItems = snapshot.docs.map((favorite) => favorite.data() as FavItem);

      if (remoteItems.length === 0 && items.length > 0) {
        await Promise.all(items.map((item) => writeFavorite(item, user.id)));
      } else {
        setItems(remoteItems);
      }

      setSyncStatus("synced");
      setSyncMessage("Favorites synced successfully");
      return true;
    } catch {
      setSyncStatus("error");
      setSyncMessage("Cloud sync unavailable; saved locally");
      return false;
    }
  }, [items, user?.id, writeFavorite]);

  const toggleFav = useCallback(
    (item: FavItem) => {
      const exists = items.some((favorite) => favorite.id === item.id);
      const updated = exists
        ? items.filter((favorite) => favorite.id !== item.id)
        : [...items, item];

      // Optimistic update: the UI responds immediately even if offline.
      setItems(updated);

      if (!user?.id) return;
      setSyncStatus("syncing");
      setSyncMessage("Syncing favorites…");
      const operation = exists
        ? deleteFavorite(item.id, user.id)
        : writeFavorite(item, user.id);
      operation
        .then(() => {
          setSyncStatus("synced");
          setSyncMessage("Favorite saved to cloud");
        })
        .catch(() => {
          setSyncStatus("error");
          setSyncMessage("Saved locally; cloud sync unavailable");
        });
    },
    [deleteFavorite, items, user?.id, writeFavorite]
  );

  const removeFav = useCallback(
    (id: string) => {
      const removed = items.find((item) => item.id === id);
      if (!removed) return;
      toggleFav(removed);
    },
    [items, toggleFav]
  );

  const drugFavIds = items.filter((item) => item.type === "drug").map((item) => item.id);
  const antidoteFavIds = items.filter((item) => item.type === "antidote").map((item) => item.id);
  const calcFavIds = items.filter((item) => item.type === "calculator").map((item) => item.id);
  const infusionFavIds = items.filter((item) => item.type === "infusion").map((item) => item.id);
  const toolFavIds = items.filter((item) => item.type === "tool").map((item) => item.id);

  return (
    <FavoritesContext.Provider
      value={{
        items,
        isFav: useCallback((id: string) => items.some((item) => item.id === id), [items]),
        toggleFav,
        removeFav,
        syncNow,
        syncStatus,
        syncMessage,
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
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}