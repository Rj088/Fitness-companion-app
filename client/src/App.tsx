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
import { setupNative } from "@/lib/native";
import { useAuth } from "@/lib/context/AuthContext";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";
import Debug from "@/pages/Debug";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setupNative({
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
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
  const { isAuthenticated } = useAuth();

  // Redirect unauthenticated users to login page
  useEffect(() => {
    const publicRoutes = ["/auth", "/debug"];

    if (!isAuthenticated && !publicRoutes.includes(location)) {
      setLocation("/auth");
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/progress" component={Progress} />
      <Route path="/profile" component={Profile} />
      <Route path="/auth" component={SimpleAuth} />
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