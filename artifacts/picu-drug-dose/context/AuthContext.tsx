/**
 * Firebase Auth context.
 *
 * Firebase owns the persistent session on web and native:
 * browserLocalPersistence on web, and AsyncStorage-backed persistence on
 * iOS/Android. Profile metadata such as clinical role is stored in Firestore.
 */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { firebaseAuth, firestore } from "@/lib/firebase";

export type ClinicalRole =
  | "physician"
  | "rn"
  | "respiratory_therapist"
  | "paramedic"
  | "other";

export const CLINICAL_ROLE_LABELS: Record<ClinicalRole, string> = {
  physician: "Physician / Medical Officer",
  rn: "Registered Nurse (RN)",
  respiratory_therapist: "Respiratory Therapist",
  paramedic: "Paramedic / EMS",
  other: "Other Clinical Professional",
};

export type AuthProvider = "local" | "google" | "apple";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: ClinicalRole;
  provider: AuthProvider;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: ClinicalRole) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
    role: ClinicalRole
  ) => Promise<AuthResult>;
  loginSocial: (
    provider: "google" | "apple",
    name: string,
    email: string,
    role: ClinicalRole
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateRole: (role: ClinicalRole) => Promise<void>;
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

function getErrorMessage(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error
    ? String((error as { code?: string }).code)
    : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return error instanceof Error ? error.message : "Authentication failed.";
  }
}

function providerFromUser(user: FirebaseUser): AuthProvider {
  const providerId = user.providerData[0]?.providerId;
  if (providerId === "google.com") return "google";
  if (providerId === "apple.com") return "apple";
  return "local";
}

async function toAuthUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
  let data: Record<string, unknown> | undefined;
  try {
    const profileRef = doc(firestore, "users", firebaseUser.uid);
    const profile = await getDoc(profileRef);
    data = profile.data();
  } catch (error) {
    console.warn("[Auth] Could not load Firestore profile; using defaults.", error);
  }
  const role =
    data?.role === "physician" ||
    data?.role === "rn" ||
    data?.role === "respiratory_therapist" ||
    data?.role === "paramedic" ||
    data?.role === "other"
      ? data.role
      : "rn";

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Clinical User",
    email: firebaseUser.email || "",
    role,
    provider: providerFromUser(firebaseUser),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      toAuthUser(firebaseUser)
        .then(setUser)
        .catch(() => {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Clinical User",
            email: firebaseUser.email || "",
            role: "rn",
            provider: providerFromUser(firebaseUser),
          });
        })
        .finally(() => setIsLoading(false));
    });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: ClinicalRole) => {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedName) return { success: false, error: "Name is required." };

      try {
        const result = await createUserWithEmailAndPassword(
          firebaseAuth,
          trimmedEmail,
          password
        );
        await updateProfile(result.user, { displayName: trimmedName });
        try {
          await setDoc(
            doc(firestore, "users", result.user.uid),
            {
              uid: result.user.uid,
              name: trimmedName,
              email: trimmedEmail,
              role,
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (error) {
          console.warn("[Auth] Account created, but profile sync failed.", error);
        }
        setUser({
          id: result.user.uid,
          name: trimmedName,
          email: trimmedEmail,
          role,
          provider: "local",
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: getErrorMessage(error) };
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string, role?: ClinicalRole) => {
      try {
        const result = await signInWithEmailAndPassword(
          firebaseAuth,
          email.trim().toLowerCase(),
          password
        );
        if (role) {
          try {
            await setDoc(doc(firestore, "users", result.user.uid), { role }, { merge: true });
          } catch (error) {
            console.warn("[Auth] Login succeeded, but role sync failed.", error);
          }
        }
        setUser(await toAuthUser(result.user));
        return { success: true };
      } catch (error) {
        return { success: false, error: getErrorMessage(error) };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut(firebaseAuth);
    setUser(null);
  }, []);

  const updateRole = useCallback(
    async (role: ClinicalRole) => {
      if (!user) return;
      try {
        await setDoc(doc(firestore, "users", user.id), { role }, { merge: true });
      } catch (error) {
        console.warn("[Auth] Role update could not be synced.", error);
      }
      setUser({ ...user, role });
    },
    [user]
  );

  const loginSocial = useCallback(
    async (_provider: "google" | "apple", _name: string, _email: string, _role: ClinicalRole) => ({
      success: false,
      error: "Social sign-in is not configured yet. Use email and password.",
    }),
    []
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