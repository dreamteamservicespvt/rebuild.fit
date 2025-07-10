import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Eye, MoreHorizontal, SaveIcon, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  disabled?: boolean;
  className?: string;
  itemName?: string; // For delete confirmation dialog
  showDelete?: boolean;
  showEdit?: boolean;
  showView?: boolean;
  compact?: boolean;
  vertical?: boolean;
  customActions?: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  }[];
}

const AdminActions: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onView,
  disabled = false,
  className = '',
  itemName = 'this item',
  showDelete = true,
  showEdit = true,
  showView = false,
  compact = false,
  vertical = false,
  customActions = []
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // For small screens or many actions, use dropdown
  if (compact) {
    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button variant="outline" size="sm">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {showEdit && onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit2 size={14} className="mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {showView && onView && (
              <DropdownMenuItem onClick={onView}>
                <Eye size={14} className="mr-2" />
                View
              </DropdownMenuItem>
            )}
            {customActions.map((action, index) => (
              <DropdownMenuItem key={index} onClick={action.onClick}>
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </DropdownMenuItem>
            ))}
            {showDelete && onDelete && (
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Confirmation Dialog */}
        {showDelete && onDelete && (
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {itemName}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  }

  // Full action buttons
  return (
    <div className={cn(
      'flex items-center gap-2',
      vertical && 'flex-col items-stretch',
      className
    )}>
      {showEdit && onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEdit}
          disabled={disabled}
          className={vertical ? 'justify-start' : ''}
        >
          <Edit2 size={14} className={cn("text-blue-400", vertical ? "mr-2" : "")} />
          {vertical && <span>Edit</span>}
        </Button>
      )}
      
      {showView && onView && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onView}
          disabled={disabled}
          className={vertical ? 'justify-start' : ''}
        >
          <Eye size={14} className={cn("text-green-400", vertical ? "mr-2" : "")} />
          {vertical && <span>View</span>}
        </Button>
      )}
      
      {customActions.map((action, index) => (
        <Button 
          key={index}
          variant={action.variant || "outline"} 
          size="sm" 
          onClick={action.onClick}
          disabled={disabled}
          className={vertical ? 'justify-start' : ''}
        >
          {action.icon}
          {vertical && <span className="ml-2">{action.label}</span>}
        </Button>
      ))}
      
      {showDelete && onDelete && (
        <>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setDeleteDialogOpen(true)}
            disabled={disabled}
            className={vertical ? 'justify-start' : ''}
          >
            <Trash2 size={14} className={vertical ? "mr-2" : ""} />
            {vertical && <span>Delete</span>}
          </Button>
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {itemName}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

interface FormActionsProps {
  onSave?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
  saveText?: string;
  cancelText?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  isLoading = false,
  className = '',
  saveText = 'Save Changes',
  cancelText = 'Cancel'
}) => {
  return (
    <div className={cn('flex justify-end gap-2', className)}>
      {onCancel && (
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="gap-1"
        >
          <X size={16} />
          <span>{cancelText}</span>
        </Button>
      )}
      
      {onSave && (
        <Button 
          onClick={onSave} 
          disabled={isLoading}
          className="bg-rebuild-yellow hover:bg-yellow-500 text-rebuild-black gap-1"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-rebuild-black border-t-transparent animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <SaveIcon size={16} />
              <span>{saveText}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default AdminActions;
