import React from 'react';
import { CheckCircle2, Crown, Star, CreditCard } from 'lucide-react';

interface MembershipCardProps {
  name: string;
  price: string;
  duration: string;
  type: string;
  features: string[];
  isPopular: boolean;
  onSelect: () => void;
}

const MembershipCard = ({ 
  name, 
  price, 
  duration, 
  type, 
  features, 
  isPopular, 
  onSelect 
}: MembershipCardProps) => {
  return (
    <div className={`group relative w-full max-w-[320px] sm:max-w-sm md:max-w-md mx-auto ${
      isPopular 
        ? 'bg-white/[0.04] border-rebuild-yellow/30 scale-[1.02] sm:scale-105' 
        : 'bg-white/[0.02] border-white/10'
    } backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] sm:hover:scale-[1.05] border hover:border-white/20 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 h-full flex flex-col`}>
      
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-rebuild-yellow to-amber-400 text-black px-3 sm:px-4 py-1 rounded-lg sm:rounded-xl text-xs font-bold flex items-center">
            <Crown size={10} className="sm:size-3 mr-1" />
            <span className="text-xs sm:text-xs">MOST POPULAR</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="p-3 sm:p-4 md:p-6 text-center">
        {/* Type Badge */}
        <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-xs font-medium mb-2 sm:mb-3 md:mb-4 ${
          isPopular 
            ? 'bg-rebuild-yellow/20 text-rebuild-yellow' 
            : 'bg-white/10 text-gray-300'
        }`}>
          <Star size={10} className="sm:size-3 mr-1" />
          <span className="text-xs">{type}</span>
        </div>
        
        {/* Plan Name */}
        <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight ${
          isPopular ? 'text-rebuild-yellow' : 'text-white'
        }`}>
          {name}
        </h3>
        
        {/* Price Display */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-baseline justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">₹{price}</span>
            <span className="text-gray-400 ml-1 text-xs sm:text-sm">/{duration}</span>
          </div>
          {isPopular && (
            <div className="mt-1 sm:mt-2 text-xs text-rebuild-yellow">
              Best Value Package
            </div>
          )}
        </div>
      </div>
      
      {/* Features */}
      <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 flex-1">
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 md:mb-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-start text-xs sm:text-sm"
            >
              <CheckCircle2 size={14} className="sm:size-4 text-rebuild-yellow mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
        
        {/* Action Button */}
        <button
          onClick={onSelect}
          className={`w-full py-3 sm:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base touch-manipulation ${
            isPopular
              ? 'bg-gradient-to-r from-rebuild-yellow to-amber-400 text-black shadow-md shadow-rebuild-yellow/25 hover:shadow-rebuild-yellow/40'
              : 'bg-white/10 text-white border border-white/20 hover:border-white/30 hover:bg-white/15'
          }`}
        >
          <div className="flex items-center justify-center">
            <CreditCard size={14} className="sm:size-4 mr-2" />
            <span>Choose {name}</span>
          </div>
        </button>
        
        {/* Additional Info */}
        <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-white/10 text-center">
          <div className="text-xs text-gray-400">
            <span className="text-green-400">✓</span> No hidden fees • Cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
