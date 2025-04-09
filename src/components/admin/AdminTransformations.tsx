
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Transformation {
  id: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  goal: string;
  testimonial: string;
}

const INITIAL_TRANSFORMATIONS: Transformation[] = [
  {
    id: '1',
    name: 'John Doe',
    beforeImage: '/before1.jpg',
    afterImage: '/after1.jpg',
    duration: '6 months',
    goal: 'Weight Loss',
    testimonial: 'Rebuild Gym helped me lose 30kg in just 6 months without any supplements.'
  },
  {
    id: '2',
    name: 'Jane Smith',
    beforeImage: '/before2.jpg',
    afterImage: '/after2.jpg',
    duration: '8 months',
    goal: 'Muscle Gain',
    testimonial: 'I gained 15kg of lean muscle mass naturally at Rebuild Gym.'
  }
];

const AdminTransformations = () => {
  const [transformations, setTransformations] = useState<Transformation[]>(INITIAL_TRANSFORMATIONS);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Transformation, 'id'>>({
    name: '',
    beforeImage: '',
    afterImage: '',
    duration: '',
    goal: '',
    testimonial: ''
  });
  
  const { toast } = useToast();

  const handleEdit = (transformation: Transformation) => {
    setEditing(transformation.id);
    setFormData({
      name: transformation.name,
      beforeImage: transformation.beforeImage,
      afterImage: transformation.afterImage,
      duration: transformation.duration,
      goal: transformation.goal,
      testimonial: transformation.testimonial
    });
  };

  const handleDelete = (id: string) => {
    setTransformations(transformations.filter(item => item.id !== id));
    toast({
      title: 'Transformation deleted',
      description: 'Transformation story has been deleted successfully',
    });
  };

  const handleSave = () => {
    if (editing) {
      setTransformations(transformations.map(item => 
        item.id === editing ? { ...item, ...formData } : item
      ));
      setEditing(null);
      toast({
        title: 'Transformation updated',
        description: 'Transformation story has been updated successfully',
      });
    } else if (isAdding) {
      const newItem = {
        id: Date.now().toString(),
        ...formData
      };
      setTransformations([...transformations, newItem]);
      setIsAdding(false);
      toast({
        title: 'Transformation added',
        description: 'New transformation story has been added successfully',
      });
    }
    
    setFormData({
      name: '',
      beforeImage: '',
      afterImage: '',
      duration: '',
      goal: '',
      testimonial: ''
    });
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditing(null);
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
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Transformations</h2>
        <Button onClick={startAdding} className="flex items-center gap-2">
          <Plus size={16} /> Add New Transformation
        </Button>
      </div>

      {(isAdding || editing) && (
        <div className="bg-rebuild-darkgray p-6 rounded-lg mb-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">{isAdding ? 'Add New Transformation' : 'Edit Transformation'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input 
                value={formData.duration} 
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Before Image URL</label>
              <Input 
                value={formData.beforeImage} 
                onChange={(e) => setFormData({...formData, beforeImage: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">After Image URL</label>
              <Input 
                value={formData.afterImage} 
                onChange={(e) => setFormData({...formData, afterImage: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Goal</label>
              <Input 
                value={formData.goal} 
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Testimonial</label>
              <Textarea 
                value={formData.testimonial} 
                onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                className="min-h-[100px]"
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
            <TableHead>Before / After</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Testimonial</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transformations.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <img src={item.beforeImage} alt="Before" className="w-12 h-12 object-cover rounded" />
                  <img src={item.afterImage} alt="After" className="w-12 h-12 object-cover rounded" />
                </div>
              </TableCell>
              <TableCell>{item.goal}</TableCell>
              <TableCell>{item.duration}</TableCell>
              <TableCell className="max-w-[200px] truncate">{item.testimonial}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
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

export default AdminTransformations;
