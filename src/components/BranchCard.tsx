
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BranchCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  features: string[];
}

const BranchCard = ({ title, description, image, link, features }: BranchCardProps) => {
  return (
    <div className="bg-rebuild-darkgray rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
      <div className="h-64 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black to-transparent opacity-70" />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        
        <ul className="space-y-2 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
              <span className="text-sm text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link 
          to={link} 
          className="inline-flex items-center text-rebuild-yellow hover:underline"
        >
          Learn More <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default BranchCard;
