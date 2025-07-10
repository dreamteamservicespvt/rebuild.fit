import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus, Save, X, Loader2, Star, DollarSign, Award, Tag, Users, Heart, Settings, Search, Grid3X3, Table2 } from 'lucide-react';
import { addOnServicesService, type AddOnService } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import AdminFormField from './AdminFormField';
import AdminLayout from './AdminLayout';
import { AdminTable, TableHeader as AdminTableHeader, TableBody as AdminTableBody, TableHead as AdminTableHead, TableCell as AdminTableCell, TableRow as AdminTableRow, EmptyState, LoadingState } from './AdminTable';
import { DraggableTable } from './DraggableTable';
import AdminActions, { FormActions } from './AdminActions';
import AdminAddOnServiceCard from './AdminAddOnServiceCard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import FormLoadingOverlay from './FormLoadingOverlay';

const AdminAddOnServices = () => {
  const [services, setServices] = useState<AddOnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const [formData, setFormData] = useState<Omit<AddOnService, 'id'>>({
    name: '',
    description: '',
    price: {
      perSession: '',
      monthly: '',
      oneTime: ''
    },
    features: [],
    category: 'training',
    isPopular: false,
    isActive: true
  });

  const [newFeature, setNewFeature] = useState('');
  
  useEffect(() => {
    const unsubscribe = addOnServicesService.onSnapshot((servicesList) => {
      setServices(servicesList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleEdit = (service: AddOnService) => {
    setEditing(service.id!);
    setFormData({
      name: service.name,
      description: service.description,
      price: {...service.price},
      features: [...service.features],
      category: service.category,
      isPopular: service.isPopular,
      isActive: service.isActive
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await addOnServicesService.delete(id);
      toast.success('Service deleted', 'Add-on service has been deleted successfully');
    } catch (error) {
      toast.error('Error', 'Failed to delete add-on service');
    }
  };

  const handleReorder = async (reorderedServices: AddOnService[]) => {
    try {
      // Optimistically update the UI
      setServices(reorderedServices);
      
      // Update the order in Firestore
      await addOnServicesService.updateOrder(reorderedServices.map((service, index) => ({
        ...service,
        id: service.id!,
        order: index
      })));
      
      toast.success('Success', 'Add-on services order has been updated');
    } catch (error) {
      toast.error('Error', 'Failed to update services order');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Validation Error', 'Please fill in name and description');
      return;
    }

    // Validate at least one pricing option
    if (!formData.price.perSession && !formData.price.monthly && !formData.price.oneTime) {
      toast.error('Validation Error', 'Please provide at least one pricing option');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await addOnServicesService.update(editing, formData);
        setEditing(null);
        toast.success('Service updated', 'Add-on service has been updated successfully');
      } else if (isAdding) {
        await addOnServicesService.create(formData);
        setIsAdding(false);
        toast.success('Service added', 'New add-on service has been added successfully');
      }
      
      setFormData({
        name: '',
        description: '',
        price: {
          perSession: '',
          monthly: '',
          oneTime: ''
        },
        features: [],
        category: 'training',
        isPopular: false,
        isActive: true
      });
      setNewFeature('');
    } catch (error) {
      toast.error('Error', editing ? 'Failed to update service' : 'Failed to add service');
    } finally {
      setSaving(false);
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
    setFormData({
      name: '',
      description: '',
      price: {
        perSession: '',
        monthly: '',
        oneTime: ''
      },
      features: [],
      category: 'training',
      isPopular: false,
      isActive: true
    });
    setNewFeature('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
    setFormData({
      name: '',
      description: '',
      price: {
        perSession: '',
        monthly: '',
        oneTime: ''
      },
      features: [],
      category: 'training',
      isPopular: false,
      isActive: true
    });
    setNewFeature('');
  };

  // Filter services based on search and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = searchQuery === '' || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'training':
        return <Users size={16} className="text-blue-400" />;
      case 'nutrition':
        return <Heart size={16} className="text-green-400" />;
      case 'wellness':
        return <Star size={16} className="text-purple-400" />;
      default:
        return <Settings size={16} className="text-gray-400" />;
    }
  };

  const renderForm = () => (
    <div className="space-y-4 xs:space-y-6">
      <motion.div 
        className="bg-rebuild-darkgray p-3 xs:p-6 rounded-lg mb-4 xs:mb-6 border border-gray-700 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FormLoadingOverlay active={saving} text={editing ? "Updating service..." : "Adding new service..."} />
        <h3 className="text-lg xs:text-xl font-bold mb-3 xs:mb-4 flex items-center">
          {isAdding ? (
            <>
              <Plus size={16} className="mr-2 text-rebuild-yellow xs:size-20" /> 
              Add New Service
            </>
          ) : (
            <>
              <Edit2 size={16} className="mr-2 text-rebuild-yellow xs:size-20" /> 
              Edit Service: <span className="text-rebuild-yellow ml-2">{formData.name}</span>
            </>
          )}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 mb-3 xs:mb-4">
          <AdminFormField
            id="name"
            label="Service Name"
            required
            floatingLabel
            animate
            tooltip="Enter the name of the add-on service"
          >
            <Input 
              id="name"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Personal Training"
              variant="modern"
              icon={<Tag size={16} />}
            />
          </AdminFormField>

          <AdminFormField
            id="category"
            label="Category"
            required
            floatingLabel
            animate
            tooltip="Select the category for this service"
          >
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value as any})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </AdminFormField>
        </div>

        <div className="mb-4">
          <AdminFormField
            id="description"
            label="Description"
            required
            floatingLabel
            animate
            tooltip="Provide a detailed description of the service"
          >
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this service includes and its benefits..."
              rows={3}
              className="resize-none"
            />
          </AdminFormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <AdminFormField
            id="perSession"
            label="Per Session Price"
            floatingLabel
            animate
            tooltip="Price per individual session (optional)"
          >
            <Input 
              id="perSession"
              value={formData.price.perSession} 
              onChange={(e) => setFormData({...formData, price: {...formData.price, perSession: e.target.value}})}
              placeholder="e.g., ₹500"
              variant="modern"
              icon={<DollarSign size={16} />}
            />
          </AdminFormField>

          <AdminFormField
            id="monthly"
            label="Monthly Price"
            floatingLabel
            animate
            tooltip="Monthly subscription price (optional)"
          >
            <Input 
              id="monthly"
              value={formData.price.monthly} 
              onChange={(e) => setFormData({...formData, price: {...formData.price, monthly: e.target.value}})}
              placeholder="e.g., ₹4,500"
              variant="modern"
              icon={<DollarSign size={16} />}
            />
          </AdminFormField>

          <AdminFormField
            id="oneTime"
            label="One-time Price"
            floatingLabel
            animate
            tooltip="One-time service price (optional)"
          >
            <Input 
              id="oneTime"
              value={formData.price.oneTime} 
              onChange={(e) => setFormData({...formData, price: {...formData.price, oneTime: e.target.value}})}
              placeholder="e.g., ₹2,000"
              variant="modern"
              icon={<DollarSign size={16} />}
            />
          </AdminFormField>
        </div>

        <div className="mb-4">
          <AdminFormField
            id="features"
            label="Service Features"
            animate
            tooltip="Add key features and benefits of this service"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="py-1 px-2 bg-rebuild-darkgray/50 flex items-center gap-1"
                  >
                    {feature}
                    <button 
                      onClick={() => removeFeature(feature)}
                      className="ml-1 text-gray-400 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button 
                  type="button" 
                  onClick={addFeature}
                  variant="outline"
                  size="sm"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </AdminFormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <AdminFormField
            id="isPopular"
            label=""
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
                <Star size={16} className="mr-2 text-rebuild-yellow" />
                Mark as Popular Service
              </label>
            </div>
          </AdminFormField>

          <AdminFormField
            id="isActive"
            label=""
            animate
          >
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked as boolean})}
                className="data-[state=checked]:bg-rebuild-yellow data-[state=checked]:border-rebuild-yellow"
              />
              <label htmlFor="isActive" className="text-sm font-medium flex items-center">
                <Settings size={16} className="mr-2 text-green-400" />
                Service is Active
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
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {isAdding ? 'Create Service' : 'Update Service'}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return <LoadingState message="Loading add-on services..." />;
  }

  return (
    <AdminLayout 
      title="Add-on Services"
      description="Manage additional services that customers can add to their membership"
      actions={
        <div className="flex items-center gap-2 xs:gap-3">
          {/* View Mode Toggle - Hidden on Mobile */}
          {filteredServices.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-rebuild-darkgray rounded-lg p-1 border border-gray-700">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-7 w-7 p-0 addon-view-mode-button",
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
                  "h-7 w-7 p-0 addon-view-mode-button",
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
            <span className="hidden xs:inline">Add New Service</span>
            <span className="xs:hidden">Add Service</span>
          </Button>
        </div>
      }
      isLoading={loading}
    >

      {(isAdding || editing) && renderForm()}

      {!isAdding && !editing && (
        <>
          {/* Search and Filter Controls - Responsive */}
          {services.length > 0 && (
            <div className="mb-4 xs:mb-6 space-y-3 xs:space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 addon-search-icon" />
                <Input
                  placeholder="Search services, descriptions, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 xs:h-10 addon-search-input"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full xs:w-[150px] h-8 xs:h-10 text-xs xs:text-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full xs:w-[120px] h-8 xs:h-10 text-xs xs:text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Grid View - Always visible on mobile, toggleable on desktop */}
          {filteredServices.length > 0 && (
            <div className={cn(
              "block addon-grid-container",
              "sm:block", // Always show on mobile and small screens
              viewMode === 'grid' ? "sm:block" : "sm:hidden" // Toggle on larger screens
            )}>
              <div className={cn(
                "grid gap-3 xs:gap-6 addon-card-grid",
                "grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}>
                {filteredServices.map((service) => (
                  <AdminAddOnServiceCard
                    key={service.id}
                    service={service}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    disabled={editing !== null || isAdding}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Table View - Hidden on mobile, toggleable on desktop */}
          {filteredServices.length > 0 && (
            <div className={cn(
              "hidden addon-table-container",
              viewMode === 'table' ? "sm:block" : "sm:hidden"
            )}>
              <DraggableTable
                items={filteredServices}
                onReorder={(reorderedItems) => handleReorder(reorderedItems as AddOnService[])}
                headers={['Service Name', 'Category', 'Pricing', 'Features', 'Status', 'Actions']}
                disabled={editing !== null || isAdding}
                className="rounded-lg overflow-hidden border border-gray-700 bg-rebuild-darkgray"
                renderRow={(item, isDragging) => {
                  const service = item as AddOnService;
                  const pricing = [
                    service.price.perSession && `₹${service.price.perSession}/session`,
                    service.price.monthly && `₹${service.price.monthly}/month`,
                    service.price.oneTime && `₹${service.price.oneTime} one-time`
                  ].filter(Boolean);

                  return [
                    <AdminTableCell key="name" className="font-medium addon-table-cell">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(service.category)}
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-400 truncate max-w-[200px]">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </AdminTableCell>,
                    <AdminTableCell key="category" className="capitalize addon-table-cell">
                      <Badge variant="outline" className="capitalize">
                        {service.category}
                      </Badge>
                    </AdminTableCell>,
                    <AdminTableCell key="pricing" className="addon-table-cell hidden sm:table-cell">
                      <div className="space-y-1">
                        {pricing.length > 0 ? (
                          pricing.map((price, index) => (
                            <div key={index} className="text-sm text-rebuild-yellow">
                              {price}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No pricing set</span>
                        )}
                      </div>
                    </AdminTableCell>,
                    <AdminTableCell key="features" className="addon-table-cell hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {service.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </AdminTableCell>,
                    <AdminTableCell key="status" className="addon-table-cell">
                      <div className="flex items-center gap-2">
                        <Badge variant={service.isActive ? 'default' : 'destructive'}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {service.isPopular && (
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        )}
                      </div>
                    </AdminTableCell>,
                    <AdminTableCell key="actions" className="addon-table-cell">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(service)}
                          disabled={editing !== null || isAdding}
                          className="hover:bg-rebuild-yellow/10 hover:text-rebuild-yellow border-gray-600"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(service.id!)}
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
        </>
      )}

      {services.length === 0 && !isAdding && (
        <motion.div 
          className="text-center py-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rebuild-yellow/10 mb-4">
            <Users size={32} className="text-rebuild-yellow" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Add-on Services</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            You haven't created any add-on services yet. Add services like personal training, nutrition plans, or wellness programs.
          </p>
          <Button 
            onClick={startAdding} 
            className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500 flex items-center gap-2"
          >
            <Plus size={16} /> Create Your First Service
          </Button>
        </motion.div>
      )}

    </AdminLayout>
  );
};

export default AdminAddOnServices;
