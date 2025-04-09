
import React from 'react';

interface TransformationCardProps {
  name: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  goal: string;
  testimonial: string;
}

const TransformationCard = ({
  name,
  beforeImage,
  afterImage,
  duration,
  goal,
  testimonial
}: TransformationCardProps) => {
  return (
    <div className="bg-rebuild-darkgray rounded-lg overflow-hidden">
      <div className="relative flex">
        {/* Before image */}
        <div className="w-1/2 h-72 relative">
          <img 
            src={beforeImage} 
            alt={`${name} before transformation`} 
            className="w-full h-full object-cover" 
          />
          <span className="absolute bottom-2 left-2 bg-rebuild-black/80 px-3 py-1 rounded text-xs font-semibold">
            BEFORE
          </span>
        </div>
        
        {/* After image */}
        <div className="w-1/2 h-72 relative">
          <img 
            src={afterImage} 
            alt={`${name} after transformation`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 right-2 bg-rebuild-yellow text-rebuild-black px-3 py-1 rounded text-xs font-semibold">
            AFTER
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">{name}</h3>
          <div className="bg-rebuild-yellow/20 text-rebuild-yellow px-2 py-1 rounded text-xs font-medium">
            {goal}
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          Transformation Period: {duration}
        </p>
        
        <blockquote className="text-sm text-gray-300 italic border-l-2 border-rebuild-yellow pl-4">
          {testimonial}
        </blockquote>
      </div>
    </div>
  );
};

export default TransformationCard;
