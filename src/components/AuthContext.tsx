
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, UserData, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  auth: AuthState;
  login: (userData: UserData, rememberMe: boolean) => void;
  logout: () => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  userData: null,
  rememberMe: false,
};

const AUTH_STORAGE_KEY = 'eduhub-auth-data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          fetchUserProfile(session.user);
        } else {
          setAuth(initialAuthState);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user);
      } else {
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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        let userData: UserData;
        
        if (data.role === 'student') {
          userData = {
            role: 'student',
            name: data.name,
            phone: data.phone,
            location: data.location,
            school: data.school || '',
            age: data.age || 16,
            grade: data.grade || '',
          };
        } else if (data.role === 'teacher') {
          userData = {
            role: 'teacher',
            name: data.name,
            phone: data.phone,
            location: data.location,
            teachingSchool: data.teaching_school || '',
            teachingGrades: data.teaching_grades ? data.teaching_grades.split(',') : [],
          };
        } else {
          userData = {
            role: 'school',
            name: data.name,
            phone: data.phone,
            location: data.location,
            ceoName: data.ceo_name || '',
          };
        }

        setAuth({
          isAuthenticated: true,
          userData,
          rememberMe: true,
        });

        toast.success(`Welcome back, ${userData.name}!`);
      } else {
        createUserProfile(user);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

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
        rememberMe: true,
      });

      toast.success(`Welcome, ${name}! Please complete your profile.`);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const login = async (userData: UserData, rememberMe: boolean) => {
    try {
      const email = `${userData.name.toLowerCase().replace(/\s+/g, '.')}@eduhub.com`;
      const password = `${userData.phone.replace(/[^0-9]/g, '')}Pass123!`;
      
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
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

      const newAuthState: AuthState = {
        isAuthenticated: true,
        userData,
        rememberMe,
      };
      
      setAuth(newAuthState);
      
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      
      toast.success(`Welcome, ${userData.name}!`);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login.');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuth(initialAuthState);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      toast.info('You have been logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
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
