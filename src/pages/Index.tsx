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
      
      {/* Three Branches Section - Modified to show only Premium Gym */}
      <section className="py-16 md:py-24 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h4 className="inline-block font-bebas text-rebuild-yellow tracking-widest border-b-2 border-rebuild-yellow mb-4 pb-1">
              OUR FACILITY
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold">PREMIUM GYM</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
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
                "Shower Facilities",
                "Expert Trainers",
                "Personalized Programs"
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
              name="Arjun Desai"
              beforeImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747676152/uzphwgmljn5womru59wz.jpg"
              afterImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747676137/aoaoqoianm3btizaaspi.jpg"
              duration="8 Months"
              goal="Muscle Building"
              testimonial="As a student, I thought I'd need supplements to get real results. The trainers at Rebuild showed me that proper form, nutrition, and consistency are what truly matter."
            />
            
            <TransformationCard 
              name="Siddharth Kapoor"
              beforeImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747677823/gznk8fsqrrfsgs7qssac.jpg"
              afterImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747677826/vtmbwu2qhnmmobrdtb1r.jpg"
              duration="5 Months"
              goal="Fat Loss"
              testimonial="I thought getting back in shape would be impossible with my busy schedule. Rebuild created a plan that worked with my routine and helped me lose 20kgs naturally."
            />
            
            <TransformationCard 
              name="Akash Sharma"
              beforeImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678020/dzq9jbnylqpmjzt3s7il.jpg"
              afterImage="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678022/vndwcp0jxmy48kry1kzk.jpg"
              duration="10 Months"
              goal="Strength & Muscle"
              testimonial="I was skeptical about building muscle without supplements, but Rebuild's science-backed approach proved me wrong. I've gained more strength and definition than ever before."
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
              name="Sagar Akula"
              role="Head Trainer"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747470852/zhss0e6f61e0nccafwl6.jpg"
              experience="10+ Years"
              specialization="Natural Bodybuilding & Transformation"
            />
            
            <TrainerCard 
              name="Chandu"
              role="Partner & Head Trainer"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678656/ifafg4cds1vj46oqmth4.jpg"
              experience="8 Years"
              specialization="Strength & Conditioning"
            />
            
            <TrainerCard 
              name="Vasu"
              role="Strength Coach"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678982/fss5ijkf6cb8grzpdkco.jpg"
              experience="7+ Years"
              specialization="Diet Planning & Weight Management"
            />
            
                <TrainerCard 
              name="Revathi"
              role="Women's Fitness Coach"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678979/gymlbrwtlgb4quxyksej.jpg"
              experience="6 Years"
              specialization="Toning & Weight Management"
            />
            
            <TrainerCard 
              name="Aparna"
              role="Fitness Instructor"
              image="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747678984/b2aus5dgw4lnb09hmuha.jpg"
              experience="5 Years"
              specialization="Functional Training & Nutrition"
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
