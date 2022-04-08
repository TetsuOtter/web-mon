import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADmpvohu4j7LRLFy0xAkHWgvMxcRfqmcE",
  authDomain: "tr-web-mon.firebaseapp.com",
  projectId: "tr-web-mon",
  storageBucket: "tr-web-mon.appspot.com",
  messagingSenderId: "229167537517",
  appId: "1:229167537517:web:6c868b49868d80ef258e64",
  measurementId: "G-65NQT3GE88"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}
