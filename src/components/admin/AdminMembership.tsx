import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Membership {
  id: string;
  name: string;
  price: {
    monthly: string;
    quarterly: string;
    halfyearly: string;
    annual: string;
  };
  type: string;
  features: string[];
  isPopular: boolean;
}

const INITIAL_MEMBERSHIPS: Membership[] = [
  {
    id: '1',
    name: 'STRENGTHENING',
    price: {
      monthly: '₹1,999',
      quarterly: '₹5,499',
      halfyearly: '₹7,499',
      annual: '₹11,999'
    },
    type: 'premium',
    features: ['Access to strength equipment', 'Gym access (6 AM - 10 PM)', 'Locker access', 'Basic strength training guidance'],
    isPopular: false
  },
  {
    id: '2',
    name: 'CARDIO + STRENGTHENING',
    price: {
      monthly: '₹2,499',
      quarterly: '₹6,499',
      halfyearly: '₹8,999',
      annual: '₹14,999'
    },
    type: 'premium',
    features: ['Full access to cardio section', 'All strength equipment access', 'Extended hours access', 'Locker & towel service', 'Comprehensive fitness guidance'],
    isPopular: true
  },
  {
    id: '3',
    name: 'STRENGTHENING',
    price: {
      monthly: '₹999',
      quarterly: '₹2,799',
      halfyearly: '₹4,999',
      annual: '₹8,999'
    },
    type: 'student',
    features: ['Access to strength equipment', 'Student gym access', 'Off-peak hours only'],
    isPopular: false
  }
];

const AdminMembership = () => {
  const [memberships, setMemberships] = useState<Membership[]>(INITIAL_MEMBERSHIPS);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeDuration, setActiveDuration] = useState<'monthly' | 'quarterly' | 'halfyearly' | 'annual'>('monthly');
  
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
  
  const { toast } = useToast();

  const handleEdit = (membership: Membership) => {
    setEditing(membership.id);
    setFormData({
      name: membership.name,
      price: {...membership.price},
      type: membership.type,
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
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Membership Plans</h2>
        <Button onClick={startAdding} className="flex items-center gap-2">
          <Plus size={16} /> Add New Plan
        </Button>
      </div>

      {/* Duration Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-rebuild-darkgray p-1 rounded-md inline-flex">
          <button 
            className={`px-3 py-1 rounded ${activeDuration === 'monthly' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-gray-300'}`}
            onClick={() => setActiveDuration('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeDuration === 'quarterly' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-gray-300'}`}
            onClick={() => setActiveDuration('quarterly')}
          >
            Quarterly
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeDuration === 'halfyearly' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-gray-300'}`}
            onClick={() => setActiveDuration('halfyearly')}
          >
            Half-yearly
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeDuration === 'annual' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-gray-300'}`}
            onClick={() => setActiveDuration('annual')}
          >
            Annual
          </button>
        </div>
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
              <label className="block text-sm font-medium mb-1">Type</label>
              <select 
                className="w-full bg-rebuild-black border border-gray-700 rounded-md px-3 py-2 text-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="premium">Premium</option>
                <option value="women">Women's</option>
                <option value="student">Student</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Price</label>
              <Input 
                value={formData.price.monthly} 
                onChange={(e) => setFormData({
                  ...formData, 
                  price: {...formData.price, monthly: e.target.value}
                })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Quarterly Price</label>
              <Input 
                value={formData.price.quarterly} 
                onChange={(e) => setFormData({
                  ...formData, 
                  price: {...formData.price, quarterly: e.target.value}
                })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Half-yearly Price</label>
              <Input 
                value={formData.price.halfyearly} 
                onChange={(e) => setFormData({
                  ...formData, 
                  price: {...formData.price, halfyearly: e.target.value}
                })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Annual Price</label>
              <Input 
                value={formData.price.annual} 
                onChange={(e) => setFormData({
                  ...formData, 
                  price: {...formData.price, annual: e.target.value}
                })}
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
            <TableHead>Type</TableHead>
            <TableHead>Price ({activeDuration})</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map(membership => (
            <TableRow key={membership.id}>
              <TableCell className="font-medium">{membership.name}</TableCell>
              <TableCell className="capitalize">{membership.type}</TableCell>
              <TableCell>{membership.price[activeDuration]}</TableCell>
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
