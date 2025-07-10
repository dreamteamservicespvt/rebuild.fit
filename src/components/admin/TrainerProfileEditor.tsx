import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Save, X, Plus, Upload, Link2, Eye, History, Smartphone, Monitor,
  Image, Video, GripVertical, Trash2, Edit2, Tag, User,
  Globe, Instagram, Facebook, Linkedin, Twitter, Star, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedTrainersService, type TrainerProfile, type TrainerMedia, type TrainerVideo } from '@/lib/firebaseServices';
import { uploadImageWithFallback } from '@/lib/uploadService';
import { toast } from '@/lib/toast';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import ResponsiveImage from '@/components/ResponsiveImage';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TrainerProfileEditorProps {
  trainerId?: string;
  onSave?: (trainer: TrainerProfile) => void;
  onCancel?: () => void;
}

interface MediaUploadItem {
  id: string;
  file?: File;
  url?: string;
  type: 'image' | 'video';
  caption: string;
  categoryTag: TrainerMedia['categoryTag'];
  altText?: string;
  uploading?: boolean;
  preview?: string;
}

const TrainerProfileEditor: React.FC<TrainerProfileEditorProps> = ({
  trainerId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<TrainerProfile, 'id'>>({
    name: '',
    slug: '',
    role: '',
    bioShort: '',
    bioLong: '',
    experienceYears: 0,
    specializations: [],
    certifications: [],
    profileImage: '',
    images: [],
    videos: [],
    featuredFlag: false,
    acceptingNewClientsFlag: true,
    socialLinks: {}
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaUploadItem[]>([]);
  const [bulkUrls, setBulkUrls] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load trainer data
  useEffect(() => {
    if (trainerId) {
      loadTrainer();
    }
  }, [trainerId]);

  const loadTrainer = async () => {
    if (!trainerId) return;
    
    setLoading(true);
    try {
      const trainer = await enhancedTrainersService.getById(trainerId);
      if (trainer) {
        setFormData(trainer);
        // Convert existing media to MediaUploadItem format
        const existingMedia: MediaUploadItem[] = [
          ...trainer.images.map((img, index) => ({
            id: `existing-img-${index}`,
            url: img.url,
            type: 'image' as const,
            caption: img.caption || '',
            categoryTag: img.categoryTag,
            altText: img.altText || ''
          })),
          ...trainer.videos.map((vid, index) => ({
            id: `existing-vid-${index}`,
            url: vid.url,
            type: 'video' as const,
            caption: vid.title,
            categoryTag: 'Gallery' as const,
            altText: vid.description || ''
          }))
        ];
        setMediaItems(existingMedia);
      }
    } catch (error) {
      toast.error('Error loading trainer data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !trainerId) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, trainerId]);

  const handleInputChange = (field: keyof TrainerProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field: 'specializations' | 'certifications', values: string[]) => {
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleSocialLinkChange = (platform: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url
      }
    }));
  };

  // Media management functions
  const handleFileUpload = useCallback(async (files: FileList) => {
    const newItems: MediaUploadItem[] = Array.from(files).map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      caption: '',
      categoryTag: 'Gallery',
      altText: '',
      uploading: true,
      preview: URL.createObjectURL(file)
    }));

    setMediaItems(prev => [...prev, ...newItems]);

    // Upload files
    for (const item of newItems) {
      if (item.file) {
        try {
          const uploadPath = item.type === 'video' ? 'trainers/videos' : 'trainers/images';
          const url = await uploadImageWithFallback(item.file, uploadPath);
          
          setMediaItems(prev => prev.map(media => 
            media.id === item.id 
              ? { ...media, url, uploading: false }
              : media
          ));
        } catch (error) {
          toast.error(`Failed to upload ${item.file.name}`);
          setMediaItems(prev => prev.filter(media => media.id !== item.id));
        }
      }
    }
  }, []);

  const handleBulkUrlImport = useCallback(async () => {
    const urls = bulkUrls.split('\n').filter(url => url.trim());
    const validUrls = urls.filter(url => {
      try {
        new URL(url.trim());
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      toast.error('No valid URLs found');
      return;
    }

    const newItems: MediaUploadItem[] = validUrls.map((url, index) => ({
      id: `bulk-${Date.now()}-${index}`,
      url: url.trim(),
      type: url.includes('video') || url.includes('youtube') || url.includes('vimeo') ? 'video' : 'image',
      caption: '',
      categoryTag: 'Gallery',
      altText: ''
    }));

    setMediaItems(prev => [...prev, ...newItems]);
    setBulkUrls('');
    toast.success(`Added ${validUrls.length} media items`);
  }, [bulkUrls]);

  const handleMediaDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setMediaItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateMediaItem = (id: string, updates: Partial<MediaUploadItem>) => {
    setMediaItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.role || !formData.bioShort) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      // Process media items
      const images: TrainerMedia[] = mediaItems
        .filter(item => item.type === 'image' && item.url)
        .map((item, index) => ({
          url: item.url!,
          caption: item.caption,
          categoryTag: item.categoryTag,
          altText: item.altText,
          order: index
        }));

      const videos: TrainerVideo[] = mediaItems
        .filter(item => item.type === 'video' && item.url)
        .map((item, index) => ({
          url: item.url!,
          title: item.caption,
          description: item.altText,
          type: item.url!.includes('youtube') || item.url!.includes('vimeo') ? 'embed' : 'upload',
          order: index
        }));

      const trainerData: Omit<TrainerProfile, 'id'> = {
        ...formData,
        images,
        videos
      };

      if (trainerId) {
        await enhancedTrainersService.updateWithSlug(trainerId, trainerData);
        toast.success('Trainer profile updated successfully');
      } else {
        const newId = await enhancedTrainersService.createWithSlug(trainerData);
        toast.success('Trainer profile created successfully');
        onSave?.({ ...trainerData, id: newId });
      }

      onSave?.(trainerData as TrainerProfile);
    } catch (error) {
      toast.error('Failed to save trainer profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rebuild-yellow"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 xs:p-6 space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 xs:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl xs:text-2xl font-bold text-white truncate">
            {trainerId ? 'Edit Trainer Profile' : 'Create New Trainer Profile'}
          </h1>
          <p className="text-sm xs:text-base text-gray-400 hidden xs:block">
            Manage trainer information, media, and profile settings
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1 xs:gap-2 w-full xs:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="border-gray-700 text-white hover:bg-gray-800 text-xs xs:text-sm px-2 xs:px-4 py-1 xs:py-2 h-auto xs:h-10 flex-1 xs:flex-none"
          >
            <Eye className="w-3 xs:w-4 h-3 xs:h-4 xs:mr-2" />
            <span className="hidden xs:inline">Preview</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowHistory(true)}
            className="border-gray-700 text-white hover:bg-gray-800 text-xs xs:text-sm px-2 xs:px-4 py-1 xs:py-2 h-auto xs:h-10 flex-1 xs:flex-none"
          >
            <History className="w-3 xs:w-4 h-3 xs:h-4 xs:mr-2" />
            <span className="hidden xs:inline">History</span>
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-gray-700 text-white hover:bg-gray-800 text-xs xs:text-sm px-2 xs:px-4 py-1 xs:py-2 h-auto xs:h-10 flex-1 xs:flex-none"
          >
            <X className="w-3 xs:w-4 h-3 xs:h-4 xs:mr-2" />
            <span className="hidden xs:inline">Cancel</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 text-xs xs:text-sm px-2 xs:px-4 py-1 xs:py-2 h-auto xs:h-10 flex-1 xs:flex-none"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-3 xs:h-4 w-3 xs:w-4 border-b-2 border-rebuild-black xs:mr-2"></div>
                <span className="hidden xs:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3 xs:w-4 h-3 xs:h-4 xs:mr-2" />
                <span className="hidden xs:inline">Save Profile</span>
                <span className="xs:hidden">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6">
        {/* Left Column - Form Fields */}
        <div className="space-y-4 xs:space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-rebuild-darkgray h-8 xs:h-10">
              <TabsTrigger value="basic" className="text-white data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black text-xs xs:text-sm px-1 xs:px-3">
                Basic
              </TabsTrigger>
              <TabsTrigger value="bio" className="text-white data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black text-xs xs:text-sm px-1 xs:px-3">
                Bio
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-white data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black text-xs xs:text-sm px-1 xs:px-3">
                Skills
              </TabsTrigger>
              <TabsTrigger value="social" className="text-white data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black text-xs xs:text-sm px-1 xs:px-3">
                Social
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3 xs:space-y-4">
              <Card className="bg-rebuild-darkgray border-gray-700">
                <CardHeader className="pb-2 xs:pb-6 p-3 xs:p-6">
                  <CardTitle className="text-white flex items-center text-base xs:text-lg">
                    <User className="w-4 xs:w-5 h-4 xs:h-5 mr-2 text-rebuild-yellow" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 xs:space-y-4 p-3 xs:p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4">
                    <div>
                      <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1 xs:mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        placeholder="Enter trainer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL Slug *
                      </label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        placeholder="url-friendly-name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role/Title *
                      </label>
                      <Input
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        placeholder="e.g., Head Trainer, Nutrition Coach"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Years of Experience
                      </label>
                      <Input
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Image
                    </label>
                    <EnhancedImageUpload
                      onImageUploaded={(url) => handleInputChange('profileImage', url)}
                      currentImage={formData.profileImage}
                      uploadPath="trainers/profiles"
                      variant="compact"
                      previewSize="md"
                      aspectRatio="square"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.featuredFlag}
                        onCheckedChange={(checked) => handleInputChange('featuredFlag', checked)}
                      />
                      <label className="text-sm text-gray-300">Featured Trainer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.acceptingNewClientsFlag}
                        onCheckedChange={(checked) => handleInputChange('acceptingNewClientsFlag', checked)}
                      />
                      <label className="text-sm text-gray-300">Accepting New Clients</label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bio" className="space-y-4">
              <Card className="bg-rebuild-darkgray border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Biography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Short Bio (for cards) *
                    </label>
                    <Textarea
                      value={formData.bioShort}
                      onChange={(e) => handleInputChange('bioShort', e.target.value)}
                      className="bg-rebuild-black border-gray-600 text-white"
                      rows={3}
                      maxLength={200}
                      placeholder="Brief description for trainer cards (max 200 characters)"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {formData.bioShort.length}/200 characters
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Biography
                    </label>
                    <Textarea
                      value={formData.bioLong}
                      onChange={(e) => handleInputChange('bioLong', e.target.value)}
                      className="bg-rebuild-black border-gray-600 text-white"
                      rows={8}
                      placeholder="Detailed biography for the profile page"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card className="bg-rebuild-darkgray border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Skills & Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Specializations
                    </label>
                    <SpecializationEditor
                      values={formData.specializations}
                      onChange={(values) => handleArrayFieldChange('specializations', values)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Certifications
                    </label>
                    <CertificationEditor
                      values={formData.certifications}
                      onChange={(values) => handleArrayFieldChange('certifications', values)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card className="bg-rebuild-darkgray border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-rebuild-yellow" />
                    Social Media Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </label>
                      <Input
                        value={formData.socialLinks?.instagram || ''}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </label>
                      <Input
                        value={formData.socialLinks?.facebook || ''}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </label>
                      <Input
                        value={formData.socialLinks?.linkedin || ''}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </label>
                      <Input
                        value={formData.socialLinks?.twitter || ''}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        className="bg-rebuild-black border-gray-600 text-white"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Media Manager */}
        <div className="space-y-6">
          <Card className="bg-rebuild-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Image className="w-5 h-5 mr-2 text-rebuild-yellow" />
                Media Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MediaManager
                mediaItems={mediaItems}
                onFileUpload={handleFileUpload}
                onBulkUrlImport={handleBulkUrlImport}
                bulkUrls={bulkUrls}
                setBulkUrls={setBulkUrls}
                onMediaDragEnd={handleMediaDragEnd}
                onUpdateMediaItem={updateMediaItem}
                onRemoveMediaItem={removeMediaItem}
                sensors={sensors}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <ProfilePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        trainerData={formData}
        mediaItems={mediaItems}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        trainerId={trainerId}
      />
    </div>
  );
};

