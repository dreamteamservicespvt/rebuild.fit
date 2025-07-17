import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { transformationsService, type Transformation } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import { Plus, ImageIcon, AlertCircle, Loader2, User, Grid3X3, Table2 } from 'lucide-react';
import ResponsiveImage from '@/components/ResponsiveImage';

// Import our new admin components
import AdminLayout from './AdminLayout';
import AdminFormField from './AdminFormField';
import { AdminTable, TableHeader, TableBody, TableHead, TableCell, TableRow, EmptyState, LoadingState } from './AdminTable';
import { DraggableTable } from './DraggableTable';
import AdminActions, { FormActions } from './AdminActions';
import FormLoadingOverlay from './FormLoadingOverlay';
import AdminTransformationCard from './AdminTransformationCard';

const AdminTransformations = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // Default to grid for better mobile experience
  
  const [formData, setFormData] = useState<Omit<Transformation, 'id'>>({
    name: '',
    beforeImage: '',
    afterImage: '',
    duration: '',
    goal: '',
    testimonial: ''
  });

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string;
    goal?: string;
    testimonial?: string;
    beforeImage?: string;
    afterImage?: string;
  }>({});

  useEffect(() => {
    const unsubscribe = transformationsService.onSnapshot((transformationsList) => {
      setTransformations(transformationsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (!formData.goal.trim()) {
      newErrors.goal = 'Goal is required';
    }
    
    if (!formData.testimonial.trim()) {
      newErrors.testimonial = 'Testimonial is required';
    }
    
    if (!formData.beforeImage && !formData.afterImage) {
      newErrors.beforeImage = 'At least one image (before or after) is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (transformation: Transformation) => {
    setEditing(transformation.id!);
    setIsAdding(false);
    setErrors({});
    setFormData({
      name: transformation.name,
      beforeImage: transformation.beforeImage,
      afterImage: transformation.afterImage,
      duration: transformation.duration,
      goal: transformation.goal,
      testimonial: transformation.testimonial
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await transformationsService.delete(id);
      toast.success('Transformation deleted', 'Transformation story has been deleted successfully');
    } catch (error) {
      toast.error('Error', 'Failed to delete transformation');
    }
  };

  const handleReorder = async (reorderedTransformations: Transformation[]) => {
    try {
      // Optimistically update the UI
      setTransformations(reorderedTransformations);
      
      // Update the order in Firestore
      await transformationsService.updateOrder(reorderedTransformations.map((transformation, index) => ({
        ...transformation,
        id: transformation.id!,
        order: index
      })));
      
      toast.success('Success', 'Transformations order has been updated');
    } catch (error) {
      toast.error('Error', 'Failed to update transformations order');
      
      // Revert to original order on error
      // The real-time listener will restore the correct order
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editing) {
        await transformationsService.update(editing, formData);
        setEditing(null);
        toast.success('Transformation updated', 'Transformation story has been updated successfully');
      } else if (isAdding) {
        await transformationsService.create(formData);
        setIsAdding(false);
        toast.success('Transformation added', 'New transformation story has been added successfully');
      }
      
      setFormData({
        name: '',
        beforeImage: '',
        afterImage: '',
        duration: '',
        goal: '',
        testimonial: ''
      });
    } catch (error) {
      toast.error('Error', editing ? 'Failed to update transformation' : 'Failed to add transformation');
    } finally {
      setSaving(false);
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
    setErrors({});
    setFormData({
      name: '',
      beforeImage: '',
      afterImage: '',
      duration: '',
      goal: '',
      testimonial: ''
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
    setErrors({});
    setFormData({
      name: '',
      beforeImage: '',
      afterImage: '',
      duration: '',
      goal: '',
      testimonial: ''
    });
  };

  const handleBeforeImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, beforeImage: url }));
    if (errors.beforeImage && url) {
      setErrors(prev => ({ ...prev, beforeImage: undefined }));
    }
  };

  const handleAfterImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, afterImage: url }));
    if (errors.beforeImage && !formData.beforeImage && url) {
      setErrors(prev => ({ ...prev, beforeImage: undefined }));
    }
  };

  return (
    <AdminLayout 
      title="Transformation Stories"
      description="Manage client transformation stories and testimonials"
      status={loading ? 'info' : transformations.length === 0 ? 'warning' : 'default'}
      statusText={loading ? 'Loading...' : transformations.length === 0 ? 'No transformations' : `${transformations.length} transformations`}
      actions={
        <div className="flex items-center gap-2 xs:gap-3">
          {/* View mode toggle - only show on larger screens when not in form mode */}
          {!isAdding && !editing && transformations.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-rebuild-darkgray rounded-lg p-1 border border-gray-700">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-7 w-7 p-0 transformation-view-mode-button",
                  viewMode === 'grid' ? "bg-rebuild-yellow text-black" : "text-gray-400 hover:text-white"
                )}
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                onClick={() => setViewMode('table')}
                className={cn(
                  "h-7 w-7 p-0 transformation-view-mode-button",
                  viewMode === 'table' ? "bg-rebuild-yellow text-black" : "text-gray-400 hover:text-white"
                )}
              >
                <Table2 size={14} />
              </Button>
            </div>
          )}
          <Button onClick={startAdding} className="bg-rebuild-yellow hover:bg-yellow-500 text-rebuild-black">
            <Plus size={16} className="mr-2" /> Add Transformation
          </Button>
        </div>
      }
      isLoading={loading}
    >
      {/* Show form when adding or editing */}
      {(isAdding || editing) ? (
        <div className="space-y-6 animate-in fade-in duration-200 relative">
          <FormLoadingOverlay active={saving} text={editing ? "Updating transformation..." : "Adding new transformation..."} />
          {/* Back to list button */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAdding(false);
                setEditing(null);
                setFormData({
                  name: '',
                  beforeImage: '',
                  afterImage: '',
                  duration: '',
                  goal: '',
                  testimonial: ''
                });
                setErrors({});
              }}
              className="border-gray-600 hover:border-rebuild-yellow"
            >
              ← Back to List
            </Button>
            <h2 className="text-xl font-semibold text-white">
              {isAdding ? 'Add New Transformation' : 'Edit Transformation'}
            </h2>
          </div>

          {/* Client Information Section */}
          <Card className="bg-rebuild-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="text-rebuild-yellow" size={20} />
                Client Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter the client's details and transformation story
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminFormField
                  id="name"
                  label="Client Name"
                  required
                  error={errors.name}
                  floatingLabel
                  animate
                  tooltip="The client's name or alias for privacy"
                >
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter client name"
                    icon={<User size={16} />}
                    variant="modern"
                    status={errors.name ? "error" : "default"}
                  />
                </AdminFormField>
                
                <AdminFormField
                  id="duration"
                  label="Transformation Duration"
                  floatingLabel
                  animate
                  tooltip="How long did the transformation take? e.g., '3 months', '6 weeks'"
                >
                  <Input 
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 3 months"
                    variant="modern"
                  />
                </AdminFormField>
              </div>
              
              <AdminFormField
                id="goal"
                label="Goal / Achievement"
                required
                error={errors.goal}
                floatingLabel
                animate
                tooltip="What was the client's main goal and what did they achieve?"
              >
                <Textarea 
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className={cn(
                    "min-h-[100px] rounded-md border border-gray-700 focus-visible:border-rebuild-yellow bg-rebuild-black",
                    errors.goal ? "border-destructive" : ""
                  )}
                  placeholder="Describe the client's goal and achievements..."
                />
              </AdminFormField>
              
              <AdminFormField
                id="testimonial"
                label="Client Testimonial"
                required
                error={errors.testimonial}
                floatingLabel
                animate
                tooltip="A quote or testimonial from the client about their experience"
              >
                <Textarea 
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                  className={cn(
                    "min-h-[120px] rounded-md border border-gray-700 focus-visible:border-rebuild-yellow bg-rebuild-black",
                    errors.testimonial ? "border-destructive" : ""
                  )}
                  placeholder="Enter the client's testimonial or feedback..."
                />
              </AdminFormField>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card className="bg-rebuild-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="text-rebuild-yellow" size={20} />
                Transformation Images
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload before and after photos showing the transformation progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminFormField
                  id="beforeImage"
                  label="Before Image"
                  error={errors.beforeImage}
                  description="Upload the 'before' transformation photo"
                  animate
                >
                  <EnhancedImageUpload
                    onImageUploaded={(url: string) => setFormData({...formData, beforeImage: url})}
                    currentImage={formData.beforeImage}
                    uploadPath="transformations/"
                    aspectRatio="portrait"
                    previewSize="sm"
                    placeholder="Upload before photo"
                    variant="ultra"
                    maxSizeMB={5}
                    className="inline-block"
                  />
                </AdminFormField>
                
                <AdminFormField
                  id="afterImage"
                  label="After Image"
                  description="Upload the 'after' transformation photo"
                  animate
                >
                  <EnhancedImageUpload
                    onImageUploaded={(url: string) => setFormData({...formData, afterImage: url})}
                    currentImage={formData.afterImage}
                    uploadPath="transformations/"
                    aspectRatio="portrait"
                    previewSize="sm"
                    placeholder="Upload after photo"
                    variant="ultra"
                    maxSizeMB={5}
                    className="inline-block"
                  />
                </AdminFormField>
              </div>
              
              {(!formData.beforeImage && !formData.afterImage) && errors.beforeImage && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle size={16} />
                  {errors.beforeImage}
                </div>
              )}
            </CardContent>
          </Card>
          
          <FormActions 
            onSave={handleSave} 
            onCancel={() => {
              setIsAdding(false);
              setEditing(null);
              setFormData({
                name: '',
                beforeImage: '',
                afterImage: '',
                duration: '',
                goal: '',
                testimonial: ''
              });
              setErrors({});
            }} 
            isLoading={saving}
            saveText={isAdding ? "Create Story" : "Update Story"}
          />
        </div>
      ) : (
        // Show list when not adding or editing
        <div className="space-y-4">
          {loading ? (
            <LoadingState message="Loading transformation stories..." />
          ) : transformations.length === 0 ? (
            <EmptyState 
              icon={<ImageIcon size={40} />}
              title="No transformation stories yet"
              description="Add your first client transformation story to showcase your gym's success stories."
              action={
                <Button onClick={startAdding} className="bg-rebuild-yellow hover:bg-yellow-500 text-rebuild-black">
                  <Plus size={16} className="mr-2" /> Add Transformation
                </Button>
              }
            />
          ) : (
            <>
              {/* Grid View - Always visible on mobile, toggleable on desktop */}
              <div className={cn(
                "transformation-grid-container",
                "block xs:block", // Always show on mobile
                viewMode === 'grid' ? "sm:block" : "sm:hidden" // Toggle on desktop
              )}>
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-6 transformation-card-grid">
                  {transformations.map((transformation) => (
                    <AdminTransformationCard
                      key={transformation.id}
                      transformation={transformation}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      disabled={editing !== null || isAdding}
                    />
                  ))}
                </div>
              </div>

              {/* Table View - Hidden on mobile, toggleable on desktop */}
              <div className={cn(
                "transformation-table-container",
                "hidden", // Hidden on mobile
                viewMode === 'table' ? "sm:block" : "sm:hidden" // Toggle on desktop
              )}>
                <DraggableTable
                  items={transformations}
                  onReorder={(reorderedItems) => handleReorder(reorderedItems as Transformation[])}
                  headers={['Name', 'Before / After', 'Duration', 'Goal', 'Testimonial', 'Actions']}
                  disabled={editing !== null || isAdding}
                  className="transformation-table-mobile"
                  renderRow={(item, isDragging) => {
                    const transformation = item as Transformation;
                    return [
                      <TableCell key="name" className="font-medium transformation-table-cell">{transformation.name}</TableCell>,
                      <TableCell key="images" className="transformation-table-cell">
                        <div className="flex gap-2">
                          {transformation.beforeImage && (
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-700">
                              <ResponsiveImage 
                                src={transformation.beforeImage} 
                                alt={`Before - ${transformation.name}`} 
                                className="w-full h-full object-contain"
                                preserveAspectRatio={true}
                              />
                            </div>
                          )}
                          {transformation.afterImage && (
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-700">
                              <ResponsiveImage 
                                src={transformation.afterImage} 
                                alt={`After - ${transformation.name}`} 
                                className="w-full h-full object-contain"
                                preserveAspectRatio={true}
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>,
                      <TableCell key="duration" className="transformation-table-cell hidden xs:table-cell">{transformation.duration || 'N/A'}</TableCell>,
                      <TableCell key="goal" className="transformation-table-cell hidden sm:table-cell max-w-[200px] truncate">{transformation.goal}</TableCell>,
                      <TableCell key="testimonial" className="transformation-table-cell hidden md:table-cell max-w-[200px] truncate">{transformation.testimonial}</TableCell>,
                      <TableCell key="actions" className="text-right transformation-table-cell">
                        <AdminActions
                          onEdit={() => handleEdit(transformation)}
                          onDelete={() => handleDelete(transformation.id!)}
                          itemName={`transformation for ${transformation.name}`}
                          disabled={editing !== null || isAdding}
                          compact
                        />
                      </TableCell>
                    ];
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Show loading overlay when saving or loading */}

    </AdminLayout>
  );
};

export default AdminTransformations;
