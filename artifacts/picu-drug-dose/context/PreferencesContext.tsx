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

/** Screen the app opens on at launch (user's choice in Settings). */
export type StartupScreen = "home" | "calculator" | "emergency" | "formulary";

export const STARTUP_SCREEN_OPTIONS: { key: StartupScreen; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "calculator", label: "Calculator" },
  { key: "emergency", label: "Emergency" },
  { key: "formulary", label: "Formulary" },
];

export const TEXT_SCALE: Record<TextSize, number> = {
  small:  0.85,
  medium: 1.00,
  large:  1.20,
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
  /** Screen shown first when the app launches */
  startupScreen: StartupScreen;
  setStartupScreen: (s: StartupScreen) => void;
  /** HIGH ALERT drugs hide their dose until the user confirms (Point 6) */
  highAlertConfirm: boolean;
  setHighAlertConfirm: (v: boolean) => void;
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
  startupScreen: "home",
  setStartupScreen: () => {},
  highAlertConfirm: true,
  setHighAlertConfirm: () => {},
  prefsLoaded: false,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>("medium");
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [startupScreen, setStartupScreenState] = useState<StartupScreen>("home");
  const [highAlertConfirm, setHighAlertConfirmState] = useState(true);
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
              startupScreen: StartupScreen;
              highAlertConfirm: boolean;
            }>;
            if (
              parsed.textSize === "small" ||
              parsed.textSize === "medium" ||
              parsed.textSize === "large"
            ) {
              setTextSizeState(parsed.textSize);
            }
            if (
              parsed.startupScreen === "home" ||
              parsed.startupScreen === "calculator" ||
              parsed.startupScreen === "emergency" ||
              parsed.startupScreen === "formulary"
            ) {
              setStartupScreenState(parsed.startupScreen);
            }
            if (typeof parsed.highAlertConfirm === "boolean") {
              setHighAlertConfirmState(parsed.highAlertConfirm);
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
    (patch: Partial<{ textSize: TextSize; biometricEnabled: boolean; startupScreen: StartupScreen; highAlertConfirm: boolean }>) => {
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

  const setStartupScreen = useCallback(
    (s: StartupScreen) => {
      setStartupScreenState(s);
      persist({ startupScreen: s });
    },
    [persist]
  );

  const setHighAlertConfirm = useCallback(
    (v: boolean) => {
      setHighAlertConfirmState(v);
      persist({ highAlertConfirm: v });
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
        startupScreen,
        setStartupScreen,
        highAlertConfirm,
        setHighAlertConfirm,
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
