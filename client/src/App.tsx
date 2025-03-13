import { Switch, Route, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Added import
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Progress from "@/pages/Progress";
import Nutrition from "@/pages/Nutrition";
import Profile from "@/pages/Profile";
import AuthPage from "@/pages/auth-page";
import DebugPage from "@/pages/debug";
import TestPage from "@/pages/test-page";
import SimpleAuthPage from "@/pages/simpler-auth-page";
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

  // For debugging, temporarily disabled routes redirect
  // useEffect(() => {
  //   const validRoutes = ["/", "/workouts", "/progress", "/nutrition", "/profile", "/auth", "/debug"];
  //   if (isAuthenticated && !validRoutes.includes(location)) {
  //     setLocation("/");
  //   }
  // }, [location, isAuthenticated, setLocation]);

  // Bypass authentication for demo purposes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/simple-auth" component={SimpleAuthPage} />
      <Route path="/debug" component={DebugPage} />
      <Route path="/test" component={TestPage} />
      <Route path="/home" component={Home} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/progress" component={Progress} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/profile" component={Profile} />
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

  // Force show UI components for demo purposes
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
}

const queryClient = new QueryClient(); // Create QueryClient instance

export default () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);