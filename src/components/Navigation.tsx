import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Video, MessageSquare, Settings, User, LogOut, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (!auth.isAuthenticated) {
    return null;
  }
  
  const userRole = auth.userData?.role || 'student';
  const userInitial = auth.userData?.name.charAt(0) || 'U';
  
  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <svg className="h-8 w-auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" fill="#7c3aed"/>
                <path d="M21.333 10.667c0-1.473-.88-2.667-2.667-2.667h-6.666c-1.787 0-2.667 1.194-2.667 2.667v10.666c0 1.473.88 2.667 2.667 2.667h6.666c1.787 0 2.667-1.194 2.667-2.667v-10.666z" fill="white"/>
              </svg>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-gray-100 text-gray-700' : ''}`}>
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </div>
                </Link>
                <Link to="/resources" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive('/resources') ? 'bg-gray-100 text-gray-700' : ''}`}>
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Resources
                  </div>
                </Link>
                <Link to="/videos" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive('/videos') ? 'bg-gray-100 text-gray-700' : ''}`}>
                  <div className="flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    Videos
                  </div>
                </Link>
                <Link to="/messages" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive('/messages') ? 'bg-gray-100 text-gray-700' : ''}`}>
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                    <Badge className="ml-2">3</Badge>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="sm" className="mr-2">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="mr-2">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="ml-3 relative">
                <div>
                  <Button variant="ghost" className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <span className="sr-only">Open user menu</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className={`
                        ${userRole === 'teacher' ? 'bg-eduPurple' : 
                          userRole === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
                        text-white
                      `}>
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleMobileMenu} type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-gray-100 text-gray-700' : ''}`}>
            <div className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </div>
          </Link>
          <Link to="/resources" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium ${isActive('/resources') ? 'bg-gray-100 text-gray-700' : ''}`}>
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Resources
            </div>
          </Link>
          <Link to="/videos" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium ${isActive('/videos') ? 'bg-gray-100 text-gray-700' : ''}`}>
            <div className="flex items-center">
              <Video className="mr-2 h-4 w-4" />
              Videos
            </div>
          </Link>
          <Link to="/messages" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium ${isActive('/messages') ? 'bg-gray-100 text-gray-700' : ''}`}>
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
              <Badge className="ml-2">3</Badge>
            </div>
          </Link>
          <Link to="/profile" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'bg-gray-100 text-gray-700' : ''}`}>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </div>
          </Link>
          <Link to="/settings" className={`text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium ${isActive('/settings') ? 'bg-gray-100 text-gray-700' : ''}`}>
            <div className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </div>
          </Link>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
