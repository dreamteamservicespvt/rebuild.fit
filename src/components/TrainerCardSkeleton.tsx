import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrainerCardSkeletonProps {
  className?: string;
}

const TrainerCardSkeleton: React.FC<TrainerCardSkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "group relative bg-gradient-to-br from-white/8 via-white/4 to-black/20 backdrop-blur-xl rounded-3xl overflow-hidden",
        "shadow-2xl shadow-black/40",
        "border border-white/10",
        "animate-pulse",
        className
      )}
    >
      {/* Image Section Skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
        <div className="w-full h-full bg-gradient-to-t from-gray-800 via-gray-700 to-gray-800" />
        
        {/* Role badge skeleton */}
        <div className="absolute top-4 right-4 bg-gray-700 px-3 py-1.5 rounded-xl">
          <div className="w-16 h-3 bg-gray-600 rounded" />
        </div>
      </div>
      
      {/* Content Section Skeleton */}
      <div className="p-5 relative z-10">
        {/* Header section skeleton */}
        <div className="mb-4">
          <div className="h-6 bg-gray-700 rounded mb-2 w-3/4" />
          
          {/* Specialization skeleton */}
          <div className="space-y-1.5">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-700 mr-2.5" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        </div>
        
        {/* Experience Section Skeleton */}
        <div className="border-t border-white/10 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-700 rounded w-1/4" />
          </div>
        </div>
        
        {/* Action Button Skeleton */}
        <div className="h-10 bg-gray-700 rounded-lg w-full" />
      </div>
    </div>
  );
};

interface TrainerGridSkeletonProps {
  count?: number;
  className?: string;
}

export const TrainerGridSkeleton: React.FC<TrainerGridSkeletonProps> = ({ 
  count = 8, 
  className 
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4",
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TrainerCardSkeleton className="h-full w-full max-w-sm mx-auto" />
        </motion.div>
      ))}
    </div>
  );
};

export default TrainerCardSkeleton;
