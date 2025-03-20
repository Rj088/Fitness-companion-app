import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import { User, Workout, UserWorkout, UserMeal, Activity, WeightLog, Food } from "@/lib/types";
import { initializeNativeCapabilities } from "@/lib/native";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

// Create a mock user
const mockUser: User = {
  id: 1,
  username: "fitnessuser",
  firstName: "Fitness",
  lastName: "User",
  height: 175, // cm
  weight: 70, // kg
  goalWeight: 65, // kg
  age: 30,
  fitnessLevel: "intermediate",
  dailyCalorieGoal: 2200,
  dailyStepsGoal: 10000,
  workoutFrequency: 4, // workouts per week
  createdAt: new Date()
};

// Create mock workouts
const mockWorkouts: Workout[] = [
  {
    id: 1,
    name: "Full Body Strength",
    description: "A complete workout targeting all major muscle groups",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    duration: 45,
    caloriesBurned: 350,
    difficulty: "intermediate",
    category: "strength",
    exercises: [
      { id: 1, name: "Push-ups", sets: 3, reps: 15, description: "Regular push-ups with proper form" },
      { id: 2, name: "Squats", sets: 3, reps: 20, description: "Bodyweight squats" },
      { id: 3, name: "Lunges", sets: 3, reps: 12, description: "Forward lunges, alternating legs" },
      { id: 4, name: "Plank", duration: 60, description: "Hold a plank position" }
    ]
  },
  {
    id: 2,
    name: "HIIT Cardio",
    description: "High intensity interval training to boost your metabolism",
    imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798",
    duration: 30,
    caloriesBurned: 400,
    difficulty: "advanced",
    category: "cardio",
    exercises: [
      { id: 5, name: "Jumping Jacks", duration: 45, description: "Full range of motion" },
      { id: 6, name: "Mountain Climbers", duration: 45, description: "Fast pace" },
      { id: 7, name: "Burpees", duration: 45, description: "Full burpees with push-up" },
      { id: 8, name: "High Knees", duration: 45, description: "Running in place with high knees" }
    ]
  },
  {
    id: 3,
    name: "Morning Yoga",
    description: "Gentle yoga flow to improve flexibility and reduce stress",
    imageUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3",
    duration: 60,
    caloriesBurned: 200,
    difficulty: "beginner",
    category: "flexibility",
    exercises: [
      { id: 9, name: "Sun Salutation", duration: 300, description: "Flow through sun salutation sequence" },
      { id: 10, name: "Warrior Poses", duration: 300, description: "Warrior I, II, and III" },
      { id: 11, name: "Downward Dog", duration: 120, description: "Hold downward facing dog pose" }
    ]
  }
];

// Create mock user workouts (workout history)
const mockUserWorkouts: UserWorkout[] = [
  {
    id: 1,
    userId: mockUser.id,
    workoutId: 1,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    duration: 45,
    caloriesBurned: 350,
    completed: true,
    workout: mockWorkouts[0]
  },
  {
    id: 2,
    userId: mockUser.id,
    workoutId: 2,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
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
    duration: 0,
    caloriesBurned: 0,
    completed: false,
    workout: mockWorkouts[2]
  }
];

