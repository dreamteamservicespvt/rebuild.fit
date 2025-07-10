import { gymsService, trainersService, transformationsService, membershipsService, blogService } from './firebaseServices';

// Initial gym data
const INITIAL_GYMS = [
  {
    name: 'Premium Gym',
    description: 'Our flagship TRAINERS with state-of-the-art equipment and a motivating atmosphere for serious fitness enthusiasts.',
    address: '123 Fitness Street, Hyderabad, India',
    phone: '+91 9876543210',
    email: 'premium@rebuild.fit',
    openingHours: 'Mon-Fri: 5:00 AM - 10:00 PM\nSat-Sun: 6:00 AM - 8:00 PM',
    photos: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'],
    // Keep additional fields for compatibility with existing code
    title: 'Premium Gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    link: '/gyms/premium',
    features: ['Personal Training', 'Nutrition Guidance', 'AC', 'Showers', 'Modern Equipment', '24/7 Access']
  },
  {
    name: 'Women-Only Gym',
    description: 'A safe and empowering space exclusively for women, with female trainers and specialized programs.',
    address: '456 Wellness Avenue, Hyderabad, India',
    phone: '+91 9876543211',
    email: 'women@rebuild.fit',
    openingHours: 'Mon-Fri: 6:00 AM - 9:00 PM\nSat-Sun: 7:00 AM - 7:00 PM',
    photos: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'],
    // Keep additional fields for compatibility with existing code
    title: 'Women-Only Gym',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    link: '/gyms/women',
    features: ['Female Trainers', 'Specialized Equipment', 'Privacy', 'Women-Only Hours', 'Safe Environment']
  },
  {
    name: 'Student Gym',
    description: 'Budget-friendly option perfect for students with high energy and a supportive community.',
    address: '789 Campus Road, Hyderabad, India',
    phone: '+91 9876543212',
    email: 'student@rebuild.fit',
    openingHours: 'Mon-Fri: 7:00 AM - 11:00 PM\nSat-Sun: 8:00 AM - 9:00 PM',
    photos: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'],
    // Keep additional fields for compatibility with existing code
    title: 'Student Gym',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    link: '/gyms/student',
    features: ['Affordable', 'High Energy', 'Fully Equipped', 'Student Discounts', 'Flexible Hours']
  }
];

// Initial trainer data
const INITIAL_TRAINERS = [
  {
    name: 'Alex Smith',
    slug: 'alex-smith',
    role: 'Head Trainer',
    bioShort: 'Head trainer with 8+ years of experience in strength training and natural bodybuilding.',
    bioLong: 'Alex is a dedicated fitness professional with over 8 years of experience in strength training and natural bodybuilding. He believes in achieving results through consistent training, proper nutrition, and avoiding harmful shortcuts. Alex has helped hundreds of clients transform their bodies naturally, focusing on sustainable methods that promote long-term health and fitness. His expertise spans from beginner fitness routines to advanced strength training programs.',
    experienceYears: 8,
    specializations: ['Strength Training', 'Natural Bodybuilding', 'Powerlifting', 'Muscle Building'],
    certifications: ['Certified Personal Trainer', 'Strength Training Specialist', 'Natural Bodybuilding Coach'],
    profileImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [],
    videos: [],
    featuredFlag: true,
    acceptingNewClientsFlag: true,
    socialLinks: {
      instagram: 'https://instagram.com/alex.strength'
    },
    // Legacy fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '8+ Years',
    specialization: 'Strength Training & Natural Bodybuilding',
    order: 1
  },
  {
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    role: 'Nutrition Coach',
    bioShort: 'Certified nutrition coach specializing in weight management and sustainable lifestyle changes.',
    bioLong: 'Sarah is a certified nutrition coach with 5+ years of experience helping clients achieve their weight management goals through sustainable nutrition strategies. She believes in creating personalized meal plans that fit into busy lifestyles while promoting overall health and wellness. Sarah\'s approach focuses on education, empowering her clients to make informed choices about their nutrition long after their coaching sessions end.',
    experienceYears: 5,
    specializations: ['Weight Management', 'Nutrition Planning', 'Lifestyle Coaching', 'Meal Prep'],
    certifications: ['Certified Nutrition Coach', 'Weight Management Specialist', 'Sports Nutrition Certificate'],
    profileImage: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [],
    videos: [],
    featuredFlag: true,
    acceptingNewClientsFlag: true,
    socialLinks: {
      instagram: 'https://instagram.com/sarah.nutrition'
    },
    // Legacy fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '5+ Years',
    specialization: 'Weight Management & Nutrition',
    order: 2
  },
  {
    name: 'Michael Chen',
    slug: 'michael-chen',
    role: 'Fitness Trainer',
    bioShort: 'Expert in calisthenics and functional training with 7+ years of experience.',
    bioLong: 'Michael is a passionate fitness trainer specializing in calisthenics and functional training methods. With 7+ years of experience, he has mastered the art of bodyweight training and functional movement patterns. Michael believes that fitness should be accessible to everyone, which is why he focuses on training methods that require minimal equipment but deliver maximum results. His clients learn to use their own body weight effectively while building real-world strength and mobility.',
    experienceYears: 7,
    specializations: ['Calisthenics', 'Functional Training', 'Bodyweight Training', 'Mobility & Flexibility'],
    certifications: ['Functional Movement Specialist', 'Calisthenics Instructor', 'Mobility Coach'],
    profileImage: 'https://images.unsplash.com/photo-1571801807047-c3a4ea4b50e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [],
    videos: [],
    featuredFlag: false,
    acceptingNewClientsFlag: true,
    socialLinks: {
      instagram: 'https://instagram.com/michael.calisthenics',
      youtube: 'https://youtube.com/@michaelchen'
    },
    // Legacy fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1571801807047-c3a4ea4b50e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '7+ Years',
    specialization: 'Calisthenics & Functional Training',
    order: 3
  },
  {
    name: 'Priya Sharma',
    slug: 'priya-sharma',
    role: 'Women\'s Fitness Specialist',
    bioShort: 'Dedicated women\'s fitness specialist with 6+ years of experience in holistic health.',
    bioLong: 'Priya is a certified women\'s fitness specialist with over 6 years of experience helping women achieve their health and fitness goals. She understands the unique challenges women face in their fitness journey and creates supportive, empowering environments for her clients. Priya\'s expertise includes prenatal and postnatal fitness, hormone-balanced training, and building confidence through movement. She believes every woman deserves to feel strong, healthy, and confident in her own body.',
    experienceYears: 6,
    specializations: ['Women\'s Health', 'Prenatal Fitness', 'Postnatal Recovery', 'Hormone Balance', 'Confidence Building'],
    certifications: ['Women\'s Fitness Specialist', 'Prenatal Exercise Specialist', 'Postnatal Corrective Exercise'],
    profileImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: [],
    videos: [],
    featuredFlag: true,
    acceptingNewClientsFlag: true,
    socialLinks: {
      instagram: 'https://instagram.com/priya.womenfitness',
      facebook: 'https://facebook.com/priya.fitness'
    },
    // Legacy fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '6+ Years',
    specialization: 'Women\'s Health & Fitness',
    order: 4
  }
];

