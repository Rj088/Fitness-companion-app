
import { useState } from "react";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Food {
  id: number;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
}

interface MealPlan {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: {
    name: string;
    time: string;
    foods: Food[];
  }[];
}

interface AINutritionRecommendationProps {
  user?: User | null;
  isLoading?: boolean;
}

export default function AINutritionRecommendation({ 
  user, 
  isLoading = false 
}: AINutritionRecommendationProps) {
  const { toast } = useToast();
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [dietPreference, setDietPreference] = useState("");
  const [allergies, setAllergies] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<MealPlan | null>(null);

  // Sample meal plan for demonstration
  const sampleMealPlan: MealPlan = {
    id: 1,
    name: "Balanced Nutrition Plan",
    description: "A balanced meal plan designed to support your fitness goals with proper macronutrient distribution.",
    calories: 2200,
    protein: 130,
    carbs: 220,
    fat: 73,
    meals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        foods: [
          { id: 1, name: "Greek Yogurt", servingSize: "1 cup", calories: 150, protein: 20, carbs: 8, fat: 4 },
          { id: 2, name: "Blueberries", servingSize: "1/2 cup", calories: 40, protein: 0, carbs: 10, fat: 0 },
          { id: 3, name: "Granola", servingSize: "1/4 cup", calories: 120, protein: 3, carbs: 20, fat: 5 }
        ]
      },
      {
        name: "Lunch",
        time: "12:30 PM",
        foods: [
          { id: 4, name: "Grilled Chicken Breast", servingSize: "5 oz", calories: 165, protein: 31, carbs: 0, fat: 3.5 },
          { id: 5, name: "Brown Rice", servingSize: "1 cup", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
          { id: 6, name: "Broccoli", servingSize: "1 cup", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 }
        ]
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        foods: [
          { id: 7, name: "Salmon Fillet", servingSize: "4 oz", calories: 233, protein: 23, carbs: 0, fat: 15 },
          { id: 8, name: "Sweet Potato", servingSize: "1 medium", calories: 103, protein: 2, carbs: 24, fat: 0 },
          { id: 9, name: "Mixed Salad", servingSize: "2 cups", calories: 15, protein: 1, carbs: 3, fat: 0 }
        ]
      },
      {
        name: "Snacks",
        time: "Various",
        foods: [
          { id: 10, name: "Apple", servingSize: "1 medium", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
          { id: 11, name: "Almonds", servingSize: "1 oz (23 nuts)", calories: 164, protein: 6, carbs: 6, fat: 14 }
        ]
      }
    ]
  };
  
  const generateMealPlan = async () => {
    if (!user) {
      toast({
        title: "User profile required",
        description: "Please complete your profile to get personalized recommendations",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set sample meal plan with modifications based on user inputs
      const modifiedPlan = {...sampleMealPlan};
      
      if (dietPreference.includes("vegan")) {
        modifiedPlan.name = "Vegan Nutrition Plan";
        modifiedPlan.meals[0].foods[0].name = "Soy Yogurt";
        modifiedPlan.meals[1].foods[0].name = "Tofu";
        modifiedPlan.meals[2].foods[0].name = "Lentil Patty";
      } else if (dietPreference.includes("keto")) {
        modifiedPlan.name = "Keto Nutrition Plan";
        modifiedPlan.meals[0].foods[2].name = "Nuts";
        modifiedPlan.meals[1].foods[1].name = "Cauliflower Rice";
        modifiedPlan.carbs = 50;
        modifiedPlan.fat = 180;
      }
      
      if (calorieGoal) {
        const targetCalories = parseInt(calorieGoal);
        if (!isNaN(targetCalories)) {
          const ratio = targetCalories / modifiedPlan.calories;
          modifiedPlan.calories = targetCalories;
          modifiedPlan.protein = Math.round(modifiedPlan.protein * ratio);
          modifiedPlan.carbs = Math.round(modifiedPlan.carbs * ratio);
          modifiedPlan.fat = Math.round(modifiedPlan.fat * ratio);
        }
      }
      
      setGeneratedMealPlan(modifiedPlan);
      
      toast({
        title: "Meal Plan Generated",
        description: "Your personalized nutrition plan is ready"
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate a meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setShowGenerateForm(false);
    }
  };
  
  return (
    <Card className="bg-white rounded-2xl shadow-sm p-0 mb-6 overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <i className="fas fa-utensils text-white"></i>
            </div>
            <CardTitle className="text-xl font-semibold">AI Nutrition Planner</CardTitle>
          </div>
          {!showGenerateForm && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={() => setShowGenerateForm(true)}
            >
              <i className="fas fa-plus mr-2"></i>
              New Plan
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {showGenerateForm ? (
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="diet" className="text-sm font-medium mb-1 block">Dietary Preference</Label>
              <Select value={dietPreference} onValueChange={setDietPreference}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="allergies" className="text-sm font-medium mb-1 block">Food Allergies or Restrictions</Label>
              <Textarea 
                id="allergies"
                placeholder="e.g., nuts, dairy, gluten, shellfish"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="calories" className="text-sm font-medium mb-1 block">Daily Calorie Goal</Label>
              <Select value={calorieGoal} onValueChange={setCalorieGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select calorie goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1500">1500 calories (Weight Loss)</SelectItem>
                  <SelectItem value="2000">2000 calories (Maintenance)</SelectItem>
                  <SelectItem value="2500">2500 calories (Moderate Gain)</SelectItem>
                  <SelectItem value="3000">3000 calories (Bulking)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="primary"
                onClick={generateMealPlan}
                disabled={isGenerating}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-leaf mr-2"></i>
                    Generate Meal Plan
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowGenerateForm(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="p-4">
            <Skeleton className="h-14 w-full mb-4 rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : generatedMealPlan ? (
          <div>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-700">
                <i className="fas fa-lightbulb mr-2"></i>
                Based on your profile and preferences, we've created a personalized meal plan:
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">{generatedMealPlan.name}</h3>
                <div className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                  {generatedMealPlan.calories} calories
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{generatedMealPlan.description}</p>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Protein</p>
                  <p className="text-lg font-medium">{generatedMealPlan.protein}g</p>
                  <div className="w-full bg-blue-100 h-1 rounded-full mt-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{width: "30%"}}></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Carbs</p>
                  <p className="text-lg font-medium">{generatedMealPlan.carbs}g</p>
                  <div className="w-full bg-orange-100 h-1 rounded-full mt-1">
                    <div className="bg-orange-500 h-1 rounded-full" style={{width: "50%"}}></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Fat</p>
                  <p className="text-lg font-medium">{generatedMealPlan.fat}g</p>
                  <div className="w-full bg-green-100 h-1 rounded-full mt-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{width: "20%"}}></div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Sample Daily Meals</h4>
                {generatedMealPlan.meals.map((meal, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <i className={`fas ${
                        meal.name === "Breakfast" ? "fa-coffee" : 
                        meal.name === "Lunch" ? "fa-hamburger" : 
                        meal.name === "Dinner" ? "fa-utensils" : "fa-apple-alt"
                      } text-green-500`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{meal.name}</h5>
                        <span className="text-xs text-gray-500">{meal.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {meal.foods.map(f => f.name).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => setShowGenerateForm(true)}
                >
                  Regenerate
                </Button>
                <Button 
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save Plan
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-utensils text-green-500 text-xl"></i>
            </div>
            <p className="text-gray-600 mb-4">No meal plans available yet</p>
            <Button 
              onClick={() => setShowGenerateForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <i className="fas fa-leaf mr-2"></i>
              Generate Your First Meal Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
