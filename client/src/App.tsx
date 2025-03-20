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

// Create a mock user to use throughout the app
const MOCK_USER = {
  id: 999,
  username: "demouser",
  firstName: "Demo",
  lastName: "User",
  height: 175,
  weight: 70,
  goalWeight: 65,
  age: 30,
  fitnessLevel: "intermediate" as const,
  dailyCalorieGoal: 2000,
  dailyStepsGoal: 10000,
  workoutFrequency: 3,
  createdAt: new Date()
};

// Override the useAuth hook to always return an authenticated state
// This is a quick hack to bypass authentication in development
const originalUseAuth = useAuth;
(window as any).mockAuthEnabled = true;

// Override the original useAuth implementation
(useAuth as any) = function() {
  const auth = originalUseAuth();
  
  // If mock auth is enabled, return a mocked auth state
  if ((window as any).mockAuthEnabled) {
    return {
      ...auth,
      isAuthenticated: true,
      user: MOCK_USER,
      loading: false
    };
  }
  
  // Otherwise, return the original auth
  return auth;
};

function App() {
  const { toast } = useToast();
  
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

  // PURE DEV MODE - Always show the app regardless of authentication
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <StatusBar />
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="bg-blue-600 text-white p-3 text-center font-bold">
          DEVELOPMENT MODE - Authentication Bypassed - Demo User Active
        </div>
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