// Initial transformation data
const INITIAL_TRANSFORMATIONS = [
  {
    name: 'John Doe',
    beforeImage: 'https://images.unsplash.com/photo-1506629905607-7b9f57c0de2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    duration: '6 months',
    goal: 'Weight Loss',
    testimonial: 'Rebuild Gym helped me lose 30kg in just 6 months without any supplements. The trainers here focus on natural methods and proper nutrition. I feel stronger and more confident than ever!'
  },
  {
    name: 'Jane Smith',
    beforeImage: 'https://images.unsplash.com/photo-1494790108755-2616c5e06a3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    duration: '8 months',
    goal: 'Muscle Gain',
    testimonial: 'I gained 15kg of lean muscle mass naturally at Rebuild Gym. The approach here is completely different - no shortcuts, just hard work and proper guidance. Highly recommend!'
  },
  {
    name: 'Raj Patel',
    beforeImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1548690313-5f5c82ac0c19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    duration: '10 months',
    goal: 'Body Recomposition',
    testimonial: 'Complete body transformation at Rebuild Gym. Lost fat and gained muscle simultaneously. The no-steroids policy here is what sets them apart from other gyms.'
  }
];

// Initial membership data
const INITIAL_MEMBERSHIPS = [
  {
    name: 'STRENGTHENING',
    price: {
      monthly: '₹1,999',
      quarterly: '₹5,499',
      halfyearly: '₹7,499',
      annual: '₹11,999'
    },
    type: 'premium',
    features: ['Access to strength equipment', 'Gym access (6 AM - 10 PM)', 'Locker access', 'Basic strength training guidance'],
    isPopular: false
  },
  {
    name: 'CARDIO + STRENGTHENING',
    price: {
      monthly: '₹2,499',
      quarterly: '₹6,499',
      halfyearly: '₹8,999',
      annual: '₹14,999'
    },
    type: 'premium',
    features: ['Full access to cardio section', 'All strength equipment access', 'Extended hours access', 'Locker & towel service', 'Comprehensive fitness guidance'],
    isPopular: true
  },
  {
    name: 'STUDENT SPECIAL',
    price: {
      monthly: '₹999',
      quarterly: '₹2,799',
      halfyearly: '₹4,999',
      annual: '₹8,999'
    },
    type: 'student',
    features: ['Access to strength equipment', 'Student gym access', 'Off-peak hours only', 'Student ID required'],
    isPopular: false
  },
  {
    name: 'WOMEN\'S FITNESS',
    price: {
      monthly: '₹1,799',
      quarterly: '₹4,999',
      halfyearly: '₹6,999',
      annual: '₹10,999'
    },
    type: 'women',
    features: ['Women-only gym access', 'Female trainers', 'Specialized equipment', 'Safe environment', 'Flexible hours'],
    isPopular: false
  }
];

