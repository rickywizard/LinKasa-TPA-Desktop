// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPJYsUrEo-1r2-7dZOrKzZMc2fh5XmYPA",
  authDomain: "linkasa-17267.firebaseapp.com",
  projectId: "linkasa-17267",
  storageBucket: "linkasa-17267.appspot.com",
  messagingSenderId: "872990704677",
  appId: "1:872990704677:web:61bca70a99bb8ccdc2ebcc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
