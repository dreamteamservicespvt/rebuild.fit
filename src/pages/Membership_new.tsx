import React, { useState, useEffect } from 'react';
import CTASection from '@/components/CTASection';
import { membershipsService, addOnServicesService, type Membership, type AddOnService } from '@/lib/firebaseServices';
import LoadingScreen from '@/components/LoadingScreen';
import AddOnBookingModal from '@/components/AddOnBookingModal';
import { CheckCircle2, Star, ArrowRight, Shield, Clock, Award } from 'lucide-react';

const Membership = () => {
  const [selectedDuration, setSelectedDuration] = useState('quarterly');
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [addOnServices, setAddOnServices] = useState<AddOnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [selectedMembershipForAddOn, setSelectedMembershipForAddOn] = useState<Membership | null>(null);

  useEffect(() => {
    const unsubscribe = membershipsService.onSnapshot((membershipsData) => {
      setMemberships(membershipsData);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = addOnServicesService.onSnapshot((servicesData) => {
      const activeServices = servicesData.filter(service => service.isActive);
      setAddOnServices(activeServices);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rebuild-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Memberships</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-lg font-semibold hover:bg-rebuild-accent transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get price based on duration
  const getPrice = (membership: Membership) => {
    switch (selectedDuration) {
      case 'monthly':
        return membership.price.monthly;
      case 'quarterly':
        return membership.price.quarterly;
      case 'halfyearly':
        return membership.price.halfyearly;
      case 'annual':
        return membership.price.annual;
      default:
        return membership.price.monthly;
    }
  };

  // Helper function to get duration label
  const getDurationLabel = () => {
    switch (selectedDuration) {
      case 'monthly':
        return '/month';
      case 'quarterly':
        return '/3 months';
      case 'halfyearly':
        return '/6 months';
      case 'annual':
        return '/year';
      default:
        return '/month';
    }
  };

  // Duration options
  const durationOptions = [
    { key: 'monthly', label: '1 Month', popular: false },
    { key: 'quarterly', label: '3 Months', popular: true },
    { key: 'halfyearly', label: '6 Months', popular: false },
    { key: 'annual', label: '1 Year', popular: false }
  ];

  return (
    <div className="min-h-screen bg-rebuild-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Content */}
            <div className="mb-16">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-bold mb-6 tracking-tight">
                CHOOSE YOUR
                <span className="block text-rebuild-yellow">MEMBERSHIP</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Transform your body naturally with our comprehensive fitness programs designed for lasting results.
              </p>
            </div>

            {/* Duration Selector */}
            <div className="flex justify-center mb-16">
              <div className="bg-rebuild-gray rounded-full p-2 inline-flex gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                      selectedDuration === option.key
                        ? 'bg-rebuild-yellow text-rebuild-black shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-rebuild-lightgray'
                    }`}
                    onClick={() => setSelectedDuration(option.key)}
                  >
                    {option.popular && selectedDuration !== option.key && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-rebuild-yellow rounded-full"></span>
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Membership Cards */}
            {memberships.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rebuild-gray flex items-center justify-center">
                  <Star size={24} className="text-rebuild-yellow" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Membership Plans Available</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  We're currently updating our membership options. Please contact us for current pricing.
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-rebuild-yellow text-rebuild-black px-8 py-3 rounded-lg font-semibold hover:bg-rebuild-accent transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {memberships.map((membership) => {
                  const price = getPrice(membership);
                  const isPopular = membership.isPopular;
                  
                  return (
                    <div
                      key={membership.id}
                      className={`relative bg-rebuild-gray rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                        isPopular 
                          ? 'ring-2 ring-rebuild-yellow shadow-xl shadow-rebuild-yellow/20' 
                          : 'hover:shadow-xl hover:shadow-white/10'
                      }`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-rebuild-yellow text-rebuild-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </div>
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bebas font-bold mb-2 text-white">
                          {membership.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bebas font-bold text-rebuild-yellow">
                            ₹{price}
                          </span>
                          <span className="text-gray-400 text-lg ml-1">
                            {getDurationLabel()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 capitalize">
                          {membership.type} Plan
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <ul className="space-y-3">
                          {membership.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <CheckCircle2 size={16} className="text-rebuild-yellow mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => {
                          setSelectedMembershipForAddOn(membership);
                          setShowAddOnModal(true);
                        }}
                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group ${
                          isPopular 
                            ? 'bg-rebuild-yellow text-rebuild-black hover:bg-rebuild-accent' 
                            : 'bg-white text-rebuild-black hover:bg-rebuild-yellow'
                        }`}
                      >
                        Choose {membership.name}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center text-green-400">
                <CheckCircle2 size={16} className="mr-2" />
                <span>No Setup Fee</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle2 size={16} className="mr-2" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle2 size={16} className="mr-2" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      {addOnServices.length > 0 && (
        <section className="py-20 bg-rebuild-darkgray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bebas font-bold mb-6">
                ENHANCE YOUR
                <span className="block text-rebuild-yellow">EXPERIENCE</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Take your fitness journey to the next level with our specialized add-on services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {addOnServices.map((service) => {
                const pricing = [
                  service.price.perSession && { type: 'perSession', price: service.price.perSession, label: '/session' },
                  service.price.monthly && { type: 'monthly', price: service.price.monthly, label: '/month' },
                  service.price.oneTime && { type: 'oneTime', price: service.price.oneTime, label: 'one-time' }
                ].filter(Boolean);

                const mainPricing = pricing[0];
                
                return (
                  <div
                    key={service.id}
                    className="bg-rebuild-gray rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-white/10"
                  >
                    {/* Service Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-rebuild-yellow text-rebuild-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {service.category}
                        </span>
                        {service.isPopular && (
                          <Star className="w-4 h-4 text-rebuild-yellow" />
                        )}
                      </div>
                      <h3 className="text-xl font-bebas font-bold text-white mb-2">
                        {service.name}
                      </h3>
                      {mainPricing && (
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bebas font-bold text-rebuild-yellow">
                            ₹{mainPricing.price}
                          </span>
                          <span className="text-gray-400 text-sm ml-1">
                            {mainPricing.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Service Description */}
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle2 size={14} className="text-rebuild-yellow mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => {
                        setSelectedMembershipForAddOn(null);
                        setShowAddOnModal(true);
                      }}
                      className="w-full py-3 bg-white text-rebuild-black rounded-lg font-semibold hover:bg-rebuild-yellow transition-colors flex items-center justify-center group"
                    >
                      Add Service
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bebas font-bold mb-6">
              WHY CHOOSE
              <span className="block text-rebuild-yellow">REBUILD</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Every membership includes access to our premium facilities and expert guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Expert Guidance",
                description: "Certified trainers dedicated to your natural transformation journey"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Premium Equipment",
                description: "State-of-the-art fitness equipment from leading brands"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Flexible Hours",
                description: "Train on your schedule with extended operating hours"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Results Driven",
                description: "Proven methods for sustainable health and fitness goals"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-rebuild-gray rounded-full flex items-center justify-center text-rebuild-yellow group-hover:bg-rebuild-yellow group-hover:text-rebuild-black transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bebas font-bold text-white mb-3 group-hover:text-rebuild-yellow transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Guarantee */}
          <div className="mt-20 text-center">
            <div className="bg-rebuild-gray rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bebas font-bold text-white mb-4">
                30-DAY MONEY-BACK GUARANTEE
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                We're confident in our natural transformation approach. If you're not satisfied within 30 days, we'll refund your membership fee.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center text-green-400">
                  <CheckCircle2 size={16} className="mr-2" />
                  <span>No contracts</span>
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle2 size={16} className="mr-2" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle2 size={16} className="mr-2" />
                  <span>Full refund</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
      
      {/* Add-on Booking Modal */}
      <AddOnBookingModal
        isOpen={showAddOnModal}
        onClose={() => setShowAddOnModal(false)}
        selectedMembership={selectedMembershipForAddOn}
      />
    </div>
  );
};

export default Membership;
