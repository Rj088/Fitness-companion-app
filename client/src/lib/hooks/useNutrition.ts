import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Food, UserMeal } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuth } from "@/lib/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get all available foods
export function useFoods() {
  return useQuery<Food[]>({
    queryKey: [API_ENDPOINTS.FOODS.LIST],
  });
}

// Search foods by name
export function useSearchFoods(query: string) {
  return useQuery<Food[]>({
    queryKey: [API_ENDPOINTS.FOODS.SEARCH(query)],
    enabled: query.length > 0,
  });
}

// Get food details
export function useFood(foodId?: number) {
  return useQuery<Food>({
    queryKey: [API_ENDPOINTS.FOODS.GET(foodId || 0)],
    enabled: !!foodId,
  });
}

// Get user meals with optional date filter
export function useUserMeals(options?: { date?: string }) {
  const { user } = useAuth();
  // Use default user ID (1) if no user is authenticated
  const userId = user?.id || 1;
  
  let endpoint = API_ENDPOINTS.MEALS.LIST(userId);
  if (options?.date) {
    endpoint = `${endpoint}?date=${options.date}`;
  }
  
  return useQuery<UserMeal[]>({
    queryKey: [endpoint],
    // Always enabled regardless of user authentication
    enabled: true,
  });
}

// Add a meal
export function useAddMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (payload: { 
      foodId: number, 
      servings: number, 
      mealType: "breakfast" | "lunch" | "dinner" | "snack",
      date?: Date 
    }) => {
      // Use default user ID (1) if no user is authenticated
      const userId = user?.id || 1;
      
      const mealData = {
        ...payload,
        date: payload.date || new Date(),
      };
      
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.MEALS.CREATE(userId), 
        mealData
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Use the same default user ID for consistency
      const userId = user?.id || 1;
      // Invalidate user meals queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.MEALS.LIST(userId)] 
      });
      
      toast({
        title: "Meal added",
        description: `${data.food.name} added to your daily log`
      });
      
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Could not add meal",
        description: error.message || "Failed to add meal to log",
        variant: "destructive"
      });
    }
  });
}

// Delete a meal
export function useDeleteMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (mealId: number) => {
      const response = await apiRequest(
        "DELETE", 
        API_ENDPOINTS.MEALS.DELETE(mealId),
        null
      );
      return response.status === 204; // No content response
    },
    onSuccess: () => {
      // Invalidate user meals queries
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.MEALS.LIST(user?.id || 0)] 
      });
      
      toast({
        title: "Meal deleted",
        description: "The meal has been removed from your log"
      });
      
      return true;
    },
    onError: (error: Error) => {
      toast({
        title: "Could not delete meal",
        description: error.message || "Failed to delete meal",
        variant: "destructive"
      });
    }
  });
}

// Add a new food item to the database
export function useAddFood() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (foodData: Omit<Food, 'id'>) => {
      const response = await apiRequest(
        "POST", 
        API_ENDPOINTS.FOODS.LIST, 
        foodData
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate foods query
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.FOODS.LIST] 
      });
      
      toast({
        title: "Food added",
        description: `${data.name} has been added to the database`
      });
      
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Could not add food",
        description: error.message || "Failed to add food to database",
        variant: "destructive"
      });
    }
  });
}
