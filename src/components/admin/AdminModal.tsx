import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  hideCloseX?: boolean;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  showCloseButton = false,
  hideCloseX = false
}) => {
  // Define size classes
  const sizeClasses = {
    sm: 'max-w-[90vw] sm:max-w-[425px]',
    md: 'max-w-[95vw] sm:max-w-[600px]',
    lg: 'max-w-[95vw] sm:max-w-[800px]',
    xl: 'max-w-[95vw] sm:max-w-[1000px]',
    full: 'max-w-[98vw] sm:max-w-[95vw] max-h-[95vh] sm:max-h-[90vh]'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          'bg-rebuild-darkgray text-white border-gray-700 mx-2 sm:mx-4',
          sizeClasses[size],
          size === 'full' && 'h-[90vh] sm:h-[90vh] flex flex-col',
          className
        )}
      >
        {!hideCloseX && (
          <button 
            className="absolute right-3 sm:right-4 top-3 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        
        <DialogHeader className="px-2 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl pr-8">{title}</DialogTitle>
          {description && <DialogDescription className="text-sm sm:text-base">{description}</DialogDescription>}
        </DialogHeader>
        
        <div className={cn('py-3 sm:py-4 px-2 sm:px-0', size === 'full' && 'flex-grow overflow-auto')}>
          {children}
        </div>
        
        {(footer || showCloseButton) && (
          <DialogFooter className="flex justify-end gap-2 px-2 sm:px-0 pb-2 sm:pb-0">
            {footer || (
              <Button variant="outline" onClick={onClose} className="text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6">
                Close
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;
