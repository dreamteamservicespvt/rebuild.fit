import { 
  enhancedTrainersService, 
  trainersService, 
  generateTrainerSlug, 
  type TrainerProfile 
} from '@/lib/firebaseServices';

/**
 * Migration script to convert existing Trainer records to TrainerProfile format
 * This ensures backward compatibility while adding new features
 */
export const migrateTrainersToProfiles = async () => {
  try {
    console.log('Starting trainer migration to TrainerProfile format...');
    
    // Get all existing trainers
    const existingTrainers = await trainersService.getAll();
    console.log(`Found ${existingTrainers.length} trainers to migrate`);
    
    const migrationResults = [];
    
    for (const trainer of existingTrainers) {
      try {
        // Check if trainer already has new profile fields
        if (trainer.slug && trainer.bioShort) {
          console.log(`Trainer ${trainer.name} already migrated, skipping...`);
          continue;
        }
        
        // Generate slug for trainer
        const baseSlug = generateTrainerSlug(trainer.name);
        let slug = baseSlug;
        let counter = 1;
        
        // Ensure unique slug
        const allTrainers = await enhancedTrainersService.getAll();
        while (allTrainers.some(t => t.slug === slug && t.id !== trainer.id)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        // Create TrainerProfile data with backward compatibility
        const profileData: Partial<TrainerProfile> = {
          // Keep existing fields
          name: trainer.name,
          role: trainer.role,
          
          // Add new required fields with defaults
          slug: slug,
          bioShort: `${trainer.name} is a ${trainer.role} at Rebuild.Fit with ${trainer.experience || 'extensive'} experience.`,
          bioLong: `${trainer.name} specializes in ${trainer.specialization || 'fitness training'} and is dedicated to helping clients achieve their fitness goals through natural, sustainable methods. With ${trainer.experience || 'years of experience'} in the fitness industry, ${trainer.name.split(' ')[0]} brings expertise and passion to every training session.`,
          experienceYears: parseInt(trainer.experience?.replace(/\D/g, '') || '3') || 3,
          specializations: trainer.specialization ? trainer.specialization.split(',').map(s => s.trim()) : ['General Fitness'],
          certifications: ['Certified Personal Trainer'],
          
          // Media fields
          profileImage: trainer.image || '/placeholder-trainer.jpg',
          images: [],
          videos: [],
          
          // Flags
          featuredFlag: false,
          acceptingNewClientsFlag: true,
          
          // Legacy compatibility fields
          image: trainer.image,
          experience: trainer.experience,
          specialization: trainer.specialization,
          
          // System fields
          order: trainer.order,
          createdAt: trainer.createdAt,
          updatedAt: new Date() as any,
        };
        
        // Update the trainer with new profile data
        await enhancedTrainersService.update(trainer.id!, profileData);
        
        migrationResults.push({
          id: trainer.id,
          name: trainer.name,
          slug: slug,
          status: 'success'
        });
        
        console.log(`✅ Migrated trainer: ${trainer.name} -> ${slug}`);
        
      } catch (error) {
        console.error(`❌ Failed to migrate trainer ${trainer.name}:`, error);
        migrationResults.push({
          id: trainer.id,
          name: trainer.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`Total trainers: ${existingTrainers.length}`);
    console.log(`Successfully migrated: ${migrationResults.filter(r => r.status === 'success').length}`);
    console.log(`Failed: ${migrationResults.filter(r => r.status === 'error').length}`);
    
    return migrationResults;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

/**
 * Utility function to add sample trainer with full profile data
 */
export const addSampleTrainerProfile = async () => {
  try {
    console.log('Adding sample trainer profile...');
    
    const sampleTrainer: Omit<TrainerProfile, 'id'> = {
      name: 'Sagar Akula',
      slug: 'sagar-akula',
      role: 'Founder & Head Trainer',
      bioShort: 'Founder of Rebuild.Fit, passionate about natural fitness and transformation.',
      bioLong: `With a passion for natural fitness and a vision to transform the fitness landscape in India, Sagar founded Rebuild Gym to provide a space where genuine transformation happens without harmful shortcuts.

Having witnessed the harmful effects of steroid use in the fitness industry, Sagar dedicated himself to creating a movement focused on sustainable, health-first training methods. His expertise in natural bodybuilding and strength training has helped countless clients achieve remarkable results.

Sagar believes that true fitness comes from consistency, proper nutrition, and a deep understanding of one's body. He works closely with each client to develop personalized training programs that focus on long-term health and sustainable results.`,
      experienceYears: 8,
      specializations: ['Natural Bodybuilding', 'Strength & Conditioning', 'Transformation Coaching', 'Nutrition Planning'],
      certifications: ['Certified Fitness Trainer', 'Sports Nutrition Specialist', 'Strength Training Expert', 'First Aid & CPR'],
      
      // Media
      profileImage: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
      heroImage: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
      images: [
        {
          url: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
          caption: 'Sagar Akula - Founder & Head Trainer',
          categoryTag: 'Gallery',
          altText: 'Sagar Akula training photo',
          order: 1
        }
      ],
      videos: [],
      
      // Settings
      featuredFlag: true,
      acceptingNewClientsFlag: true,
      
      // Social links
      socialLinks: {
        instagram: 'https://instagram.com/rebuild.fit',
        facebook: 'https://facebook.com/rebuild.fit'
      },
      
      // Legacy fields
      image: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
      experience: '8+ years',
      specialization: 'Natural Bodybuilding, Strength Training',
      
      // System
      order: 1
    };
    
    const trainerId = await enhancedTrainersService.createWithSlug(sampleTrainer);
    console.log(`✅ Sample trainer created with ID: ${trainerId}`);
    
    return trainerId;
    
  } catch (error) {
    console.error('❌ Failed to create sample trainer:', error);
    throw error;
  }
};

// For development - can be called from browser console
(window as any).migrateTrainersToProfiles = migrateTrainersToProfiles;
(window as any).addSampleTrainerProfile = addSampleTrainerProfile;
