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
      <section className="relative py-16 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Content */}
            <div className="mb-12 sm:mb-16">
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas font-bold mb-4 sm:mb-6 tracking-tight leading-none">
                CHOOSE YOUR
                <span className="block text-rebuild-yellow mt-2">MEMBERSHIP</span>
              </h1>
              <p className="text-lg xs:text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                Transform your body naturally with our comprehensive fitness programs designed for lasting results.
              </p>
            </div>

            {/* Duration Selector - Mobile First Design */}
            <div className="mb-12 sm:mb-16">
              {/* Mobile: Stack vertically on very small screens */}
              <div className="xs:hidden flex flex-col gap-3 max-w-xs mx-auto">
                {durationOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`relative w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 touch-manipulation ${
                      selectedDuration === option.key
                        ? 'bg-rebuild-yellow text-rebuild-black shadow-lg transform scale-105'
                        : 'bg-rebuild-gray text-gray-300 hover:text-white hover:bg-rebuild-lightgray border border-gray-600'
                    }`}
                    onClick={() => setSelectedDuration(option.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {option.popular && (
                        <span className="bg-rebuild-yellow text-rebuild-black px-2 py-1 rounded-full text-xs font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Tablet and larger: Grid layout */}
              <div className="hidden xs:flex sm:hidden flex-wrap justify-center gap-2 max-w-md mx-auto">
                {durationOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`relative flex-1 min-w-[120px] py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 touch-manipulation ${
                      selectedDuration === option.key
                        ? 'bg-rebuild-yellow text-rebuild-black shadow-lg'
                        : 'bg-rebuild-gray text-gray-300 hover:text-white hover:bg-rebuild-lightgray border border-gray-600'
                    }`}
                    onClick={() => setSelectedDuration(option.key)}
                  >
                    {option.popular && selectedDuration !== option.key && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-rebuild-yellow rounded-full"></span>
                    )}
                    <div className="text-center">
                      <div className="text-xs opacity-80 mb-1">{option.popular ? 'Popular' : ''}</div>
                      <div>{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Desktop: Original pill design but improved */}
              <div className="hidden sm:flex justify-center">
                <div className="bg-rebuild-gray rounded-2xl p-3 inline-flex gap-2 shadow-xl border border-gray-700">
                  {durationOptions.map((option) => (
                    <button
                      key={option.key}
                      className={`relative px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 whitespace-nowrap touch-manipulation ${
                        selectedDuration === option.key
                          ? 'bg-rebuild-yellow text-rebuild-black shadow-lg transform scale-105'
                          : 'text-gray-400 hover:text-white hover:bg-rebuild-lightgray'
                      }`}
                      onClick={() => setSelectedDuration(option.key)}
                    >
                      {option.popular && selectedDuration !== option.key && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rebuild-yellow rounded-full"></span>
                      )}
                      <div className="flex flex-col items-center">
                        {option.popular && (
                          <span className="text-xs opacity-75 mb-1">Popular</span>
                        )}
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Membership Cards */}
            {memberships.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rebuild-gray flex items-center justify-center">
                  <Star size={24} className="text-rebuild-yellow" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">No Membership Plans Available</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto px-4">
                  We're currently updating our membership options. Please contact us for current pricing.
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-rebuild-yellow text-rebuild-black px-8 py-4 rounded-xl font-bold hover:bg-rebuild-accent transition-colors touch-manipulation"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="w-full">
                {/* Mobile: Single column with optimized spacing */}
                <div className="sm:hidden space-y-6">
                  {memberships.map((membership) => {
                    const price = getPrice(membership);
                    const isPopular = membership.isPopular;
                    
                    return (
                      <div
                        key={membership.id}
                        className={`relative bg-rebuild-gray rounded-2xl p-6 transition-all duration-300 mx-auto max-w-sm border-2 ${
                          isPopular 
                            ? 'border-rebuild-yellow shadow-xl shadow-rebuild-yellow/20' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {/* Popular Badge */}
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-rebuild-yellow text-rebuild-black px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                              <Star className="w-4 h-4 mr-1" />
                              Most Popular
                            </div>
                          </div>
                        )}

                        {/* Plan Header */}
                        <div className="text-center mb-6 mt-2">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-rebuild-yellow uppercase tracking-wider bg-rebuild-yellow/20 px-3 py-1 rounded-full">
                              {membership.type} Plan
                            </span>
                          </div>
                          <h3 className="text-2xl font-bebas font-bold mb-3 text-white">
                            {membership.name}
                          </h3>
                          <div className="mb-2">
                            <span className="text-4xl font-bebas font-bold text-rebuild-yellow">
                              ₹{price}
                            </span>
                            <span className="text-gray-400 text-lg ml-1">
                              {getDurationLabel()}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-6">
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
                            const params = new URLSearchParams({
                              membership: membership.id!,
                              duration: selectedDuration
                            });
                            window.location.href = `/payment/user-info?${params.toString()}`;
                          }}
                          className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center group touch-manipulation ${
                            isPopular 
                              ? 'bg-rebuild-yellow text-rebuild-black hover:bg-rebuild-accent transform hover:scale-105' 
                              : 'bg-white text-rebuild-black hover:bg-rebuild-yellow transform hover:scale-105'
                          }`}
                        >
                          Choose {membership.name}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Tablet and Desktop: Side by side layout */}
                <div className="hidden sm:flex justify-center w-full">
                  <div className={`grid ${
                    memberships.length === 2 
                      ? "grid-cols-1 md:grid-cols-2" 
                      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  } gap-6 lg:gap-8 max-w-6xl mx-auto place-items-center`}>
                    {memberships.map((membership) => {
                      const price = getPrice(membership);
                      const isPopular = membership.isPopular;
                      
                      return (
                        <div
                          key={membership.id}
                          className={`relative bg-rebuild-gray rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 w-full max-w-md ${
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
                              const params = new URLSearchParams({
                                membership: membership.id!,
                                duration: selectedDuration
                              });
                              window.location.href = `/payment/user-info?${params.toString()}`;
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
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-sm px-4">
              <div className="flex items-center justify-center text-green-400">
                <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                <span>No Setup Fee</span>
              </div>
              <div className="flex items-center justify-center text-green-400">
                <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center justify-center text-green-400">
                <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      {addOnServices.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-rebuild-darkgray overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 sm:mb-20 animate-fade-in-up">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bebas font-bold mb-6 sm:mb-8">
                ENHANCE YOUR
                <span className="block text-rebuild-yellow drop-shadow-lg">EXPERIENCE</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed px-4">
                Take your fitness journey to the next level with our specialized add-on services.
              </p>
            </div>

            {/* Services Grid */}
            {/* Mobile: Single column */}
            <div className="md:hidden space-y-6">
              {addOnServices.map((service, index) => {
                const pricing = [
                  service.price.perSession && { type: 'perSession', price: service.price.perSession, label: '/session' },
                  service.price.monthly && { type: 'monthly', price: service.price.monthly, label: '/month' },
                  service.price.oneTime && { type: 'oneTime', price: service.price.oneTime, label: 'one-time' }
                ].filter(Boolean);

                const mainPricing = pricing[0];
                
                return (
                  <div
                    key={service.id}
                    className="group bg-gradient-to-br from-rebuild-gray to-rebuild-gray/80 rounded-2xl p-6 border border-gray-700/50 transition-all duration-500 hover:border-rebuild-yellow/30 animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Service Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-gradient-to-r from-rebuild-yellow to-rebuild-accent text-rebuild-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                          {service.category}
                        </span>
                        {service.isPopular && (
                          <div className="bg-rebuild-yellow/20 p-2 rounded-full">
                            <Star className="w-4 h-4 text-rebuild-yellow" fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bebas font-bold text-white mb-3 group-hover:text-rebuild-yellow transition-colors duration-300">
                        {service.name}
                      </h3>
                      {mainPricing && (
                        <div className="flex items-baseline mb-2">
                          <span className="text-3xl font-bebas font-bold text-rebuild-yellow drop-shadow-sm">
                            ₹{mainPricing.price}
                          </span>
                          <span className="text-gray-400 text-base ml-2 font-medium">
                            {mainPricing.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Service Description */}
                    <div className="mb-6">
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {service.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-sm">
                            <div className="bg-rebuild-yellow/20 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                              <CheckCircle2 size={14} className="text-rebuild-yellow" />
                            </div>
                            <span className="text-gray-200 leading-relaxed font-light">{feature}</span>
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
                      className="w-full py-4 bg-gradient-to-r from-white to-gray-100 text-rebuild-black rounded-xl font-bold text-base hover:from-rebuild-yellow hover:to-rebuild-accent hover:shadow-xl hover:shadow-rebuild-yellow/30 transition-all duration-300 flex items-center justify-center group relative overflow-hidden touch-manipulation"
                    >
                      <span className="relative z-10 flex items-center">
                        Add Service
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-rebuild-yellow to-rebuild-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Tablet and Desktop: Grid layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {addOnServices.map((service, index) => {
                const pricing = [
                  service.price.perSession && { type: 'perSession', price: service.price.perSession, label: '/session' },
                  service.price.monthly && { type: 'monthly', price: service.price.monthly, label: '/month' },
                  service.price.oneTime && { type: 'oneTime', price: service.price.oneTime, label: 'one-time' }
                ].filter(Boolean);

                const mainPricing = pricing[0];
                
                return (
                  <div
                    key={service.id}
                    className="group flex flex-col h-full bg-gradient-to-br from-rebuild-gray to-rebuild-gray/80 rounded-3xl p-8 border border-gray-700/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-rebuild-yellow/20 hover:border-rebuild-yellow/30 animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Service Header */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-gradient-to-r from-rebuild-yellow to-rebuild-accent text-rebuild-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                          {service.category}
                        </span>
                        {service.isPopular && (
                          <div className="bg-rebuild-yellow/20 p-2 rounded-full">
                            <Star className="w-5 h-5 text-rebuild-yellow" fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bebas font-bold text-white mb-4 group-hover:text-rebuild-yellow transition-colors duration-300">
                        {service.name}
                      </h3>
                      {mainPricing && (
                        <div className="flex items-baseline mb-2">
                          <span className="text-3xl lg:text-4xl font-bebas font-bold text-rebuild-yellow drop-shadow-sm">
                            ₹{mainPricing.price}
                          </span>
                          <span className="text-gray-400 text-base ml-2 font-medium">
                            {mainPricing.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Service Description */}
                    <div className="flex-grow mb-8">
                      <p className="text-gray-300 text-base leading-relaxed font-light">
                        {service.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <ul className="space-y-3">
                        {service.features.slice(0, 3).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-base">
                            <div className="bg-rebuild-yellow/20 p-1 rounded-full mr-3 mt-1">
                              <CheckCircle2 size={16} className="text-rebuild-yellow" />
                            </div>
                            <span className="text-gray-200 leading-relaxed font-light">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      <button
                        onClick={() => {
                          setSelectedMembershipForAddOn(null);
                          setShowAddOnModal(true);
                        }}
                        className="w-full py-4 bg-gradient-to-r from-white to-gray-100 text-rebuild-black rounded-2xl font-bold text-lg hover:from-rebuild-yellow hover:to-rebuild-accent hover:shadow-xl hover:shadow-rebuild-yellow/30 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center">
                          Add Service
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-rebuild-yellow to-rebuild-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bebas font-bold mb-4 sm:mb-6">
              WHY CHOOSE
              <span className="block text-rebuild-yellow">REBUILD</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Every membership includes access to our premium facilities and expert guidance.
            </p>
          </div>

          {/* Mobile: 2x2 Grid */}
          <div className="grid grid-cols-2 md:hidden gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Expert Guidance",
                description: "Certified trainers dedicated to your natural transformation journey"
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Premium Equipment",
                description: "State-of-the-art fitness equipment from leading brands"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Flexible Hours",
                description: "Train on your schedule with extended operating hours"
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Results Driven",
                description: "Proven methods for sustainable health and fitness goals"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center group p-4"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-rebuild-gray rounded-full flex items-center justify-center text-rebuild-yellow group-hover:bg-rebuild-yellow group-hover:text-rebuild-black transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bebas font-bold text-white mb-2 group-hover:text-rebuild-yellow transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Tablet and Desktop: Single row */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
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
          <div className="mt-16 sm:mt-20 text-center">
            <div className="bg-rebuild-gray rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bebas font-bold text-white mb-3 sm:mb-4">
                30-DAY MONEY-BACK GUARANTEE
              </h3>
              <p className="text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base px-4">
                We're confident in our natural transformation approach. If you're not satisfied within 30 days, we'll refund your membership fee.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center justify-center text-green-400">
                  <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                  <span>No contracts</span>
                </div>
                <div className="flex items-center justify-center text-green-400">
                  <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center justify-center text-green-400">
                  <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
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
