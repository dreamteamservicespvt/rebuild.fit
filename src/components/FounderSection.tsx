
import React from 'react';

const FounderSection = () => {
  return (
    <section className="py-16 md:py-24 bg-rebuild-darkgray relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-gym-texture" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Founder image */}
            <div className="w-full aspect-[3/4] overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80" 
                alt="Sagar Akula - Founder of Rebuild Gym" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
            {/* Quote overlay */}
            <div className="absolute -bottom-6 -right-6 bg-rebuild-yellow p-6 rounded max-w-xs">
              <blockquote className="text-rebuild-black font-medium italic">
                "We don't just build bodies, we rebuild lives through natural fitness."
              </blockquote>
            </div>
          </div>
          
          <div>
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              OUR FOUNDER
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">SAGAR AKULA</h2>
            <p className="text-gray-300 mb-6">
              With over a decade of experience in fitness and nutrition, Sagar Akula founded Rebuild Gym with a revolutionary vision - to create India's first steroid-free gym ecosystem that promotes natural transformation through science-backed methods.
            </p>
            <p className="text-gray-300 mb-6">
              Frustrated by the rampant use of harmful supplements and steroids in the industry, Sagar dedicated himself to proving that impressive results are achievable without compromising long-term health. His philosophy centers around sustainable fitness, proper nutrition, and mental discipline.
            </p>
            <p className="text-gray-300">
              Today, Rebuild Gym stands as a testament to his vision with three specialized branches in Kakinada, each dedicated to providing safe, effective, and scientifically-backed fitness solutions for different demographics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
