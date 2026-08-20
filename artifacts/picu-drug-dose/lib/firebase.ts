import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "@/firebaseConfig";

const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);

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