import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/CTASection';
import BlogCard from '@/components/BlogCard';
import { blogService, type BlogPost } from '@/lib/firebaseServices';
import LoadingScreen from '@/components/LoadingScreen';
import { Calendar, User, BookOpen, ArrowRight, Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visiblePosts, setVisiblePosts] = useState(6); // Number of posts to show initially
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Blog | REBUILD.fit";
    
    try {
      const unsubscribe = blogService.onSnapshot((blogData) => {
        setBlogPosts(blogData);
        setLoading(false);
        setError(null);
      });
      
      return () => unsubscribe();
    } catch (error) {
      setError('Failed to load blog posts. Please try again later.');
      setLoading(false);
      return () => {}; // Empty cleanup function in case of error
    }
  }, []);

  // Filter posts based on category and search query
  useEffect(() => {
    let result = blogPosts;
    
    // Apply category filter if not 'all'
    if (selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    // Apply search query if exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(result);
  }, [blogPosts, selectedCategory, searchQuery]);

  // Focus search input when search bar is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handlePostClick = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  const loadMorePosts = () => {
    setVisiblePosts(prevCount => prevCount + 6);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // Get unique categories from blog posts
  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category || 'Uncategorized')))].sort();

  // Get featured post (most recent or pick one specifically)
  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;

  const postsToDisplay = filteredPosts.slice(0, visiblePosts);
  const hasMorePosts = filteredPosts.length > visiblePosts;

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rebuild-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Blog Posts</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-rebuild-yellow text-rebuild-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        
        <motion.div 
          className="container-custom relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">REBUILD KNOWLEDGE</h1>
          <div className="w-20 h-1.5 bg-rebuild-yellow mb-6" />
          <h2 className="text-xl md:text-2xl max-w-xl">
            Insights, Tips, and Scientific Guidance for Natural Fitness
          </h2>
        </motion.div>
      </section>
      
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 md:py-20 bg-rebuild-black">
          <div className="container-custom">
            <motion.div 
              className="flex flex-col md:flex-row gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-lg">
                <motion.img 
                  src={featuredPost.image}
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="inline-block bg-rebuild-yellow/20 px-4 py-1 rounded-full mb-4">
                  <span className="text-rebuild-yellow text-sm font-medium">FEATURED ARTICLE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-gray-300 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center mb-8">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    <User size={20} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium">{featuredPost.author}</p>
                    <p className="text-sm text-gray-400">{featuredPost.date} • {Math.ceil(featuredPost.content.length / 1000)} min read</p>
                  </div>
                </div>
                <Link 
                  to={`/blog/${featuredPost.id}`} 
                  className="bg-rebuild-yellow text-rebuild-black font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors inline-flex items-center"
                >
                  READ ARTICLE <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Blog Post Grid */}
      <section className="py-16 md:py-20 bg-rebuild-darkgray">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Articles</h2>
              <p className="text-gray-300">
                Expert insights on natural fitness, nutrition, and health
              </p>
            </div>
            
            {/* Search & Filter Controls */}
            <div className="mt-6 md:mt-0 flex items-center gap-4">
              {/* Search Toggle Button */}
              <AnimatePresence>
                {!showSearch ? (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-2 rounded-full bg-rebuild-black text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setShowSearch(true)}
                    aria-label="Search articles"
                  >
                    <Search size={20} />
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "250px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="relative"
                  >
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 bg-rebuild-black border-gray-700 text-white"
                    />
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearch(false);
                      }}
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Filter Toggle Button */}
              <button
                className={`p-2 rounded-full ${showFilters ? 'bg-rebuild-yellow text-rebuild-black' : 'bg-rebuild-black text-white hover:bg-gray-700'} transition-colors md:hidden`}
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Category Filter */}
            <motion.div 
              className={`md:w-64 md:block ${showFilters ? 'block' : 'hidden'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-rebuild-black p-6 rounded-lg shadow-lg sticky top-24">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                        selectedCategory === category
                          ? 'bg-rebuild-yellow text-rebuild-black'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                      <span className="ml-2 text-xs">
                        ({category === 'all' ? blogPosts.length : blogPosts.filter(post => post.category === category).length})
                      </span>
                    </button>
                  ))}
                </div>
                
                {(selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-sm text-rebuild-yellow hover:underline flex items-center"
                  >
                    <X size={14} className="mr-1" /> Reset Filters
                  </button>
                )}
              </div>
            </motion.div>
            
            {/* Blog Posts Grid */}
            <div className="flex-1">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-rebuild-black/30 rounded-xl">
                  <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-rebuild-darkgray to-rebuild-black flex items-center justify-center shadow-xl border border-rebuild-yellow/20">
                    <BookOpen size={40} className="text-rebuild-yellow" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-white">No Articles Found</h3>
                  <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed">
                    {searchQuery 
                      ? `No articles matching "${searchQuery}". Try different keywords or browse all articles.` 
                      : selectedCategory !== 'all' 
                        ? `No articles in the "${selectedCategory}" category yet. Check out other categories.`
                        : "We're working on creating valuable content for your fitness journey. Check back soon for expert articles and insights on natural fitness!"}
                  </p>
                  <div className="mt-8">
                    <Button 
                      onClick={resetFilters}
                      className="bg-gradient-to-r from-rebuild-yellow to-yellow-400 text-rebuild-black px-8 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-rebuild-yellow transition-all duration-300 transform hover:scale-105"
                    >
                      Browse All Articles
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-300">
                      Showing <span className="text-rebuild-yellow">{Math.min(visiblePosts, filteredPosts.length)}</span> of <span className="text-rebuild-yellow">{filteredPosts.length}</span> articles
                      {searchQuery && <span> matching "<span className="text-rebuild-yellow">{searchQuery}</span>"</span>}
                      {selectedCategory !== 'all' && <span> in <span className="text-rebuild-yellow">{selectedCategory}</span></span>}
                    </p>
                  </div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatePresence mode="wait">
                      {postsToDisplay.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <BlogCard
                            title={post.title}
                            excerpt={post.excerpt}
                            image={post.image}
                            author={post.author}
                            date={post.date}
                            category={post.category || 'Uncategorized'}
                            onClick={() => handlePostClick(post.id!)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  
                  {hasMorePosts && (
                    <div className="text-center mt-12">
                      <Button
                        onClick={loadMorePosts}
                        className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
                      >
                        LOAD MORE ARTICLES
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
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
                required
              />
              <Button 
                type="submit" 
                className="bg-rebuild-yellow text-rebuild-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors"
              >
                SUBSCRIBE
              </Button>
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
