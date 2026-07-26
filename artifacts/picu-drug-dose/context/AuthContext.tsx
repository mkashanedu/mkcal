/**
 * AuthContext — LocalStorage/AsyncStorage auth scaffold.
 * Stores hashed credentials locally with clinical role and provider.
 * NOT production security — replace with bcrypt/argon2 + real backend before shipping.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ClinicalRole =
  | "physician"
  | "rn"
  | "respiratory_therapist"
  | "paramedic"
  | "other";

export const CLINICAL_ROLE_LABELS: Record<ClinicalRole, string> = {
  physician:            "Physician / Medical Officer",
  rn:                   "Registered Nurse (RN)",
  respiratory_therapist: "Respiratory Therapist",
  paramedic:            "Paramedic / EMS",
  other:                "Other Clinical Professional",
};

export type AuthProvider = "local" | "google" | "apple";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: ClinicalRole;
  provider: AuthProvider;
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  role: ClinicalRole;
  ph: string; // password hash (scaffold)
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    role?: ClinicalRole
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    role: ClinicalRole
  ) => Promise<{ success: boolean; error?: string }>;
  loginSocial: (
    provider: "google" | "apple",
    name: string,
    email: string,
    role: ClinicalRole
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateRole: (role: ClinicalRole) => Promise<void>;
}

const SESSION_KEY = "@peadscal_session_v2";
const ACCOUNTS_KEY = "@peadscal_accounts_v2";

/** Djb2 hash — scaffold only, not production-safe */
function scaffoldHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(36);
}

async function getAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveAccounts(accounts: StoredAccount[]): Promise<void> {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  loginSocial: async () => ({ success: false }),
  logout: async () => {},
  updateRole: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try v2 session first, then migrate v1 if found
    AsyncStorage.getItem(SESSION_KEY)
      .then(async (raw) => {
        if (raw) {
          try {
            setUser(JSON.parse(raw));
            return;
          } catch {}
        }
        // Migrate old v1 session
        const v1 = await AsyncStorage.getItem("@peadscal_session_v1");
        if (v1) {
          try {
            const old = JSON.parse(v1) as Omit<AuthUser, "role" | "provider">;
            const migrated: AuthUser = {
              ...old,
              role: "rn",
              provider: "local",
            };
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(migrated));
            setUser(migrated);
          } catch {}
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: ClinicalRole = "rn"
    ) => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();
      if (!trimmedName) return { success: false, error: "Name is required." };
      if (!trimmedEmail.includes("@"))
        return { success: false, error: "Enter a valid email address." };
      if (password.length < 6)
        return { success: false, error: "Password must be at least 6 characters." };

      const accounts = await getAccounts();
      if (accounts.find((a) => a.email === trimmedEmail))
        return { success: false, error: "An account with this email already exists." };

      const newAccount: StoredAccount = {
        id: Date.now().toString(36),
        name: trimmedName,
        email: trimmedEmail,
        role,
        ph: scaffoldHash(password),
      };
      await saveAccounts([...accounts, newAccount]);

      const sessionUser: AuthUser = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role,
        provider: "local",
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string, role?: ClinicalRole) => {
      const trimmedEmail = email.trim().toLowerCase();
      const accounts = await getAccounts();
      const match = accounts.find(
        (a) => a.email === trimmedEmail && a.ph === scaffoldHash(password)
      );
      if (!match) return { success: false, error: "Invalid email or password." };

      const sessionUser: AuthUser = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: role ?? match.role ?? "rn",
        provider: "local",
      };
      // Update role if changed
      if (role && role !== match.role) {
        const updated = accounts.map((a) =>
          a.id === match.id ? { ...a, role } : a
        );
        await saveAccounts(updated);
      }
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    },
    []
  );

  /** Social auth scaffold — stores a local session without a password */
  const loginSocial = useCallback(
    async (
      provider: "google" | "apple",
      name: string,
      email: string,
      role: ClinicalRole = "rn"
    ) => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim() || email.split("@")[0];

      const accounts = await getAccounts();
      let account = accounts.find((a) => a.email === trimmedEmail);
      if (!account) {
        account = {
          id: `${provider}_${Date.now().toString(36)}`,
          name: trimmedName,
          email: trimmedEmail,
          role,
          ph: "", // no password for social
        };
        await saveAccounts([...accounts, account]);
      }

      const sessionUser: AuthUser = {
        id: account.id,
        name: account.name,
        email: account.email,
        role,
        provider,
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateRole = useCallback(
    async (role: ClinicalRole) => {
      if (!user) return;
      const updated: AuthUser = { ...user, role };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setUser(updated);
      // Also update stored account
      const accounts = await getAccounts();
      await saveAccounts(
        accounts.map((a) => (a.id === user.id ? { ...a, role } : a))
      );
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, loginSocial, logout, updateRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
