// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdm3Jur0pt8U8gdshkf4Z2StVDVhf2tMY",
  authDomain: "finfolk-pokedex.firebaseapp.com",
  projectId: "finfolk-pokedex",
  storageBucket: "finfolk-pokedex.appspot.com",
  messagingSenderId: "1067933723714",
  appId: "1:1067933723714:web:ef8e6b31b6d6aa5b5ad1db",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
