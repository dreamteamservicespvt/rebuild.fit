// Simple test script to verify payments functionality
// Run this with: npm run test:payments

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

// Firebase config (matching the one in src/lib/firebase.ts)
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
const db = getFirestore(app);

async function testPayments() {
  try {
    console.log('Testing payment creation...');
    
    // Create a test payment
    const testPayment = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+919876543210',
      gender: 'male',
      membershipId: 'test-membership-id',
      membershipName: 'STRENGTHENING',
      membershipType: 'premium',
      duration: 'quarterly',
      originalPrice: 5499,
      finalAmount: 5499,
      upiId: 'sagar.a.tej@ybl',
      payeeName: 'AKULA SAGAR/Sri Devi',
      transactionNote: 'Test User - STRENGTHENING (3 months) - Rs.5,499',
      screenshotUrl: 'https://via.placeholder.com/400x600.png?text=Test+Screenshot',
      status: 'pending',
      paymentDate: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Add to payments collection
    const docRef = await addDoc(collection(db, 'payments'), testPayment);
    console.log('Test payment created with ID:', docRef.id);

    // Try to fetch all payments
    const q = query(collection(db, 'payments'), orderBy('paymentDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log('Found payments:', querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log('Payment:', doc.id, doc.data());
    });
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testPayments();
