import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';
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

  useEffect(() => {
    // For now, we'll use a mock user in development mode
    if (import.meta.env.DEV) {
      const storedUser = localStorage.getItem('farm_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
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

    // TODO: Implement Supabase authentication
    throw new Error("Supabase authentication not configured yet. Use demo@cluckandtrack.com / password for demo.");
  };

  const signup = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    // TODO: Implement Supabase signup
    throw new Error("Supabase authentication not configured yet.");
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
    
    // TODO: Implement Supabase logout
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
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