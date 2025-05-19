import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Volume2, VolumeX } from 'lucide-react';

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
        console.error("Error autoplaying video:", error);
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
          <source src="https://res.cloudinary.com/dvmrhs2ek/video/upload/v1746949217/wxvtdjgnor3vlq1li1ou.mp4" type="video/mp4" />
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
        >
          <source src="https://res.cloudinary.com/dvmrhs2ek/video/upload_v1746802131/m2x43bfgesjeqosh8cvw.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video overlay for better text visibility */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      {/* Mute/Unmute Button - fixed icon order to correctly represent state */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 bg-rebuild-yellow text-rebuild-black p-3 rounded-full transition-all hover:scale-110 shadow-lg"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black via-rebuild-black/70 to-transparent z-10" />
      
      {/* Content */}
      <div className="container-custom relative z-20">
        <div className="max-w-3xl">
          <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-6 pb-1">
            WELCOME TO
          </h4>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="block">REBUILD FITNESS</span>
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-8 font-light min-h-[4rem] flex items-center">
            <span>{currentQuote}</span>
            <span className={`ml-1 inline-block w-1 h-8 bg-rebuild-yellow ${isTyping ? 'animate-blink' : 'opacity-0'}`}></span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/membership" className="btn-primary flex items-center justify-center">
              JOIN US <ChevronRight size={20} className="ml-1" />
            </Link>
            <Link to="/gyms" className="btn-outline flex items-center justify-center">
              EXPLORE BRANCHES <ChevronRight size={20} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Arrow down animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="#F6C90E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
