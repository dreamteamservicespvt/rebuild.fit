
import React from 'react';
import { cn } from '@/lib/utils';
import { Award, Dumbbell, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';
import { Link } from 'react-router-dom';

interface TrainerCardProps {
  name: string;
  role: string;
  image: string;
  experience: string;
  specialization: string;
  location?: string;
  contact?: string;
  email?: string;
  certifications?: string[];
  className?: string;
  onBookClick?: () => void;
  slug?: string; // Add slug for linking to profile page
}

const TrainerCard = ({ 
  name, 
  role, 
  image, 
  experience, 
  specialization,
  location,
  contact,
  email,
  certifications = [],
  className,
  onBookClick,
  slug
}: TrainerCardProps) => {
  
  const handleBookingClick = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      // Scroll to booking section if no specific handler provided
      const bookingSection = document.getElementById('book');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleImageClick = () => {
    // If slug is available, navigate to profile (this is for images without Link wrapper)
    if (slug) {
      window.location.href = `/trainers/${slug}`;
      return;
    }
    // Fallback to booking scroll
    handleBookingClick();
  };
  
  return (
    <div 
      className={cn(
        "group relative bg-gradient-to-br from-white/8 via-white/4 to-black/20 backdrop-blur-xl rounded-3xl overflow-hidden",
        "shadow-2xl shadow-black/40 hover:shadow-black/60",
        "transition-all duration-700 ease-out transform hover:scale-[1.02]",
        "border border-white/10 hover:border-white/20",
        "w-full max-w-sm mx-auto h-full flex flex-col",
        !slug && "cursor-pointer", // Only add cursor-pointer if no slug (no Link wrapper)
        className
      )}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-rebuild-yellow/3 via-transparent to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Image Section - Optimized for full trainer visibility */}
      <div 
        className={cn(
          "relative aspect-[3/4] overflow-hidden bg-white flex items-center justify-center",
          slug && "cursor-pointer"
        )}
      >
        {slug ? (
          <Link to={`/trainers/${slug}`} className="w-full h-full block">
            <img
              src={image || 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
              }}
            />
          </Link>
        ) : (
          <img
            src={image || 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 cursor-pointer hover:scale-105"
            onClick={handleImageClick}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            }}
          />
        )}
        
        {/* Premium gradient overlays - lighter for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        
        {/* Role badge - minimal design */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/60 backdrop-blur-lg text-rebuild-yellow px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-medium border border-white/10">
          {role}
        </div>
        
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>
      
      {/* Content Section - Compact and organized */}
      <div className="p-3 sm:p-5 relative z-10 flex-1 flex flex-col">
        {/* Header section - tighter spacing */}
        <div className="mb-3 sm:mb-4">
          {slug ? (
            <Link to={`/trainers/${slug}`}>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-rebuild-yellow transition-colors duration-300 leading-tight">
                {name}
              </h3>
            </Link>
          ) : (
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-rebuild-yellow transition-colors duration-300 leading-tight">
              {name}
            </h3>
          )}
          
          {/* Specialization and location in a compact layout */}
          <div className="space-y-1.5">
            <div className="flex items-center">
              <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-rebuild-yellow/20 flex items-center justify-center mr-2 sm:mr-2.5">
                <Dumbbell size={10} className="sm:size-3 text-rebuild-yellow" />
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                {specialization}
              </p>
            </div>
            
            {location && (
              <div className="flex items-center">
                <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-rebuild-yellow/20 flex items-center justify-center mr-2 sm:mr-2.5">
                  <MapPin size={10} className="sm:size-3 text-rebuild-yellow" />
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
                  {location}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Experience - simplified single row */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/10 hover:border-white/20 transition-colors duration-300 mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-rebuild-yellow/20 p-1 sm:p-1.5 rounded-full">
                <Award size={12} className="sm:size-4 text-rebuild-yellow" />
              </div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Experience</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white">{experience || 'Professional'}</p>
          </div>
        </div>
        
        {/* Contact info - horizontal layout for space efficiency */}
        {(contact || email) && (
          <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-3">
            {contact && (
              <div className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
                <Phone size={12} className="sm:size-4 text-rebuild-yellow mr-1 sm:mr-2" />
                <span className="text-xs font-medium">{contact}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
                <Mail size={12} className="sm:size-4 text-rebuild-yellow mr-1 sm:mr-2" />
                <span className="text-xs font-medium">{email}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Certifications - compact pill design */}
        {certifications.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h4 className="text-xs font-semibold mb-2 text-gray-400 uppercase tracking-wider">Certifications</h4>
            <div className="flex flex-wrap gap-1.5">
              {certifications.slice(0, 2).map((cert, index) => (
                <span 
                  key={index} 
                  className="px-2 sm:px-2.5 py-1 bg-white/10 text-gray-300 rounded-lg text-xs font-medium border border-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/20"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Compact action button */}
        <div className="mt-auto">
          <button 
            onClick={handleBookingClick}
            className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-rebuild-yellow to-amber-400 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rebuild-yellow/25 hover:shadow-rebuild-yellow/40 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center">
              <Calendar size={14} className="sm:size-4 mr-2" />
              <span className="text-xs sm:text-sm">BOOK NOW</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-rebuild-yellow/15 via-purple-500/15 to-rebuild-yellow/15 blur-xl" />
      </div>
    </div>
  );
};

export default TrainerCard;
