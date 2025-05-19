import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rebuild-darkgray text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
          <div>
            <h3 className="text-rebuild-yellow text-4xl mb-3">REBUILD</h3>
            <p className="text-gray-300 mb-4">
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

          <div>
            <h4 className="text-xl font-bebas tracking-wide mb-3">Our Location</h4>
            <div>
              <h5 className="font-bold">Premium Gym</h5>
              <div className="flex mt-1">
                <MapPin size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                <p className="text-gray-300 text-sm">Oppo Bala Tripura Sundari Temple St, Jawaharlal Street, Kakinada, Andhra Pradesh 533001</p>
              </div>
            </div>
            <div className="mt-3">
              <h5 className="font-bold">Contact Us</h5>
              <div className="flex mt-1">
                <Phone size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                <div>
                  <a href="tel:+919535344153" className="text-gray-300 text-sm hover:text-rebuild-yellow">+91 9535344153</a>
                </div>
              </div>
              <div className="flex mt-1">
                <Phone size={18} className="min-w-[18px] mr-2 text-rebuild-yellow opacity-0" />
                <div>
                  <a href="tel:+919182338776" className="text-gray-300 text-sm hover:text-rebuild-yellow">+91 9182338776</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xl font-bebas tracking-wide mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  {['About Us', 'Our Gym', 'Membership Plans', 'Trainers', 'Blog', 'Contact'].map((item) => (
                    <li key={item}>
                      <Link 
                        to={`/${item.toLowerCase().replace(' ', '-')}`} 
                        className="flex items-center hover:text-rebuild-yellow transition-colors"
                      >
                        <ArrowRight size={14} className="mr-2" />
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-bebas tracking-wide mb-3">Opening Hours</h4>
                <ul>
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

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
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
