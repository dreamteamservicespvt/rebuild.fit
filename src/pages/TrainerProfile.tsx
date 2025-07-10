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
      {/* Hero Section with proper height and z-index hierarchy */}
      <section className="relative h-[80vh] overflow-visible">
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

        {/* Back Button - positioned properly with higher z-index */}
        <div className="absolute top-24 left-6 z-30">
          <Button
            variant="outline"
            onClick={() => navigate('/trainers')}
            className="bg-black/60 border-white/30 text-white hover:bg-black/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trainers
          </Button>
        </div>

        {/* Hero Content - highest z-index for text content */}
        <div className="container-custom relative z-20 h-full pt-24 pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12">
            {/* Left Content - Text and Stats with proper spacing */}
            <motion.div 
              className="flex-1 space-y-6 relative z-20 lg:max-w-[50%]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-rebuild-yellow text-rebuild-black w-fit">
                {trainer.role}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {trainer.name}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-lg">
                {trainer.bioShort}
              </p>
              
              {/* Quick Stats - properly spaced and visible */}
              <div className="relative z-20 grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-rebuild-yellow">
                    {trainer.experienceYears || 10}+
                  </div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-rebuild-yellow">
                    {trainer.specializations?.length || 4}
                  </div>
                  <div className="text-sm text-gray-400">Specializations</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-rebuild-yellow">
                    {trainer.certifications?.length || 3}
                  </div>
                  <div className="text-sm text-gray-400">Certifications</div>
                </div>
              </div>
              
              {/* Action Buttons with proper spacing */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Button 
                  onClick={openBookingModal}
                  className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 px-8"
                >
                  Book Consultation
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Gallery
                </Button>
              </div>
            </motion.div>
            
            {/* Right Image - positioned with lower z-index */}
            <motion.div 
              className="relative z-10 flex-shrink-0 lg:max-w-[40%]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl max-w-md mx-auto">
                <ResponsiveImage
                  src={trainer.profileImage || trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isSticky ? "bg-black/95 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      )}>
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <ResponsiveImage
                  src={trainer.profileImage || trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{trainer.name}</h3>
                <p className="text-sm text-gray-400">{trainer.role}</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#bio" className="text-sm hover:text-rebuild-yellow transition-colors">Bio</a>
              <a href="#gallery" className="text-sm hover:text-rebuild-yellow transition-colors">Gallery</a>
              <a href="#specializations" className="text-sm hover:text-rebuild-yellow transition-colors">Skills</a>
              <a href="#contact" className="text-sm hover:text-rebuild-yellow transition-colors">Contact</a>
              <Button
                onClick={openBookingModal}
                size="sm"
                className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <section id="bio" className="py-20 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">About {trainer.name}</h2>
            <div className="text-gray-300 leading-relaxed space-y-6 text-lg">
              {trainer.bioLong?.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              )) || <p>{trainer.bioShort}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section id="gallery" className="py-20 bg-rebuild-black">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">Media Gallery</h2>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto mb-12">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="beforeafter">Before/After</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              <ImageGallery images={galleryImages} onImageClick={openLightbox} />
            </TabsContent>

            <TabsContent value="beforeafter">
              <BeforeAfterGallery images={beforeAfterImages} />
            </TabsContent>

            <TabsContent value="videos">
              <VideoGallery videos={trainer.videos || []} />
            </TabsContent>

            <TabsContent value="certificates">
              <ImageGallery images={certificationImages} onImageClick={openLightbox} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Specializations & Certifications */}
      <section id="specializations" className="py-20 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-bold mb-8 flex items-center">
                <Target className="mr-3 text-rebuild-yellow" />
                Specializations
              </h3>
              <div className="space-y-4">
                {trainer.specializations?.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-rebuild-yellow flex-shrink-0" />
                    <span className="text-gray-300">{spec}</span>
                  </div>
                )) || <p className="text-gray-400 italic">No specializations listed</p>}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-8 flex items-center">
                <Award className="mr-3 text-rebuild-yellow" />
                Certifications
              </h3>
              <div className="space-y-4">
                {trainer.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-rebuild-yellow flex-shrink-0" />
                    <span className="text-gray-300">{cert}</span>
                  </div>
                )) || <p className="text-gray-400 italic">No certifications listed</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-rebuild-black">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Journey?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
            Book a consultation with {trainer.name} and take the first step towards your fitness transformation.
          </p>
          <Button
            onClick={openBookingModal}
            size="lg"
            className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 px-12 py-4 text-lg"
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

// Gallery Components
const ImageGallery: React.FC<{
  images: TrainerProfile['images'];
  onImageClick: (index: number) => void;
}> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <div
          key={index}
          className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => onImageClick(index)}
        >
          <ResponsiveImage
            src={image.url}
            alt={image.altText || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
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
      <div className="text-center py-12">
        <p className="text-gray-400">No before/after images available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {images.map((image, index) => (
        <Card key={index} className="bg-rebuild-darkgray border-gray-700">
          <CardContent className="p-4">
            <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4">
              <ResponsiveImage
                src={image.url}
                alt={image.altText || `Before/After ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {image.caption && (
              <p className="text-sm text-gray-300">{image.caption}</p>
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
      <div className="text-center py-12">
        <p className="text-gray-400">No videos available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <Card key={index} className="bg-rebuild-darkgray border-gray-700">
          <CardContent className="p-4">
            <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="font-semibold mb-2">{video.title}</h4>
            {video.description && (
              <p className="text-sm text-gray-300">{video.description}</p>
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
      <DialogContent className="max-w-4xl bg-black border-gray-800">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="aspect-video flex items-center justify-center">
            <ResponsiveImage
              src={currentImage.url}
              alt={currentImage.altText || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          {currentImage.caption && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 p-4 rounded">
              <p className="text-white text-sm">{currentImage.caption}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Booking Modal Component
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
      <DialogContent className="max-w-md bg-rebuild-darkgray border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Book Consultation with {trainer.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-2 text-white focus:border-rebuild-yellow focus:outline-none"
            />
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
            >
              {submitting ? 'Sending...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerProfilePage;
