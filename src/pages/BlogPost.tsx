import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogService, type BlogPost } from '@/lib/firebaseServices';
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/CTASection';
import LoadingScreen from '@/components/LoadingScreen';
import ResponsiveImage from '@/components/ResponsiveImage';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  // Share options visibility
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        if (!postId) {
          setError('Post ID is missing');
          setLoading(false);
          return;
        }

        const fetchedPost = await blogService.getById(postId);
        if (!fetchedPost) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        setPost(fetchedPost);
        document.title = `${fetchedPost.title} | REBUILD.fit`;
        
        // Fetch related posts (same category)
        const allPosts = await blogService.getAll();
        const filtered = allPosts
          .filter(p => p.id !== postId && p.category === fetchedPost.category)
          .slice(0, 3);
        setRelatedPosts(filtered);
        
      } catch (err) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [postId]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'REBUILD.fit Blog';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
    
    setShowShareOptions(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-rebuild-black flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Unable to Load Blog Post</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/blog')}
              className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-rebuild-yellow text-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Parse post content for rendering with paragraphs
  const renderContent = () => {
    return post.content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('#')) {
        return <h3 key={index} className="text-xl font-bold mb-4 mt-6">{paragraph.replace(/^#+ /, '')}</h3>;
      } else if (paragraph.startsWith('- ')) {
        // Handle bullet points
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-1">
            {paragraph.split('\n').map((item, i) => (
              <li key={i} className="text-gray-300">{item.replace(/^- /, '')}</li>
            ))}
          </ul>
        );
      } else if (paragraph.startsWith('**') && paragraph.endsWith(':**')) {
        // Handle section headers
        return <h4 key={index} className="font-bold text-lg mb-2 text-rebuild-yellow">{paragraph.replace(/^\*\*|\:\*\*$/g, '')}</h4>;
      } else {
        return <p key={index} className="mb-4 text-gray-300 leading-relaxed">{paragraph}</p>;
      }
    });
  };

  const readingTimeMinutes = Math.max(Math.ceil(post.content.split(' ').length / 200), 1);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${post.image}')`,
            filter: "brightness(40%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rebuild-black/50 via-transparent to-rebuild-black" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              onClick={() => navigate('/blog')}
              variant="outline" 
              className="mb-6 border-rebuild-yellow text-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Button>
            <div className="inline-block bg-rebuild-yellow/20 px-4 py-1 rounded-full mb-4">
              <span className="text-rebuild-yellow text-sm font-medium uppercase">{post.category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center text-gray-300 gap-4 mt-4">
              <div className="flex items-center">
                <User size={16} className="mr-2 text-rebuild-yellow" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-rebuild-yellow" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-rebuild-yellow" />
                <span>{readingTimeMinutes} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Blog Content */}
      <section className="py-16 bg-rebuild-black">
        <div className="container-custom max-w-4xl">
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <div className="text-sm text-gray-400">
              Published {formatDistanceToNow(new Date(post.date))} ago
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="text-gray-300 hover:text-rebuild-yellow"
              >
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
              
              {showShareOptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 bg-rebuild-darkgray rounded-lg shadow-lg border border-gray-700 z-10 w-[200px]"
                >
                  <div className="p-2">
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center text-gray-300 hover:text-white"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook size={16} className="mr-2 text-blue-500" /> Facebook
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center text-gray-300 hover:text-white"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter size={16} className="mr-2 text-blue-400" /> Twitter
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center text-gray-300 hover:text-white"
                      onClick={() => handleShare('linkedin')}
                    >
                      <Linkedin size={16} className="mr-2 text-blue-600" /> LinkedIn
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center text-gray-300 hover:text-white"
                      onClick={() => handleShare('email')}
                    >
                      <Mail size={16} className="mr-2 text-gray-400" /> Email
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center text-gray-300 hover:text-white"
                      onClick={() => handleShare('copy')}
                    >
                      <Share2 size={16} className="mr-2 text-gray-400" /> Copy Link
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden shadow-2xl"
            >
              <ResponsiveImage
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </motion.div>
            <div className="mt-2 text-sm text-gray-400 text-right">
              Photo: REBUILD.fit
            </div>
          </div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="prose prose-lg max-w-none text-white prose-headings:text-white prose-strong:text-rebuild-yellow"
          >
            {post.excerpt && (
              <div className="border-l-4 border-rebuild-yellow pl-4 italic mb-8 text-xl text-gray-300">
                {post.excerpt}
              </div>
            )}
            
            <div className="text-lg">
              {renderContent()}
            </div>
          </motion.div>
          
          {/* Author Bio */}
          <div className="mt-12 bg-rebuild-darkgray rounded-xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gray-800 flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-center sm:text-left">{post.author}</h3>
                <p className="text-gray-300 mb-4">
                  Fitness expert and content creator at REBUILD.fit. Passionate about natural fitness, proper nutrition, and sustainable health goals.
                </p>
                <div className="flex justify-center sm:justify-start">
                  <Button variant="outline" size="sm" className="text-rebuild-yellow border-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black">
                    View All Posts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-rebuild-darkgray">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.id}`}
                  className="group block bg-rebuild-black/30 rounded-xl overflow-hidden hover:bg-rebuild-black/50 transition-all duration-300 h-full"
                >
                  <div className="h-48 overflow-hidden">
                    <ResponsiveImage
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-block bg-rebuild-yellow/20 px-3 py-1 rounded-full mb-3">
                      <span className="text-rebuild-yellow text-xs font-medium">{relatedPost.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-rebuild-yellow transition-colors">{relatedPost.title}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(relatedPost.date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link 
                to="/blog"
                className="inline-flex items-center text-rebuild-yellow hover:text-yellow-400 font-bold"
              >
                View All Articles <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Newsletter */}
      <section className="py-16 bg-rebuild-black">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
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

export default BlogPost;
