import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, MapPin, Phone, ArrowRight, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rebuild-darkgray text-white pt-8 pb-6">
      <div className="container-custom">
        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-x-4">
          <div className="text-left">
            <h3 className="text-rebuild-yellow text-4xl mb-3">REBUILD</h3>
            <p className="text-gray-300 mb-4 text-base">
              No Steroids. Just Strength.<br />
              Real Transformation.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="hover:text-rebuild-yellow transition-colors" aria-label="Instagram">
                <InstagramIcon size={24} />
              </a>
              <a href="https://facebook.com" className="hover:text-rebuild-yellow transition-colors" aria-label="Facebook">
                <FacebookIcon size={24} />
              </a>
            </div>
          </div>

          <div className="text-left">
            <h4 className="text-xl font-bebas tracking-wide mb-3">Our Location</h4>
            <div>
              <h5 className="font-bold text-base">Premium Gym</h5>
              <div className="flex items-start mt-1">
                <MapPin size={18} className="min-w-[18px] mr-2 text-rebuild-yellow mt-0.5" />
                <p className="text-gray-300 text-sm text-left">Oppo Bala Tripura Sundari Temple St, Jawaharlal Street, Kakinada, Andhra Pradesh 533001</p>
              </div>
            </div>
            <div className="mt-3">
              <h5 className="font-bold text-base">Contact Us</h5>
              <div className="flex items-center mt-1 justify-start">
                <Phone size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                <div>
                  <a href="tel:+919535344153" className="text-gray-300 text-sm hover:text-rebuild-yellow">+91 9535344153</a>
                </div>
              </div>
              <div className="flex items-center mt-1 justify-start">
                <Phone size={18} className="min-w-[18px] mr-2 text-rebuild-yellow opacity-0" />
                <div>
                  <a href="tel:+919182338776" className="text-gray-300 text-sm hover:text-rebuild-yellow">+91 9182338776</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-left">
                <h4 className="text-xl font-bebas tracking-wide mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  {[
                    { name: 'About Us', path: '/about' },
                    { name: 'Our Gym', path: '/gyms' },
                    { name: 'Membership Plans', path: '/membership' },
                    { name: 'Trainers', path: '/trainers' },
                    { name: 'Blog', path: '/blog' },
                    { name: 'Contact', path: '/contact' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link 
                        to={item.path} 
                        className="flex items-center justify-start hover:text-rebuild-yellow transition-colors text-sm"
                      >
                        <ArrowRight size={14} className="mr-2" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-left">
                <h4 className="text-xl font-bebas tracking-wide mb-3">Opening Hours</h4>
                <ul className="space-y-1">
                  <li className="flex justify-between text-gray-300 text-sm">
                    <span>Mon - Fri:</span>
                    <span>5:00 AM - 10:00 PM</span>
                  </li>
                  <li className="flex justify-between text-gray-300 text-sm">
                    <span>Sat - Sun:</span>
                    <span>6:00 AM - 8:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer - Redesigned for better experience */}
        <div className="md:hidden space-y-8">
          {/* Brand & Tagline Section */}
          <div className="text-center space-y-3 pb-6 border-b border-gray-800">
            <h3 className="text-rebuild-yellow text-3xl font-bold">REBUILD</h3>
            <p className="text-gray-400 italic text-sm px-4">
              No Steroids. Just Strength. Real Transformation.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6 pt-2">
              <a 
                href="https://instagram.com" 
                className="hover:text-rebuild-yellow transition-colors p-2" 
                aria-label="Instagram"
              >
                <InstagramIcon size={24} />
              </a>
              <a 
                href="https://facebook.com" 
                className="hover:text-rebuild-yellow transition-colors p-2" 
                aria-label="Facebook"
              >
                <FacebookIcon size={24} />
              </a>
            </div>
          </div>
          
          {/* Location Section */}
          <div className="space-y-3 px-4 pb-6 border-b border-gray-800">
            <h4 className="text-lg font-bebas tracking-wide flex items-center gap-2 text-rebuild-yellow">
              <MapPin size={18} />
              Our Location
            </h4>
            <div className="ml-1">
              <h5 className="font-bold text-base">PREMIUM GYM</h5>
              <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                Oppo Bala Tripura Sundari Temple St, Jawaharlal Street, Kakinada, Andhra Pradesh 533001
              </p>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="space-y-3 px-4 pb-6 border-b border-gray-800">
            <h4 className="text-lg font-bebas tracking-wide flex items-center gap-2 text-rebuild-yellow">
              <Phone size={18} />
              Contact Us
            </h4>
            <div className="flex flex-col space-y-2 ml-1">
              <a 
                href="tel:+919535344153" 
                className="text-gray-200 hover:text-rebuild-yellow transition-colors text-base"
              >
                +91 9535344153
              </a>
              <a 
                href="tel:+919182338776" 
                className="text-gray-200 hover:text-rebuild-yellow transition-colors text-base"
              >
                +91 9182338776
              </a>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div className="space-y-3 px-4 pb-6 border-b border-gray-800">
            <h4 className="text-lg font-bebas tracking-wide flex items-center gap-2 text-rebuild-yellow">
              <ArrowRight size={18} />
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-y-3 ml-1">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Gym', path: '/gyms' },
                { name: 'Membership Plans', path: '/membership' },
                { name: 'Trainers', path: '/trainers' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="flex items-center text-gray-200 hover:text-rebuild-yellow hover:underline transition-colors text-sm"
                  >
                    <ArrowRight size={12} className="mr-1 text-rebuild-yellow" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Opening Hours Section */}
          <div className="space-y-3 px-4 pb-6 border-b border-gray-800">
            <h4 className="text-lg font-bebas tracking-wide flex items-center gap-2 text-rebuild-yellow">
              <Clock size={18} />
              Opening Hours
            </h4>
            <ul className="space-y-2 ml-1">
              <li className="flex justify-between text-gray-200 text-sm">
                <span className="font-medium">Mon - Fri:</span>
                <span>5:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between text-gray-200 text-sm">
                <span className="font-medium">Sat - Sun:</span>
                <span>6:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
          
          {/* Copyright Section */}
          <div className="pt-4 text-center space-y-4">
            <p className="text-gray-400 text-xs px-4">
              © {new Date().getFullYear()} Rebuild Gym Kakinada.<br /> 
              Designed and Developed by <a href="https://thedreamteamservices.com" target="_blank" rel="noopener noreferrer" className="text-rebuild-yellow hover:underline">DREAM TEAM SERVICES</a>
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-rebuild-yellow text-xs">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-rebuild-yellow text-xs">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Desktop Copyright Footer */}
        <div className="hidden md:flex border-t border-gray-700 mt-12 pt-6 flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Rebuild Gym Kakinada. Designed and Developed by <a href="https://thedreamteamservices.com" target="_blank" rel="noopener noreferrer" className="text-rebuild-yellow hover:underline">DREAM TEAM SERVICES</a>
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-rebuild-yellow text-sm">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-rebuild-yellow text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
