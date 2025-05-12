// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
