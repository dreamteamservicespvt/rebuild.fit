import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, CreditCard, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentStepperProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const PaymentStepper: React.FC<PaymentStepperProps> = ({ currentStep, className }) => {
  const steps = [
    {
      id: 1,
      title: 'User Info',
      icon: User,
      description: 'Personal Details'
    },
    {
      id: 2,
      title: 'Payment',
      icon: CreditCard,
      description: 'UPI Payment'
    },
    {
      id: 3,
      title: 'Complete',
      icon: CheckCircle,
      description: 'Confirmation'
    }
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className={cn("w-full payment-stepper-container", className)}>
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-center space-x-8">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <motion.div
                className="flex flex-col items-center space-y-3 min-w-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step Circle */}
                <div className="relative">
                  <motion.div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg",
                      status === 'completed' && "bg-green-500 border-green-500 text-white shadow-green-500/25",
                      status === 'current' && "bg-rebuild-yellow border-rebuild-yellow text-rebuild-black shadow-rebuild-yellow/25 payment-step-current",
                      status === 'pending' && "bg-rebuild-darkgray border-gray-600 text-gray-500"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {status === 'completed' ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  
                  {/* Animated Ring for Current Step */}
                  {status === 'current' && (
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-rebuild-yellow opacity-30"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  )}
                </div>
                
                {/* Step Info */}
                <div className="text-center">
                  <div className={cn(
                    "font-semibold text-sm transition-colors",
                    status === 'completed' && "text-green-400",
                    status === 'current' && "text-rebuild-yellow",
                    status === 'pending' && "text-gray-500"
                  )}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden lg:block mt-1">
                    {step.description}
                  </div>
                </div>
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="relative flex-1 max-w-[100px]">
                  <div className="w-full h-0.5 bg-gray-600" />
                  <motion.div
                    className={cn(
                      "absolute top-0 left-0 h-0.5 bg-rebuild-yellow",
                      currentStep > step.id && "step-connector-active"
                    )}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: currentStep > step.id ? "100%" : "0%" 
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-3">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-rebuild-yellow to-yellow-400 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Current Step Info */}
        <motion.div
          className="text-center"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-rebuild-yellow font-semibold">
            {steps[currentStep - 1].title}
          </div>
          <div className="text-xs text-gray-400">
            {steps[currentStep - 1].description}
          </div>
        </motion.div>

        {/* Mini Steps Indicator */}
        <div className="flex justify-center space-x-2 mt-3">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <motion.div
                key={step.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  status === 'completed' && "bg-green-500",
                  status === 'current' && "bg-rebuild-yellow",
                  status === 'pending' && "bg-gray-600"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: step.id * 0.1 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentStepper;
