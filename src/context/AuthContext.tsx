
import { supabase } from '@/lib/client';
import { fetchUserProfile, fetchPondokData } from '@/services/apiService';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Define types for our user and auth context
export type UserRole = 'Admin Yayasan' | 'Admin Pondok';

type User = {
  id: string;
  nama: string;
  nomor_telepon: string;
  email: string;
  role: UserRole;
  pondokId?: string; // Only for admin_pondok
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle user role-based redirects
  const handleUserRedirect = async (userData: User) => {
    try {
      // Check if user is on the login page and already authenticated
      const isLoginPage = location.pathname === '/login';
      
      if (userData.role === 'Admin Yayasan') {
        if (isLoginPage) {
          navigate('/yayasan/dashboard');
        }
      } else if (userData.role === 'Admin Pondok') {
        if (!userData.pondokId) {
          // If admin_pondok has no pondok_id, send to sync page
          navigate('/pondok/sync');
        } else {
          // Check if pondok data exists
          const pondokData = await fetchPondokData(userData.pondokId);
          
          if (!pondokData) {
            navigate('/pondok/sync');
          } else if (isLoginPage) {
            navigate('/pondok/dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Error in redirect:', error);
    }
  };

  // Function to process authenticated user
  const processAuthUser = async (authUser: any) => {
    try {
      if (!authUser) return null;
      
      const userProfile = await fetchUserProfile(authUser.id);
      if (!userProfile) return null;
      
      const { nama, nomor_telepon, role, pondok_id } = userProfile;
      
      const userData: User = {
        id: authUser.id,
        nama,
        nomor_telepon,
        email: authUser.email,
        role: role as UserRole,
        ...(pondok_id && { pondokId: pondok_id })
      };
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error processing auth user:', error);
      return null;
    }
  };

  // Check for existing session on mount and set up auth listener
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user metadata from session
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            const userData = await processAuthUser(authUser);
            if (userData) {
              await handleUserRedirect(userData);
            }
          }
        } else {
          // If no session and not on login page, redirect to login
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            const userData = await processAuthUser(authUser);
            if (userData) {
              await handleUserRedirect(userData);
            }
          }
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        const userData = await processAuthUser(data.user);
        
        if (userData) {
          if (userData.role === 'Admin Yayasan') {
            toast.success('Logged in as Admin Yayasan');
          } else if (userData.role === 'Admin Pondok') {
            if (!userData.pondokId) {
              toast.success('Logged in. Set up your Pondok data first');
            } else {
              toast.success('Logged in as Admin Pondok');
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
