
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import LoginForm from '@/components/LoginForm';

const Signup: React.FC = () => {
  const { auth } = useAuth();

  // Redirect if already authenticated
  if (auth.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 flex-1">
        <div className="md:w-1/2 text-center md:text-left animate-slideInFromLeft">
          <div className="inline-block mb-4 md:mb-6 px-3 py-1 bg-eduPurple/10 text-eduPurple rounded-full text-sm font-medium">
            Create Your EduHub Account
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Start Your <span className="gradient-text">Learning Journey</span> Today
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg">
            Create your personalized account to access educational resources, connect with peers, and share knowledge.
          </p>
          <div className="space-y-4 max-w-md mx-auto md:mx-0">
            <div className="flex items-start space-x-3 p-4 glass-panel">
              <div className="h-10 w-10 rounded-full bg-eduBlue/10 flex items-center justify-center flex-shrink-0">
                <span className="text-eduBlue font-bold">1</span>
              </div>
              <div className="text-left">
                <h3 className="font-medium">Create an Account</h3>
                <p className="text-sm text-gray-600">Sign up as a student, teacher, or school.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 glass-panel">
              <div className="h-10 w-10 rounded-full bg-eduPurple/10 flex items-center justify-center flex-shrink-0">
                <span className="text-eduPurple font-bold">2</span>
              </div>
              <div className="text-left">
                <h3 className="font-medium">Connect & Learn</h3>
                <p className="text-sm text-gray-600">Discover content, interact, and learn together.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 glass-panel">
              <div className="h-10 w-10 rounded-full bg-eduTeal/10 flex items-center justify-center flex-shrink-0">
                <span className="text-eduTeal font-bold">3</span>
              </div>
              <div className="text-left">
                <h3 className="font-medium">Share Knowledge</h3>
                <p className="text-sm text-gray-600">Post content, share resources, and grow.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 w-full max-w-md animate-slideInFromRight">
          <LoginForm mode="signup" />
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

export default Signup;
