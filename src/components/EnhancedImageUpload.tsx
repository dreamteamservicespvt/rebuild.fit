import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon, RefreshCw, Eye, Edit2, Link, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  variant?: 'standard' | 'minimal' | 'avatar' | 'card' | 'compact' | 'ultra';
  disabled?: boolean;
}

const EnhancedImageUpload: React.FC<ImageUploadProps> = ({ 
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
  // Ensure TypeScript knows all possible variants
  const isCompact = variant === 'compact';
  const isUltra = variant === 'ultra';
  const isMinimal = variant === 'minimal';
  const isAvatar = variant === 'avatar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [urlValidating, setUrlValidating] = useState(false);
  const { user, isAdmin } = useAuth();

  // Size classes based on previewSize prop
  const previewSizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    full: 'w-full h-auto'
  };

  // Compact variant size override - ultra-compact for form integration
  const compactSizeClasses = {
    sm: 'w-14 h-14', // Ultra-small for tight spaces
    md: 'w-16 h-16', // Small but usable - reduced from w-20
    lg: 'w-20 h-20', // Medium compact size - reduced from w-24
    full: 'w-full h-auto max-h-16' // Reduced max height
  };

  // Ultra-compact size classes for very tight spaces
  const ultraSizeClasses = {
    sm: 'w-12 h-12', // Tiny for extreme tight spaces
    md: 'w-14 h-14', // Ultra-small but usable
    lg: 'w-16 h-16', // Small compact size
    full: 'w-full h-auto max-h-12' // Very low max height
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    free: ''
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await handleUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0];
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
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
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);

      // Upload image
      const uploadedUrl = await uploadImageWithFallback(file, uploadPath);
      
      // Clear interval and complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadedUrl) {
        setPreview(uploadedUrl);
        onImageUploaded(uploadedUrl);
        toast.success('Success', 'Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Extract specific error message if available
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isPresetError = errorMessage.toLowerCase().includes('preset');
      
      toast.error(
        isPresetError ? 'Cloudinary Configuration Error' : 'Upload failed',
        isPresetError 
          ? 'There is an issue with the Cloudinary upload preset. Please contact the administrator.'
          : 'There was a problem uploading your image. Please try again.'
      );
      
      // Display detailed error in console for troubleshooting
      if (isPresetError) {
        console.error('CLOUDINARY PRESET ERROR:', errorMessage);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlChange = async (url: string) => {
    setImageUrl(url);
    
    if (!url.trim()) {
      setPreview(null);
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return; // Invalid URL format, don't proceed
    }

    setUrlValidating(true);
    
    try {
      // Create a temporary image to validate the URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          setPreview(url);
          onImageUploaded(url);
          toast.success('Success', 'Image URL validated and loaded successfully');
          resolve(img);
        };
        
        img.onerror = () => {
          toast.error('Invalid image URL', 'The URL does not point to a valid image');
          reject(new Error('Invalid image URL'));
        };
        
        img.src = url;
      });
    } catch (error) {
      console.error('URL validation error:', error);
      setPreview(null);
    } finally {
      setUrlValidating(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImageUrl('');
    onImageUploaded(''); // Pass empty string to indicate removal
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const variantStyles = {
    standard: {
      container: "border-2 border-dashed rounded-lg overflow-hidden",
      dragState: {
        idle: "border-gray-700 hover:border-rebuild-yellow/70 bg-rebuild-black/30",
        dragging: "border-rebuild-yellow bg-rebuild-yellow/10"
      }
    },
    minimal: {
      container: "border border-solid rounded-md overflow-hidden",
      dragState: {
        idle: "border-gray-700 hover:border-rebuild-yellow/70",
        dragging: "border-rebuild-yellow"
      }
    },
    avatar: {
      container: "rounded-full overflow-hidden border-2 border-solid shadow-md",
      dragState: {
        idle: "border-gray-700 hover:border-rebuild-yellow/70",
        dragging: "border-rebuild-yellow"
      }
    },
    card: {
      container: "rounded-lg overflow-hidden border border-solid shadow-sm",
      dragState: {
        idle: "border-gray-700/50 hover:border-rebuild-yellow/70",
        dragging: "border-rebuild-yellow"
      }
    },
    compact: {
      container: "rounded-lg overflow-hidden border border-solid shadow-lg bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm",
      dragState: {
        idle: "border-gray-600/40 hover:border-rebuild-yellow/60 hover:shadow-lg hover:shadow-rebuild-yellow/10",
        dragging: "border-rebuild-yellow bg-rebuild-yellow/5 shadow-lg shadow-rebuild-yellow/20"
      }
    },
    ultra: {
      container: "rounded-md overflow-hidden border border-solid shadow-md bg-gradient-to-br from-gray-800/20 to-gray-900/40",
      dragState: {
        idle: "border-gray-600/30 hover:border-rebuild-yellow/50 hover:shadow-md hover:shadow-rebuild-yellow/5",
        dragging: "border-rebuild-yellow bg-rebuild-yellow/3 shadow-md shadow-rebuild-yellow/15"
      }
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {/* Label if provided */}
      {label && !isAvatar && (
        <label className="block text-sm font-medium mb-2 text-gray-200">{label}</label>
      )}
      
      {/* Compact variant toggle for upload method */}
      {(isCompact || isUltra || isAvatar) && (
        <div className="mb-2 flex gap-1">
          <Button
            type="button"
            variant={uploadMethod === 'file' ? 'default' : 'ghost'}
            size={isUltra ? 'sm' : 'sm'}
            onClick={() => setUploadMethod('file')}
            disabled={disabled}
            className={cn(
              "flex-1 text-xs h-6",
              uploadMethod === 'file' 
                ? "bg-rebuild-yellow/20 text-rebuild-yellow border-rebuild-yellow/30" 
                : "text-gray-400 hover:text-gray-200"
            )}
          >
            <FileImage size={isUltra ? 8 : 10} className="mr-1" />
            File
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'url' ? 'default' : 'ghost'}
            size={isUltra ? 'sm' : 'sm'}
            onClick={() => setUploadMethod('url')}
            disabled={disabled}
            className={cn(
              "flex-1 text-xs h-6",
              uploadMethod === 'url' 
                ? "bg-rebuild-yellow/20 text-rebuild-yellow border-rebuild-yellow/30" 
                : "text-gray-400 hover:text-gray-200"
            )}
          >
            <Link size={isUltra ? 8 : 10} className="mr-1" />
            URL
          </Button>
        </div>
      )}
      
      {/* Premium tab system for upload method selection - only for non-compact variants */}
      {!isCompact && !isUltra && !isAvatar && (
        <Tabs 
          value={uploadMethod} 
          onValueChange={(value: string) => setUploadMethod(value as 'file' | 'url')}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger 
              value="file" 
              className="flex items-center gap-2 data-[state=active]:bg-rebuild-yellow/20 data-[state=active]:text-rebuild-yellow"
            >
              <FileImage size={16} />
              Upload File
            </TabsTrigger>
            <TabsTrigger 
              value="url" 
              className="flex items-center gap-2 data-[state=active]:bg-rebuild-yellow/20 data-[state=active]:text-rebuild-yellow"
            >
              <Link size={16} />
              Image URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type="url"
                  placeholder="Enter image URL (https://...)"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  disabled={disabled}
                  className="bg-gray-800/30 border-gray-700/50 text-gray-200 placeholder:text-gray-500 focus:border-rebuild-yellow/50 focus:ring-rebuild-yellow/20"
                />
                {urlValidating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-rebuild-yellow" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Paste a direct link to an image file (JPG, PNG, WebP, GIF)
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Main upload container - only show for file upload or compact variants */}
      {(uploadMethod === 'file' || isCompact || isUltra || isAvatar) && (
        <div
          className={cn(
            'transition-all duration-200',
            aspectRatioClasses[aspectRatio],
            variantStyles[variant].container,
            isDragging 
              ? variantStyles[variant].dragState.dragging 
              : variantStyles[variant].dragState.idle,
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer",
            isAvatar && previewSizeClasses[previewSize],
            isCompact && compactSizeClasses[previewSize],
            isUltra && ultraSizeClasses[previewSize]
          )}
          onDragOver={(e) => {
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={disabled ? undefined : handleDrop}
          onClick={disabled ? undefined : () => fileInputRef.current?.click()}
        >
          <div className={cn(
            "flex flex-col items-center justify-center h-full relative",
            isUltra ? 'p-0.5' : isCompact ? 'p-1' : isMinimal ? 'p-2' : 'p-3'
          )}>
            {/* Upload progress overlay */}
            <AnimatePresence>
              {(uploading || urlValidating) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-rebuild-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                >
                  <Loader2 className="animate-spin text-rebuild-yellow mb-1" size={isUltra ? 12 : isCompact ? 16 : 28} />
                  {uploading && (
                    <div className="w-full max-w-[85%]">
                      <Progress 
                        value={uploadProgress} 
                        className={cn("mb-1", isUltra ? "h-0.5" : isCompact ? "h-1" : "h-1.5")}
                      />
                      <p className={cn(
                        "text-center text-gray-300 font-medium",
                        isUltra ? "text-[8px]" : isCompact ? "text-[10px]" : "text-sm"
                      )}>
                        {uploadProgress}%
                      </p>
                    </div>
                  )}
                  {urlValidating && (
                    <p className={cn(
                      "text-center text-gray-300 font-medium mt-1",
                      isUltra ? "text-[8px]" : isCompact ? "text-[10px]" : "text-sm"
                    )}>
                      Validating URL...
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image preview or placeholder */}
            {preview ? (
              <div className="relative w-full h-full">
                <ResponsiveImage 
                  src={preview} 
                  alt="Image preview" 
                  className={cn(
                    "w-full h-full object-cover",
                    isAvatar && "object-center"
                  )}
                />
                <div className={cn(
                  "absolute inset-0 bg-black bg-opacity-0 transition-all duration-300",
                  !disabled && "group-hover:bg-opacity-70",
                  "flex items-center justify-center"
                )}>
                  {!disabled && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(!isMinimal && !isCompact && !isUltra) && (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-rebuild-yellow hover:bg-yellow-600 text-rebuild-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalOpen(true);
                          }}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                      )}
                      
                      <Button 
                        variant={(isMinimal || isCompact || isUltra) ? "ghost" : "default"} 
                        size={isUltra ? "sm" : isCompact ? "sm" : "sm"}
                        className={cn(
                          (isMinimal || isCompact || isUltra)
                            ? "text-white hover:bg-white/20" 
                            : "bg-white/20 hover:bg-white/40 backdrop-blur-sm",
                          (isCompact || isUltra) && "text-xs px-1 py-0.5 h-5 min-w-0",
                          isUltra && "text-[10px] px-0.5 py-0 h-4"
                        )}
                      >
                        <Edit2 
                          size={isUltra ? 8 : isCompact ? 10 : 14} 
                          className={(isMinimal || isCompact || isUltra) ? "" : "mr-1"} 
                        />
                        {(!isMinimal && !isCompact && !isUltra) && "Change"}
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Remove button */}
                {!uploading && !urlValidating && !disabled && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className={cn(
                      "absolute bg-rebuild-black/80 hover:bg-red-500 backdrop-blur-sm transition-colors",
                      isAvatar ? "rounded-full -top-1 -right-1 p-1.5" : 
                      isUltra ? "top-0 right-0 rounded-sm p-0.5" :
                      isCompact ? "top-0.5 right-0.5 rounded-sm p-0.5" :
                      "top-2 right-2 rounded-md p-1.5"
                    )}
                  >
                    <X size={isUltra ? 8 : isCompact ? 10 : 14} className="text-white" />
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className={cn(
                  "mx-auto flex items-center justify-center",
                  isAvatar 
                    ? "bg-gray-800 rounded-full p-3" 
                    : isUltra
                      ? "bg-gray-800/20 rounded-sm p-0.5"
                    : isCompact
                      ? "bg-gray-800/30 rounded-sm p-1"
                      : "bg-gray-800/50 rounded-lg p-3 mb-2"
                )}>
                  <Upload 
                    className="text-gray-400" 
                    size={
                      isAvatar ? 18 : 
                      isUltra ? 8 :
                      isCompact ? 10 : 
                      isMinimal ? 16 : 22
                    } 
                  />
                </div>
                
                {!isMinimal && !isAvatar && !isCompact && !isUltra && (
                  <>
                    <p className="text-sm text-center text-gray-400">{placeholder}</p>
                    <p className="text-xs text-center text-gray-500 mt-1">Max size: {maxSizeMB}MB</p>
                  </>
                )}
                
                {isMinimal && (
                  <p className="text-xs text-gray-400">Upload image</p>
                )}
                
                {isAvatar && (
                  <p className="text-xs text-gray-400 mt-1">Upload photo</p>
                )}

                {isCompact && (
                  <p className="text-[8px] text-gray-500 leading-none mt-0.5">Upload</p>
                )}

                {isUltra && (
                  <p className="text-[6px] text-gray-500 leading-none mt-0.5">+</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* URL input container - only for compact variants when URL method is selected */}
      {(isCompact || isUltra || isAvatar) && uploadMethod === 'url' && (
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="url"
              placeholder={isUltra ? "Image URL" : "Enter image URL"}
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={disabled}
              className={cn(
                "bg-gray-800/30 border-gray-700/50 text-gray-200 placeholder:text-gray-500 focus:border-rebuild-yellow/50 focus:ring-rebuild-yellow/20",
                isUltra && "text-xs h-6",
                isCompact && "text-sm h-7"
              )}
            />
            {urlValidating && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 size={isUltra ? 10 : 14} className="animate-spin text-rebuild-yellow" />
              </div>
            )}
          </div>
          {!isUltra && (
            <p className="text-xs text-gray-500">
              Paste a direct image URL
            </p>
          )}
        </div>
      )}

      {/* URL preview display for larger variants */}
      {uploadMethod === 'url' && !isCompact && !isUltra && !isAvatar && preview && (
        <div className="mt-4">
          <div className="relative">
            <ResponsiveImage 
              src={preview} 
              alt="URL preview" 
              className={cn(
                "w-full object-cover rounded-lg border border-gray-700/50",
                aspectRatioClasses[aspectRatio],
                previewSize === 'sm' && "max-h-32",
                previewSize === 'md' && "max-h-48",
                previewSize === 'lg' && "max-h-64"
              )}
            />
            {!disabled && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-rebuild-black/80 hover:bg-red-500 backdrop-blur-sm transition-colors rounded-md p-1.5"
              >
                <X size={14} className="text-white" />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* File input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
        className="hidden"
        disabled={disabled}
      />
      
      {/* Preview modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-3xl bg-rebuild-darkgray border-gray-700">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="relative w-full max-h-[70vh] overflow-hidden rounded-md">
            {preview && (
              <ResponsiveImage 
                src={preview} 
                alt="Full size preview" 
                className="w-full h-auto object-contain"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPreviewModalOpen(false)}
            >
              Close
            </Button>
            {uploadMethod === 'file' ? (
              <Button 
                variant="default" 
                size="sm" 
                className="bg-rebuild-yellow hover:bg-yellow-600 text-rebuild-black"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw size={14} className="mr-2" />
                Replace
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="bg-rebuild-yellow hover:bg-yellow-600 text-rebuild-black"
                onClick={() => setPreviewModalOpen(false)}
              >
                <Link size={14} className="mr-2" />
                Update URL
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedImageUpload;
