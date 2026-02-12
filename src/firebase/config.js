// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY9LQpd7xJTjgXeipn3E7hwyOTS46C16s",
  authDomain: "ixmisport-baa5b.firebaseapp.com",
  projectId: "ixmisport-baa5b",
  storageBucket: "ixmisport-baa5b.firebasestorage.app",
  messagingSenderId: "175101928860",
  appId: "1:175101928860:web:a4d957901058179c77d459",
  measurementId: "G-SPT66WW81P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
