import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: "default" | "error" | "success" | "warning"
  variant?: "default" | "modern" | "minimal"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, status = "default", variant = "default", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    // Forward and merge refs
    const mergedRef = React.useCallback(
      (element: HTMLTextAreaElement | null) => {
        textareaRef.current = element;
        
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
        }
      },
      [ref]
    );
    
    // Check initial value on mount
    React.useEffect(() => {
      if (textareaRef.current) {
        setHasValue(!!textareaRef.current.value);
      }
    }, []);
    
    // Handle value changes
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Status-specific styles (matching Input component)
    const statusStyles = {
      default: "",
      error: "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30",
      success: "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/30",
      warning: "border-yellow-500 focus-visible:border-yellow-500 focus-visible:ring-yellow-500/30",
    }

    // Variant-specific styles (matching Input component)
    const variantStyles = {
      default: "border border-gray-700 focus-visible:border-rebuild-yellow bg-rebuild-black rounded-md",
      modern: "border-0 border-b-2 border-gray-700 focus-visible:border-rebuild-yellow bg-transparent rounded-none px-1",
      minimal: "border border-transparent bg-gray-800/50 hover:bg-gray-800/80 focus:bg-gray-800 rounded-md",
    }

    return (
      <div className={cn(
        "relative w-full min-h-[60px] xs:min-h-[70px] sm:min-h-[80px]", 
        isFocused && "is-focused",
        hasValue && "has-content"
      )}>
        <textarea
          className={cn(
            "flex min-h-[60px] xs:min-h-[70px] sm:min-h-[80px] w-full py-1.5 xs:py-2 px-2 xs:px-3 text-sm xs:text-base md:text-sm transition-all duration-200",
            "placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rebuild-yellow/25 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            statusStyles[status],
            variantStyles[variant],
            className
          )}
          ref={mergedRef}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Animated focus indicator for modern variant */}
        {variant === "modern" && isFocused && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-rebuild-yellow animate-growWidth" />
        )}

        {/* Focus indicator for other variants */}
        {variant !== "modern" && isFocused && (
          <div className="absolute bottom-0 left-0 right-0 top-0 pointer-events-none rounded-md ring-2 ring-rebuild-yellow/25" />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
