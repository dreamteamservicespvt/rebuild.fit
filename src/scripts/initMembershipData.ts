import { membershipsService, addOnServicesService, type Membership, type AddOnService } from '@/lib/firebaseServices';

// Sample Membership Plans
const sampleMemberships: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>[] = [
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
const sampleAddOnServices: Omit<AddOnService, 'id' | 'createdAt' | 'updatedAt'>[] = [
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
      oneTime: '2,000'
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
      monthly: '9,000'
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

export async function initializeMembershipData() {
  try {
    console.log('Starting to initialize membership and add-on services data...');
    
    // Populate Membership Plans
    console.log('Populating membership plans...');
    for (const membership of sampleMemberships) {
      await membershipsService.create(membership);
      console.log(`Created membership: ${membership.name}`);
    }
    
    // Populate Add-on Services
    console.log('Populating add-on services...');
    for (const service of sampleAddOnServices) {
      await addOnServicesService.create(service);
      console.log(`Created service: ${service.name}`);
    }
    
    console.log('Successfully initialized all membership data!');
    return true;
  } catch (error) {
    console.error('Error initializing membership data:', error);
    throw error;
  }
}

// Export individual functions
export async function populateMemberships() {
  try {
    console.log('Populating membership plans...');
    for (const membership of sampleMemberships) {
      await membershipsService.create(membership);
      console.log(`Created membership: ${membership.name}`);
    }
    console.log('Successfully populated membership plans!');
  } catch (error) {
    console.error('Error populating memberships:', error);
    throw error;
  }
}

export async function populateAddOnServices() {
  try {
    console.log('Populating add-on services...');
    for (const service of sampleAddOnServices) {
      await addOnServicesService.create(service);
      console.log(`Created service: ${service.name}`);
    }
    console.log('Successfully populated add-on services!');
  } catch (error) {
    console.error('Error populating add-on services:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
  // This is running in Node.js context (not browser)
  initializeMembershipData()
    .then(() => {
      console.log('Membership data initialization completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to initialize membership data:', error);
      process.exit(1);
    });
}
