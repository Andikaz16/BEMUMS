import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1GZwecQgGuUSHpar-EysDr-H6SS06T-8",
  authDomain: "web-bem-ums.firebaseapp.com",
  projectId: "web-bem-ums",
  storageBucket: "web-bem-ums.firebasestorage.app",
  messagingSenderId: "1019162950493",
  appId: "1:1019162950493:web:ac0dfc54f7edcd04de06b4",
  measurementId: "G-ZK4H3E3YNE"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
