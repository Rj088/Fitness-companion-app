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
import { initializeNativeCapabilities } from "@/lib/native";
import { useAuth } from "@/lib/context/AuthContext";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";
import Debug from "@/pages/debug";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <StatusBar />
      <div className="flex-1 overflow-y-auto pb-24">
        <Router />
      </div>
      {isAuthenticated && <TabBar />}
      <Toaster />
    </div>
  );
}

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Debug logging
  console.log("Router render. Auth state:", { isAuthenticated, loading, location });

  // Redirect unauthenticated users to login page
  useEffect(() => {
    const publicRoutes = ["/auth", "/debug"];

    if (!loading && !isAuthenticated && !publicRoutes.includes(location)) {
      console.log("Redirecting to auth page - not authenticated, current location:", location);
      setLocation("/auth");
    }
    
    if (!loading && isAuthenticated && location === "/auth") {
      console.log("Redirecting to home page - already authenticated");
      setLocation("/");
    }
  }, [isAuthenticated, loading, location, setLocation]);

  // Show a simplified auth page for debugging
  if (!isAuthenticated && location === "/auth") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <h1 className="text-2xl font-bold mb-8">Authentication Page</h1>
        <div className="w-full max-w-md p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl mb-4">Login</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <input type="text" id="username" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input type="password" id="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button type="button" className="w-full bg-primary text-white rounded-md py-2">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // Protected routes handler
  const renderProtectedComponent = (Component: React.ComponentType): JSX.Element => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <AuthPage />;
    }
    
    return <Component />;
  };

  return (
    <Switch>
      <Route path="/" component={() => renderProtectedComponent(Home)} />
      <Route path="/workouts" component={() => renderProtectedComponent(Workouts)} />
      <Route path="/nutrition" component={() => renderProtectedComponent(Nutrition)} />
      <Route path="/progress" component={() => renderProtectedComponent(Progress)} />
      <Route path="/profile" component={() => renderProtectedComponent(Profile)} />
      <Route path="/auth" component={AuthPage} />
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