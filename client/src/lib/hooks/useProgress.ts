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
  });
}
