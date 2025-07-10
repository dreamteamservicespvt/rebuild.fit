import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  Search, 
  Home, 
  Settings, 
  LogOut, 
  Check,
  User,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

interface AdminHeaderProps {
  onLogout: () => void;
  onBackToSite: () => void;
  userEmail?: string;
  userPhotoUrl?: string;
  notifications?: Notification[];
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout,
  onBackToSite,
  userEmail = 'admin@rebuild.fit',
  userPhotoUrl,
  notifications = []
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-rebuild-darkgray border-b border-gray-700 sticky top-0 z-30 h-16 flex items-center px-4 md:px-6">
      <div className="flex w-full items-center justify-between">
        {/* Search */}
        <div className="flex items-center flex-1">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-md mr-4"
              >
                <Input
                  type="search"
                  placeholder="Search in dashboard..."
                  className="bg-gray-800/50 border-gray-700"
                  icon={<Search size={16} />}
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  clearable
                />
              </motion.div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchOpen(true)}
                className="text-gray-400 hover:text-white"
              >
                <Search size={18} />
              </Button>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {/* Notifications */}
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-gray-400 hover:text-white"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-rebuild-yellow text-rebuild-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-rebuild-darkgray border border-gray-700 rounded-md shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                      <h3 className="font-medium">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button variant="link" size="sm" className="text-rebuild-yellow h-auto p-0">
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={cn(
                              "p-3 border-b border-gray-700/50 hover:bg-gray-800 transition-colors cursor-pointer flex gap-3",
                              !notification.read && "bg-gray-800/70"
                            )}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {notification.read ? (
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 bg-rebuild-yellow rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-white">{notification.text}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-700 text-center">
                      <Button variant="link" className="text-xs text-gray-400 h-auto p-0">
                        View all notifications
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <HelpCircle size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help</TooltipContent>
            </Tooltip>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3 h-9">
                  <Avatar className="h-7 w-7">
                    {userPhotoUrl ? (
                      <AvatarImage src={userPhotoUrl} alt="User" />
                    ) : (
                      <AvatarFallback className="bg-rebuild-yellow text-rebuild-black">
                        {userEmail?.substring(0, 2).toUpperCase() || 'AD'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="hidden md:block">
                    <span className="text-xs text-gray-400">Admin</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-rebuild-darkgray border-gray-700">
                <div className="flex items-center justify-start p-2 gap-3 border-b border-gray-700">
                  <Avatar className="h-8 w-8">
                    {userPhotoUrl ? (
                      <AvatarImage src={userPhotoUrl} alt="User" />
                    ) : (
                      <AvatarFallback className="bg-rebuild-yellow text-rebuild-black">
                        {userEmail?.substring(0, 2).toUpperCase() || 'AD'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Admin</span>
                    <span className="text-xs text-gray-400 truncate max-w-[160px]">{userEmail}</span>
                  </div>
                </div>
                
                <DropdownMenuItem onClick={onBackToSite} className="gap-2 cursor-pointer">
                  <Home size={16} className="opacity-70" />
                  <span>Back to Site</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings size={16} className="opacity-70" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-gray-700" />
                
                <DropdownMenuItem 
                  onClick={onLogout} 
                  className="text-red-400 focus:text-red-400 gap-2 cursor-pointer"
                >
                  <LogOut size={16} className="opacity-70" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
