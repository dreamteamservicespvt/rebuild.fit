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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            <TrainerCard 
              name="Sagar Akula"
              role="Founder & Head Trainer"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg"
              experience="10+ Years"
              specialization="Natural Bodybuilding & Transformation"
            />
            
            <TrainerCard 
              name="Chandu"
              role="Partner & Head Trainer"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678656/ifafg4cds1vj46oqmth4.jpg"
              experience="8 Years"
              specialization="Workout Plan & Personalized Diet Planning with Natural Transformation"
            />
              <TrainerCard 
              name="Vasu"
              role="Strength Coach"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678982/fss5ijkf6cb8grzpdkco.jpg"
              experience="7 Years"
              specialization="Powerlifting & Sports Performance"
            />
            <TrainerCard 
              name="Revathi"
              role="Women's Fitness Coach"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678979/gymlbrwtlgb4quxyksej.jpg"
              experience="6 Years"
              specialization="Toning & Weight Management"
            />
            
            <TrainerCard 
              name="Aparna"
              role="Fitness Instructor"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678984/b2aus5dgw4lnb09hmuha.jpg"
              experience="5 Years"
              specialization="Functional Training & Nutrition"
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
                  <option>Sagar Akula - Founder & Head Trainer</option>
                  <option>Chandu - Partner & Head Trainer</option>
                  <option>Revathi - Women's Fitness Coach</option>
                  <option>Aparna - Fitness Instructor</option>
                  <option>Vasu - Strength Coach</option>
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
