import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame for better performance
    const scrollToTop = () => {
      // First, immediate scroll to ensure we're at the top
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Then smooth scroll for better UX (if supported)
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(scrollToTop);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
