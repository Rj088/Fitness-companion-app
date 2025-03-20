import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Workout, UserWorkout } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuth } from "@/lib/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get all available workouts (optionally filtered by category)
export function useAllWorkouts(category?: string) {
  const endpoint = category 
    ? `${API_ENDPOINTS.WORKOUTS.LIST}?category=${category}` 
    : API_ENDPOINTS.WORKOUTS.LIST;
  
  return useQuery<Workout[]>({
    queryKey: [endpoint],
  });
}

// Get detailed workout by ID
export function useWorkout(workoutId?: number) {
  return useQuery<Workout>({
    queryKey: [API_ENDPOINTS.WORKOUTS.GET(workoutId || 0)],
    enabled: !!workoutId,
  });
}

// Get user workouts with optional date filter
export function useWorkouts(options?: { date?: string }) {
  const { user } = useAuth();
  // Use a default user ID (1) if no user is authenticated
  const userId = user?.id || 1;
  
  let endpoint = API_ENDPOINTS.WORKOUTS.USER(userId);
  if (options?.date) {
    endpoint = `${endpoint}?date=${options.date}`;
  }
  
  return useQuery<UserWorkout[]>({
    queryKey: [endpoint],
    // Always enabled regardless of user authentication
    enabled: true,
  });
}

// Start a workout
export function useStartWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ workoutId, date = new Date() }: { workoutId: number, date?: Date }) => {
      // Use default user ID (1) if no user is authenticated
      const userId = user?.id || 1;
      
      const payload = {
        workoutId,
        date,
        completed: false
      };
      
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.WORKOUTS.USER(userId), 
        payload
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Use the same default user ID for consistency
      const userId = user?.id || 1;
      // Invalidate user workouts queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.WORKOUTS.USER(userId)] 
      });
      
      toast({
        title: "Workout started",
        description: `You started ${data.workout.name}`
      });
      
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Could not start workout",
        description: error.message || "Failed to start workout",
        variant: "destructive"
      });
    }
  });
}

// Complete a workout
export function useCompleteWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (userWorkoutId: number) => {
      // No user check needed for completion as it works with the workout ID directly
      const response = await apiRequest(
        "PATCH", 
        API_ENDPOINTS.WORKOUTS.COMPLETE(userWorkoutId),
        {}
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Use the same default user ID for consistency
      const userId = user?.id || 1;
      // Invalidate user workouts and activities queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.WORKOUTS.USER(userId)] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.ACTIVITIES.LIST(userId)] 
      });
      
      toast({
        title: "Workout completed",
        description: `You completed ${data.workout.name}!`
      });
      
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Could not complete workout",
        description: error.message || "Failed to complete workout",
        variant: "destructive"
      });
    }
  });
}
