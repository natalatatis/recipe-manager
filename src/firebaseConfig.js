// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfM7gYQhvYKDrOPBj-A1JM1hDDyD6ttCE",
  authDomain: "recipe-manager-1db6b.firebaseapp.com",
  projectId: "recipe-manager-1db6b",
  storageBucket: "recipe-manager-1db6b.firebasestorage.app",
  messagingSenderId: "80161022995",
  appId: "1:80161022995:web:01e3d819b2ce5cfaab8be6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
