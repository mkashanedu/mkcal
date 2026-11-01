/**
 * SyncBridge — cloud backup for the signed-in user (P5).
 *
 * What is backed up (Firestore: users/{uid}/appBackup):
 *  - last weight + age (+ units) from WeightContext
 *  - calculator favorites (WeightContext store)
 *  - display preferences (text size, startup screen)
 *  - calculation history
 * The separate Favorites store (FavoritesContext) already syncs itself
 * per-item; it is not duplicated here.
 *
 * Behaviour:
 *  - On sign-in, if a cloud backup exists it is applied to this device
 *    (restore scenario: new phone → sign in → everything comes back).
 *  - After that, local changes are pushed (debounced) so the cloud copy
 *    stays current. Signed-out use is fully local and unchanged.
 *  - No patient data is ever included — only the clinician's own
 *    settings, favorites and history.
 *
 * StartupRedirect — one-time-per-session redirect to the user's chosen
 * startup screen (P3).
 */
import { doc, getDoc, setDoc } from "firebase/firestore";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";

import { useAuth } from "@/context/AuthContext";
import { useHistory, type HistoryEntry } from "@/context/HistoryContext";
import { usePreferences, type StartupScreen, type TextSize } from "@/context/PreferencesContext";
import { useWeight } from "@/context/WeightContext";
import { firestore } from "@/lib/firebase";

interface BackupShape {
  weightKg?: number;
  age?: number | null;
  ageUnit?: "years" | "months";
  weightUnit?: "kg" | "lbs";
  calcFavorites?: string[];
  textSize?: TextSize;
  startupScreen?: StartupScreen;
  history?: HistoryEntry[];
  updatedAt?: string;
}

export function SyncBridge() {
  const { user } = useAuth();
  const w = useWeight();
  const prefs = usePreferences();
  const hist = useHistory();

  const lastPushJson = useRef<string>("");
  const applyingRemote = useRef(false);
  const pulledForUid = useRef<string | null>(null);

  // ── Pull once per sign-in ──────────────────────────────────────────────
  useEffect(() => {
    if (!user || !prefs.prefsLoaded) return;
    if (pulledForUid.current === user.id) return;
    pulledForUid.current = user.id;

    (async () => {
      try {
        const snap = await getDoc(doc(firestore, "users", user.id, "appBackup", "data"));
        const data = snap.exists() ? (snap.data() as BackupShape) : null;
        // The FavoritesContext stores its backup in the user doc itself;
        // our document lives in the appBackup subcollection. Also accept
        // a top-level copy if one is ever written there.
        const backup: BackupShape | null =
          data ??
          (await (async () => {
            const top = await getDoc(doc(firestore, "users", user.id));
            const t = top.exists() ? (top.data() as { appBackup?: BackupShape }) : null;
            return t?.appBackup ?? null;
          })());

        if (!backup) return; // nothing in the cloud yet — local will push up

        applyingRemote.current = true;
        if (typeof backup.weightKg === "number" && backup.weightKg > 0) {
          w.setWeight(backup.weightKg);
        }
        if (backup.weightUnit === "kg" || backup.weightUnit === "lbs") {
          w.setWeightUnit(backup.weightUnit);
        }
        if (typeof backup.age === "number" && backup.age >= 0) {
          if (backup.ageUnit === "years" || backup.ageUnit === "months") {
            w.setAgeUnit(backup.ageUnit);
          }
          w.setAge(backup.age);
        }
        if (Array.isArray(backup.calcFavorites)) {
          const target = new Set(backup.calcFavorites);
          const current = new Set(w.favorites);
          target.forEach((id) => {
            if (!current.has(id)) w.toggleFavorite(id);
          });
          current.forEach((id) => {
            if (!target.has(id)) w.toggleFavorite(id);
          });
        }
        if (backup.textSize) prefs.setTextSize(backup.textSize);
        if (backup.startupScreen) prefs.setStartupScreen(backup.startupScreen);
        if (Array.isArray(backup.history)) hist.replaceAll(backup.history);

        // Treat the applied state as already-pushed to avoid a bounce-back.
        lastPushJson.current = JSON.stringify({
          weightKg: backup.weightKg ?? w.weight,
          age: backup.age ?? null,
          ageUnit: backup.ageUnit ?? w.ageUnit,
          weightUnit: backup.weightUnit ?? w.weightUnit,
          calcFavorites: backup.calcFavorites ?? w.favorites,
          textSize: backup.textSize ?? prefs.textSize,
          startupScreen: backup.startupScreen ?? prefs.startupScreen,
          history: backup.history ?? hist.entries,
        });
        setTimeout(() => {
          applyingRemote.current = false;
        }, 1600);
      } catch (error) {
        console.warn("[Sync] Backup restore failed; continuing locally.", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, prefs.prefsLoaded]);

  // ── Push on change (debounced) ─────────────────────────────────────────
  const snapshot: BackupShape = {
    weightKg: w.weight,
    age: w.ageConfirmed ? w.age : null,
    ageUnit: w.ageUnit,
    weightUnit: w.weightUnit,
    calcFavorites: w.favorites,
    textSize: prefs.textSize,
    startupScreen: prefs.startupScreen,
    history: hist.entries,
  };
  const snapshotJson = JSON.stringify(snapshot);

  useEffect(() => {
    if (!user || !prefs.prefsLoaded) return;
    if (pulledForUid.current !== user.id) return; // wait for the pull first
    if (applyingRemote.current) return;
    if (snapshotJson === lastPushJson.current) return;

    const t = setTimeout(() => {
      setDoc(
        doc(firestore, "users", user.id, "appBackup", "data"),
        { ...snapshot, updatedAt: new Date().toISOString() },
        { merge: true }
      )
        .then(() => {
          lastPushJson.current = snapshotJson;
        })
        .catch((error) => {
          console.warn("[Sync] Backup push failed; will retry on next change.", error);
        });
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, snapshotJson, prefs.prefsLoaded]);

  return null;
}

// ── Startup screen redirect (once per app session) ──────────────────────────
let startupRedirectDone = false;

const STARTUP_ROUTES: Record<StartupScreen, string> = {
  home: "/",
  calculator: "/calculator",
  emergency: "/emergency",
  formulary: "/formulary",
};

export function StartupRedirect() {
  const { startupScreen, prefsLoaded } = usePreferences();

  useEffect(() => {
    if (startupRedirectDone || !prefsLoaded) return;
    startupRedirectDone = true;
    if (startupScreen !== "home") {
      // Defer a tick so the navigator is mounted before replacing.
      const t = setTimeout(() => {
        router.replace(STARTUP_ROUTES[startupScreen] as never);
      }, 50);
      return () => clearTimeout(t);
    }
  }, [prefsLoaded, startupScreen]);

  return null;
}
