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
import TabBar from "@/components/TabBar";
import StatusBar from "@/components/StatusBar";
import { useAuth } from "./lib/context/AuthContext";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if not at one of the main tabs
  useEffect(() => {
    const validRoutes = ["/", "/workouts", "/progress", "/nutrition", "/profile"];
    if (isAuthenticated && !validRoutes.includes(location)) {
      setLocation("/");
    }
  }, [location, isAuthenticated, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/progress" component={Progress} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col bg-gray-100">
        <StatusBar />
        <div className="flex-1 overflow-y-auto pb-24">
          <Router />
        </div>
        <TabBar />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
