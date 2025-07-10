// Cloudinary service for handling all image operations
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  width: number;
  height: number;
  folder?: string;
  created_at: string;
}

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiUrl: string;
}

class CloudinaryService {
  private config: CloudinaryConfig;
  private uploadPresets = ['rebuild_fit', 'ml_default', 'unsigned']; // Multiple fallback presets

  constructor() {
    this.config = {
      cloudName: 'dvmrhs2ek',
      uploadPreset: 'rebuild_fit', // Primary preset is 'rebuild_fit', with fallbacks
      apiUrl: 'https://api.cloudinary.com/v1_1/dvmrhs2ek'
    };
  }

  /**
   * Upload an image to Cloudinary with fallback presets
   * @param file - The file to upload
   * @param folder - Optional folder name (e.g., 'gyms', 'trainers', 'transformations')
   * @param options - Additional upload options
   */
  async uploadImage(
    file: File, 
    folder?: string, 
    options?: {
      transformation?: string;
      tags?: string[];
      context?: Record<string, string>;
    }
  ): Promise<string> {
    // Try multiple upload presets in order
    for (let i = 0; i < this.uploadPresets.length; i++) {
      const preset = this.uploadPresets[i];
      
      try {
        const result = await this.attemptUpload(file, preset, folder, options);
        return result;
      } catch (error) {
        
        // If this is the last preset, throw the error
        if (i === this.uploadPresets.length - 1) {
          throw new Error(
            `Failed to upload image with all available presets. Last error: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
      }
    }
    
    throw new Error('No upload presets available');
  }

  /**
   * Attempt upload with a specific preset
   */
  private async attemptUpload(
    file: File,
    uploadPreset: string,
    folder?: string,
    options?: {
      transformation?: string;
      tags?: string[];
      context?: Record<string, string>;
    }
  ): Promise<string> {
    try {
      // Validate file
      this.validateFile(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      
      // Set folder structure
      if (folder) {
        formData.append('folder', `rebuild_gym/${folder}`);
      }
      
      // Add optional parameters
      if (options?.tags) {
        formData.append('tags', options.tags.join(','));
      }
      
      if (options?.context) {
        const contextString = Object.entries(options.context)
          .map(([key, value]) => `${key}=${value}`)
          .join('|');
        formData.append('context', contextString);
      }
      
      // Add timestamp and metadata
      formData.append('context', `upload_timestamp=${Date.now()}|original_name=${file.name}`);

      const response = await fetch(`${this.config.apiUrl}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.error?.message || 'Unknown error occurred';
        
        // Provide more specific error message for upload_preset issues
        if (errorMessage.includes('upload_preset') || response.status === 400) {
          errorMessage = `Upload preset "${uploadPreset}" not found or not properly configured. Please verify the upload preset exists in your Cloudinary account and is set to "unsigned".`;
        }
        
        throw new Error(`Upload failed: ${response.statusText}. ${errorMessage}`);
      }

      const result: CloudinaryResponse = await response.json();
      return result.secure_url;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate optimized image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformations - Array of transformation strings
   */
  getOptimizedUrl(publicId: string, transformations: string[] = []): string {
    const baseUrl = `https://res.cloudinary.com/${this.config.cloudName}/image/upload`;
    const transformString = transformations.length > 0 ? `/${transformations.join('/')}/` : '/';
    return `${baseUrl}${transformString}${publicId}`;
  }

  /**
   * Get responsive image URLs for different screen sizes
   * @param url - Original Cloudinary URL
   */
  getResponsiveUrls(url: string) {
    const publicId = this.extractPublicId(url);
    if (!publicId) return { original: url };

    return {
      original: url,
      thumbnail: this.getOptimizedUrl(publicId, ['w_150,h_150,c_fill,q_auto']),
      small: this.getOptimizedUrl(publicId, ['w_400,h_300,c_fill,q_auto']),
      medium: this.getOptimizedUrl(publicId, ['w_800,h_600,c_fill,q_auto']),
      large: this.getOptimizedUrl(publicId, ['w_1200,h_900,c_fill,q_auto']),
      webp_small: this.getOptimizedUrl(publicId, ['w_400,h_300,c_fill,q_auto,f_webp']),
      webp_medium: this.getOptimizedUrl(publicId, ['w_800,h_600,c_fill,q_auto,f_webp']),
    };
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Cloudinary URL
   */
  private extractPublicId(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex === -1) return null;
      
      // Get everything after 'upload' and any transformations
      let publicIdParts = urlParts.slice(uploadIndex + 1);
      
      // Remove version if present (starts with 'v' followed by numbers)
      if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
        publicIdParts = publicIdParts.slice(1);
      }
      
      // Join back and remove file extension
      const publicId = publicIdParts.join('/');
      return publicId.replace(/\.[^.]+$/, '');
    } catch {
      return null;
    }
  }

  /**
   * Validate file before upload
   * @param file - File to validate
   */
  private validateFile(file: File): void {
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 10MB');
    }

    // Check for supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!supportedFormats.includes(file.type)) {
      throw new Error('Supported formats: JPEG, PNG, GIF, WebP');
    }
  }

  /**
   * Delete an image from Cloudinary (requires admin API key - not implemented for security)
   * Note: Deletion should be handled server-side for security reasons
   */
  async deleteImage(publicId: string): Promise<void> {
    // This would require the API secret which should not be exposed client-side
    throw new Error('Image deletion not available in client-side implementation');
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();

// Export types for use in other files
export type { CloudinaryResponse };

// Helper functions for common operations
export const uploadToCloudinary = (file: File, folder?: string) => 
  cloudinaryService.uploadImage(file, folder);

export const getResponsiveImageUrls = (url: string) => 
  cloudinaryService.getResponsiveUrls(url);

export const getOptimizedImageUrl = (url: string, transformations: string[] = []) => {
  const publicId = cloudinaryService['extractPublicId'](url);
  return publicId ? cloudinaryService.getOptimizedUrl(publicId, transformations) : url;
};
