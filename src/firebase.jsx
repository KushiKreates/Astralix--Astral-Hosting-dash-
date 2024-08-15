
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBwHT3H8D3GA0Euvy1GfChT4j6EBO97L_s",
  authDomain: "dash-8adcc.firebaseapp.com",
  projectId: "dash-8adcc",
  storageBucket: "dash-8adcc.appspot.com",
  messagingSenderId: "988863616774",
  appId: "1:988863616774:web:6ecb6fa9c211e923687087",
  measurementId: "G-NXHSHZVXQ7"
};


const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);