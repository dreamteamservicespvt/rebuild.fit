import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, Dumbbell, Users, Calendar, Mail, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Handle 404 page tracking if needed
    setIsVisible(true);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to a search results page or homepage with search
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Dumbbell, label: "Gyms", path: "/gyms" },
    { icon: Users, label: "Trainers", path: "/trainers" },
    { icon: Calendar, label: "Membership", path: "/membership" },
    { icon: Mail, label: "Contact", path: "/contact" }
  ];

  return (
    <div className="min-h-screen bg-rebuild-black relative overflow-hidden flex items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rebuild-yellow/5 via-transparent to-rebuild-yellow/5"></div>
        <div className="floating-shapes">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-20 h-20 border border-rebuild-yellow/20 rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className={`container mx-auto px-6 text-center relative z-10 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Animated GIF Container */}
          <div className="mb-8 relative">
            <div className="w-64 h-64 mx-auto mb-6 relative group">
              {/* Main container with glow effect */}
              <div className="w-full h-full bg-gradient-to-br from-rebuild-yellow/10 to-rebuild-yellow/5 rounded-full flex items-center justify-center border-2 border-rebuild-yellow/20 animate-pulse-glow overflow-hidden">
                {/* Fitness-themed GIF */}
                <img 
                  src="https://media.giphy.com/media/UdhMjK61tOZythNkcz/giphy.gif"
                  alt="Workout Animation"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to another GIF if first one fails
                    e.currentTarget.src = "https://media.giphy.com/media/l0MYP6WAFfaR7Q1jO/giphy.gif";
                    e.currentTarget.onerror = () => {
                      // Final fallback to emoji
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.emoji-fallback') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    };
                  }}
                />
                
                {/* Emoji fallback */}
                <div className="emoji-fallback absolute inset-0 w-full h-full flex items-center justify-center text-6xl animate-bounce-subtle" style={{ display: 'none' }}>
                  🏋️‍♂️
                </div>
              </div>
              
              {/* Floating particles around the GIF */}
              <div className="absolute -inset-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-rebuild-yellow rounded-full animate-floating opacity-60"
                    style={{
                      left: `${Math.cos((i * Math.PI * 2) / 8) * 50 + 50}%`,
                      top: `${Math.sin((i * Math.PI * 2) / 8) * 50 + 50}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${3 + (i % 3)}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* 404 Text with Animation */}
          <div className="mb-8">
            <h1 className="font-bebas text-8xl md:text-9xl lg:text-[12rem] text-transparent bg-clip-text bg-gradient-to-r from-rebuild-yellow via-rebuild-accent to-rebuild-yellow animate-pulse leading-none tracking-wider">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-rebuild-yellow to-transparent mx-auto mb-6"></div>
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-white tracking-wider">
              OOPS! LOOKS LIKE YOU'RE OFF TRACK
            </h2>
            <p className="text-rebuild-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Don't worry, even the strongest athletes sometimes lose their way. 
              Let's get you back to crushing your fitness goals! 💪
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/"
              className="group bg-rebuild-yellow text-rebuild-black px-8 py-4 rounded-lg font-semibold hover:bg-rebuild-accent transition-all duration-300 transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,243,24,0.3)] flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="group bg-transparent border-2 border-rebuild-yellow text-rebuild-yellow px-8 py-4 rounded-lg font-semibold hover:bg-rebuild-yellow hover:text-rebuild-black transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-12 max-w-md mx-auto">
            <h3 className="font-bebas text-xl text-white mb-4 tracking-wider">
              OR SEARCH FOR WHAT YOU'RE LOOKING FOR
            </h3>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search gyms, trainers, memberships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 bg-rebuild-gray/80 border border-rebuild-yellow/20 rounded-lg text-white placeholder-rebuild-text-secondary focus:outline-none focus:border-rebuild-yellow focus:ring-2 focus:ring-rebuild-yellow/20 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rebuild-yellow" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-rebuild-yellow text-rebuild-black px-4 py-2 rounded-md hover:bg-rebuild-accent transition-all duration-300 font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Navigation */}
          <div className="bg-rebuild-gray/50 backdrop-blur-sm rounded-2xl p-8 border border-rebuild-yellow/10">
            <h3 className="font-bebas text-2xl text-white mb-6 tracking-wider">
              OR EXPLORE THESE POPULAR SECTIONS
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className="group bg-rebuild-darkgray/80 hover:bg-rebuild-yellow/10 border border-rebuild-yellow/20 hover:border-rebuild-yellow/40 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <IconComponent className="w-8 h-8 text-rebuild-yellow mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-white text-sm font-medium group-hover:text-rebuild-yellow transition-colors duration-300">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="mt-12 max-w-2xl mx-auto">
            <blockquote className="text-rebuild-text-secondary italic text-lg border-l-4 border-rebuild-yellow pl-6">
              "Every setback is a setup for a comeback. Your fitness journey continues here!"
            </blockquote>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-rebuild-yellow rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-1/3 right-10 w-6 h-6 bg-rebuild-yellow rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-rebuild-yellow rounded-full animate-bounce opacity-50" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 right-1/3 w-5 h-5 bg-rebuild-yellow rounded-full animate-bounce opacity-30" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default NotFound;
