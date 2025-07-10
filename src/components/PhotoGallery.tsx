import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Upload, GripVertical, FolderOpen, FileImage, CheckCircle, AlertCircle, Loader2, Camera } from 'lucide-react';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import ResponsiveImage from '@/components/ResponsiveImage';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { uploadImageWithFallback, uploadMultipleImages } from '@/lib/uploadService';
import { useAuth } from '@/contexts/AuthContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PhotoGalleryProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  uploadPath: string;
  maxPhotos?: number;
  className?: string;
  onImmediateSave?: (photos: string[]) => Promise<void>;
}

interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
  preview?: string;
}

interface SortablePhotoProps {
  id: string;
  photo: string;
  index: number;
  onDelete: (index: number) => void;
  isDeleting?: boolean;
}

const SortablePhoto = ({ id, photo, index, onDelete, isDeleting }: SortablePhotoProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 transition-all duration-300 ease-out",
        "hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/50 hover:-translate-y-1",
        isDragging && "opacity-50 scale-95 z-50 shadow-2xl border-white/30 rotate-3"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 xs:top-2 left-1 xs:left-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-move bg-black/70 backdrop-blur-sm p-1 xs:p-1.5 rounded-md xs:rounded-lg hover:bg-black/80"
      >
        <GripVertical size={12} className="xs:w-4 xs:h-4 text-white" />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(index)}
        disabled={isDeleting}
        className={cn(
          "absolute top-1 xs:top-2 right-1 xs:right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 w-6 xs:w-7 h-6 xs:h-7 rounded-md xs:rounded-lg flex items-center justify-center text-white backdrop-blur-sm",
          isDeleting 
            ? "bg-red-400/80 opacity-100 cursor-not-allowed" 
            : "bg-red-500/80 hover:bg-red-600/90 hover:scale-110"
        )}
      >
        {isDeleting ? (
          <Loader2 size={12} className="xs:w-3.5 xs:h-3.5 animate-spin" />
        ) : (
          <X size={12} className="xs:w-3.5 xs:h-3.5" />
        )}
      </button>

      {/* Photo */}
      <ResponsiveImage
        src={photo}
        alt={`Gallery photo ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Photo index indicator */}
      <div className="absolute bottom-1 xs:bottom-2 left-1 xs:left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {index + 1}
      </div>
    </div>
  );
};

const PhotoGallery = ({ 
  photos, 
  onPhotosChange, 
  uploadPath, 
  maxPhotos = 20,
  className,
  onImmediateSave 
}: PhotoGalleryProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState<number | null>(null);
  const [processingBulkUpload, setProcessingBulkUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAdmin } = useAuth();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Bulk Upload Functions
  const generateUploadId = () => Math.random().toString(36).substring(2, 15);

  const validateFiles = (files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeMB = 10;
    const validFiles: File[] = [];
    
    fileArray.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type', `${file.name}: Please select JPG, PNG, WebP, or GIF files`);
        return;
      }
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error('File too large', `${file.name}: Please select files smaller than ${maxSizeMB}MB`);
        return;
      }
      
      if (photos.length + validFiles.length >= maxPhotos) {
        toast.warning('Gallery limit reached', `Maximum ${maxPhotos} photos allowed`);
        return;
      }
      
      validFiles.push(file);
    });
    
    return validFiles;
  };

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleBulkUpload = async (files: File[]) => {
    if (!user || !isAdmin) {
      toast.error('Authentication required', 'You must be logged in as admin to upload images');
      return;
    }

    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    // Create upload progress entries for UI
    const newUploads: UploadProgress[] = await Promise.all(
      validFiles.map(async (file) => ({
        id: generateUploadId(),
        file,
        progress: 0,
        status: 'pending' as const,
        preview: await createFilePreview(file)
      }))
    );

    setUploads(prev => [...prev, ...newUploads]);
    setIsBulkMode(true);
    setProcessingBulkUpload(true);
    
    // Update status to uploading for all files
    setUploads(prev => prev.map(u => 
      newUploads.some(nu => nu.id === u.id) ? { ...u, status: 'uploading', progress: 10 } : u
    ));

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploads(prev => prev.map(u => {
          if (newUploads.some(nu => nu.id === u.id) && u.progress < 80) {
            return { ...u, progress: u.progress + Math.random() * 10 };
          }
          return u;
        }));
      }, 300);

      // Upload all files at once and get array of URLs
      const uploadedUrls = await uploadMultipleImages(validFiles, uploadPath);
      
      clearInterval(progressInterval);
      
      // Update UI for all uploads
      setUploads(prev => prev.map((u, idx) => {
        const uploadIndex = newUploads.findIndex(nu => nu.id === u.id);
        if (uploadIndex !== -1 && uploadIndex < uploadedUrls.length) {
          return { ...u, status: 'success', progress: 100, url: uploadedUrls[uploadIndex] };
        }
        return u;
      }));

      // Add all URLs to photos array at once (prevents race conditions)
      const newPhotos = [...photos, ...uploadedUrls];
      onPhotosChange(newPhotos);
      
      // Save immediately if onImmediateSave is provided
      if (onImmediateSave) {
        try {
          await onImmediateSave(newPhotos);
          toast.success('Bulk upload complete', `Successfully added ${uploadedUrls.length} photos to gallery`);
        } catch (saveError) {
          console.error('Failed to save uploaded photos:', saveError);
          // Revert to original photos if save failed
          onPhotosChange(photos);
          toast.warning('Upload failed to save', 'Photos uploaded but failed to save. Please try again.');
          return;
        }
      }
      
      // Auto-remove successful uploads after a delay
      setTimeout(() => {
        setUploads(prev => prev.filter(u => !newUploads.some(nu => nu.id === u.id)));
      }, 2000);
      
    } catch (error) {
      console.error('Bulk upload failed:', error);
      setUploads(prev => prev.map(u => 
        newUploads.some(nu => nu.id === u.id) 
          ? { 
              ...u, 
              status: 'error', 
              progress: 0,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : u
      ));
      toast.error('Upload failed', 'Failed to upload one or more images. Please try again.');
    } finally {
      setProcessingBulkUpload(false);
    }
  };

  // Individual upload processing - this is now only used for single uploads
  const processUpload = async (upload: UploadProgress) => {
    if (processingBulkUpload) return; // Skip if already processing in bulk
    
    try {
      // Update status to uploading
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, status: 'uploading', progress: 10 } : u
      ));

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploads(prev => prev.map(u => {
          if (u.id === upload.id && u.progress < 80) {
            return { ...u, progress: u.progress + Math.random() * 15 };
          }
          return u;
        }));
      }, 300);

      // Upload the file
      const uploadedUrl = await uploadImageWithFallback(upload.file, uploadPath);
      
      clearInterval(progressInterval);
      
      // Update with success
      setUploads(prev => prev.map(u => 
        u.id === upload.id 
          ? { ...u, status: 'success', progress: 100, url: uploadedUrl }
          : u
      ));

      // Create the new photos array directly
      const newPhotos = [...photos, uploadedUrl];
      
      // Update the photos array
      onPhotosChange(newPhotos);
      
      // Save immediately if onImmediateSave is provided
      if (onImmediateSave) {
        onImmediateSave(newPhotos).catch(saveError => {
          console.error('Failed to save uploaded photo:', saveError);
          toast.warning('Upload failed to save', 'Photo uploaded but failed to save. Please try again.');
          // Mark upload as error
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'error', error: 'Failed to save to database' }
              : u
          ));
        });
      }
      
      // Auto-remove successful upload after a delay
      setTimeout(() => {
        setUploads(prev => prev.filter(u => u.id !== upload.id));
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploads(prev => prev.map(u => 
        u.id === upload.id 
          ? { 
              ...u, 
              status: 'error', 
              progress: 0,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : u
      ));
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleBulkUpload(Array.from(files));
    }
    e.target.value = ''; // Reset input
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleBulkUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  };

  const retryUpload = (upload: UploadProgress) => {
    setUploads(prev => prev.map(u => 
      u.id === upload.id 
        ? { ...u, status: 'pending', progress: 0, error: undefined }
        : u
    ));
    processUpload(upload);
  };

  const clearCompletedUploads = () => {
    setUploads(prev => prev.filter(u => u.status === 'uploading' || u.status === 'pending'));
    // Check if all uploads are complete
    const remainingUploads = uploads.filter(u => u.status === 'uploading' || u.status === 'pending');
    if (remainingUploads.length === 0) {
      setIsBulkMode(false);
    }
  };

  // Auto-close bulk mode when all uploads complete
  React.useEffect(() => {
    if (uploads.length > 0) {
      const hasActiveUploads = uploads.some(u => u.status === 'uploading' || u.status === 'pending');
      if (!hasActiveUploads) {
        // Add a small delay before closing bulk mode
        const timer = setTimeout(() => {
          setIsBulkMode(false);
          setUploads([]);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [uploads]);

  const getUploadStats = () => {
    const total = uploads.length;
    const success = uploads.filter(u => u.status === 'success').length;
    const error = uploads.filter(u => u.status === 'error').length;
    const uploading = uploads.filter(u => u.status === 'uploading' || u.status === 'pending').length;
    
    return { total, success, error, uploading };
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((_, index) => `photo-${index}` === active.id);
      const newIndex = photos.findIndex((_, index) => `photo-${index}` === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newPhotos = arrayMove(photos, oldIndex, newIndex);
        onPhotosChange(newPhotos);
        
        // Save reorder immediately if onImmediateSave is provided
        if (onImmediateSave) {
          try {
            await onImmediateSave(newPhotos);
            toast.success('Photos reordered', 'The photo order has been updated');
          } catch (error) {
            console.error('Reorder save failed:', error);
            // Revert the local state if save failed
            onPhotosChange(photos);
            toast.error('Reorder failed', 'Failed to save photo order. Please try again.');
          }
        }
      }
    }
  };

  const handlePhotoAdded = (photoUrl: string) => {
    if (photos.length < maxPhotos) {
      onPhotosChange([...photos, photoUrl]);
    }
    setIsAdding(false);
  };

  const handleDeletePhoto = async (index: number) => {
    if (!user || !isAdmin) {
      toast.error('Authentication required', 'You must be logged in as admin to delete images');
      return;
    }

    // Show loading state for the specific photo being deleted
    setIsDeletingPhoto(index);
    
    try {
      const photoToDelete = photos[index];
      const newPhotos = photos.filter((_, i) => i !== index);
      
      // Save to database first to ensure persistence
      if (onImmediateSave) {
        await onImmediateSave(newPhotos);
      }
      
      // Update local state after successful save
      onPhotosChange(newPhotos);
      
      toast.success('Photo deleted', 'The photo has been removed successfully');
      
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Delete failed', 'Failed to remove photo. Please try again.');
    } finally {
      setIsDeletingPhoto(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Camera size={24} className="text-blue-400" />
            Photo Gallery
          </h3>
          <p className="text-sm text-gray-400">
            {photos.length} of {maxPhotos} photos added
            {uploads.length > 0 && (
              <span className="ml-2 text-blue-400">
                • {getUploadStats().uploading} uploading
              </span>
            )}
          </p>
        </div>
        
        {/* Upload Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAdding(true)}
            disabled={photos.length >= maxPhotos || isAdding}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200"
            size="sm"
          >
            <Plus size={16} />
            Single Photo
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={photos.length >= maxPhotos}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            size="sm"
          >
            <FolderOpen size={16} />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Bulk Upload Drop Zone */}
      {photos.length < maxPhotos && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-500 ease-out",
            "bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm",
            isDragging 
              ? "border-white/40 bg-white/5 scale-[1.01] shadow-2xl shadow-white/10" 
              : "border-gray-600/50 hover:border-gray-500/60 hover:bg-gray-800/40 hover:shadow-xl hover:shadow-gray-900/20"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ease-out",
              "bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg",
              isDragging 
                ? "bg-gradient-to-br from-white/20 to-white/10 scale-110 shadow-xl shadow-white/20" 
                : "hover:scale-105 hover:shadow-xl hover:shadow-gray-900/30"
            )}>
              <Upload size={28} className={cn(
                "transition-colors duration-300",
                isDragging ? "text-white" : "text-gray-300"
              )} />
            </div>
            
            <div>
              <h4 className={cn(
                "text-lg font-medium mb-2 transition-colors duration-300",
                isDragging ? "text-white" : "text-gray-200"
              )}>
                {isDragging ? "Drop your photos here!" : "Drag & Drop Multiple Photos"}
              </h4>
              <p className="text-gray-400 text-sm">
                or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white hover:text-gray-200 underline underline-offset-2 transition-colors duration-200"
                >
                  browse and select multiple files
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Supports JPG, PNG, WebP, GIF • Max 10MB per file • Up to {maxPhotos - photos.length} more photos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Bulk Upload Progress */}
      {isBulkMode && uploads.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Bulk Upload Progress
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={clearCompletedUploads}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                Clear Completed
              </Button>
              <Button
                onClick={() => setIsBulkMode(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          
          {/* Upload Statistics */}
          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Total: {getUploadStats().total}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Success: {getUploadStats().success}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-300">Failed: {getUploadStats().error}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Uploading: {getUploadStats().uploading}</span>
            </div>
          </div>
          
          {/* Upload Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-lg border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-200"
              >
                {/* Preview */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0 ring-1 ring-gray-600/50">
                  {upload.preview && (
                    <img
                      src={upload.preview}
                      alt={upload.file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(upload.file.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                  {upload.status === 'error' && upload.error && (
                    <p className="text-xs text-red-400 mt-1">{upload.error}</p>
                  )}
                </div>
                
                {/* Status */}
                <div className="flex items-center gap-2">
                  {upload.status === 'pending' && (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
                  )}
                  {upload.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out"
                          style={{ width: `${upload.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-8">{Math.round(upload.progress)}%</span>
                    </div>
                  )}
                  {upload.status === 'success' && (
                    <CheckCircle size={16} className="text-green-400" />
                  )}
                  {upload.status === 'error' && (
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-400" />
                      <Button
                        onClick={() => retryUpload(upload)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 h-6 px-2 transition-all duration-200"
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Remove */}
                <Button
                  onClick={() => removeUpload(upload.id)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-6 w-6 p-0 transition-all duration-200"
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single Photo Upload Section */}
      {isAdding && (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-white">Upload Single Photo</h4>
            <Button
              onClick={() => setIsAdding(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              <X size={16} />
            </Button>
          </div>
          <EnhancedImageUpload
            onImageUploaded={handlePhotoAdded}
            uploadPath={uploadPath}
            aspectRatio="square"
            previewSize="sm"
            placeholder="Upload gym photo"
            variant="compact"
            maxSizeMB={5}
          />
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((_, index) => `photo-${index}`)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
              {photos.map((photo, index) => (
                <SortablePhoto
                  key={`photo-${index}`}
                  id={`photo-${index}`}
                  photo={photo}
                  index={index}
                  onDelete={handleDeletePhoto}
                  isDeleting={isDeletingPhoto === index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 xs:py-12 sm:py-16 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="w-16 xs:w-18 sm:w-20 h-16 xs:h-18 sm:h-20 mx-auto mb-4 xs:mb-5 sm:mb-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg">
            <Upload size={32} className="xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-gray-300" />
          </div>
          <h4 className="text-lg xs:text-xl font-medium text-white mb-1 xs:mb-2">No Photos Added</h4>
          <p className="text-gray-400 mb-4 xs:mb-5 sm:mb-6 max-w-md mx-auto text-sm xs:text-base px-4">Add photos to showcase your gym's equipment, facilities, and atmosphere</p>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-1.5 xs:gap-2 px-4 xs:px-6 py-2 xs:py-2.5 text-sm xs:text-base"
          >
            <Plus size={14} className="xs:w-4 xs:h-4" />
            Add First Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
