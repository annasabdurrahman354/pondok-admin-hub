import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/client.ts";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, fetchPondokData } from "@/services/apiService";
import { User } from "@/types/dataTypes";

const SessionContext = createContext<{
  session: Session | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };
export const SessionProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hasNavigated = useRef(false);

  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ["userProfile", session?.user?.id],
    queryFn: () => (session?.user?.id ? fetchUserProfile(session.user.id) : null),
    enabled: !!session?.user?.id,
  });

  const { data: pondokData, isLoading: isPondokLoading } = useQuery({
    queryKey: ["pondok", userProfile?.pondok_id],
    queryFn: () => (userProfile?.pondok_id ? fetchPondokData(userProfile.pondok_id) : null),
    enabled: !!userProfile?.pondok_id,
  });

  // Handle auth state changes
  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(async (_, newSession) => {
      if (newSession) {
        setSession(newSession);
      } else {
        setSession(null);
        setUser(null);
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Update user data when userProfile changes
  useEffect(() => {
    if (userProfile && session?.user) {
      const { nama, nomor_telepon, role, pondok_id } = userProfile;
      setUser({
        id: session.user.id,
        nama,
        nomor_telepon,
        email: session.user.email || "",
        role,
        pondok_id: pondok_id,
      });
    }
  }, [userProfile, session]);

  // Handle navigation based on user role and data
  // Use a separate effect with a ref to prevent infinite loops
  useEffect(() => {
    if (!isUserLoading && !isPondokLoading && user && !hasNavigated.current) {
      // Only navigate if we haven't already navigated for this user session
      if (location.pathname === "/login") {
        if (user.role === "Admin Yayasan") {
          navigate("/yayasan/dashboard");
          hasNavigated.current = true;
        } else if (user.role === "Admin Pondok") {
          if (!user.pondok_id || !pondokData) {
            navigate("/pondok/sync");
          } else {
            navigate("/pondok/dashboard");
          }
          hasNavigated.current = true;
        }
      } else if (user.role === "Admin Pondok" && !user.pondok_id && location.pathname !== "/pondok/sync") {
        navigate("/pondok/sync");
        hasNavigated.current = true;
      }
    }
    
    // Reset the navigation flag when location changes
    return () => {
      if (location.pathname === "/login") {
        hasNavigated.current = false;
      }
    };
  }, [user, pondokData, location.pathname, isUserLoading, isPondokLoading, navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session);
      hasNavigated.current = false; // Reset navigation flag on login
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      hasNavigated.current = false; // Reset navigation flag on logout
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  };

  if (isUserLoading || isPondokLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, user, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};