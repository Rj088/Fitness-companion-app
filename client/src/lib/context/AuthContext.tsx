import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { STORAGE_KEYS, API_ENDPOINTS } from '@/lib/constants';
import { User, LoginCredentials, AuthState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Define the shape of our context
interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>; // Changed to Promise<void>
  register: (userData: any) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => false,
  logout: async () => {}, // Changed to async
  register: async () => false,
});

// Custom hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });
  const { toast } = useToast();

  // Check if there's a stored user ID on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

      if (userId) {
        try {
          console.log("Checking auth for user ID:", userId);
          const response = await fetch(API_ENDPOINTS.USERS.GET(Number(userId)), {
            credentials: 'include',
          });

          if (response.ok) {
            const user = await response.json();
            console.log("User auth check successful:", user);
            setState({
              isAuthenticated: true,
              user,
              loading: false,
              error: null,
            });
          } else {
            console.log("User auth check failed, clearing stored data");
            // Clear invalid stored data
            localStorage.removeItem(STORAGE_KEYS.USER_ID);
            setState({
              isAuthenticated: false,
              user: null,
              loading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          setState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Authentication check failed',
          });
        }
      } else {
        console.log("No stored user ID found, not authenticated");
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    // Set a timeout to ensure loading state is cleared even if auth check fails
    const timeoutId = setTimeout(() => {
      setState(prevState => {
        if (prevState.loading) {
          console.log("Auth check timed out, setting not authenticated");
          return {
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null
          };
        }
        return prevState;
      });
    }, 3000);
    
    checkAuth();
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Login function - SIMPLIFIED VERSION WITH GUARANTEED PAGE RELOAD
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState({
      ...state,
      loading: true,
      error: null,
    });

    try {
      console.log("Attempting login with:", credentials);
      
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const user = await response.json();
      console.log("Login successful, received user:", user);

      // CRITICAL: Store user ID in localStorage before reload
      localStorage.setItem(STORAGE_KEYS.USER_ID, user.id.toString());
      
      // Also store a LOGIN_SUCCESS flag to ensure we reload properly
      localStorage.setItem('LOGIN_SUCCESS', 'true');
      localStorage.setItem('LOGIN_TIMESTAMP', new Date().getTime().toString());
      
      // Update state now, just in case the page doesn't reload
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      });
      
      // SUCCESS! Force reload to ensure clean app state
      console.log("Login successful, forcing page reload");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);

      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message || 'Login failed',
      });

      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });

      return false;
    }
  };

  // Register function - SIMPLIFIED WITH GUARANTEED PAGE RELOAD
  const register = async (userData: any): Promise<boolean> => {
    setState({
      ...state,
      loading: true,
      error: null,
    });

    try {
      console.log("Attempting registration with:", userData);
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const user = await response.json();
      console.log("Registration successful, received user:", user);

      // CRITICAL: Store user ID in localStorage before reload
      localStorage.setItem(STORAGE_KEYS.USER_ID, user.id.toString());
      
      // Also store a REGISTER_SUCCESS flag to ensure we reload properly
      localStorage.setItem('REGISTER_SUCCESS', 'true');
      localStorage.setItem('REGISTER_TIMESTAMP', new Date().getTime().toString());
      
      // Update state now, just in case the page doesn't reload
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });

      toast({
        title: "Registration successful",
        description: `Welcome, ${user.firstName}!`,
      });
      
      // SUCCESS! Force reload to ensure clean app state
      console.log("Registration successful, forcing page reload");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);

      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message || 'Registration failed',
      });

      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });

      return false;
    }
  };

  // Logout function with improved direct navigation
  const logout = async () => {
    // Added server-side session clearing
    try {
      console.log("Attempting logout via API...");
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
        credentials: "include"
      });
      
      // Complete cleanup - remove all storage items
      console.log("Performing complete cleanup of localStorage and sessionStorage");
      
      // Clear all localStorage items
      localStorage.clear();
      
      // Clear all sessionStorage items
      sessionStorage.clear();
      
      // Update auth state
      setState({ isAuthenticated: false, user: null, loading: false, error: null });
      
      // Show toast feedback
      toast({ 
        title: "Logged out", 
        description: "You have been logged out successfully" 
      });
      
      // Show visual confirmation before redirecting
      const message = document.createElement('div');
      message.style.position = 'fixed';
      message.style.top = '0';
      message.style.left = '0';
      message.style.width = '100%';
      message.style.padding = '1rem';
      message.style.backgroundColor = '#4CAF50';
      message.style.color = 'white';
      message.style.textAlign = 'center';
      message.style.zIndex = '9999';
      message.innerText = 'Logged out successfully! Redirecting...';
      document.body.appendChild(message);
      
      // Set a special flag for auth page to detect a logout redirect
      localStorage.setItem('LOGOUT_REDIRECT', 'true');
      localStorage.setItem('LOGOUT_TIMESTAMP', new Date().getTime().toString());
      
      // Use a shorter delay for better UX
      setTimeout(() => {
        console.log("Executing direct navigation to auth page");
        // Force a complete reset using multiple approaches to ensure one works
        try {
          // Use window.open for most reliable navigation
          window.open('/auth', '_self');
        } catch (e) {
          console.error("Primary redirect failed, using fallback:", e);
          window.location.href = "/auth";
        }
      }, 800);
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still clear all storage even if server logout fails
      localStorage.clear();
      sessionStorage.clear();
      
      // Set logged out state
      setState({ isAuthenticated: false, user: null, loading: false, error: null });
      
      // Set a special flag for auth page to detect a logout redirect
      localStorage.setItem('LOGOUT_REDIRECT', 'true');
      localStorage.setItem('LOGOUT_ERROR', 'true');
      
      // Show error message but still redirect
      toast({
        title: "Logout issue",
        description: "There was an issue with the logout process, but you've been logged out.",
        variant: "destructive"
      });
      
      // Use shorter timeout for better UX
      setTimeout(() => {
        console.log("Redirecting to auth page after failed logout...");
        window.location.href = "/auth";
      }, 800);
    }
  };

  // Auto-login is disabled in favor of the login page
  // For testing, you can uncomment the code below
  /*
  useEffect(() => {
    if (!state.loading && !state.isAuthenticated) {
      login({ username: "sarah", password: "password123" });
    }
  }, [state.loading, state.isAuthenticated]);
  */

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};