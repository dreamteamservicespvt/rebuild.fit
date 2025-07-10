import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, Instagram, Facebook, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Clock, Calendar, User, Users, Building2 } from 'lucide-react';
import { submitContactForm } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ResponsiveImage from '@/components/ResponsiveImage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | REBUILD.fit";
    
    // Validate form fields when they change and have been touched
    validateField('name', formData.name, touched.name);
    validateField('email', formData.email, touched.email);
    validateField('message', formData.message, touched.message);
  }, [formData, touched]);

  const validateField = (field: string, value: string, isTouched: boolean) => {
    if (!isTouched) return;
    
    let errorMessage = '';
    
    if (field === 'name') {
      if (!value.trim()) {
        errorMessage = 'Name is required';
      }
    } else if (field === 'email') {
      if (!value.trim()) {
        errorMessage = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessage = 'Please enter a valid email address';
      }
    } else if (field === 'message') {
      if (!value.trim()) {
        errorMessage = 'Message is required';
      } else if (value.trim().length < 10) {
        errorMessage = 'Message must be at least 10 characters';
      }
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched when user changes value
    if (!touched[name as keyof typeof touched]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      message: true
    });
    
    // Validate all fields
    validateField('name', formData.name, true);
    validateField('email', formData.email, true);
    validateField('message', formData.message, true);
    
    // Check if there are any errors
    const hasErrors = !formData.name || !formData.email || !formData.message || 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      formData.message.trim().length < 10;
    
    if (hasErrors) {
      toast.error('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactForm(formData);
      
      // Show success toast and animation
      toast.success('Message sent successfully!', 'Thank you for contacting us. We will get back to you soon.');
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setTouched({
          name: false,
          email: false,
          message: false
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      toast.error('Error sending message', 'Please try again later or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // FAQ accordion items
  const faqItems = [
    {
      question: "What are your operational hours?",
      answer: "Our Premium gym is open 24/7, while our Women's gym operates from 6 AM to 9 PM daily. The Student gym is open from 5 AM to 11 PM on weekdays and 6 AM to 10 PM on weekends."
    },
    {
      question: "Do you offer trial passes?",
      answer: "Yes, we offer a complimentary one-day trial pass for new members to experience our facilities. Contact us to schedule your free trial at our gym."
    },
    {
      question: "How does your \"no steroids\" policy work?",
      answer: "Our gym promotes natural fitness through proper training, nutrition, and recovery. We educate members about the dangers of steroids and provide natural alternatives to achieve fitness goals. Our trainers are committed to steroid-free coaching."
    },
    {
      question: "Can I freeze my membership temporarily?",
      answer: "Yes, members can freeze their membership for up to 30 days per year with advance notice. A small administrative fee may apply. Please contact our front desk for details."
    },
    {
      question: "Do you have personal training sessions?",
      answer: "Yes, we offer personalized one-on-one training sessions with our certified trainers. Sessions can be booked individually or as part of a package."
    },
    {
      question: "What amenities are available at your gym?",
      answer: "Our gym features modern equipment, shower facilities, locker rooms, a nutrition bar, free WiFi, air conditioning, and ample parking space."
    }
  ];

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="min-h-screen bg-rebuild-black text-white">
      {/* Premium Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557330359-ffb0deed6163?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')",
            filter: "brightness(40%)"
          }}
        />
        
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/70 via-transparent to-rebuild-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-rebuild-black/50 via-transparent to-rebuild-black/30" />
        
        {/* Animated Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            {/* Accent Badge */}
            <div className="inline-block bg-rebuild-yellow/20 px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6">
              <span className="text-rebuild-yellow text-xs sm:text-sm font-medium">GET IN TOUCH</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 leading-tight">CONTACT US</h1>
            <div className="w-16 sm:w-20 h-1.5 bg-rebuild-yellow mb-4 sm:mb-6 mx-auto md:mx-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto md:mx-0 leading-relaxed">
              Talk to the Rebuild Team - We're Here to Help Your Fitness Journey
            </h2>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-rebuild-black to-transparent" />
        <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-rebuild-yellow/5 rounded-full filter blur-xl"></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-rebuild-yellow/5 rounded-full filter blur-xl"></div>
      </section>
      
      {/* Contact Info & Form - Enhanced Layout */}
      <section className="py-12 sm:py-16 md:py-24 bg-rebuild-black relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rebuild-yellow/3 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-rebuild-yellow/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/2 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information - Card Based Layout */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-rebuild-darkgray/80 to-rebuild-darkgray/40 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700/50 shadow-xl h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">GET IN TOUCH</h2>
                  <div className="w-12 sm:w-16 h-1 bg-rebuild-yellow mb-4 sm:mb-6" />
                  
                  <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                    Have questions about our memberships, training programs, or natural fitness philosophy? Reach out to us and our team will get back to you as soon as possible.
                  </p>
                  
                  <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
                    {/* Phone Contact Card */}
                    <div className="group p-3 sm:p-4 bg-rebuild-black/30 rounded-xl border border-gray-700/30 hover:border-rebuild-yellow/50 transition-all duration-300 hover:shadow-lg hover:shadow-rebuild-yellow/5">
                      <div className="flex items-start">
                        <div className="bg-rebuild-yellow/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 group-hover:bg-rebuild-yellow/30 transition-colors duration-300 flex-shrink-0">
                          <Phone size={16} className="text-rebuild-yellow sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold mb-1 group-hover:text-rebuild-yellow transition-colors text-sm sm:text-base">Phone</h3>
                          <p className="text-gray-300 text-sm sm:text-base">
                            <a href="tel:+919535344153" className="hover:text-rebuild-yellow transition-colors block break-all">+91 9535344153</a>
                            <a href="tel:+919182338776" className="hover:text-rebuild-yellow transition-colors block mt-1 break-all">+91 9182338776</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Email Contact Card */}
                    <div className="group p-3 sm:p-4 bg-rebuild-black/30 rounded-xl border border-gray-700/30 hover:border-rebuild-yellow/50 transition-all duration-300 hover:shadow-lg hover:shadow-rebuild-yellow/5">
                      <div className="flex items-start">
                        <div className="bg-rebuild-yellow/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 group-hover:bg-rebuild-yellow/30 transition-colors duration-300 flex-shrink-0">
                          <Mail size={16} className="text-rebuild-yellow sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold mb-1 group-hover:text-rebuild-yellow transition-colors text-sm sm:text-base">Email</h3>
                          <p className="text-gray-300 text-sm sm:text-base">
                            <a href="mailto:info@rebuildgym.com" className="hover:text-rebuild-yellow transition-colors block">info@rebuildgym.com</a>
                            <a href="mailto:contact@rebuildgym.com" className="hover:text-rebuild-yellow transition-colors block mt-1">contact@rebuildgym.com</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Address Contact Card */}
                    <div className="group p-4 bg-rebuild-black/30 rounded-xl border border-gray-700/30 hover:border-rebuild-yellow/50 transition-all duration-300 hover:shadow-lg hover:shadow-rebuild-yellow/5">
                      <div className="flex items-start">
                        <div className="bg-rebuild-yellow/20 p-3 rounded-full mr-4 group-hover:bg-rebuild-yellow/30 transition-colors duration-300">
                          <MapPin size={20} className="text-rebuild-yellow" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1 group-hover:text-rebuild-yellow transition-colors">Address</h3>
                          <p className="text-gray-300">
                            Oppo Bala Tripura Sundari Temple St,<br />
                            Jawaharlal Street, Kakinada,<br />
                            Andhra Pradesh 533001
                          </p>
                          <a 
                            href="https://maps.google.com/?q=Rebuild+Fitness+Gym+2,+Kakinada" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-rebuild-yellow text-sm hover:underline mt-2 inline-flex items-center"
                          >
                            View on Map <ChevronDown size={14} className="ml-1 rotate-270" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-2">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a 
                        href="https://instagram.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-br from-rebuild-darkgray to-gray-800 p-3 rounded-full hover:bg-rebuild-yellow/20 transition-colors border border-gray-700/30 hover:border-rebuild-yellow/50"
                      >
                        <Instagram size={24} className="text-rebuild-yellow" />
                      </a>
                      <a 
                        href="https://facebook.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-br from-rebuild-darkgray to-gray-800 p-3 rounded-full hover:bg-rebuild-yellow/20 transition-colors border border-gray-700/30 hover:border-rebuild-yellow/50"
                      >
                        <Facebook size={24} className="text-rebuild-yellow" />
                      </a>
                      <a 
                        href="https://wa.me/919535344153" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-br from-rebuild-darkgray to-gray-800 p-3 rounded-full hover:bg-rebuild-yellow/20 transition-colors border border-gray-700/30 hover:border-rebuild-yellow/50"
                      >
                        <MessageSquare size={24} className="text-rebuild-yellow" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">
                      Follow us for fitness tips, success stories, and gym updates!
                    </p>
                  </div>
                  
                  {/* Operating Hours */}
                  <div className="mt-10 p-4 bg-rebuild-black/30 rounded-xl border border-gray-700/30">
                    <div className="flex items-center mb-3">
                      <Clock size={18} className="text-rebuild-yellow mr-2" />
                      <h3 className="font-bold">Operating Hours</h3>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span>5:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday - Sunday:</span>
                        <span>6:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Women's Gym Hours:</span>
                        <span>6:00 AM - 9:00 PM</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Contact Form - Enhanced Design */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-rebuild-darkgray/80 to-rebuild-darkgray/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 relative">
                  Send Us a Message
                  <div className="w-12 h-1 bg-rebuild-yellow mt-2"></div>
                </h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-gray-300 mb-1 text-sm">
                        <User size={14} className="mr-2 text-rebuild-yellow" />
                        Name <span className="text-rebuild-yellow ml-1">*</span>
                      </label>
                      <div className="relative">
                        <Input 
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={cn(
                            "w-full bg-rebuild-black border rounded-md px-4 py-3 text-white transition-all duration-200",
                            errors.name 
                              ? "border-red-500 focus:border-red-500" 
                              : touched.name && !errors.name
                                ? "border-green-500 focus:border-green-500"
                                : "border-gray-700 focus:border-rebuild-yellow"
                          )}
                          placeholder="Your name"
                          required
                        />
                        <AnimatePresence>
                          {errors.name && touched.name && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <AlertCircle size={18} className="text-red-500" />
                            </motion.div>
                          )}
                          {touched.name && !errors.name && formData.name && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <CheckCircle size={18} className="text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {errors.name && touched.name && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-red-500 mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Phone Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-gray-300 mb-1 text-sm">
                        <Phone size={14} className="mr-2 text-rebuild-yellow" />
                        Phone
                      </label>
                      <Input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-rebuild-black border border-gray-700 rounded-md px-4 py-3 text-white focus:border-rebuild-yellow focus:outline-none"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="flex items-center text-gray-300 mb-1 text-sm">
                      <Mail size={14} className="mr-2 text-rebuild-yellow" />
                      Email <span className="text-rebuild-yellow ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={cn(
                          "w-full bg-rebuild-black border rounded-md px-4 py-3 text-white transition-all duration-200",
                          errors.email 
                            ? "border-red-500 focus:border-red-500" 
                            : touched.email && !errors.email && formData.email
                              ? "border-green-500 focus:border-green-500"
                              : "border-gray-700 focus:border-rebuild-yellow"
                        )}
                        placeholder="Your email address"
                        required
                      />
                      <AnimatePresence>
                        {errors.email && touched.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <AlertCircle size={18} className="text-red-500" />
                          </motion.div>
                        )}
                        {touched.email && !errors.email && formData.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <CheckCircle size={18} className="text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.email && touched.email && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-red-500 mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Message Field */}
                  <div className="space-y-1">
                    <label className="flex items-center text-gray-300 mb-1 text-sm">
                      <MessageSquare size={14} className="mr-2 text-rebuild-yellow" />
                      Message <span className="text-rebuild-yellow ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Textarea 
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={cn(
                          "w-full bg-rebuild-black border rounded-md px-4 py-3 text-white transition-all duration-200",
                          errors.message 
                            ? "border-red-500 focus:border-red-500" 
                            : touched.message && !errors.message && formData.message
                              ? "border-green-500 focus:border-green-500"
                              : "border-gray-700 focus:border-rebuild-yellow"
                        )}
                        placeholder="Your message"
                        required
                      ></Textarea>
                      <AnimatePresence>
                        {errors.message && touched.message && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-3 top-3"
                          >
                            <AlertCircle size={18} className="text-red-500" />
                          </motion.div>
                        )}
                        {touched.message && !errors.message && formData.message && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-3 top-3"
                          >
                            <CheckCircle size={18} className="text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.message && touched.message && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-red-500 mt-1"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Submit Button with Loading and Success States */}
                  <Button 
                    type="submit" 
                    disabled={submitting || submitSuccess}
                    className={cn(
                      "bg-rebuild-yellow text-rebuild-black font-bold py-4 px-8 rounded-md transition-all duration-500 flex items-center justify-center min-w-[180px]",
                      submitting ? "opacity-80" : "hover:bg-yellow-500 transform hover:scale-[1.02]",
                      submitSuccess ? "bg-green-500 text-white" : ""
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : submitSuccess ? (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Message Sent
                      </>
                    ) : (
                      <>
                        SEND MESSAGE <Send size={18} className="ml-2" />
                      </>
                    )}
                  </Button>
                  
                  {/* Privacy Notice */}
                  <p className="text-xs text-gray-400 mt-4">
                    By submitting this form, you agree to our privacy policy. We'll never share your information with third parties.
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section - Enhanced Interactive Map */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rebuild-yellow/20 via-transparent to-transparent"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block bg-rebuild-yellow/20 px-4 py-1.5 rounded-full mb-4">
              <span className="text-rebuild-yellow text-sm font-medium flex items-center">
                <MapPin size={14} className="mr-2" /> FIND US
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">OUR LOCATION</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Visit our premium gym facilities in Kakinada. We're conveniently located with easy access and parking.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1 space-y-6">
              {/* Premium Gym Location Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-rebuild-black p-6 rounded-2xl border border-gray-700/50 hover:border-rebuild-yellow/30 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-rebuild-yellow/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-rebuild-yellow h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Premium Gym</h3>
                    <p className="text-rebuild-yellow text-sm">Main Facility</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-rebuild-yellow mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">
                      Oppo Bala Tripura Sundari Temple St, Jawaharlal Street, Kakinada, Andhra Pradesh 533001
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone size={18} className="text-rebuild-yellow mr-3 flex-shrink-0" />
                    <div>
                      <a href="tel:+919535344153" className="text-gray-300 hover:text-rebuild-yellow transition-colors">
                        +91 9535344153
                      </a>
                      <span className="mx-2 text-gray-600">|</span>
                      <a href="tel:+919182338776" className="text-gray-300 hover:text-rebuild-yellow transition-colors">
                        +91 9182338776
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={18} className="text-rebuild-yellow mr-3 flex-shrink-0" />
                    <div className="text-gray-300">
                      <div>Mon-Fri: 5:00 AM - 10:00 PM</div>
                      <div>Sat-Sun: 6:00 AM - 8:00 PM</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Directions Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=REBUILD+FITNESS+GYM+2+Kakinada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-rebuild-yellow to-yellow-400 text-rebuild-black font-bold py-4 px-6 rounded-xl flex items-center justify-center hover:from-yellow-400 hover:to-rebuild-yellow transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <MapPin size={18} className="mr-2" />
                  Get Directions
                </a>
                <p className="text-xs text-center text-gray-400 mt-2">
                  Opens Google Maps in a new tab with directions to our gym
                </p>
              </motion.div>
            </div>
            
            {/* Interactive Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="aspect-[16/9] bg-rebuild-black rounded-2xl overflow-hidden border border-gray-700/50 hover:border-rebuild-yellow/30 transition-all duration-300 shadow-xl relative">
                {/* Map Loading State */}
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-rebuild-black/80 z-10">
                    <div className="text-center">
                      <Loader2 size={40} className="animate-spin text-rebuild-yellow mb-4 mx-auto" />
                      <p className="text-gray-300">Loading map...</p>
                    </div>
                  </div>
                )}
                
                {/* Interactive Map */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11886.648384289012!2d82.2128609559494!3d16.952446100000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3829efdc1957fb%3A0x9a6fd8f59563789f!2sREBUILD%20FITNESS%20GYM%202!5e1!3m2!1sen!2sin!4v1747635599405!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rebuild Gym Location"
                  onLoad={handleMapLoad}
                  className={cn(
                    "w-full h-full transition-opacity duration-1000",
                    mapLoaded ? "opacity-100" : "opacity-0"
                  )}
                ></iframe>
                
                {/* Map Controls Overlay */}
                <div className="absolute top-4 right-4 z-20">
                  <a
                    href="https://www.google.com/maps/place/REBUILD+FITNESS+GYM+2/@16.9524461,82.2128609,15z/data=!4m14!1m7!3m6!1s0x3a3829efdc1957fb:0x9a6fd8f59563789f!2sREBUILD+FITNESS+GYM+2!8m2!3d16.9524461!4d82.2274445!16s%2Fg%2F11gfh37_0t!3m5!1s0x3a3829efdc1957fb:0x9a6fd8f59563789f!8m2!3d16.9524461!4d82.2274445!16s%2Fg%2F11gfh37_0t?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-rebuild-black/80 text-white px-4 py-2 rounded-lg text-sm hover:bg-rebuild-yellow hover:text-rebuild-black transition-colors"
                  >
                    View Larger Map
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Enhanced with Accordion */}
      <section className="py-16 md:py-24 bg-rebuild-black relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rebuild-yellow/10 via-transparent to-transparent"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-block bg-rebuild-yellow/20 px-4 py-1.5 rounded-full mb-4">
              <span className="text-rebuild-yellow text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Quick answers to common questions about our gym and services
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-rebuild-darkgray border border-gray-700/50 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-rebuild-darkgray/80 hover:no-underline group">
                      <span className="text-left font-medium group-hover:text-rebuild-yellow transition-colors">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
            
            {/* Didn't find your question */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 p-6 bg-gradient-to-br from-rebuild-darkgray/80 to-rebuild-darkgray/40 backdrop-blur-sm rounded-xl border border-gray-700/50 text-center"
            >
              <h3 className="text-xl font-medium mb-2">Didn't find your answer?</h3>
              <p className="text-gray-300 mb-4">Feel free to reach out to us directly with your questions</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="tel:+919535344153" 
                  className="bg-rebuild-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                  <Phone size={18} className="mr-2" /> Call Us
                </a>
                <a 
                  href="https://wa.me/919535344153" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <MessageSquare size={18} className="mr-2" /> WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Enhanced WhatsApp CTA Section */}
      <section className="py-12 bg-gradient-to-r from-rebuild-yellow to-yellow-400 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/30 via-transparent to-transparent"></div>
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="mb-6 md:mb-0 max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-block bg-rebuild-black/20 px-4 py-1.5 rounded-full mb-4">
                  <span className="text-rebuild-black text-sm font-medium">QUICK RESPONSE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-rebuild-black mb-3">Need Immediate Assistance?</h2>
                <p className="text-rebuild-black/80 text-lg font-medium">
                  Chat with us directly on WhatsApp for quick responses about memberships, training sessions, or any other inquiries.
                </p>
                
                <div className="mt-6 flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center">
                      <Users size={16} className="text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-rebuild-black">
                    Typically responds within 30 minutes
                  </span>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="w-full md:w-auto"
            >
              <a 
                href="https://wa.me/919535344153" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rebuild-black text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full md:w-auto"
              >
                <MessageSquare size={22} className="mr-3" /> CHAT ON WHATSAPP
              </a>
              
              <p className="text-xs text-center text-rebuild-black/80 mt-3">
                Available 7 days a week, 8:00 AM - 10:00 PM
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Trust Indicators Section */}
      <section className="py-12 bg-rebuild-black border-t border-gray-800">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            <div className="flex flex-col items-center">
              <div className="text-rebuild-yellow mb-2 text-4xl font-bold">12+</div>
              <p className="text-gray-400 text-sm">Expert Trainers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-rebuild-yellow mb-2 text-4xl font-bold">500+</div>
              <p className="text-gray-400 text-sm">Active Members</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-rebuild-yellow mb-2 text-4xl font-bold">25+</div>
              <p className="text-gray-400 text-sm">Transformations</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-rebuild-yellow mb-2 text-4xl font-bold">4.8</div>
              <p className="text-gray-400 text-sm">Star Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
