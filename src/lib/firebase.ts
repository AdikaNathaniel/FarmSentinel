// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";

// ✅ Firebase config (from your Firebase Console)
// const firebaseConfig = {
//   apiKey: "AIzaSyBtIdnD63abH_2NzX10sdH5FXtfz4LlSW8",
//   authDomain: "farm-sentinel-e259e.firebaseapp.com",
//   projectId: "farm-sentinel-e259e",
//   storageBucket: "farm-sentinel-e259e.appspot.com", // ✅ FIXED (was wrong before)
//   messagingSenderId: "402489625903",
//   appId: "1:402489625903:web:819e94b5d62424e7a925da",
//   measurementId: "G-DZFGK4RSG1",
// };


const firebaseConfig = {
  apiKey: "AIzaSyCqe_Hun-vYEVKlfH9sB2O0jAPnE0q8svw",
  authDomain: "farm-sentinel-ac85e.firebaseapp.com",
  projectId: "farm-sentinel-ac85e",
  storageBucket: "farm-sentinel-ac85e.firebasestorage.app",
  messagingSenderId: "631017257439",
  appId: "1:631017257439:web:2b0cdd560e32ba8422ec6a",
  measurementId: "G-DBX53W9H2Y"
};

// ✅ Initialize Firebase once (for Next.js SSR safety)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);

// ✅ Analytics only in browser
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

// Debug: confirm Firebase initialized
if (typeof window !== "undefined") {
  console.log("✅ Firebase initialized:", app.name);
}

export { app, auth, firestore, functions, analytics };
