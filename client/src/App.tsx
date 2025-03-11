import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Progress from "@/pages/Progress";
import Nutrition from "@/pages/Nutrition";
import Profile from "@/pages/Profile";
import AuthPage from "@/pages/auth-page";
import DebugPage from "@/pages/debug";
import TabBar from "@/components/TabBar";
import StatusBar from "@/components/StatusBar";
import { useAuth } from "./lib/context/AuthContext";
import { useEffect } from "react";
import { initializeNativeCapabilities, isNativePlatform } from "./lib/native";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if not at one of the main tabs
  useEffect(() => {
    const validRoutes = ["/", "/workouts", "/progress", "/nutrition", "/profile", "/auth"];
    if (isAuthenticated && !validRoutes.includes(location)) {
      setLocation("/");
    }
  }, [location, isAuthenticated, setLocation]);

  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/workouts" component={Workouts} />
      <ProtectedRoute path="/progress" component={Progress} />
      <ProtectedRoute path="/nutrition" component={Nutrition} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { toast } = useToast();

  // Initialize native capabilities if running in a native app
  useEffect(() => {
    const setupNative = async () => {
      try {
        const isNative = await isNativePlatform();
        if (isNative) {
          await initializeNativeCapabilities();
          console.log("Native capabilities initialized");
        } else {
          console.log("Running in web environment");
        }
      } catch (error) {
        console.error("Error initializing native capabilities:", error);
        toast({
          title: "App Initialization",
          description: "Some device features may not be available.",
          variant: "destructive",
        });
      }
    };
    
    setupNative();
  }, [toast]);

  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col bg-gray-100">
        {isAuthenticated && <StatusBar />}
        <div className={`flex-1 overflow-y-auto ${isAuthenticated ? 'pb-24' : ''}`}>
          <Router />
        </div>
        {isAuthenticated && <TabBar />}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
