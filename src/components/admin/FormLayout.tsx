import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormRowProps {
  children: ReactNode;
  className?: string;
}

/**
 * FormRow is a helper component for creating responsive form rows
 * It provides a standard grid layout with proper spacing for form fields
 */
export const FormRow: React.FC<FormRowProps> = ({ children, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {children}
    </div>
  );
};

interface FormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * FormGrid is a helper component for creating responsive form grids
 * It provides a standard grid layout with proper spacing for form fields
 * The columns prop allows for customization of the grid layout
 */
export const FormGrid: React.FC<FormGridProps> = ({ 
  children, 
  columns = 2,
  className 
}) => {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn(`grid ${colsClass[columns]} gap-6`, className)}>
      {children}
    </div>
  );
};

interface FormGroupProps {
  children: ReactNode;
  title?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * FormGroup is a helper component for grouping related form fields
 * It provides a standard layout with an optional title for the group
 */
export const FormGroup: React.FC<FormGroupProps> = ({ 
  children, 
  title,
  className,
  titleClassName
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className={cn("text-sm font-medium text-gray-200", titleClassName)}>
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default {
  Row: FormRow,
  Grid: FormGrid,
  Group: FormGroup
};
