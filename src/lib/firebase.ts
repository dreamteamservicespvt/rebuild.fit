import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAEv6P_UG1zpI99Wff2GsY08xVKsopE3cc",
  authDomain: "rebuildofficial-fit.firebaseapp.com",
  databaseURL: "https://rebuildofficial-fit-default-rtdb.firebaseio.com",
  projectId: "rebuildofficial-fit",
  storageBucket: "rebuildofficial-fit.firebasestorage.app",
  messagingSenderId: "609515447034",
  appId: "1:609515447034:web:c854caed9b43a90efe9f43",
  measurementId: "G-M2K95DMRQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
