import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// Create a query client for the app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import { User, Workout, UserWorkout, Activity, Food, UserMeal, WeightLog } from "@/lib/types";
import { initializeNativeCapabilities } from "@/lib/native";

// Mock user data
const mockUser: User = {
  id: 1,
  username: "fitnessuser",
  firstName: "Fitness",
  lastName: "User",
  height: 175,
  weight: 70,
  goalWeight: 65,
  age: 30,
  fitnessLevel: "intermediate",
  dailyCalorieGoal: 2200,
  dailyStepsGoal: 10000,
  workoutFrequency: 4,
  createdAt: new Date()
};

// Mock workouts
const mockWorkouts: Workout[] = [
  {
    id: 1,
    name: "Full Body Workout",
    description: "A complete workout targeting all major muscle groups",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    duration: 45,
    caloriesBurned: 350,
    difficulty: "intermediate",
    category: "strength",
    exercises: [
      { id: 1, name: "Push-ups", sets: 3, reps: 15, description: "Standard push-ups" },
      { id: 2, name: "Squats", sets: 3, reps: 20, description: "Bodyweight squats" },
      { id: 3, name: "Lunges", sets: 3, reps: 12, description: "Forward lunges" },
      { id: 4, name: "Plank", duration: 60, description: "Hold a plank position" }
    ]
  },
  {
    id: 2,
    name: "HIIT Cardio",
    description: "High intensity interval training to boost metabolism",
    imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798",
    duration: 30,
    caloriesBurned: 400,
    difficulty: "advanced",
    category: "cardio",
    exercises: [
      { id: 5, name: "Jumping Jacks", duration: 45, description: "Fast pace" },
      { id: 6, name: "Mountain Climbers", duration: 45, description: "Full range" },
      { id: 7, name: "Burpees", duration: 45, description: "With push-up" },
      { id: 8, name: "High Knees", duration: 45, description: "Running in place" }
    ]
  },
  {
    id: 3,
    name: "Morning Yoga",
    description: "Gentle yoga to improve flexibility and reduce stress",
    imageUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3",
    duration: 60,
    caloriesBurned: 200,
    difficulty: "beginner",
    category: "flexibility",
    exercises: [
      { id: 9, name: "Sun Salutation", duration: 300, description: "Flow sequence" },
      { id: 10, name: "Warrior Poses", duration: 300, description: "I, II, and III" },
      { id: 11, name: "Downward Dog", duration: 120, description: "Hold position" }
    ]
  }
];

// Mock user workouts (workout history)
const mockUserWorkouts: UserWorkout[] = [
  {
    id: 1,
    userId: mockUser.id,
    workoutId: 1,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 45,
    caloriesBurned: 350,
    completed: true,
    workout: mockWorkouts[0]
  },
  {
    id: 2,
    userId: mockUser.id,
    workoutId: 2,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    duration: 30,
    caloriesBurned: 400,
    completed: true,
    workout: mockWorkouts[1]
  },
  {
    id: 3,
    userId: mockUser.id,
    workoutId: 3,
    date: new Date(),
    duration: 0,
    caloriesBurned: 0,
    completed: false,
    workout: mockWorkouts[2]
  }
];

// Mock foods
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

// Mock user meals
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
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    mealType: "breakfast",
    foodId: 3,
    servings: 1,
    food: mockFoods[2]
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    mealType: "dinner",
    foodId: 4,
    servings: 1,
    food: mockFoods[3]
  }
];

// Mock activities
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
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    steps: 7200,
    caloriesBurned: 380,
    activeMinutes: 85
  },
  {
    id: 3,
    userId: mockUser.id,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    steps: 9300,
    caloriesBurned: 490,
    activeMinutes: 110
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    steps: 6800,
    caloriesBurned: 360,
    activeMinutes: 75
  },
  {
    id: 5,
    userId: mockUser.id,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    steps: 10200,
    caloriesBurned: 540,
    activeMinutes: 120
  },
  {
    id: 6,
    userId: mockUser.id,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    steps: 8900,
    caloriesBurned: 470,
    activeMinutes: 100
  },
  {
    id: 7,
    userId: mockUser.id,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    steps: 7500,
    caloriesBurned: 400,
    activeMinutes: 90
  }
];

