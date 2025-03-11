import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuth } from "@/lib/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get current user data
export function useUser() {
  const { user } = useAuth();
  
  return useQuery<User>({
    queryKey: [API_ENDPOINTS.USERS.GET(user?.id || 0)],
    enabled: !!user?.id,
  });
}

// Update user profile
export function useUpdateUser() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const response = await apiRequest(
        "PATCH", 
        API_ENDPOINTS.USERS.UPDATE(user.id), 
        userData
      );
      return response.json();
    },
    onSuccess: (updatedUser) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.USERS.GET(user?.id || 0)] 
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      return updatedUser;
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  });
}
