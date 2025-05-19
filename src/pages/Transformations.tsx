import React, { useState } from 'react';
import CTASection from '@/components/CTASection';
import TransformationCard from '@/components/TransformationCard';

const Transformations = () => {
  const [filter, setFilter] = useState('all');
  
  const transformations = [
    {
      id: 1,
      name: "Rajesh Kumar",
      beforeImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747675592/hmf8rvlowbhh1dtqxq7y.jpg",
      afterImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747675561/pg9hi3yubqn1fjwmbd8y.jpg",
      duration: "6 Months",
      goal: "Fat Loss & Muscle Gain",
      testimonial: "I lost 15kgs and gained visible muscle definition within 6 months of joining Rebuild Gym. The trainers' focus on natural methods has completely changed my lifestyle for the better."
    },
    {
      id: 2,
      name: "Vikram Singh",
      beforeImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747677656/pdpmiteuc1g1wbicrskx.jpg",
      afterImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747675897/mne0zrezdxh26uor6ygp.jpg",
      duration: "4 Months",
      goal: "Strength & Toning",
      testimonial: "I've gained incredible strength and confidence without any pressure to use supplements. The coaching at Rebuild Gym has been transformational for my fitness journey."
    },
    {
      id: 3,
      name: "Arjun Desai",
      beforeImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747676152/uzphwgmljn5womru59wz.jpg",
      afterImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747676137/aoaoqoianm3btizaaspi.jpg",
      duration: "8 Months",
      goal: "Muscle Building",
      testimonial: "As a student, I thought I'd need supplements to get real results. The trainers at Rebuild showed me that proper form, nutrition, and consistency are what truly matter."
    },
    {
      id: 4,
      name: "Siddharth Kapoor",
      beforeImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747677823/gznk8fsqrrfsgs7qssac.jpg",
      afterImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747677826/vtmbwu2qhnmmobrdtb1r.jpg",
      duration: "5 Months",
      goal: "Fat Loss",
      testimonial: "I thought getting back in shape would be impossible with my busy schedule. Rebuild created a plan that worked with my routine and helped me lose 20kgs naturally."
    },
    {
      id: 5,
      name: "Akash Sharma",
      beforeImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678020/dzq9jbnylqpmjzt3s7il.jpg",
      afterImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678022/vndwcp0jxmy48kry1kzk.jpg",
      duration: "10 Months",
      goal: "Strength & Muscle",
      testimonial: "I was skeptical about building muscle without supplements, but Rebuild's science-backed approach proved me wrong. I've gained more strength and definition than ever before."
    },
    {
      id: 6,
      name: "Rahul Mehta",
      beforeImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678137/fxwjrf0jdiqvpqpunzet.jpg",
      afterImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678140/afw9nplal7rde8rmigs7.jpg",
      duration: "7 Months",
      goal: "General Fitness",
      testimonial: "After years of inconsistent fitness routines, Rebuild helped me establish a sustainable lifestyle that improved my energy, sleep, and overall health."
    },
    {
      id: 7,
      name: "Nikhil Verma",
      beforeImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678014/svar6sscajch60npv7rt.jpg",
      afterImage: "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678012/dh7k3ezo1rpbsrdxu7jf.jpg",
      duration: "6 Months",
      goal: "Fat Loss & Muscle Gain",
      testimonial: "The trainers at Rebuild showed me that transformation doesn't require shortcuts. With their guidance, I achieved results I never thought possible through natural methods."
    }
  ];
  
  const filteredTransformations = filter === 'all' 
    ? transformations 
    : transformations.filter(t => t.goal.toLowerCase().includes(filter.toLowerCase()));
  
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1598136490929-292a0a7890c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80')",
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <div className="container-custom relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">TRANSFORMATIONS</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Real People. Real Progress. No Steroids.
          </h2>
        </div>
      </section>
      
      {/* Transformation Stories */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">SUCCESS STORIES</h2>
              <p className="text-gray-300">
                Inspiring transformations from members who followed our natural approach
              </p>
            </div>
            
            <div className="mt-6 md:mt-0">
              <div className="inline-flex bg-rebuild-darkgray rounded-md p-1">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('fat loss')}
                  className={`px-4 py-2 rounded ${filter === 'fat loss' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                >
                  Fat Loss
                </button>
                <button 
                  onClick={() => setFilter('muscle')}
                  className={`px-4 py-2 rounded ${filter === 'muscle' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                >
                  Muscle Gain
                </button>
                <button 
                  onClick={() => setFilter('fitness')}
                  className={`px-4 py-2 rounded ${filter === 'fitness' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                >
                  General Fitness
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTransformations.map(transformation => (
              <TransformationCard 
                key={transformation.id}
                name={transformation.name}
                beforeImage={transformation.beforeImage}
                afterImage={transformation.afterImage}
                duration={transformation.duration}
                goal={transformation.goal}
                testimonial={transformation.testimonial}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Video Testimonials */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-gym-texture" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              HEAR FROM OUR MEMBERS
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">VIDEO TESTIMONIALS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video 1 */}
            <div className="bg-rebuild-black rounded-lg overflow-hidden">
              <div className="aspect-video bg-rebuild-darkgray relative flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-rebuild-yellow/50 backdrop-blur-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-rebuild-yellow cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3L19 12L5 21V3Z" fill="#111111" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">Deepak's Journey</h3>
                <p className="text-gray-300 text-sm">Lost 22kg in 8 months</p>
              </div>
            </div>
            
            {/* Video 2 */}
            <div className="bg-rebuild-black rounded-lg overflow-hidden">
              <div className="aspect-video bg-rebuild-darkgray relative flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-rebuild-yellow/50 backdrop-blur-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-rebuild-yellow cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3L19 12L5 21V3Z" fill="#111111" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">Meena's Story</h3>
                <p className="text-gray-300 text-sm">From size XL to M in 6 months</p>
              </div>
            </div>
            
            {/* Video 3 */}
            <div className="bg-rebuild-black rounded-lg overflow-hidden">
              <div className="aspect-video bg-rebuild-darkgray relative flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-rebuild-yellow/50 backdrop-blur-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-rebuild-yellow cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3L19 12L5 21V3Z" fill="#111111" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">Anand's Transformation</h3>
                <p className="text-gray-300 text-sm">Gained 10kg lean muscle in 10 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Transformations;
