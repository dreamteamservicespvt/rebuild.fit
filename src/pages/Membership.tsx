import React, { useState } from 'react';
import CTASection from '@/components/CTASection';
import { CheckCircle2, XCircle } from 'lucide-react';

const Membership = () => {
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  
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
            
            {/* Duration Selector */}
            <div className="flex justify-center mt-6">
              <div className="flex flex-wrap justify-center gap-2 bg-rebuild-darkgray rounded-lg p-1 max-w-xs sm:max-w-none">
                <button
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-sm md:text-base rounded-md ${selectedDuration === 'monthly' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                  onClick={() => setSelectedDuration('monthly')}
                >
                  1 Month
                </button>
                <button
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-sm md:text-base rounded-md ${selectedDuration === 'quarterly' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                  onClick={() => setSelectedDuration('quarterly')}
                >
                  3 Months
                </button>
                <button
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-sm md:text-base rounded-md ${selectedDuration === 'halfyearly' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                  onClick={() => setSelectedDuration('halfyearly')}
                >
                  6 Months
                </button>
                <button
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-sm md:text-base rounded-md ${selectedDuration === 'annual' ? 'bg-rebuild-yellow text-rebuild-black' : 'text-white'}`}
                  onClick={() => setSelectedDuration('annual')}
                >
                  1 Year
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengthening Plan */}
            <div className="bg-rebuild-darkgray rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col">
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold mb-2">STRENGTHENING</h3>
                <div className="text-rebuild-yellow text-4xl font-bold mb-4">
                  {selectedDuration === 'monthly' && '₹1,999'}
                  {selectedDuration === 'quarterly' && '₹5,499'}
                  {selectedDuration === 'halfyearly' && '₹7,499'}
                  {selectedDuration === 'annual' && '₹11,999'}
                  <span className="text-sm text-gray-300">/{selectedDuration === 'monthly' ? 'month' : selectedDuration === 'annual' ? 'year' : selectedDuration === 'quarterly' ? '3 months' : '6 months'}</span>
                </div>
                <p className="text-gray-300 mb-8">Focus on building strength with our specialized equipment</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Access to all strength equipment</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Gym access (6 AM - 10 PM)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Locker access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Basic strength training guidance</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle size={18} className="text-gray-500 mr-2" />
                    <span className="text-gray-500">Cardio equipment access</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <button className="w-full bg-rebuild-black hover:bg-gray-900 border border-rebuild-yellow text-rebuild-yellow font-bold py-3 rounded-md transition-colors">
                  SELECT PLAN
                </button>
              </div>
            </div>
            
            {/* Cardio + Strengthening Plan */}
            <div className="bg-rebuild-darkgray rounded-lg overflow-hidden relative transform transition duration-300 hover:scale-105 flex flex-col">
              <div className="absolute top-0 inset-x-0 py-2 bg-rebuild-yellow text-rebuild-black font-bold text-center">
                COMPLETE PACKAGE
              </div>
              <div className="p-8 pt-16 flex-grow">
                <h3 className="text-2xl font-bold mb-2">CARDIO + STRENGTHENING</h3>
                <div className="text-rebuild-yellow text-4xl font-bold mb-4">
                  {selectedDuration === 'monthly' && '₹2,499'}
                  {selectedDuration === 'quarterly' && '₹6,499'}
                  {selectedDuration === 'halfyearly' && '₹8,999'}
                  {selectedDuration === 'annual' && '₹14,999'}
                  <span className="text-sm text-gray-300">/{selectedDuration === 'monthly' ? 'month' : selectedDuration === 'annual' ? 'year' : selectedDuration === 'quarterly' ? '3 months' : '6 months'}</span>
                </div>
                <p className="text-gray-300 mb-8">Complete fitness experience with all amenities</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Full access to cardio section</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>All strength equipment access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Extended hours access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Locker & towel service</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span>Comprehensive fitness guidance</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <button className="w-full bg-rebuild-yellow hover:bg-yellow-400 text-rebuild-black font-bold py-3 rounded-md transition-colors">
                  SELECT PLAN
                </button>
              </div>
            </div>
          </div>
          
          {/* Duration Plans Info */}
          <div className="mt-12 bg-rebuild-darkgray/50 rounded-lg p-6 border border-rebuild-yellow/30 shadow-[0_0_15px_rgba(253,224,71,0.15)]">
            <h3 className="text-xl font-bold mb-4 text-rebuild-yellow">MEMBERSHIP DURATION BENEFITS</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-rebuild-black p-4 rounded-lg">
                <h4 className="font-bold mb-2">1 MONTH</h4>
                <p className="text-gray-300 text-sm">Flexible short-term commitment with standard pricing.</p>
              </div>
              <div className="bg-rebuild-black p-4 rounded-lg">
                <h4 className="font-bold mb-2">3 MONTHS</h4>
                <p className="text-gray-300 text-sm">Save up to 15% compared to monthly payments.</p>
              </div>
              <div className="bg-rebuild-black p-4 rounded-lg">
                <h4 className="font-bold mb-2">6 MONTHS</h4>
                <p className="text-gray-300 text-sm">Save up to 25% with mid-term commitment plus free assessment.</p>
              </div>
              <div className="bg-rebuild-black p-4 rounded-lg">
                <h4 className="font-bold mb-2">1 YEAR</h4>
                <p className="text-gray-300 text-sm">Best value with up to 35% savings and 2 free PT sessions.</p>
              </div>
            </div>
          </div>
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
            <div className="bg-rebuild-black p-8 rounded-lg flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">Personal Training</h3>
                <div className="text-rebuild-yellow font-bold mb-4">₹500 per session</div>
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
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span className="text-sm">Alternate days: ₹4,500/month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span className="text-sm">₹8,000 with Nutrition Plan included</span>
                  </li>
                </ul>
              </div>
              <button className="w-full border border-rebuild-yellow text-rebuild-yellow font-bold py-2 rounded-md hover:bg-rebuild-yellow hover:text-rebuild-black transition-colors mt-auto">
                ADD TO MEMBERSHIP
              </button>
            </div>
            
            {/* Add-on 2 */}
            <div className="bg-rebuild-black p-8 rounded-lg flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">Nutrition Plan</h3>
                <div className="text-rebuild-yellow font-bold mb-4">₹2,000 one-time</div>
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
              </div>
              <button className="w-full border border-rebuild-yellow text-rebuild-yellow font-bold py-2 rounded-md hover:bg-rebuild-yellow hover:text-rebuild-black transition-colors mt-auto">
                ADD TO MEMBERSHIP
              </button>
            </div>
            
            {/* Add-on 3 */}
            <div className="bg-rebuild-black p-8 rounded-lg flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">Exclusive Training</h3>
                <div className="text-rebuild-yellow font-bold mb-4">₹9,000</div>
                <p className="text-gray-300 mb-6">
                  Premium coaching for those who want dedicated attention and faster results.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span className="text-sm">Personalized workout program</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span className="text-sm">For alternate days: ₹4,500</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={18} className="text-rebuild-yellow mr-2" />
                    <span className="text-sm">Dedicated trainer</span>
                  </li>
                </ul>
              </div>
              <button className="w-full border border-rebuild-yellow text-rebuild-yellow font-bold py-2 rounded-md hover:bg-rebuild-yellow hover:text-rebuild-black transition-colors mt-auto">
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
            <div className="bg-gradient-to-r from-rebuild-darkgray to-black p-8 rounded-lg border border-rebuild-yellow/30 relative overflow-hidden flex flex-col h-full">
              <div className="absolute -right-10 -top-10 bg-rebuild-yellow/20 w-40 h-40 rounded-full blur-xl"></div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">Early Bird Discount</h3>
                <p className="text-gray-300 mb-4">
                  Join between 5 AM - 8 AM and get 15% off any membership plan
                </p>
                <div className="text-rebuild-yellow font-bold text-xl mb-6">
                  15% OFF
                </div>
              </div>
              <button className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors w-full mt-auto">
                CLAIM OFFER
              </button>
            </div>
            
            {/* Offer 2 */}
            <div className="bg-gradient-to-r from-rebuild-darkgray to-black p-8 rounded-lg border border-rebuild-yellow/30 relative overflow-hidden flex flex-col h-full">
              <div className="absolute -right-10 -top-10 bg-rebuild-yellow/20 w-40 h-40 rounded-full blur-xl"></div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">Student Special</h3>
                <p className="text-gray-300 mb-4">
                  Valid student ID gets you a free personal training session with any membership
                </p>
                <div className="text-rebuild-yellow font-bold text-xl mb-6">
                  FREE PT SESSION
                </div>
              </div>
              <button className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors w-full mt-auto">
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
