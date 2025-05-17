import React, { useState, useEffect } from 'react';

const FounderSection = () => {
  const founderImages = [
    "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470855/mjiwoxgurndo0dr5fm8c.jpg",
    "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/iduzd9ygya8yfim4dxx6.jpg",
    "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470856/boob7prv2rqhcqxzsz3t.jpg",
    "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg",
    "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470853/cymkig5zexwa3cxo6wcg.jpg",
    "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470853/cymkig5zexwa3cxo6wcg.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const transitionInterval = setInterval(() => {
      // Start transition effect
      setIsTransitioning(true);
      
      // After transition starts, set the next image
      const timeout = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % founderImages.length);
        
        // Reset transition state after the new image is set
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 750); // Half of the transition duration
      
      return () => clearTimeout(timeout);
    }, 4000); // Change image every 4 seconds
    
    return () => clearInterval(transitionInterval);
  }, [founderImages.length]);

  return (
    <section className="py-16 md:py-24 bg-rebuild-darkgray relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-gym-texture" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Founder image carousel */}
            <div className="w-full aspect-[3/4] overflow-hidden rounded-lg relative">
              {founderImages.map((imgSrc, index) => (
                <img 
                  key={index}
                  src={imgSrc} 
                  alt={`Sagar Akula - Founder of Rebuild Gym ${index + 1}`} 
                  className={`absolute w-full h-full object-cover transition-all duration-1500 ease-in-out ${
                    index === currentImageIndex 
                      ? isTransitioning 
                        ? 'opacity-0 scale-110' 
                        : 'opacity-100 scale-100' 
                      : 'opacity-0'
                  }`} 
                />
              ))}
              
              {/* Navigation dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {founderImages.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-rebuild-yellow scale-125' : 'bg-white/50'
                    }`}
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentImageIndex(index);
                        setTimeout(() => setIsTransitioning(false), 50);
                      }, 750);
                    }}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
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
              Today, Rebuild Gym stands as a testament to his vision in Kakinada, dedicated to providing safe, effective, and scientifically-backed fitness solutions for all members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
