import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, Star, Users, Calendar, Award, Play, X, ChevronLeft, ChevronRight,
  Instagram, Facebook, Linkedin, Twitter, Globe, Phone, Mail, MapPin,
  CheckCircle, Clock, Dumbbell, Heart, Target
} from 'lucide-react';
import { enhancedTrainersService, type TrainerProfile, submitContactForm } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import ResponsiveImage from '@/components/ResponsiveImage';
import TrainerProfileSkeleton from '@/components/TrainerProfileSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TrainerProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('gallery');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: "I'd like to book a consultation with this trainer."
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Define useMemo hooks BEFORE any conditional returns to maintain hook order
  const galleryImages = useMemo(() => 
    trainer?.images?.filter(img => img.categoryTag === 'Gallery') || [], 
    [trainer?.images]
  );
  const beforeAfterImages = useMemo(() => 
    trainer?.images?.filter(img => img.categoryTag === 'Before/After') || [], 
    [trainer?.images]
  );
  const certificationImages = useMemo(() => 
    trainer?.images?.filter(img => img.categoryTag === 'Certification') || [], 
    [trainer?.images]
  );

  useEffect(() => {
    if (slug) {
      loadTrainer();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      // Account for navbar height (approximately 80px) + some buffer
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadTrainer = async () => {
    if (!slug) {
      setError('No trainer slug provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const trainerData = await enhancedTrainersService.getBySlug(slug);
      if (!trainerData) {
        setError('Trainer not found');
      } else {
        setTrainer(trainerData);
        // Update page title
        document.title = `${trainerData.name} - ${trainerData.role} | REBUILD.fit`;
      }
    } catch (err) {
      setError('Failed to load trainer profile');
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = useCallback(() => {
    setBookingForm(prev => ({
      ...prev,
      message: `I'd like to book a consultation with ${trainer?.name || 'this trainer'}.`
    }));
    setShowBookingModal(true);
  }, [trainer?.name]);

  const handleBookingSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmittingBooking(true);
    try {
      await submitContactForm({
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        message: `Trainer Consultation Request for ${trainer?.name}: ${bookingForm.message}`
      });
      
      toast.success('Booking request sent successfully!');
      setShowBookingModal(false);
      setBookingForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send booking request');
    } finally {
      setSubmittingBooking(false);
    }
  }, [bookingForm, trainer?.name]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    if (trainer?.images) {
      setLightboxIndex((prev) => (prev + 1) % trainer.images.length);
    }
  }, [trainer?.images]);

  const prevImage = useCallback(() => {
    if (trainer?.images) {
      setLightboxIndex((prev) => (prev - 1 + trainer.images.length) % trainer.images.length);
    }
  }, [trainer?.images]);

  // Show loading skeleton while data is being fetched
  if (loading) {
    return <TrainerProfileSkeleton />;
  }

  // Show error state if trainer not found
  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-rebuild-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Trainer Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The trainer profile you\'re looking for doesn\'t exist.'}</p>
          <Button
            onClick={() => navigate('/trainers')}
            className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            View All Trainers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rebuild-black text-white">
      {/* Hero Section with improved mobile design */}
      <section className="relative min-h-screen lg:h-[80vh] overflow-visible">
        {/* Background - lowest z-index */}
        <div className="absolute inset-0 z-0">
          {trainer.heroImage ? (
            <ResponsiveImage
              src={trainer.heroImage}
              alt={`${trainer.name} hero`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')"
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black via-rebuild-black/50 to-transparent" />
        </div>

        {/* Back Button - mobile responsive positioning */}
        <div className="absolute top-4 sm:top-6 lg:top-24 left-4 sm:left-6 z-30">
          <Button
            variant="outline"
            onClick={() => navigate('/trainers')}
            className="bg-black/60 border-white/30 text-white hover:bg-black/80 backdrop-blur-sm text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Trainers</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Hero Content - mobile optimized layout */}
        <div className="container-custom relative z-20 h-full pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full gap-8 lg:gap-12">
            
            {/* Mobile: Image first, Desktop: Text first */}
            <div className="flex flex-col lg:flex-row items-center w-full gap-8 lg:gap-12">
              
              {/* Profile Image - mobile priority */}
              <motion.div 
                className="relative z-10 flex-shrink-0 order-1 lg:order-2 w-full max-w-xs sm:max-w-sm lg:max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl mx-auto">
                  <ResponsiveImage
                    src={trainer.profileImage || trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Text Content - mobile second, desktop first */}
              <motion.div 
                className="flex-1 space-y-4 sm:space-y-6 relative z-20 order-2 lg:order-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Role Badge - mobile responsive */}
                <div className="flex justify-center lg:justify-start">
                  <Badge className="bg-rebuild-yellow text-rebuild-black text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">
                    {trainer.role}
                  </Badge>
                </div>
                
                {/* Name - mobile responsive text */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {trainer.name}
                </h1>
                
                {/* Bio - mobile responsive */}
                <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
                  {trainer.bioShort}
                </p>
                
                {/* Quick Stats - mobile responsive grid */}
                <div className="relative z-20 grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 max-w-md mx-auto lg:mx-0">
                  <div className="text-center bg-white/5 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-rebuild-yellow">
                      {trainer.experienceYears || 10}+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Years</div>
                  </div>
                  <div className="text-center bg-white/5 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-rebuild-yellow">
                      {trainer.specializations?.length || 4}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Skills</div>
                  </div>
                  <div className="text-center bg-white/5 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-rebuild-yellow">
                      {trainer.certifications?.length || 3}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Certs</div>
                  </div>
                </div>
                
                {/* Action Buttons - mobile responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start">
                  <Button 
                    onClick={openBookingModal}
                    className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 px-6 sm:px-8 py-3 text-sm sm:text-base w-full sm:w-auto"
                  >
                    Book Consultation
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 text-sm sm:text-base w-full sm:w-auto"
                    onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Gallery
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation - Mobile Responsive */}
      <div className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isSticky ? "bg-black/95 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      )}>
        <div className="container-custom">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Left: Trainer Info */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden flex-shrink-0">
                <ResponsiveImage
                  src={trainer.profileImage || trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base truncate">{trainer.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">{trainer.role}</p>
              </div>
            </div>
            
            {/* Right: Navigation & CTA */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex space-x-4 xl:space-x-6">
                <a href="#bio" className="text-sm hover:text-rebuild-yellow transition-colors">Bio</a>
                <a href="#gallery" className="text-sm hover:text-rebuild-yellow transition-colors">Gallery</a>
                <a href="#specializations" className="text-sm hover:text-rebuild-yellow transition-colors">Skills</a>
                <a href="#contact" className="text-sm hover:text-rebuild-yellow transition-colors">Contact</a>
              </div>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-xs">Menu</span>
              </Button>
              
              {/* Book Now Button */}
              <Button
                onClick={openBookingModal}
                size="sm"
                className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <span className="hidden sm:inline">Book Now</span>
                <span className="sm:hidden">Book</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section - Mobile Responsive */}
      <section id="bio" className="py-12 sm:py-16 lg:py-20 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">About {trainer.name}</h2>
            <div className="text-gray-300 leading-relaxed space-y-4 sm:space-y-6 text-base sm:text-lg">
              {trainer.bioLong?.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              )) || <p>{trainer.bioShort}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery - Mobile Optimized */}
      <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-rebuild-black">
        <div className="container-custom">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">Media Gallery</h2>
          
          {/* Enhanced Tabs - Mobile First Design */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8 sm:mb-12">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-sm sm:max-w-md bg-rebuild-darkgray/50 backdrop-blur-sm border border-white/10 rounded-xl p-1">
                <TabsTrigger 
                  value="gallery" 
                  className="text-xs sm:text-sm data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black rounded-lg transition-all duration-200"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger 
                  value="beforeafter" 
                  className="text-xs sm:text-sm data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black rounded-lg transition-all duration-200"
                >
                  <span className="hidden sm:inline">Before/After</span>
                  <span className="sm:hidden">B/A</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="videos" 
                  className="text-xs sm:text-sm data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black rounded-lg transition-all duration-200"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger 
                  value="certificates" 
                  className="text-xs sm:text-sm data-[state=active]:bg-rebuild-yellow data-[state=active]:text-rebuild-black rounded-lg transition-all duration-200"
                >
                  <span className="hidden sm:inline">Certificates</span>
                  <span className="sm:hidden">Certs</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="gallery" className="space-y-6">
              <ImageGallery images={galleryImages} onImageClick={openLightbox} />
            </TabsContent>

            <TabsContent value="beforeafter" className="space-y-6">
              <BeforeAfterGallery images={beforeAfterImages} />
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <VideoGallery videos={trainer.videos || []} />
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <ImageGallery images={certificationImages} onImageClick={openLightbox} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Specializations & Certifications - Mobile Responsive */}
      <section id="specializations" className="py-12 sm:py-16 lg:py-20 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center justify-center lg:justify-start">
                <Target className="mr-2 sm:mr-3 text-rebuild-yellow w-6 h-6 sm:w-8 sm:h-8" />
                Specializations
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {trainer.specializations?.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rebuild-yellow flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">{spec}</span>
                  </div>
                )) || <p className="text-gray-400 italic text-center lg:text-left text-sm sm:text-base">No specializations listed</p>}
              </div>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center justify-center lg:justify-start">
                <Award className="mr-2 sm:mr-3 text-rebuild-yellow w-6 h-6 sm:w-8 sm:h-8" />
                Certifications
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {trainer.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rebuild-yellow flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">{cert}</span>
                  </div>
                )) || <p className="text-gray-400 italic text-center lg:text-left text-sm sm:text-base">No certifications listed</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Mobile Responsive */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-rebuild-black">
        <div className="container-custom text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Ready to Start Your Journey?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed">
            Book a consultation with {trainer.name} and take the first step towards your fitness transformation.
          </p>
          <Button
            onClick={openBookingModal}
            size="lg"
            className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto max-w-md"
          >
            Book Your Consultation
          </Button>
        </div>
      </section>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={trainer.images || []}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        trainer={trainer}
        formData={bookingForm}
        setFormData={setBookingForm}
        onSubmit={handleBookingSubmit}
        submitting={submittingBooking}
      />
    </div>
  );
};

