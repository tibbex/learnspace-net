
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF63YgRmN-ufP3l79p64ebB4CnoYEzLYQ",
  authDomain: "eduhub-add71.firebaseapp.com",
  projectId: "eduhub-add71",
  storageBucket: "eduhub-add71.appspot.com",
  messagingSenderId: "829557343702",
  appId: "1:829557343702:web:323bd9713b065820901077",
  measurementId: "G-1TQNZEZH2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
