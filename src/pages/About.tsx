
import React from 'react';
import CTASection from '@/components/CTASection';
import { Shield, Target, Clock, Heart } from 'lucide-react';

const About = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80')",
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <div className="container-custom relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">ABOUT US</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            What We Stand For - Building India's First Natural Fitness Ecosystem
          </h2>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 md:py-20 bg-rebuild-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">THE REBUILD STORY</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <p className="text-gray-300 mb-6">
                Founded in 2018 by fitness visionary Sagar Akula, Rebuild Gym started as a small personal training studio with a radical mission: to create a steroid-free fitness environment where natural transformation is the only path.
              </p>
              
              <p className="text-gray-300 mb-6">
                Having witnessed the harmful effects of performance-enhancing substances on young fitness enthusiasts, Sagar decided to create a space where people could achieve impressive results without compromising their health.
              </p>
              
              <p className="text-gray-300">
                What began as a small studio has now expanded to three specialized facilities across Kakinada, each catering to different demographics but all united by the core philosophy of natural fitness and genuine transformation.
              </p>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1331&q=80"
                alt="Rebuild Gym Interior"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-rebuild-yellow p-4 rounded">
                <p className="text-rebuild-black font-bold text-xl">EST. 2018</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision & Mission */}
      <section className="py-16 md:py-20 bg-rebuild-darkgray relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-gym-texture" />
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">OUR VISION</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <p className="text-xl text-gray-100 mb-6">
                To create India's largest steroid-free fitness community where natural transformation is celebrated and sustainable health is prioritized over quick results.
              </p>
              
              <div className="mt-10 bg-rebuild-black/50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Long-Term Goals</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-rebuild-yellow/20 p-2 rounded-full mr-4 mt-1">
                      <Target size={18} className="text-rebuild-yellow" />
                    </div>
                    <p className="text-gray-300">
                      Expand to 10 locations across Andhra Pradesh by 2028
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-rebuild-yellow/20 p-2 rounded-full mr-4 mt-1">
                      <Target size={18} className="text-rebuild-yellow" />
                    </div>
                    <p className="text-gray-300">
                      Develop a certification program for natural fitness trainers
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-rebuild-yellow/20 p-2 rounded-full mr-4 mt-1">
                      <Target size={18} className="text-rebuild-yellow" />
                    </div>
                    <p className="text-gray-300">
                      Launch a mobile app for tracking natural fitness progress
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">OUR MISSION</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <p className="text-xl text-gray-100 mb-6">
                To provide science-backed, steroid-free fitness solutions through specialized gyms that cater to different demographics while maintaining the highest standards of training and nutrition guidance.
              </p>
              
              <div className="mt-10 bg-rebuild-black/50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">How We Work</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-rebuild-yellow/20 p-2 rounded-full mr-4 mt-1">
                      <Clock size={18} className="text-rebuild-yellow" />
                    </div>
                    <p className="text-gray-300">
                      Evidence-based training methods with regular assessment
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-rebuild-yellow/20 p-2 rounded-full mr-4 mt-1">
                      <Clock size={18} className="text-rebuild-yellow" />
                    </div>
                    <p className="text-gray-300">
                      Natural nutrition planning without harmful supplements
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-rebuild-yellow/20 p-2 rounded-full mr-4 mt-1">
                      <Clock size={18} className="text-rebuild-yellow" />
                    </div>
                    <p className="text-gray-300">
                      Customized fitness journey based on individual goals
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brand Values */}
      <section className="py-16 md:py-20 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">BRAND VALUES</h2>
            <div className="w-20 h-1 bg-rebuild-yellow mx-auto mb-6" />
            <p className="max-w-2xl mx-auto text-gray-300">
              Our core principles guide everything we do at Rebuild Gym, from trainer selection to program design
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-rebuild-darkgray p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Shield size={32} className="text-rebuild-yellow" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Integrity in Fitness</h3>
              <p className="text-gray-300">
                We believe in honest, realistic fitness guidance without false promises or harmful shortcuts. Our trainers are committed to ethical practices that prioritize your long-term health.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-rebuild-darkgray p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Heart size={32} className="text-rebuild-yellow" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Long-Term Wellness</h3>
              <p className="text-gray-300">
                We focus on sustainable fitness approaches that improve your overall health and wellbeing, not just your appearance. Our goal is to help you maintain results for life, not just for a season.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-rebuild-darkgray p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Target size={32} className="text-rebuild-yellow" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Empowerment Through Discipline</h3>
              <p className="text-gray-300">
                We believe true transformation comes through commitment, consistency, and mental strength. We help you develop the discipline needed to achieve your goals naturally.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Milestones */}
      <section className="py-16 md:py-20 bg-rebuild-darkgray relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 bg-gym-texture" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">OUR JOURNEY</h2>
            <div className="w-20 h-1 bg-rebuild-yellow mx-auto mb-6" />
            <p className="max-w-2xl mx-auto text-gray-300">
              The growth of Rebuild Gym from a small idea to a thriving fitness ecosystem
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative border-l-2 border-rebuild-yellow/30 pl-8 ml-4 md:ml-8 space-y-16">
            {/* 2018 */}
            <div className="relative">
              <div className="absolute -left-[41px] p-1 bg-rebuild-black border-2 border-rebuild-yellow rounded-full">
                <div className="w-4 h-4 bg-rebuild-yellow rounded-full"></div>
              </div>
              <h3 className="text-rebuild-yellow font-bold text-xl mb-2">2018</h3>
              <h4 className="text-xl font-bold mb-3">The Beginning</h4>
              <p className="text-gray-300 mb-2">
                Sagar Akula founded the first Rebuild Gym location as a small personal training studio, focusing exclusively on natural transformation methods.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"
                alt="First Rebuild Gym Location"
                className="mt-4 rounded-lg w-full max-w-md"
              />
            </div>
            
            {/* 2020 */}
            <div className="relative">
              <div className="absolute -left-[41px] p-1 bg-rebuild-black border-2 border-rebuild-yellow rounded-full">
                <div className="w-4 h-4 bg-rebuild-yellow rounded-full"></div>
              </div>
              <h3 className="text-rebuild-yellow font-bold text-xl mb-2">2020</h3>
              <h4 className="text-xl font-bold mb-3">Women's Only Branch</h4>
              <p className="text-gray-300 mb-2">
                Recognizing the need for a dedicated women's fitness space, we opened our second branch with female trainers and specialized programs.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Women's Only Branch"
                className="mt-4 rounded-lg w-full max-w-md"
              />
            </div>
            
            {/* 2022 */}
            <div className="relative">
              <div className="absolute -left-[41px] p-1 bg-rebuild-black border-2 border-rebuild-yellow rounded-full">
                <div className="w-4 h-4 bg-rebuild-yellow rounded-full"></div>
              </div>
              <h3 className="text-rebuild-yellow font-bold text-xl mb-2">2022</h3>
              <h4 className="text-xl font-bold mb-3">Student-Focused Gym</h4>
              <p className="text-gray-300 mb-2">
                We launched our third branch, a budget-friendly gym for students with high-energy group classes and essential equipment.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Student Branch"
                className="mt-4 rounded-lg w-full max-w-md"
              />
            </div>
            
            {/* 2023 */}
            <div className="relative">
              <div className="absolute -left-[41px] p-1 bg-rebuild-black border-2 border-rebuild-yellow rounded-full">
                <div className="w-4 h-4 bg-rebuild-yellow rounded-full"></div>
              </div>
              <h3 className="text-rebuild-yellow font-bold text-xl mb-2">2023</h3>
              <h4 className="text-xl font-bold mb-3">Premium Facility Upgrade</h4>
              <p className="text-gray-300 mb-2">
                We renovated our flagship location with state-of-the-art equipment, nutrition consultation rooms, and recovery facilities.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Premium Facility Upgrade"
                className="mt-4 rounded-lg w-full max-w-md"
              />
            </div>
            
            {/* 2025 */}
            <div className="relative">
              <div className="absolute -left-[41px] p-1 bg-rebuild-black border-2 border-rebuild-yellow/30 rounded-full">
                <div className="w-4 h-4 bg-rebuild-yellow/30 rounded-full"></div>
              </div>
              <h3 className="text-rebuild-yellow/70 font-bold text-xl mb-2">2025 (Future)</h3>
              <h4 className="text-xl font-bold mb-3">Expansion Plans</h4>
              <p className="text-gray-300">
                Our vision includes expanding to neighboring cities while maintaining our core philosophy of natural, steroid-free fitness.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default About;
