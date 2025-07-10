import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, User, Briefcase, Award, Star } from 'lucide-react';
import { trainersService, type Trainer } from '@/lib/firebaseServices';
import { dropdownOptionsService, type DropdownOptions } from '@/lib/dropdownOptionsService';
import { toast } from '@/lib/toast';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import AdminLayout from './AdminLayout';
import AdminFormField from './AdminFormField';
import { AdminTable, TableHeader, TableBody, TableHead, TableCell, TableRow, EmptyState, LoadingState } from './AdminTable';
import { DraggableTable } from './DraggableTable';
import AdminActions, { FormActions } from './AdminActions';
import AdminModal from './AdminModal';
import ResponsiveImage from '@/components/ResponsiveImage';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import FormLoadingOverlay from './FormLoadingOverlay';
import FormSection from './FormSection';
import { FormRow, FormGrid } from './FormLayout';
import { FormGroup } from './FormLayout';
import { DynamicSelect } from './DynamicSelect';
import { DropdownOptionsManager } from './DropdownOptionsManager';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    roles: [],
    experiences: [],
    specializations: []
  });
  
  const [formData, setFormData] = useState<Partial<Omit<Trainer, 'id'>>>({
    name: '',
    role: '',
    image: '',
    experience: '',
    specialization: ''
  });
  
  useEffect(() => {
    const unsubscribe = trainersService.onSnapshot((trainersList) => {
      setTrainers(trainersList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Initialize and listen to dropdown options
  useEffect(() => {
    const initializeOptions = async () => {
      try {
        await dropdownOptionsService.initializeOptions();
        const currentOptions = dropdownOptionsService.getCurrentOptions();
        setDropdownOptions(currentOptions);
      } catch (error) {
        console.error('Failed to initialize dropdown options:', error);
      }
    };

    initializeOptions();

    const unsubscribe = dropdownOptionsService.onSnapshot((options) => {
      setDropdownOptions(options);
    });

    return unsubscribe;
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (trainer: Trainer) => {
    setEditing(trainer.id!);
    setFormData({
      name: trainer.name,
      role: trainer.role,
      image: trainer.image,
      experience: trainer.experience,
      specialization: trainer.specialization
    });
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    try {
      await trainersService.delete(id);
      toast.success('Success', 'Trainer has been deleted successfully');
    } catch (error) {
      toast.error('Error', 'Failed to delete trainer');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Validation Error', 'Please correct the errors in the form');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await trainersService.update(editing, formData);
        setEditing(null);
        toast.success('Success', 'Trainer information has been updated successfully');
      } else if (isAdding) {
        await trainersService.create(formData as Omit<Trainer, "id">);
        setIsAdding(false);
        toast.success('Success', 'New trainer has been added successfully');
      }
      
      setFormData({
        name: '',
        role: '',
        image: '',
        experience: '',
        specialization: ''
      });
    } catch (error) {
      toast.error('Error', editing ? 'Failed to update trainer' : 'Failed to add trainer');
    } finally {
      setSaving(false);
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
    setFormData({
      name: '',
      role: '',
      image: '',
      experience: '',
      specialization: ''
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
    setFormData({
      name: '',
      role: '',
      image: '',
      experience: '',
      specialization: ''
    });
    setErrors({});
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleViewDetails = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setViewModalOpen(true);
  };

  const handleReorder = async (reorderedTrainers: Trainer[]) => {
    try {
      // Optimistically update the UI
      setTrainers(reorderedTrainers);
      
      // Update the order in Firestore
      await trainersService.updateOrder(reorderedTrainers.map((trainer, index) => ({
        ...trainer,
        id: trainer.id!,
        order: index
      })));
      
      toast.success('Success', 'Trainers order has been updated');
    } catch (error) {
      toast.error('Error', 'Failed to update trainers order');
      
      // Revert to original order on error
      // The real-time listener will restore the correct order
    }
  };

  const handleAddRole = async (role: string) => {
    try {
      await dropdownOptionsService.addRole(role);
      toast.success('Success', 'New role option added successfully');
    } catch (error) {
      toast.error('Error', 'Failed to add new role option');
      throw error;
    }
  };

  const handleAddExperience = async (experience: string) => {
    try {
      await dropdownOptionsService.addExperience(experience);
      toast.success('Success', 'New experience option added successfully');
    } catch (error) {
      toast.error('Error', 'Failed to add new experience option');
      throw error;
    }
  };

  const handleAddSpecialization = async (specialization: string) => {
    try {
      await dropdownOptionsService.addSpecialization(specialization);
      toast.success('Success', 'New specialization option added successfully');
    } catch (error) {
      toast.error('Error', 'Failed to add new specialization option');
      throw error;
    }
  };
  
  const renderForm = () => (
    <div className="space-y-6 animate-in fade-in duration-200 relative">
      <FormLoadingOverlay active={saving} text={editing ? "Updating trainer..." : "Adding new trainer..."} />
      {/* Basic Information Section */}
      <FormSection
        title="Basic Information"
        description="Enter the trainer's personal and professional details"
        icon={<User size={20} />}
      >
        <FormRow>
          <AdminFormField
            id="name"
            label="Trainer Name"
            required
            error={errors.name}
            floatingLabel
            animate
            tooltip="Enter the trainer's full name"
          >
            <Input 
              id="name"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter trainer name"
              icon={<User size={16} />}
              variant="modern"
              status={errors.name ? "error" : "default"}
            />
          </AdminFormField>
          
          <AdminFormField
            id="role"
            label="Role / Position"
            required
            error={errors.role}
            tooltip="The trainer's position or title at the gym"
            floatingLabel
            animate
          >
            <DynamicSelect
              value={formData.role}
              onValueChange={(value) => setFormData({...formData, role: value})}
              options={dropdownOptions.roles}
              onAddOption={handleAddRole}
              placeholder="Select role or add new"
              icon={<Briefcase size={16} />}
              error={!!errors.role}
              label="Role"
            />
          </AdminFormField>
        </FormRow>
        
        <FormGroup>
          <AdminFormField
            id="image"
            label="Profile Image"
            description="Upload a professional photo of the trainer"
            animate
            tooltip="Recommended: High-quality professional headshot with clean background"
          >
            <EnhancedImageUpload
              onImageUploaded={handleImageUploaded}
              currentImage={formData.image}
              uploadPath="trainers/"
              aspectRatio="portrait"
              previewSize="sm"
              placeholder="Upload trainer photo"
              variant="ultra"
              maxSizeMB={3}
              className="inline-block"
            />
          </AdminFormField>
        </FormGroup>
      </FormSection>

      {/* Expertise & Credentials Section */}
      <FormSection
        title="Expertise & Credentials"
        description="Define the trainer's experience and areas of specialization"
        icon={<Award size={20} />}
      >
        <FormRow>
            <AdminFormField
              id="experience"
              label="Experience"
              tooltip="The number of years of professional experience"
              floatingLabel
              animate
            >
              <DynamicSelect
                value={formData.experience}
                onValueChange={(value) => setFormData({...formData, experience: value})}
                options={dropdownOptions.experiences}
                onAddOption={handleAddExperience}
                placeholder="Select experience or add new"
                icon={<Award size={16} />}
                label="Experience"
              />
            </AdminFormField>
            
            <AdminFormField
              id="specialization"
              label="Specialization"
              required
              error={errors.specialization}
              tooltip="The trainer's main areas of expertise"
              floatingLabel
              animate
            >
              <DynamicSelect
                value={formData.specialization}
                onValueChange={(value) => setFormData({...formData, specialization: value})}
                options={dropdownOptions.specializations}
                onAddOption={handleAddSpecialization}
                placeholder="Select specialization or add new"
                icon={<Star size={16} />}
                error={!!errors.specialization}
                label="Specialization"
              />
            </AdminFormField>
        </FormRow>
      </FormSection>
      
      <FormActions 
        onSave={handleSave} 
        onCancel={cancelEdit} 
        isLoading={saving}
        saveText={isAdding ? "Add Trainer" : "Update Trainer"}
      />
    </div>
  );

  if (loading) {
    return <LoadingState message="Loading trainers..." />;
  }

  // View Details Modal
  const renderViewDetailsModal = () => (
    <AdminModal
      isOpen={viewModalOpen}
      onClose={() => setViewModalOpen(false)}
      title={selectedTrainer?.name || "Trainer Details"}
      size="md"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {selectedTrainer?.image ? (
            <div className="rounded-full overflow-hidden w-32 h-32 ring-4 ring-rebuild-yellow/20">
              <ResponsiveImage
                src={selectedTrainer.image}
                alt={selectedTrainer.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={40} className="text-gray-400" />
            </div>
          )}
          
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold">{selectedTrainer?.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge className="bg-rebuild-yellow text-rebuild-black">
                {selectedTrainer?.role}
              </Badge>
              <Badge variant="outline">
                {selectedTrainer?.specialization}
              </Badge>
              {selectedTrainer?.experience && (
                <Badge variant="outline">
                  <Award size={12} className="mr-1" />
                  {selectedTrainer.experience}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );

  return (
    <AdminLayout 
      title="Trainers"
      description="Manage your personal trainers and coaching staff"
      actions={
        <Button onClick={startAdding} className="flex items-center gap-2 bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500">
          <Plus size={16} /> Add New Trainer
        </Button>
      }
      isLoading={loading}
    >
      {(isAdding || editing) && renderForm()}

      {!isAdding && !editing && (
        <>
          {/* Dropdown Options Manager */}
          <div className="mb-6">
            <DropdownOptionsManager />
          </div>

          <DraggableTable
            items={trainers}
            onReorder={(reorderedItems) => handleReorder(reorderedItems as Trainer[])}
            headers={['Image', 'Name', 'Role', 'Experience', 'Specialization', 'Actions']}
            disabled={editing !== null || isAdding}
            renderRow={(item, isDragging) => {
              const trainer = item as Trainer;
              return [
                <TableCell key="image">
                  {trainer.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <ResponsiveImage 
                        src={trainer.image} 
                        alt={trainer.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <User size={18} className="text-gray-400" />
                    </div>
                  )}
                </TableCell>,
                <TableCell key="name" className="font-medium">{trainer.name}</TableCell>,
                <TableCell key="role">
                  <Badge variant="outline">{trainer.role}</Badge>
                </TableCell>,
                <TableCell key="experience" className="hidden md:table-cell">
                  {trainer.experience || '—'}
                </TableCell>,
                <TableCell key="specialization" className="hidden md:table-cell">
                  <span className="text-sm">{trainer.specialization}</span>
                </TableCell>,
                <TableCell key="actions">
                  <AdminActions 
                    onEdit={() => handleEdit(trainer)}
                    onDelete={() => handleDelete(trainer.id!)}
                    onView={() => handleViewDetails(trainer)}
                    disabled={editing !== null || isAdding}
                    itemName={`trainer "${trainer.name}"`}
                    showView={true}
                    compact
                  />
                </TableCell>
              ];
            }}
          />

          {trainers.length === 0 && (
            <EmptyState
              icon={<User size={40} />}
              title="No Trainers Found"
              description="Add your first trainer to get started."
              action={
                <Button onClick={startAdding} className="flex items-center gap-2 bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500">
                  <Plus size={16} /> Add New Trainer
                </Button>
              }
            />
          )}
          
          {renderViewDetailsModal()}
        </>
      )}

      {/* Loading overlay for form actions */}

    </AdminLayout>
  );
};

export default AdminTrainers;
