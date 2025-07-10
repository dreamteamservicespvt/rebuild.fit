import React, { useState, useEffect } from 'react';
import CTASection from '@/components/CTASection';
import TransformationCard from '@/components/TransformationCard';
import { transformationsService, type Transformation } from '@/lib/firebaseServices';
import LoadingScreen from '@/components/LoadingScreen';
import { Trophy, Filter } from 'lucide-react';

const Transformations = () => {
  const [filter, setFilter] = useState('all');
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = transformationsService.onSnapshot((transformationsData) => {
      setTransformations(transformationsData);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rebuild-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Transformations</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
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
          
          {transformations.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-rebuild-darkgray to-rebuild-black flex items-center justify-center shadow-xl border border-rebuild-yellow/20">
                <Trophy size={40} className="text-rebuild-yellow" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-white">No Transformations Yet</h3>
              <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed">
                Our members' amazing transformation stories will be featured here. Check back soon for inspiring journeys and natural progress!
              </p>
              <div className="mt-8">
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-gradient-to-r from-rebuild-yellow to-yellow-400 text-rebuild-black px-8 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-rebuild-yellow transition-all duration-300 transform hover:scale-105"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
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
          )}
        </div>
      </section>
      

      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Transformations;
