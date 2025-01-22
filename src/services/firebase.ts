import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0_MLI5AbySSvjdEazru2RNWuUnrwJKds",
  authDomain: "health-care-hackathon.firebaseapp.com",
  projectId: "health-care-hackathon",
  storageBucket: "health-care-hackathon.appspot.com",
  messagingSenderId: "323418597584",
  appId: "1:323418597584:web:2c790aaf9a140417c756d5",
};

// Initialize Firebase App (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google Sign-In Successful:", result.user);
    return result.user; // Authenticated user object
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw error; // Rethrow error for the calling code to handle
  }
};

// Create a new user with email and password
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registration successful:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error during email registration:", error);
    throw error;
  }
};

// Sign in an existing user with email and password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User login successful:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error during email login:", error);
    throw error;
  }
};

// Firestore utility to add a document
export const addDocument = async (collectionName: string, data: object) => {
  try {
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, data);
    console.log(`Document added to collection: ${collectionName}`);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// Firestore utility to fetch a single document by ID
export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.warn("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

// Firestore utility to query documents
export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: FirebaseFirestore.WhereFilterOp,
  value: any
) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Query results:", documents);
    return documents;
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
};
