import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, X, Search, CalendarIcon } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  clearable?: boolean
  onClear?: () => void
  variant?: "default" | "modern" | "minimal"
  status?: "default" | "error" | "success" | "warning"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    icon, 
    iconPosition = "left", 
    clearable = false,
    onClear,
    variant = "default",
    status = "default",
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef(ref, inputRef);
    
    // Check initial value on mount
    React.useEffect(() => {
      if (inputRef.current) {
        setHasValue(!!inputRef.current.value);
      }
    }, []);
    
    // Add appropriate icon based on input type
    let inputIcon = icon;
    if (!inputIcon) {
      if (type === "search") inputIcon = <Search size={18} />;
      if (type === "date") inputIcon = <CalendarIcon size={18} />;
    }
    
    // Determine effective type for password fields
    const effectiveType = type === "password" && showPassword ? "text" : type;
    
    // Handle input value change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };
    
    // Handle clear button click
    const handleClear = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
        setHasValue(false);
        
        // Trigger input event to ensure form state updates
        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
        
        // If there's a custom clear handler, call it
        if (onClear) onClear();
        
        // Focus the input after clearing
        inputRef.current.focus();
      }
    };
    
    // Prepare status-specific styles
    const statusStyles = {
      default: "",
      error: "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30",
      success: "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/30",
      warning: "border-yellow-500 focus-visible:border-yellow-500 focus-visible:ring-yellow-500/30"
    };

    // Prepare variant-specific styles
    const variantStyles = {
      default: "border border-gray-700 focus-visible:border-rebuild-yellow bg-rebuild-black rounded-md",
      modern: "border-0 border-b-2 border-gray-700 focus-visible:border-rebuild-yellow bg-transparent rounded-none px-1",
      minimal: "border border-transparent bg-gray-800/50 hover:bg-gray-800/80 focus:bg-gray-800 rounded-md"
    };

    return (
      <div 
        className={cn(
          "relative flex items-center group w-full min-h-[36px] xs:min-h-[40px] sm:min-h-[42px]", // Responsive min-height
          (isFocused || hasValue) && "has-content",
          isFocused && "is-focused"
        )}
      >
        {inputIcon && iconPosition === "left" && (
          <div className={cn(
            "absolute left-2 xs:left-3 flex items-center justify-center text-gray-400",
            isFocused && "text-rebuild-yellow"
          )}>
            {inputIcon}
          </div>
        )}
        
        <input
          type={effectiveType}
          className={cn(
            // Base styles
            "flex h-8 xs:h-9 sm:h-10 w-full py-1.5 xs:py-2 text-sm xs:text-base md:text-sm transition-all duration-200",
            // Padding based on icon position
            inputIcon && iconPosition === "left" ? "pl-7 xs:pl-8 sm:pl-9" : "pl-2 xs:pl-3",
            (type === "password" || clearable) ? "pr-7 xs:pr-8 sm:pr-9" : "pr-2 xs:pr-3",
            // Focus styles
            "placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rebuild-yellow/25 focus-visible:ring-offset-0",
            // Status styles
            statusStyles[status],
            // Variant styles
            variantStyles[variant],
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Custom class
            className
          )}
          ref={mergedRef}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Password toggle or clear button */}
        {(type === "password" || (clearable && props.value)) && (
          <div className="absolute right-2 xs:right-3 flex items-center">
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-rebuild-yellow focus:outline-none focus:text-rebuild-yellow"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            
            {clearable && props.value && props.value.toString().length > 0 && type !== "password" && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-rebuild-yellow focus:outline-none focus:text-rebuild-yellow p-1 rounded-full hover:bg-gray-700/50"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        
        {inputIcon && iconPosition === "right" && !clearable && type !== "password" && (
          <div className="absolute right-2 xs:right-3 flex items-center justify-center text-gray-400">
            {inputIcon}
          </div>
        )}
        
        {/* Animated focus border for modern variant */}
        {variant === "modern" && isFocused && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-rebuild-yellow animate-growWidth" />
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

// Helper function to merge refs
function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<T>).current = element;
      }
    });
  }, [refs]);
}

export { Input }
