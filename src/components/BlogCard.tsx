import React from 'react';
import { Calendar, User, BookOpen, ArrowRight, Clock } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';
import { motion } from 'framer-motion';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  onClick: () => void;
}

const BlogCard = ({ 
  title, 
  excerpt, 
  image, 
  author, 
  date, 
  category, 
  onClick 
}: BlogCardProps) => {
  // Format the date for better display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Estimate reading time based on excerpt length
  const readingTime = Math.max(Math.ceil(excerpt.length / 200), 1);
  
  return (
    <motion.article 
      className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/10 hover:border-white/20 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 cursor-pointer h-full flex flex-col"
      onClick={onClick}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <ResponsiveImage 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {/* Minimal overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-rebuild-yellow px-3 py-1 rounded-lg text-xs font-medium">
          {category}
        </div>
        
        {/* Reading Time Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs flex items-center">
          <Clock size={12} className="mr-1" />
          {readingTime} min
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta Info */}
        <div className="flex items-center text-xs text-gray-400 mb-4 gap-4">
          <div className="flex items-center">
            <User size={12} className="text-rebuild-yellow mr-1" />
            <span>{author}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={12} className="text-rebuild-yellow mr-1" />
            <span>{formatDate(date)}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold mb-3 text-white group-hover:text-rebuild-yellow transition-colors duration-300 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3 text-sm flex-grow">
          {excerpt}
        </p>
        
        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-rebuild-yellow to-amber-400 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-rebuild-yellow/25 hover:shadow-rebuild-yellow/40"
        >
          <BookOpen size={16} className="mr-2" />
          <span>Read Article</span>
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </motion.article>
  );
};

export default BlogCard;
