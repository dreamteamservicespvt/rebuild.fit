import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Calendar, User, Phone, Mail, MessageSquare, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { addOnServicesService, serviceBookingsService, type AddOnService, type Membership } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';

interface AddOnBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembership?: Membership | null;
}

interface SelectedService {
  serviceId: string;
  serviceName: string;
  price: string;
  pricingType: 'perSession' | 'monthly' | 'oneTime';
}

const AddOnBookingModal: React.FC<AddOnBookingModalProps> = ({
  isOpen,
  onClose,
  selectedMembership
}) => {
  const [services, setServices] = useState<AddOnService[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    preferredStartDate: '',
    specialRequests: ''
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch active add-on services
      const unsubscribe = addOnServicesService.onSnapshot((servicesList) => {
        const activeServices = servicesList.filter(service => service.isActive);
        setServices(activeServices);
        setLoading(false);
      });

      return unsubscribe;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleServiceToggle = (service: AddOnService, pricingType: 'perSession' | 'monthly' | 'oneTime') => {
    const serviceId = service.id!;
    const price = service.price[pricingType];
    
    if (!price) return;

    const existingServiceIndex = selectedServices.findIndex(s => s.serviceId === serviceId && s.pricingType === pricingType);
    
    if (existingServiceIndex >= 0) {
      // Remove service
      setSelectedServices(prev => prev.filter((_, index) => index !== existingServiceIndex));
    } else {
      // Add service
      const newService: SelectedService = {
        serviceId,
        serviceName: service.name,
        price,
        pricingType
      };
      setSelectedServices(prev => [...prev, newService]);
    }
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      const numericPrice = parseFloat(service.price.replace(/[^\d.]/g, ''));
      return total + (isNaN(numericPrice) ? 0 : numericPrice);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (selectedServices.length === 0) {
      toast.error('Validation Error', 'Please select at least one add-on service');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        membershipId: selectedMembership?.id,
        membershipName: selectedMembership?.name,
        addOnServices: selectedServices,
        totalAmount: `₹${calculateTotal().toLocaleString()}`,
        preferredStartDate: formData.preferredStartDate,
        specialRequests: formData.specialRequests,
        status: 'pending' as const
      };

      await serviceBookingsService.create(bookingData);
      
      toast.success('Booking Submitted!', 'Your add-on service booking has been submitted. We will contact you soon to confirm details.');
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        preferredStartDate: '',
        specialRequests: ''
      });
      setSelectedServices([]);
      onClose();
    } catch (error) {
      toast.error('Booking Failed', 'Please try again later or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const isServiceSelected = (serviceId: string, pricingType: string) => {
    return selectedServices.some(s => s.serviceId === serviceId && s.pricingType === pricingType);
  };

  const getPricingOptions = (service: AddOnService) => {
    const options = [];
    if (service.price.perSession) {
      options.push({
        type: 'perSession' as const,
        label: 'Per Session',
        price: service.price.perSession,
        display: `₹${service.price.perSession}/session`
      });
    }
    if (service.price.monthly) {
      options.push({
        type: 'monthly' as const,
        label: 'Monthly',
        price: service.price.monthly,
        display: `₹${service.price.monthly}/month`
      });
    }
    if (service.price.oneTime) {
      options.push({
        type: 'oneTime' as const,
        label: 'One-time',
        price: service.price.oneTime,
        display: `₹${service.price.oneTime} one-time`
      });
    }
    return options;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#111111] rounded-xl sm:rounded-2xl border border-gray-700/50 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700/50 sticky top-0 bg-[#111111] z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                <Plus size={16} className="text-yellow-400 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Add Services to Your Membership</h3>
                {selectedMembership && (
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Adding to: {selectedMembership.name} membership
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-gray-400 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <User size={16} className="mr-2 text-yellow-400 sm:w-[18px] sm:h-[18px]" />
                Your Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full bg-black border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    placeholder="Enter your email"
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    placeholder="Enter your phone number"
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Preferred Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.preferredStartDate}
                    onChange={(e) => setFormData({...formData, preferredStartDate: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Available Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <CreditCard size={18} className="mr-2 text-yellow-400" />
                Available Add-on Services
              </h4>
              
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-4" />
                  <p className="text-gray-400">Loading services...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-black/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h5 className="text-lg font-semibold text-white mb-2">{service.name}</h5>
                          <p className="text-gray-400 text-sm mb-3">{service.description}</p>
                          
                          {service.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {service.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-md"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {getPricingOptions(service).map((option) => (
                          <div
                            key={`${service.id}-${option.type}`}
                            className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={isServiceSelected(service.id!, option.type)}
                                onCheckedChange={() => handleServiceToggle(service, option.type)}
                                className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                              />
                              <div>
                                <span className="text-white font-medium">{option.label}</span>
                                <div className="text-yellow-400 font-bold">{option.display}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <CheckCircle2 size={18} className="mr-2 text-green-400" />
                  Selected Services
                </h4>
                
                <div className="bg-black/50 rounded-xl p-4 border border-gray-700/50">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-b-0">
                      <div>
                        <span className="text-white font-medium">{service.serviceName}</span>
                        <span className="text-gray-400 text-sm ml-2">({service.pricingType})</span>
                      </div>
                      <span className="text-yellow-400 font-bold">₹{service.price}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-700/50">
                    <span className="text-lg font-bold text-white">Total:</span>
                    <span className="text-xl font-bold text-yellow-400">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Special Requests */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Special Requests or Questions
              </label>
              <Textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                placeholder="Any specific requirements or questions about the services..."
                rows={3}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || selectedServices.length === 0}
                className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="mr-2" />
                    Book Services (₹{calculateTotal().toLocaleString()})
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOnBookingModal;
