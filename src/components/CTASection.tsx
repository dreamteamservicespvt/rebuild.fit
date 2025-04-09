
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-rebuild-yellow text-rebuild-black py-16 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_0,_rgba(0,0,0,0)_45%)]" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">START YOUR JOURNEY TODAY</h2>
            <p className="text-lg font-medium max-w-xl">
              Begin your natural transformation with expert guidance and a supportive community
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/membership" 
              className="bg-rebuild-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              BOOK FREE TRIAL <ArrowRight size={18} className="ml-2" />
            </Link>
            
            <Link 
              to="/contact" 
              className="border-2 border-rebuild-black px-6 py-3 rounded-md hover:bg-rebuild-black hover:text-white transition-colors flex items-center justify-center"
            >
              <Phone size={18} className="mr-2" /> TALK TO A TRAINER
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
