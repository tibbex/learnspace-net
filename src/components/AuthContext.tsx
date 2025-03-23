
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, UserData, UserRole } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  auth: AuthState;
  login: (userData: UserData, rememberMe: boolean) => void;
  startDemo: () => void;
  logout: () => void;
  isDemo: boolean;
  demoTimeRemaining: number | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  userData: null,
  isDemo: false,
  demoStartTime: null,
  rememberMe: false,
};

const DEMO_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const AUTH_STORAGE_KEY = 'eduhub-auth-data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const [demoTimeRemaining, setDemoTimeRemaining] = useState<number | null>(null);

  // Load saved auth state from localStorage
  useEffect(() => {
    const savedAuthData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuthData) {
      try {
        const parsedAuthData = JSON.parse(savedAuthData) as AuthState;
        setAuth(parsedAuthData);
      } catch (error) {
        console.error('Failed to parse saved auth data:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  // Handle demo timing
  useEffect(() => {
    if (!auth.isDemo || !auth.demoStartTime) return;

    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - auth.demoStartTime!;
      const remaining = DEMO_DURATION - elapsedTime;
      
      if (remaining <= 0) {
        clearInterval(intervalId);
        logout();
        toast.error('Your demo session has expired. Please sign up or log in.');
      } else {
        setDemoTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [auth.isDemo, auth.demoStartTime]);

  const login = (userData: UserData, rememberMe: boolean) => {
    const newAuthState: AuthState = {
      isAuthenticated: true,
      userData,
      isDemo: false,
      demoStartTime: null,
      rememberMe,
    };
    
    setAuth(newAuthState);
    
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
    } else {
      // Remove any previously saved data if remember me is off
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    
    toast.success(`Welcome, ${userData.name}!`);
  };

  const startDemo = () => {
    const demoStartTime = Date.now();
    const demoData: AuthState = {
      isAuthenticated: true,
      userData: {
        role: 'student',
        name: 'Demo User',
        phone: '555-123-4567',
        location: 'Demo City',
        school: 'Demo School',
        age: 16,
        grade: '10th',
      },
      isDemo: true,
      demoStartTime,
      rememberMe: false,
    };
    
    setAuth(demoData);
    setDemoTimeRemaining(DEMO_DURATION);
    toast.info('You are using demo mode. You have 10 minutes to explore EduHub.');
  };

  const logout = () => {
    setAuth(initialAuthState);
    setDemoTimeRemaining(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ auth, login, startDemo, logout, isDemo: auth.isDemo, demoTimeRemaining }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
