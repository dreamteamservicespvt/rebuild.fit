import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate navbar height dynamically
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    
    // Update height after scroll state changes
    const timeoutId = setTimeout(updateNavHeight, 100);
    
    return () => {
      window.removeEventListener('resize', updateNavHeight);
      clearTimeout(timeoutId);
    };
  }, [scrolled]);

  // Add effect to prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'OUR GYM', path: '/gyms' },
    { name: 'Transformations', path: '/transformations' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Membership', path: '/membership' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      ref={navRef}
      className={cn(
        'fixed w-full z-50 transition-all duration-300 mobile-navbar',
        scrolled 
          ? 'mobile-navbar-scrolled shadow-lg py-1 sm:py-2' 
          : 'bg-transparent py-2 sm:py-3 md:py-4'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mobile-navbar-container">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative overflow-hidden">
            <img 
              src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470571/cmvlwiujoqiloeitncik.png" 
              alt="Rebuild.fit Logo" 
              className={cn(
                "w-auto transition-all duration-300 group-hover:scale-110",
                scrolled 
                  ? "h-8 sm:h-10 md:h-12" 
                  : "h-10 sm:h-12 md:h-16"
              )}
            />
            <div className="absolute inset-0 bg-rebuild-yellow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </div>
          <img
            src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747482873/lissllpnwgq5z2hu7ukz.png"
            alt="Rebuild Logo"
            className={cn(
              "w-auto transition-all duration-300",
              scrolled 
                ? "h-5 sm:h-6 md:h-8" 
                : "h-6 sm:h-8 md:h-10"
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-xs xl:text-sm uppercase tracking-widest font-medium transition-colors relative py-2",
                isActive(link.path) 
                  ? "text-rebuild-yellow" 
                  : "text-white/80 hover:text-rebuild-yellow"
              )}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-rebuild-yellow" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={20} className="sm:w-6 sm:h-6" /> 
          ) : (
            <Menu size={20} className="sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-rebuild-black z-40 lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto mobile-menu-overlay",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ 
          top: navHeight > 0 ? `${navHeight}px` : (scrolled ? '48px' : '56px'), 
          height: navHeight > 0 ? `calc(100vh - ${navHeight}px)` : (scrolled ? 'calc(100vh - 48px)' : 'calc(100vh - 56px)')
        }}
      >
        <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6 min-h-full pb-20 pt-6 safe-area-insets">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-lg sm:text-xl font-bebas tracking-wider py-3 transition-colors border-b border-white/10 last:border-b-0 touch-manipulation",
                isActive(link.path) 
                  ? "text-rebuild-yellow" 
                  : "text-white/80 hover:text-rebuild-yellow"
              )}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/membership" 
            className="btn-primary mt-6 sm:mt-8 text-center py-4 text-base font-semibold touch-manipulation"
            onClick={closeMenu}
          >
            JOIN NOW
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