// Specialization Editor Component
const SpecializationEditor: React.FC<{
  values: string[];
  onChange: (values: string[]) => void;
}> = ({ values, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addSpecialization = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeSpecialization = (spec: string) => {
    onChange(values.filter(s => s !== spec));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
          className="bg-rebuild-black border-gray-600 text-white"
          placeholder="Add specialization"
        />
        <Button
          type="button"
          onClick={addSpecialization}
          className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {values.map((spec, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-rebuild-yellow/20 text-rebuild-yellow border-rebuild-yellow/30"
          >
            {spec}
            <button
              onClick={() => removeSpecialization(spec)}
              className="ml-2 hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Certification Editor Component
const CertificationEditor: React.FC<{
  values: string[];
  onChange: (values: string[]) => void;
}> = ({ values, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addCertification = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeCertification = (cert: string) => {
    onChange(values.filter(c => c !== cert));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCertification()}
          className="bg-rebuild-black border-gray-600 text-white"
          placeholder="Add certification"
        />
        <Button
          type="button"
          onClick={addCertification}
          className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {values.map((cert, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-green-500/20 text-green-400 border-green-500/30"
          >
            {cert}
            <button
              onClick={() => removeCertification(cert)}
              className="ml-2 hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Media Manager Component
const MediaManager: React.FC<{
  mediaItems: MediaUploadItem[];
  onFileUpload: (files: FileList) => void;
  onBulkUrlImport: () => void;
  bulkUrls: string;
  setBulkUrls: (value: string) => void;
  onMediaDragEnd: (event: any) => void;
  onUpdateMediaItem: (id: string, updates: Partial<MediaUploadItem>) => void;
  onRemoveMediaItem: (id: string) => void;
  sensors: any;
}> = ({
  mediaItems,
  onFileUpload,
  onBulkUrlImport,
  bulkUrls,
  setBulkUrls,
  onMediaDragEnd,
  onUpdateMediaItem,
  onRemoveMediaItem,
  sensors
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-rebuild-yellow bg-rebuild-yellow/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => e.target.files && onFileUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-400">Drag & drop media files here, or click to select</p>
        <p className="text-xs text-gray-500 mt-1">Supports images and videos</p>
      </div>

      {/* Bulk URL Import */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Bulk URL Import
        </label>
        <Textarea
          value={bulkUrls}
          onChange={(e) => setBulkUrls(e.target.value)}
          className="bg-rebuild-black border-gray-600 text-white"
          rows={4}
          placeholder="Paste multiple image/video URLs (one per line)"
        />
        <Button
          onClick={onBulkUrlImport}
          disabled={!bulkUrls.trim()}
          className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Import URLs
        </Button>
      </div>

      {/* Media Items */}
      {mediaItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Media Items ({mediaItems.length})</h4>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onMediaDragEnd}
          >
            <SortableContext items={mediaItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mediaItems.map((item) => (
                  <SortableMediaItem
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => onUpdateMediaItem(item.id, updates)}
                    onRemove={() => onRemoveMediaItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

// Sortable Media Item Component
const SortableMediaItem: React.FC<{
  item: MediaUploadItem;
  onUpdate: (updates: Partial<MediaUploadItem>) => void;
  onRemove: () => void;
}> = ({ item, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-3 bg-rebuild-black rounded-lg border border-gray-600"
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-move text-gray-400 hover:text-white">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Preview */}
      <div className="w-16 h-16 rounded overflow-hidden bg-gray-700 flex-shrink-0">
        {item.preview || item.url ? (
          <img
            src={item.preview || item.url}
            alt={item.caption}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {item.type === 'video' ? (
              <Video className="w-6 h-6 text-gray-400" />
            ) : (
              <Image className="w-6 h-6 text-gray-400" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            value={item.caption}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Caption"
            className="bg-gray-800 border-gray-600 text-white text-sm"
          />
          <Select
            value={item.categoryTag}
            onValueChange={(value) => onUpdate({ categoryTag: value as TrainerMedia['categoryTag'] })}
          >
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="Gallery">Gallery</SelectItem>
              <SelectItem value="Before/After">Before/After</SelectItem>
              <SelectItem value="Certification">Certification</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {item.type === 'image' && (
          <Input
            value={item.altText || ''}
            onChange={(e) => onUpdate({ altText: e.target.value })}
            placeholder="Alt text (for accessibility)"
            className="bg-gray-800 border-gray-600 text-white text-sm"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1">
        {item.uploading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rebuild-yellow"></div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Profile Preview Modal Component
const ProfilePreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trainerData: Omit<TrainerProfile, 'id'>;
  mediaItems: MediaUploadItem[];
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}> = ({ isOpen, onClose, trainerData, mediaItems, previewMode, onPreviewModeChange }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-rebuild-darkgray border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">Profile Preview</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPreviewModeChange('desktop')}
                className={previewMode === 'desktop' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPreviewModeChange('mobile')}
                className={previewMode === 'mobile' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Mobile
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className={`mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-sm' : 'max-w-full'
          }`}>
            <div className="bg-rebuild-black rounded-lg overflow-hidden h-full">
              {/* Preview content would go here */}
              <div className="p-6 text-center text-gray-400">
                <p>Profile preview for {trainerData.name}</p>
                <p className="text-sm mt-2">{mediaItems.length} media items</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// History Modal Component
const HistoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trainerId?: string;
}> = ({ isOpen, onClose, trainerId }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-rebuild-darkgray border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Version History</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-400">Version history feature coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerProfileEditor;
