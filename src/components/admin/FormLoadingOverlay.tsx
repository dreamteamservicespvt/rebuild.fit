import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormLoadingOverlayProps {
  active: boolean;
  text?: string;
  fullscreen?: boolean;
  className?: string;
}

/**
 * A loading overlay component for forms that provides visual feedback when a form is processing
 */
const FormLoadingOverlay: React.FC<FormLoadingOverlayProps> = ({
  active,
  text = 'Processing...',
  fullscreen = false,
  className
}) => {
  if (!active) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center z-50",
        fullscreen ? "fixed bg-rebuild-black/80" : "bg-rebuild-darkgray/70 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="h-10 w-10 text-rebuild-yellow" />
        </motion.div>
        
        {text && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-lg font-medium"
          >
            {text}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default FormLoadingOverlay;
