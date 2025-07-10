
import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';

interface TransformationCardProps {
  name: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  goal: string;
  testimonial: string;
  weightLoss?: string;
  age?: string;
  onClick?: () => void;
}

const TransformationCard = ({
  name,
  beforeImage,
  afterImage,
  duration,
  goal,
  testimonial,
  weightLoss,
  age,
  onClick
}: TransformationCardProps) => {
  return (
    <div 
      className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/10 hover:border-white/20 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 cursor-pointer"
      onClick={onClick}
    >
      {/* Images Container - Main Focus */}
      <div className="relative h-72 overflow-hidden">
        {/* Before image */}
        <div className="absolute left-0 top-0 w-1/2 h-full">
          <ResponsiveImage 
            src={beforeImage} 
            alt={`${name} before transformation`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          {/* Minimal overlay - just for label visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium tracking-wide">
            BEFORE
          </div>
        </div>
        
        {/* After image */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <ResponsiveImage 
            src={afterImage} 
            alt={`${name} after transformation`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Minimal overlay - just for label visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 right-4 bg-rebuild-yellow text-black px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
            AFTER
          </div>
        </div>
      </div>
      
      {/* Content Section - Clean and Minimal */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rebuild-yellow transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <Clock size={14} className="mr-2 text-rebuild-yellow" />
              <span className="font-medium">{duration}</span>
              {age && <span className="ml-3">• Age {age}</span>}
            </div>
            <div className="text-rebuild-yellow font-medium">
              {goal}
            </div>
          </div>
        </div>
        
        {/* Key Stats - Simple and Effective */}
        {weightLoss && (
          <div className="mb-4 text-center bg-gradient-to-r from-rebuild-yellow/10 to-green-500/10 rounded-xl p-3 border border-rebuild-yellow/20">
            <div className="text-rebuild-yellow font-bold text-lg">
              {weightLoss} Lost
            </div>
            <div className="text-xs text-gray-400 font-medium">Weight Loss</div>
          </div>
        )}
        
        {/* Testimonial - Clean Quote */}
        <div className="mb-4">
          <blockquote className="text-sm text-gray-300 leading-relaxed italic line-clamp-3 pl-4 border-l-2 border-rebuild-yellow/30">
            "{testimonial}"
          </blockquote>
        </div>

        {/* Footer - Success Indicator */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center text-gray-400">
            <TrendingUp size={14} className="mr-2 text-green-400" />
            <span className="text-xs font-medium">Verified Result</span>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default TransformationCard;
