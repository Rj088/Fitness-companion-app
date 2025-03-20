import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";

/**
 * Hard-coded mock user data - no authentication needed
 */
const mockUser = {
  id: 999,
  username: "demo",
  firstName: "Demo",
  lastName: "User",
  height: 178,
  weight: 75,
  goalWeight: 70,
  age: 30,
  fitnessLevel: "intermediate",
  dailyCalorieGoal: 2200,
  dailyStepsGoal: 10000,
  workoutFrequency: 5,
  createdAt: new Date()
};

/**
 * Mock workouts data
 */
const mockWorkouts = [
  {
    id: 1,
    name: "Full Body Workout",
    description: "A complete full body workout to build strength and endurance",
    duration: 45,
    caloriesBurned: 350,
    difficulty: "intermediate",
    category: "strength",
    exercises: [
      { id: 1, name: "Push-ups", sets: 3, reps: 12 },
      { id: 2, name: "Squats", sets: 3, reps: 15 },
      { id: 3, name: "Dumbbell Rows", sets: 3, reps: 10 }
    ]
  },
  {
    id: 2,
    name: "HIIT Cardio",
    description: "High intensity interval training to boost your cardio",
    duration: 30,
    caloriesBurned: 400,
    difficulty: "advanced",
    category: "cardio",
    exercises: [
      { id: 4, name: "Jumping Jacks", duration: 45 },
      { id: 5, name: "Mountain Climbers", duration: 45 },
      { id: 6, name: "Burpees", duration: 45 }
    ]
  }
];

/**
 * Mock meals data
 */
const mockMeals = [
  {
    id: 1,
    userId: 999,
    date: new Date(),
    mealType: "breakfast",
    foodId: 1,
    servings: 1,
    food: {
      id: 1,
      name: "Oatmeal with Berries",
      calories: 350,
      protein: 12,
      carbs: 60,
      fat: 7,
      servingSize: "1 bowl"
    }
  },
  {
    id: 2,
    userId: 999,
    date: new Date(),
    mealType: "lunch",
    foodId: 2,
    servings: 1,
    food: {
      id: 2,
      name: "Chicken Salad",
      calories: 450,
      protein: 40,
      carbs: 15,
      fat: 20,
      servingSize: "1 plate"
    }
  }
];

/**
 * Mock activities data
 */
const mockActivities = {
  id: 1,
  userId: 999,
  date: new Date(),
  steps: 8500,
  caloriesBurned: 450,
  activeMinutes: 95
};

/**
 * DIRECT APP - No authentication needed
 * This component directly renders the app with mock data
 */
export default function DirectApp() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState("home");
  
  // Display a toast notification when the app loads
  useEffect(() => {
    toast({
      title: "Development Mode",
      description: "App loaded with mock data. No authentication required.",
    });
  }, [toast]);
  
  // Helper to render the current page
  const renderCurrentPage = () => {
    // Since we can't pass props directly to components that don't accept them,
    // we'll need to set up a global context or override hooks used by these components.
    // For now, we'll just render the components directly.
    switch (currentPage) {
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
  
  // Make the TabBar component work with our app
  // We'll modify it to accept the active tab and click handler
  const handleTabChange = (tab: string) => {
    setCurrentPage(tab);
    console.log("Changed to tab:", tab);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <StatusBar />
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="bg-blue-600 text-white p-2 text-center font-semibold">
          DEVELOPMENT MODE - Using mock data
        </div>
        {renderCurrentPage()}
      </div>
      <TabBar />
      <Toaster />
    </div>
  );
}