
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, CheckCircle } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';

interface BranchCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  features: string[];
}

const BranchCard = ({ title, description, image, link, features }: BranchCardProps) => {
  return (
    <div className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/10 hover:border-white/20 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30">
      
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <ResponsiveImage 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {/* Minimal overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Location Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-rebuild-yellow px-3 py-1 rounded-lg text-xs font-medium border border-rebuild-yellow/20">
          PREMIUM
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-rebuild-yellow transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-2">
          {description}
        </p>
        
        {/* Features - Clean List */}
        <div className="space-y-2 mb-6">
          {features.slice(0, 3).map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center text-sm text-gray-300"
            >
              <CheckCircle size={14} className="text-rebuild-yellow mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          {features.length > 3 && (
            <div className="text-xs text-gray-400 mt-2">
              +{features.length - 3} more amenities
            </div>
          )}
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-400">
          <div className="flex items-center">
            <MapPin size={14} className="text-rebuild-yellow mr-1" />
            <span>Premium Location</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="text-rebuild-yellow mr-1" />
            <span>24/7 Access</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Link 
          to={link}
          className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-rebuild-yellow to-amber-400 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-rebuild-yellow/25 hover:shadow-rebuild-yellow/40"
        >
          <span>Explore Location</span>
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
};

export default BranchCard;
