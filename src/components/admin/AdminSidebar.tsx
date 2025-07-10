import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  Building2,
  Users,
  Camera,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
  Activity,
  Gauge,
  Plus,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  User,
  Package,
  X,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onBackToSite: () => void;
  user?: any;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  description?: string;
  children?: SidebarItem[];
  isCollapsible?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    id: 'gyms',
    label: 'Our Gym',
    icon: Building2,
    description: 'Manage gym information'
  },
  {
    id: 'trainers',
    label: 'Trainers',
    icon: Users,
    description: 'Manage trainer profiles'
  },
  {
    id: 'transformations',
    label: 'Transformations',
    icon: Camera,
    description: 'Client success stories'
  },
  {
    id: 'membership-menu',
    label: 'Membership',
    icon: User,
    description: 'Membership management',
    isCollapsible: true,
    children: [
      {
        id: 'membership',
        label: 'Overview',
        icon: CreditCard,
        description: 'Membership plans & pricing'
      },
      {
        id: 'add-on-services',
        label: 'Add-on Services',
        icon: Plus,
        description: 'Manage additional services'
      },
      {
        id: 'service-bookings',
        label: 'Service Bookings',
        icon: ClipboardList,
        description: 'Customer service bookings'
      }
    ]
  },
  {
    id: 'blog',
    label: 'Blog Posts',
    icon: FileText,
    description: 'Manage blog content'
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: Package,
    description: 'Payment submissions & verification'
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: MessageSquare,
    description: 'Customer inquiries'
  }
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  onBackToSite,
  user
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'membership-menu': true // Default expand membership menu
  });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Check if any child item is active
  const isChildActive = (children?: SidebarItem[]) => {
    return children?.some(child => child.id === activeTab) || false;
  };

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' }
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobile}
          className="text-white bg-rebuild-darkgray hover:bg-gray-700 p-2"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobile}
        />
      )}

      <TooltipProvider>
        {/* Desktop Sidebar */}
        <motion.div
          variants={sidebarVariants}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden lg:flex h-full bg-gradient-to-b from-rebuild-darkgray to-gray-900 border-r border-gray-700 flex-col shadow-xl"
        >
          {/* Desktop Header Section */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-rebuild-yellow rounded-lg flex items-center justify-center">
                    <Gauge size={20} className="text-rebuild-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                    <p className="text-xs text-gray-400">Rebuild.fit</p>
                  </div>
                </motion.div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2"
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            </div>
          </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-rebuild-yellow">
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback className="bg-rebuild-yellow text-rebuild-black font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  {user?.displayName || 'Admin'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || 'admin@rebuild.fit'}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus[item.id];
              const childActive = isChildActive(item.children);
              
              return (
                <div key={item.id}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-11 px-3 text-left font-medium transition-all duration-200",
                            isActive || childActive
                              ? "bg-rebuild-yellow text-rebuild-black hover:bg-rebuild-yellow/90"
                              : "text-gray-300 hover:text-white hover:bg-gray-700/50",
                            isCollapsed && "justify-center px-0"
                          )}
                          onClick={() => {
                            if (hasChildren && item.isCollapsible) {
                              toggleMenu(item.id);
                            } else {
                              onTabChange(item.id);
                            }
                          }}
                        >
                          <Icon 
                            size={20} 
                            className={cn(
                              "shrink-0",
                              isCollapsed ? "mx-auto" : "mr-3"
                            )} 
                          />
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="truncate flex-1"
                            >
                              {item.label}
                            </motion.span>
                          )}
                          
                          {!isCollapsed && hasChildren && item.isCollapsible && (
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-auto"
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          )}
                          
                          {!isCollapsed && (isActive || childActive) && !hasChildren && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto w-2 h-2 bg-rebuild-black rounded-full"
                            />
                          )}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    
                    {isCollapsed && (
                      <TooltipContent side="right" className="ml-2 p-3">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                          )}
                          {hasChildren && item.children && (
                            <div className="mt-2 pt-2 border-t border-gray-600">
                              <p className="text-xs font-medium text-gray-300 mb-1">Quick Access:</p>
                              {item.children.map((child) => (
                                <button
                                  key={child.id}
                                  onClick={() => onTabChange(child.id)}
                                  className={cn(
                                    "block w-full text-left text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors",
                                    activeTab === child.id ? "bg-rebuild-yellow text-rebuild-black" : "text-gray-400"
                                  )}
                                >
                                  {child.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {/* Render Children */}
                  {hasChildren && item.isCollapsible && !isCollapsed && (
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="ml-6 mt-1 space-y-1 border-l border-gray-600 pl-4">
                            {item.children?.map((child, childIndex) => {
                              const ChildIcon = child.icon;
                              const isChildActive = activeTab === child.id;
                              
                              return (
                                <Tooltip key={child.id} delayDuration={0}>
                                  <TooltipTrigger asChild>
                                    <motion.div
                                      variants={itemVariants}
                                      initial="hidden"
                                      animate="visible"
                                      transition={{ delay: (index + childIndex + 1) * 0.05 }}
                                    >
                                      <Button
                                        variant="ghost"
                                        className={cn(
                                          "w-full justify-start h-10 px-3 text-left font-medium transition-all duration-200 text-sm",
                                          isChildActive
                                            ? "bg-rebuild-yellow text-rebuild-black hover:bg-rebuild-yellow/90"
                                            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                                        )}
                                        onClick={() => onTabChange(child.id)}
                                      >
                                        <ChildIcon 
                                          size={18} 
                                          className="shrink-0 mr-3"
                                        />
                                        <motion.span
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          className="truncate"
                                        >
                                          {child.label}
                                        </motion.span>
                                        
                                        {isChildActive && (
                                          <motion.div
                                            layoutId="activeChildIndicator"
                                            className="ml-auto w-2 h-2 bg-rebuild-black rounded-full"
                                          />
                                        )}
                                      </Button>
                                    </motion.div>
                                  </TooltipTrigger>
                                  
                                  <TooltipContent side="right" className="ml-2">
                                    <div>
                                      <p className="font-medium">{child.label}</p>
                                      {child.description && (
                                        <p className="text-xs text-gray-400">{child.description}</p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 text-gray-300 hover:text-white hover:bg-gray-700/50",
                  isCollapsed && "justify-center px-0"
                )}
                onClick={onBackToSite}
              >
                <Home size={18} className={cn("shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Back to Site
                  </motion.span>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="ml-2">
                Back to Site
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 text-red-400 hover:text-red-300 hover:bg-red-900/20",
                  isCollapsed && "justify-center px-0"
                )}
                onClick={onLogout}
              >
                <LogOut size={18} className={cn("shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Logout
                  </motion.span>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="ml-2">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>

    {/* Mobile Sidebar */}
    <motion.div
      variants={mobileSidebarVariants}
      animate={isMobileOpen ? 'open' : 'closed'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="lg:hidden fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-rebuild-darkgray to-gray-900 border-r border-gray-700 flex flex-col shadow-xl z-40"
    >
      {/* Mobile Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-rebuild-yellow rounded-lg flex items-center justify-center">
              <Gauge size={20} className="text-rebuild-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-gray-400">Rebuild.fit</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobile}
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-2"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Mobile User Profile */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 border-2 border-rebuild-yellow">
            <AvatarImage src={user?.photoURL} />
            <AvatarFallback className="bg-rebuild-yellow text-rebuild-black font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || 'Admin'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || 'admin@rebuild.fit'}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus[item.id];
            const childActive = isChildActive(item.children);
            
            return (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-11 px-3 text-left font-medium transition-all duration-200",
                    isActive || childActive
                      ? "bg-rebuild-yellow text-rebuild-black hover:bg-rebuild-yellow/90"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  )}
                  onClick={() => {
                    if (hasChildren && item.isCollapsible) {
                      toggleMenu(item.id);
                    } else {
                      onTabChange(item.id);
                      setIsMobileOpen(false); // Close mobile menu on selection
                    }
                  }}
                >
                  <Icon size={20} className="shrink-0 mr-3" />
                  <span className="truncate flex-1">{item.label}</span>
                  
                  {hasChildren && item.isCollapsible && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-auto"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  )}
                </Button>

                {/* Mobile Children */}
                <AnimatePresence>
                  {hasChildren && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 mt-1 space-y-1 overflow-hidden"
                    >
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActiveState = activeTab === child.id;
                        
                        return (
                          <Button
                            key={child.id}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-9 px-3 text-left text-sm transition-all duration-200",
                              isChildActiveState
                                ? "bg-rebuild-yellow/20 text-rebuild-yellow border-l-2 border-rebuild-yellow"
                                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                            )}
                            onClick={() => {
                              onTabChange(child.id);
                              setIsMobileOpen(false);
                            }}
                          >
                            <ChildIcon size={16} className="shrink-0 mr-2" />
                            <span className="truncate">{child.label}</span>
                          </Button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Mobile Footer Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-gray-300 hover:text-white hover:bg-gray-700/50"
          onClick={() => {
            onBackToSite();
            setIsMobileOpen(false);
          }}
        >
          <Home size={18} className="shrink-0 mr-3" />
          Back to Site
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={() => {
            onLogout();
            setIsMobileOpen(false);
          }}
        >
          <LogOut size={18} className="shrink-0 mr-3" />
          Logout
        </Button>
      </div>
    </motion.div>
    </>
  );
};

export default AdminSidebar;
