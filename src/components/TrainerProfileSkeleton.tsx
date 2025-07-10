import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrainerProfileSkeletonProps {
  className?: string;
}

const TrainerProfileSkeleton: React.FC<TrainerProfileSkeletonProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {/* Hero Section Skeleton */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-800" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="h-4 bg-gray-600 rounded w-24" />
            <div className="h-16 bg-gray-700 rounded w-3/4" />
            <div className="h-6 bg-gray-600 rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-600 rounded w-full" />
              <div className="h-4 bg-gray-600 rounded w-5/6" />
              <div className="h-4 bg-gray-600 rounded w-4/5" />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-600 rounded" />
                </div>
              ))}
            </div>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              <div className="h-12 bg-gray-700 rounded-lg w-36" />
              <div className="h-12 bg-gray-600 rounded-lg w-32" />
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gray-700 rounded-3xl" />
          </div>
        </div>
      </section>
      
      {/* Sticky Navigation Skeleton */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-gray-700 rounded-full" />
              <div className="h-6 bg-gray-700 rounded w-32" />
            </div>
            <div className="flex space-x-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-600 rounded w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bio Section Skeleton */}
      <section className="py-16 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-600 rounded" />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Media Gallery Skeleton */}
      <section className="py-16 bg-rebuild-black">
        <div className="container-custom">
          <div className="h-8 bg-gray-700 rounded w-56 mx-auto mb-8" />
          
          {/* Tabs Skeleton */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-700 rounded-md w-24" />
              ))}
            </div>
          </div>
          
          {/* Gallery Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Specializations & Certifications Skeleton */}
      <section className="py-16 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <div className="h-8 bg-gray-700 rounded w-48 mb-6" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-600 rounded flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section Skeleton */}
      <section className="py-16 bg-rebuild-black">
        <div className="container-custom text-center">
          <div className="h-10 bg-gray-700 rounded w-64 mx-auto mb-6" />
          <div className="h-4 bg-gray-600 rounded w-96 mx-auto mb-8" />
          <div className="h-12 bg-gray-700 rounded-lg w-48 mx-auto" />
        </div>
      </section>
    </div>
  );
};

export default TrainerProfileSkeleton;
