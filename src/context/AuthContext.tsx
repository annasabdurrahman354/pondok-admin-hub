
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define types for our user and auth context
type User = {
  id: string;
  email: string;
  role: 'admin_yayasan' | 'admin_pondok';
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
    const checkSession = async () => {
      try {
        // Mock fetching session - will be replaced with Supabase Auth
        const storedUser = localStorage.getItem('pondok_admin_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock login - will be replaced with Supabase Auth
      // This is for demonstration purposes only
      if (email && password) {
        // Mock different user roles for development
        let mockUser: User;
        
        if (email.includes('yayasan')) {
          mockUser = {
            id: 'y-123',
            email,
            role: 'admin_yayasan'
          };
          toast.success('Logged in as Admin Yayasan');
          navigate('/yayasan/dashboard');
        } else {
          mockUser = {
            id: 'p-456',
            email,
            role: 'admin_pondok',
            pondokId: 'p-001'
          };
          
          // Check if pondok data exists
          const hasPondokData = localStorage.getItem(`pondok_data_${mockUser.pondokId}`);
          
          if (!hasPondokData) {
            toast.success('Logged in. Sync your Pondok data first');
            navigate('/pondok/sync');
          } else {
            toast.success('Logged in as Admin Pondok');
            navigate('/pondok/dashboard');
          }
        }
        
        // Store user in local storage
        localStorage.setItem('pondok_admin_user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Mock logout - will be replaced with Supabase Auth
      localStorage.removeItem('pondok_admin_user');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
