import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";

// TODO: replace with your project's config from
// Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyADAZPsm1thmfhas5KqbbQKsORLuGpcNpg",
  authDomain: "soccer-queue-system.firebaseapp.com",
  projectId: "soccer-queue-system",
  storageBucket: "soccer-queue-system.firebasestorage.app",
  messagingSenderId: "302216551820",
  appId: "1:302216551820:web:c644429e8bd5569f004aa9",
  measurementId: "G-992LR48ZW3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Simple anonymous auth helper so you can test the queue flow with
 * multiple "accounts" (e.g. two simulators) before building real
 * email/password or social login.
 */
export function ensureSignedIn(callback: (user: User) => void) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      signInAnonymously(auth).catch((err) =>
        console.error("Anonymous sign-in failed:", err)
      );
    }
  });
}
