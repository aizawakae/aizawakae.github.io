// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAYZbjN3rgIvN-oJ3f8HRsLpkL99mazvhM",
  authDomain: "aizawakae01.firebaseapp.com",
  projectId: "aizawakae01",
  storageBucket: "aizawakae01.firebasestorage.app",
  messagingSenderId: "1081697738933",
  appId: "1:1081697738933:web:ce924426a6be1dc52d5efc",
  measurementId: "G-6VC1Q9M54K"
};

// Firebase'i Başlat
const app = initializeApp(firebaseConfig);

// Servisler
const auth = getAuth(app);
const db = getFirestore(app);

// Dışa Aktar
export { app, auth, db };

console.log("🔥 Firebase Connected");
