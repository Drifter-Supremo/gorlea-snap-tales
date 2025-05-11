
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if the user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login functionality
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (email && password) {
        const mockUser = {
          id: "user-1",
          email,
          name: email.split('@')[0],
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register a new user
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (email && password) {
        const mockUser = {
          id: "user-" + Date.now(),
          email,
          name: name || email.split('@')[0],
          profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast({
          title: "Account created",
          description: "Welcome to Gorlea Snaps!",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Could not create your account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: "guest-" + Date.now(),
      email: "guest@example.com",
      name: "Guest User",
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"
    };
    
    setUser(guestUser);
    localStorage.setItem("user", JSON.stringify(guestUser));
    toast({
      title: "Guest access",
      description: "You're browsing as a guest. Some features may be limited.",
    });
  };

  const forgotPassword = async (email: string) => {
    try {
      // In a real app, this would be an API call to send a reset email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions",
      });
    } catch (error) {
      toast({
        title: "Failed to send reset email",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signUp,
    logout,
    continueAsGuest,
    forgotPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
