import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// তোমার Firebase config এখানে বসাও
const firebaseConfig = {
  apiKey: "AIzaSyCaM3SPT7HLdqQ4it4ZqYv1jVw6jxne6VM",
  authDomain: "alakananda-8ca0b.firebaseapp.com",
  projectId: "alakananda-8ca0b",
  storageBucket: "alakananda-8ca0b.firebasestorage.app",
  messagingSenderId: "434392466271",
  appId: "1:434392466271:web:a12bf3b2b4c5cdc24facea",
  measurementId: "G-S2QYLCWNH1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
