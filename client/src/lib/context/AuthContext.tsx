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
export const useAuth = () => useContext(AuthContext);

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
        setState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  // Login function
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

      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });

      // Store user ID in localStorage
      localStorage.setItem(STORAGE_KEYS.USER_ID, user.id.toString());

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      });

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

  // Register function
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

      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });

      // Store user ID in localStorage
      localStorage.setItem(STORAGE_KEYS.USER_ID, user.id.toString());

      toast({
        title: "Registration successful",
        description: `Welcome, ${user.firstName}!`,
      });

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

  // Logout function
  const logout = async () => {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    setState({ isAuthenticated: false, user: null, loading: false, error: null });
    toast({ title: "Logged out", description: "You have been logged out successfully" });
    window.location.href = "/auth"; // Redirect to auth page

    // Added server-side session clearing
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout error:", error);
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