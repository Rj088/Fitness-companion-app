import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";
import { User, Workout, UserWorkout, UserMeal, Activity, WeightLog } from "@/lib/types";

// Create our own AuthContext for the mock version
const AuthContext = React.createContext<any>(null);
import { initializeNativeCapabilities } from "@/lib/native";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Static mock data
const mockUser: User = {
  id: 999,
  username: "fitnessuser",
  firstName: "Fitness",
  lastName: "User",
  height: 175,
  weight: 70,
  goalWeight: 65,
  age: 30,
  fitnessLevel: "intermediate" as const,
  dailyCalorieGoal: 2200,
  dailyStepsGoal: 10000,
  workoutFrequency: 4,
  createdAt: new Date()
};

const mockWorkouts: Workout[] = [
  {
    id: 1,
    name: "Full Body Circuit",
    description: "A complete workout targeting all major muscle groups",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2340&auto=format&fit=crop",
    duration: 45,
    caloriesBurned: 350,
    difficulty: "intermediate" as const,
    category: "strength" as const,
    exercises: [
      { id: 1, name: "Push-ups", sets: 3, reps: 15, description: "Regular push-ups with proper form" },
      { id: 2, name: "Squats", sets: 3, reps: 20, description: "Bodyweight squats" },
      { id: 3, name: "Lunges", sets: 3, reps: 12, description: "Forward lunges, alternating legs" },
      { id: 4, name: "Plank", duration: 60, description: "Hold a plank position" }
    ]
  },
  {
    id: 2,
    name: "HIIT Cardio Blast",
    description: "High intensity interval training to boost your metabolism",
    imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=2574&auto=format&fit=crop",
    duration: 30,
    caloriesBurned: 400,
    difficulty: "advanced" as const,
    category: "hiit" as const,
    exercises: [
      { id: 5, name: "Jumping Jacks", duration: 45, description: "Full range of motion" },
      { id: 6, name: "Mountain Climbers", duration: 45, description: "Fast pace" },
      { id: 7, name: "Burpees", duration: 45, description: "Full burpees with push-up" },
      { id: 8, name: "High Knees", duration: 45, description: "Running in place with high knees" }
    ]
  },
  {
    id: 3,
    name: "Yoga Flow",
    description: "Gentle yoga flow to improve flexibility and reduce stress",
    imageUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2574&auto=format&fit=crop",
    duration: 60,
    caloriesBurned: 200,
    difficulty: "beginner" as const,
    category: "flexibility" as const,
    exercises: [
      { id: 9, name: "Sun Salutation", duration: 300, description: "Flow through sun salutation sequence" },
      { id: 10, name: "Warrior Poses", duration: 300, description: "Warrior I, II, and III" },
      { id: 11, name: "Downward Dog", duration: 120, description: "Hold downward facing dog pose" }
    ]
  }
];

const mockUserWorkouts: UserWorkout[] = [
  {
    id: 1,
    userId: mockUser.id,
    workoutId: 1,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 45,
    caloriesBurned: 350,
    completed: true,
    workout: mockWorkouts[0]
  },
  {
    id: 2,
    userId: mockUser.id,
    workoutId: 2,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    duration: 30,
    caloriesBurned: 400,
    completed: true,
    workout: mockWorkouts[1]
  },
  {
    id: 3,
    userId: mockUser.id,
    workoutId: 3,
    date: new Date(), // Today
    duration: 0, // Not completed yet
    caloriesBurned: 0,
    completed: false,
    workout: mockWorkouts[2]
  }
];

const mockFoods = [
  {
    id: 1,
    name: "Oatmeal with Berries",
    calories: 350,
    protein: 12,
    carbs: 60,
    fat: 7,
    servingSize: "1 bowl"
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    calories: 450,
    protein: 40,
    carbs: 15,
    fat: 20,
    servingSize: "1 plate"
  },
  {
    id: 3,
    name: "Protein Smoothie",
    calories: 300,
    protein: 25,
    carbs: 30,
    fat: 5,
    servingSize: "1 glass"
  },
  {
    id: 4,
    name: "Salmon with Vegetables",
    calories: 500,
    protein: 35,
    carbs: 20,
    fat: 25,
    servingSize: "1 fillet"
  }
];

