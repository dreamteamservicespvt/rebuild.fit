import { addOnServicesService } from '@/lib/firebaseServices';

export const initializeAddOnServices = async () => {
  try {
    console.log('Initializing add-on services...');

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
        category: 'training' as const,
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
        category: 'nutrition' as const,
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
        category: 'training' as const,
        isPopular: false,
        isActive: true
      }
    ];

    for (const service of sampleServices) {
      await addOnServicesService.create(service);
      console.log(`Created add-on service: ${service.name}`);
    }

    console.log('Add-on services initialized successfully!');
  } catch (error) {
    console.error('Error initializing add-on services:', error);
    throw error;
  }
};

// Run this function to populate the database
if (typeof window !== 'undefined') {
  (window as any).initializeAddOnServices = initializeAddOnServices;
  (window as any).addOnServicesService = addOnServicesService;
}
