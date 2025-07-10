import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus, Save, X, Loader2, Star, DollarSign, Award, Tag, ListChecks, Grid3X3, Table2 } from 'lucide-react';
import { membershipsService, type Membership } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import AdminFormField from './AdminFormField';
import AdminLayout from './AdminLayout';
import { AdminTable, TableHeader as AdminTableHeader, TableBody as AdminTableBody, TableHead as AdminTableHead, TableCell as AdminTableCell, TableRow as AdminTableRow, EmptyState, LoadingState } from './AdminTable';
import { DraggableTable } from './DraggableTable';
import AdminActions, { FormActions } from './AdminActions';
import AdminMembershipCard from './AdminMembershipCard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import FormLoadingOverlay from './FormLoadingOverlay';

const AdminMembership = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeDuration, setActiveDuration] = useState<'monthly' | 'quarterly' | 'halfyearly' | 'annual'>('monthly');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const [formData, setFormData] = useState<Omit<Membership, 'id'>>({
    name: '',
    price: {
      monthly: '',
      quarterly: '',
      halfyearly: '',
      annual: ''
    },
    type: 'premium',
    features: [],
    isPopular: false
  });
  
  useEffect(() => {
    const unsubscribe = membershipsService.onSnapshot((membershipsList) => {
      setMemberships(membershipsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleEdit = (membership: Membership) => {
    setEditing(membership.id!);
    setFormData({
      name: membership.name,
      price: {...membership.price},
      type: membership.type,
      features: [...membership.features],
      isPopular: membership.isPopular
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await membershipsService.delete(id);
      toast.success('Membership plan deleted', 'Membership plan has been deleted successfully');
    } catch (error) {
      toast.error('Error', 'Failed to delete membership plan');
    }
  };

  const handleReorder = async (reorderedMemberships: Membership[]) => {
    try {
      // Optimistically update the UI
      setMemberships(reorderedMemberships);
      
      // Update the order in Firestore
      await membershipsService.updateOrder(reorderedMemberships.map((membership, index) => ({
        ...membership,
        id: membership.id!,
        order: index
      })));
      
      toast.success('Success', 'Membership plans order has been updated');
    } catch (error) {
      toast.error('Error', 'Failed to update membership plans order');
      
      // Revert to original order on error
      // The real-time listener will restore the correct order
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price.monthly) {
      toast.error('Validation Error', 'Please fill in name and at least monthly price');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await membershipsService.update(editing, formData);
        setEditing(null);
        toast.success('Membership plan updated', 'Membership plan has been updated successfully');
      } else if (isAdding) {
        await membershipsService.create(formData);
        setIsAdding(false);
        toast.success('Membership plan added', 'New membership plan has been added successfully');
      }
      
      setFormData({
        name: '',
        price: {
          monthly: '',
          quarterly: '',
          halfyearly: '',
          annual: ''
        },
        type: 'premium',
        features: [],
        isPopular: false
      });
    } catch (error) {
      toast.error('Error', editing ? 'Failed to update membership plan' : 'Failed to add membership plan');
    } finally {
      setSaving(false);
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
    setFormData({
      name: '',
      price: {
        monthly: '',
        quarterly: '',
        halfyearly: '',
        annual: ''
      },
      type: 'premium',
      features: [],
      isPopular: false
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
    setFormData({
      name: '',
      price: {
        monthly: '',
        quarterly: '',
        halfyearly: '',
        annual: ''
      },
      type: 'premium',
      features: [],
      isPopular: false
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading membership plans...</div>;
  }

  return (
    <AdminLayout 
      title="Membership Plans"
      description="Manage your gym's membership packages and pricing"
      actions={
        <div className="flex items-center gap-2 xs:gap-3">
          {/* View Mode Toggle - Hidden on Mobile */}
          {memberships.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-rebuild-darkgray rounded-lg p-1 border border-gray-700">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-7 w-7 p-0 membership-view-mode-button",
                  viewMode === 'grid' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-gray-400 hover:text-white'
                )}
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  "h-7 w-7 p-0 membership-view-mode-button",
                  viewMode === 'table' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-gray-400 hover:text-white'
                )}
              >
                <Table2 size={14} />
              </Button>
            </div>
          )}
          
          <Button 
            onClick={startAdding} 
            className="flex items-center gap-2 bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500"
            disabled={isAdding || editing !== null}
          >
            <Plus size={16} /> 
            <span className="hidden xs:inline">Add New Plan</span>
            <span className="xs:hidden">Add Plan</span>
          </Button>
        </div>
      }
      isLoading={loading}
    >

      {/* Duration Toggle - Responsive */}
      <div className="mb-4 xs:mb-6">
        <div className="bg-rebuild-darkgray p-1 xs:p-1.5 rounded-lg inline-flex relative overflow-hidden shadow-inner w-full xs:w-auto">
          <div 
            className="absolute bg-rebuild-yellow rounded transition-all duration-300 z-0"
            style={{
              left: activeDuration === 'monthly' ? '0%' : 
                   activeDuration === 'quarterly' ? '25%' : 
                   activeDuration === 'halfyearly' ? '50%' : '75%',
              width: '25%',
              height: 'calc(100% - 0.25rem)',
              top: '0.125rem',
            }}
          />
          {[
            { id: 'monthly', label: 'Monthly' },
            { id: 'quarterly', label: 'Quarterly' },
            { id: 'halfyearly', label: '6 Months' },
            { id: 'annual', label: 'Annual' }
          ].map((option) => (
            <button 
              key={option.id}
              className={cn(
                "px-2 xs:px-4 py-1 xs:py-1.5 rounded z-10 flex-1 xs:min-w-24 text-xs xs:text-sm font-medium transition-colors relative",
                activeDuration === option.id ? 'text-rebuild-black' : 'text-gray-300 hover:text-white'
              )}
              onClick={() => setActiveDuration(option.id as any)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {(isAdding || editing) && (
        <motion.div 
          className="bg-rebuild-darkgray p-3 xs:p-6 rounded-lg mb-4 xs:mb-6 border border-gray-700 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FormLoadingOverlay active={saving} text={editing ? "Updating membership plan..." : "Adding new membership plan..."} />
          <h3 className="text-lg xs:text-xl font-bold mb-3 xs:mb-4 flex items-center">
            {isAdding ? (
              <>
                <Plus size={16} className="mr-2 text-rebuild-yellow xs:size-20" /> 
                Add New Plan
              </>
            ) : (
              <>
                <Edit2 size={16} className="mr-2 text-rebuild-yellow xs:size-20" /> 
                Edit Plan: <span className="text-rebuild-yellow ml-2">{formData.name}</span>
              </>
            )}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 mb-3 xs:mb-4">
            <AdminFormField
              id="name"
              label="Plan Name"
              required
              floatingLabel
              animate
              tooltip="Enter a descriptive name for this membership plan"
            >
              <Input 
                id="name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., STRENGTHENING"
                variant="modern"
                icon={<Tag size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="type"
              label="Plan Type"
              floatingLabel
              animate
              tooltip="Select the category this membership belongs to"
            >
              <div className="pt-2">
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className={cn(
                    "bg-transparent border-0 border-b-2 border-gray-700 focus:border-rebuild-yellow rounded-none px-1 h-10",
                    "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  )}>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="women">Women-Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AdminFormField>
            
            <AdminFormField
              id="monthly"
              label="Monthly Price"
              required
              floatingLabel
              animate
              tooltip="Enter the price for monthly subscription"
            >
              <Input 
                id="monthly"
                value={formData.price.monthly} 
                onChange={(e) => setFormData({...formData, price: {...formData.price, monthly: e.target.value}})}
                placeholder="e.g., ₹1,999"
                variant="modern"
                icon={<DollarSign size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="quarterly"
              label="Quarterly Price"
              floatingLabel
              animate
              tooltip="Enter the price for quarterly subscription"
            >
              <Input 
                id="quarterly"
                value={formData.price.quarterly} 
                onChange={(e) => setFormData({...formData, price: {...formData.price, quarterly: e.target.value}})}
                placeholder="e.g., ₹5,499"
                variant="modern"
                icon={<DollarSign size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="halfyearly"
              label="Half-yearly Price"
              floatingLabel
              animate
              tooltip="Enter the price for 6-month subscription"
            >
              <Input 
                id="halfyearly"
                value={formData.price.halfyearly} 
                onChange={(e) => setFormData({...formData, price: {...formData.price, halfyearly: e.target.value}})}
                placeholder="e.g., ₹7,499"
                variant="modern"
                icon={<DollarSign size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="annual"
              label="Annual Price"
              floatingLabel
              animate
              tooltip="Enter the price for annual subscription"
            >
              <Input 
                id="annual"
                value={formData.price.annual} 
                onChange={(e) => setFormData({...formData, price: {...formData.price, annual: e.target.value}})}
                placeholder="e.g., ₹11,999"
                variant="modern"
                icon={<DollarSign size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="features"
              label="Features (comma separated)"
              className="md:col-span-2"
              floatingLabel
              animate
              tooltip="List the features included in this plan, separated by commas"
            >
              <Input 
                id="features"
                value={formData.features.join(', ')} 
                onChange={(e) => setFormData({
                  ...formData, 
                  features: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                })}
                placeholder="Access to strength equipment, Gym access (6 AM - 10 PM)"
                variant="modern"
                icon={<ListChecks size={16} />}
              />
            </AdminFormField>
            
            <AdminFormField
              id="isPopular"
              label=""
              className="md:col-span-2"
              animate
            >
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPopular" 
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({...formData, isPopular: checked as boolean})}
                  className="data-[state=checked]:bg-rebuild-yellow data-[state=checked]:border-rebuild-yellow"
                />
                <label htmlFor="isPopular" className="text-sm font-medium flex items-center">
                  <Award size={16} className="mr-2 text-rebuild-yellow" />
                  Mark as Popular Plan
                </label>
              </div>
            </AdminFormField>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={cancelEdit} 
              disabled={saving}
              className="border-gray-600 hover:bg-gray-800 transition-colors"
            >
              <X size={16} className="mr-2" /> Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className={cn(
                "bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500 transition-colors",
                "relative overflow-hidden"
              )}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  <span>Saving...</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-rebuild-black/20"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                  />
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {isAdding ? 'Create Plan' : 'Update Plan'}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Grid View - Always visible on mobile, toggleable on desktop */}
      {memberships.length > 0 && (
        <div className={cn(
          "block membership-grid-container",
          "sm:block", // Always show on mobile and small screens
          viewMode === 'grid' ? "sm:block" : "sm:hidden" // Toggle on larger screens
        )}>
          <div className={cn(
            "grid gap-3 xs:gap-6 membership-card-grid",
            "grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {memberships.map((plan) => (
              <AdminMembershipCard
                key={plan.id}
                plan={plan}
                activeDuration={activeDuration}
                onEdit={handleEdit}
                onDelete={handleDelete}
                disabled={editing !== null || isAdding}
              />
            ))}
          </div>
        </div>
      )}

      {/* Table View - Hidden on mobile, toggleable on desktop */}
      {memberships.length > 0 && (
        <div className={cn(
          "hidden membership-table-container",
          viewMode === 'table' ? "sm:block" : "sm:hidden"
        )}>
          <DraggableTable
            items={memberships}
            onReorder={(reorderedItems) => handleReorder(reorderedItems as Membership[])}
            headers={['Plan Name', 'Type', `Price (${activeDuration})`, 'Features', 'Popular', 'Actions']}
            disabled={editing !== null || isAdding}
            className="rounded-lg overflow-hidden border border-gray-700 bg-rebuild-darkgray"
            renderRow={(item, isDragging) => {
              const plan = item as Membership;
              return [
                <AdminTableCell key="name" className="font-medium membership-table-cell">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    {plan.name}
                  </div>
                </AdminTableCell>,
                <AdminTableCell key="type" className="capitalize membership-table-cell">
                  <Badge variant={
                    plan.type === 'premium' ? 'default' : 
                    plan.type === 'student' ? 'outline' : 'secondary'
                  } className="capitalize">
                    {plan.type}
                  </Badge>
                </AdminTableCell>,
                <AdminTableCell key="price" className="font-medium text-rebuild-yellow membership-table-cell">
                  {plan.price[activeDuration] || 'N/A'}
                </AdminTableCell>,
                <AdminTableCell key="features" className="hidden md:table-cell membership-table-cell">
                  <div className="flex flex-wrap gap-1">
                    {plan.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs whitespace-nowrap">
                        {feature}
                      </Badge>
                    ))}
                    {plan.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.features.length - 2}
                      </Badge>
                    )}
                  </div>
                </AdminTableCell>,
                <AdminTableCell key="popular" className="hidden sm:table-cell membership-table-cell">
                  {plan.isPopular && (
                    <div className="relative flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                      >
                        <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    </div>
                  )}
                </AdminTableCell>,
                <AdminTableCell key="actions" className="membership-table-cell">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(plan)}
                      disabled={editing !== null || isAdding}
                      className="hover:bg-rebuild-yellow/10 hover:text-rebuild-yellow border-gray-600"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(plan.id!)}
                      disabled={editing !== null || isAdding}
                      className="hover:bg-red-500/90"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </AdminTableCell>
              ];
            }}
          />
        </div>
      )}

      {memberships.length === 0 && (
        <motion.div 
          className="text-center py-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rebuild-yellow/10 mb-4">
            <DollarSign size={32} className="text-rebuild-yellow" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Membership Plans</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            You haven't created any membership plans yet. Add your first plan to start selling memberships.
          </p>
          <Button 
            onClick={startAdding} 
            className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500 flex items-center gap-2"
          >
            <Plus size={16} /> Create Your First Plan
          </Button>
        </motion.div>
      )}

      {/* Loading Overlay */}

    </AdminLayout>
  );
};

export default AdminMembership;
