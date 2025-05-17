import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from '@/components/LoadingScreen';
import Index from "./pages/Index";
import About from "./pages/About";
import Gyms from "./pages/Gyms";
import Transformations from "./pages/Transformations";
import Trainers from "./pages/Trainers";
import Membership from "./pages/Membership";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Track page transitions
  useEffect(() => {
    const handleStartLoading = () => {
      setLoading(true);
    };

    const handleStopLoading = () => {
      setLoading(false);
    };

    window.addEventListener('beforeunload', handleStartLoading);
    window.addEventListener('load', handleStopLoading);

    return () => {
      window.removeEventListener('beforeunload', handleStartLoading);
      window.removeEventListener('load', handleStopLoading);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LoadingScreen isLoading={loading} />
          <Navbar />
          <main className={`min-h-screen transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={
                <>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/gyms" element={<Gyms />} />
                    <Route path="/transformations" element={<Transformations />} />
                    <Route path="/trainers" element={<Trainers />} />
                    <Route path="/membership" element={<Membership />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </>
              } />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
