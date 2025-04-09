
import React from 'react';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn(
      "bg-rebuild-darkgray rounded-lg overflow-hidden hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300",
      className
    )}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black to-transparent opacity-50" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-rebuild-yellow text-sm mb-3">{role}</p>
        
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-400">Experience</p>
            <p className="text-sm">{experience}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Specialization</p>
            <p className="text-sm">{specialization}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
