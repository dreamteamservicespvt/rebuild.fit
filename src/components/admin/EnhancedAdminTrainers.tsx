import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit2, Trash2, Plus, Eye, Star, Users2, Search, Filter, ArrowLeft } from 'lucide-react';
import { enhancedTrainersService, type TrainerProfile } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import { AdminTable, TableHeader, TableBody, TableHead, TableCell, TableRow, EmptyState, LoadingState } from './AdminTable';
import ResponsiveImage from '@/components/ResponsiveImage';
import { DraggableTable } from './DraggableTable';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import TrainerProfileEditor from './TrainerProfileEditor';

const EnhancedAdminTrainers = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'featured' | 'accepting' | 'not-accepting'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  useEffect(() => {
    const unsubscribe = enhancedTrainersService.onSnapshot((trainersList) => {
      setTrainers(trainersList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Filter trainers based on search and status
  useEffect(() => {
    let result = [...trainers];

    // Apply search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(trainer => 
        trainer.name?.toLowerCase().includes(searchTermLower) ||
        trainer.role?.toLowerCase().includes(searchTermLower) ||
        trainer.specializations?.some(spec => spec.toLowerCase().includes(searchTermLower))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'featured':
          result = result.filter(trainer => trainer.featuredFlag);
          break;
        case 'accepting':
          result = result.filter(trainer => trainer.acceptingNewClientsFlag);
          break;
        case 'not-accepting':
          result = result.filter(trainer => !trainer.acceptingNewClientsFlag);
          break;
      }
    }

    setFilteredTrainers(result);
  }, [searchTerm, statusFilter, trainers]);

  const handleEdit = (trainerId: string) => {
    navigate(`/admin/trainers/${trainerId}/edit`);
  };

  const handleAdd = () => {
    navigate('/admin/trainers/new');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trainer profile?')) {
      return;
    }

    try {
      await enhancedTrainersService.delete(id);
      toast.success('Trainer profile deleted successfully');
    } catch (error) {
      toast.error('Failed to delete trainer profile');
    }
  };

  const handleReorder = async (reorderedTrainers: TrainerProfile[]) => {
    try {
      setTrainers(reorderedTrainers);
      await enhancedTrainersService.updateOrder(reorderedTrainers.map((trainer, index) => ({
        ...trainer,
        id: trainer.id!,
        order: index
      })));
      toast.success('Trainer order updated');
    } catch (error) {
      toast.error('Failed to update trainer order');
    }
  };

  const handleSave = (trainer: TrainerProfile) => {
    navigate('/admin/trainers');
    toast.success('Trainer profile saved successfully');
  };

  const handleCancel = () => {
    navigate('/admin/trainers');
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <TrainersListView 
          trainers={trainers}
          filteredTrainers={filteredTrainers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      } />
      <Route path="/new" element={
        <TrainerEditorView 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      } />
      <Route path="/:trainerId/edit" element={
        <TrainerEditorView 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      } />
    </Routes>
  );
};

// Trainer Editor View Component
const TrainerEditorView: React.FC<{
  onSave: (trainer: TrainerProfile) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
        <div className="flex items-center space-x-3 xs:space-x-4 min-w-0">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/trainers')}
            className="text-gray-400 hover:text-white p-2 xs:p-3 h-auto flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 xs:mr-2" />
            <span className="hidden xs:inline">Back to Trainers</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl xs:text-2xl font-bold text-white truncate">
              {trainerId ? 'Edit Trainer Profile' : 'Add New Trainer'}
            </h1>
            <p className="text-sm xs:text-base text-gray-400 hidden xs:block">
              Create comprehensive trainer profiles with multimedia content
            </p>
          </div>
        </div>
      </div>
      
      <TrainerProfileEditor
        trainerId={trainerId}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};

// Trainers List View Component
interface TrainersListViewProps {
  trainers: TrainerProfile[];
  filteredTrainers: TrainerProfile[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'featured' | 'accepting' | 'not-accepting';
  setStatusFilter: (filter: 'all' | 'featured' | 'accepting' | 'not-accepting') => void;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
  onEdit: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => Promise<void>;
  onReorder: (reorderedTrainers: TrainerProfile[]) => Promise<void>;
}

const TrainersListView: React.FC<TrainersListViewProps> = ({
  trainers,
  filteredTrainers,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  onEdit,
  onAdd,
  onDelete,
  onReorder
}) => {
  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 xs:gap-4">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-white">Trainer Profiles</h1>
          <p className="text-sm xs:text-base text-gray-400">Manage trainer profiles with multimedia content</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 w-full md:w-auto">
          <Button
            onClick={onAdd}
            className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 text-sm xs:text-base px-3 xs:px-4 py-2 xs:py-2 h-auto xs:h-10"
          >
            <Plus className="w-3 xs:w-4 h-3 xs:h-4 mr-1 xs:mr-2" />
            Add New Trainer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-rebuild-darkgray border-gray-700">
        <CardContent className="p-3 xs:p-4">
          <div className="flex flex-col gap-3 xs:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 xs:left-3 top-1/2 transform -translate-y-1/2 h-3 xs:h-4 w-3 xs:w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search trainers..."
                className="pl-8 xs:pl-10 bg-rebuild-black border-gray-600 text-white text-sm xs:text-base h-8 xs:h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-1 xs:gap-2">
              {['all', 'featured', 'accepting', 'not-accepting'].map((filter) => (
                <Button
                  key={filter}
                  variant={statusFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(filter as any)}
                  className={cn(
                    'text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 h-auto xs:h-8 min-w-0 flex-shrink-0',
                    statusFilter === filter 
                      ? 'bg-rebuild-yellow text-rebuild-black' 
                      : 'border-gray-600 text-white hover:bg-gray-800'
                  )}
                >
                  {filter === 'all' ? 'All' : 
                   filter === 'featured' ? 'Featured' :
                   filter === 'accepting' ? 'Accepting' : 'Not Accepting'}
                </Button>
              ))}
            </div>

            <div className="flex gap-1 xs:gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={cn(
                  'text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 h-auto xs:h-8 flex-1',
                  viewMode === 'cards' 
                    ? 'bg-rebuild-yellow text-rebuild-black' 
                    : 'border-gray-600 text-white hover:bg-gray-800'
                )}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  'text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 h-auto xs:h-8 flex-1',
                  viewMode === 'table' 
                    ? 'bg-rebuild-yellow text-rebuild-black' 
                    : 'border-gray-600 text-white hover:bg-gray-800'
                )}
              >
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-4">
        <Card className="bg-rebuild-darkgray border-gray-700">
          <CardContent className="p-2 xs:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs xs:text-sm text-gray-400 truncate">Total Trainers</p>
                <p className="text-lg xs:text-2xl font-bold text-white">{trainers.length}</p>
              </div>
              <Users2 className="w-5 xs:w-8 h-5 xs:h-8 text-rebuild-yellow flex-shrink-0 ml-1 xs:ml-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rebuild-darkgray border-gray-700">
          <CardContent className="p-2 xs:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs xs:text-sm text-gray-400 truncate">Featured</p>
                <p className="text-lg xs:text-2xl font-bold text-white">
                  {trainers.filter(t => t.featuredFlag).length}
                </p>
              </div>
              <Star className="w-5 xs:w-8 h-5 xs:h-8 text-yellow-500 flex-shrink-0 ml-1 xs:ml-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rebuild-darkgray border-gray-700">
          <CardContent className="p-2 xs:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs xs:text-sm text-gray-400 truncate">Accepting</p>
                <p className="text-lg xs:text-2xl font-bold text-white">
                  {trainers.filter(t => t.acceptingNewClientsFlag).length}
                </p>
              </div>
              <div className="w-5 xs:w-8 h-5 xs:h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 ml-1 xs:ml-0">
                <div className="w-2 xs:w-4 h-2 xs:h-4 rounded-full bg-white"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rebuild-darkgray border-gray-700">
          <CardContent className="p-2 xs:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs xs:text-sm text-gray-400 truncate">Avg Exp</p>
                <p className="text-lg xs:text-2xl font-bold text-white">
                  {trainers.length > 0 
                    ? Math.round(trainers.reduce((sum, t) => sum + (t.experienceYears || 0), 0) / trainers.length)
                    : 0}y
                </p>
              </div>
              <div className="w-5 xs:w-8 h-5 xs:h-8 rounded bg-rebuild-yellow flex items-center justify-center flex-shrink-0 ml-1 xs:ml-0">
                <span className="text-xs xs:text-xs font-bold text-rebuild-black">YR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {filteredTrainers.length === 0 ? (
        <EmptyState
          title="No trainers found"
          description="Get started by adding your first trainer profile"
          action={
            <Button
              onClick={onAdd}
              className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Trainer
            </Button>
          }
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-6">
          {filteredTrainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TrainerCard trainer={trainer} onEdit={onEdit} onDelete={onDelete} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-rebuild-darkgray border-gray-700">
          <CardContent className="p-0">
            <AdminTable>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] xs:w-auto">Trainer</TableHead>
                  <TableHead className="hidden xs:table-cell">Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Experience</TableHead>
                  <TableHead className="w-[30%] xs:w-auto">Status</TableHead>
                  <TableHead className="w-[30%] xs:w-auto text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainers.map((trainer) => (
                  <TableRow key={trainer.id}>
                    <TableCell className="p-2 xs:p-3">
                      <div className="flex items-center space-x-2 xs:space-x-3 min-w-0">
                        <div className="w-8 xs:w-10 h-8 xs:h-10 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                          {trainer.profileImage && (
                            <ResponsiveImage
                              src={trainer.profileImage}
                              alt={trainer.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white text-xs xs:text-sm truncate">{trainer.name}</div>
                          <div className="text-xs text-gray-400 truncate xs:hidden">{trainer.role}</div>
                          <div className="text-xs text-gray-400 truncate">@{trainer.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs xs:text-sm hidden xs:table-cell">{trainer.role}</TableCell>
                    <TableCell className="text-gray-300 text-xs xs:text-sm hidden sm:table-cell">
                      {trainer.experienceYears}y
                    </TableCell>
                    <TableCell className="p-2 xs:p-3">
                      <div className="flex flex-col xs:flex-row xs:items-center space-y-1 xs:space-y-0 xs:space-x-2">
                        {trainer.featuredFlag && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs px-1 py-0">
                            <Star className="w-2 h-2 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge
                          className={cn(
                            'text-xs px-1 py-0',
                            trainer.acceptingNewClientsFlag
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          )}
                        >
                          {trainer.acceptingNewClientsFlag ? 'Open' : 'Full'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 xs:p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(trainer.id!)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-1 xs:p-2 h-auto min-w-0"
                        >
                          <Edit2 className="w-3 xs:w-4 h-3 xs:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(trainer.id!)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 xs:p-2 h-auto min-w-0"
                        >
                          <Trash2 className="w-3 xs:w-4 h-3 xs:h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </AdminTable>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Enhanced Trainer Card Component
const TrainerCard: React.FC<{
  trainer: TrainerProfile;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ trainer, onEdit, onDelete }) => {
  return (
    <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow/50 transition-all duration-300 group">
      <CardHeader className="pb-2 xs:pb-3 p-3 xs:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 xs:space-x-3 min-w-0 flex-1">
            <div className="w-10 xs:w-12 h-10 xs:h-12 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
              {trainer.profileImage && (
                <ResponsiveImage
                  src={trainer.profileImage}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-white text-base xs:text-lg group-hover:text-rebuild-yellow transition-colors truncate">
                {trainer.name}
              </CardTitle>
              <p className="text-xs xs:text-sm text-gray-400 truncate">{trainer.role}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            {trainer.featuredFlag && (
              <Star className="w-3 xs:w-4 h-3 xs:h-4 text-yellow-500 fill-current" />
            )}
            <div className={cn(
              'w-2 xs:w-3 h-2 xs:h-3 rounded-full',
              trainer.acceptingNewClientsFlag ? 'bg-green-500' : 'bg-red-500'
            )} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 xs:space-y-4 p-3 xs:p-6 pt-0">
        <div>
          <p className="text-xs xs:text-sm text-gray-300 line-clamp-2">
            {trainer.bioShort || 'No biography provided'}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs xs:text-sm text-gray-400">
          <span className="truncate">{trainer.experienceYears} years exp.</span>
          <span className="truncate">{trainer.specializations?.length || 0} specializations</span>
        </div>
        
        {trainer.specializations && trainer.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {trainer.specializations.slice(0, 3).map((spec, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-rebuild-yellow/20 text-rebuild-yellow border-rebuild-yellow/30 px-1 xs:px-2 py-0.5 xs:py-1 truncate max-w-full"
              >
                {spec}
              </Badge>
            ))}
            {trainer.specializations.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300 px-1 xs:px-2 py-0.5 xs:py-1">
                +{trainer.specializations.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 xs:pt-3 border-t border-gray-600">
          <Badge
            className={cn(
              'text-xs px-1 xs:px-2 py-0.5 xs:py-1 truncate max-w-[60%]',
              trainer.acceptingNewClientsFlag
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            )}
          >
            {trainer.acceptingNewClientsFlag ? 'Accepting' : 'Full'}
          </Badge>
          
          <div className="flex items-center space-x-1 xs:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(trainer.id!)}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-1 xs:p-2 h-auto min-w-0"
            >
              <Edit2 className="w-3 xs:w-4 h-3 xs:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(trainer.id!)}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 xs:p-2 h-auto min-w-0"
            >
              <Trash2 className="w-3 xs:w-4 h-3 xs:h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAdminTrainers;