// Initial blog data
const INITIAL_BLOG_POSTS = [
  {
    title: 'The Myth of Steroids in Bodybuilding',
    excerpt: 'Learn why natural bodybuilding is the sustainable path to fitness and why steroids are not the solution.',
    content: `At Rebuild Gym, we believe in the power of natural bodybuilding. While the fitness industry often promotes quick fixes and artificial enhancements, we stand firm in our commitment to natural methods.

Steroids might promise rapid results, but they come with serious health risks including liver damage, cardiovascular problems, hormonal imbalances, and psychological effects. More importantly, the gains from steroids are often temporary and unsustainable.

Natural bodybuilding, on the other hand, focuses on:
- Proper nutrition and meal planning
- Progressive overload training
- Adequate rest and recovery
- Consistency and patience
- Building habits that last a lifetime

The results might take longer to achieve naturally, but they are sustainable, healthy, and truly yours. Our trainers at Rebuild Gym have helped hundreds of clients achieve their fitness goals without any artificial supplements.

Remember, your health is your wealth. Choose the natural path and build a body that will serve you for life.`,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    author: 'Sagar Akula',
    date: '2024-01-15',
    category: 'Training'
  },
  {
    title: 'Best Exercises for Beginners',
    excerpt: 'Starting your fitness journey? Here are the essential exercises every beginner should focus on.',
    content: `Starting a fitness journey can be overwhelming with so many exercise options available. At Rebuild Gym, we believe in mastering the basics first. Here are the fundamental exercises every beginner should focus on:

**Compound Movements:**
1. Squats - The king of all exercises
2. Deadlifts - Full body strength builder
3. Push-ups - Upper body foundation
4. Pull-ups - Back and arm strength
5. Planks - Core stability

**Why These Exercises:**
- They work multiple muscle groups
- Build functional strength
- Improve coordination and balance
- Form the foundation for advanced movements
- Are time-efficient

**Getting Started:**
- Focus on proper form over heavy weights
- Start with bodyweight versions
- Progress gradually
- Listen to your body
- Ask for guidance from our trainers

Remember, consistency beats intensity when you're starting out. Master these basics, and you'll have a solid foundation for any fitness goal you want to pursue.`,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    author: 'Alex Smith',
    date: '2024-01-10',
    category: 'Training'
  },
  {
    title: 'Nutrition for Natural Bodybuilding',
    excerpt: 'Discover the nutrition principles that fuel natural muscle growth and fat loss.',
    content: `Nutrition is the foundation of natural bodybuilding success. Without proper nutrition, even the best training program will fall short. Here's what you need to know:

**Macronutrient Balance:**
- Protein: 1.6-2.2g per kg body weight
- Carbohydrates: 4-7g per kg body weight
- Fats: 0.8-1.2g per kg body weight

**Meal Timing:**
- Eat protein with every meal
- Time carbohydrates around workouts
- Don't skip meals
- Stay consistent with meal timing

**Hydration:**
- Aim for 3-4 liters of water daily
- More during intense training days
- Monitor urine color for hydration status

**Supplements (Natural Only):**
- Whey protein powder
- Creatine monohydrate
- Vitamin D3
- Omega-3 fatty acids
- Multivitamin

**Foods to Focus On:**
- Lean meats and fish
- Eggs and dairy
- Whole grains
- Fruits and vegetables
- Nuts and seeds

Remember, there are no shortcuts in natural bodybuilding. Proper nutrition combined with consistent training and adequate rest will deliver results that last.`,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    author: 'Sarah Johnson',
    date: '2024-01-05',
    category: 'Nutrition'
  }
];

export const seedDatabase = async () => {
  try {
    // Seed gyms
    for (const gym of INITIAL_GYMS) {
      await gymsService.create(gym);
    }

    // Seed trainers
    for (const trainer of INITIAL_TRAINERS) {
      await trainersService.create(trainer);
    }

    // Seed transformations
    for (const transformation of INITIAL_TRANSFORMATIONS) {
      await transformationsService.create(transformation);
    }

    // Seed memberships
    for (const membership of INITIAL_MEMBERSHIPS) {
      await membershipsService.create(membership);
    }

    // Seed blog posts
    for (const post of INITIAL_BLOG_POSTS) {
      await blogService.create(post);
    }

  } catch (error) {
    throw error;
  }
};

// Uncomment the line below to run the seeding function
// seedDatabase();
