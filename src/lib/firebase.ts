import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDY4WYSAMslzXAkej7tLQrzvcX_qw0v610",
  authDomain: "trash2trade-c630b.firebaseapp.com",
  projectId: "trash2trade-c630b",
  storageBucket: "trash2trade-c630b.firebasestorage.app",
  messagingSenderId: "605841981638",
  appId: "1:605841981638:web:2525d5c5c206d40eb197c7",
  measurementId: "G-ELX911SGBC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
