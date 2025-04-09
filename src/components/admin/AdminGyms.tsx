
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Gym {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  features: string[];
}

const INITIAL_GYMS: Gym[] = [
  {
    id: '1',
    title: 'Premium Gym',
    description: 'Our flagship facility with state-of-the-art equipment',
    image: '/gym1.jpg',
    link: '/gyms/premium',
    features: ['Personal Training', 'Nutrition Guidance', 'AC', 'Showers']
  },
  {
    id: '2',
    title: 'Women-Only Gym',
    description: 'A safe and empowering space exclusively for women',
    image: '/gym2.jpg',
    link: '/gyms/women',
    features: ['Female Trainers', 'Specialized Equipment', 'Privacy']
  },
  {
    id: '3',
    title: 'Student Gym',
    description: 'Budget-friendly option perfect for students',
    image: '/gym3.jpg',
    link: '/gyms/student',
    features: ['Affordable', 'High Energy', 'Fully Equipped']
  }
];

const AdminGyms = () => {
  const [gyms, setGyms] = useState<Gym[]>(INITIAL_GYMS);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Gym, 'id'>>({
    title: '',
    description: '',
    image: '',
    link: '',
    features: []
  });
  
  const { toast } = useToast();

  const handleEdit = (gym: Gym) => {
    setEditing(gym.id);
    setFormData({
      title: gym.title,
      description: gym.description,
      image: gym.image,
      link: gym.link,
      features: [...gym.features]
    });
  };

  const handleDelete = (id: string) => {
    setGyms(gyms.filter(gym => gym.id !== id));
    toast({
      title: 'Gym deleted',
      description: 'Gym has been deleted successfully',
    });
  };

  const handleSave = () => {
    if (editing) {
      setGyms(gyms.map(gym => gym.id === editing ? { ...gym, ...formData } : gym));
      setEditing(null);
      toast({
        title: 'Gym updated',
        description: 'Gym information has been updated successfully',
      });
    } else if (isAdding) {
      const newGym = {
        id: Date.now().toString(),
        ...formData
      };
      setGyms([...gyms, newGym]);
      setIsAdding(false);
      toast({
        title: 'Gym added',
        description: 'New gym has been added successfully',
      });
    }
    
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      features: []
    });
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      features: []
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Gyms</h2>
        <Button onClick={startAdding} className="flex items-center gap-2">
          <Plus size={16} /> Add New Gym
        </Button>
      </div>

      {(isAdding || editing) && (
        <div className="bg-rebuild-darkgray p-6 rounded-lg mb-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">{isAdding ? 'Add New Gym' : 'Edit Gym'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input 
                value={formData.image} 
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Link</label>
              <Input 
                value={formData.link} 
                onChange={(e) => setFormData({...formData, link: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[100px]"
              />
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
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gyms.map(gym => (
            <TableRow key={gym.id}>
              <TableCell>
                <img src={gym.image} alt={gym.title} className="w-16 h-12 object-cover rounded" />
              </TableCell>
              <TableCell className="font-medium">{gym.title}</TableCell>
              <TableCell className="max-w-[300px] truncate">{gym.description}</TableCell>
              <TableCell>
                <ul className="list-disc list-inside">
                  {gym.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="text-sm">{feature}</li>
                  ))}
                  {gym.features.length > 2 && <li className="text-sm">+{gym.features.length - 2} more</li>}
                </ul>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(gym)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(gym.id)}>
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

export default AdminGyms;
