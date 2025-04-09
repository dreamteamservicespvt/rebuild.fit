
import React from 'react';
import Hero from '@/components/Hero';
import FounderSection from '@/components/FounderSection';
import BranchCard from '@/components/BranchCard';
import TrainerCard from '@/components/TrainerCard';
import TransformationCard from '@/components/TransformationCard';
import CTASection from '@/components/CTASection';
import { Dumbbell, ShieldCheck, Brain } from 'lucide-react';

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Founder Vision Section */}
      <FounderSection />
      
      {/* Why Natural? Section */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              OUR PHILOSOPHY
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">WHY NATURAL?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-rebuild-darkgray p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <ShieldCheck size={32} className="text-rebuild-yellow" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No Shortcuts</h3>
              <p className="text-gray-300">
                We believe in sustainable fitness journeys that lead to lasting results, not quick fixes that harm your body in the long run.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-rebuild-darkgray p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Dumbbell size={32} className="text-rebuild-yellow" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No Harmful Supplements</h3>
              <p className="text-gray-300">
                Our approach emphasizes natural nutrition, proper workout techniques, and recovery—avoiding dangerous steroids and harmful supplements.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-rebuild-darkgray p-8 rounded-lg hover:shadow-lg hover:shadow-rebuild-yellow/20 transition-all duration-300">
              <div className="bg-rebuild-yellow/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Brain size={32} className="text-rebuild-yellow" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Science-backed Coaching</h3>
              <p className="text-gray-300">
                Our trainers use evidence-based methods and personalized approaches to help you achieve your fitness goals naturally.
              </p>
            </div>
          </div>
          
          {/* Testimonial/Scientific Quote */}
          <blockquote className="mt-12 border-l-4 border-rebuild-yellow pl-6 max-w-3xl mx-auto">
            <p className="text-xl italic text-gray-300">
              "Research shows that natural, sustainable fitness methods not only lead to better long-term results, but also significantly reduce health risks associated with performance-enhancing substances."
            </p>
            <footer className="mt-4 text-rebuild-yellow">
              — Dr. Rajesh Kumar, Sports Medicine Specialist
            </footer>
          </blockquote>
        </div>
      </section>
      
      {/* Three Branches Section */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              SPECIALIZED SPACES
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">OUR THREE BRANCHES</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BranchCard 
              title="Premium Gym"
              description="Our flagship facility with state-of-the-art equipment and comprehensive services for serious fitness enthusiasts."
              image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              link="/gyms"
              features={[
                "For Men & Women",
                "Personal Training",
                "Nutrition Guidance",
                "AC Environment",
                "Shower Facilities"
              ]}
            />
            
            <BranchCard 
              title="Women-Only Gym"
              description="A safe, supportive space exclusively for women with specialized equipment and female trainers."
              image="https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              link="/gyms"
              features={[
                "Female Trainers",
                "Private Environment",
                "Specialized Programs",
                "Toning Focus",
                "Personal Coaching"
              ]}
            />
            
            <BranchCard 
              title="Student Gym"
              description="Affordable fitness options for students with high-energy atmosphere and essential equipment."
              image="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              link="/gyms"
              features={[
                "Budget Friendly",
                "Student Discounts",
                "Group Classes",
                "Basic Equipment",
                "Flexible Timings"
              ]}
            />
          </div>
        </div>
      </section>
      
      {/* Transformation Showcase */}
      <section className="py-16 md:py-24 bg-rebuild-black">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              SUCCESS STORIES
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">TRANSFORMATION SHOWCASE</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TransformationCard 
              name="Rahul Sharma"
              beforeImage="https://images.unsplash.com/photo-1581125119293-4803aa54b372?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"
              afterImage="https://images.unsplash.com/photo-1567013127542-490d757e6349?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80"
              duration="6 Months"
              goal="Fat Loss & Muscle Gain"
              testimonial="I lost 15kgs and gained visible muscle definition within 6 months of joining Rebuild Gym. The trainers' focus on natural methods has completely changed my lifestyle for the better."
            />
            
            <TransformationCard 
              name="Priya Patel"
              beforeImage="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"
              afterImage="https://images.unsplash.com/photo-1609899464926-c34737772596?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80"
              duration="4 Months"
              goal="Strength & Toning"
              testimonial="The women's gym provided me with the comfortable environment I needed. I've gained incredible strength and confidence without any pressure to use supplements."
            />
            
            <TransformationCard 
              name="Arjun Desai"
              beforeImage="https://images.unsplash.com/photo-1600019281908-65efe6b10da6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"
              afterImage="https://images.unsplash.com/photo-1632781297772-1d68e15f1d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1776&q=80"
              duration="8 Months"
              goal="Muscle Building"
              testimonial="As a student, I thought I'd need supplements to get real results. The trainers at Rebuild showed me that proper form, nutrition, and consistency are what truly matter."
            />
          </div>
        </div>
      </section>
      
      {/* Meet the Trainers */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              EXPERT GUIDANCE
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">MEET THE TRAINERS</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <TrainerCard 
              name="Ravi Kumar"
              role="Head Trainer"
              image="https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1888&q=80"
              experience="10+ Years"
              specialization="Strength & Conditioning"
            />
            
            <TrainerCard 
              name="Anjali Reddy"
              role="Women's Fitness Coach"
              image="https://images.unsplash.com/photo-1609899464926-c34737772596?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80"
              experience="8 Years"
              specialization="Toning & Functional Fitness"
            />
            
            <TrainerCard 
              name="Vikram Singh"
              role="Nutrition Specialist"
              image="https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
              experience="7+ Years"
              specialization="Diet Planning & Weight Management"
            />
            
            <TrainerCard 
              name="Meera Joshi"
              role="Student Program Lead"
              image="https://images.unsplash.com/photo-1530645833031-97107ee1d2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1879&q=80"
              experience="6 Years"
              specialization="Group Training & Basics"
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Index;
