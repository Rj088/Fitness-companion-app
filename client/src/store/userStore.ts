// Simple global user store to use in web and iOS
import { User } from "@/lib/types";

// Default user data
const defaultUser: User = {
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

// Global user state that persists across components
let currentUser: User = {...defaultUser};

// Simple user store for both web and native
const userStore = {
  // Get current user
  getUser: (): User => {
    return currentUser;
  },
  
  // Update user data
  updateUser: (userData: Partial<User>): User => {
    currentUser = {...currentUser, ...userData};
    // Save to local storage for web
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('fitness_user', JSON.stringify(currentUser));
    }
    return currentUser;
  },
  
  // Load user from storage (web) or props (native)
  loadUser: (user?: User): User => {
    if (user) {
      currentUser = user;
      return currentUser;
    }
    
    // Try loading from storage on web
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('fitness_user');
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
          // Fix dates (they come as strings from JSON)
          if (typeof currentUser.createdAt === 'string') {
            currentUser.createdAt = new Date(currentUser.createdAt);
          }
        } catch (e) {
          console.error('Failed to parse stored user:', e);
        }
      }
    }
    
    return currentUser;
  },
  
  // Reset to default
  resetUser: (): User => {
    currentUser = {...defaultUser};
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('fitness_user');
    }
    return currentUser;
  }
};

// Initialize on load
userStore.loadUser();

export default userStore;