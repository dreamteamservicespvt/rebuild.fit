import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading = true }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);

  // Handle minimum loading time of 3 seconds
  useEffect(() => {
    const minLoadingTimer = setTimeout(() => {
      setMinLoadingComplete(true);
    }, 3000); // Ensure minimum 3 seconds display
    
    return () => clearTimeout(minLoadingTimer);
  }, []);

  // Handle hiding the loader when loading is done and minimum time has passed
  useEffect(() => {
    if (!isLoading && minLoadingComplete) {
      setTimeout(() => {
        setShowLoader(false);
      }, 1500); // Wait for exit animations to complete
    } else {
      setShowLoader(true);
    }
  }, [isLoading, minLoadingComplete]);

  // Smooth progress bar animation over at least 3 seconds
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const duration = 3000; // 3 seconds in milliseconds
    
    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const elapsedTime = timestamp - startTime;
      const calculatedProgress = Math.min((elapsedTime / duration) * 100, 100);
      
      // If page is still loading after 3 seconds, slow down progress to 99%
      const progress = !minLoadingComplete && calculatedProgress >= 99 
        ? 99 
        : Math.floor(calculatedProgress);
      
      setLoadingProgress(progress);
      
      if ((progress < 100 && isLoading) || (progress < 100 && !minLoadingComplete)) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else if (!isLoading && minLoadingComplete) {
        setLoadingProgress(100); // Ensure we reach 100% when everything is ready
      }
    };
    
    animationFrame = requestAnimationFrame(updateProgress);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading, minLoadingComplete]);

  if (!showLoader) return null;

  return (
    <div className={`loading-screen ${!isLoading && minLoadingComplete ? 'loading-screen-exit' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo-container">
          <img 
            src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470571/cmvlwiujoqiloeitncik.png"
            alt="Rebuild Logo"
            className="loading-logo"
            style={{ width: 'auto', height: '150px' }} // Increased logo size
          />
          <div className="logo-pulse"></div>
        </div>
        
        <div className="loading-text-container">
          <div className="loading-text">
            <span className="text-reveal">Rebuild Your Body,</span>
            <span className="text-reveal delay-1">Rebuild Your Life</span>
          </div>
        </div>
        
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
          <div className="loading-percentage">{loadingProgress}%</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
