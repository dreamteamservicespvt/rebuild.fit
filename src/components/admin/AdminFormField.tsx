import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle, HelpCircle, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface AdminFormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  description?: string;
  tooltip?: string;
  error?: string;
  required?: boolean;
  className?: string;
  floatingLabel?: boolean;
  success?: boolean;
  successMessage?: string;
  animate?: boolean;
  labelClassName?: string; // Added for more customization options
}

const AdminFormField: React.FC<AdminFormFieldProps> = ({
  id,
  label,
  children,
  description,
  tooltip,
  error,
  required = false,
  className,
  floatingLabel = false,
  success = false,
  successMessage,
  animate = true,
  labelClassName,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLElement | null>(null);

  // Detect if the field has a value (for floating label behavior)
  useEffect(() => {
    const inputEl = fieldRef.current?.querySelector('input, textarea, select');
    childRef.current = inputEl as HTMLElement;
    
    // Set initial value state
    if (inputEl) {
      const checkValue = () => {
        const value = (inputEl as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
        setHasValue(value !== '');
      };
      
      // Check initial value immediately
      checkValue();
      
      // Add event listeners to track focus and value changes
      const handleFocus = () => setIsFocused(true);
      const handleBlur = () => {
        setIsFocused(false);
        checkValue();
      };
      const handleChange = checkValue;
      
      inputEl.addEventListener('focus', handleFocus);
      inputEl.addEventListener('blur', handleBlur);
      inputEl.addEventListener('input', handleChange);
      
      // For select elements, also listen for change event
      if (inputEl.tagName.toLowerCase() === 'select') {
        inputEl.addEventListener('change', handleChange);
      }
      
      return () => {
        inputEl.removeEventListener('focus', handleFocus);
        inputEl.removeEventListener('blur', handleBlur);
        inputEl.removeEventListener('input', handleChange);
        if (inputEl.tagName.toLowerCase() === 'select') {
          inputEl.removeEventListener('change', handleChange);
        }
      };
    }
  }, [children]);

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component 
      {...animationProps}
      className={cn(
        'space-y-1 xs:space-y-1.5 sm:space-y-2 relative mb-2 xs:mb-3 sm:mb-4 md:mb-5',
        floatingLabel ? 'min-h-[50px] xs:min-h-[60px] sm:min-h-[70px] md:min-h-[80px]' : 'min-h-[40px] xs:min-h-[50px] sm:min-h-[60px] md:min-h-[70px]',
        className,
        isFocused && 'field-focused'
      )}
      ref={fieldRef}
    >
      <div className={cn(
        "flex items-center gap-1 xs:gap-1.5 sm:gap-2", 
        floatingLabel ? "h-0 z-10 relative" : "mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2"
      )}>
        <Label 
          htmlFor={id} 
          className={cn(
            "text-xs sm:text-sm font-medium transition-all duration-200",
            error ? "text-destructive" : (isFocused ? "text-rebuild-yellow" : "text-white"),
            floatingLabel && "absolute px-0.5 xs:px-1 sm:px-1.5 pointer-events-none transform origin-left",
            floatingLabel && (isFocused || hasValue) 
              ? "-translate-y-1.5 xs:-translate-y-2 sm:-translate-y-2.5 md:-translate-y-3 scale-75 xs:scale-90 left-1.5 xs:left-2 text-xs bg-rebuild-darkgray" 
              : floatingLabel 
                ? "translate-y-2 xs:translate-y-2.5 sm:translate-y-3 md:translate-y-3.5 left-1.5 xs:left-2 sm:left-3"
                : "",
            labelClassName
          )}
        >
          {label}
          {required && <span className={cn(
            "ml-1",
            error ? "text-destructive" : "text-red-500"
          )}>*</span>}
        </Label>
        
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger 
                type="button" 
                className={cn(
                  floatingLabel ? "absolute right-1.5 xs:right-2 sm:right-3 top-2 xs:top-2.5 sm:top-3 md:top-3.5 z-10" : "",
                  "text-gray-400 hover:text-rebuild-yellow transition-colors p-0.5 xs:p-1 touch-manipulation"
                )}
              >
                <HelpCircle size={14} />
              </TooltipTrigger>
              <TooltipContent side="right" align="start" className="max-w-[200px] xs:max-w-[250px] sm:max-w-[280px] md:max-w-[300px] bg-rebuild-darkgray border-gray-700 text-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {description && !floatingLabel && (
        <p className="text-xs text-gray-400 mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2">{description}</p>
      )}
      
      <div className={cn(
        "relative transition-all duration-200", 
        floatingLabel ? "pt-0 xs:pt-0.5 sm:pt-1 md:pt-1.5" : "",
        error ? "form-field-error" : isFocused ? "form-field-focused" : ""
      )}>
        {children}
        
        {/* Focus indicator line - more subtle animation */}
        {isFocused && !error && (
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-rebuild-yellow rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
      
      {/* Error message with improved animation */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          className="flex items-start text-destructive text-xs gap-0.5 xs:gap-1 sm:gap-1.5 overflow-hidden"
          transition={{ duration: 0.2 }}
        >
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
          <p className="leading-tight">{error}</p>
        </motion.div>
      )}
      
      {/* Success message with improved animation */}
      {success && !error && successMessage && (
        <motion.div 
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          className="flex items-start text-green-500 text-xs gap-0.5 xs:gap-1 sm:gap-1.5 overflow-hidden"
          transition={{ duration: 0.2 }}
        >
          <Check size={12} className="flex-shrink-0 mt-0.5" />
          <p className="leading-tight">{successMessage}</p>
        </motion.div>
      )}
      
      {description && floatingLabel && (
        <p className="text-xs text-gray-400 mt-0.5 xs:mt-1 opacity-80 leading-relaxed">{description}</p>
      )}
    </Component>
  );
};

export default AdminFormField;
