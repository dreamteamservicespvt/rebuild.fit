import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Users, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { membershipsService, type Membership } from '@/lib/firebaseServices';
import LoadingScreen from '@/components/LoadingScreen';
import PaymentHeader from '@/components/PaymentHeader';
import { toast } from '@/lib/toast';

interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
}

const PaymentUserInfo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const membershipId = searchParams.get('membership');
  const duration = searchParams.get('duration') as 'monthly' | 'quarterly' | 'halfyearly' | 'annual';

  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    phone: '',
    gender: 'male'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Payment - User Information | REBUILD.fit";
    
    if (!membershipId || !duration) {
      toast.error("Invalid Request", "Please select a membership plan first");
      navigate('/membership');
      return;
    }

    // Fetch membership details
    const fetchMembership = async () => {
      try {
        const membershipData = await membershipsService.getById(membershipId);
        if (!membershipData) {
          toast.error("Membership Not Found", "The selected membership plan could not be found");
          navigate('/membership');
          return;
        }
        setMembership(membershipData);
      } catch (error) {
        toast.error("Error", "Failed to load membership details");
        navigate('/membership');
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [membershipId, duration, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !membership) {
      return;
    }

    setSubmitting(true);

    try {
      // Create query parameters for next step
      const params = new URLSearchParams({
        membership: membershipId!,
        duration: duration!,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender
      });

      // Navigate to UPI payment step
      navigate(`/payment/upi?${params.toString()}`);
    } catch (error) {
      toast.error("Error", "Failed to proceed to payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPrice = () => {
    if (!membership) return '0';
    return membership.price[duration] || '0';
  };

  const getDurationLabel = () => {
    switch (duration) {
      case 'monthly': return '1 Month';
      case 'quarterly': return '3 Months';
      case 'halfyearly': return '6 Months';
      case 'annual': return '1 Year';
      default: return duration;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-rebuild-black text-white">
      {/* Payment Header */}
      <PaymentHeader 
        currentStep={1} 
        onBack={() => navigate('/membership')}
        backText="Back to Membership"
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 pt-8 sm:pt-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bebas font-bold mb-3 sm:mb-4">
            PERSONAL INFORMATION
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4">
            Please provide your details to proceed with the {membership?.name} membership payment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* User Information Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-rebuild-gray border-gray-700">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-rebuild-yellow" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Full Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-rebuild-yellow" />
                      Full Name *
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className={cn(
                        "bg-rebuild-black border-gray-600 text-white placeholder-gray-400 h-10 sm:h-12 transition-all duration-200 focus:border-rebuild-yellow text-sm sm:text-base",
                        errors.fullName && "border-red-500 focus:border-red-500"
                      )}
                    />
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs sm:text-sm mt-2 flex items-center"
                      >
                        <span className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center mr-2 text-white text-xs">!</span>
                        {errors.fullName}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-rebuild-yellow" />
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={cn(
                        "bg-rebuild-black border-gray-600 text-white placeholder-gray-400 h-12 transition-all duration-200 focus:border-rebuild-yellow",
                        errors.email && "border-red-500 focus:border-red-500"
                      )}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center"
                      >
                        <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mr-2 text-white text-xs">!</span>
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-rebuild-yellow" />
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your 10-digit phone number"
                      className={cn(
                        "bg-rebuild-black border-gray-600 text-white placeholder-gray-400 h-12 transition-all duration-200 focus:border-rebuild-yellow",
                        errors.phone && "border-red-500 focus:border-red-500"
                      )}
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center"
                      >
                        <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mr-2 text-white text-xs">!</span>
                        {errors.phone}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Gender */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-rebuild-yellow" />
                      Gender *
                    </label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value as 'male' | 'female' | 'other')}>
                      <SelectTrigger className={cn(
                        "bg-rebuild-black border-gray-600 text-white h-12 transition-all duration-200 focus:border-rebuild-yellow",
                        errors.gender && "border-red-500"
                      )}>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-rebuild-black border-gray-600">
                        <SelectItem value="male" className="text-white hover:bg-rebuild-gray">Male</SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-rebuild-gray">Female</SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-rebuild-gray">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center"
                      >
                        <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mr-2 text-white text-xs">!</span>
                        {errors.gender}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 font-bold py-4 h-auto text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {submitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="flex items-center"
                        >
                          <div className="w-5 h-5 border-2 border-rebuild-black border-t-transparent rounded-full mr-2" />
                          Processing...
                        </motion.div>
                      ) : (
                        <>
                          Proceed to Payment
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Privacy Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                >
                  <p className="text-blue-300 text-sm flex items-start">
                    <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-0.5 text-white text-xs">🔒</span>
                    Your information is secure and will only be used for membership processing and communication.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-rebuild-gray to-gray-800 border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-rebuild-yellow" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {membership && (
                  <>
                    {/* Membership Details */}
                    <motion.div 
                      className="bg-rebuild-black rounded-xl p-6 border border-gray-600"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bebas font-bold text-white mb-2">{membership.name}</h3>
                        <div className="inline-flex items-center px-3 py-1 bg-rebuild-yellow text-rebuild-black rounded-full text-sm font-bold">
                          {membership.type.toUpperCase()} PLAN
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-4xl font-bebas font-bold text-rebuild-yellow mb-2">
                          ₹{getPrice()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {getDurationLabel()} • {membership.type} membership
                        </div>
                      </div>
                    </motion.div>

                    {/* Features Preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <span className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2"></span>
                        What's Included
                      </h4>
                      <div className="space-y-2">
                        {membership.features.slice(0, 4).map((feature, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-start text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-300 leading-relaxed">{feature}</span>
                          </motion.div>
                        ))}
                        {membership.features.length > 4 && (
                          <div className="text-sm text-gray-400 italic">
                            +{membership.features.length - 4} more features...
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Price Breakdown */}
                    <motion.div
                      className="bg-gradient-to-r from-rebuild-yellow/10 to-yellow-400/10 rounded-xl p-4 border border-rebuild-yellow/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h4 className="text-rebuild-yellow font-semibold mb-3">Price Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Membership Fee:</span>
                          <span className="text-white">₹{getPrice()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Processing Fee:</span>
                          <span className="text-green-400">Free</span>
                        </div>
                        <div className="border-t border-gray-600 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-white font-bold">Total Amount:</span>
                            <span className="text-rebuild-yellow font-bold text-xl">₹{getPrice()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Security Features */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h4 className="text-white font-semibold text-sm">Secure Payment</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>SSL Encrypted</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>UPI Secure</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Data Protected</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Verified Gateway</span>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUserInfo;
