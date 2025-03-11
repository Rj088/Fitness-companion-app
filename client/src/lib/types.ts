// User types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
  height?: number; // in cm
  weight?: number; // in kg
  goalWeight?: number; // in kg
  age?: number;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  dailyCalorieGoal?: number;
  dailyStepsGoal: number;
  workoutFrequency: number; // workouts per week
  createdAt: Date;
}

// Exercise type
export interface Exercise {
  id: number;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  description?: string;
}

// Workout types
export interface Workout {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  duration: number; // in minutes
  caloriesBurned?: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "strength" | "cardio" | "flexibility" | "hiit";
  exercises: Exercise[];
}

export interface UserWorkout {
  id: number;
  userId: number;
  workoutId: number;
  date: Date;
  duration?: number; // in minutes
  caloriesBurned?: number;
  completed: boolean;
  workout?: Workout; // Populated when fetching from API
}

// Food and meal types
export interface Food {
  id: number;
  name: string;
  calories: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
  servingSize?: string;
}

export interface UserMeal {
  id: number;
  userId: number;
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodId: number;
  servings: number;
  food?: Food; // Populated when fetching from API
}

// Activity and weight tracking types
export interface Activity {
  id: number;
  userId: number;
  date: Date | string;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
}

export interface WeightLog {
  id: number;
  userId: number;
  date: Date;
  weight: number; // in kg
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  height?: number;
  weight?: number;
  age?: number;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
}
