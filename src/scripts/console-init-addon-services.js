// Run this script in browser console after opening the website
// Make sure you're logged in as admin first

const sampleServices = [
  {
    name: 'PERSONAL TRAINING',
    description: 'One-on-one coaching with our certified trainers, customized to your specific goals and fitness level.',
    price: {
      perSession: '500'
    },
    features: [
      'Individual attention',
      'Customized workouts',
      'Form correction',
      'Alternate days: ₹4,500/month',
      '₹8,000 with Nutrition Plan included'
    ],
    category: 'training',
    isPopular: true,
    isActive: true
  },
  {
    name: 'NUTRITION PLAN',
    description: 'Detailed nutrition guidance tailored to your body type, goals, and dietary preferences.',
    price: {
      oneTime: '2000'
    },
    features: [
      'Customized meal plans',
      'Grocery shopping guide',
      'Two follow-up sessions'
    ],
    category: 'nutrition',
    isPopular: false,
    isActive: true
  },
  {
    name: 'EXCLUSIVE TRAINING',
    description: 'Premium coaching for those who want dedicated attention and faster results.',
    price: {
      monthly: '9000'
    },
    features: [
      'Personalized workout program',
      'For alternate days: ₹4,500',
      'Dedicated trainer'
    ],
    category: 'training',
    isPopular: false,
    isActive: true
  }
];

// Function to add services to Firebase
async function addAddOnServices() {
  try {
    // Import Firebase services (make sure this is available in your global scope)
    const { addOnServicesService } = window;
    
    if (!addOnServicesService) {
      throw new Error('addOnServicesService not found in global scope. Make sure the app is loaded.');
    }

    for (const service of sampleServices) {
      await addOnServicesService.create(service);
    }
    
  } catch (error) {
    throw error;
  }
}

// Instructions for the user
/*
📝 To initialize add-on services:
1. Make sure you're logged in as admin
2. Open browser developer console (F12)
3. Copy and paste this entire script
4. Run: addAddOnServices()

Or just run the function directly if this script is already pasted:
*/

// addAddOnServices function is ready. Run addAddOnServices() to create the services.

// Make function available globally
window.addAddOnServices = addAddOnServices;
window.sampleAddOnServices = sampleServices;
