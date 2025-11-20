// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA297xN_PQ1DNPxfNgrVPWesL-hXzjctG4",
  authDomain: "e-commerce-app-b8da5.firebaseapp.com",
  projectId: "e-commerce-app-b8da5",
  storageBucket: "e-commerce-app-b8da5.firebasestorage.app",
  messagingSenderId: "84812415046",
  appId: "1:84812415046:web:4513665940557439ff4a47",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db };
