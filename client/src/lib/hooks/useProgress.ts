import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, WeightLog, UserWorkout } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuth } from "@/lib/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get user activities with optional date filter
export function useActivities(options?: { date?: string, period?: "weekly" | "monthly" }) {
  const { user } = useAuth();
  
  let endpoint = API_ENDPOINTS.ACTIVITIES.LIST(user?.id || 0);
  if (options?.date) {
    endpoint = API_ENDPOINTS.ACTIVITIES.GET(user?.id || 0, options.date);
  }
  
  // If no specific date and a period is provided, we'll handle that client-side
  // by fetching all activities and filtering them
  return useQuery<Activity | Activity[]>({
    queryKey: [endpoint],
    enabled: !!user?.id,
  });
}

// Update daily activity
export function useUpdateActivity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (activityData: Partial<Activity> & { date: string | Date }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const payload = {
        ...activityData,
        userId: user.id
      };
      
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.ACTIVITIES.CREATE(user.id), 
        payload
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate activity queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.ACTIVITIES.LIST(user?.id || 0)] 
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
  
  return useQuery<WeightLog[]>({
    queryKey: [API_ENDPOINTS.WEIGHT.LIST(user?.id || 0)],
    enabled: !!user?.id,
  });
}

// Log new weight
export function useLogWeight() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ weight, date = new Date() }: { weight: number, date?: Date }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const payload = {
        weight, // in kg
        date
      };
      
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.WEIGHT.CREATE(user.id), 
        payload
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate weight logs and user data
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.WEIGHT.LIST(user?.id || 0)] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.USERS.GET(user?.id || 0)] 
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
  
  return useQuery<UserWorkout[]>({
    queryKey: [API_ENDPOINTS.WORKOUTS.USER(user?.id || 0)],
    enabled: !!user?.id,
  });
}
