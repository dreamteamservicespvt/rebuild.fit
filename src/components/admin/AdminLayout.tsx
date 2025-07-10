import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, ArrowLeft, RefreshCw, MoreVertical } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
  statusText?: string;
  actions?: ReactNode;
  isLoading?: boolean;
  backAction?: () => void;
  refreshAction?: () => void;
  breadcrumbs?: Array<{
    label: string;
    onClick?: () => void;
  }>;
  menuActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
  }>;
}

const statusStyles = cva("", {
  variants: {
    status: {
      default: "bg-gray-700 text-white",
      success: "bg-green-600/20 text-green-500 border border-green-600/30",
      warning: "bg-yellow-600/20 text-yellow-500 border border-yellow-600/30",
      error: "bg-red-600/20 text-red-500 border border-red-600/30",
      info: "bg-blue-600/20 text-blue-500 border border-blue-600/30",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

const StatusIcon = ({ status }: { status: AdminLayoutProps['status'] }) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  description,
  status,
  statusText,
  actions,
  isLoading,
  backAction,
  refreshAction,
  breadcrumbs,
  menuActions,
}) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="mx-1">/</span>}
                {crumb.onClick ? (
                  <button 
                    onClick={crumb.onClick}
                    className="hover:text-rebuild-yellow transition-colors font-medium"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? "text-rebuild-yellow" : ""}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            {backAction && (
              <Button
                variant="ghost"
                size="icon"
                onClick={backAction}
                className="mr-2 rounded-full h-8 w-8 text-gray-400 hover:text-rebuild-yellow hover:bg-rebuild-yellow/10"
              >
                <ArrowLeft size={18} />
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              {description && (
                <p className="text-muted-foreground mt-1.5 text-gray-400">{description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {status && statusText && (
              <Badge variant="outline" className={cn("py-1.5 px-3", statusStyles({ status }))}>
                {status !== 'default' && (
                  <span className="mr-1.5 flex items-center">
                    <StatusIcon status={status} />
                  </span>
                )}
                <span>{statusText}</span>
              </Badge>
            )}
            
            {refreshAction && (
              <Button
                variant="outline"
                size="icon"
                onClick={refreshAction}
                className="h-9 w-9 rounded-full"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </Button>
            )}
            
            {menuActions && menuActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-full ml-1"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-rebuild-darkgray border-gray-700">
                  {menuActions.map((action, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <DropdownMenuSeparator className="bg-gray-700" />}
                      <DropdownMenuItem
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          action.variant === "destructive" && "text-red-500 focus:text-red-500"
                        )}
                      >
                        {action.icon && <span>{action.icon}</span>}
                        <span>{action.label}</span>
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      </div>

      <Card className={cn(
        "bg-rebuild-darkgray border-gray-700 overflow-hidden",
        "shadow-lg shadow-black/10"
      )}>
        <CardContent className={cn(
          "p-3 xs:p-4 sm:p-6 transition-opacity duration-300 relative min-h-[100px]",
          isLoading ? "opacity-60" : "opacity-100"
        )}>
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-rebuild-black/30 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full border-3 border-rebuild-yellow border-t-transparent animate-spin" />
                  <span className="text-sm text-gray-300 animate-pulse">Loading...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminLayout;
