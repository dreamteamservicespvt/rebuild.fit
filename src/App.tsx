import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from '@/components/LoadingScreen';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from "./pages/Index";
import About from "./pages/About";
import Gyms from "./pages/Gyms";
import Transformations from "./pages/Transformations";
import Trainers from "./pages/Trainers";
import TrainerProfile from "./pages/TrainerProfile";
import Membership from "./pages/Membership";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
// Payment flow pages
import PaymentUserInfo from "./pages/PaymentUserInfo";
import PaymentUPI from "./pages/PaymentUPI";
import PaymentSuccess from "./pages/PaymentSuccess";

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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <LoadingScreen isLoading={loading} />
            <Routes>
              {/* Admin routes - no navbar */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              
              {/* Payment flow routes - no navbar, no footer */}
              <Route path="/payment/user-info" element={<PaymentUserInfo />} />
              <Route path="/payment/upi" element={<PaymentUPI />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              
              {/* Main site routes - with navbar and footer */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <main className={`min-h-screen transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/gyms" element={<Gyms />} />
                      <Route path="/transformations" element={<Transformations />} />
                      <Route path="/trainers" element={<Trainers />} />
                      <Route path="/trainers/:slug" element={<TrainerProfile />} />
                      <Route path="/membership" element={<Membership />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:postId" element={<BlogPost />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
