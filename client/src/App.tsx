import React, { useEffect, useRef } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import SimpleAuth from "@/pages/SimpleAuth";
import AuthPage from "@/pages/auth-page";
import DirectAuth from "@/pages/DirectAuth";
import { initializeNativeCapabilities } from "@/lib/native";
import { useAuth } from "@/lib/context/AuthContext";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";
import Debug from "@/pages/debug";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    // Initialize native capabilities
    initializeNativeCapabilities().catch((error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    });
  }, [toast]);

  // Show loading indicator
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="mb-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Show the login page directly if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <StatusBar />
        <div className="flex-1 overflow-y-auto">
          <DirectAuth />
        </div>
        <Toaster />
      </div>
    );
  }

  // Show the main app layout if authenticated
  console.log("App: User is authenticated, rendering main layout");
  
  // Enhanced error boundary to catch any rendering issues
  try {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <StatusBar />
        <div className="flex-1 overflow-y-auto pb-24">
          <Router />
        </div>
        <TabBar />
        <Toaster />
      </div>
    );
  } catch (error) {
    console.error("App rendering error:", error);
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">We're having trouble displaying the app.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Reload page
          </button>
        </div>
        <Toaster />
      </div>
    );
  }
}

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const redirectAttemptedRef = useRef(false);

  // Debug logging
  console.log("Router render. Auth state:", { isAuthenticated, loading, location });

  // One-time cleanup on component mount to prevent redirection issues
  useEffect(() => {
    // Reset the redirection flag in session storage
    if (sessionStorage.getItem('router_redirect_attempted')) {
      console.log("Router: Resetting redirection flags");
      sessionStorage.removeItem('router_redirect_attempted');
    }
    
    return () => {
      // Cleanup on unmount
      redirectAttemptedRef.current = false;
    }
  }, []);

  // Redirect users based on authentication state - with protection against loops
  useEffect(() => {
    // Skip if already attempted to redirect this render cycle
    if (redirectAttemptedRef.current) {
      console.log("Router: Already attempted redirect in this session, skipping");
      return;
    }
    
    // Skip if still loading auth state
    if (loading) {
      console.log("Router: Still loading auth state, skipping redirects");
      return;
    }
    
    // Check for redirection flag in session storage
    const routerRedirectAttempted = sessionStorage.getItem('router_redirect_attempted');
    if (routerRedirectAttempted) {
      console.log("Router: Redirect already attempted in session, preventing loop");
      return;
    }
    
    // Set flags to prevent multiple redirects
    redirectAttemptedRef.current = true;
    sessionStorage.setItem('router_redirect_attempted', 'true');
    
    const publicRoutes = ["/auth", "/debug", "/simple-auth"];
    
    // Handle redirect logic safely
    try {
      if (!isAuthenticated) {
        // If user is not authenticated and not on a public route, redirect to auth
        if (!publicRoutes.includes(location)) {
          console.log("Router: Redirecting to auth page - not authenticated, current location:", location);
          setLocation("/auth");
        }
      } else {
        // If user is authenticated and on auth page, redirect to home
        if (location === "/auth" || location === "/simple-auth") {
          console.log("Router: Redirecting to home page - already authenticated");
          setLocation("/");
        }
      }
    } catch (error) {
      console.error("Router: Navigation error:", error);
      // Clear the flag on error
      sessionStorage.removeItem('router_redirect_attempted');
    }
  }, [isAuthenticated, loading, location, setLocation]);

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // For the auth page or when not authenticated, directly render the DirectAuth component
  if (!isAuthenticated) {
    if (location === "/auth" || location === "/") {
      return <DirectAuth />;
    } else {
      // Redirect to auth for any non-auth routes when not authenticated
      setLocation("/auth");
      return <DirectAuth />;
    }
  }

  // Protected routes handler
  const renderProtectedComponent = (Component: React.ComponentType): JSX.Element => {
    // No loading check needed here anymore as it's handled above
    // No authentication check needed here anymore as it's handled above
    return <Component />;
  };

  return (
    <Switch>
      <Route path="/" component={() => renderProtectedComponent(Home)} />
      <Route path="/workouts" component={() => renderProtectedComponent(Workouts)} />
      <Route path="/nutrition" component={() => renderProtectedComponent(Nutrition)} />
      <Route path="/progress" component={() => renderProtectedComponent(Progress)} />
      <Route path="/profile" component={() => renderProtectedComponent(Profile)} />
      <Route path="/auth" component={DirectAuth} />
      <Route path="/debug" component={Debug} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}