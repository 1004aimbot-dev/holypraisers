// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCh0LCYv7PsbZRoeGhcN8yKHiPnM2Lprsc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shinkwang-5e1ff.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shinkwang-5e1ff",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shinkwang-5e1ff.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "143341700754",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:143341700754:web:be7c6f6d8e9dc8b095884b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-656JR3B55D",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;