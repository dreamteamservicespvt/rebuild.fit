import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Save, MapPin, Building2, Phone, Mail, Clock } from 'lucide-react';
import { gymProfileService, type Gym } from '../../lib/firebaseServices';
import { toast } from '../../lib/toast';
import AdminLayout from './AdminLayout';
import AdminFormField from './AdminFormField';
import { cn } from '../../lib/utils';
import FormLoadingOverlay from './FormLoadingOverlay';
import FormSection from './FormSection';
import PhotoGallery from '../PhotoGallery';

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
    photos: []
  });

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
          photos: gym.photos || []
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
      <div className="space-y-8 relative">
        <FormLoadingOverlay active={saving} text="Updating gym information..." />
        
        {/* Basic Information Section */}
        <FormSection 
          title="Basic Information"
          description="Enter the essential details about your gym"
          icon={<Building2 size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          >
            <Textarea 
              id="description"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="min-h-[120px]"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          >
            <Textarea 
              id="openingHours"
              value={formData.openingHours} 
              onChange={(e) => setFormData({...formData, openingHours: e.target.value})}
              className="min-h-[80px]"
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
        
        {/* Save Button */}
        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className={cn(
              "bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500 transition-colors px-12 py-3 text-lg font-semibold",
              "relative overflow-hidden min-w-[200px]"
            )}
          >
            {saving ? (
              <>
                <span className="opacity-0">Save Changes</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-rebuild-black/30 border-t-rebuild-black rounded-full animate-spin mr-2" />
                  Saving...
                </div>
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGyms;
