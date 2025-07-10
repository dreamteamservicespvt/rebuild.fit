import { enhancedTrainersService, type TrainerProfile } from '@/lib/firebaseServices';

/**
 * Demo script to populate trainer profiles with sample data
 * This showcases the full multimedia trainer profile system
 */
export const createDemoTrainerProfiles = async () => {
  try {
    console.log('🚀 Creating demo trainer profiles...');
    
    const demoTrainers: Omit<TrainerProfile, 'id'>[] = [
      {
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
        profileImage: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
        heroImage: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
        images: [
          {
            url: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
            caption: 'Sagar Akula - Training Session',
            categoryTag: 'Gallery',
            altText: 'Sagar Akula training photo',
            order: 1
          }
        ],
        videos: [],
        featuredFlag: true,
        acceptingNewClientsFlag: true,
        socialLinks: {
          instagram: 'https://instagram.com/rebuild.fit',
          facebook: 'https://facebook.com/rebuild.fit'
        },
        image: 'https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg',
        experience: '8+ years',
        specialization: 'Natural Bodybuilding, Strength Training',
        order: 1
      },
      {
        name: 'Priya Sharma',
        slug: 'priya-sharma',
        role: 'Yoga & Flexibility Specialist',
        bioShort: 'Certified yoga instructor specializing in flexibility, mindfulness, and holistic wellness.',
        bioLong: `Priya brings over 6 years of experience in yoga and mindfulness practices to Rebuild.Fit. She specializes in helping clients improve flexibility, reduce stress, and achieve mental clarity through yoga and meditation.

Her approach combines traditional yoga practices with modern fitness principles, creating personalized programs that address both physical and mental well-being. Priya is particularly skilled at working with beginners and helping them develop a sustainable yoga practice.

She believes that true fitness encompasses not just physical strength but also mental resilience and emotional balance. Her classes focus on building a strong mind-body connection while improving flexibility and core strength.`,
        experienceYears: 6,
        specializations: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation', 'Flexibility Training', 'Stress Management'],
        certifications: ['Certified Yoga Instructor (RYT 200)', 'Meditation Teacher Certification', 'Prenatal Yoga Specialist'],
        profileImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        heroImage: 'https://images.unsplash.com/photo-1506629905607-ce95ef8a8b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            caption: 'Priya leading a yoga class',
            categoryTag: 'Gallery',
            altText: 'Priya Sharma yoga instruction',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1506629905607-ce95ef8a8b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            caption: 'Outdoor yoga session',
            categoryTag: 'Gallery',
            altText: 'Outdoor yoga practice',
            order: 2
          }
        ],
        videos: [],
        featuredFlag: true,
        acceptingNewClientsFlag: true,
        socialLinks: {
          instagram: 'https://instagram.com/priya.yoga',
          linkedin: 'https://linkedin.com/in/priya-sharma-yoga'
        },
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        experience: '6+ years',
        specialization: 'Yoga, Flexibility, Mindfulness',
        order: 2
      },
      {
        name: 'Rajesh Kumar',
        slug: 'rajesh-kumar',
        role: 'Strength & Powerlifting Coach',
        bioShort: 'Former powerlifter turned coach, specializing in strength training and athletic performance.',
        bioLong: `Rajesh is a former competitive powerlifter with over 10 years of experience in strength training and athletic performance. He has competed at national level powerlifting competitions and now dedicates his expertise to helping others achieve their strength goals.

His training philosophy centers around progressive overload, proper form, and injury prevention. Rajesh works with athletes and fitness enthusiasts to develop customized strength programs that deliver measurable results while maintaining safety.

He is particularly skilled at working with beginners who want to build strength from the ground up, as well as experienced lifters looking to break through plateaus. His methodical approach and attention to detail have helped numerous clients achieve personal records.`,
        experienceYears: 10,
        specializations: ['Powerlifting', 'Olympic Lifting', 'Strength Training', 'Athletic Performance', 'Competition Prep'],
        certifications: ['NSCA Certified Strength & Conditioning Specialist', 'USA Powerlifting Certified Coach', 'Olympic Lifting Certification'],
        profileImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        heroImage: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            caption: 'Rajesh demonstrating deadlift form',
            categoryTag: 'Training',
            altText: 'Strength training demonstration',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            caption: 'Competition powerlifting',
            categoryTag: 'Before/After',
            altText: 'Powerlifting competition',
            order: 2
          }
        ],
        videos: [],
        featuredFlag: true,
        acceptingNewClientsFlag: true,
        socialLinks: {
          instagram: 'https://instagram.com/rajesh.strength',
          facebook: 'https://facebook.com/rajesh.powerlifting'
        },
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        experience: '10+ years',
        specialization: 'Powerlifting, Strength Training',
        order: 3
      },
      {
        name: 'Kavya Patel',
        slug: 'kavya-patel',
        role: 'Nutritionist & Wellness Coach',
        bioShort: 'Certified nutritionist specializing in sports nutrition and sustainable weight management.',
        bioLong: `Kavya is a certified nutritionist and wellness coach with a Master's degree in Sports Nutrition. She specializes in creating personalized nutrition plans that complement training goals and promote overall health and wellness.

Her approach to nutrition is holistic and sustainable, focusing on creating healthy relationships with food rather than restrictive dieting. Kavya works closely with trainers and clients to develop nutrition strategies that support performance, recovery, and long-term health.

She is passionate about educating clients on the science of nutrition and helping them understand how proper fueling can enhance their fitness journey. Her expertise extends to sports nutrition, weight management, and addressing specific dietary needs and preferences.`,
        experienceYears: 7,
        specializations: ['Sports Nutrition', 'Weight Management', 'Meal Planning', 'Supplement Guidance', 'Metabolic Health'],
        certifications: ['Registered Dietitian', 'Certified Sports Nutritionist', 'Precision Nutrition Level 2', 'ISSN Sports Nutrition Specialist'],
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        heroImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            caption: 'Kavya conducting nutrition consultation',
            categoryTag: 'Gallery',
            altText: 'Nutrition consultation session',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            caption: 'Healthy meal planning session',
            categoryTag: 'Training',
            altText: 'Meal planning consultation',
            order: 2
          }
        ],
        videos: [],
        featuredFlag: false,
        acceptingNewClientsFlag: true,
        socialLinks: {
          instagram: 'https://instagram.com/kavya.nutrition',
          linkedin: 'https://linkedin.com/in/kavya-patel-nutrition'
        },
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        experience: '7+ years',
        specialization: 'Nutrition, Wellness Coaching',
        order: 4
      }
    ];

    const createdTrainers = [];
    
    for (const trainer of demoTrainers) {
      try {
        // Check if trainer already exists
        const existing = await enhancedTrainersService.getBySlug(trainer.slug);
        if (existing) {
          console.log(`⚠️  Trainer ${trainer.name} already exists, skipping...`);
          continue;
        }
        
        const trainerId = await enhancedTrainersService.createWithSlug(trainer);
        createdTrainers.push({ id: trainerId, name: trainer.name, slug: trainer.slug });
        console.log(`✅ Created trainer: ${trainer.name} (ID: ${trainerId})`);
        
      } catch (error) {
        console.error(`❌ Failed to create trainer ${trainer.name}:`, error);
      }
    }
    
    console.log('\n📊 Demo Data Creation Summary:');
    console.log(`Total demo trainers: ${demoTrainers.length}`);
    console.log(`Successfully created: ${createdTrainers.length}`);
    console.log(`Skipped (already exist): ${demoTrainers.length - createdTrainers.length}`);
    
    if (createdTrainers.length > 0) {
      console.log('\n🎉 Demo trainer profiles created successfully!');
      console.log('You can now:');
      console.log('1. Visit /admin to manage trainer profiles');
      console.log('2. Visit /trainers to see the trainer listing');
      console.log('3. Visit individual trainer profiles:');
      createdTrainers.forEach(trainer => {
        console.log(`   - /trainers/${trainer.slug} (${trainer.name})`);
      });
    }
    
    return createdTrainers;
    
  } catch (error) {
    console.error('❌ Demo data creation failed:', error);
    throw error;
  }
};

// Helper function to delete all demo data (for testing)
export const deleteDemoTrainerProfiles = async () => {
  try {
    console.log('🗑️  Deleting demo trainer profiles...');
    
    const demoSlugs = ['sagar-akula', 'priya-sharma', 'rajesh-kumar', 'kavya-patel'];
    let deletedCount = 0;
    
    for (const slug of demoSlugs) {
      try {
        const trainer = await enhancedTrainersService.getBySlug(slug);
        if (trainer && trainer.id) {
          await enhancedTrainersService.delete(trainer.id);
          deletedCount++;
          console.log(`✅ Deleted trainer: ${trainer.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to delete trainer with slug ${slug}:`, error);
      }
    }
    
    console.log(`\n📊 Deleted ${deletedCount} demo trainer profiles`);
    return deletedCount;
    
  } catch (error) {
    console.error('❌ Demo data deletion failed:', error);
    throw error;
  }
};

// For development - can be called from browser console
(window as any).createDemoTrainerProfiles = createDemoTrainerProfiles;
(window as any).deleteDemoTrainerProfiles = deleteDemoTrainerProfiles;
