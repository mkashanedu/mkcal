/**
 * AuthContext — LocalStorage/AsyncStorage auth scaffold.
 * Stores hashed credentials locally. NOT production security — replace
 * the hash with bcrypt/argon2 and a real backend before shipping.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  ph: string; // password hash (scaffold)
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const SESSION_KEY = "@peadscal_session_v1";
const ACCOUNTS_KEY = "@peadscal_accounts_v1";

/** Djb2 hash — scaffold only, not production-safe */
function scaffoldHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0; // keep as unsigned 32-bit
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
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setUser(JSON.parse(raw));
          } catch {}
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      if (!trimmedName) return { success: false, error: "Name is required." };
      if (!trimmedEmail.includes("@")) return { success: false, error: "Enter a valid email address." };
      if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

      const accounts = await getAccounts();
      if (accounts.find((a) => a.email === trimmedEmail)) {
        return { success: false, error: "An account with this email already exists." };
      }

      const newAccount: StoredAccount = {
        id: Date.now().toString(36),
        name: trimmedName,
        email: trimmedEmail,
        ph: scaffoldHash(password),
      };
      await saveAccounts([...accounts, newAccount]);

      const sessionUser: AuthUser = { id: newAccount.id, name: newAccount.name, email: newAccount.email };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const accounts = await getAccounts();
    const match = accounts.find(
      (a) => a.email === trimmedEmail && a.ph === scaffoldHash(password)
    );
    if (!match) return { success: false, error: "Invalid email or password." };

    const sessionUser: AuthUser = { id: match.id, name: match.name, email: match.email };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