// Create mock foods
const mockFoods: Food[] = [
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

// Create mock user meals (meal history)
const mockUserMeals: UserMeal[] = [
  {
    id: 1,
    userId: mockUser.id,
    date: new Date(),
    mealType: "breakfast",
    foodId: 1,
    servings: 1,
    food: mockFoods[0]
  },
  {
    id: 2,
    userId: mockUser.id,
    date: new Date(),
    mealType: "lunch",
    foodId: 2,
    servings: 1,
    food: mockFoods[1]
  },
  {
    id: 3,
    userId: mockUser.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    mealType: "breakfast",
    foodId: 3,
    servings: 1,
    food: mockFoods[2]
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    mealType: "dinner",
    foodId: 4,
    servings: 1,
    food: mockFoods[3]
  }
];

// Create mock activity data
const mockActivities: Activity[] = [
  {
    id: 1,
    userId: mockUser.id,
    date: new Date().toISOString(),
    steps: 8500,
    caloriesBurned: 450,
    activeMinutes: 95
  },
  {
    id: 2,
    userId: mockUser.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    steps: 7200,
    caloriesBurned: 380,
    activeMinutes: 85
  },
  {
    id: 3,
    userId: mockUser.id,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    steps: 9300,
    caloriesBurned: 490,
    activeMinutes: 110
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    steps: 6800,
    caloriesBurned: 360,
    activeMinutes: 75
  },
  {
    id: 5,
    userId: mockUser.id,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    steps: 10200,
    caloriesBurned: 540,
    activeMinutes: 120
  },
  {
    id: 6,
    userId: mockUser.id,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    steps: 8900,
    caloriesBurned: 470,
    activeMinutes: 100
  },
  {
    id: 7,
    userId: mockUser.id,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    steps: 7500,
    caloriesBurned: 400,
    activeMinutes: 90
  }
];

// Create mock weight logs
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
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    weight: 72.1
  },
  {
    id: 3,
    userId: mockUser.id,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    weight: 71.8
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    weight: 71.2
  },
  {
    id: 5,
    userId: mockUser.id,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    weight: 70.7
  },
  {
    id: 6,
    userId: mockUser.id,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    weight: 70.3
  },
  {
    id: 7,
    userId: mockUser.id,
    date: new Date(), // Today
    weight: 70.0
  }
];

// Create context for storing mock data
interface MockContextType {
  user: User;
  workouts: Workout[];
  userWorkouts: UserWorkout[];
  foods: Food[];
  userMeals: UserMeal[];
  activities: Activity[];
  weightLogs: WeightLog[];
  // Mock API functions
  getUserById: (id: number) => Promise<User>;
  getWorkouts: () => Promise<Workout[]>;
  getUserWorkouts: (userId: number) => Promise<UserWorkout[]>;
  getFoods: () => Promise<Food[]>;
  getUserMeals: (userId: number) => Promise<UserMeal[]>;
  getUserActivities: (userId: number) => Promise<Activity[]>;
  getUserWeightLogs: (userId: number) => Promise<WeightLog[]>;
  completeWorkout: (id: number) => Promise<UserWorkout>;
  addUserMeal: (meal: Partial<UserMeal>) => Promise<UserMeal>;
  addWeightLog: (log: Partial<WeightLog>) => Promise<WeightLog>;
  updateUser: (id: number, userData: Partial<User>) => Promise<User>;
}

// Create context
const MockContext = createContext<MockContextType | null>(null);

// Create provider component
const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provide mock data and API functions
  const value: MockContextType = {
    // Data
    user: mockUser,
    workouts: mockWorkouts,
    userWorkouts: mockUserWorkouts,
    foods: mockFoods,
    userMeals: mockUserMeals,
    activities: mockActivities,
    weightLogs: mockWeightLogs,
    
    // Mock API functions
    getUserById: async (id) => {
      return mockUser;
    },
    getWorkouts: async () => {
      return mockWorkouts;
    },
    getUserWorkouts: async (userId) => {
      return mockUserWorkouts;
    },
    getFoods: async () => {
      return mockFoods;
    },
    getUserMeals: async (userId) => {
      return mockUserMeals;
    },
    getUserActivities: async (userId) => {
      return mockActivities;
    },
    getUserWeightLogs: async (userId) => {
      return mockWeightLogs;
    },
    completeWorkout: async (id) => {
      const workout = mockUserWorkouts.find(w => w.id === id);
      if (!workout) {
        throw new Error(`Workout with id ${id} not found`);
      }
      workout.completed = true;
      workout.duration = workout.workout?.duration || 0;
      workout.caloriesBurned = workout.workout?.caloriesBurned || 0;
      return workout;
    },
    addUserMeal: async (meal) => {
      const newMeal: UserMeal = {
        id: mockUserMeals.length + 1,
        userId: mockUser.id,
        date: meal.date || new Date(),
        mealType: meal.mealType || "snack",
        foodId: meal.foodId || 1,
        servings: meal.servings || 1,
        food: meal.food || mockFoods[0]
      };
      mockUserMeals.push(newMeal);
      return newMeal;
    },
    addWeightLog: async (log) => {
      const newLog: WeightLog = {
        id: mockWeightLogs.length + 1,
        userId: mockUser.id,
        date: log.date || new Date(),
        weight: log.weight || mockUser.weight || 70 // Provide a default weight
      };
      mockWeightLogs.push(newLog);
      return newLog;
    },
    updateUser: async (id, userData) => {
      Object.assign(mockUser, userData);
      return mockUser;
    }
  };

  return (
    <MockContext.Provider value={value}>
      {children}
    </MockContext.Provider>
  );
};

