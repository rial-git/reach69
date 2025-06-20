import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRgBCNa1b6zz2GwqboUHffxum3_j8H5Vo",
  authDomain: "reach69-51b4b.firebaseapp.com",
  projectId: "reach69-51b4b",
  storageBucket: "reach69-51b4b.firebasestorage.app",
  messagingSenderId: "184194550965",
  appId: "1:184194550965:web:7122cb8fa3967593b202fc",
  measurementId: "G-2R0MR0L4NZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);