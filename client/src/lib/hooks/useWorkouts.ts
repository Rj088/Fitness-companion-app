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
  
  let endpoint = API_ENDPOINTS.WORKOUTS.USER(user?.id || 0);
  if (options?.date) {
    endpoint = `${endpoint}?date=${options.date}`;
  }
  
  return useQuery<UserWorkout[]>({
    queryKey: [endpoint],
    enabled: !!user?.id,
  });
}

// Start a workout
export function useStartWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ workoutId, date = new Date() }: { workoutId: number, date?: Date }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const payload = {
        workoutId,
        date,
        completed: false
      };
      
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.WORKOUTS.USER(user.id), 
        payload
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate user workouts queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.WORKOUTS.USER(user?.id || 0)] 
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
      const response = await apiRequest(
        "PATCH", 
        API_ENDPOINTS.WORKOUTS.COMPLETE(userWorkoutId),
        {}
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate user workouts and activities queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.WORKOUTS.USER(user?.id || 0)] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.ACTIVITIES.LIST(user?.id || 0)] 
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
