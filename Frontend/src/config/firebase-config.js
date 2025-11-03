
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4o4gGs8dhZ3SzxjiHIEIvWruu4MSbLa8",
  authDomain: "react-doctor-3f9cb.firebaseapp.com",
  projectId: "react-doctor-3f9cb",
  storageBucket: "react-doctor-3f9cb.appspot.com",
  messagingSenderId: "529189116327",
  appId: "1:529189116327:web:293f620ba8830f93e0fe82"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
