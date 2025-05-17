import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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
    { name: 'About Us', path: '/about' },
    { name: 'Our Gyms', path: '/gyms' },
    { name: 'Transformations', path: '/transformations' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Membership', path: '/membership' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        scrolled ? 'bg-rebuild-black/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden">
            <img 
              src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470571/cmvlwiujoqiloeitncik.png" 
              alt="Rebuild.fit Logo" 
              className="h-12 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-rebuild-yellow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </div>
          <img
            src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747480713/f9t7pf4t3hfxmq0p1mia.png"
            alt="Rebuild Logo"
            className="h-8 sm:h-10 w-auto transition-all duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm uppercase tracking-widest font-medium transition-colors relative",
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
          className="lg:hidden text-white p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-rebuild-black z-40 lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: '60px', height: 'calc(100vh - 60px)' }}
      >
        <div className="flex flex-col space-y-6 p-6 min-h-full pb-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-xl font-bebas tracking-wider py-2 transition-colors",
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
            className="btn-primary mt-6 text-center"
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
