import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { teamMemberService, type TeamMember } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import EnhancedImageUpload from '@/components/EnhancedImageUpload';
import { Plus, User, Briefcase, FileText, Loader2, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

// Import admin components
import AdminLayout from './AdminLayout';
import AdminFormField from './AdminFormField';
import { AdminTable, TableHeader, TableBody, TableHead, TableCell, TableRow, EmptyState, LoadingState } from './AdminTable';
import { DraggableTable } from './DraggableTable';
import AdminActions, { FormActions } from './AdminActions';
import FormLoadingOverlay from './FormLoadingOverlay';
import FormSection from './FormSection';
import { FormRow } from './FormLayout';

const AdminTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    bio: '',
    image: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      linkedin: '',
      twitter: ''
    }
  });

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string;
    role?: string;
    bio?: string;
  }>({});

  useEffect(() => {
    const unsubscribe = teamMemberService.onSnapshot((teamMembersList) => {
      setTeamMembers(teamMembersList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member.id!);
    setIsAdding(false);
    setErrors({});
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      socialLinks: member.socialLinks || {
        instagram: '',
        facebook: '',
        linkedin: '',
        twitter: ''
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await teamMemberService.delete(id);
      toast.success('Team member deleted', 'Team member has been removed successfully');
    } catch (error) {
      toast.error('Error', 'Failed to delete team member');
    }
  };

  const handleReorder = async (reorderedMembers: TeamMember[]) => {
    try {
      // Optimistically update the UI
      setTeamMembers(reorderedMembers);
      
      // Update the order in Firestore using Promise.all with individual updates
      await Promise.all(
        reorderedMembers.map((member, index) => 
          teamMemberService.update(member.id!, { order: index } as unknown as Partial<Omit<TeamMember, "id">>)
        )
      );
      
      toast.success('Success', 'Team member order has been updated');
    } catch (error) {
      toast.error('Error', 'Failed to update team member order');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editing) {
        await teamMemberService.update(editing, formData);
        setEditing(null);
        toast.success('Team member updated', 'Team member information has been updated successfully');
      } else if (isAdding) {
        await teamMemberService.create(formData);
        setIsAdding(false);
        toast.success('Team member added', 'New team member has been added successfully');
      }
      
      setFormData({
        name: '',
        role: '',
        bio: '',
        image: '',
        socialLinks: {
          instagram: '',
          facebook: '',
          linkedin: '',
          twitter: ''
        }
      });
    } catch (error) {
      toast.error('Error', editing ? 'Failed to update team member' : 'Failed to add team member');
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
      role: '',
      bio: '',
      image: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        linkedin: '',
        twitter: ''
      }
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
    setErrors({});
    setFormData({
      name: '',
      role: '',
      bio: '',
      image: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        linkedin: '',
        twitter: ''
      }
    });
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  return (
    <AdminLayout 
      title="Team Members"
      description="Manage your team members displayed on the website"
      status={loading ? 'info' : teamMembers.length === 0 ? 'warning' : 'default'}
      statusText={loading ? 'Loading...' : teamMembers.length === 0 ? 'No team members' : `${teamMembers.length} team members`}
      actions={
        <Button onClick={startAdding} className="bg-rebuild-yellow hover:bg-yellow-500 text-rebuild-black">
          <Plus size={16} className="mr-2" /> Add Team Member
        </Button>
      }
      isLoading={loading}
    >
      {/* Show form when adding or editing */}
      {(isAdding || editing) ? (
        <div className="space-y-6 animate-in fade-in duration-200 relative">
          <FormLoadingOverlay active={saving} text={editing ? "Updating team member..." : "Adding new team member..."} />
          
          {/* Back to list button */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={cancelEdit}
              className="border-gray-600 hover:border-rebuild-yellow"
            >
              ← Back to List
            </Button>
            <h2 className="text-xl font-semibold text-white">
              {isAdding ? 'Add New Team Member' : 'Edit Team Member'}
            </h2>
          </div>

          {/* Basic Information Section */}
          <FormSection
            title="Basic Information"
            description="Enter team member's personal and professional details"
            icon={<User size={20} />}
          >
            <FormRow>
              <AdminFormField
                id="name"
                label="Full Name"
                required
                error={errors.name}
                floatingLabel
                animate
                tooltip="Enter team member's full name"
              >
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter name"
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
                floatingLabel
                animate
                tooltip="Enter team member's role or position"
              >
                <Input 
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="e.g., Founder & Head Coach"
                  icon={<Briefcase size={16} />}
                  variant="modern"
                  status={errors.role ? "error" : "default"}
                />
              </AdminFormField>
            </FormRow>
            
            <AdminFormField
              id="bio"
              label="Biography"
              required
              error={errors.bio}
              floatingLabel
              animate
              tooltip="Enter a brief biography of the team member"
            >
              <Textarea 
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className={cn(
                  "min-h-[100px] rounded-md border border-gray-700 focus-visible:border-rebuild-yellow bg-rebuild-black",
                  errors.bio ? "border-destructive" : ""
                )}
                placeholder="Enter a brief biography..."
              />
            </AdminFormField>
            
            <AdminFormField
              id="image"
              label="Profile Photo"
              description="Upload a professional photo of the team member"
              animate
              tooltip="Recommended: High-quality professional headshot with clean background"
            >
              <EnhancedImageUpload
                onImageUploaded={handleImageUploaded}
                currentImage={formData.image}
                uploadPath="team/"
                aspectRatio="portrait"
                previewSize="md"
                placeholder="Upload photo"
                variant="standard"
                maxSizeMB={5}
              />
            </AdminFormField>
          </FormSection>

          {/* Social Media Links Section */}
          <FormSection
            title="Social Media Links"
            description="Add optional social media profiles"
            icon={<Instagram size={20} />}
          >
            <FormRow>
              <AdminFormField
                id="instagram"
                label="Instagram URL"
                floatingLabel
                animate
                tooltip="Enter the full Instagram profile URL"
              >
                <Input 
                  id="instagram"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, instagram: e.target.value}})}
                  placeholder="https://instagram.com/username"
                  icon={<Instagram size={16} />}
                  variant="modern"
                />
              </AdminFormField>
              
              <AdminFormField
                id="facebook"
                label="Facebook URL"
                floatingLabel
                animate
                tooltip="Enter the full Facebook profile URL"
              >
                <Input 
                  id="facebook"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, facebook: e.target.value}})}
                  placeholder="https://facebook.com/username"
                  icon={<Facebook size={16} />}
                  variant="modern"
                />
              </AdminFormField>
            </FormRow>
            
            <FormRow>
              <AdminFormField
                id="linkedin"
                label="LinkedIn URL"
                floatingLabel
                animate
                tooltip="Enter the full LinkedIn profile URL"
              >
                <Input 
                  id="linkedin"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                  placeholder="https://linkedin.com/in/username"
                  icon={<Linkedin size={16} />}
                  variant="modern"
                />
              </AdminFormField>
              
              <AdminFormField
                id="twitter"
                label="Twitter URL"
                floatingLabel
                animate
                tooltip="Enter the full Twitter profile URL"
              >
                <Input 
                  id="twitter"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, twitter: e.target.value}})}
                  placeholder="https://twitter.com/username"
                  icon={<Twitter size={16} />}
                  variant="modern"
                />
              </AdminFormField>
            </FormRow>
          </FormSection>
          
          <FormActions 
            onSave={handleSave} 
            onCancel={cancelEdit}
            isLoading={saving}
            saveText={isAdding ? "Add Team Member" : "Update Team Member"}
          />
        </div>
      ) : (
        // Show list when not adding or editing
        <div className="space-y-4">
          {loading ? (
            <LoadingState message="Loading team members..." />
          ) : teamMembers.length === 0 ? (
            <EmptyState 
              icon={<User size={40} />}
              title="No team members added yet"
              description="Add your first team member to showcase your gym's talented professionals."
              action={
                <Button onClick={startAdding} className="bg-rebuild-yellow hover:bg-yellow-500 text-rebuild-black">
                  <Plus size={16} className="mr-2" /> Add Team Member
                </Button>
              }
            />
          ) : (
            <DraggableTable
              items={teamMembers}
              onReorder={(reorderedItems) => handleReorder(reorderedItems as TeamMember[])}
              headers={['Photo', 'Name', 'Role', 'Bio', 'Actions']}
              disabled={editing !== null || isAdding}
              renderRow={(item, isDragging) => {
                const member = item as TeamMember;
                return [
                  <TableCell key="photo">
                    {member.image ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <User size={18} className="text-gray-400" />
                      </div>
                    )}
                  </TableCell>,
                  <TableCell key="name" className="font-medium">{member.name}</TableCell>,
                  <TableCell key="role">{member.role}</TableCell>,
                  <TableCell key="bio" className="max-w-xs truncate">{member.bio}</TableCell>,
                  <TableCell key="actions" className="text-right">
                    <AdminActions
                      onEdit={() => handleEdit(member)}
                      onDelete={() => handleDelete(member.id!)}
                      itemName={`team member "${member.name}"`}
                      disabled={editing !== null || isAdding}
                      compact
                    />
                  </TableCell>
                ];
              }}
            />
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeamMembers;
