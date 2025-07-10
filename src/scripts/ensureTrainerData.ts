import { enhancedTrainersService, type TrainerProfile } from '@/lib/firebaseServices';

/**
 * Ensures trainer data exists in the database
 * If no trainers exist, creates basic demo data
 */
export const ensureTrainerData = async () => {
  try {
    console.log('🔍 Checking trainer data...');
    
    const existingTrainers = await enhancedTrainersService.getAll();
    console.log(`Found ${existingTrainers.length} existing trainers`);
    
    if (existingTrainers.length === 0) {
      console.log('📝 No trainers found, creating demo data...');
      await createBasicTrainerData();
    } else {
      console.log('✅ Trainer data exists');
      // Check if trainers have proper image URLs
      const trainersWithoutImages = existingTrainers.filter(t => !t.profileImage && !t.image);
      if (trainersWithoutImages.length > 0) {
        console.log(`⚠️ Found ${trainersWithoutImages.length} trainers without images, updating...`);
        await updateTrainerImages(trainersWithoutImages);
      }
    }
  } catch (error) {
    console.error('❌ Error ensuring trainer data:', error);
  }
};

const createBasicTrainerData = async () => {
  const basicTrainers: Omit<TrainerProfile, 'id'>[] = [
    {
      name: 'Sagar Akula',
      slug: 'sagar-akula',
      role: 'Founder & Head Trainer',
      bioShort: 'Founder of Rebuild.Fit with 8+ years of experience in natural fitness.',
      bioLong: 'Passionate about natural fitness and transformation without harmful shortcuts.',
      experienceYears: 8,
      specializations: ['Natural Bodybuilding', 'Strength Training', 'Transformation Coaching'],
      certifications: ['Certified Fitness Trainer', 'Sports Nutrition Specialist'],
      profileImage: 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      images: [],
      videos: [],
      featuredFlag: true,
      acceptingNewClientsFlag: true,
      socialLinks: {
        instagram: 'https://instagram.com/rebuild.fit'
      },
      // Legacy fields for backward compatibility
      image: 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      experience: '8+ years',
      specialization: 'Natural Bodybuilding, Strength Training',
      order: 1
    },
    {
      name: 'Priya Sharma',
      slug: 'priya-sharma',
      role: 'Yoga & Flexibility Specialist',
      bioShort: 'Certified yoga instructor specializing in flexibility and mindfulness.',
      bioLong: 'Expert in yoga, flexibility training, and holistic wellness approaches.',
      experienceYears: 6,
      specializations: ['Yoga', 'Flexibility Training', 'Mindfulness'],
      certifications: ['Certified Yoga Instructor', 'Flexibility Specialist'],
      profileImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      images: [],
      videos: [],
      featuredFlag: true,
      acceptingNewClientsFlag: true,
      socialLinks: {
        instagram: 'https://instagram.com/priya.yoga'
      },
      // Legacy fields for backward compatibility
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      experience: '6+ years',
      specialization: 'Yoga, Flexibility, Mindfulness',
      order: 2
    },
    {
      name: 'Rajesh Kumar',
      slug: 'rajesh-kumar',
      role: 'Strength & Powerlifting Coach',
      bioShort: 'Expert in powerlifting and strength training with proven results.',
      bioLong: 'Specialized in building raw strength and powerlifting techniques.',
      experienceYears: 10,
      specializations: ['Powerlifting', 'Strength Training', 'Olympic Lifting'],
      certifications: ['Powerlifting Coach', 'Strength Training Specialist'],
      profileImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      images: [],
      videos: [],
      featuredFlag: true,
      acceptingNewClientsFlag: true,
      socialLinks: {
        instagram: 'https://instagram.com/rajesh.strength'
      },
      // Legacy fields for backward compatibility
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      experience: '10+ years',
      specialization: 'Powerlifting, Strength Training',
      order: 3
    }
  ];

  for (const trainer of basicTrainers) {
    try {
      await enhancedTrainersService.create(trainer);
      console.log(`✅ Created trainer: ${trainer.name}`);
    } catch (error) {
      console.error(`❌ Failed to create trainer ${trainer.name}:`, error);
    }
  }
};

const updateTrainerImages = async (trainers: TrainerProfile[]) => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ];

  for (let i = 0; i < trainers.length; i++) {
    const trainer = trainers[i];
    const fallbackImage = fallbackImages[i % fallbackImages.length];
    
    try {
      await enhancedTrainersService.update(trainer.id!, {
        profileImage: fallbackImage,
        image: fallbackImage // Update legacy field too
      });
      console.log(`✅ Updated image for trainer: ${trainer.name}`);
    } catch (error) {
      console.error(`❌ Failed to update trainer ${trainer.name}:`, error);
    }
  }
};

// Run the script if called directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).ensureTrainerData = ensureTrainerData;
}
