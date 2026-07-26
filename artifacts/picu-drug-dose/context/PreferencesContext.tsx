/**
 * PreferencesContext — global clinical display preferences.
 * Persisted to AsyncStorage; consumed by calculators and UI components.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

export type TextSize = "small" | "medium" | "large";

export const TEXT_SCALE: Record<TextSize, number> = {
  small:  0.88,
  medium: 1.00,
  large:  1.14,
};

interface PreferencesContextValue {
  /** Clinical display text size */
  textSize: TextSize;
  setTextSize: (s: TextSize) => void;
  /** Multiplier derived from textSize — apply to fontSize values */
  textScale: number;
  /** Whether biometric unlock is enabled (native only) */
  biometricEnabled: boolean;
  setBiometricEnabled: (v: boolean) => void;
  /** Whether the biometric preference has loaded from storage */
  prefsLoaded: boolean;
}

const PREFS_KEY = "@peadscal_prefs_v1";

const PreferencesContext = createContext<PreferencesContextValue>({
  textSize: "medium",
  setTextSize: () => {},
  textScale: 1,
  biometricEnabled: false,
  setBiometricEnabled: () => {},
  prefsLoaded: false,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>("medium");
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Load persisted preferences on mount
  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Partial<{
              textSize: TextSize;
              biometricEnabled: boolean;
            }>;
            if (
              parsed.textSize === "small" ||
              parsed.textSize === "medium" ||
              parsed.textSize === "large"
            ) {
              setTextSizeState(parsed.textSize);
            }
            // Biometric only meaningful on native
            if (Platform.OS !== "web" && typeof parsed.biometricEnabled === "boolean") {
              setBiometricEnabledState(parsed.biometricEnabled);
            }
          } catch {}
        }
      })
      .finally(() => setPrefsLoaded(true));
  }, []);

  const persist = useCallback(
    (patch: Partial<{ textSize: TextSize; biometricEnabled: boolean }>) => {
      AsyncStorage.getItem(PREFS_KEY)
        .then((raw) => {
          const current = raw ? JSON.parse(raw) : {};
          return AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...patch }));
        })
        .catch(() => {});
    },
    []
  );

  const setTextSize = useCallback(
    (s: TextSize) => {
      setTextSizeState(s);
      persist({ textSize: s });
    },
    [persist]
  );

  const setBiometricEnabled = useCallback(
    (v: boolean) => {
      if (Platform.OS === "web") return; // no-op on web
      setBiometricEnabledState(v);
      persist({ biometricEnabled: v });
    },
    [persist]
  );

  const textScale = TEXT_SCALE[textSize];

  return (
    <PreferencesContext.Provider
      value={{
        textSize,
        setTextSize,
        textScale,
        biometricEnabled,
        setBiometricEnabled,
        prefsLoaded,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
