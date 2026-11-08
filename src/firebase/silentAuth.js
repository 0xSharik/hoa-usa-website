import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";

export const initializeSilentAuth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("Silent auth: User is signed in with UID:", user.uid);
        resolve(user);
      } else {
        // User is signed out
        console.log("Silent auth: No user, signing in anonymously...");
        try {
          await signInAnonymously(auth);
          // The onAuthStateChanged listener will trigger again with the new user
        } catch (error) {
          console.error("Silent auth error:", error);
          reject(error);
        }
      }
    });
    
    // Optional: Return unsubscribe if needed, but for app init we usually just want it to run
    // return unsubscribe;
  });
};
