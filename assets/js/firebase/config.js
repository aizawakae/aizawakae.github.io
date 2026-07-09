// Firebase Config


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBusof8aAH-hQtkHJ1grUSil2KwQ2b-CEk",
  authDomain: "aizawakaecom.firebaseapp.com",
  projectId: "aizawakaecom",
  storageBucket: "aizawakaecom.firebasestorage.app",
  messagingSenderId: "245819844186",
  appId: "1:245819844186:web:95309c55354dfb1a1f1a63",
  measurementId: "G-R4HMYXH0T3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;