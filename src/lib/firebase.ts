// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCF-w2QyUD0xCdE0aHEjhDyQJaMRhfa57Y",
  authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gorlea-snaps.firebaseapp.com",
  projectId: import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gorlea-snaps",
  storageBucket: import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gorlea-snaps.appspot.com",
  messagingSenderId: import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "237260784307",
  appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:237260784307:web:b162baa77794b271c926c6"
};

// Log the config for debugging (remove in production)
console.log("Firebase config:", {
  apiKey: firebaseConfig.apiKey ? "exists" : "missing",
  authDomain: firebaseConfig.authDomain ? "exists" : "missing",
  projectId: firebaseConfig.projectId ? "exists" : "missing",
  storageBucket: firebaseConfig.storageBucket ? "exists" : "missing",
  messagingSenderId: firebaseConfig.messagingSenderId ? "exists" : "missing",
  appId: firebaseConfig.appId ? "exists" : "missing"
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
