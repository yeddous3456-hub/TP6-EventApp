// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV-qDTM7lhzd9TWFisMN7EpMtclX7Eocs",
  authDomain: "fir-test-a5a8b.firebaseapp.com",
  projectId: "fir-test-a5a8b",
  storageBucket: "fir-test-a5a8b.firebasestorage.app",
  messagingSenderId: "399324572110",
  appId: "1:399324572110:web:094b52f6bfa2978f5ee39f",
  measurementId: "G-MFJL0CK2HY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };