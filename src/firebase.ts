import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Ensure Firebase is only initialized once
let app;
try {
  app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  });
} catch (error) {
  const e = error as { code?: string };
  if (e.code === 'app/duplicate-app') {
    // If an app already exists, get that instead
    app = getApp();
  } else {
    throw error;
  }
}

export const db = getFirestore(app);