// Create hook for using the mock data
export const useMockData = () => {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error("useMockData must be used within a MockProvider");
  }
  return context;
};

// Create fake auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Create auth provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: true,
    user: mockUser,
    loading: false,
    error: null
  });

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

// Create hook for auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Instead of patching the window object, we'll export hooks that can replace the real ones
export const useAllWorkouts = (category?: string) => {
  const { workouts } = useMockData();
  return {
    data: category ? workouts.filter(w => w.category === category) : workouts,
    isLoading: false,
    error: null
  };
};

export const useWorkout = (workoutId?: number) => {
  const { workouts } = useMockData();
  return {
    data: workoutId ? workouts.find(w => w.id === workoutId) : undefined,
    isLoading: false,
    error: null
  };
};

export const useWorkouts = (options?: { date?: string }) => {
  const { userWorkouts } = useMockData();
  const filtered = options?.date
    ? userWorkouts.filter(uw => {
        const uwDate = new Date(uw.date);
        const targetDate = new Date(options.date as string);
        return uwDate.getDate() === targetDate.getDate() &&
               uwDate.getMonth() === targetDate.getMonth() &&
               uwDate.getFullYear() === targetDate.getFullYear();
      })
    : userWorkouts;
  
  return {
    data: filtered,
    isLoading: false,
    error: null
  };
};

export const useActivities = (options?: { date?: string, period?: "weekly" | "monthly" }) => {
  const { activities } = useMockData();
  
  return {
    data: activities,
    isLoading: false,
    error: null
  };
};

export const useUserMeals = (options?: { date?: string }) => {
  const { userMeals } = useMockData();
  const filtered = options?.date
    ? userMeals.filter(um => {
        const umDate = new Date(um.date);
        const targetDate = new Date(options.date as string);
        return umDate.getDate() === targetDate.getDate() &&
               umDate.getMonth() === targetDate.getMonth() &&
               umDate.getFullYear() === targetDate.getFullYear();
      })
    : userMeals;
  
  return {
    data: filtered,
    isLoading: false,
    error: null
  };
};

// Create a tabbed interface for the app
function MockApp() {
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();
  
  // Initialize
  useEffect(() => {
    initializeNativeCapabilities().catch((error: Error) => {
      console.error("Failed to initialize native capabilities:", error);
    });
    
    toast({
      title: "Welcome to Fitness App!",
      description: "Using mock data for development. All buttons are functional.",
    });
  }, [toast]);

  // Render the current tab
  const renderCurrentTab = () => {
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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-blue-600 text-white p-2">
        <div className="flex justify-between items-center">
          <div className="text-sm">9:41 AM</div>
          <div className="flex space-x-1">
            <div className="w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 10a6 6 0 00-6-6M18 10a6 6 0 01-6 6m6-6H4" />
              </svg>
            </div>
            <div className="w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="text-sm">100%</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="bg-blue-700 text-white text-center p-1 text-xs">
          DEVELOPMENT MODE - All Features Are Working
        </div>
        {renderCurrentTab()}
      </div>
      
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-2">
        <div className="grid grid-cols-5">
          <button 
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center ${activeTab === "home" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("workouts")}
            className={`flex flex-col items-center ${activeTab === "workouts" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-xs">Workouts</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("nutrition")}
            className={`flex flex-col items-center ${activeTab === "nutrition" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">Nutrition</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("progress")}
            className={`flex flex-col items-center ${activeTab === "progress" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Progress</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center ${activeTab === "profile" ? "text-blue-600" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

// Create a wrapped app with all providers
export default function MockAppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MockProvider>
          <MockApp />
        </MockProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}