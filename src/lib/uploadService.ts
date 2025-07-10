import { cloudinaryService } from './cloudinaryService';

// Primary upload service using Cloudinary (no CORS issues)
export const uploadImageWithFallback = async (file: File, path: string): Promise<string> => {
  try {
    // Extract folder from path (e.g., 'gyms/', 'trainers/', 'transformations/before/')
    const pathParts = path.split('/');
    const folder = pathParts[0] || 'general';
    const subFolder = pathParts[1]; // for transformations/before/ or transformations/after/
    
    const finalFolder = subFolder ? `${folder}/${subFolder}` : folder;
    
    // Use Cloudinary service for upload
    return await cloudinaryService.uploadImage(file, finalFolder, {
      tags: [folder, 'rebuild_gym', 'admin_upload'],
      context: {
        upload_path: path,
        uploaded_via: 'admin_dashboard'
      }
    });
    
  } catch (error) {
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// New function to handle multiple image uploads at once
export const uploadMultipleImages = async (files: File[], path: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImageWithFallback(file, path));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Direct Cloudinary upload function for explicit use
export const uploadToCloudinary = async (file: File, folder?: string): Promise<string> => {
  return await cloudinaryService.uploadImage(file, folder);
};

// Export Cloudinary service for advanced usage
export { cloudinaryService };