// Gallery Components - Mobile Optimized
const ImageGallery: React.FC<{
  images: TrainerProfile['images'];
  onImageClick: (index: number) => void;
}> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="bg-rebuild-darkgray/30 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {images.map((image, index) => (
        <div
          key={index}
          className="aspect-square overflow-hidden rounded-lg sm:rounded-xl cursor-pointer group bg-rebuild-darkgray/20 border border-white/10 hover:border-rebuild-yellow/50 transition-all duration-300"
          onClick={() => onImageClick(index)}
        >
          <ResponsiveImage
            src={image.url}
            alt={image.altText || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>
      ))}
    </div>
  );
};

const BeforeAfterGallery: React.FC<{
  images: TrainerProfile['images'];
}> = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="bg-rebuild-darkgray/30 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">No before/after images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {images.map((image, index) => (
        <Card key={index} className="bg-rebuild-darkgray/50 border-white/10 hover:border-rebuild-yellow/30 transition-all duration-300 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-lg mb-3 sm:mb-4 bg-rebuild-black/20">
              <ResponsiveImage
                src={image.url}
                alt={image.altText || `Before/After ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {image.caption && (
              <p className="text-sm sm:text-base text-gray-300 text-center">{image.caption}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const VideoGallery: React.FC<{
  videos: TrainerProfile['videos'];
}> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="bg-rebuild-darkgray/30 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Play className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base">No videos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {videos.map((video, index) => (
        <Card key={index} className="bg-rebuild-darkgray/50 border-white/10 hover:border-rebuild-yellow/30 transition-all duration-300 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="aspect-video bg-rebuild-black/40 rounded-lg mb-3 sm:mb-4 flex items-center justify-center hover:bg-rebuild-black/60 transition-colors duration-300 cursor-pointer group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-rebuild-yellow/20 flex items-center justify-center group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-rebuild-yellow ml-1" />
              </div>
            </div>
            <h4 className="font-semibold mb-2 text-sm sm:text-base overflow-hidden">{video.title}</h4>
            {video.description && (
              <p className="text-xs sm:text-sm text-gray-300 overflow-hidden">{video.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Lightbox Component
const ImageLightbox: React.FC<{
  isOpen: boolean;
  images: TrainerProfile['images'];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ isOpen, images, currentIndex, onClose, onNext, onPrev }) => {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-full sm:h-auto bg-black border-gray-800 p-2 sm:p-4">
        <div className="relative w-full h-full">
          {/* Close Button - Mobile Optimized */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 sm:p-3 bg-black/60 rounded-full text-white hover:bg-black/80 backdrop-blur-sm"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          
          {/* Image Container - Mobile Responsive */}
          <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] flex items-center justify-center">
            <ResponsiveImage
              src={currentImage.url}
              alt={currentImage.altText || 'Gallery image'}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Navigation Arrows - Mobile Optimized */}
          {images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/60 rounded-full text-white hover:bg-black/80 backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={onNext}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/60 rounded-full text-white hover:bg-black/80 backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
          
          {/* Image Counter - Mobile Optimized */}
          {images.length > 1 && (
            <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
          
          {/* Caption - Mobile Optimized */}
          {currentImage.caption && (
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
              <p className="text-white text-sm sm:text-base">{currentImage.caption}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Booking Modal Component - World-Class Mobile-First Design
const BookingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trainer: TrainerProfile;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}> = ({ isOpen, onClose, trainer, formData, setFormData, onSubmit, submitting }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        // Base mobile-first responsive sizing
        "w-[95vw] max-w-[95vw] h-auto max-h-[90vh]",
        "sm:w-full sm:max-w-md md:max-w-lg",
        // Improved positioning and spacing for mobile
        "mx-auto my-4 sm:my-auto",
        // Enhanced styling
        "bg-rebuild-darkgray border border-gray-600/50 backdrop-blur-xl",
        "rounded-2xl sm:rounded-3xl shadow-2xl",
        // Overflow handling for mobile
        "overflow-y-auto overscroll-contain",
        // Animation improvements
        "duration-300"
      )}>
        
        {/* Enhanced Header with Trainer Context */}
        <DialogHeader className="relative pb-4 sm:pb-6 border-b border-gray-600/30">
          {/* Mobile-optimized close button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 sm:top-0 sm:right-0 z-10 p-2 sm:p-3 rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Trainer info with profile image */}
          <div className="flex items-center space-x-3 sm:space-x-4 pr-8 sm:pr-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 ring-2 ring-rebuild-yellow/20">
              <ResponsiveImage
                src={trainer.profileImage || trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-white text-base sm:text-lg lg:text-xl font-bold leading-tight text-left truncate">
                Book with {trainer.name}
              </DialogTitle>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
                {trainer.role}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Form with Enhanced Mobile UX */}
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5 py-4 sm:py-6">
          
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm sm:text-base font-medium">
              Full Name <span className="text-rebuild-yellow">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  "w-full bg-rebuild-black/80 border rounded-xl",
                  "px-4 py-3 sm:py-4 text-white placeholder-gray-500",
                  "text-sm sm:text-base leading-tight",
                  "focus:border-rebuild-yellow focus:ring-2 focus:ring-rebuild-yellow/20 focus:outline-none",
                  "border-gray-600/50 hover:border-gray-500/70",
                  "transition-all duration-200",
                  "backdrop-blur-sm"
                )}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm sm:text-base font-medium">
              Email Address <span className="text-rebuild-yellow">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn(
                  "w-full bg-rebuild-black/80 border rounded-xl",
                  "px-4 py-3 sm:py-4 text-white placeholder-gray-500",
                  "text-sm sm:text-base leading-tight",
                  "focus:border-rebuild-yellow focus:ring-2 focus:ring-rebuild-yellow/20 focus:outline-none",
                  "border-gray-600/50 hover:border-gray-500/70",
                  "transition-all duration-200",
                  "backdrop-blur-sm"
                )}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm sm:text-base font-medium">
              Phone Number <span className="text-rebuild-yellow">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={cn(
                  "w-full bg-rebuild-black/80 border rounded-xl",
                  "px-4 py-3 sm:py-4 text-white placeholder-gray-500",
                  "text-sm sm:text-base leading-tight",
                  "focus:border-rebuild-yellow focus:ring-2 focus:ring-rebuild-yellow/20 focus:outline-none",
                  "border-gray-600/50 hover:border-gray-500/70",
                  "transition-all duration-200",
                  "backdrop-blur-sm"
                )}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm sm:text-base font-medium">
              Additional Message
            </label>
            <div className="relative">
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className={cn(
                  "w-full bg-rebuild-black/80 border rounded-xl",
                  "px-4 py-3 sm:py-4 text-white placeholder-gray-500",
                  "text-sm sm:text-base leading-tight",
                  "focus:border-rebuild-yellow focus:ring-2 focus:ring-rebuild-yellow/20 focus:outline-none",
                  "border-gray-600/50 hover:border-gray-500/70",
                  "transition-all duration-200",
                  "backdrop-blur-sm resize-none"
                )}
                placeholder="Tell us about your fitness goals or any specific requirements..."
              />
            </div>
          </div>

          {/* Action Buttons - Mobile-First Design */}
          <div className="flex flex-col space-y-3 pt-4 sm:pt-6">
            
            {/* Primary CTA Button */}
            <Button
              type="submit"
              disabled={submitting}
              className={cn(
                "w-full h-12 sm:h-14 bg-gradient-to-r from-rebuild-yellow to-yellow-400",
                "text-rebuild-black font-bold text-base sm:text-lg",
                "rounded-xl shadow-lg shadow-rebuild-yellow/25",
                "hover:shadow-rebuild-yellow/40 hover:scale-[1.02]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "transition-all duration-200",
                "flex items-center justify-center space-x-2"
              )}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-rebuild-black/30 border-t-rebuild-black rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Book Consultation</span>
                </>
              )}
            </Button>

            {/* Secondary Cancel Button */}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={cn(
                "w-full h-10 sm:h-12 border-2 border-gray-600/50",
                "text-gray-300 hover:text-white font-medium text-sm sm:text-base",
                "rounded-xl bg-gray-800/20 hover:bg-gray-700/30",
                "transition-all duration-200",
                "backdrop-blur-sm"
              )}
            >
              Cancel
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="pt-3 sm:pt-4 border-t border-gray-600/20">
            <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
              We'll respond within 24 hours to schedule your consultation. 
              <br className="hidden sm:inline" />
              <span className="text-gray-400">Your information is kept private and secure.</span>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerProfilePage;
