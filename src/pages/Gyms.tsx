import React, { useState, useEffect } from 'react';
import CTASection from '@/components/CTASection';
import { gymProfileService, type Gym, submitContactForm } from '@/lib/firebaseServices';
import { MapPin, Clock, Phone, Mail, ChevronLeft, ChevronRight, Dumbbell, Check, Wifi, Bath, Users, Coffee, UtensilsCrossed, Umbrella, Tv, X, Send, Loader2, Calendar } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import ResponsiveImage from '@/components/ResponsiveImage';
// Add Button import from UI components
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

const Gyms = () => {
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null); // For modal viewing
  const [currentHeroBgIndex, setCurrentHeroBgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: 'I would like to book a visit to your gym facility.'
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Default hero background images if no gym photos available
  const defaultHeroImages = [
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
  ];

  useEffect(() => {
    const unsubscribe = gymProfileService.onSnapshot((gymData) => {
      setGym(gymData);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  // Preload hero images for smooth transitions
  useEffect(() => {
    const heroImages = gym?.photos && gym.photos.length > 0 ? gym.photos : defaultHeroImages;
    
    heroImages.forEach((imageSrc) => {
      if (!preloadedImages.has(imageSrc)) {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, imageSrc]));
        };
        img.src = imageSrc;
      }
    });
  }, [gym?.photos, defaultHeroImages, preloadedImages]);

  // Hero background slideshow effect with smooth transitions and pause functionality
  useEffect(() => {
    const heroImages = gym?.photos && gym.photos.length > 0 ? gym.photos : defaultHeroImages;
    
    if (heroImages.length <= 1 || isPaused) return; // No slideshow needed for single image or when paused

    const slideshowInterval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentHeroBgIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 400); // Reduced for smoother transition
      
    }, 5000); // Increased to 5 seconds for better viewing experience

    return () => clearInterval(slideshowInterval);
  }, [gym?.photos, defaultHeroImages, isPaused]);

  // Function to manually change hero background
  const changeHeroBackground = (index: number) => {
    if (index === currentHeroBgIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentHeroBgIndex(index);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  // Keyboard controls for slideshow
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const heroImages = gym?.photos && gym.photos.length > 0 ? gym.photos : defaultHeroImages;
      if (heroImages.length <= 1) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          changeHeroBackground((currentHeroBgIndex - 1 + heroImages.length) % heroImages.length);
          break;
        case 'ArrowRight':
          event.preventDefault();
          changeHeroBackground((currentHeroBgIndex + 1) % heroImages.length);
          break;
        case ' ':
          event.preventDefault();
          setIsPaused(!isPaused);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentHeroBgIndex, gym?.photos, defaultHeroImages, isPaused]);

  // Close modal with Escape key and handle body scroll
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showBookingModal) {
        closeBookingModal();
      }
    };

    if (showBookingModal) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Ensure body scroll is restored on cleanup
      document.body.style.overflow = 'unset';
    };
  }, [showBookingModal]);

  const nextPhoto = () => {
    if (gym?.photos && gym.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % gym.photos.length);
    }
  };

  const prevPhoto = () => {
    if (gym?.photos && gym.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + gym.photos.length) % gym.photos.length);
    }
  };

  // Function to split description into bullet points
  const formatDescriptionPoints = (description: string): string[] => {
    if (!description) return [];
    
    // First try to split by periods followed by space
    const byPeriods = description.split(/\.\s+/).filter(Boolean);
    
    // If we got a reasonable number of points, use them
    if (byPeriods.length > 1) {
      return byPeriods.map(point => point.endsWith('.') ? point : `${point}.`);
    }
    
    // Otherwise, split by commas, semicolons or line breaks
    return description.split(/[,;\n]+/).filter(Boolean).map(point => point.trim());
  };

  // Function to scroll to facility section
  const scrollToFacility = () => {
    const facilitySection = document.getElementById('facility-section');
    if (facilitySection) {
      facilitySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Booking form handlers
  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingFormData.name || !bookingFormData.email || !bookingFormData.phone) {
      toast.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    setSubmittingBooking(true);
    try {
      // Create a detailed message for the booking request
      const detailedMessage = `VISIT BOOKING REQUEST

Name: ${bookingFormData.name}
Email: ${bookingFormData.email}
Phone: ${bookingFormData.phone}
Preferred Date: ${bookingFormData.preferredDate || 'Not specified'}
Preferred Time: ${bookingFormData.preferredTime || 'Not specified'}

Additional Message: ${bookingFormData.message}

Type: Gym Visit Booking`;

      await submitContactForm({
        name: bookingFormData.name,
        email: bookingFormData.email,
        phone: bookingFormData.phone,
        message: detailedMessage
      });

      toast.success('Visit Booked Successfully!', 'Thank you for booking a visit. We will contact you soon to confirm your appointment.');
      
      // Reset form and close modal
      setBookingFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: 'I would like to book a visit to your gym facility.'
      });
      setShowBookingModal(false);
    } catch (error) {
      toast.error('Booking Failed', 'Please try again later or contact us directly.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const openBookingModal = () => {
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rebuild-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Gym Information</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      {/* Hero Banner with Dynamic Background Slideshow */}
      <section 
        className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden slideshow-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Image Container with Slideshow */}
        <div className="absolute inset-0">
          {(() => {
            const heroImages = gym?.photos && gym.photos.length > 0 ? gym.photos : defaultHeroImages;
            return heroImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out will-change-transform ${
                  index === currentHeroBgIndex 
                    ? isTransitioning 
                      ? 'opacity-0 scale-105 blur-sm' 
                      : 'opacity-100 scale-100 blur-0' 
                    : 'opacity-0 scale-110 blur-sm'
                }`}
                style={{
                  backgroundImage: `url('${image}')`,
                  filter: "brightness(75%) contrast(1.1) saturate(1.1)",
                  transform: index === currentHeroBgIndex && !isTransitioning 
                    ? 'scale(1.02)' 
                    : 'scale(1.1)',
                  transition: 'all 1s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  backfaceVisibility: 'hidden', // Optimize for smoother animations
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
            ));
          })()}
          
          {/* Additional overlay for better contrast */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"></div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-0.5 w-12 bg-rebuild-yellow mr-4"></div>
                <span className="text-gray-300 uppercase tracking-widest text-sm font-medium">Welcome to</span>
              </div>
              
              <h1 className="relative">
                <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none transform transition-all duration-700 ease-out animate-fade-in-up inline-block">
                  OUR GYM
                </span>
                <div className="absolute -bottom-4 left-0 w-24 h-1.5 bg-rebuild-yellow rounded-full"></div>
              </h1>
              
              <div className="overflow-hidden relative max-w-xl">
                <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed transform transition-all duration-700 ease-out animate-fade-in-up font-light" style={{ animationDelay: '0.4s' }}>
                  <span className="text-rebuild-yellow font-medium">PREMIUM</span> fitness experience designed for your transformation journey
                </h2>
              </div>
              
              <div className="pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Button 
                  variant="outline" 
                  className="border-rebuild-yellow text-rebuild-yellow hover:bg-rebuild-yellow hover:text-black"
                  onClick={scrollToFacility}
                >
                  Explore Facilities <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Slideshow Navigation */}
        {(() => {
          const heroImages = gym?.photos && gym.photos.length > 0 ? gym.photos : defaultHeroImages;
          return heroImages.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={() => changeHeroBackground((currentHeroBgIndex - 1 + heroImages.length) % heroImages.length)}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:scale-110 opacity-70 hover:opacity-100 group"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>
              
              <button
                onClick={() => changeHeroBackground((currentHeroBgIndex + 1) % heroImages.length)}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:scale-110 opacity-70 hover:opacity-100 group"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </>
          );
        })()}

        {/* Slideshow Indicators */}
        {(() => {
          const heroImages = gym?.photos && gym.photos.length > 0 ? gym.photos : defaultHeroImages;
          return heroImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex space-x-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeHeroBackground(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentHeroBgIndex 
                      ? 'bg-white scale-125 shadow-lg shadow-white/50 ring-2 ring-white/30' 
                      : 'bg-white/40 hover:bg-white/70 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          );
        })()}
      </section>
      
      {/* Gym Information Section */}
      {gym && (
        <section className="py-20 md:py-28 bg-rebuild-darkgray relative">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rebuild-yellow/5 via-transparent to-transparent opacity-70"></div>
          <div className="absolute top-1/3 left-0 w-96 h-96 bg-rebuild-yellow/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          
          <div className="container-custom relative z-10">
            {/* Enhanced Section Header */}
            <div className="text-center mb-20 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 mb-3 relative">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-rebuild-yellow"></div>
                <span className="text-rebuild-yellow tracking-widest uppercase text-sm font-medium">Premium Experience</span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-rebuild-yellow"></div>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
                ABOUT <span className="text-rebuild-yellow relative inline-block">OUR GYM
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-rebuild-yellow rounded-full transform scale-x-75 opacity-70"></span>
                </span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-rebuild-yellow to-transparent mx-auto mb-8"></div>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Experience world-class fitness facilities designed to elevate your training journey to new heights
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Enhanced Content Column */}
              <div className="space-y-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {/* Enhanced Description Card */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-9 rounded-2xl border border-gray-700/50 backdrop-blur-sm transform transition-all duration-500 hover:border-rebuild-yellow/20 hover:shadow-lg hover:shadow-rebuild-yellow/5 relative group overflow-hidden">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-rebuild-yellow/10 rounded-tl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-rebuild-yellow/10 rounded-br-xl"></div>
                  
                  {/* Subtle background glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-rebuild-yellow/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="space-y-6">
                    {formatDescriptionPoints(gym.description).map((point, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-4 animate-fade-in-up group/item"
                        style={{ animationDelay: `${index * 100 + 300}ms` }}
                      >
                        <div className="w-10 h-10 mt-0.5 rounded-full bg-rebuild-yellow/15 flex-shrink-0 flex items-center justify-center group-hover/item:bg-rebuild-yellow/25 transition-colors duration-300 border border-rebuild-yellow/20">
                          <Check size={16} className="text-rebuild-yellow" />
                        </div>
                        <p className="text-gray-300 group-hover/item:text-gray-100 transition-colors duration-300 text-base leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Enhanced CTA */}
                <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                  <Button 
                    onClick={openBookingModal}
                    className="bg-gradient-to-r from-rebuild-yellow to-yellow-500 text-rebuild-black hover:from-yellow-500 hover:to-rebuild-yellow text-lg px-10 py-7 h-auto rounded-xl shadow-lg shadow-rebuild-yellow/10 hover:shadow-rebuild-yellow/25 transition-all duration-300 hover:scale-105 font-semibold tracking-wide flex items-center justify-center gap-3 border border-yellow-400/20"
                  >
                    BOOK A VISIT NOW
                    <ChevronRight size={18} className="ml-1 animate-bounce-x" />
                  </Button>
                  <p className="text-gray-400 text-sm sm:max-w-[240px]">
                    Experience our world-class facilities and meet our expert trainers
                  </p>
                </div>
              </div>
              
              {/* Enhanced Contact Info Column */}
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {/* Enhanced Contact Card */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-gray-700/50 backdrop-blur-sm p-8 shadow-xl transition-all duration-500 hover:shadow-rebuild-yellow/10 hover:border-rebuild-yellow/30 relative group overflow-hidden">
                  {/* Decorative elements */}
                  <>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-rebuild-yellow/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-rebuild-yellow/10 rounded-tr-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-rebuild-yellow/10 rounded-bl-3xl pointer-events-none"></div>
                  </>
                  
                  {/* Card Header */}
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-700/50">
                    {gym.photos && gym.photos[0] && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-rebuild-yellow/40 flex-shrink-0 shadow-lg shadow-rebuild-yellow/5 p-0.5 bg-gradient-to-br from-rebuild-yellow/20 to-transparent">
                        <ResponsiveImage
                          src={gym.photos[0]}
                          alt={gym.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-wide mb-1">{gym.name || "PREMIUM FITNESS"}</h3>
                      <p className="text-rebuild-yellow text-sm font-medium tracking-wide">Your Fitness Partner</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Contact Details */}
                  <div className="space-y-7">
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:item:bg-blue-500/20 transition-colors duration-300 border border-blue-500/10">
                        <MapPin size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">Location</p>
                        <p className="text-white text-base leading-relaxed">{gym.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:item:bg-green-500/20 transition-colors duration-300 border border-green-500/10">
                        <Clock size={20} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">Opening Hours</p>
                        <div className="text-white text-base leading-relaxed whitespace-pre-line">{gym.openingHours}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:item:bg-purple-500/20 transition-colors duration-300 border border-purple-500/10">
                        <Phone size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">Phone</p>
                        <a href={`tel:${gym.phone}`} className="text-white text-base hover:text-rebuild-yellow transition-colors">
                          {gym.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:item:bg-orange-500/20 transition-colors duration-300 border border-orange-500/10">
                        <Mail size={20} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1.5">Email</p>
                        <a href={`mailto:${gym.email}`} className="text-white text-base hover:text-rebuild-yellow transition-colors break-all">
                          {gym.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Explore Facilities Section - NEW */}
      {gym && gym.features && gym.features.length > 0 && (
        <section className="py-16 md:py-20 bg-rebuild-black relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 bg-gym-texture"></div>
          
          <div className="container-custom relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">EXPLORE FACILITIES</h2>
              <div className="w-20 h-1 bg-rebuild-yellow mx-auto mb-6"></div>
              <p className="max-w-2xl mx-auto text-gray-300">
                Our premium gym offers state-of-the-art equipment and amenities for the best fitness experience
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
              {gym.features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-rebuild-darkgray/80 to-rebuild-darkgray/40 p-4 rounded-xl backdrop-blur-sm border border-gray-700/30 hover:border-rebuild-yellow/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rebuild-yellow/10 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-rebuild-yellow/10 flex items-center justify-center mb-4 group-hover:bg-rebuild-yellow/20 transition-colors duration-300">
                      {getFeatureIcon(feature)}
                    </div>
                    <h3 className="font-bold mb-1 group-hover:text-rebuild-yellow transition-colors duration-300">{feature}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Photo Gallery Section */}
      <section id="facility-section" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="text-yellow-500 font-medium tracking-wider uppercase text-sm mb-8 block">Gallery</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-['Poppins'] leading-tight">
              OUR <span className="text-yellow-500">FACILITY</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-['Inter']">
              Step inside our world-class fitness facility equipped with state-of-the-art equipment, 
              premium amenities, and an inspiring atmosphere designed to elevate your fitness journey.
            </p>
          </div>

          {/* Photo Grid */}
          {gym?.photos && gym.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
              {gym.photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setCurrentPhotoIndex(index)}
                >
                  {/* Image */}
                  <ResponsiveImage
                    src={photo}
                    alt={`${gym.name} TRAINERS ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    priority={index < 8}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-6 left-6 right-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1 font-['Poppins']">
                          View Image
                        </h4>
                        <p className="text-yellow-500 text-sm font-medium">
                          Photo {index + 1} of {gym.photos.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-200">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-500/0 group-hover:border-yellow-500/80 transition-all duration-500"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm font-medium">Coming Soon</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Photo Modal Viewer */}
          {gym?.photos && currentPhotoIndex !== null && (
            <div 
              className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setCurrentPhotoIndex(null)}
            >
              <div className="relative max-w-7xl max-h-full">
                <img
                  src={gym.photos[currentPhotoIndex]}
                  alt={`${gym.name} TRAINERS ${currentPhotoIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setCurrentPhotoIndex(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Navigation */}
                {gym.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPhotoIndex(currentPhotoIndex > 0 ? currentPhotoIndex - 1 : gym.photos.length - 1);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPhotoIndex(currentPhotoIndex < gym.photos.length - 1 ? currentPhotoIndex + 1 : 0);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium">
                  {currentPhotoIndex + 1} / {gym.photos.length}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dream Team Services Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/3 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-500/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/2 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="text-yellow-500 font-medium tracking-wider uppercase text-sm mb-8 block">Services</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-['Poppins'] leading-tight">
              PREMIUM <span className="text-yellow-500">GYM</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-['Inter']">
              Experience premium fitness services designed by our expert team to help you achieve your goals 
              with personalized training, cutting-edge equipment, and comprehensive wellness programs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Service 1 - Personal Training */}
            <div className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Personal Training</h3>
                <p className="text-gray-300 leading-relaxed mb-6 font-['Inter']">
                  One-on-one coaching with certified trainers who create customized workout plans tailored to your specific goals, fitness level, and lifestyle.
                </p>
              </div>
            </div>

            {/* Service 2 - Group Classes */}
            <div className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Group Classes</h3>
                <p className="text-gray-300 leading-relaxed mb-6 font-['Inter']">
                  Join high-energy group sessions including HIIT, CrossFit, Yoga, Spin, and Zumba classes led by expert instructors in a motivating environment.
                </p>
              </div>
            </div>

            {/* Service 3 - Nutrition Guidance */}
            <div className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Nutrition Guidance</h3>
                <p className="text-gray-300 leading-relaxed mb-6 font-['Inter']">
                  Comprehensive nutrition counseling and meal planning services to complement your fitness routine and maximize your health and performance results.
                </p>
              </div>
            </div>

            {/* Service 4 - Recovery & Wellness */}
            <div className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10" style={{ animationDelay: '300ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Recovery & Wellness</h3>
                <p className="text-gray-300 leading-relaxed mb-6 font-['Inter']">
                  Advanced recovery services including massage therapy, stretching sessions, and wellness programs designed to optimize your recovery and prevent injuries.
                </p>
              </div>
            </div>

            {/* Service 5 - State-of-the-Art Equipment */}
            <div className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10" style={{ animationDelay: '400ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Premium Equipment</h3>
                <p className="text-gray-300 leading-relaxed mb-6 font-['Inter']">
                  Access to cutting-edge fitness equipment from top brands, including advanced cardio machines, strength training systems, and functional fitness tools.
                </p>
              </div>
            </div>

            {/* Service 6 - Member Community */}
            <div className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10" style={{ animationDelay: '500ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">Member Community</h3>
                <p className="text-gray-300 leading-relaxed mb-6 font-['Inter']">
                  Join a supportive community of fitness enthusiasts with exclusive member events, challenges, and social activities that keep you motivated and engaged.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
      </section>

      {/* Contact Information Section - Enhanced */}
      {gym && (
        <section className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent"></div>
          
          <div className="container-custom relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20 animate-fade-in-up">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-yellow-500"></div>
                <span className="text-yellow-500 font-medium tracking-wider uppercase text-sm">Contact</span>
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-yellow-500"></div>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-['Poppins'] leading-tight">
                GET IN <span className="text-yellow-500 relative inline-block">TOUCH
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-500 rounded-full transform scale-x-75 opacity-70"></span>
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-['Inter']">
                Ready to start your fitness journey? Contact us today to learn more about our memberships, 
                services, and how we can help you achieve your goals.
              </p>
            </div>

            {/* Enhanced Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Address - Opens Google Maps */}
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.address)}`, '_blank')}
                className="group p-8 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-sm animate-fade-in-up text-center hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer w-full relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                    <MapPin size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 font-['Poppins']">Visit Us</h3>
                  <p className="text-gray-300 leading-relaxed font-['Inter']">{gym.address}</p>
                  <div className="mt-4 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    View on Map <ChevronRight size={14} className="inline ml-1" />
                  </div>
                </div>
              </button>

              {/* Phone - Initiates Phone Call */}
              <a 
                href={`tel:${gym.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-500 backdrop-blur-sm animate-fade-in-up text-center hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer block"
                style={{ animationDelay: '100ms' }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-green-500/20 shadow-lg shadow-green-500/5">
                  <Phone size={24} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-['Poppins']">Call Us</h3>
                <p className="text-gray-300 leading-relaxed font-['Inter']">{gym.phone}</p>
                <div className="mt-4 text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Click to call now
                </div>
              </a>

              {/* Email - Opens Email Client */}
              <a 
                href={`mailto:${gym.email}?subject=Inquiry about Rebuild Gym&body=Hi, I would like to know more about your gym membership and services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-500 backdrop-blur-sm animate-fade-in-up text-center hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer block"
                style={{ animationDelay: '200ms' }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                  <Mail size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-['Poppins']">Email Us</h3>
                <p className="text-gray-300 leading-relaxed font-['Inter'] break-all">{gym.email}</p>
                <div className="mt-4 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Click to send email
                </div>
              </a>

              {/* Hours - Shows Booking Modal */}
              <button 
                onClick={openBookingModal}
                className="group p-8 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-500 backdrop-blur-sm animate-fade-in-up text-center hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer w-full"
                style={{ animationDelay: '300ms' }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-orange-500/20 shadow-lg shadow-orange-500/5">
                  <Clock size={24} className="text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-['Poppins']">We're Open</h3>
                <div className="text-gray-300 leading-relaxed font-['Inter'] whitespace-pre-line text-sm">
                  {gym.openingHours}
                </div>
                <div className="mt-4 text-orange-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Click to book a visit
                </div>
              </button>
            </div>
          </div>
        </section>
      )}
      
      {/* Map Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/3 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-yellow-500/2 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-yellow-500"></div>
              <span className="text-yellow-500 font-medium tracking-wider uppercase text-sm mb-8 block">Location</span>
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-yellow-500"></div>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-['Poppins'] leading-tight">
              FIND OUR <span className="text-yellow-500">LOCATION</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-['Inter']">
              {gym?.address || "Visit our premium gym in Kakinada - designed to meet all your fitness needs with convenient location and ample parking"}
            </p>
          </div>
          
          {/* Map & Info Cards - 1:1 Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Map Card with "We're Here" */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:border-yellow-500/20">
              {/* Card Header */}
              <div className="text-center mb-8 pb-6 border-b border-gray-700/50">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                    <MapPin size={24} className="text-green-400" />
                  </div>
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Poppins']">WE'RE HERE</h3>
                <p className="text-green-400 font-medium tracking-wide uppercase text-sm">Find Us on the Map</p>
              </div>
              
              {/* Map Container */}
              <div className="relative mb-6">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5944.102475752507!2d82.2274445!3d16.9555617!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3829efdc1957fb%3A0x9a6fd8f59563789f!2sREBUILD%20FITNESS%20GYM%202!5e1!3m2!1sen!2sin!4v1747483036416!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Rebuild Gym Location"
                    className="w-full h-full rounded-2xl"
                  ></iframe>
                  
                  {/* Map Overlay Elements */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live Location</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Directions Button */}
              <div className="text-center">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(gym?.address || 'Rebuild Gym Kakinada')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 font-['Poppins'] w-full justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-green-500/50"></div>
              <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-green-500/50"></div>
            </div>

            {/* Gym Info Card */}
            {gym && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:border-yellow-500/20">
                {/* Card Header */}
                <div className="text-center mb-8 pb-6 border-b border-gray-700/50">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Poppins']">PREMIUM GYM</h3>
                  <p className="text-yellow-500 font-medium tracking-wide uppercase text-sm">Premium Fitness Destination</p>
                </div>
                
                {/* Contact Details */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 font-['Poppins']">Address</h4>
                      <p className="text-gray-300 leading-relaxed font-['Inter']">{gym.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 font-['Poppins']">Phone</h4>
                      <p className="text-gray-300 font-['Inter']">{gym.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 font-['Poppins']">Email</h4>
                      <p className="text-gray-300 font-['Inter'] break-all">{gym.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 font-['Poppins']">Hours</h4>
                      <div className="text-gray-300 font-['Inter'] whitespace-pre-line text-sm leading-relaxed">
                        {gym.openingHours}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Button */}
                <div className="text-center">
                  <button
                    onClick={() => window.open(`tel:${gym.phone}`, '_blank')}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 font-['Poppins'] w-full justify-center"
                  >
                    <Phone size={20} />
                    Contact Us Now
                  </button>
                </div>
                
                {/* Corner Accents */}
                <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-yellow-500/50"></div>
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-yellow-500/50"></div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />

      {/* Booking Modal */}
      {showBookingModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              closeBookingModal();
            }
          }}
        >
          <div className="bg-rebuild-darkgray rounded-2xl border border-gray-700/50 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rebuild-yellow/20 flex items-center justify-center">
                    <Calendar size={20} className="text-rebuild-yellow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Book a Visit</h3>
                    <p className="text-gray-400 text-sm">Schedule your gym tour</p>
                  </div>
                </div>
                <button
                  onClick={closeBookingModal}
                  className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingFormData.name}
                      onChange={handleBookingChange}
                      className="w-full bg-rebuild-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-rebuild-yellow focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingFormData.email}
                      onChange={handleBookingChange}
                      className="w-full bg-rebuild-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-rebuild-yellow focus:outline-none transition-colors"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingFormData.phone}
                      onChange={handleBookingChange}
                      className="w-full bg-rebuild-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-rebuild-yellow focus:outline-none transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={bookingFormData.preferredDate}
                        onChange={handleBookingChange}
                        className="w-full bg-rebuild-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none transition-colors"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Preferred Time
                      </label>
                      <select
                        name="preferredTime"
                        value={bookingFormData.preferredTime}
                        onChange={handleBookingChange}
                        className="w-full bg-rebuild-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none transition-colors"
                      >
                        <option value="">Select time</option>
                        <option value="6:00 AM">6:00 AM</option>
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={bookingFormData.message}
                      onChange={handleBookingChange}
                      rows={3}
                      className="w-full bg-rebuild-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-rebuild-yellow focus:outline-none transition-colors resize-none"
                      placeholder="Any specific questions or requirements?"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="flex-1 bg-rebuild-yellow hover:bg-yellow-400 text-rebuild-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingBooking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Book Visit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get appropriate icon based on feature name
const getFeatureIcon = (feature: string) => {
  const iconSize = 32;
  const iconClass = "text-rebuild-yellow";
  
  const featureToIconMap: Record<string, JSX.Element> = {
    "Personal Training": <Users size={iconSize} className={iconClass} />,
    "Nutrition Guidance": <UtensilsCrossed size={iconSize} className={iconClass} />,
    "AC": <Umbrella size={iconSize} className={iconClass} />,
    "Showers": <Bath size={iconSize} className={iconClass} />,
    "Modern Equipment": <Dumbbell size={iconSize} className={iconClass} />,
    "24/7 Access": <Clock size={iconSize} className={iconClass} />,
    "WiFi": <Wifi size={iconSize} className={iconClass} />,
    "Locker Rooms": <Check size={iconSize} className={iconClass} />,
    "Cafe": <Coffee size={iconSize} className={iconClass} />,
    "TV Screens": <Tv size={iconSize} className={iconClass} />,
    "Female Trainers": <Users size={iconSize} className={iconClass} />,
    "Specialized Equipment": <Dumbbell size={iconSize} className={iconClass} />,
    "Privacy": <Check size={iconSize} className={iconClass} />,
    "Women-Only Hours": <Clock size={iconSize} className={iconClass} />,
    "Safe Environment": <Check size={iconSize} className={iconClass} />,
    "Affordable": <Check size={iconSize} className={iconClass} />,
    "High Energy": <Check size={iconSize} className={iconClass} />,
    "Fully Equipped": <Dumbbell size={iconSize} className={iconClass} />,
    "Student Discounts": <Check size={iconSize} className={iconClass} />,
    "Flexible Hours": <Clock size={iconSize} className={iconClass} />,
  };
  
  return featureToIconMap[feature] || <Check size={iconSize} className={iconClass} />;
};

export default Gyms;
