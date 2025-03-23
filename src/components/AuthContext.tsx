import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, UserData, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

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
  const [session, setSession] = useState<Session | null>(null);

  // Load saved auth state from localStorage or Supabase session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          fetchUserProfile(session.user);
        } else if (!auth.isDemo) {
          setAuth(initialAuthState);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user);
      } else {
        // Check for saved demo data
        const savedAuthData = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuthData) {
          try {
            const parsedAuthData = JSON.parse(savedAuthData) as AuthState;
            if (parsedAuthData.isDemo) {
              // Only restore demo data
              setAuth(parsedAuthData);
            }
          } catch (error) {
            console.error('Failed to parse saved auth data:', error);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        const userData: UserData = {
          role: data.role as UserRole,
          name: data.name,
          phone: data.phone,
          location: data.location,
          ...(data.role === 'student' ? {
            school: data.school || '',
            age: data.age || 16,
            grade: data.grade || '',
          } : data.role === 'teacher' ? {
            teachingSchool: data.teaching_school || '',
            teachingGrades: data.teaching_grades ? data.teaching_grades.split(',') : [],
          } : {
            ceoName: data.ceo_name || '',
          }),
        };

        setAuth({
          isAuthenticated: true,
          userData,
          isDemo: false,
          demoStartTime: null,
          rememberMe: true,
        });

        toast.success(`Welcome back, ${userData.name}!`);
      } else {
        // Create a basic profile if none exists
        createUserProfile(user);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Create a basic user profile if none exists
  const createUserProfile = async (user: User) => {
    const email = user.email || '';
    const name = email.split('@')[0] || 'User';
    
    const newProfile = {
      id: user.id,
      name,
      email,
      phone: '',
      location: '',
      role: 'student' as UserRole,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .insert(newProfile);

      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      const userData: UserData = {
        role: 'student',
        name,
        phone: '',
        location: '',
        school: '',
        age: 16,
        grade: '',
      };

      setAuth({
        isAuthenticated: true,
        userData,
        isDemo: false,
        demoStartTime: null,
        rememberMe: true,
      });

      toast.success(`Welcome, ${name}! Please complete your profile.`);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

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

  const login = async (userData: UserData, rememberMe: boolean) => {
    try {
      // For simplicity, we're using a password derived from the phone number
      // In a real app, you would use a proper authentication flow
      const email = `${userData.name.toLowerCase().replace(/\s+/g, '.')}@eduhub.com`;
      const password = `${userData.phone.replace(/[^0-9]/g, '')}Pass123!`;
      
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          // If login fails, try to sign up the user
          const signUpResult = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: userData.name,
                role: userData.role,
              },
            },
          });

          if (signUpResult.error) {
            toast.error('Error creating account: ' + signUpResult.error.message);
            return;
          }

          data = signUpResult.data;
          
          // Create the profile in the database
          const profileData = {
            id: data.user?.id,
            name: userData.name,
            email,
            phone: userData.phone,
            location: userData.location,
            role: userData.role,
          };
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData);
            
          if (profileError) {
            toast.error('Error creating profile: ' + profileError.message);
          }
        } else {
          toast.error('Error logging in: ' + error.message);
          return;
        }
      }

      // Set local auth state
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
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login.');
    }
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
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoData));
    toast.info('You are using demo mode. You have 10 minutes to explore EduHub.');
  };

  const logout = async () => {
    // If this is a demo user, just clear the state
    if (auth.isDemo) {
      setAuth(initialAuthState);
      setDemoTimeRemaining(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      toast.info('You have been logged out of demo mode.');
      return;
    }

    // Otherwise, use Supabase logout
    try {
      await supabase.auth.signOut();
      setAuth(initialAuthState);
      setDemoTimeRemaining(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      toast.info('You have been logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out. Please try again.');
    }
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
