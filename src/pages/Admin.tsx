import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  Building2, Users, Camera, CreditCard, FileText, MessageSquare,
  LayoutDashboard, Settings, Activity, Gauge, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation, useParams, Routes, Route } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import admin components
import AdminGyms from '@/components/admin/AdminGyms';
import EnhancedAdminTrainers from '@/components/admin/EnhancedAdminTrainers';
import AdminTransformations from '@/components/admin/AdminTransformations';
import AdminMembership from '@/components/admin/AdminMembership';
import AdminAddOnServices from '@/components/admin/AdminAddOnServices';
import AdminServiceBookings from '@/components/admin/AdminServiceBookings';
import AdminBlog from '@/components/admin/AdminBlog';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';


// Define animations
const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New contact request received', time: '10m ago', read: false },
    { id: 2, text: 'System update completed', time: '1h ago', read: true }
  ]);

  // Determine active tab from URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'overview';
    if (path.startsWith('/admin/trainers')) return 'trainers';
    if (path.startsWith('/admin/gyms')) return 'gyms';
    if (path.startsWith('/admin/transformations')) return 'transformations';
    if (path.startsWith('/admin/membership')) return 'membership';
    if (path.startsWith('/admin/add-on-services')) return 'add-on-services';
    if (path.startsWith('/admin/service-bookings')) return 'service-bookings';
    if (path.startsWith('/admin/blog')) return 'blog';
    if (path.startsWith('/admin/payments')) return 'payments';
    if (path.startsWith('/admin/contacts')) return 'contacts';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update activeTab when location changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Handle tab changes by navigating to appropriate URL
  const handleTabChange = (tab: string) => {
    if (tab === 'overview') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tab}`);
    }
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleBackToSite = () => {
    navigate('/');
  };

  const renderContent = () => {
    return (
      <Routes>
        <Route path="/" element={
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-rebuild-darkgray to-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Gym Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Building2 size={24} className="text-rebuild-yellow mr-3" />
                    <span className="text-2xl font-bold">1</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-rebuild-darkgray to-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Trainers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users size={24} className="text-rebuild-yellow mr-3" />
                    <span className="text-2xl font-bold">12</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-rebuild-darkgray to-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Transformations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Camera size={24} className="text-rebuild-yellow mr-3" />
                    <span className="text-2xl font-bold">25</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-rebuild-darkgray to-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileText size={24} className="text-rebuild-yellow mr-3" />
                    <span className="text-2xl font-bold">18</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          
            {/* Admin Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-white flex items-center group-hover:text-rebuild-yellow transition-colors">
                    <Building2 className="mr-2 text-rebuild-yellow" />
                    Our Gym
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage gym information and photo gallery
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex justify-between">
                      <span>Profile status</span>
                      <span>Complete</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Photos uploaded</span>
                      <span>12</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Last updated</span>
                      <span>2 days ago</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => handleTabChange('gyms')}
                    className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
                  >
                    Manage Our Gym
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-white flex items-center group-hover:text-rebuild-yellow transition-colors">
                    <Users className="mr-2 text-rebuild-yellow" />
                    Trainers
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Add, edit, and manage trainer profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex justify-between">
                      <span>Total trainers</span>
                      <span>12</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Last updated</span>
                      <span>5 days ago</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => handleTabChange('trainers')}
                    className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
                  >
                    Manage Trainers
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-white flex items-center group-hover:text-rebuild-yellow transition-colors">
                    <Camera className="mr-2 text-rebuild-yellow" />
                    Transformations
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Showcase client transformation stories
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex justify-between">
                      <span>Total transformations</span>
                      <span>25</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Last updated</span>
                      <span>1 week ago</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => handleTabChange('transformations')}
                    className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
                  >
                    Manage Transformations
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-white flex items-center group-hover:text-rebuild-yellow transition-colors">
                    <CreditCard className="mr-2 text-rebuild-yellow" />
                    Membership Plans
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure membership plans and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex justify-between">
                      <span>Total plans</span>
                      <span>3</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Featured plan</span>
                      <span>Premium</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => handleTabChange('membership')}
                    className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
                  >
                    Manage Membership
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-white flex items-center group-hover:text-rebuild-yellow transition-colors">
                    <FileText className="mr-2 text-rebuild-yellow" />
                    Blog Posts
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Create and manage blog content
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex justify-between">
                      <span>Total articles</span>
                      <span>18</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Recent post</span>
                      <span>Fitness Tips</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => handleTabChange('blog')}
                    className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
                  >
                    Manage Blog
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-rebuild-darkgray border-gray-700 hover:border-rebuild-yellow transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-white flex items-center group-hover:text-rebuild-yellow transition-colors">
                    <MessageSquare className="mr-2 text-rebuild-yellow" />
                    Contact Requests
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    View and respond to customer inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex justify-between">
                      <span>New inquiries</span>
                      <span>4</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Response time</span>
                      <span>~2 hours</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => handleTabChange('contacts')}
                    className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400"
                  >
                    View Contacts
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <Card className="bg-rebuild-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Button variant="outline" className="h-auto flex flex-col items-center py-4 gap-2">
                    <Building2 size={24} />
                    <span className="text-xs">Add Gym</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center py-4 gap-2">
                    <Users size={24} />
                    <span className="text-xs">Add Trainer</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center py-4 gap-2">
                    <Camera size={24} />
                    <span className="text-xs">New Transformation</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center py-4 gap-2">
                    <FileText size={24} />
                    <span className="text-xs">Write Blog</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center py-4 gap-2">
                    <Activity size={24} />
                    <span className="text-xs">Site Traffic</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center py-4 gap-2">
                    <Settings size={24} />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="/gyms" element={<AdminGyms />} />
        <Route path="/trainers/*" element={<EnhancedAdminTrainers />} />
        <Route path="/transformations" element={<AdminTransformations />} />
        <Route path="/membership" element={<AdminMembership />} />
        <Route path="/add-on-services" element={<AdminAddOnServices />} />
        <Route path="/service-bookings" element={<AdminServiceBookings />} />
        <Route path="/blog" element={<AdminBlog />} />
        <Route path="/payments" element={<AdminPayments />} />
        <Route path="/contacts" element={<AdminContacts />} />
      </Routes>
    );
  };
  
  return (
    <div className="flex h-screen bg-rebuild-black">
      {/* Admin Sidebar - Enhanced version */}
      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        onBackToSite={handleBackToSite}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Admin Header - Enhanced version */}
        <AdminHeader 
          onLogout={handleLogout}
          onBackToSite={handleBackToSite}
          userEmail={user?.email}
          notifications={notifications}
        />        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <ScrollArea className="h-full">
            <div className="container max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default Admin;
