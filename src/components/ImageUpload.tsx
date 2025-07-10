import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon, RefreshCw, Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImageWithFallback } from '@/lib/uploadService';
import { toast } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import ResponsiveImage from '@/components/ResponsiveImage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  className?: string;
  uploadPath: string; // e.g., 'gyms/', 'trainers/', etc.
  maxSizeMB?: number;
  allowedTypes?: string[];
  previewSize?: 'sm' | 'md' | 'lg' | 'full';
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'free';
  placeholder?: string;
  label?: string;
  variant?: 'standard' | 'minimal' | 'avatar' | 'card';
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImage, 
  className = "",
  uploadPath,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  previewSize = 'md',
  aspectRatio = 'square',
  placeholder = 'Drag and drop an image here, or click to select',
  label = 'Upload Image',
  variant = 'standard',
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  // Size classes based on previewSize prop
  const previewSizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-60 h-60',
    full: 'w-full h-auto'
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    free: ''
  };

  const handleFileUpload = async (file: File) => {
    // Check authentication
    if (!user || !isAdmin) {
      toast.error('Authentication required', 'You must be logged in as admin to upload images');
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type', `Please select from: ${allowedTypes.map(t => t.replace('image/', '')).join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error('File too large', `Please select an image smaller than ${maxSizeMB}MB`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10); // Initial progress indicator
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setUploadProgress(30); // Update progress
      
      // Simulate progress while uploading (for UX)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Upload to Cloudinary (primary service)
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const fullPath = `${uploadPath}${fileName}`;
      const downloadURL = await uploadImageWithFallback(file, fullPath);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onImageUploaded(downloadURL);
      
      toast.success('Image uploaded successfully', 'Your image has been uploaded and is ready to use');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Upload failed', error instanceof Error ? error.message : 'Failed to upload image. Please check your internet connection and try again.');
      setPreview(null);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const clearImage = () => {
    setPreview(null);
    onImageUploaded(''); // Clear the image URL in parent component
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
          isDragging ? "border-rebuild-yellow bg-rebuild-yellow bg-opacity-10" : "border-gray-600 hover:border-rebuild-yellow",
          uploading ? "opacity-70 pointer-events-none" : ""
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4">
          {!preview ? (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">{placeholder}</p>
              <p className="text-xs text-gray-500 mt-1">Max size: {maxSizeMB}MB</p>
            </>
          ) : (
            <div className={cn(
              'relative overflow-hidden rounded-md',
              previewSizeClasses[previewSize],
              aspectRatioClasses[aspectRatio]
            )}>
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : (
                <ResponsiveImage
                  src={preview}
                  alt="Image preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          disabled={uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon size={14} />
          )}
          <span>
            {preview ? 'Replace Image' : 'Select Image'}
          </span>
        </Button>
        
        {preview && !uploading && (
          <Button
            type="button"
            onClick={clearImage}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <X size={14} />
            <span>Remove</span>
          </Button>
        )}
      </div>

      {uploading && (
        <Progress value={uploadProgress} className="h-1.5" />
      )}
    </div>
  );
};

export default ImageUpload;
