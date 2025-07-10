import { addOnServicesService, type AddOnService } from '@/lib/firebaseServices';

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
      oneTime: '2,000',
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
      perSession: ''
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

export async function populateAddOnServices() {
  try {
    console.log('Starting to populate add-on services...');
    
    for (const service of sampleAddOnServices) {
      await addOnServicesService.create(service);
      console.log(`Created service: ${service.name}`);
    }
    
    console.log('Successfully populated all add-on services!');
  } catch (error) {
    console.error('Error populating add-on services:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
  // This is running in Node.js context (not browser)
  populateAddOnServices()
    .then(() => {
      console.log('Add-on services population completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to populate add-on services:', error);
      process.exit(1);
    });
}
