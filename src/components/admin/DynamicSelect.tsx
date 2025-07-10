import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DynamicSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  onAddOption: (option: string) => Promise<void>;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  label?: string;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  value,
  onValueChange,
  options,
  onAddOption,
  placeholder = "Select an option",
  icon,
  className,
  error = false,
  disabled = false,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState('');
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
        setNewOptionValue('');
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus appropriate input when states change
  useEffect(() => {
    if (isAddingNew && inputRef.current) {
      inputRef.current.focus();
    } else if (isOpen && searchInputRef.current && options.length > 5) {
      // Auto-focus search if there are many options
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isAddingNew, isOpen, options.length]);

  const handleOptionSelect = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
    setIsAddingNew(false);
    setNewOptionValue('');
    setSearchQuery('');
  };

  const handleAddNewOption = async () => {
    if (!newOptionValue.trim()) return;

    setIsAddingOption(true);
    try {
      await onAddOption(newOptionValue.trim());
      onValueChange(newOptionValue.trim());
      setIsAddingNew(false);
      setNewOptionValue('');
      setSearchQuery('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add new option:', error);
    } finally {
      setIsAddingOption(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewOption();
    } else if (e.key === 'Escape') {
      setIsAddingNew(false);
      setNewOptionValue('');
    }
  };

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full h-10 sm:h-11 px-3 flex items-center justify-between gap-2",
          "border-0 border-b-2 border-gray-700 focus-visible:border-rebuild-yellow bg-transparent rounded-none",
          "text-left transition-all duration-200",
          "hover:border-gray-600 focus-visible:outline-none focus-visible:ring-0",
          "group relative text-sm sm:text-base",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed",
          isPlaceholder && "text-muted-foreground",
          isOpen && "border-rebuild-yellow"
        )}
        style={{ paddingLeft: icon ? '2rem' : '0.75rem' }}
      >
        {icon && (
          <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-300 transition-colors">
            {icon}
          </div>
        )}
        
        <span className="flex-1 truncate pr-2">
          {displayValue}
        </span>
        
        <ChevronDown 
          size={16} 
          className={cn(
            "text-gray-400 transition-all duration-200 group-hover:text-gray-300 flex-shrink-0",
            isOpen && "rotate-180 text-rebuild-yellow"
          )} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={cn(
          "absolute top-full left-0 right-0 z-[9999] mt-1",
          "bg-rebuild-darkgray border border-gray-700 rounded-lg shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          "overflow-hidden min-w-full w-full"
        )}>
          {/* Search bar for many options */}
          {options.length > 5 && !isAddingNew && (
            <div className="p-2 sm:p-3 border-b border-gray-700">
              <div className="relative">
                <Search size={14} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className="pl-7 sm:pl-9 bg-gray-800 border-gray-600 focus-visible:border-rebuild-yellow text-sm h-8 sm:h-9"
                />
              </div>
            </div>
          )}

          <div className="max-h-48 sm:max-h-64 overflow-y-auto overscroll-contain">
            {/* Existing options */}
            {filteredOptions.length > 0 && !isAddingNew && (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={cn(
                      "w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-700/50 active:bg-gray-700 transition-all duration-150",
                      "flex items-center gap-2 sm:gap-3 text-xs sm:text-sm",
                      "hover:pl-4 sm:hover:pl-5 touch-manipulation cursor-pointer",
                      value === option && "bg-rebuild-yellow/10 text-rebuild-yellow border-r-2 border-rebuild-yellow"
                    )}
                  >
                    <span className="flex-1 break-words">{option}</span>
                    {value === option && (
                      <Check size={14} className="text-rebuild-yellow flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* No options found */}
            {filteredOptions.length === 0 && searchQuery && !isAddingNew && (
              <div className="p-3 sm:p-4 text-center text-gray-400 text-xs sm:text-sm">
                No options found for "{searchQuery}"
              </div>
            )}

            {/* Divider */}
            {((filteredOptions.length > 0 && !searchQuery) || (filteredOptions.length === 0 && !searchQuery)) && !isAddingNew && (
              <div className="border-t border-gray-700" />
            )}

            {/* Add new option section */}
            <div className="p-2 sm:p-3">
              {!isAddingNew ? (
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className={cn(
                    "w-full px-2 sm:px-3 py-2 text-left hover:bg-gray-700/50 transition-all duration-150",
                    "flex items-center gap-2 sm:gap-3 text-rebuild-yellow text-xs sm:text-sm",
                    "rounded-md hover:bg-rebuild-yellow/10 cursor-pointer"
                  )}
                >
                  <Plus size={14} className="flex-shrink-0" />
                  <span>Add new {label?.toLowerCase() || 'option'}</span>
                </button>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                      New {label || 'Option'}
                    </label>
                    <Input
                      ref={inputRef}
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Enter new ${label?.toLowerCase() || 'option'}`}
                      className="text-xs sm:text-sm bg-gray-800 border-gray-600 focus-visible:border-rebuild-yellow h-8 sm:h-9"
                      disabled={isAddingOption}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddNewOption}
                      disabled={!newOptionValue.trim() || isAddingOption}
                      className="flex-1 h-7 sm:h-8 bg-rebuild-yellow hover:bg-rebuild-yellow/90 text-black font-medium text-xs sm:text-sm"
                    >
                      {isAddingOption ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black" />
                      ) : (
                        <>
                          <Check size={12} className="mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingNew(false);
                        setNewOptionValue('');
                      }}
                      disabled={isAddingOption}
                      className="h-7 sm:h-8 px-2 sm:px-3 border-gray-600 hover:bg-gray-700 text-xs sm:text-sm"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
