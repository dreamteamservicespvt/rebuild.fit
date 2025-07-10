import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import FounderSection from '@/components/FounderSection';
import BranchCard from '@/components/BranchCard';
import TrainerCard from '@/components/TrainerCard';
import TransformationCard from '@/components/TransformationCard';
import CTASection from '@/components/CTASection';
import { Dumbbell, ShieldCheck, Brain, Loader2, Users, ChevronRight } from 'lucide-react';
import { enhancedTrainersService, gymProfileService, type TrainerProfile, type Gym } from '@/lib/firebaseServices';

const Index = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigateToTrainers = () => {
    navigate('/trainers#book');
  };
  
  useEffect(() => {
    // Fetch trainers from Firebase
    const trainersUnsubscribe = enhancedTrainersService.onSnapshot((trainersList) => {
      setTrainers(trainersList);
      setLoading(false);
      
      // Auto-create trainer data if none exists
      if (trainersList.length === 0) {
        createDemoTrainersIfNeeded();
      }
    });
    
    // Fetch gym profile from Firebase
    const gymUnsubscribe = gymProfileService.onSnapshot((gymData) => {
      setGym(gymData);
    });
    
    return () => {
      trainersUnsubscribe();
      gymUnsubscribe();
    };
  }, []);

  // Create demo trainers if database is empty
  const createDemoTrainersIfNeeded = async () => {
    try {
      const demoTrainers = [
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
          socialLinks: { instagram: 'https://instagram.com/rebuild.fit' },
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
          socialLinks: { instagram: 'https://instagram.com/priya.yoga' },
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
          socialLinks: { instagram: 'https://instagram.com/rajesh.strength' },
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          experience: '10+ years',
          specialization: 'Powerlifting, Strength Training',
          order: 3
        }
      ];

      for (const trainer of demoTrainers) {
        await enhancedTrainersService.create(trainer);
      }
    } catch (error) {
      // Silently handle demo trainer creation errors
    }
  };
  
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Founder Vision Section */}
      <FounderSection />
      
      {/* Why Natural? Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1 text-sm sm:text-base">
              OUR PHILOSOPHY
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">WHY NATURAL?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-rebuild-darkgray p-6 sm:p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
                <ShieldCheck size={24} className="sm:size-8 text-rebuild-yellow" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">No Shortcuts</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                We believe in sustainable fitness journeys that lead to lasting results, not quick fixes that harm your body in the long run.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-rebuild-darkgray p-6 sm:p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
                <Dumbbell size={24} className="sm:size-8 text-rebuild-yellow" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">No Harmful Supplements</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Our approach emphasizes natural nutrition, proper workout techniques, and recovery—avoiding dangerous steroids and harmful supplements.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-rebuild-darkgray p-6 sm:p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
                <Brain size={24} className="sm:size-8 text-rebuild-yellow" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Science-backed Coaching</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Our trainers use evidence-based methods and personalized approaches to help you achieve your fitness goals naturally.
              </p>
            </div>
          </div>
          
          {/* Testimonial/Scientific Quote */}
          <blockquote className="mt-8 sm:mt-12 border-l-4 border-rebuild-yellow pl-4 sm:pl-6 max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl italic text-gray-300">
              "Research shows that natural, sustainable fitness methods not only lead to better long-term results, but also significantly reduce health risks associated with performance-enhancing substances."
            </p>
            <footer className="mt-4 text-rebuild-yellow text-sm sm:text-base">
              — Dr. Rajesh Kumar, Sports Medicine Specialist
            </footer>
          </blockquote>
        </div>
      </section>
      
      {/* Our Gym Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-rebuild-yellow/10 rounded-full blur-xl"></div>
            <h4 className="inline-block text-rebuild-yellow tracking-widest uppercase text-xs sm:text-sm mb-3 font-semibold relative z-10">
              DISCOVER
            </h4>
            <div className="relative inline-block">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">OUR GYM</h2>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1 bg-rebuild-yellow rounded-full"></div>
            </div>
            <p className="max-w-xl mx-auto text-gray-300 mt-4 sm:mt-6 text-sm sm:text-base">Experience our state-of-the-art facilities designed for your fitness journey</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-16 h-16 sm:w-20 sm:h-20 bg-rebuild-yellow/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 sm:-bottom-10 -left-6 sm:-left-10 w-12 h-12 sm:w-16 sm:h-16 bg-rebuild-yellow/5 rounded-full blur-lg"></div>
            
            {gym ? (
              <div className="bg-rebuild-black rounded-2xl overflow-hidden border border-gray-700/50 transition-all duration-500 hover:border-rebuild-yellow/50 hover:shadow-xl hover:shadow-rebuild-yellow/5 group">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-2 h-full relative overflow-hidden">
                    <img
                      src={gym.photos && gym.photos.length > 0 ? gym.photos[0] : "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"}
                      alt="Premium Gym"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
                      style={{ minHeight: "250px" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <h3 className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rebuild-yellow to-yellow-200">
                      PREMIUM GYM
                    </h3>
                  </div>
                  
                  <div className="md:col-span-3 p-6 sm:p-8">
                    <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">{gym.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {["For Men & Women", "Personal Training", "Nutrition Guidance", "AC Environment", "Shower Facilities", "Expert Trainers", "Personalized Programs"].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2"></div>
                          <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 sm:mt-8">
                      <Link to="/gyms" className="flex items-center justify-center md:justify-start group">
                        <span className="text-rebuild-yellow mr-2 font-medium text-sm sm:text-base">EXPLORE OUR GYM</span>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rebuild-yellow/20 flex items-center justify-center group-hover:bg-rebuild-yellow transition-all duration-300">
                          <ChevronRight size={12} className="sm:size-3.5 text-rebuild-yellow group-hover:text-black transition-colors duration-300" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <BranchCard 
                title="Premium Gym"
                description="Our flagship TRAINERS with state-of-the-art equipment and comprehensive services for serious fitness enthusiasts."
                image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                link="/gyms"
                features={[
                  "For Men & Women",
                  "Personal Training",
                  "Nutrition Guidance", 
                  "AC Environment",
                  "Shower Facilities",
                  "Expert Trainers",
                  "Personalized Programs"
                ]}
              />
            )}
          </div>
        </div>
      </section>
      
      {/* Transformation Showcase */}
      <section className="py-12 sm:py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1 text-sm sm:text-base">
              SUCCESS STORIES
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">TRANSFORMATION SHOWCASE</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <TransformationCard 
              name="Arjun Desai"
              beforeImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747676152/uzphwgmljn5womru59wz.jpg"
              afterImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747676137/aoaoqoianm3btizaaspi.jpg"
              duration="8 Months"
              goal="Muscle Building"
              testimonial="As a student, I thought I'd need supplements to get real results. The trainers at Rebuild showed me that proper form, nutrition, and consistency are what truly matter."
            />
            
            <TransformationCard 
              name="Siddharth Kapoor"
              beforeImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747677823/gznk8fsqrrfsgs7qssac.jpg"
              afterImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747677826/vtmbwu2qhnmmobrdtb1r.jpg"
              duration="5 Months"
              goal="Fat Loss"
              testimonial="I thought getting back in shape would be impossible with my busy schedule. Rebuild created a plan that worked with my routine and helped me lose 20kgs naturally."
            />
            
            <TransformationCard 
              name="Akash Sharma"
              beforeImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678020/dzq9jbnylqpmjzt3s7il.jpg"
              afterImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678022/vndwcp0jxmy48kry1kzk.jpg"
              duration="10 Months"
              goal="Strength & Muscle"
              testimonial="I was skeptical about building muscle without supplements, but Rebuild's science-backed approach proved me wrong. I've gained more strength and definition than ever before."
            />
          </div>
        </div>
      </section>
      
      {/* Meet the Trainers */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              EXPERT GUIDANCE
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">MEET THE TRAINERS</h2>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 size={40} className="animate-spin text-rebuild-yellow mb-4" />
              <p className="text-gray-400">Loading trainers...</p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-rebuild-black/40 p-8 rounded-lg max-w-md mx-auto">
                <Users size={48} className="text-rebuild-yellow mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">No Trainers Found</h3>
                <p className="text-gray-400 mb-4">Our trainer profiles are currently being updated. Please check back soon.</p>
                <a href="/trainers" className="inline-block bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
                  View All Trainers
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
              {trainers.map((trainer, index) => {
                // Debug logging to understand image URL
                const imageUrl = trainer.profileImage || trainer.image || 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                return (
                  <div 
                    key={trainer.id}
                    className="animate-slide-up flex justify-center"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <TrainerCard 
                      name={trainer.name}
                      role={trainer.role}
                      image={imageUrl}
                      experience={trainer.experienceYears ? `${trainer.experienceYears} years` : trainer.experience || 'N/A'}
                      specialization={trainer.specializations?.join(', ') || trainer.specialization || 'General Fitness'}
                      className="h-full w-full max-w-sm"
                      onBookClick={navigateToTrainers}
                      slug={trainer.slug}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Index;
