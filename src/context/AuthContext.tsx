
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for our user and auth context
export type UserRole = 'admin_yayasan' | 'admin_pondok';

type User = {
  id: string;
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
  isLoading: true,
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
            const role = authUser.user_metadata.role as UserRole;
            const pondokId = authUser.user_metadata.pondok_id as string | undefined;
            
            const userData: User = {
              id: authUser.id,
              email: authUser.email || '',
              role,
              ...(pondokId && { pondokId })
            };
            
            setUser(userData);
            
            // Redirect based on role
            if (role === 'admin_yayasan') {
              navigate('/yayasan/dashboard');
            } else if (role === 'admin_pondok') {
              // Check if pondok data exists
              const { data: pondokData } = await supabase
                .from('pondok')
                .select('*')
                .eq('id', pondokId)
                .single();
              
              if (!pondokData) {
                navigate('/pondok/sync');
              } else {
                navigate('/pondok/dashboard');
              }
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
          const role = authUser.user_metadata.role as UserRole;
          const pondokId = authUser.user_metadata.pondok_id as string | undefined;
          
          const userData: User = {
            id: authUser.id,
            email: authUser.email || '',
            role,
            ...(pondokId && { pondokId })
          };
          
          setUser(userData);
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
        const role = data.user.user_metadata.role as UserRole;
        
        if (role === 'admin_yayasan') {
          toast.success('Logged in as Admin Yayasan');
        } else if (role === 'admin_pondok') {
          const pondokId = data.user.user_metadata.pondok_id as string;
          
          // Check if pondok data exists
          const { data: pondokData } = await supabase
            .from('pondok')
            .select('*')
            .eq('id', pondokId)
            .single();
          
          if (!pondokData) {
            toast.success('Logged in. Sync your Pondok data first');
            navigate('/pondok/sync');
          } else {
            toast.success('Logged in as Admin Pondok');
            navigate('/pondok/dashboard');
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
