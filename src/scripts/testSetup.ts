import { auth, db, storage } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';

async function testFirebaseSetup() {
  console.log('🔍 Testing Firebase Setup...\n');
  
  try {
    // Test 1: Authentication
    console.log('1️⃣ Testing Authentication...');
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@rebuild.com', 'RebuildAdmin2025!');
    console.log('✅ Authentication successful');
    console.log(`👤 User: ${userCredential.user.email}\n`);
    
    // Test 2: Firestore
    console.log('2️⃣ Testing Firestore...');
    const gymsCollection = collection(db, 'gyms');
    const gymsSnapshot = await getDocs(gymsCollection);
    console.log(`✅ Firestore accessible - ${gymsSnapshot.size} gyms found\n`);
    
    // Test 3: Storage
    console.log('3️⃣ Testing Storage...');
    const storageRef = ref(storage, '/');
    const result = await listAll(storageRef);
    console.log(`✅ Storage accessible - ${result.prefixes.length} folders found\n`);
    
    console.log('🎉 All tests passed! Firebase setup is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.code === 'auth/wrong-password') {
      console.log('💡 Hint: Make sure to use the correct admin password');
    } else if (error.code === 'auth/network-request-failed') {
      console.log('💡 Hint: Check your internet connection');
    } else if (error.message.includes('CORS')) {
      console.log('💡 Hint: Run the CORS setup script: setup-firebase-cors.bat');
    }
  }
}

testFirebaseSetup();

export {};
