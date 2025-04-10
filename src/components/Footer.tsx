import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rebuild-darkgray text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-rebuild-yellow text-4xl mb-6">REBUILD</h3>
            <p className="text-gray-300 mb-6">
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
            <h4 className="text-xl font-bebas tracking-wide mb-6">Our Branches</h4>
            <ul className="space-y-4">
              <li>
                <h5 className="font-bold">Premium Gym</h5>
                <div className="flex mt-1">
                  <MapPin size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                  <p className="text-gray-300 text-sm">123 Main Street, Kakinada, Andhra Pradesh</p>
                </div>
              </li>
              <li>
                <h5 className="font-bold">Women's Gym</h5>
                <div className="flex mt-1">
                  <MapPin size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                  <p className="text-gray-300 text-sm">456 Lake View, Kakinada, Andhra Pradesh</p>
                </div>
              </li>
              <li>
                <h5 className="font-bold">Student Gym</h5>
                <div className="flex mt-1">
                  <MapPin size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                  <p className="text-gray-300 text-sm">789 College Road, Kakinada, Andhra Pradesh</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bebas tracking-wide mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Our Gyms', 'Membership Plans', 'Trainers', 'Blog', 'Contact'].map((item) => (
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
            <h4 className="text-xl font-bebas tracking-wide mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                <p className="text-gray-300">+91 9876543210</p>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="min-w-[18px] mr-2 text-rebuild-yellow" />
                <p className="text-gray-300">info@rebuildgym.com</p>
              </li>
            </ul>

            <h4 className="text-xl font-bebas tracking-wide mt-8 mb-4">Opening Hours</h4>
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

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Rebuild Gym Kakinada. Designed and Developed by DREAM TEAM SERVICES
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
