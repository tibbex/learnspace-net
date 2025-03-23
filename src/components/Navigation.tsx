
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Video, 
  MessageSquare, 
  BookOpen, 
  User, 
  Settings, 
  Plus, 
  LogOut, 
  AlignJustify, 
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from './AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const { auth, logout, isDemo, demoTimeRemaining } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoTimeDisplay, setDemoTimeDisplay] = useState('');
  
  useEffect(() => {
    if (isDemo && demoTimeRemaining !== null) {
      const minutes = Math.floor(demoTimeRemaining / 60000);
      const seconds = Math.floor((demoTimeRemaining % 60000) / 1000);
      setDemoTimeDisplay(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  }, [isDemo, demoTimeRemaining]);

  const userInitial = auth.userData?.name.charAt(0) || 'U';
  
  const navigationItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/videos', label: 'Videos', icon: Video },
    { path: '/messages', label: 'Messaging', icon: MessageSquare },
    { path: '/resources', label: 'Books & Worksheets', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  // Desktop Navigation
  const DesktopNavigation = () => (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/75 border-b border-gray-200 animate-slideDown">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <Link to="/home" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">EduHub</span>
          </Link>
          
          <nav className="hidden md:flex ml-10 space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                  location.pathname === item.path
                    ? 'bg-eduBlue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {isDemo && (
            <div className="hidden md:flex items-center space-x-1 bg-eduOrange/10 text-eduOrange px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{demoTimeDisplay}</span>
            </div>
          )}
          
          <Button 
            variant="default" 
            className="hidden md:flex items-center bg-eduBlue hover:bg-eduBlue/90"
            asChild
          >
            <Link to="/create-post">
              <Plus className="h-4 w-4 mr-2" />
              Post
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={auth.userData?.name || 'User'} />
                  <AvatarFallback className="bg-eduPurple text-white">{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile menu trigger for small screens */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-0" onClick={() => setMobileMenuOpen(true)}>
                <AlignJustify className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0">
              <MobileMenu onClose={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );

  // Mobile Navigation Menu
  const MobileMenu = ({ onClose }: { onClose: () => void }) => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold gradient-text">EduHub</span>
          {isDemo && (
            <div className="flex items-center space-x-1 bg-eduOrange/10 text-eduOrange px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" />
              <span className="text-xs font-medium">{demoTimeDisplay}</span>
            </div>
          )}
        </div>
        <Button variant="ghost" className="p-0" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex flex-col items-center space-y-2 p-4 border-b pb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={auth.userData?.name || 'User'} />
            <AvatarFallback className="bg-eduPurple text-white text-2xl">{userInitial}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-medium text-lg">{auth.userData?.name}</h3>
            <p className="text-muted-foreground text-sm capitalize">{auth.userData?.role}</p>
          </div>
        </div>
        
        <nav className="flex flex-col space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center transition-colors ${
                location.pathname === item.path
                  ? 'bg-eduBlue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={onClose}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}
          <Link
            to="/settings"
            className="px-4 py-3 rounded-lg text-sm font-medium flex items-center text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </nav>
        
        <div className="mt-auto pt-4 border-t">
          <Button 
            variant="default" 
            className="w-full items-center justify-center bg-eduBlue hover:bg-eduBlue/90"
            asChild
            onClick={onClose}
          >
            <Link to="/create-post">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full mt-2 items-center justify-center text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile Bottom Navigation Bar
  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50 animate-slideUp">
      <div className="flex justify-around items-center p-2">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              location.pathname === item.path
                ? 'text-eduBlue'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        <Link
          to="/create-post"
          className="flex flex-col items-center justify-center p-2 bg-eduBlue text-white rounded-lg -mt-5 shadow-lg shadow-eduBlue/30"
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs mt-1">Post</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <DesktopNavigation />
      {isMobile && <MobileBottomNav />}
      {/* Add padding to content to account for fixed headers/footers */}
      <div className={`pt-16 ${isMobile ? 'pb-16' : ''}`} />
    </>
  );
};

export default Navigation;
