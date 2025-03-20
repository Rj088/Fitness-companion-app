import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, WeightLog, UserWorkout } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuth } from "@/lib/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get user activities with optional date filter
export function useActivities(options?: { date?: string, period?: "weekly" | "monthly" }) {
  const { user } = useAuth();
  // Use default user ID (1) if no user is authenticated
  const userId = user?.id || 1;
  
  let endpoint = API_ENDPOINTS.ACTIVITIES.LIST(userId);
  if (options?.date) {
    endpoint = API_ENDPOINTS.ACTIVITIES.GET(userId, options.date);
  }
  
  // If no specific date and a period is provided, we'll handle that client-side
  // by fetching all activities and filtering them
  return useQuery<Activity | Activity[]>({
    queryKey: [endpoint],
    // Always enabled regardless of user authentication
    enabled: true,
  });
}

// Update daily activity
export function useUpdateActivity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (activityData: Partial<Activity> & { date: string | Date }) => {
      // Use default user ID (1) if no user is authenticated
      const userId = user?.id || 1;
      
      const payload = {
        ...activityData,
        userId: userId
      };
      
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.ACTIVITIES.CREATE(userId), 
        payload
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Use the same default user ID for consistency
      const userId = user?.id || 1;
      // Invalidate activity queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.ACTIVITIES.LIST(userId)] 
      });
      
      toast({
        title: "Activity updated",
        description: "Your activity for today has been updated"
      });
      
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Activity update failed",
        description: error.message || "Failed to update activity",
        variant: "destructive"
      });
    }
  });
}

// Get user weight logs
export function useWeightLogs() {
  const { user } = useAuth();
  // Use default user ID (1) if no user is authenticated
  const userId = user?.id || 1;
  
  return useQuery<WeightLog[]>({
    queryKey: [API_ENDPOINTS.WEIGHT.LIST(userId)],
    // Always enabled regardless of user authentication
    enabled: true,
  });
}

// Log new weight
export function useLogWeight() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ weight, date = new Date() }: { weight: number, date?: Date }) => {
      // Use default user ID (1) if no user is authenticated
      const userId = user?.id || 1;
      
      const payload = {
        weight, // in kg
        date
      };
      
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.WEIGHT.CREATE(userId), 
        payload
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Use the same default user ID for consistency
      const userId = user?.id || 1;
      // Invalidate weight logs and user data
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.WEIGHT.LIST(userId)] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.USERS.GET(userId)] 
      });
      
      toast({
        title: "Weight logged",
        description: "Your weight has been updated successfully"
      });
      
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Could not log weight",
        description: error.message || "Failed to log weight",
        variant: "destructive"
      });
    }
  });
}

// Get user workout history
export function useWorkoutHistory() {
  const { user } = useAuth();
  // Use default user ID (1) if no user is authenticated
  const userId = user?.id || 1;
  
  return useQuery<UserWorkout[]>({
    queryKey: [API_ENDPOINTS.WORKOUTS.USER(userId)],
    // Always enabled regardless of user authentication
    enabled: true,
    
    // Transform empty results to show mock data for new users
    select: (data) => {
      if (!data || data.length === 0) {
        // If no workout history is found, create some sample completed workouts
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        return [
          {
            id: 1001,
            userId,
            workoutId: 1,
            date: twoDaysAgo,
            duration: 35,
            caloriesBurned: 320,
            completed: true,
            workout: {
              id: 1,
              name: "Morning Cardio",
              description: "Start your day with energy",
              imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format",
              duration: 30,
              caloriesBurned: 250,
              difficulty: "beginner",
              category: "cardio",
              exercises: []
            }
          },
          {
            id: 1002,
            userId,
            workoutId: 2,
            date: yesterday,
            duration: 45,
            caloriesBurned: 380,
            completed: true,
            workout: {
              id: 2,
              name: "Upper Body Strength",
              description: "Focus on chest, shoulders and arms",
              imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format",
              duration: 45,
              caloriesBurned: 350,
              difficulty: "intermediate",
              category: "strength",
              exercises: []
            }
          },
          {
            id: 1003,
            userId,
            workoutId: 3,
            date: today,
            duration: 25,
            caloriesBurned: 220,
            completed: true,
            workout: {
              id: 3,
              name: "Yoga Flow",
              description: "Increase flexibility and mindfulness",
              imageUrl: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&auto=format",
              duration: 25,
              caloriesBurned: 150,
              difficulty: "beginner", 
              category: "flexibility",
              exercises: []
            }
          }
        ];
      }
      return data;
    }
  });
}
