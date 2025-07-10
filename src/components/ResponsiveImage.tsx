import React from 'react';
import { getResponsiveImageUrls } from '@/lib/cloudinaryService';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  quality = 80,
  width,
  height,
  onLoad,
  onError,
}) => {
  // Check if the image is from Cloudinary
  const isCloudinaryImage = src.includes('cloudinary.com') || src.includes('res.cloudinary.com');

  if (isCloudinaryImage) {
    const responsiveUrls = getResponsiveImageUrls(src);
    
    return (
      <picture>
        {/* WebP sources for modern browsers */}
        <source 
          media="(max-width: 640px)" 
          srcSet={responsiveUrls.webp_small} 
          type="image/webp" 
        />
        <source 
          media="(max-width: 1024px)" 
          srcSet={responsiveUrls.webp_medium} 
          type="image/webp" 
        />
        
        {/* Fallback sources */}
        <source 
          media="(max-width: 640px)" 
          srcSet={responsiveUrls.small} 
        />
        <source 
          media="(max-width: 1024px)" 
          srcSet={responsiveUrls.medium} 
        />
        
        {/* Default image */}
        <img
          src={responsiveUrls.medium}
          alt={alt}
          className={className}
          loading={priority ? 'eager' : 'lazy'}
          width={width}
          height={height}
          onLoad={onLoad}
          onError={onError}
        />
      </picture>
    );
  }

  // For non-Cloudinary images, use standard img tag
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      width={width}
      height={height}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default ResponsiveImage;
