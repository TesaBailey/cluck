
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{ requiresEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Check for dev mode mock user first
    if (import.meta.env.DEV) {
      const storedUser = localStorage.getItem('farm_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
        return;
      }
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.display_name || session.user.email?.split('@')[0] || '',
            role: 'farm_manager',
            avatarUrl: session.user.user_metadata.avatar_url,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.display_name || session.user.email?.split('@')[0] || '',
          role: 'farm_manager',
          avatarUrl: session.user.user_metadata.avatar_url,
        });
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    // Handle dev mode special case
    if (import.meta.env.DEV && email === "demo@cluckandtrack.com" && password === "password") {
      const mockUser: User = {
        id: "demo-user-id",
        email: "demo@cluckandtrack.com",
        name: "Demo User",
        role: "farm_manager",
        avatarUrl: null
      };
      
      localStorage.setItem('farm_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Login successful",
        description: "Welcome to Cluck & Track!",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      } else {
        toast({
          title: "Login successful",
          description: "Welcome to Cluck & Track!",
        });
      }
    } catch (error: any) {
      console.error("Login catch error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setIsLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Get the current site URL
      const siteUrl = window.location.origin;
      
      // Modified signup to skip email confirmation
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${siteUrl}/login`, // Keep this for cases where confirmation is enabled in Supabase
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // We'll auto-login the user instead of waiting for email confirmation
      if (data.user) {
        // Immediately sign in the user after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          toast({
            title: "Auto-login failed",
            description: "Your account was created but we couldn't sign you in automatically. Please try logging in.",
            variant: "destructive",
          });
          return { requiresEmailConfirmation: false };
        }

        toast({
          title: "Account created",
          description: "Welcome to Cluck & Track!",
        });
        
        // Force page refresh to ensure session is properly loaded
        window.location.href = '/';
        return { requiresEmailConfirmation: false };
      } else {
        toast({
          title: "Account created",
          description: "Please sign in with your new account.",
        });
        return { requiresEmailConfirmation: false };
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Handle dev mode special case
    if (import.meta.env.DEV && localStorage.getItem('farm_user')) {
      localStorage.removeItem('farm_user');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      // Force page reload after logout for clean state
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
