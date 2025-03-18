import { supabase } from '@/lib/client';
import { fetchUserProfile } from '@/services/apiService';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Function to handle user role-based redirects
  const handleUserRedirect = async (userData: User) => {
    if (userData.role === 'Admin Yayasan') {
      navigate('/yayasan/dashboard');
    } else if (userData.role === 'Admin Pondok' && userData.pondokId) {
      // Check if pondok data exists
      const { data: pondokData, error } = await supabase
        .from('pondok')
        .select('*')
        .eq('id', userData.pondokId)
        .single();
      
      if (error || !pondokData) {
        navigate('/pondok/sync');
      } else {
        navigate('/pondok/dashboard');
      }
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

  // Check for existing session on mount
  useEffect(() => {
    const setupAuthListener = async () => {
      try {
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
        }
      } catch (error) {
        console.error('Auth setup error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const userData = await processAuthUser(authUser);
          if (userData) {
            await handleUserRedirect(userData);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
    });

    setupAuthListener();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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