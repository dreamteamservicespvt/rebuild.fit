
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Trainer {
  id: string;
  name: string;
  role: string;
  image: string;
  experience: string;
  specialization: string;
}

const INITIAL_TRAINERS: Trainer[] = [
  {
    id: '1',
    name: 'Alex Smith',
    role: 'Head Trainer',
    image: '/trainer1.jpg',
    experience: '8+ Years',
    specialization: 'Strength Training'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Nutrition Coach',
    image: '/trainer2.jpg',
    experience: '5+ Years',
    specialization: 'Weight Loss'
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Fitness Trainer',
    image: '/trainer3.jpg',
    experience: '7+ Years',
    specialization: 'Calisthenics'
  }
];

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Trainer, 'id'>>({
    name: '',
    role: '',
    image: '',
    experience: '',
    specialization: ''
  });
  
  const { toast } = useToast();

  const handleEdit = (trainer: Trainer) => {
    setEditing(trainer.id);
    setFormData({
      name: trainer.name,
      role: trainer.role,
      image: trainer.image,
      experience: trainer.experience,
      specialization: trainer.specialization
    });
  };

  const handleDelete = (id: string) => {
    setTrainers(trainers.filter(trainer => trainer.id !== id));
    toast({
      title: 'Trainer deleted',
      description: 'Trainer has been deleted successfully',
    });
  };

  const handleSave = () => {
    if (editing) {
      setTrainers(trainers.map(trainer => 
        trainer.id === editing ? { ...trainer, ...formData } : trainer
      ));
      setEditing(null);
      toast({
        title: 'Trainer updated',
        description: 'Trainer information has been updated successfully',
      });
    } else if (isAdding) {
      const newTrainer = {
        id: Date.now().toString(),
        ...formData
      };
      setTrainers([...trainers, newTrainer]);
      setIsAdding(false);
      toast({
        title: 'Trainer added',
        description: 'New trainer has been added successfully',
      });
    }
    
    setFormData({
      name: '',
      role: '',
      image: '',
      experience: '',
      specialization: ''
    });
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
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Trainers</h2>
        <Button onClick={startAdding} className="flex items-center gap-2">
          <Plus size={16} /> Add New Trainer
        </Button>
      </div>

      {(isAdding || editing) && (
        <div className="bg-rebuild-darkgray p-6 rounded-lg mb-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">{isAdding ? 'Add New Trainer' : 'Edit Trainer'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Input 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
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
              <label className="block text-sm font-medium mb-1">Experience</label>
              <Input 
                value={formData.experience} 
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <Input 
                value={formData.specialization} 
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
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
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainers.map(trainer => (
            <TableRow key={trainer.id}>
              <TableCell>
                <img src={trainer.image} alt={trainer.name} className="w-12 h-12 object-cover rounded-full" />
              </TableCell>
              <TableCell className="font-medium">{trainer.name}</TableCell>
              <TableCell>{trainer.role}</TableCell>
              <TableCell>{trainer.experience}</TableCell>
              <TableCell>{trainer.specialization}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(trainer)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(trainer.id)}>
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

export default AdminTrainers;