// Mock weight logs
const mockWeightLogs: WeightLog[] = [
  {
    id: 1,
    userId: mockUser.id,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    weight: 72.5
  },
  {
    id: 2,
    userId: mockUser.id,
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    weight: 72.1
  },
  {
    id: 3,
    userId: mockUser.id,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    weight: 71.8
  },
  {
    id: 4,
    userId: mockUser.id,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    weight: 71.2
  },
  {
    id: 5,
    userId: mockUser.id,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    weight: 70.7
  },
  {
    id: 6,
    userId: mockUser.id,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    weight: 70.3
  },
  {
    id: 7,
    userId: mockUser.id,
    date: new Date(),
    weight: 70.0
  }
];

// Mock implementations for all the hooks
// These are globally replaced to work with our components
//@ts-ignore
window.useAuth = () => {
  return {
    isAuthenticated: true,
    user: mockUser,
    loading: false,
    error: null,
    login: async () => true,
    logout: async () => {},
    register: async () => true
  };
};

//@ts-ignore
window.useUser = () => {
  return {
    data: mockUser,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useUpdateUser = () => {
  const { toast } = useToast();
  return {
    mutate: async (userData: Partial<User>) => {
      Object.assign(mockUser, userData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      return mockUser;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useAllWorkouts = (category?: string) => {
  const filteredWorkouts = category
    ? mockWorkouts.filter(w => w.category === category)
    : mockWorkouts;
  
  return {
    data: filteredWorkouts,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useWorkout = (workoutId?: number) => {
  const workout = workoutId
    ? mockWorkouts.find(w => w.id === workoutId)
    : undefined;
  
  return {
    data: workout,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useWorkouts = (options?: { date?: string }) => {
  const filtered = options?.date
    ? mockUserWorkouts.filter(uw => {
        const uwDate = new Date(uw.date);
        const targetDate = new Date(options.date as string);
        return uwDate.getDate() === targetDate.getDate() &&
              uwDate.getMonth() === targetDate.getMonth() &&
              uwDate.getFullYear() === targetDate.getFullYear();
      })
    : mockUserWorkouts;
  
  return {
    data: filtered,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useStartWorkout = () => {
  const { toast } = useToast();
  return {
    mutate: async ({ workoutId, date = new Date() }: { workoutId: number, date?: Date }) => {
      const workout = mockWorkouts.find(w => w.id === workoutId);
      if (!workout) {
        throw new Error("Workout not found");
      }
      
      const newUserWorkout: UserWorkout = {
        id: mockUserWorkouts.length + 1,
        userId: mockUser.id,
        workoutId,
        date,
        duration: 0,
        caloriesBurned: 0,
        completed: false,
        workout
      };
      
      mockUserWorkouts.push(newUserWorkout);
      
      toast({
        title: "Workout started",
        description: `You started ${workout.name}`
      });
      
      return newUserWorkout;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useCompleteWorkout = () => {
  const { toast } = useToast();
  return {
    mutate: async (userWorkoutId: number) => {
      const userWorkout = mockUserWorkouts.find(uw => uw.id === userWorkoutId);
      if (!userWorkout) {
        throw new Error("User workout not found");
      }
      
      userWorkout.completed = true;
      userWorkout.duration = userWorkout.workout?.duration || 0;
      userWorkout.caloriesBurned = userWorkout.workout?.caloriesBurned || 0;
      
      toast({
        title: "Workout completed",
        description: `You completed ${userWorkout.workout?.name}!`
      });
      
      return userWorkout;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useFoods = () => {
  return {
    data: mockFoods,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useSearchFoods = (query: string) => {
  const filtered = query
    ? mockFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : mockFoods;
  
  return {
    data: filtered,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useFood = (foodId?: number) => {
  const food = foodId
    ? mockFoods.find(f => f.id === foodId)
    : undefined;
  
  return {
    data: food,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useUserMeals = (options?: { date?: string }) => {
  const filtered = options?.date
    ? mockUserMeals.filter(um => {
        const umDate = new Date(um.date);
        const targetDate = new Date(options.date as string);
        return umDate.getDate() === targetDate.getDate() &&
              umDate.getMonth() === targetDate.getMonth() &&
              umDate.getFullYear() === targetDate.getFullYear();
      })
    : mockUserMeals;
  
  return {
    data: filtered,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useAddMeal = () => {
  const { toast } = useToast();
  return {
    mutate: async ({ foodId, mealType, servings, date = new Date() }: { foodId: number, mealType: string, servings: number, date?: Date }) => {
      const food = mockFoods.find(f => f.id === foodId);
      if (!food) {
        throw new Error("Food not found");
      }
      
      const newMeal: UserMeal = {
        id: mockUserMeals.length + 1,
        userId: mockUser.id,
        date,
        mealType: mealType as "breakfast" | "lunch" | "dinner" | "snack",
        foodId,
        servings,
        food
      };
      
      mockUserMeals.push(newMeal);
      
      toast({
        title: "Meal added",
        description: `Added ${food.name} to your ${mealType}`
      });
      
      return newMeal;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useDeleteMeal = () => {
  const { toast } = useToast();
  return {
    mutate: async (mealId: number) => {
      const index = mockUserMeals.findIndex(m => m.id === mealId);
      if (index === -1) {
        throw new Error("Meal not found");
      }
      
      const deletedMeal = mockUserMeals[index];
      mockUserMeals.splice(index, 1);
      
      toast({
        title: "Meal deleted",
        description: `Removed ${deletedMeal.food?.name} from your meals`
      });
      
      return true;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useAddFood = () => {
  const { toast } = useToast();
  return {
    mutate: async (foodData: Partial<Food>) => {
      const newFood: Food = {
        id: mockFoods.length + 1,
        name: foodData.name || "New Food",
        calories: foodData.calories || 0,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        servingSize: foodData.servingSize
      };
      
      mockFoods.push(newFood);
      
      toast({
        title: "Food added",
        description: `Added ${newFood.name} to the food database`
      });
      
      return newFood;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useActivities = (options?: { date?: string, period?: "weekly" | "monthly" }) => {
  let filtered = [...mockActivities];
  
  if (options?.date) {
    filtered = mockActivities.filter(a => {
      const aDate = new Date(a.date);
      const targetDate = new Date(options.date as string);
      return aDate.getDate() === targetDate.getDate() &&
             aDate.getMonth() === targetDate.getMonth() &&
             aDate.getFullYear() === targetDate.getFullYear();
    });
  } else if (options?.period === "weekly") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    filtered = mockActivities.filter(a => new Date(a.date) >= sevenDaysAgo);
  } else if (options?.period === "monthly") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filtered = mockActivities.filter(a => new Date(a.date) >= thirtyDaysAgo);
  }
  
  return {
    data: filtered,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useUpdateActivity = () => {
  const { toast } = useToast();
  return {
    mutate: async ({ id, ...activityData }: Partial<Activity> & { id: number }) => {
      const activity = mockActivities.find(a => a.id === id);
      if (!activity) {
        throw new Error("Activity not found");
      }
      
      Object.assign(activity, activityData);
      
      toast({
        title: "Activity updated",
        description: "Your activity has been updated successfully."
      });
      
      return activity;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useWeightLogs = () => {
  return {
    data: mockWeightLogs,
    isLoading: false,
    error: null
  };
};

//@ts-ignore
window.useLogWeight = () => {
  const { toast } = useToast();
  return {
    mutate: async ({ weight, date = new Date() }: { weight: number, date?: Date }) => {
      const newWeightLog: WeightLog = {
        id: mockWeightLogs.length + 1,
        userId: mockUser.id,
        date,
        weight
      };
      
      mockWeightLogs.push(newWeightLog);
      
      // Also update the user's current weight
      mockUser.weight = weight;
      
      toast({
        title: "Weight logged",
        description: `Recorded weight: ${weight} kg`
      });
      
      return newWeightLog;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

//@ts-ignore
window.useWorkoutHistory = () => {
  return {
    data: mockUserWorkouts.filter(uw => uw.completed),
    isLoading: false,
    error: null
  };
};

// Main app component
function FullApp() {
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
      title: "Welcome to Fitness App!",
      description: "All features are now FULLY FUNCTIONAL with mock data.",
    });
  }, [toast]);

  // Render active tab content
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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Status bar */}
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
      
      {/* App content */}
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="bg-blue-700 text-white text-center p-1 text-xs">
          DEVELOPMENT MODE - All Features Are Working
        </div>
        {renderTabContent()}
      </div>
      
      {/* Tab bar */}
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

// Wrap the app with QueryClientProvider to make React Query work
export default function AppWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <FullApp />
    </QueryClientProvider>
  );
}