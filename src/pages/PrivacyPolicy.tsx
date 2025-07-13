import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Lock, Database, Users, Mail, Phone, MapPin, Calendar, Eye, FileText, UserCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const PrivacyPolicy = () => {
  useEffect(() => { 
    document.title = "Privacy Policy - Rebuild.Fit";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how Rebuild.Fit handles your data with transparency and care.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn how Rebuild.Fit handles your data with transparency and care.';
      document.head.appendChild(meta);
    }
  }, []);

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: Shield,
      content: [
        'At Rebuild.Fit, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our fitness services, mobile application, and website.',
        'By using our services, you agree to the collection and use of information in accordance with this policy. We will not share your information with third parties except as outlined in this Privacy Policy.'
      ]
    },
    {
      id: 'information-collected',
      title: 'Information We Collect',
      icon: Database,
      content: [
        'We collect different types of information to provide and improve our services:',
        
        '**Personal Information:**',
        '• Full name and contact details',
        '• Email address',
        '• Phone number',
        '• Gender and age information',
        '• Fitness goals and preferences',
        
        '**Media Content:**',
        '• Profile images you upload',
        '• Transformation photos (before/after)',
        '• Trainer-uploaded content and certifications',
        
        '**Usage Data:**',
        '• How you interact with our app and website',
        '• Features you use most frequently',
        '• Login patterns and session duration',
        '• Device information and browser type'
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'We use your information for the following purposes:',
        
        '**Service Provision:**',
        '• Creating and managing your membership account',
        '• Providing personalized fitness recommendations',
        '• Connecting you with suitable trainers',
        '• Processing payments and membership renewals',
        
        '**Communication:**',
        '• Sending membership updates and important notices',
        '• Responding to your inquiries and support requests',
        '• Sharing fitness tips and wellness content',
        
        '**Improvement & Analytics:**',
        '• Analyzing usage patterns to improve our services',
        '• Developing new features based on user needs',
        '• Ensuring platform security and preventing fraud'
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection Measures',
      icon: Lock,
      content: [
        'We implement comprehensive security measures to protect your personal information:',
        
        '**Technical Safeguards:**',
        '• SSL encryption for all data transmission',
        '• Secure cloud storage with access controls',
        '• Regular security audits and vulnerability assessments',
        '• Multi-factor authentication for admin access',
        
        '**Operational Security:**',
        '• Staff training on data protection protocols',
        '• Limited access to personal information on a need-to-know basis',
        '• Regular backup procedures with encrypted storage',
        '• Incident response procedures for any security breaches'
      ]
    },
    {
      id: 'third-party-services',
      title: 'Third-party Services We Use',
      icon: FileText,
      content: [
        'To provide our services effectively, we partner with trusted third-party providers:',
        
        '**Firebase (Google):**',
        '• User authentication and account management',
        '• Secure database storage (Firestore)',
        '• File storage for images and documents',
        '• Analytics to improve user experience',
        
        '**Cloudinary:**',
        '• Image upload and optimization',
        '• Media content delivery and transformation',
        '• Secure image storage and processing',
        
        'All third-party services we use comply with industry-standard security practices and data protection regulations.'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Data Rights',
      icon: UserCheck,
      content: [
        'You have several rights regarding your personal information:',
        
        '**Access Rights:**',
        '• Request a copy of all personal data we hold about you',
        '• View how your information is being processed',
        
        '**Modification Rights:**',
        '• Update or correct your personal information',
        '• Change your communication preferences',
        
        '**Deletion Rights:**',
        '• Request deletion of your personal data',
        '• Cancel your account and remove associated information',
        
        '**Control Rights:**',
        '• Opt-out of marketing communications',
        '• Control what information is shared with trainers',
        
        'To exercise any of these rights, please contact us using the information provided below.'
      ]
    },
    {
      id: 'contact-information',
      title: 'Contact Information',
      icon: Mail,
      content: [
        'If you have any questions about this Privacy Policy or our data practices, please contact us:',
        
        '**Email:** support@rebuild.fit',
        
        '**Address:**',
        'Rebuild Gym Kakinada',
        'D–01, Jawaharlal Street',
        'Kakinada, Andhra Pradesh 533001',
        'India',
        
        '**Response Time:** We typically respond to privacy-related inquiries within 48 hours during business days.'
      ]
    },
    {
      id: 'policy-updates',
      title: 'Policy Updates',
      icon: Calendar,
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make significant changes, we will:',
        
        '• Notify you via email (if you have provided one)',
        '• Display a prominent notice on our website and app',
        '• Update the "Last Updated" date at the bottom of this policy',
        
        'We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-rebuild-black text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')",
            filter: "brightness(30%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/60 via-transparent to-rebuild-black" />
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left max-w-4xl"
          >
            {/* Breadcrumb Navigation */}
            <motion.div 
              className="flex items-center justify-center md:justify-start mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Button 
                asChild
                variant="ghost" 
                className="text-gray-300 hover:text-rebuild-yellow hover:bg-rebuild-yellow/10 p-2"
              >
                <Link to="/" className="flex items-center">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>

            {/* Accent Badge */}
            <div className="inline-block bg-rebuild-yellow/20 px-4 py-2 rounded-full mb-6">
              <span className="text-rebuild-yellow text-sm font-medium flex items-center">
                <Shield size={16} className="mr-2" />
                PRIVACY & DATA PROTECTION
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              PRIVACY POLICY
            </h1>
            <div className="w-20 h-1.5 bg-rebuild-yellow mb-6 mx-auto md:mx-0" />
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto md:mx-0 leading-relaxed text-gray-300">
              Your privacy matters to us. Learn how we collect, protect, and use your personal information with complete transparency.
            </p>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button 
                asChild
                className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 transition-colors group"
              >
                <a href="#information-collected">
                  VIEW DATA COLLECTION <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-rebuild-black to-transparent" />
      </section>

      {/* Last Updated Banner */}
      <section className="py-4 bg-rebuild-yellow/10 border-y border-rebuild-yellow/20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-center text-center">
            <Calendar className="text-rebuild-yellow mr-2" size={18} />
            <span className="text-rebuild-yellow font-medium">
              Last Updated: July 13, 2025
            </span>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-rebuild-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="mr-2 text-rebuild-yellow" size={20} />
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <a
                        href={`#${section.id}`}
                        className="flex items-center p-3 rounded-lg border border-gray-600 hover:border-rebuild-yellow/50 hover:bg-rebuild-yellow/5 transition-all duration-300 group"
                      >
                        <section.icon className="text-rebuild-yellow mr-3 group-hover:scale-110 transition-transform" size={18} />
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {section.title}
                        </span>
                        <ChevronRight className="ml-auto text-gray-500 group-hover:text-rebuild-yellow group-hover:translate-x-1 transition-all" size={16} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="scroll-mt-24"
              >
                <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow/30 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center text-xl md:text-2xl">
                      <section.icon className="mr-3 text-rebuild-yellow" size={24} />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                      {section.content.map((paragraph, pIndex) => (
                        <div key={pIndex}>
                          {paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                            <h4 className="text-rebuild-yellow font-semibold text-lg mt-6 mb-3">
                              {paragraph.replace(/\*\*/g, '')}
                            </h4>
                          ) : paragraph.startsWith('•') ? (
                            <div className="flex items-start ml-4">
                              <div className="w-2 h-2 bg-rebuild-yellow rounded-full mt-2.5 mr-3 flex-shrink-0" />
                              <p className="text-gray-300">{paragraph.substring(2)}</p>
                            </div>
                          ) : (
                            <p className="text-gray-300 leading-relaxed">
                              {paragraph}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-rebuild-yellow/10 to-yellow-400/10 border-rebuild-yellow/30">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Questions About Your Privacy?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  We're here to help. Contact our support team if you have any questions about how we handle your personal information.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 transition-colors group"
                  >
                    <Link to="/contact">
                      <Mail className="mr-2" size={18} />
                      Contact Support
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-rebuild-yellow text-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black"
                  >
                    <Link to="/membership">
                      <Shield className="mr-2" size={18} />
                      Join Safely
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-rebuild-darkgray">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-xl font-bold text-white mb-8">Your Data is Protected</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Lock, label: 'SSL Encrypted', desc: 'All data transmission encrypted' },
                { icon: Shield, label: 'GDPR Compliant', desc: 'Following privacy regulations' },
                { icon: Database, label: 'Secure Storage', desc: 'Cloud-based protected servers' },
                { icon: UserCheck, label: 'User Control', desc: 'Full control over your data' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-rebuild-yellow/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <item.icon className="text-rebuild-yellow" size={20} />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{item.label}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
