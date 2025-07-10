import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import ResponsiveImage from '@/components/ResponsiveImage';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Target, 
  Heart, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  Users, 
  Award, 
  Zap, 
  CheckCircle,
  Dumbbell,
  Star,
  Calendar,
  Activity,
  UserCheck
} from 'lucide-react';
import { enhancedTrainersService, type TrainerProfile } from '@/lib/firebaseServices';
import LoadingScreen from '@/components/LoadingScreen';

const About = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2018");
  const [scrollY, setScrollY] = useState(0);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Core Values data
  const coreValues = [
    {
      icon: Shield,
      title: "Integrity First",
      description: "Honest, transparent fitness guidance without shortcuts or false promises. We prioritize your long-term health over quick fixes.",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: Heart,
      title: "Sustainable Wellness",
      description: "Focus on building lasting habits that improve your overall health, not just temporary aesthetic changes.",
      color: "from-red-500/20 to-pink-500/20"
    },
    {
      icon: Dumbbell,
      title: "Natural Transformation",
      description: "Achieve impressive results through science-backed natural methods, proper nutrition, and consistent training.",
      color: "from-green-500/20 to-emerald-500/20"
    }
  ];

  // Journey milestones
  const milestones = [
    {
      year: "2018",
      title: "Foundation",
      description: "Started as a small studio with a big vision - natural fitness for everyone",
      achievement: "First steroid-free gym in Kakinada"
    },
    {
      year: "2020",
      title: "Growth",
      description: "Expanded facilities and introduced specialized training programs",
      achievement: "500+ successful transformations"
    },
    {
      year: "2023",
      title: "Innovation",
      description: "Premium facility upgrade with cutting-edge equipment and recovery center",
      achievement: "Award-winning natural fitness center"
    },
    {
      year: "2025",
      title: "Future",
      description: "Expanding across India while maintaining our core natural fitness philosophy",
      achievement: "Building India's largest natural fitness network"
    }
  ];

  // Achievement stats
  const stats = [
    { 
      value: "7+", 
      label: "Years of Excellence",
      icon: Calendar,
      description: "Serving Kakinada since 2018"
    },
    { 
      value: "2000+", 
      label: "Lives Transformed",
      icon: Users,
      description: "Natural transformations achieved"
    },
    { 
      value: "15", 
      label: "Expert Trainers",
      icon: Award,
      description: "Certified fitness professionals"
    },
    { 
      value: "100%", 
      label: "Natural Methods",
      icon: Shield,
      description: "Zero steroids, pure results"
    }
  ];

  // Fetch trainers from Firebase
  useEffect(() => {
    document.title = "About Us | REBUILD.fit - Natural Fitness Ecosystem";
    
    try {
      // Subscribe to trainers
      const trainersUnsubscribe = enhancedTrainersService.onSnapshot((trainersList) => {
        setTrainers(trainersList);
        setLoading(false);
      });
      
      return trainersUnsubscribe;
    } catch (error) {
      setTrainers([]);
      setLoading(false);
      return () => {};
    }
  }, []);

  // Scroll handler for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-rebuild-black text-white">
      {/* Hero Banner with Parallax Effect */}
      <section 
        className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden"
        style={{ 
          perspective: "1000px"
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80')",
            filter: "brightness(40%)",
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/60 via-transparent to-rebuild-black" />
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            {/* Accent Badge */}
            <div className="inline-block bg-rebuild-yellow/20 px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6">
              <span className="text-rebuild-yellow text-xs sm:text-sm font-medium">OUR STORY</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 leading-tight">ABOUT REBUILD</h1>
            <div className="w-16 sm:w-20 h-1.5 bg-rebuild-yellow mb-4 sm:mb-6 mx-auto md:mx-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto md:mx-0 leading-relaxed">
              Building India's First Natural Fitness Ecosystem — Where Real Transformation Happens
            </h2>
            
            <motion.div 
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button 
                asChild
                className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 transition-colors group text-sm sm:text-base py-3 sm:py-4 px-6"
              >
                <Link to="/membership">
                  JOIN OUR COMMUNITY <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="border-rebuild-yellow text-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black text-sm sm:text-base py-3 sm:py-4 px-6"
              >
                <a href="#vision-mission">
                  LEARN OUR PHILOSOPHY <ChevronDown className="ml-2" size={16} />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-rebuild-black to-transparent" />
        <div className="absolute -bottom-2 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-rebuild-black">
            <path fill="currentColor" fillOpacity="1" d="M0,128L60,138.7C120,149,240,171,360,165.3C480,160,600,128,720,138.7C840,149,960,203,1080,208C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Our Story */}
      <section id="our-story" className="py-16 sm:py-20 md:py-28 bg-rebuild-black relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rebuild-yellow/3 via-transparent to-transparent"></div>
        <div className="absolute top-1/3 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-rebuild-yellow/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/2 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="h-px w-6 sm:w-8 bg-rebuild-yellow"></div>
                <span className="text-rebuild-yellow tracking-widest uppercase text-xs sm:text-sm font-medium">Our Origins</span>
                <div className="h-px w-8 bg-rebuild-yellow"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">THE REBUILD STORY</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <div className="space-y-6 text-gray-300">
                <p className="leading-relaxed">
                  Founded in 2018 by fitness visionary <span className="text-white font-medium">Sagar Akula</span>, Rebuild Gym started as a small personal training studio with a radical mission: to create a <span className="text-rebuild-yellow">steroid-free fitness environment</span> where natural transformation is the only path.
                </p>
                
                <p className="leading-relaxed">
                  Having witnessed the harmful effects of performance-enhancing substances on young fitness enthusiasts, Sagar decided to create a space where people could achieve impressive results without compromising their health.
                </p>
                
                <p className="leading-relaxed">
                  What began as a small studio has now expanded to specialized facilities across Kakinada, each catering to different demographics but all united by the core philosophy of natural fitness and genuine transformation.
                </p>
                
                <div className="pt-4">
                  <a href="#meet-the-trainers" className="inline-flex items-center text-rebuild-yellow hover:underline group">
                    Meet our expert training team <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-700/50">
                <ResponsiveImage 
                  src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1331&q=80"
                  alt="Rebuild Gym Interior"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <div className="flex items-center gap-3">
                    <div className="h-0.5 w-12 bg-rebuild-yellow"></div>
                    <blockquote className="text-xl italic">
                      "We believe in natural strength, not artificial shortcuts."
                    </blockquote>
                  </div>
                  <p className="text-lg font-bold mt-2">- Sagar Akula, Founder</p>
                </div>
              </div>
             
              
              {/* Decorative Corner Elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 border-t-2 border-l-2 border-rebuild-yellow/20 rounded-tl-3xl pointer-events-none hidden lg:block"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 border-b-2 border-r-2 border-rebuild-yellow/20 rounded-br-3xl pointer-events-none hidden lg:block"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-rebuild-darkgray relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-rebuild-black/30 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-rebuild-yellow/30 transition-all duration-500"
              >
                <div className="text-4xl md:text-5xl font-bold text-rebuild-yellow mb-2">{stat.value}</div>
                <p className="text-gray-300 text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Vision & Mission */}
      <section id="vision-mission" className="py-20 md:py-28 bg-gradient-to-b from-rebuild-black to-rebuild-darkgray relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-gym-texture" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-rebuild-yellow"></div>
              <span className="text-rebuild-yellow tracking-widest uppercase text-sm font-medium">Our Purpose</span>
              <div className="h-px w-8 bg-rebuild-yellow"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">VISION & MISSION</h2>
            <div className="w-24 h-1 bg-rebuild-yellow mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Guided by our commitment to natural fitness, we're building more than a gym—we're creating a movement.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-rebuild-black/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 h-full">
                <div className="w-16 h-16 rounded-full bg-rebuild-yellow/20 flex items-center justify-center mb-6">
                  <Zap size={28} className="text-rebuild-yellow" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">OUR VISION</h3>
                <div className="w-12 h-1 bg-rebuild-yellow mb-8" />
                
                <p className="text-xl text-gray-100 mb-8">
                  To create India's largest steroid-free fitness community where natural transformation is celebrated and sustainable health is prioritized over quick results.
                </p>
                
                <div className="mt-10 space-y-6">
                  <h4 className="text-xl font-bold mb-4">Long-Term Goals</h4>
                  <div className="space-y-5">
                    <motion.div 
                      className="flex items-start gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-rebuild-yellow/20 flex-shrink-0 flex items-center justify-center group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                        <Target size={20} className="text-rebuild-yellow" />
                      </div>
                      <div>
                        <h5 className="font-bold mb-1">National Expansion</h5>
                        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                          Expand to 10 locations across Andhra Pradesh by 2028, creating a network of natural fitness centers
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-rebuild-yellow/20 flex-shrink-0 flex items-center justify-center group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                        <Target size={20} className="text-rebuild-yellow" />
                      </div>
                      <div>
                        <h5 className="font-bold mb-1">Trainer Certification</h5>
                        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                          Develop a certification program for natural fitness trainers, establishing a new standard in the industry
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-rebuild-yellow/20 flex-shrink-0 flex items-center justify-center group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                        <Target size={20} className="text-rebuild-yellow" />
                      </div>
                      <div>
                        <h5 className="font-bold mb-1">Digital Ecosystem</h5>
                        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                          Launch comprehensive mobile apps and online resources for tracking natural fitness progress
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-rebuild-black/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 h-full">
                <div className="w-16 h-16 rounded-full bg-rebuild-yellow/20 flex items-center justify-center mb-6">
                  <Award size={28} className="text-rebuild-yellow" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">OUR MISSION</h3>
                <div className="w-12 h-1 bg-rebuild-yellow mb-8" />
                
                <p className="text-xl text-gray-100 mb-8">
                  To provide science-backed, steroid-free fitness solutions through specialized gyms that cater to different demographics while maintaining the highest standards of training and nutrition guidance.
                </p>
                
                <div className="mt-10 space-y-6">
                  <h4 className="text-xl font-bold mb-4">How We Work</h4>
                  <div className="space-y-5">
                    <motion.div 
                      className="flex items-start gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-rebuild-yellow/20 flex-shrink-0 flex items-center justify-center group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                        <CheckCircle size={20} className="text-rebuild-yellow" />
                      </div>
                      <div>
                        <h5 className="font-bold mb-1">Evidence-Based Training</h5>
                        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                          All workout programs are grounded in scientific research and regularly assessed for effectiveness
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-rebuild-yellow/20 flex-shrink-0 flex items-center justify-center group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                        <CheckCircle size={20} className="text-rebuild-yellow" />
                      </div>
                      <div>
                        <h5 className="font-bold mb-1">Natural Nutrition</h5>
                        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                          Personalized nutrition planning without harmful supplements, focusing on whole foods and sustainable habits
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-rebuild-yellow/20 flex-shrink-0 flex items-center justify-center group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                        <CheckCircle size={20} className="text-rebuild-yellow" />
                      </div>
                      <div>
                        <h5 className="font-bold mb-1">Individual Approach</h5>
                        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                          Every member receives a customized fitness journey designed around their specific goals, abilities, and limitations
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Meet Our Trainers */}
      <section id="meet-the-trainers" className="py-20 md:py-28 bg-rebuild-darkgray relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 bg-grid-pattern" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-rebuild-yellow"></div>
              <span className="text-rebuild-yellow tracking-widest uppercase text-sm font-medium">Our Fitness Experts</span>
              <div className="h-px w-8 bg-rebuild-yellow"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">MEET OUR TRAINERS</h2>
            <div className="w-24 h-1 bg-rebuild-yellow mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The passionate fitness professionals behind our natural transformation philosophy and your journey to better health
            </p>
          </motion.div>
          
          {/* Trainers Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {trainers.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <div className="inline-flex bg-rebuild-black p-10 rounded-lg">
                  <div className="flex flex-col items-center">
                    <UserCheck size={60} className="text-rebuild-yellow mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold mb-2">Meet Our Trainers</h3>
                    <p className="text-gray-400 max-w-md mb-6">
                      Visit our trainers page to meet our full team of fitness professionals ready to guide you on your transformation journey.
                    </p>
                    <Button asChild className="bg-rebuild-yellow hover:bg-yellow-500 text-rebuild-black">
                      <Link to="/trainers">
                        View All Trainers <ChevronRight size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              trainers.map((trainer, index) => {
                // Get image URL with fallback
                const imageUrl = trainer.profileImage || trainer.image || 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                
                return (
                  <motion.div
                    key={trainer.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    className="group relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-rebuild-yellow/40 transition-all duration-500 hover:shadow-2xl hover:shadow-rebuild-yellow/10 hover:-translate-y-2"
                  >
                    {/* Premium hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rebuild-yellow/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Image Section - Professional full-width display */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={trainer.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1571019613540-996a69725630?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                      
                      {/* Subtle gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Role badge - professional design */}
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-rebuild-yellow px-3 py-1.5 rounded-lg text-xs font-semibold border border-rebuild-yellow/20">
                        {trainer.role}
                      </div>
                    </div>
                  
                  {/* Content Section - Premium design */}
                  <div className="p-6">
                    {/* Name and title */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-rebuild-yellow transition-colors duration-300 mb-1">
                        {trainer.name}
                      </h3>
                      
                      {/* Specialization with icon */}
                      <div className="flex items-center gap-2 text-gray-300">
                        <div className="w-4 h-4 rounded-full bg-rebuild-yellow/20 flex items-center justify-center">
                          <Dumbbell size={10} className="text-rebuild-yellow" />
                        </div>
                        <p className="text-sm font-medium">
                          {trainer.specializations?.join(', ') || trainer.specialization} {/* Use new array field with fallback */}
                        </p>
                      </div>
                    </div>
                    
                    {/* Experience badge */}
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 group-hover:border-rebuild-yellow/20 transition-colors duration-300">
                      <div className="w-5 h-5 rounded-full bg-rebuild-yellow/20 flex items-center justify-center">
                        <Award size={12} className="text-rebuild-yellow" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">
                        {trainer.experienceYears ? `${trainer.experienceYears} years` : trainer.experience || 'Professional'} {/* Use new field with fallback */}
                      </span>
                    </div>
                  </div>
                  
                  {/* Premium border glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-rebuild-yellow/20 via-transparent to-rebuild-yellow/20 blur-xl" />
                  </div>
                </motion.div>
                );
              })
            )}
          </motion.div>
          
          <div className="text-center mt-12">
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-rebuild-yellow text-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black"
            >
              <Link to="/trainers" className="group">
                VIEW ALL TRAINERS <Users size={18} className="ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Brand Values */}
      <section className="py-20 md:py-28 bg-rebuild-black relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rebuild-yellow/3 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-rebuild-yellow/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-500/2 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-rebuild-yellow"></div>
              <span className="text-rebuild-yellow tracking-widest uppercase text-sm font-medium">What We Stand For</span>
              <div className="h-px w-8 bg-rebuild-yellow"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">OUR CORE VALUES</h2>
            <div className="w-24 h-1 bg-rebuild-yellow mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do at Rebuild Gym, from trainer selection to program design
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {/* Value 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-rebuild-darkgray/80 to-rebuild-darkgray/40 p-8 rounded-2xl hover:shadow-lg hover:shadow-rebuild-yellow/10 transition-all duration-500 border border-gray-700/50 hover:border-rebuild-yellow/20 h-full transform hover:-translate-y-2">
                <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-rebuild-yellow/30 transition-all duration-300">
                  <Shield size={32} className="text-rebuild-yellow" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-rebuild-yellow transition-colors">Integrity in Fitness</h3>
                <p className="text-gray-300 leading-relaxed">
                  We believe in honest, realistic fitness guidance without false promises or harmful shortcuts. Our trainers are committed to ethical practices that prioritize your long-term health.
                </p>
              </div>
            </motion.div>
            
            {/* Value 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-rebuild-darkgray/80 to-rebuild-darkgray/40 p-8 rounded-2xl hover:shadow-lg hover:shadow-rebuild-yellow/10 transition-all duration-500 border border-gray-700/50 hover:border-rebuild-yellow/20 h-full transform hover:-translate-y-2">
                <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-rebuild-yellow/30 transition-all duration-300">
                  <Heart size={32} className="text-rebuild-yellow" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-rebuild-yellow transition-colors">Long-Term Wellness</h3>
                <p className="text-gray-300 leading-relaxed">
                  We focus on sustainable fitness approaches that improve your overall health and wellbeing, not just your appearance. Our goal is to help you maintain results for life, not just for a season.
                </p>
              </div>
            </motion.div>
            
            {/* Value 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-rebuild-darkgray/80 to-rebuild-darkgray/40 p-8 rounded-2xl hover:shadow-lg hover:shadow-rebuild-yellow/10 transition-all duration-500 border border-gray-700/50 hover:border-rebuild-yellow/20 h-full transform hover:-translate-y-2">
                <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-rebuild-yellow/30 transition-all duration-300">
                  <Dumbbell size={32} className="text-rebuild-yellow" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-rebuild-yellow transition-colors">Empowerment Through Discipline</h3>
                <p className="text-gray-300 leading-relaxed">
                  We believe true transformation comes through commitment, consistency, and mental strength. We help you develop the discipline needed to achieve your goals naturally and sustain them long-term.
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Testimonial Quote */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 max-w-4xl mx-auto text-center"
          >
            <div className="h-0.5 w-16 bg-rebuild-yellow/50 mx-auto mb-8"></div>
            <blockquote className="text-2xl md:text-3xl italic text-gray-300 font-light">
              "Research shows that natural, sustainable fitness methods not only lead to better long-term results, but also significantly reduce health risks associated with performance-enhancing substances."
            </blockquote>
            <footer className="mt-8 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-rebuild-yellow/20 flex items-center justify-center mr-4">
                <Award size={24} className="text-rebuild-yellow" />
              </div>
              <div className="text-left">
                <div className="text-rebuild-yellow font-medium">Dr. Rajesh Kumar</div>
                <div className="text-sm text-gray-400">Sports Medicine Specialist</div>
              </div>
            </footer>
          </motion.div>
        </div>
      </section>
      
      {/* Journey Timeline */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-rebuild-darkgray to-rebuild-black relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 bg-gym-texture" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-rebuild-yellow"></div>
              <span className="text-rebuild-yellow tracking-widest uppercase text-sm font-medium">Our Progress</span>
              <div className="h-px w-8 bg-rebuild-yellow"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">OUR JOURNEY</h2>
            <div className="w-24 h-1 bg-rebuild-yellow mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The evolution of Rebuild from a small idea to a thriving fitness ecosystem
            </p>
          </motion.div>
          
          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-rebuild-black/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-rebuild-yellow/30 transition-all duration-500 h-full">
                  {/* Year Badge */}
                  <div className="absolute -top-4 left-6">
                    <div className="bg-rebuild-yellow px-4 py-2 rounded-full">
                      <span className="text-rebuild-black font-bold text-sm">{milestone.year}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="pt-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-rebuild-yellow transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {milestone.description}
                    </p>
                    
                    {/* Achievement */}
                    <div className="bg-rebuild-yellow/10 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-rebuild-yellow" />
                        <span className="text-rebuild-yellow text-sm font-medium">Achievement</span>
                      </div>
                      <p className="text-white text-sm mt-1 font-medium">
                        {milestone.achievement}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Us CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300">
        {/* Dynamic background gradients and patterns */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Subtle grid or dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
          {/* Decorative SVG blobs */}
          <svg className="absolute -top-24 -left-24 w-96 h-96 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FDE047" d="M44.8,-70.7C58.2,-62.2,68.6,-48.3,74.2,-33.2C79.8,-18.1,80.6,-1.8,75.6,12.7C70.6,27.2,59.8,39.9,47.2,50.7C34.6,61.5,20.3,70.4,4.7,72.2C-10.9,74,-27.8,68.7,-41.2,59.1C-54.6,49.5,-64.5,35.6,-70.2,19.8C-75.9,4,-77.4,-13.7,-71.7,-27.8C-66,-41.9,-53.1,-52.5,-39.1,-61.2C-25.1,-69.9,-10,-76.7,5.7,-83.2C21.4,-89.7,42.8,-95.2,44.8,-70.7Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FACC15" d="M41.2,-68.2C54.7,-59.7,66.2,-48.2,72.6,-34.2C79,-20.2,80.2,-3.7,75.9,11.7C71.6,27.1,61.8,41.3,49.2,52.7C36.6,64.1,21.3,72.7,5.3,71.7C-10.7,70.7,-21.4,60.1,-34.1,52.2C-46.8,44.3,-61.5,39.1,-68.2,28.1C-74.9,17.1,-73.6,0.3,-67.2,-13.7C-60.8,-27.7,-49.2,-39,-36.2,-47.6C-23.2,-56.2,-11.6,-62.1,2.2,-65.2C16,-68.3,32,-68.7,41.2,-68.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="container-custom relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-3xl mx-auto"
          >
            {/* Glassmorphism Card */}
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl px-6 py-12 md:px-12 md:py-16 border border-yellow-100/60">
              {/* Animated accent ring */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full blur-lg opacity-70 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-rebuild-black mb-6 drop-shadow-sm tracking-tight">
                JOIN THE <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">NATURAL FITNESS MOVEMENT</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-800/90 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                Be part of something authentic. Experience real transformation through <span className="font-semibold text-rebuild-black">natural means</span>, guided by experts who truly care about your long-term health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-rebuild-black text-white hover:bg-gray-900 px-8 py-6 h-auto text-lg font-semibold shadow-lg shadow-yellow-200/30 hover:scale-105 transition-all duration-200"
                >
                  <Link to="/membership" className="group">
                    EXPLORE MEMBERSHIPS <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-rebuild-black text-rebuild-black hover:bg-rebuild-black hover:text-white px-8 py-6 h-auto text-lg font-semibold shadow hover:scale-105 transition-all duration-200"
                >
                  <Link to="/contact">
                    CONTACT US
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default About;
