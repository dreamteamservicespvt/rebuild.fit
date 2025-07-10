import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, MapPin, Building2, Phone, Mail, Clock } from 'lucide-react';
import { gymProfileService, type Gym } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import AdminLayout from './AdminLayout';
import AdminFormField from './AdminFormField';
import { cn } from '@/lib/utils';
import FormLoadingOverlay from './FormLoadingOverlay';
import FormSection from './FormSection';
import PhotoGallery from '@/components/PhotoGallery';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

const AdminGyms = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Omit<Gym, 'id'>>({
    name: '',
    address: '',
    description: '',
    phone: '',
    email: '',
    openingHours: '',
    photos: [],
    features: []
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const unsubscribe = gymProfileService.onSnapshot((gym) => {
      if (gym) {
        setFormData({
          name: gym.name || '',
          address: gym.address || '',
          description: gym.description || '',
          phone: gym.phone || '',
          email: gym.email || '',
          openingHours: gym.openingHours || '',
          photos: gym.photos || [],
          features: gym.features || []
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Gym name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.openingHours.trim()) {
      newErrors.openingHours = 'Opening hours are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Validation Error', 'Please correct the errors in the form');
      return;
    }

    setSaving(true);
    try {
      await gymProfileService.updateGymProfile(formData);
      toast.success('Success', 'Gym information has been updated successfully');
    } catch (error) {
      toast.error('Error', 'Failed to update gym information');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({ ...prev, photos }));
  };

  const handleImmediatePhotoSave = async (photos: string[]) => {
    try {
      // Update local state
      setFormData(prev => ({ ...prev, photos }));
      
      // Save to database immediately
      const updatedData = { ...formData, photos };
      await gymProfileService.updateGymProfile(updatedData);
    } catch (error) {
      console.error('Failed to save photos:', error);
      throw error; // Re-throw to let PhotoGallery handle the error feedback
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(feature => feature !== featureToRemove) || []
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Our Gym" description="Loading gym information...">
        <div className="text-center py-8">Loading gym information...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Our Gym"
      description="Manage your gym's information and photo gallery"
    >
      <div className="space-y-3 xs:space-y-4 sm:space-y-6 lg:space-y-8 relative">
        <FormLoadingOverlay active={saving} text="Updating gym information..." />
        
        {/* Basic Information Section */}
        <FormSection 
          title="Basic Information"
          description="Enter the essential details about your gym"
          icon={<Building2 size={20} />}
        >
          <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">
            <AdminFormField
              id="name"
              label="Gym Name"
              required
              error={errors.name}
              floatingLabel
              animate
            >
              <Input 
                id="name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter gym name"
                variant="modern"
                status={errors.name ? "error" : "default"}
                icon={<Building2 size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="address"
              label="Address"
              required
              error={errors.address}
              floatingLabel
              animate
            >
              <Input 
                id="address"
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter gym address"
                variant="modern"
                status={errors.address ? "error" : "default"}
                icon={<MapPin size={16} />}
              />
            </AdminFormField>
          </div>
          
          <AdminFormField
            id="description"
            label="Description"
            required
            error={errors.description}
            floatingLabel
            animate
            tooltip="Provide detailed information about your gym, amenities, and unique features"
          >              <Textarea 
                id="description"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[60px] xs:min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]"
                status={errors.description ? "error" : "default"}
                variant="modern"
                placeholder="Describe your gym, including amenities, atmosphere, and what makes it special"
              />
          </AdminFormField>
        </FormSection>

        {/* Contact Information Section */}
        <FormSection
          title="Contact Information"
          description="Add contact details for your gym"
          icon={<Phone size={20} />}
        >
          <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-2">
            <AdminFormField
              id="phone"
              label="Phone"
              required
              error={errors.phone}
              floatingLabel
              animate
            >
              <Input 
                id="phone"
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
                variant="modern"
                status={errors.phone ? "error" : "default"}
                icon={<Phone size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="email"
              label="Email"
              required
              error={errors.email}
              floatingLabel
              animate
            >
              <Input 
                id="email"
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
                variant="modern"
                status={errors.email ? "error" : "default"}
                icon={<Mail size={16} />}
              />
            </AdminFormField>
          </div>
          
          <AdminFormField
            id="openingHours"
            label="Opening Hours"
            required
            error={errors.openingHours}
            floatingLabel
            animate
            tooltip="Enter your gym's operating hours, e.g., 'Mon-Fri: 5:00 AM - 10:00 PM, Sat-Sun: 6:00 AM - 8:00 PM'"
          >              <Textarea 
                id="openingHours"
                value={formData.openingHours} 
                onChange={(e) => setFormData({...formData, openingHours: e.target.value})}
                className="min-h-[50px] xs:min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]"
                status={errors.openingHours ? "error" : "default"}
                variant="modern"
                placeholder="Mon-Fri: 5:00 AM - 10:00 PM&#10;Sat-Sun: 6:00 AM - 8:00 PM"
              />
          </AdminFormField>
        </FormSection>

        {/* Photo Gallery Section */}
        <FormSection
          title="Photo Gallery"
          description="Add and manage photos of your gym"
          icon={<Building2 size={20} />}
        >
          <PhotoGallery
            photos={formData.photos}
            onPhotosChange={handlePhotosChange}
            uploadPath="gym/"
            maxPhotos={20}
            onImmediateSave={handleImmediatePhotoSave}
          />
        </FormSection>

        {/* Facilities/Features Section */}
        <FormSection
          title="Facilities & Features"
          description="Add and manage the features and amenities of your gym"
          icon={<Building2 size={20} />}
        >
          <div className="space-y-2 xs:space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-2 xs:mb-3 sm:mb-4">
              {formData.features?.map((feature, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="py-0.5 xs:py-1 sm:py-1.5 px-1.5 xs:px-2 sm:px-3 bg-rebuild-darkgray/50 flex items-center gap-0.5 xs:gap-1 sm:gap-2 text-xs"
                >
                  <span className="truncate max-w-[100px] xs:max-w-[120px] sm:max-w-none">{feature}</span>
                  <button 
                    onClick={() => removeFeature(feature)}
                    className="ml-0.5 sm:ml-1 text-gray-400 hover:text-white touch-manipulation p-0.5"
                  >
                    <X size={8} className="xs:hidden" />
                    <X size={10} className="hidden xs:block sm:hidden" />
                    <X size={12} className="hidden sm:block" />
                  </button>
                </Badge>
              ))}
              {formData.features?.length === 0 && (
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">No features added yet. Add features like "Personal Training", "Showers", etc.</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 xs:gap-2 sm:gap-3">
              <Input 
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter facility or feature"
                variant="modern"
                className="w-full"
                onKeyDown={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button 
                onClick={addFeature} 
                type="button" 
                variant="outline" 
                className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 w-full sm:w-auto sm:self-start min-h-[36px] xs:min-h-[40px] sm:min-h-[44px] text-xs xs:text-sm sm:text-base touch-manipulation"
              >
                <Plus size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" /> Add Feature
              </Button>
            </div>
          </div>
        </FormSection>
        
        {/* Save Button */}
        <div className="flex justify-center pt-3 xs:pt-4 sm:pt-6 lg:pt-8 pb-1 xs:pb-2 sm:pb-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className={cn(
              "bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500 transition-colors",
              "px-4 xs:px-6 sm:px-8 lg:px-12 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base lg:text-lg font-semibold",
              "relative overflow-hidden w-full sm:w-auto sm:min-w-[140px] xs:sm:min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] min-h-[36px] xs:min-h-[40px] sm:min-h-[44px] lg:min-h-[48px]",
              "touch-manipulation"
            )}
          >
            {saving ? (
              <>
                <span className="opacity-0">Save Changes</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 border-2 border-rebuild-black/30 border-t-rebuild-black rounded-full animate-spin mr-1.5 xs:mr-2" />
                  <span className="text-xs xs:text-sm sm:text-base">Saving...</span>
                </div>
              </>
            ) : (
              <>
                <Save size={14} className="mr-1 xs:mr-1.5 sm:mr-2 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                <span className="text-xs xs:text-sm sm:text-base lg:text-lg">Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGyms;
