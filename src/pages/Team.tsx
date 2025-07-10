import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { teamMemberService, type TeamMember } from '@/lib/firebaseServices';
import CTASection from '@/components/CTASection';
import LoadingScreen from '@/components/LoadingScreen';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Our Team | REBUILD.fit";
    
    const unsubscribe = teamMemberService.onSnapshot((membersList) => {
      setTeamMembers(membersList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-rebuild-black text-white min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80')",
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <motion.div 
          className="container-custom relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">OUR TEAM</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Meet the dedicated professionals behind REBUILD's natural transformation philosophy
          </h2>
        </motion.div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              className="inline-block text-sm text-rebuild-yellow uppercase tracking-wider mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              THE PROFESSIONALS BEHIND REBUILD
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Meet Our <span className="text-rebuild-yellow">Experts</span>
            </motion.h2>
            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our team of experienced professionals is committed to helping you achieve your fitness goals naturally, 
              without relying on steroids or shortcuts. With expertise in training, nutrition, and holistic wellness, 
              we provide personalized guidance on your fitness journey.
            </motion.p>
          </div>
          
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-rebuild-darkgray rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-rebuild-yellow/50"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Team Member Image */}
                  <div className="aspect-[4/5] overflow-hidden relative">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-3xl text-gray-600">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-rebuild-black via-transparent to-transparent opacity-70"></div>
                  </div>
                  
                  {/* Team Member Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <div className="h-1 w-12 bg-rebuild-yellow mb-3"></div>
                    <p className="text-rebuild-yellow font-medium mb-4">{member.role}</p>
                    <p className="text-gray-300 mb-6 line-clamp-3">{member.bio}</p>
                    
                    {/* Social Media Links */}
                    <div className="flex gap-3">
                      {member.socialLinks?.instagram && (
                        <a 
                          href={member.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-rebuild-black/50 hover:bg-rebuild-yellow/20 p-2 rounded-full transition-colors"
                        >
                          <Instagram size={18} className="text-rebuild-yellow" />
                        </a>
                      )}
                      {member.socialLinks?.facebook && (
                        <a 
                          href={member.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-rebuild-black/50 hover:bg-rebuild-yellow/20 p-2 rounded-full transition-colors"
                        >
                          <Facebook size={18} className="text-rebuild-yellow" />
                        </a>
                      )}
                      {member.socialLinks?.linkedin && (
                        <a 
                          href={member.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-rebuild-black/50 hover:bg-rebuild-yellow/20 p-2 rounded-full transition-colors"
                        >
                          <Linkedin size={18} className="text-rebuild-yellow" />
                        </a>
                      )}
                      {member.socialLinks?.twitter && (
                        <a 
                          href={member.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-rebuild-black/50 hover:bg-rebuild-yellow/20 p-2 rounded-full transition-colors"
                        >
                          <Twitter size={18} className="text-rebuild-yellow" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-rebuild-darkgray rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Our Team is Coming Soon</h3>
              <p className="text-gray-300 max-w-lg mx-auto">
                We're assembling a team of top professionals dedicated to natural fitness and transformation.
                Check back soon to meet our experts!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Mission & Values Section */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm text-rebuild-yellow uppercase tracking-wider mb-3">OUR PHILOSOPHY</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Natural Fitness <span className="text-rebuild-yellow">Philosophy</span></h2>
              <p className="text-gray-300 mb-8">
                At REBUILD, we firmly believe in achieving fitness goals through natural means. Our team's approach
                combines science-based training, proper nutrition, and adequate recovery to help you transform
                without shortcuts or harmful substances.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rebuild-yellow/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-rebuild-yellow"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Expert Guidance</h4>
                    <p className="text-gray-300">
                      Our team consists of certified professionals with years of experience in natural bodybuilding,
                      strength training, nutrition, and wellness.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rebuild-yellow/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-rebuild-yellow"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Personalized Approach</h4>
                    <p className="text-gray-300">
                      We understand that everyone's body and goals are different, which is why our team creates
                      customized plans tailored to your unique needs and circumstances.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rebuild-yellow/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-rebuild-yellow"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Continuous Education</h4>
                    <p className="text-gray-300">
                      Our team constantly updates their knowledge to provide you with the most effective,
                      science-based methods for natural fitness.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1617344302496-51d61f6d02f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                  alt="Team Meeting" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-rebuild-yellow text-rebuild-black p-6 rounded-xl max-w-xs">
                <h3 className="text-xl font-bold mb-2">"No Steroids. Just Strength."</h3>
                <p className="font-medium">
                  Our team's commitment to natural fitness is at the core of everything we do at REBUILD.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Team;
