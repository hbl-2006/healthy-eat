import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMY2Yh_15D5NVjYjy-D0t9FkBVFwsr8DM",
  authDomain: "ib-cs-hl-ia-30199.firebaseapp.com",
  projectId: "ib-cs-hl-ia-30199",
  storageBucket: "ib-cs-hl-ia-30199.appspot.com",
  messagingSenderId: "1043437954871",
  appId: "1:1043437954871:web:d05b40ee988e1d9a32dcb2",
  measurementId: "G-WQEJPM8MTW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);