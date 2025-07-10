import React, { ReactNode } from 'react';
import {
  Table as ShadcnTable,
  TableHeader as ShadcnTableHeader,
  TableBody as ShadcnTableBody,
  TableRow as ShadcnTableRow,
  TableHead as ShadcnTableHead,
  TableCell as ShadcnTableCell,
  TableFooter as ShadcnTableFooter
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AdminTableProps {
  children: ReactNode;
  className?: string;
}

const AdminTable = ({ children, className }: AdminTableProps) => {
  return (
    <div className={cn('w-full overflow-x-auto border border-gray-700 rounded-md', className)}>
      <div className="min-w-full">
        <ShadcnTable className="w-full">
          {children}
        </ShadcnTable>
      </div>
    </div>
  );
};

const TableHeader = ShadcnTableHeader;
const TableBody = ShadcnTableBody;
const TableFooter = ShadcnTableFooter;

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
}

const TableHead = ({ children, className, ...props }: TableHeadProps) => {
  return (
    <ShadcnTableHead 
      className={cn('bg-rebuild-darkgray text-white font-medium text-xs sm:text-sm whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </ShadcnTableHead>
  );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  className?: string;
}

const TableCell = ({ children, className, ...props }: TableCellProps) => {
  return (
    <ShadcnTableCell className={cn('text-xs sm:text-sm p-2 sm:p-3', className)} {...props}>
      {children}
    </ShadcnTableCell>
  );
};

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
  isHighlighted?: boolean;
}

const TableRow = ({ children, className, isHighlighted, ...props }: TableRowProps) => {
  return (
    <ShadcnTableRow 
      className={cn(
        'border-b border-gray-700 hover:bg-rebuild-darkgray/50 transition-colors',
        isHighlighted && 'bg-rebuild-yellow/10',
        className
      )} 
      {...props}
    >
      {children}
    </ShadcnTableRow>
  );
};

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <Card className="py-8 flex flex-col items-center justify-center text-center bg-rebuild-darkgray border-gray-700">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 max-w-md mb-4">{description}</p>}
      {action}
    </Card>
  );
};

const LoadingState = ({ message = 'Loading data...' }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-rebuild-yellow mr-2" />
      <span className="text-gray-400">{message}</span>
    </div>
  );
};

export { 
  AdminTable, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableCell, 
  TableRow,
  TableFooter,
  EmptyState,
  LoadingState
};
