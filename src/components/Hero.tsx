import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const quotes = [
    "Your Body is your weapon keep it strong",
    "Rebuild your body rebuild your Life",
    "Pain is fuel—turn it into power.",
    "Train insane or remain the same."
  ];
  
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Start muted to ensure we can autoplay
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  
  // Handle typing animation
  useEffect(() => {
    if (isTyping) {
      if (currentQuote.length < quotes[currentIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentQuote(quotes[currentIndex].substring(0, currentQuote.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Pause at the end
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentQuote.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentQuote(quotes[currentIndex].substring(0, currentQuote.length - 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsTyping(true);
      }
    }
  }, [currentQuote, currentIndex, isTyping, quotes]);
  
  // Unified function to get the active video element based on screen width
  const getActiveVideoRef = () => {
    if (window.innerWidth >= 768) {
      return desktopVideoRef.current;
    } else {
      return mobileVideoRef.current;
    }
  };
  
  // Handle autoplay with simplified audio control
  useEffect(() => {
    // Start both videos muted (browsers require this for autoplay)
    if (desktopVideoRef.current) desktopVideoRef.current.muted = true;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = true;
    
    // Try to autoplay the videos (will work because they're muted)
    const playVideos = async () => {
      try {
        if (desktopVideoRef.current) await desktopVideoRef.current.play();
        if (mobileVideoRef.current) await mobileVideoRef.current.play();
      } catch (error) {
        // Video autoplay failed - this is expected in some browsers
      }
    };
    
    playVideos();
    
    // Function to enable audio on user interaction
    const enableAudio = () => {
      const activeVideo = getActiveVideoRef();
      if (activeVideo && isMuted) {
        activeVideo.muted = false;
        setIsMuted(false);
        
        // Remove listeners once audio is enabled
        document.removeEventListener('scroll', enableAudio);
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
      }
    };
    
    // Add interaction listeners to enable audio
    document.addEventListener('scroll', enableAudio);
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    
    // Media query listener to ensure right video is played based on screen size
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = () => {
      if (mediaQuery.matches) {
        // Desktop view - ensure desktop video is playing with correct muted state
        if (desktopVideoRef.current) {
          desktopVideoRef.current.muted = isMuted;
          desktopVideoRef.current.play();
        }
      } else {
        // Mobile view - ensure mobile video is playing with correct muted state
        if (mobileVideoRef.current) {
          mobileVideoRef.current.muted = isMuted;
          mobileVideoRef.current.play();
        }
      }
    };
    
    // Set up media query listener
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      document.removeEventListener('scroll', enableAudio);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []); // Empty dependency array - we only want this to run once
  
  // Handle manual mute/unmute with simplified logic
  const toggleMute = () => {
    const activeVideo = getActiveVideoRef();
    
    if (activeVideo) {
      const newMutedState = !isMuted;
      activeVideo.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        {/* Desktop Video (active on md screens and up) */}
        <video
          ref={desktopVideoRef}
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          autoPlay
          loop
          playsInline
          muted
          preload="auto"
          poster="https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?auto=format&fit=crop&q=80&w=1770"
        >
          <source src="https://res.cloudinary.com/dvmrhs2ek/video/upload/v1751626901/rkijnrafr0e4h9pvkzvh.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Mobile Video (active on smaller than md screens) */}
        <video
          ref={mobileVideoRef}
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
          autoPlay
          loop
          playsInline
          muted
          preload="auto"
          poster="https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?auto=format&fit=crop&q=80&w=1770"
          onError={(e) => {/* Mobile video error */}}
        >
          <source 
            src="https://res.cloudinary.com/dvmrhs2ek/video/upload_v1746802131/m2x43bfgesjeqosh8cvw.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Video overlay for better text visibility - increased opacity */}
        <div className="absolute inset-0 bg-black opacity-0"></div>
      </div>
      
      {/* Mute/Unmute Button - Premium UI with emoji icons */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-20 
                   bg-white/95 backdrop-blur-sm text-rebuild-black 
                   p-3 sm:p-4 rounded-full 
                   transition-all duration-300 ease-in-out
                   hover:scale-110 hover:bg-rebuild-yellow hover:shadow-2xl
                   shadow-lg border-2 border-white/20
                   active:scale-95"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        <span className="text-xl sm:text-2xl font-bold filter drop-shadow-sm">
          {isMuted ? "🔇" : "🔊"}
        </span>
      </button>
      
      {/* Enhanced overlay gradient for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black via-rebuild-black/80 to-black/20 z-10" />
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-20">
        <div className="max-w-4xl">
          <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 sm:mb-6 pb-1 drop-shadow-md text-sm sm:text-base">
            WELCOME TO
          </h4>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-shadow-lg leading-tight">
            <span className="block">REBUILD FITNESS</span>
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 font-light min-h-[3rem] sm:min-h-[4rem] flex items-center text-shadow-md">
            <span>{currentQuote}</span>
            <span className={`ml-1 inline-block w-0.5 sm:w-1 h-6 sm:h-8 bg-rebuild-yellow ${isTyping ? 'animate-blink' : 'opacity-0'}`}></span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
            <Link to="/membership" className="btn-primary flex items-center justify-center text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8">
              JOIN US <ChevronRight size={16} className="ml-1 sm:ml-2" />
            </Link>
            <Link to="/gyms" className="btn-outline flex items-center justify-center text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8">
              VISIT OUR GYM <ChevronRight size={16} className="ml-1 sm:ml-2" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Arrow down animation */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="#F6C90E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
