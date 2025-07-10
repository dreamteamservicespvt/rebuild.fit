import React, { useState, useEffect } from 'react';
import CTASection from '@/components/CTASection';
import TrainerCard from '@/components/TrainerCard';
import { TrainerGridSkeleton } from '@/components/TrainerCardSkeleton';
import { enhancedTrainersService, type TrainerProfile } from '@/lib/firebaseServices';
import { Loader2, Users } from 'lucide-react';

const Trainers = () => {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('book');
    if (bookingSection) {
      bookingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  useEffect(() => {
    // Fetch trainers from Firebase
    const unsubscribe = enhancedTrainersService.onSnapshot((trainersList) => {
      setTrainers(trainersList);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // Handle URL hash navigation (e.g., from Index page)
  useEffect(() => {
    if (window.location.hash === '#book') {
      setTimeout(() => {
        scrollToBooking();
      }, 100); // Small delay to ensure page is rendered
    }
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')",
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <div className="container-custom relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">OUR TRAINERS</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Guided by Experts in Natural Fitness and Transformation
          </h2>
        </div>
      </section>
      
      {/* Trainer of the Month */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 xl:w-2/5 relative">
              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                <img 
                  src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg"
                  alt="Trainer of the Month"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-rebuild-yellow p-6 rounded-lg shadow-lg">
                <h3 className="text-rebuild-black font-bold text-xl">FOUNDER & LEAD TRAINER</h3>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 xl:w-3/5">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">SAGAR AKULA</h2>
              <h3 className="text-rebuild-yellow text-xl mb-6">Founder & Head Trainer</h3>
              
              <div className="space-y-6 text-gray-300">
                <p>
                  With a passion for natural fitness and a vision to transform the fitness landscape in India, Sagar founded Rebuild Gym to provide a space where genuine transformation happens without harmful shortcuts.
                </p>
                <p>
                  Having witnessed the harmful effects of steroid use in the fitness industry, Sagar dedicated himself to creating a movement focused on sustainable, health-first training methods. His expertise in natural bodybuilding and strength training has helped countless clients achieve remarkable results.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-rebuild-darkgray p-4 rounded">
                    <h4 className="text-lg font-semibold mb-2">Specializations</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Natural Bodybuilding</li>
                      <li>Strength & Conditioning</li>
                      <li>Transformation Coaching</li>
                      <li>Nutrition Planning</li>
                    </ul>
                  </div>
                  
                  <div className="bg-rebuild-darkgray p-4 rounded">
                    <h4 className="text-lg font-semibold mb-2">Certifications</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Certified Fitness Trainer</li>
                      <li>Sports Nutrition Specialist</li>
                      <li>Strength Training Expert</li>
                      <li>First Aid & CPR</li>
                    </ul>
                  </div>
                </div>
                
                <a href="#book" className="inline-block mt-6 bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
                  BOOK A SESSION WITH SAGAR
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* All Trainers */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">MEET THE TEAM</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Our trainers are selected for their expertise, commitment to natural fitness, and passion for helping clients achieve sustainable results
            </p>
          </div>
          
          {loading ? (
            <TrainerGridSkeleton count={8} />
          ) : trainers.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-rebuild-black/40 p-8 rounded-lg max-w-md mx-auto">
                <Users size={48} className="text-rebuild-yellow mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">No Trainers Found</h3>
                <p className="text-gray-400 mb-4">Our trainer profiles are currently being updated. Please check back soon.</p>
                <a href="#book" className="inline-block bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
                  Request More Information
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
              {trainers.map((trainer, index) => (
                <div 
                  key={trainer.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TrainerCard 
                    name={trainer.name}
                    role={trainer.role}
                    image={trainer.profileImage || trainer.image} // Use new profileImage field with fallback
                    experience={trainer.experienceYears ? `${trainer.experienceYears} years` : trainer.experience} // Use new field with fallback
                    specialization={trainer.specializations?.join(', ') || trainer.specialization} // Use new array field with fallback
                    className="h-full w-full max-w-sm mx-auto"
                    onBookClick={scrollToBooking}
                    slug={trainer.slug} // Pass slug for profile linking
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Booking Section */}
      <section id="book" className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              PERSONALIZED GUIDANCE
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">BOOK A CONSULTATION</h2>
            <p className="max-w-2xl mx-auto text-gray-300 mt-4">
              Take the first step towards your transformation with a one-on-one session with one of our expert trainers
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-rebuild-darkgray p-8 rounded-lg">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Preferred Trainer</label>
                <select className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none">
                  <option>No preference</option>
                  <option>Sagar Akula - Founder & Head Trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id}>
                      {trainer.name} - {trainer.role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Your Fitness Goals</label>
                <textarea 
                  rows={4}
                  className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors"
              >
                SCHEDULE MY CONSULTATION
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Trainers;
