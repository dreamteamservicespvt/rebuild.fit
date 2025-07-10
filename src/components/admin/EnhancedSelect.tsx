import React from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EnhancedSelectProps {
  id: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  allowCustom?: boolean;
  customValueChange?: (value: string) => void;
  className?: string;
  error?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
}

/**
 * EnhancedSelect provides a consistent and stable select component with icon support
 * It also supports custom values through an optional input field
 */
const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  id,
  value,
  options,
  placeholder,
  onChange,
  icon,
  allowCustom = false,
  customValueChange,
  className,
  error = false,
  triggerClassName,
  contentClassName,
}) => {
  return (
    <div className={cn("relative", className)}>
      {icon && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none z-10">
          {icon}
        </div>
      )}
      
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger 
          id={id}
          className={cn(
            icon ? "pl-9" : "pl-3",
            "border-0 border-b-2 border-gray-700 focus-visible:border-rebuild-yellow bg-transparent rounded-none",
            error ? "border-destructive" : "",
            !value && "text-muted-foreground",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={cn(
          "bg-rebuild-darkgray border-gray-700 max-h-[200px]",
          contentClassName
        )}>
          {options.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          {allowCustom && (
            <SelectItem value="custom">Custom (type below)</SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {allowCustom && value === 'custom' && customValueChange && (
        <Input
          value=""
          onChange={(e) => customValueChange(e.target.value)}
          placeholder={`Enter custom ${placeholder.toLowerCase()}`}
          variant="modern"
          icon={icon}
          className="mt-2"
        />
      )}
    </div>
  );
};

export default EnhancedSelect;
