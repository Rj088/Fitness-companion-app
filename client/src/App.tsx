import { useEffect } from "react";
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

  // Debug logging
  console.log("Router render. Auth state:", { isAuthenticated, loading, location });

  // Redirect users based on authentication state
  useEffect(() => {
    if (loading) {
      console.log("Router: Still loading auth state, skipping redirects");
      return;
    }
    
    const publicRoutes = ["/auth", "/debug", "/simple-auth"];
    
    if (!isAuthenticated) {
      // If user is not authenticated and not on a public route, redirect to auth
      if (!publicRoutes.includes(location)) {
        console.log("Router: Redirecting to auth page - not authenticated, current location:", location);
        try {
          setLocation("/auth");
        } catch (error) {
          console.error("Router: Navigation error:", error);
          // As a fallback, use direct window location change
          window.location.href = "/auth";
        }
      }
    } else {
      // If user is authenticated and on auth page, redirect to home
      if (location === "/auth" || location === "/simple-auth") {
        console.log("Router: Redirecting to home page - already authenticated");
        try {
          setLocation("/");
          
          // Double-check that the redirect worked after a short delay
          setTimeout(() => {
            if (window.location.pathname === "/auth" || window.location.pathname === "/simple-auth") {
              console.log("Router: Fallback redirect to homepage with window.location");
              window.location.href = "/";
            }
          }, 500);
        } catch (error) {
          console.error("Router: Navigation error:", error);
          // As a fallback, use direct window location change
          window.location.href = "/";
        }
      }
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