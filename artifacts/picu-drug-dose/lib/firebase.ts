import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  type Auth,
  type Persistence,
} from "firebase/auth";
import * as FirebaseAuthModule from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "@/firebaseConfig";

const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);

type ReactNativeAuthModule = typeof FirebaseAuthModule & {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

function createFirebaseAuth(): Auth {
  if (Platform.OS === "web") {
    try {
      return initializeAuth(firebaseApp, {
        persistence: browserLocalPersistence,
      });
    } catch {
      return getAuth(firebaseApp);
    }
  }

  try {
    // Expo/Metro resolves firebase/auth to its RN implementation on native,
    // where this helper is available even though the shared TS entrypoint
    // does not declare it.
    const getReactNativePersistence = (
      FirebaseAuthModule as unknown as ReactNativeAuthModule
    ).getReactNativePersistence;
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export const firebaseAuth = createFirebaseAuth();
export const firestore = getFirestore(firebaseApp);
export { firebaseApp };