// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.FIREBASE_API_KEY,
//   authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD9imMTkTSWWQ4sVP_okoVDZpdHKf-vDZQ",
  authDomain: "lery-tutorial-1.firebaseapp.com",
  projectId: "lery-tutorial-1",
  storageBucket: "lery-tutorial-1.appspot.com",
  messagingSenderId: "180174215797",
  appId: "1:180174215797:web:8947836870bce795a3363c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
