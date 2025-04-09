
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Users, Award, Dumbbell } from 'lucide-react';

interface TrainerCardProps {
  name: string;
  role: string;
  image: string;
  experience: string;
  specialization: string;
  className?: string;
}

const TrainerCard = ({ 
  name, 
  role, 
  image, 
  experience, 
  specialization,
  className 
}: TrainerCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "bg-rebuild-darkgray rounded-lg overflow-hidden hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300 transform hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-105" : ""
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black to-transparent opacity-50" />
        
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-rebuild-black/70 transition-opacity duration-300 animate-fade-in">
            <div className="text-center p-4">
              <p className="text-rebuild-yellow font-bold mb-2">Book a session</p>
              <p className="text-sm text-gray-300">Click to schedule training with {name}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 group-hover:text-rebuild-yellow transition-colors">{name}</h3>
        <p className="text-rebuild-yellow text-sm mb-3">{role}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Experience</p>
              <p className="text-sm">{experience}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Specialization</p>
              <p className="text-sm">{specialization}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