const mockUserMeals: UserMeal[] = [
  {
    id: 1,
    userId: mockUser.id,
    date: new Date(),
    mealType: "breakfast" as const,
    foodId: 1,
    servings: 1,
    food: mockFoods[0]
  },
  {
    id: 2,
    userId: mockUser.id,
    date: new Date(),
    mealType: "lunch" as const,
    foodId: 2,
    servings: 1,
    food: mockFoods[1]
  },
  {
    id: 3,
    userId: mockUser.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    mealType: "breakfast" as const,
    foodId: 3,
    servings: 1,
    food: mockFoods[2]
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    mealType: "dinner" as const,
    foodId: 4,
    servings: 1,
    food: mockFoods[3]
  }
];

const mockActivity: Activity = {
  id: 1,
  userId: mockUser.id,
  date: new Date().toISOString(),
  steps: 8500,
  caloriesBurned: 450,
  activeMinutes: 95
};

const mockWeightLogs: WeightLog[] = [
  {
    id: 1,
    userId: mockUser.id,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    weight: 72.5
  },
  {
    id: 2,
    userId: mockUser.id,
    date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000), // 23 days ago
    weight: 71.8
  },
  {
    id: 3,
    userId: mockUser.id,
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
    weight: 71.2
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    weight: 70.5
  },
  {
    id: 5,
    userId: mockUser.id,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    weight: 70.1
  }
];

// Create fake authentication provider with mock data
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock the auth state
  const [state, setState] = useState({
    isAuthenticated: true,
    user: mockUser,
    loading: false,
    error: null
  });

  // Define mock functions
  const login = async () => true;
  const logout = async () => {};
  const register = async () => true;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create mock API responses
const createMockAPI = () => {
  // Mock all API endpoints
  const fetchMock = async () => {
    // You can intercept and mock API calls here
  };

  // Replace fetch globally with your mock version
  // This is more complex and would require more setup
};

// Create a fake QueryClient with predefined data
const setupMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  });
};

// The main app component
function NoAuthApp() {
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();
  
  // Initialize app
  useEffect(() => {
    // Initialize native capabilities
    initializeNativeCapabilities().catch((error: Error) => {
      console.error("Failed to initialize native capabilities:", error);
    });
    
    // Show welcome toast
    toast({
      title: "Welcome to FitTrack!",
      description: "App loaded with mock data. All features are available.",
    });
  }, [toast]);

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "workouts":
        return <Workouts />;
      case "nutrition":
        return <Nutrition />;
      case "progress":
        return <Progress />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  // Handle tab change
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <StatusBar />
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="bg-blue-600 text-white p-2 text-center font-semibold sticky top-0 z-10">
          DEVELOPMENT MODE - Using Mock Data
        </div>
        {renderTabContent()}
      </div>
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-2 px-4">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => handleTabClick("home")}
            className={`flex flex-col items-center p-2 ${activeTab === "home" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => handleTabClick("workouts")}
            className={`flex flex-col items-center p-2 ${activeTab === "workouts" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-xs">Workouts</span>
          </button>
          <button 
            onClick={() => handleTabClick("nutrition")}
            className={`flex flex-col items-center p-2 ${activeTab === "nutrition" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">Nutrition</span>
          </button>
          <button 
            onClick={() => handleTabClick("progress")}
            className={`flex flex-col items-center p-2 ${activeTab === "progress" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Progress</span>
          </button>
          <button 
            onClick={() => handleTabClick("profile")}
            className={`flex flex-col items-center p-2 ${activeTab === "profile" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
      <Toaster />
    </div>
  );
}

// Main export with all providers
export default function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <MockAuthProvider>
        <NoAuthApp />
      </MockAuthProvider>
    </QueryClientProvider>
  );
}