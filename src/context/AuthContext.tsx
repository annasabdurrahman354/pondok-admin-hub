
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authCheckComplete, setAuthCheckComplete] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to process authenticated user
  const processAuthUser = async (authUser: any) => {
    try {
      if (!authUser) {
        setUser(null);
        return null;
      }
      
      const userProfile = await fetchUserProfile(authUser.id);
      if (!userProfile) {
        console.error('No user profile found');
        return null;
      }
      
      const userData: User = {
        id: authUser.id,
        nama: userProfile.nama,
        nomor_telepon: userProfile.nomor_telepon,
        email: authUser.email,
        role: userProfile.role as UserRole,
        ...(userProfile.pondok_id && { pondokId: userProfile.pondok_id })
      };
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error processing auth user:', error);
      return null;
    }
  };

  // Function to handle user role-based redirects
  const handleUserRedirect = async (userData: User) => {
    try {
      const isLoginPage = location.pathname === '/login';
      
      // Always redirect from login page if user is authenticated
      if (userData.role === 'Admin Yayasan') {
        if (isLoginPage || location.pathname === '/') {
          navigate('/yayasan/dashboard');
        }
      } else if (userData.role === 'Admin Pondok') {
        if (!userData.pondokId) {
          navigate('/pondok/sync');
          return;
        }

        // Check if pondok data exists
        const pondokData = await fetchPondokData(userData.pondokId);
        
        if (!pondokData) {
          navigate('/pondok/sync');
        } else if (isLoginPage || location.pathname === '/') {
          navigate('/pondok/dashboard');
        }
      }
    } catch (error) {
      console.error('Error in redirect:', error);
      toast.error('Error processing login. Please try again.');
    }
  };

  // Check for existing session on mount and set up auth listener
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await processAuthUser(session.user);
          if (userData && mounted) {
            await handleUserRedirect(userData);
          }
        } else {
          // If no session and not on login page, redirect to login
          const nonAuthRoutes = ['/login'];
          if (!nonAuthRoutes.includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth session check error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setAuthCheckComplete(true);
        }
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          const userData = await processAuthUser(session.user);
          if (userData && mounted) {
            await handleUserRedirect(userData);
          }
          if (mounted) {
            setIsLoading(false);
            setAuthCheckComplete(true);
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            navigate('/login');
            setAuthCheckComplete(true);
          }
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Add a second effect to handle redirections on URL changes
  useEffect(() => {
    if (!authCheckComplete) return;
    
    // Don't run redirects until initial auth check is complete
    if (user) {
      const isLoginPage = location.pathname === '/login';
      
      // Redirect from login page if user is already authenticated
      if (isLoginPage) {
        if (user.role === 'Admin Yayasan') {
          navigate('/yayasan/dashboard');
        } else if (user.role === 'Admin Pondok') {
          if (!user.pondokId) {
            navigate('/pondok/sync');
          } else {
            navigate('/pondok/dashboard');
          }
        }
      }
    } else {
      // If no user and not on login page, redirect to login
      const nonAuthRoutes = ['/login'];
      if (!nonAuthRoutes.includes(location.pathname) && authCheckComplete) {
        navigate('/login');
      }
    }
  }, [user, location.pathname, authCheckComplete, navigate]);

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
      setAuthCheckComplete(true);
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
