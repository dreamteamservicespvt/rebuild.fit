import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * FormSection provides a consistent layout and styling for form sections across admin pages
 * It wraps form fields in a card with a standardized header and animation capabilities
 */
const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  className,
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
    >
      <Card className="bg-rebuild-darkgray border-gray-700 shadow-lg">
        <CardHeader 
          className={cn(
            "space-y-1 pb-2 xs:pb-3 sm:pb-3 px-2 xs:px-3 sm:px-4 md:px-6 pt-2 xs:pt-3 sm:pt-4 md:pt-6",
            collapsible && "cursor-pointer hover:bg-gray-800/50 transition-colors"
          )}
          onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <CardTitle className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-white">
            {icon && (
              <div className="flex-shrink-0 p-1 xs:p-1.5 sm:p-2 bg-rebuild-yellow/10 rounded-lg">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-white">{title}</h3>
              {description && (
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5 xs:mt-1 leading-relaxed">{description}</p>
              )}
            </div>
            {collapsible && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>
        
        {(!collapsible || isExpanded) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : { opacity: 1 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="px-2 xs:px-3 sm:px-4 md:px-6 pb-2 xs:pb-3 sm:pb-4 md:pb-6 pt-0 space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6">
              {children}
            </CardContent>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default FormSection;
