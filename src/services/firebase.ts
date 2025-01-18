import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD0_MLI5AbySSvjdEazru2RNWuUnrwJKds",
  authDomain: "health-care-hackathon.firebaseapp.com",
  projectId: "health-care-hackathon",
  storageBucket: "health-care-hackathon.appspot.com",
  messagingSenderId: "323418597584",
  appId: "1:323418597584:web:2c790aaf9a140417c756d5"
};

// Singleton initialization of Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Other Firebase-related functions remain the same
