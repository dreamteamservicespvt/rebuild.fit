import React from 'react';
import CTASection from '@/components/CTASection';
import { MapPin, Clock, Info } from 'lucide-react';

const Gyms = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')",
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <div className="container-custom relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">OUR GYMS</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Choose Your Arena - Three Specialized Facilities for Every Need
          </h2>
        </div>
      </section>
      
      {/* Premium Gym */}
      <section id="premium" className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-rebuild-yellow/20 px-4 py-1 rounded-full mb-4">
                <h4 className="text-rebuild-yellow text-sm font-semibold">FLAGSHIP LOCATION</h4>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">PREMIUM GYM</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <p className="text-gray-300 mb-6">
                Our flagship facility offers state-of-the-art equipment, personalized training, and comprehensive services for serious fitness enthusiasts. In a modern, air-conditioned environment, members enjoy access to premium amenities and expert guidance.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Premium strength training equipment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">One-on-one personal training</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Nutrition consultation services</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Clean shower and changing facilities</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Air-conditioned workout spaces</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center">
                  <MapPin size={20} className="text-rebuild-yellow mr-2" />
                  <p className="text-sm">123 Main Street, Kakinada</p>
                </div>
                <div className="flex items-center">
                  <Clock size={20} className="text-rebuild-yellow mr-2" />
                  <p className="text-sm">5:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Premium Gym Equipment"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"
                alt="Premium Gym Interior"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1331&q=80"
                alt="Weight Area"
                className="rounded-lg col-span-2"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Women-Only Gym */}
      <section id="women" className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Women's Gym Training"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Women's Gym Equipment"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Group Class"
                className="rounded-lg col-span-2"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-rebuild-yellow/20 px-4 py-1 rounded-full mb-4">
                <h4 className="text-rebuild-yellow text-sm font-semibold">DESIGNED FOR WOMEN</h4>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">WOMEN-ONLY GYM</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <p className="text-gray-300 mb-6">
                Our women-only facility provides a safe, supportive environment where women can focus on their fitness journey without distractions. With female trainers and specialized programs, this gym is designed to empower women through fitness.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Female trainers exclusively</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Women-focused equipment selection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Private, comfortable environment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Specialized toning & weight loss programs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Women-only group classes</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center">
                  <MapPin size={20} className="text-rebuild-yellow mr-2" />
                  <p className="text-sm">456 Lake View, Kakinada</p>
                </div>
                <div className="flex items-center">
                  <Clock size={20} className="text-rebuild-yellow mr-2" />
                  <p className="text-sm">6:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Student Gym */}
      <section id="student" className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-rebuild-yellow/20 px-4 py-1 rounded-full mb-4">
                <h4 className="text-rebuild-yellow text-sm font-semibold">AFFORDABLE FOR STUDENTS</h4>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">STUDENT GYM</h2>
              <div className="w-16 h-1 bg-rebuild-yellow mb-8" />
              
              <p className="text-gray-300 mb-6">
                Our student-focused gym offers affordable fitness options in a high-energy atmosphere. With essential equipment and flexible timings, this facility makes quality training accessible to students on a budget.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Student-friendly pricing plans</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Essential strength and cardio equipment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Group fitness classes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Flexible operating hours</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rebuild-yellow rounded-full mr-2" />
                  <span className="text-gray-300">Community-focused atmosphere</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center">
                  <MapPin size={20} className="text-rebuild-yellow mr-2" />
                  <p className="text-sm">789 College Road, Kakinada</p>
                </div>
                <div className="flex items-center">
                  <Clock size={20} className="text-rebuild-yellow mr-2" />
                  <p className="text-sm">5:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Student Gym"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Students Working Out"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1518644730709-0835105d9daa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                alt="Group Fitness"
                className="rounded-lg col-span-2"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">FIND OUR LOCATION</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Visit our premium gym in Kakinada - designed to meet all your fitness needs
            </p>
          </div>
          
          <div className="bg-rebuild-black p-4 rounded-lg">
            <div className="aspect-[16/9] rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5944.102475752507!2d82.2274445!3d16.9555617!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3829efdc1957fb%3A0x9a6fd8f59563789f!2sREBUILD%20FITNESS%20GYM%202!5e1!3m2!1sen!2sin!4v1747483036416!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Rebuild Gym Location"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
          
          <div className="bg-rebuild-black p-6 rounded-lg mt-12 max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-3">Premium Gym</h3>
            <div className="flex items-start mb-4">
              <MapPin size={20} className="text-rebuild-yellow mr-2 mt-1" />
              <p className="text-gray-300">123 Main Street, Kakinada, Andhra Pradesh 533001</p>
            </div>
            <div className="flex items-center">
              <Clock size={20} className="text-rebuild-yellow mr-2" />
              <div>
                <p className="text-gray-300">Mon - Fri: 5:00 AM - 10:00 PM</p>
                <p className="text-gray-300">Sat - Sun: 6:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Gyms;
