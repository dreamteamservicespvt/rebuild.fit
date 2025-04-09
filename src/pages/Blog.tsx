
import React from 'react';
import { Link } from 'react-router-dom';
import CTASection from '@/components/CTASection';

const Blog = () => {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Truth About Natural Muscle Building",
      excerpt: "Discover the science-backed approaches to building muscle without harmful supplements or steroids.",
      category: "Nutrition",
      author: "Vikram Singh",
      date: "April 2, 2025",
      image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 2,
      title: "5 Common Myths About Steroids in Fitness",
      excerpt: "We debunk the most prevalent misconceptions about performance-enhancing substances in the gym community.",
      category: "Education",
      author: "Ravi Kumar",
      date: "March 28, 2025",
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80",
    },
    {
      id: 3,
      title: "Women's Guide to Natural Strength Training",
      excerpt: "How women can build strength effectively without compromising on health or femininity.",
      category: "Women's Fitness",
      author: "Anjali Reddy",
      date: "March 20, 2025",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 4,
      title: "Nutrition Fundamentals for Sustainable Fitness",
      excerpt: "Learn about proper nutrition principles that support your fitness journey for the long term.",
      category: "Nutrition",
      author: "Vikram Singh",
      date: "March 15, 2025",
      image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 5,
      title: "Student Fitness on a Budget",
      excerpt: "How to maintain a fitness routine and eat well while on a tight student budget.",
      category: "Student Life",
      author: "Meera Joshi",
      date: "March 10, 2025",
      image: "https://images.unsplash.com/photo-1578763617375-dea158b90720?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80",
    },
    {
      id: 6,
      title: "Recovery Techniques for Natural Athletes",
      excerpt: "Optimize your recovery to maximize gains without relying on pharmaceutical aids.",
      category: "Training",
      author: "Ravi Kumar",
      date: "March 5, 2025",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    }
  ];
  
  return (
    <div>
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
        
        <div className="container-custom relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">REBUILD KNOWLEDGE</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Insights, Tips, and Scientific Guidance for Natural Fitness
          </h2>
        </div>
      </section>
      
      {/* Featured Post */}
      <section className="py-16 md:py-20 bg-rebuild-black">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="The Dangers of Steroid Use in Fitness" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="inline-block bg-rebuild-yellow/20 px-4 py-1 rounded-full mb-4">
                <span className="text-rebuild-yellow text-sm font-medium">FEATURED ARTICLE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Dangers of Steroid Use in Fitness</h2>
              <p className="text-gray-300 mb-6">
                In this comprehensive article, we explore the short and long-term health risks associated with performance-enhancing drugs, and why natural fitness is always the better choice for sustainable health and wellness.
              </p>
              <div className="flex items-center mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1888&q=80" 
                  alt="Sagar Akula" 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium">Sagar Akula</p>
                  <p className="text-sm text-gray-400">April 5, 2025 • 12 min read</p>
                </div>
              </div>
              <Link to="/blog/the-dangers-of-steroid-use-in-fitness" className="bg-rebuild-yellow text-rebuild-black font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors inline-block">
                READ ARTICLE
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Post Grid */}
      <section className="py-16 md:py-20 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Latest Articles</h2>
            <div className="hidden md:flex space-x-4">
              <button className="px-4 py-2 bg-rebuild-black rounded-md hover:bg-gray-800 transition-colors">All</button>
              <button className="px-4 py-2 hover:text-rebuild-yellow transition-colors">Nutrition</button>
              <button className="px-4 py-2 hover:text-rebuild-yellow transition-colors">Training</button>
              <button className="px-4 py-2 hover:text-rebuild-yellow transition-colors">Education</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <article key={post.id} className="bg-rebuild-black rounded-lg overflow-hidden hover:shadow-lg hover:shadow-rebuild-yellow/10 transition-all duration-300">
                <div className="h-52 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-rebuild-yellow text-sm">{post.category}</span>
                    <span className="text-gray-400 text-sm">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-gray-300 text-sm mb-6">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">By {post.author}</span>
                    <Link to={`/blog/${post.id}`} className="text-rebuild-yellow hover:underline text-sm font-medium">
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-rebuild-yellow text-rebuild-black font-bold py-2 px-8 rounded-md hover:bg-yellow-400 transition-colors">
              LOAD MORE
            </button>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-rebuild-black">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to receive weekly fitness tips, natural transformation stories, and exclusive content
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow py-3 px-4 bg-rebuild-darkgray border border-gray-700 rounded-md focus:outline-none focus:border-rebuild-yellow text-white"
              />
              <button 
                type="submit" 
                className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            
            <p className="text-xs text-gray-400 mt-4">
              By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Blog;
