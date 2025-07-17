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
  
  // Handle autoplay and video state synchronization
  useEffect(() => {
    // Start both videos muted (browsers require this for autoplay)
    if (desktopVideoRef.current) {
      desktopVideoRef.current.muted = isMuted;
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.muted = isMuted;
    }
    
    // Try to autoplay the videos (will work because they're muted)
    const playVideos = async () => {
      try {
        if (desktopVideoRef.current) await desktopVideoRef.current.play();
        if (mobileVideoRef.current) await mobileVideoRef.current.play();
      } catch (error) {
        // Video autoplay failed - this is expected in some browsers
        console.log('Video autoplay failed:', error);
      }
    };
    
    playVideos();
    
    // Media query listener to ensure right video is played based on screen size
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = () => {
      if (mediaQuery.matches) {
        // Desktop view - ensure desktop video is playing with correct muted state
        if (desktopVideoRef.current) {
          desktopVideoRef.current.muted = isMuted;
          if (desktopVideoRef.current.paused) {
            desktopVideoRef.current.play().catch((error) => {
              console.log('Desktop video play failed:', error);
            });
          }
        }
      } else {
        // Mobile view - ensure mobile video is playing with correct muted state
        if (mobileVideoRef.current) {
          mobileVideoRef.current.muted = isMuted;
          if (mobileVideoRef.current.paused) {
            mobileVideoRef.current.play().catch((error) => {
              console.log('Mobile video play failed:', error);
            });
          }
        }
      }
    };
    
    // Set up media query listener
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [isMuted]); // React to isMuted changes to sync video state
  
  // Handle manual mute/unmute toggle
  const toggleMute = () => {
    const activeVideo = getActiveVideoRef();
    
    if (activeVideo) {
      const newMutedState = !isMuted;
      
      // Update the video muted property
      activeVideo.muted = newMutedState;
      
      // Update our state
      setIsMuted(newMutedState);
      
      // Ensure video is playing (it should never pause due to mute/unmute)
      if (activeVideo.paused) {
        activeVideo.play().catch((error) => {
          console.log('Video autoplay failed after toggle:', error);
        });
      }
      
      // Also update the inactive video to keep them in sync
      const inactiveVideo = window.innerWidth >= 768 ? mobileVideoRef.current : desktopVideoRef.current;
      if (inactiveVideo) {
        inactiveVideo.muted = newMutedState;
      }
    }
  };

  // Handle keyboard accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMute();
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
          preload="auto"
          poster="https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?auto=format&fit=crop&q=80&w=1770"
          onError={(e) => {/* Mobile video error */}}
        >
          <source 
            src="https://res.cloudinary.com/dvmrhs2ek/video/upload/v1746802131/m2x43bfgesjeqosh8cvw.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Video overlay for better text visibility - increased opacity */}
        <div className="absolute inset-0 bg-black opacity-0"></div>
      </div>
      
      {/* Premium Mute/Unmute Button - World-class UI/UX */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-20 group">
        <button 
          onClick={toggleMute}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="premium-audio-btn glass-morphism relative
                     p-3 sm:p-4 rounded-2xl transition-all duration-700 ease-out
                     hover:scale-105 hover:shadow-2xl hover:shadow-white/20
                     active:scale-95 transform-gpu
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2
                     before:absolute before:inset-0 before:rounded-2xl 
                     before:bg-gradient-to-br before:from-white/10 before:to-transparent 
                     before:opacity-0 hover:before:opacity-100 
                     before:transition-all before:duration-500
                     after:absolute after:inset-0 after:rounded-2xl
                     after:bg-gradient-to-t after:from-black/5 after:to-transparent"
          aria-label={isMuted ? "Unmute video background music" : "Mute video background music"}
          role="button"
          aria-pressed={!isMuted}
        >
          {/* Main Icon Container */}
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 z-10">
            {/* Unmuted State - Speaker with Animated Sound Waves */}
            <div className={`absolute inset-0 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
              !isMuted 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-75 -rotate-12'
            }`}>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-full h-full text-white drop-shadow-lg"
              >
                {/* Speaker Base */}
                <path 
                  d="M11 5L6 9H2V15H6L11 19V5Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="currentColor"
                  className="opacity-95"
                />
                {/* Animated Sound Wave 1 - Outer */}
                <path 
                  d="M19.07 4.93C20.65 6.51 21.5 8.67 21.5 11S20.65 16.49 19.07 18.07" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  className="sound-wave opacity-85"
                  style={{ 
                    animationDelay: '0ms', 
                    animationDuration: '2.5s',
                    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))'
                  }}
                />
                {/* Animated Sound Wave 2 - Inner */}
                <path 
                  d="M15.54 8.46C16.32 9.24 16.75 10.28 16.75 11.36S16.32 13.48 15.54 14.26" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  className="sound-wave opacity-75"
                  style={{ 
                    animationDelay: '300ms', 
                    animationDuration: '2.5s',
                    filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4))'
                  }}
                />
              </svg>
              
              {/* Success Glow for Unmuted State */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 blur-xl opacity-60 animate-pulse"></div>
            </div>

            {/* Muted State - Speaker with Elegant X */}
            <div className={`absolute inset-0 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
              isMuted 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-75 rotate-12'
            }`}>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-full h-full text-white drop-shadow-lg"
              >
                {/* Speaker Base */}
                <path 
                  d="M11 5L6 9H2V15H6L11 19V5Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="currentColor"
                  className="opacity-95"
                />
                {/* Elegant X Mark for Mute */}
                <g className="opacity-95">
                  <path 
                    d="M22 9L16 15" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                  <path 
                    d="M16 9L22 15" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                </g>
              </svg>
              
              {/* Warning Glow for Muted State */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/25 to-orange-400/25 blur-xl opacity-50 animate-pulse"></div>
            </div>

            {/* Interactive Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-white/30 scale-0 group-active:scale-150 group-active:opacity-0 transition-all duration-500 ease-out opacity-0"></div>
          </div>

          {/* Status Indicator Ring */}
          <div className={`absolute -inset-2 rounded-3xl transition-all duration-700 ${
            !isMuted 
              ? 'bg-gradient-to-r from-green-400/15 to-emerald-400/15 shadow-green-400/20' 
              : 'bg-gradient-to-r from-amber-400/15 to-orange-400/15 shadow-amber-400/20'
          } blur-lg shadow-lg opacity-0 group-hover:opacity-100`}></div>

          {/* Ambient Light Effect */}
          <div className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
            !isMuted 
              ? 'shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
              : 'shadow-[0_0_20px_rgba(245,158,11,0.2)]'
          } opacity-0 group-hover:opacity-100`}></div>
        </button>

        {/* Premium Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 
                        transition-all duration-300 transform translate-y-2 group-hover:translate-y-0
                        pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xl text-white text-xs sm:text-sm 
                          px-3 py-2 rounded-lg font-medium whitespace-nowrap
                          border border-white/10 shadow-xl">
            <span className="drop-shadow-sm">
              {isMuted ? 'Unmute Audio' : 'Mute Audio'}
            </span>
            {/* Tooltip Arrow */}
            <div className="absolute top-full right-4 w-0 h-0 
                            border-l-[6px] border-l-transparent 
                            border-r-[6px] border-r-transparent 
                            border-t-[6px] border-t-black/80"></div>
          </div>
        </div>
      </div>
      
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
