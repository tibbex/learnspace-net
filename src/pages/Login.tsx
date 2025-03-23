
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import LoginForm from '@/components/LoginForm';

const Login: React.FC = () => {
  const { auth } = useAuth();

  // Redirect if already authenticated
  if (auth.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 flex-1">
        <div className="md:w-1/2 text-center md:text-left animate-slideInFromLeft">
          <div className="inline-block mb-4 md:mb-6 px-3 py-1 bg-eduBlue/10 text-eduBlue rounded-full text-sm font-medium">
            Welcome to the Educational Network
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Learn, Connect, and <span className="gradient-text">Grow Together</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg">
            Join EduHub to connect with students, teachers, and schools in a collaborative learning environment.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
            <div className="glass-panel p-4 flex flex-col items-center animate-float">
              <div className="h-10 w-10 rounded-full bg-eduBlue/10 flex items-center justify-center mb-2">
                <span className="text-eduBlue font-bold">S</span>
              </div>
              <p className="text-sm font-medium">Students</p>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center animate-float animate-delay-100">
              <div className="h-10 w-10 rounded-full bg-eduPurple/10 flex items-center justify-center mb-2">
                <span className="text-eduPurple font-bold">T</span>
              </div>
              <p className="text-sm font-medium">Teachers</p>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center animate-float animate-delay-200">
              <div className="h-10 w-10 rounded-full bg-eduTeal/10 flex items-center justify-center mb-2">
                <span className="text-eduTeal font-bold">S</span>
              </div>
              <p className="text-sm font-medium">Schools</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 w-full max-w-md animate-slideInFromRight">
          <LoginForm mode="login" />
        </div>
      </div>
      
      <footer className="py-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 EduHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
