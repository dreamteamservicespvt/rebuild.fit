
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Membership {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  isPopular: boolean;
}

const INITIAL_MEMBERSHIPS: Membership[] = [
  {
    id: '1',
    name: 'Basic',
    price: '₹1,500',
    duration: 'Monthly',
    features: ['Access to gym equipment', '24/7 access', 'Locker included'],
    isPopular: false
  },
  {
    id: '2',
    name: 'Premium',
    price: '₹2,500',
    duration: 'Monthly',
    features: ['Access to gym equipment', '24/7 access', 'Personal training sessions', 'Nutrition consultation'],
    isPopular: true
  },
  {
    id: '3',
    name: 'Student',
    price: '₹1,000',
    duration: 'Monthly',
    features: ['Access to gym equipment', 'Limited hours access'],
    isPopular: false
  }
];

const AdminMembership = () => {
  const [memberships, setMemberships] = useState<Membership[]>(INITIAL_MEMBERSHIPS);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Membership, 'id'>>({
    name: '',
    price: '',
    duration: '',
    features: [],
    isPopular: false
  });
  
  const { toast } = useToast();

  const handleEdit = (membership: Membership) => {
    setEditing(membership.id);
    setFormData({
      name: membership.name,
      price: membership.price,
      duration: membership.duration,
      features: [...membership.features],
      isPopular: membership.isPopular
    });
  };

  const handleDelete = (id: string) => {
    setMemberships(memberships.filter(membership => membership.id !== id));
    toast({
      title: 'Membership plan deleted',
      description: 'Membership plan has been deleted successfully',
    });
  };

  const handleSave = () => {
    if (editing) {
      setMemberships(memberships.map(membership => 
        membership.id === editing ? { ...membership, ...formData } : membership
      ));
      setEditing(null);
      toast({
        title: 'Membership plan updated',
        description: 'Membership plan has been updated successfully',
      });
    } else if (isAdding) {
      const newMembership = {
        id: Date.now().toString(),
        ...formData
      };
      setMemberships([...memberships, newMembership]);
      setIsAdding(false);
      toast({
        title: 'Membership plan added',
        description: 'New membership plan has been added successfully',
      });
    }
    
    setFormData({
      name: '',
      price: '',
      duration: '',
      features: [],
      isPopular: false
    });
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
    setFormData({
      name: '',
      price: '',
      duration: '',
      features: [],
      isPopular: false
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Membership Plans</h2>
        <Button onClick={startAdding} className="flex items-center gap-2">
          <Plus size={16} /> Add New Plan
        </Button>
      </div>

      {(isAdding || editing) && (
        <div className="bg-rebuild-darkgray p-6 rounded-lg mb-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">{isAdding ? 'Add New Plan' : 'Edit Plan'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input 
                value={formData.duration} 
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isPopular" 
                checked={formData.isPopular} 
                onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                className="w-4 h-4"
              />
              <label htmlFor="isPopular" className="text-sm font-medium">Mark as Popular</label>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
              <Input 
                value={formData.features.join(', ')} 
                onChange={(e) => setFormData({
                  ...formData, 
                  features: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                })}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelEdit} className="flex items-center gap-2">
              <X size={16} /> Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map(membership => (
            <TableRow key={membership.id}>
              <TableCell className="font-medium">{membership.name}</TableCell>
              <TableCell>{membership.price}</TableCell>
              <TableCell>{membership.duration}</TableCell>
              <TableCell>
                <ul className="list-disc list-inside">
                  {membership.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="text-sm">{feature}</li>
                  ))}
                  {membership.features.length > 2 && <li className="text-sm">+{membership.features.length - 2} more</li>}
                </ul>
              </TableCell>
              <TableCell>
                {membership.isPopular ? (
                  <span className="bg-rebuild-yellow/20 text-rebuild-yellow px-2 py-1 rounded-full text-xs">
                    Popular
                  </span>
                ) : '–'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(membership)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(membership.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminMembership;
