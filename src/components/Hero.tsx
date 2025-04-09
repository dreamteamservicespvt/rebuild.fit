
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?auto=format&fit=crop&q=80&w=1770')",
          filter: "brightness(40%)"
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black via-rebuild-black/70 to-transparent" />
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-6 pb-1">
            WELCOME TO
          </h4>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="block">REBUILD GYM</span>
            <span className="block">KAKINADA</span>
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-8 font-light">
            No Steroids. Just Strength. <span className="text-rebuild-yellow font-medium">Real Transformation.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/membership" className="btn-primary flex items-center justify-center">
              JOIN US <ChevronRight size={20} className="ml-1" />
            </Link>
            <Link to="/gyms" className="btn-outline flex items-center justify-center">
              EXPLORE BRANCHES <ChevronRight size={20} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Arrow down animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="#F6C90E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
