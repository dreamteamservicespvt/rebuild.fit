// This file can be run in the browser console to populate the database with sample data
// Make sure you're logged in as admin first

// Sample Membership Plans
const sampleMemberships = [
  {
    name: 'STRENGTHENING',
    price: {
      monthly: '1,999',
      quarterly: '5,499',
      halfyearly: '7,499',
      annual: '11,999'
    },
    type: 'PREMIUM',
    features: [
      'Focus on building strength with our specialized equipment',
      'Access to all strength equipment Gym access (6 AM - 10 PM)',
      'Locker access',
      'Basic strength training guidance',
      'Cardio equipment access'
    ],
    isPopular: false,
    order: 1
  },
  {
    name: 'CARDIO + STRENGTHENING',
    price: {
      monthly: '2,499',
      quarterly: '6,999',
      halfyearly: '8,999',
      annual: '14,999'
    },
    type: 'PREMIUM',
    features: [
      'Complete fitness experience with all amenities',
      '1 month Personal Training',
      'Full access to cardio section',
      'All strength equipment access',
      'Extended hours access Locker & towel service',
      'Comprehensive fitness guidance'
    ],
    isPopular: true,
    order: 2
  }
];

// Sample Add-on Services
const sampleAddOnServices = [
  {
    name: 'PERSONAL TRAINING',
    description: 'One-on-one coaching with our certified trainers, customized to your specific goals and fitness level.',
    price: {
      perSession: '500',
      monthly: '4,500',
      oneTime: '8,000'
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
    isActive: true,
    order: 1
  },
  {
    name: 'NUTRITION PLAN',
    description: 'Detailed nutrition guidance tailored to your body type, goals, and dietary preferences.',
    price: {
      oneTime: '2,000',
      perSession: '',
      monthly: ''
    },
    features: [
      'Customized meal plans',
      'Grocery shopping guide',
      'Two follow-up sessions'
    ],
    category: 'nutrition',
    isPopular: false,
    isActive: true,
    order: 2
  },
  {
    name: 'EXCLUSIVE TRAINING',
    description: 'Premium coaching for those who want dedicated attention and faster results.',
    price: {
      monthly: '9,000',
      perSession: '',
      oneTime: ''
    },
    features: [
      'Personalized workout program',
      'For alternate days: ₹4,500',
      'Dedicated trainer'
    ],
    category: 'training',
    isPopular: false,
    isActive: true,
    order: 3
  }
];

// Function to populate membership plans
async function populateMemberships() {
  for (const membership of sampleMemberships) {
    try {
      // Get membershipsService from the global scope (available when logged into admin)
      await window.membershipsService.create(membership);
    } catch (error) {
      // Handle errors silently
    }
  }
}

// Function to populate add-on services
async function populateAddOnServices() {
  for (const service of sampleAddOnServices) {
    try {
      // Get addOnServicesService from the global scope (available when logged into admin)
      await window.addOnServicesService.create(service);
    } catch (error) {
      // Handle errors silently
    }
  }
}

// Main function to run everything
async function initializeData() {
  try {
    await populateMemberships();
    await populateAddOnServices();
  } catch (error) {
    // Handle errors silently
  }
}

// Instructions - comment out the console.log section
/*
🔧 SETUP INSTRUCTIONS:

1. Make sure you're logged in as admin
2. Go to the admin panel in your browser
3. Open browser developer tools (F12)
4. Run: initializeData()

This will create sample membership plans and add-on services that match your design.
*/

// Export functions to global scope for easy access in console
window.populateMemberships = populateMemberships;
window.populateAddOnServices = populateAddOnServices;
window.initializeData = initializeData;
