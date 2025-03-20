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
  
  // Initialize native capabilities
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

  // DEVELOPMENT MODE: Skip login and just show the app
  // This makes it easier to focus on developing the app
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <StatusBar />
      <div className="flex-1 overflow-y-auto pb-24">
        <Home />
      </div>
      <TabBar />
      <Toaster />
    </div>
  );
}

function Router() {
  // SIMPLIFIED ROUTER
  // This is a simplified version with minimal redirections to avoid issues
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <DirectAuth />;
  }
  
  // If authenticated, just render home page directly
  return <Home />;
}

export default function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}