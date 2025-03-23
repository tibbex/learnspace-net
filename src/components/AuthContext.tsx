
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, UserData, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { auth as firebaseAuth, db } from '@/services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';

interface AuthContextType {
  auth: AuthState;
  login: (userData: UserData, rememberMe: boolean, password: string) => Promise<void>;
  startDemo: () => void;
  logout: () => Promise<void>;
  signup: (userData: UserData, password: string, rememberMe: boolean) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  // Check for authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            
            setAuth({
              isAuthenticated: true,
              userData,
              isDemo: false,
              demoStartTime: null,
              rememberMe,
            });
          } else {
            // User exists in Auth but not in Firestore
            await logout();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Error loading your profile. Please try again.');
        }
      } else {
        // Check for demo user in localStorage
        const savedAuthData = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuthData) {
          try {
            const parsedAuthData = JSON.parse(savedAuthData) as AuthState;
            if (parsedAuthData.isDemo) {
              // If in demo mode, check if it's still valid
              if (parsedAuthData.demoStartTime) {
                const elapsedTime = Date.now() - parsedAuthData.demoStartTime;
                if (elapsedTime < DEMO_DURATION) {
                  setAuth(parsedAuthData);
                } else {
                  localStorage.removeItem(AUTH_STORAGE_KEY);
                  setAuth(initialAuthState);
                }
              }
            } else if (parsedAuthData.rememberMe) {
              // If remember me was enabled but Firebase session expired, clear localStorage
              localStorage.removeItem(AUTH_STORAGE_KEY);
              setAuth(initialAuthState);
            }
          } catch (error) {
            console.error('Failed to parse saved auth data:', error);
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setAuth(initialAuthState);
          }
        } else {
          setAuth(initialAuthState);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
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

  const signup = async (userData: UserData, password: string, rememberMe: boolean) => {
    try {
      // Create email from phone number (as a simple unique identifier)
      const email = `${userData.phone.replace(/\D/g, '')}@eduhub.com`;
      
      // Register user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Update local state
      const newAuthState: AuthState = {
        isAuthenticated: true,
        userData,
        isDemo: false,
        demoStartTime: null,
        rememberMe,
      };
      
      setAuth(newAuthState);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      }
      
      toast.success(`Welcome, ${userData.name}!`);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
      throw error;
    }
  };

  const login = async (userData: UserData, rememberMe: boolean, password: string) => {
    try {
      // Create email from phone number
      const email = `${userData.phone.replace(/\D/g, '')}@eduhub.com`;
      
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      // Update local state
      const newAuthState: AuthState = {
        isAuthenticated: true,
        userData,
        isDemo: false,
        demoStartTime: null,
        rememberMe,
      };
      
      setAuth(newAuthState);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
      throw error;
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
    try {
      if (!auth.isDemo) {
        await signOut(firebaseAuth);
      }
      
      setAuth(initialAuthState);
      setDemoTimeRemaining(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('rememberMe');
      toast.info('You have been logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  if (loading) {
    // You could return a loading spinner here if needed
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      auth, 
      login, 
      startDemo, 
      logout, 
      signup,
      isDemo: auth.isDemo, 
      demoTimeRemaining 
    }}>
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
