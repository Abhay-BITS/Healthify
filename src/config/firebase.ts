// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0_MLI5AbySSvjdEazru2RNWuUnrwJKds",
  authDomain: "health-care-hackathon.firebaseapp.com",
  projectId: "health-care-hackathon",
  storageBucket: "health-care-hackathon.appspot.com",
  messagingSenderId: "323418597584",
  appId: "1:323418597584:web:2c790aaf9a140417c756d5",
  measurementId: "G-4JBJX8E5F2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);