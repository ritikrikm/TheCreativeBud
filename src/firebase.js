// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCxk54VGKZZwLzatl2-OdGf0dyNmr5pefI",
  authDomain: "creativebud-84ff6.firebaseapp.com",
  projectId: "creativebud-84ff6",
  storageBucket: "creativebud-84ff6.appspot.com",
  messagingSenderId: "828977891744",
  appId: "1:828977891744:web:a111ae173012048f59fcc5",
  measurementId: "G-1R5XY6G0E3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const functions = getFunctions(app);

export default app;
export { auth, database, functions };
