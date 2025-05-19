import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557330359-ffb0deed6163?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')",
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <div className="container-custom relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">CONTACT US</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Talk to the Rebuild Team - We're Here to Help
          </h2>
        </div>
      </section>
      
      {/* Contact Info & Form */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">GET IN TOUCH</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <p className="text-gray-300 mb-8">
                Have questions about our memberships, training programs, or natural fitness philosophy? Reach out to us and our team will get back to you as soon as possible.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start">
                  <div className="bg-rebuild-yellow/20 p-3 rounded-full mr-4">
                    <Phone size={20} className="text-rebuild-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-gray-300">
                      <a href="tel:+919535344153" className="hover:text-rebuild-yellow">+91 9535344153</a>
                    </p>
                    <p className="text-gray-300">
                      <a href="tel:+919182338776" className="hover:text-rebuild-yellow">+91 9182338776</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rebuild-yellow/20 p-3 rounded-full mr-4">
                    <Mail size={20} className="text-rebuild-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-gray-300">info@rebuildgym.com</p>
                    <p className="text-gray-300">contact@rebuildgym.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rebuild-yellow/20 p-3 rounded-full mr-4">
                    <MapPin size={20} className="text-rebuild-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Address</h3>
                    <p className="text-gray-300">
                      Oppo Bala Tripura Sundari Temple St,<br />
                      Jawaharlal Street, Kakinada,<br />
                      Andhra Pradesh 533001
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-2">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="https://instagram.com" className="bg-rebuild-darkgray p-3 rounded-full hover:bg-rebuild-yellow/20 transition-colors">
                    <Instagram size={24} className="text-rebuild-yellow" />
                  </a>
                  <a href="https://facebook.com" className="bg-rebuild-darkgray p-3 rounded-full hover:bg-rebuild-yellow/20 transition-colors">
                    <Facebook size={24} className="text-rebuild-yellow" />
                  </a>
                  <a href="https://wa.me/919535344153" className="bg-rebuild-darkgray p-3 rounded-full hover:bg-rebuild-yellow/20 transition-colors">
                    <MessageSquare size={24} className="text-rebuild-yellow" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-rebuild-darkgray p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none"
                    placeholder="Your email address"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none"
                    placeholder="Subject of your message"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none"
                    placeholder="Your message"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center"
                >
                  SEND MESSAGE <Send size={18} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">OUR LOCATION</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Visit our premium gym facility in Kakinada
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 mb-12">
            <div className="bg-rebuild-black p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Premium Gym</h3>
              <div className="flex items-start mb-4">
                <MapPin size={20} className="text-rebuild-yellow mr-2 mt-1" />
                <p className="text-gray-300">Oppo Bala Tripura Sundari Temple St, Jawaharlal Street, Kakinada, Andhra Pradesh 533001</p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="text-rebuild-yellow mr-2" />
                <p className="text-gray-300">
                  <a href="tel:+919535344153" className="hover:text-rebuild-yellow">+91 9535344153</a>
                  <span className="mx-2">|</span>
                  <a href="tel:+919182338776" className="hover:text-rebuild-yellow">+91 9182338776</a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Map Embed */}
          <div className="aspect-[16/9] bg-rebuild-black rounded-lg overflow-hidden">
   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11886.648384289012!2d82.2128609559494!3d16.952446100000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3829efdc1957fb%3A0x9a6fd8f59563789f!2sREBUILD%20FITNESS%20GYM%202!5e1!3m2!1sen!2sin!4v1747635599405!5m2!1sen!2sin"       width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rebuild Gym Location"></iframe>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Quick answers to common questions about our gyms and services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-rebuild-darkgray p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">What are your operational hours?</h3>
              <p className="text-gray-300">
                Our Premium gym is open 24/7, while our Women's gym operates from 6 AM to 9 PM daily. The Student gym is open from 5 AM to 11 PM on weekdays and 6 AM to 10 PM on weekends.
              </p>
            </div>
            
            <div className="bg-rebuild-darkgray p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Do you offer trial passes?</h3>
              <p className="text-gray-300">
                Yes, we offer a complimentary one-day trial pass for new members to experience our facilities. Contact us to schedule your free trial at any of our branches.
              </p>
            </div>
            
            <div className="bg-rebuild-darkgray p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How does your "no steroids" policy work?</h3>
              <p className="text-gray-300">
                Our gym promotes natural fitness through proper training, nutrition, and recovery. We educate members about the dangers of steroids and provide natural alternatives to achieve fitness goals. Our trainers are committed to steroid-free coaching.
              </p>
            </div>
            
            <div className="bg-rebuild-darkgray p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Can I freeze my membership temporarily?</h3>
              <p className="text-gray-300">
                Yes, members can freeze their membership for up to 30 days per year with advance notice. A small administrative fee may apply. Please contact our front desk for details.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* WhatsApp CTA */}
      <section className="py-12 bg-rebuild-yellow">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-rebuild-black mb-2">Need Immediate Assistance?</h2>
              <p className="text-rebuild-black/80 font-medium">
                Chat with us directly on WhatsApp for quick responses
              </p>
            </div>
            
            <a 
              href="https://wa.me/919535344153" 
              className="bg-rebuild-black text-white px-8 py-3 rounded-md font-bold flex items-center hover:bg-gray-900 transition-colors"
            >
              <MessageSquare size={20} className="mr-2" /> CHAT ON WHATSAPP
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
