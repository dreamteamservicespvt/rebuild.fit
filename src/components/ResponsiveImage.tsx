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
  preserveAspectRatio?: boolean; // New prop for transformation images
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
  preserveAspectRatio = false, // Default to false for backward compatibility
}) => {
  // Check if the image is from Cloudinary
  const isCloudinaryImage = src.includes('cloudinary.com') || src.includes('res.cloudinary.com');

  // Helper function to create transformation-friendly URLs
  const getTransformationUrls = (url: string) => {
    // Extract public ID from URL
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    let publicIdParts = urlParts.slice(uploadIndex + 1);
    
    // Remove version if present
    if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
      publicIdParts = publicIdParts.slice(1);
    }
    
    const publicId = publicIdParts.join('/').replace(/\.[^/.]+$/, ''); // Remove extension
    const baseUrl = 'https://res.cloudinary.com/dvmrhs2ek/image/upload';
    
    return {
      webp_small: `${baseUrl}/w_400,c_fit,q_auto,f_webp/${publicId}`,
      webp_medium: `${baseUrl}/w_800,c_fit,q_auto,f_webp/${publicId}`,
      small: `${baseUrl}/w_400,c_fit,q_auto/${publicId}`,
      medium: `${baseUrl}/w_800,c_fit,q_auto/${publicId}`,
    };
  };

  if (isCloudinaryImage) {
    if (preserveAspectRatio) {
      // For transformation images, use c_fit to preserve aspect ratio
      const transformationUrls = getTransformationUrls(src);
      
      if (transformationUrls) {
        return (
          <picture>
            {/* WebP sources for modern browsers */}
            <source 
              media="(max-width: 640px)" 
              srcSet={transformationUrls.webp_small} 
              type="image/webp" 
            />
            <source 
              media="(max-width: 1024px)" 
              srcSet={transformationUrls.webp_medium} 
              type="image/webp" 
            />
            
            {/* Fallback sources */}
            <source 
              media="(max-width: 640px)" 
              srcSet={transformationUrls.small} 
            />
            <source 
              media="(max-width: 1024px)" 
              srcSet={transformationUrls.medium} 
            />
            
            {/* Default image */}
            <img
              src={transformationUrls.medium}
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
    }
    
    // Standard responsive URLs for regular images
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
