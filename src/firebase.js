// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration, replace it with your project keys
const firebaseConfig = {
    apiKey: "AIzaSyAzdItNiH4-_xwLXJoM5-vrwp01a7eXiPM",
    authDomain: "quantori-final-task.firebaseapp.com",
    projectId: "quantori-final-task",
    storageBucket: "quantori-final-task.appspot.com",
    messagingSenderId: "673774972369",
    appId: "1:673774972369:web:1d594ad34631a55fd184f0",
    measurementId: "G-YLKTRHSYZD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);



