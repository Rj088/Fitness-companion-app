import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuth } from "@/lib/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get current user data
export function useUser() {
  const { user } = useAuth();
  // Use default user ID (1) if no user is authenticated
  const userId = user?.id || 1;
  
  return useQuery<User>({
    queryKey: [API_ENDPOINTS.USERS.GET(userId)],
    // Always enabled regardless of user authentication
    enabled: true,
  });
}

// Update user profile
export function useUpdateUser() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      // Use default user ID (1) if no user is authenticated
      const userId = user?.id || 1;
      
      const response = await apiRequest(
        "PATCH", 
        API_ENDPOINTS.USERS.UPDATE(userId), 
        userData
      );
      return response.json();
    },
    onSuccess: (updatedUser) => {
      // Use the same default user ID for consistency
      const userId = user?.id || 1;
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.USERS.GET(userId)] 
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
