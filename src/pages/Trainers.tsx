
import React from 'react';
import CTASection from '@/components/CTASection';
import TrainerCard from '@/components/TrainerCard';

const Trainers = () => {
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
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"
                  alt="Trainer of the Month"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-rebuild-yellow p-6 rounded-lg shadow-lg">
                <h3 className="text-rebuild-black font-bold text-xl">TRAINER OF THE MONTH</h3>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 xl:w-3/5">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">RAVI KUMAR</h2>
              <h3 className="text-rebuild-yellow text-xl mb-6">Head Trainer & Strength Specialist</h3>
              
              <div className="space-y-6 text-gray-300">
                <p>
                  With over 10 years of experience in fitness coaching and a background in sports medicine, Ravi leads our team of trainers with expertise and passion. His philosophy centers around functional strength, proper biomechanics, and natural progression techniques.
                </p>
                <p>
                  After witnessing the harmful effects of steroid use in the fitness industry, Ravi joined Rebuild Gym to help create a movement focused on sustainable, health-first training methods. His clients range from beginners to advanced athletes, all achieving significant results without harmful supplements.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-rebuild-darkgray p-4 rounded">
                    <h4 className="text-lg font-semibold mb-2">Specializations</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Strength & Conditioning</li>
                      <li>Natural Bodybuilding</li>
                      <li>Injury Rehabilitation</li>
                      <li>Nutrition Planning</li>
                    </ul>
                  </div>
                  
                  <div className="bg-rebuild-darkgray p-4 rounded">
                    <h4 className="text-lg font-semibold mb-2">Certifications</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Certified Strength & Conditioning Coach</li>
                      <li>Sports Nutrition Specialist</li>
                      <li>Corrective Exercise Specialist</li>
                      <li>First Aid & CPR</li>
                    </ul>
                  </div>
                </div>
                
                <a href="#book" className="inline-block mt-6 bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors">
                  BOOK A SESSION WITH RAVI
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <TrainerCard 
              name="Ravi Kumar"
              role="Head Trainer"
              image="https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1888&q=80"
              experience="10+ Years"
              specialization="Strength & Conditioning"
            />
            
            <TrainerCard 
              name="Anjali Reddy"
              role="Women's Fitness Coach"
              image="https://images.unsplash.com/photo-1609899464926-c34737772596?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80"
              experience="8 Years"
              specialization="Toning & Functional Fitness"
            />
            
            <TrainerCard 
              name="Vikram Singh"
              role="Nutrition Specialist"
              image="https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              experience="7+ Years"
              specialization="Diet Planning & Weight Management"
            />
            
            <TrainerCard 
              name="Meera Joshi"
              role="Student Program Lead"
              image="https://images.unsplash.com/photo-1530645833031-97107ee1d2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1879&q=80"
              experience="6 Years"
              specialization="Group Training & Basics"
            />
            
            <TrainerCard 
              name="Arjun Kumar"
              role="Strength Coach"
              image="https://images.unsplash.com/photo-1618498082410-b4aa22193b38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              experience="5 Years"
              specialization="Powerlifting & Sports Performance"
            />
            
            <TrainerCard 
              name="Priya Sharma"
              role="Yoga & Mobility Specialist"
              image="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
              experience="9 Years"
              specialization="Flexibility & Recovery"
            />
            
            <TrainerCard 
              name="Raj Patel"
              role="Transformation Coach"
              image="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
              experience="7 Years"
              specialization="Fat Loss & Lifestyle Change"
            />
            
            <TrainerCard 
              name="Sonia Gupta"
              role="Fitness Instructor"
              image="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              experience="4 Years"
              specialization="Group Classes & Cardio"
            />
          </div>
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
                  <option>Ravi Kumar - Head Trainer</option>
                  <option>Anjali Reddy - Women's Fitness</option>
                  <option>Vikram Singh - Nutrition</option>
                  <option>Meera Joshi - Student Program</option>
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
