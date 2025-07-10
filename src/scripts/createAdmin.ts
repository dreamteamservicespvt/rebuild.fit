import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@rebuild.com', 
      'RebuildAdmin2025!'  // You should change this password
    );
    
    const user = userCredential.user;
    console.log('Admin user created with UID:', user.uid);
    
    // Store admin info in Firestore
    await setDoc(doc(db, 'admin_users', user.uid), {
      email: 'admin@rebuild.com',
      isAdmin: true,
      role: 'super_admin',
      createdAt: new Date(),
      permissions: ['all']
    });
    
    console.log('Admin user document created in Firestore');
    console.log('✅ Admin setup complete!');
    console.log('📧 Email: admin@rebuild.com');
    console.log('🔑 Password: RebuildAdmin2025!');
    console.log('⚠️  Please change the password after first login');
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
  }
}

createAdminUser();

export {};
