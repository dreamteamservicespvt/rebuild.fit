
import React, { useState } from 'react';
import CTASection from '@/components/CTASection';
import { CheckCircle2, XCircle } from 'lucide-react';

const Membership = () => {
  const [selectedGym, setSelectedGym] = useState('premium');
  
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1636279946528-a88ac80350f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1996&q=80')",
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <div className="container-custom relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">MEMBERSHIP PLANS</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Plans Built For You - Invest in Your Transformation
          </h2>
        </div>
      </section>
      
      {/* Pricing Tables */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">CHOOSE YOUR PLAN</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Select the membership that fits your needs and budget, all with our natural transformation approach
            </p>
            
            {/* Gym Type Selector */}
            <div className="flex justify-center mt-8">
              <div className="inline-flex bg-rebuild-darkgray rounded-lg p-1">
                <button
                  className={`px-5 py-2 rounded-md ${selectedGym === 'premium' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                  onClick={() => setSelectedGym('premium')}
                >
                  Premium
                </button>
                <button
                  className={`px-5 py-2 rounded-md ${selectedGym === 'women' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                  onClick={() => setSelectedGym('women')}
                >
                  Women's
                </button>
                <button
                  className={`px-5 py-2 rounded-md ${selectedGym === 'student' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                  onClick={() => setSelectedGym('student')}
                >
                  Student
                </button>
              </div>
            </div>
          </div>
          
          {selectedGym === 'premium' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹1,999<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Essential access for fitness beginners</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Gym access (6 AM - 10 PM)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Basic equipment usage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Locker access</span>
                    </li>
                    <li className="flex items-center">
                      <XCircle size={18} className="text-gray-500 mr-2" />
                      <span className="text-gray-500">Personal training sessions</span>
                    </li>
                    <li className="flex items-center">
                      <XCircle size={18} className="text-gray-500 mr-2" />
                      <span className="text-gray-500">Nutrition consultation</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-black hover:bg-gray-900 border border-rebuild-yellow text-rebuild-yellow font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden relative transform transition duration-300 hover:scale-105">
                <div className="absolute top-0 inset-x-0 py-2 bg-rebuild-yellow text-rebuild-black font-bold text-center">
                  MOST POPULAR
                </div>
                <div className="p-8 pt-16">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹3,499<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Complete fitness experience with guidance</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>24/7 gym access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>All equipment access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Locker & towel service</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>2 PT sessions/month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Basic nutrition plan</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-yellow hover:bg-yellow-400 text-rebuild-black font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
              
              {/* Elite Plan */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Elite</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹5,999<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Ultimate transformation package</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>24/7 gym access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>All equipment & amenities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Locker & premium towels</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>8 PT sessions/month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Complete nutrition coaching</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-black hover:bg-gray-900 border border-rebuild-yellow text-rebuild-yellow font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {selectedGym === 'women' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan - Women's */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹1,799<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Essential access to women's gym</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Women's gym access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Basic equipment</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>1 group class/week</span>
                    </li>
                    <li className="flex items-center">
                      <XCircle size={18} className="text-gray-500 mr-2" />
                      <span className="text-gray-500">Personal training</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-black hover:bg-gray-900 border border-rebuild-yellow text-rebuild-yellow font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
              
              {/* Premium Plan - Women's */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden relative transform transition duration-300 hover:scale-105">
                <div className="absolute top-0 inset-x-0 py-2 bg-rebuild-yellow text-rebuild-black font-bold text-center">
                  MOST POPULAR
                </div>
                <div className="p-8 pt-16">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹2,999<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Complete women's fitness package</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Extended hours access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>All equipment access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Unlimited group classes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>2 PT sessions/month</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-yellow hover:bg-yellow-400 text-rebuild-black font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
              
              {/* Elite Plan - Women's */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Elite</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹4,999<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Complete transformation package</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>24/7 access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>All women's gym amenities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Unlimited group classes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>8 PT sessions/month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Women's nutrition plan</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-black hover:bg-gray-900 border border-rebuild-yellow text-rebuild-yellow font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {selectedGym === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan - Student */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹999<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Affordable student access</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Student gym access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Basic equipment</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Off-peak hours only</span>
                    </li>
                    <li className="flex items-center">
                      <XCircle size={18} className="text-gray-500 mr-2" />
                      <span className="text-gray-500">Group classes</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-black hover:bg-gray-900 border border-rebuild-yellow text-rebuild-yellow font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
              
              {/* Premium Plan - Student */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden relative transform transition duration-300 hover:scale-105">
                <div className="absolute top-0 inset-x-0 py-2 bg-rebuild-yellow text-rebuild-black font-bold text-center">
                  MOST POPULAR
                </div>
                <div className="p-8 pt-16">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹1,499<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Complete student package</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Full-time access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>All equipment</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>2 group classes/week</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Basic fitness assessment</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-yellow hover:bg-yellow-400 text-rebuild-black font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
              
              {/* Elite Plan - Student */}
              <div className="bg-rebuild-darkgray rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Elite</h3>
                  <div className="text-rebuild-yellow text-4xl font-bold mb-4">₹2,499<span className="text-sm text-gray-300">/month</span></div>
                  <p className="text-gray-300 mb-8">Ultimate student package</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>24/7 access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>All equipment & amenities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Unlimited group classes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>2 PT sessions/month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                      <span>Student nutrition guidance</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-rebuild-black hover:bg-gray-900 border border-rebuild-yellow text-rebuild-yellow font-bold py-3 rounded-md transition-colors">
                    SELECT PLAN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Add-ons Section */}
      <section className="py-16 md:py-20 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">ENHANCE YOUR EXPERIENCE</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Add specialized services to any membership plan for a customized fitness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add-on 1 */}
            <div className="bg-rebuild-black p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Personal Training</h3>
              <div className="text-rebuild-yellow font-bold mb-4">From ₹800 per session</div>
              <p className="text-gray-300 mb-6">
                One-on-one coaching with our certified trainers, customized to your specific goals and fitness level.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Individual attention</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Customized workouts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Form correction</span>
                </li>
              </ul>
              <button className="w-full border border-rebuild-yellow text-rebuild-yellow font-bold py-2 rounded-md hover:bg-rebuild-yellow hover:text-rebuild-black transition-colors">
                ADD TO MEMBERSHIP
              </button>
            </div>
            
            {/* Add-on 2 */}
            <div className="bg-rebuild-black p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Nutrition Plan</h3>
              <div className="text-rebuild-yellow font-bold mb-4">₹3,999 one-time</div>
              <p className="text-gray-300 mb-6">
                Detailed nutrition guidance tailored to your body type, goals, and dietary preferences.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Customized meal plans</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Grocery shopping guide</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Two follow-up sessions</span>
                </li>
              </ul>
              <button className="w-full border border-rebuild-yellow text-rebuild-yellow font-bold py-2 rounded-md hover:bg-rebuild-yellow hover:text-rebuild-black transition-colors">
                ADD TO MEMBERSHIP
              </button>
            </div>
            
            {/* Add-on 3 */}
            <div className="bg-rebuild-black p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Online Coaching</h3>
              <div className="text-rebuild-yellow font-bold mb-4">₹2,499/month</div>
              <p className="text-gray-300 mb-6">
                Remote coaching for those who travel or prefer to workout at home, with regular check-ins.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Weekly workout plans</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Video form checks</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                  <span className="text-sm">Nutrition guidance</span>
                </li>
              </ul>
              <button className="w-full border border-rebuild-yellow text-rebuild-yellow font-bold py-2 rounded-md hover:bg-rebuild-yellow hover:text-rebuild-black transition-colors">
                ADD TO MEMBERSHIP
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Special Offers */}
      <section className="py-16 md:py-20 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">SPECIAL OFFERS</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Take advantage of our limited-time promotions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Offer 1 */}
            <div className="bg-gradient-to-r from-rebuild-darkgray to-black p-8 rounded-lg border border-rebuild-yellow/30 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 bg-rebuild-yellow/20 w-40 h-40 rounded-full blur-xl"></div>
              <h3 className="text-2xl font-bold mb-2">Early Bird Discount</h3>
              <p className="text-gray-300 mb-4">
                Join between 5 AM - 8 AM and get 15% off any membership plan
              </p>
              <div className="text-rebuild-yellow font-bold text-xl mb-6">
                15% OFF
              </div>
              <button className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors">
                CLAIM OFFER
              </button>
            </div>
            
            {/* Offer 2 */}
            <div className="bg-gradient-to-r from-rebuild-darkgray to-black p-8 rounded-lg border border-rebuild-yellow/30 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 bg-rebuild-yellow/20 w-40 h-40 rounded-full blur-xl"></div>
              <h3 className="text-2xl font-bold mb-2">Student Special</h3>
              <p className="text-gray-300 mb-4">
                Valid student ID gets you a free personal training session with any membership
              </p>
              <div className="text-rebuild-yellow font-bold text-xl mb-6">
                FREE PT SESSION
              </div>
              <button className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors">
                CLAIM OFFER
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Membership;
