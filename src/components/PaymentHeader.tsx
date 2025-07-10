import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentStepper from './PaymentStepper';

interface PaymentHeaderProps {
  currentStep: 1 | 2 | 3;
  onBack?: () => void;
  backText?: string;
  showBackToHome?: boolean;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ 
  currentStep, 
  onBack, 
  backText = "Back",
  showBackToHome = false 
}) => {
  return (
    <motion.div
      className="payment-header bg-rebuild-darkgray border-b border-gray-700/50 sticky top-0 z-50 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 lg:py-6">
        {/* Top Row - Navigation */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{backText}</span>
              <span className="sm:hidden">Back</span>
            </Button>
          )}

          {/* Back to Home Button (for success page) */}
          {showBackToHome && (
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/'}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
          )}

          {/* Rebuild.Fit Logo/Title */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-rebuild-yellow rounded-full flex items-center justify-center">
                <span className="text-rebuild-black font-bold text-sm">R</span>
              </div>
              <span className="text-white font-semibold">REBUILD.FIT</span>
            </div>
            <div className="text-xs text-gray-400 hidden lg:block">
              Secure Payment Gateway
            </div>
          </div>

          {/* Security Badge */}
          <div className="hidden lg:flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span>Secure</span>
          </div>
        </div>

        {/* Payment Stepper */}
        <PaymentStepper currentStep={currentStep} />
      </div>

      {/* Bottom gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-rebuild-yellow/20 to-transparent" />
    </motion.div>
  );
};

export default PaymentHeader;
