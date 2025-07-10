import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Settings, Eye, EyeOff, Award, Star } from 'lucide-react';
import { dropdownOptionsService, type DropdownOptions } from '@/lib/dropdownOptionsService';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

export const DropdownOptionsManager: React.FC = () => {
  const [options, setOptions] = useState<DropdownOptions>({
    roles: [],
    experiences: [],
    specializations: []
  });
  const [isOpen, setIsOpen] = useState(false);
  const [newOption, setNewOption] = useState({ roles: '', experiences: '', specializations: '' });
  const [loading, setLoading] = useState({ roles: false, experiences: false, specializations: false });

  useEffect(() => {
    const unsubscribe = dropdownOptionsService.onSnapshot((newOptions) => {
      setOptions(newOptions);
    });

    return unsubscribe;
  }, []);

  const handleAddOption = async (type: 'roles' | 'experiences' | 'specializations', value: string) => {
    if (!value.trim()) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      switch (type) {
        case 'roles':
          await dropdownOptionsService.addRole(value.trim());
          break;
        case 'experiences':
          await dropdownOptionsService.addExperience(value.trim());
          break;
        case 'specializations':
          await dropdownOptionsService.addSpecialization(value.trim());
          break;
      }
      setNewOption(prev => ({ ...prev, [type]: '' }));
      toast.success('Success', `New ${type.slice(0, -1)} option added successfully`);
    } catch (error) {
      toast.error('Error', `Failed to add new ${type.slice(0, -1)} option`);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleRemoveOption = async (type: 'roles' | 'experiences' | 'specializations', value: string) => {
    try {
      switch (type) {
        case 'roles':
          await dropdownOptionsService.removeRole(value);
          break;
        case 'experiences':
          await dropdownOptionsService.removeExperience(value);
          break;
        case 'specializations':
          await dropdownOptionsService.removeSpecialization(value);
          break;
      }
      toast.success('Success', `${type.slice(0, -1)} option removed successfully`);
    } catch (error) {
      toast.error('Error', `Failed to remove ${type.slice(0, -1)} option`);
    }
  };

  const renderOptionSection = (type: 'roles' | 'experiences' | 'specializations', title: string, icon: React.ReactNode) => {
    const typeOptions = options[type] as string[];
    
    return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-medium text-white">{title}</h4>
        <Badge variant="secondary" className="ml-auto">
          {typeOptions.length}
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newOption[type]}
          onChange={(e) => setNewOption(prev => ({ ...prev, [type]: e.target.value }))}
          placeholder={`Add new ${title.toLowerCase()}`}
          className="flex-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddOption(type, newOption[type]);
            }
          }}
        />
        <Button
          size="sm"
          onClick={() => handleAddOption(type, newOption[type])}
          disabled={!newOption[type].trim() || loading[type]}
          className="px-3"
        >
          {loading[type] ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
          ) : (
            <Plus size={14} />
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {typeOptions.map((option) => (
          <Badge
            key={option}
            variant="outline"
            className="group hover:bg-destructive/10 hover:border-destructive transition-colors"
          >
            <span className="mr-2">{option}</span>
            <button
              onClick={() => handleRemoveOption(type, option)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
            >
              <Trash2 size={12} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )};

  return (
    <Card className="border-gray-700 bg-rebuild-darkgray/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings size={20} />
              Dropdown Options Manager
            </CardTitle>
            <CardDescription>
              Manage the available options for trainer dropdowns
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white"
          >
            {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
            {isOpen ? 'Hide' : 'Show'}
          </Button>
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-6">
          {renderOptionSection('roles', 'Roles', <Settings size={16} className="text-blue-400" />)}
          {renderOptionSection('experiences', 'Experience Levels', <Award size={16} className="text-green-400" />)}
          {renderOptionSection('specializations', 'Specializations', <Star size={16} className="text-yellow-400" />)}
        </CardContent>
      )}
    </Card>
  );
};
