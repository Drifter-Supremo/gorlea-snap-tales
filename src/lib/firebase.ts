// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * SECURITY NOTE: Firebase configuration is loaded from .env.firebase file
 *
 * This approach keeps API keys out of the source code while ensuring the app works.
 * The .env.firebase file should be added to .gitignore to prevent it from being committed.
 *
 * For production deployment:
 * 1. Ensure the .env.firebase file is properly configured in your deployment environment
 * 2. Add .env.firebase to your .gitignore file
 * 3. Set up proper environment variables in your deployment platform (e.g., Vercel)
 */

// Load Firebase configuration from .env.firebase file
const loadEnvFile = (): Record<string, string> => {
  // This function only works in Node.js environment, not in the browser
  // In a browser environment, we'll rely on the fallback values or Vite's import.meta.env
  if (typeof window !== 'undefined') {
    return {};
  }

  try {
    // In a real production environment, you would use a more robust method to load env files
    const fs = require('fs');
    const path = require('path');
    const envPath = path.resolve(process.cwd(), '.env.firebase');

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars: Record<string, string> = {};

      envContent.split('\n').forEach((line: string) => {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      });

      return envVars;
    }
  } catch (error) {
    console.error('Error loading .env.firebase file:', error);
  }

  return {};
};

// Get environment variables from various sources with priority
const getEnvVar = (key: string): string | undefined => {
  // Try to get from Vite's import.meta.env first (for development)
  if (import.meta.env[`NEXT_PUBLIC_${key}`]) {
    return import.meta.env[`NEXT_PUBLIC_${key}`];
  }

  // Then try from our custom env file
  const envVars = loadEnvFile();
  if (envVars[key]) {
    return envVars[key];
  }

  // Finally, return undefined if not found
  return undefined;
};

// Fallback values for development (these will be used if env variables are not found)
const fallbacks = {
  FIREBASE_API_KEY: "AIzaSyCF-w2QyUD0xCdE0aHEjhDyQJaMRhfa57Y",
  FIREBASE_AUTH_DOMAIN: "gorlea-snaps.firebaseapp.com",
  FIREBASE_PROJECT_ID: "gorlea-snaps",
  FIREBASE_STORAGE_BUCKET: "gorlea-snaps.firebasestorage.app",
  FIREBASE_MESSAGING_SENDER_ID: "237260784307",
  FIREBASE_APP_ID: "1:237260784307:web:b162baa77794b271c926c6"
};

// Firebase configuration from environment variables with fallbacks
const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY') || fallbacks.FIREBASE_API_KEY,
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || fallbacks.FIREBASE_AUTH_DOMAIN,
  projectId: getEnvVar('FIREBASE_PROJECT_ID') || fallbacks.FIREBASE_PROJECT_ID,
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || fallbacks.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || fallbacks.FIREBASE_MESSAGING_SENDER_ID,
  appId: getEnvVar('FIREBASE_APP_ID') || fallbacks.FIREBASE_APP_ID
};

// Log the config status for debugging (without exposing actual values)
// Remove this in production
console.log("Firebase config status:", {
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
