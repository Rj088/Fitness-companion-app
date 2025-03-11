import { useState } from "react";
import { useUserMeals } from "@/lib/hooks/useNutrition";
import { useUser } from "@/lib/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FoodItemProps {
  name: string;
  servingSize: string;
  calories: number;
  icon: string;
  iconColor: string;
}

const FoodItem = ({ name, servingSize, calories, icon, iconColor }: FoodItemProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <div className="w-8 h-8 bg-gray-100 rounded-full mr-3 flex items-center justify-center overflow-hidden">
        <i className={`${icon} ${iconColor} text-xs`}></i>
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{servingSize}</p>
      </div>
    </div>
    <p className="text-sm">{calories} cal</p>
  </div>
);

interface MealSectionProps {
  title: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  time: string;
  calories: number;
  foods: {
    id: number;
    name: string;
    servingSize: string;
    calories: number;
    icon: string;
    iconColor: string;
  }[]
}

const MealSection = ({ title, icon, iconColor, iconBg, time, calories, foods }: MealSectionProps) => (
  <div className="bg-white rounded-2xl shadow-sm mb-4">
    <div className="flex items-center p-4 border-b border-gray-100">
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
        <i className={`${icon} ${iconColor}`}></i>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{calories} cal</p>
        </div>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <button className="text-primary">
        <i className="fas fa-plus"></i>
      </button>
    </div>
    
    <div className="p-4">
      {foods.map((food) => (
        <FoodItem
          key={food.id}
          name={food.name}
          servingSize={food.servingSize}
          calories={food.calories}
          icon={food.icon}
          iconColor={food.iconColor}
        />
      ))}
    </div>
  </div>
);

export default function Nutrition() {
  const { data: userMeals, isLoading: mealsLoading } = useUserMeals({ 
    date: new Date().toISOString().split('T')[0] 
  });
  const { data: user } = useUser();

  // Group meals by type
  const getMealsByType = () => {
    if (!userMeals) return {};
    
    return userMeals.reduce((acc, meal) => {
      const type = meal.mealType;
      if (!acc[type]) {
        acc[type] = {
          foods: [],
          totalCalories: 0,
          time: getTimeForMealType(type)
        };
      }
      
      acc[type].foods.push({
        id: meal.id,
        name: meal.food.name,
        servingSize: `${meal.servings} ${meal.food.servingSize || 'serving'}`,
        calories: Math.round(meal.food.calories * meal.servings),
        icon: getFoodIcon(meal.food.name),
        iconColor: getFoodIconColor(meal.food.name)
      });
      
      acc[type].totalCalories += Math.round(meal.food.calories * meal.servings);
      return acc;
    }, {} as Record<string, { foods: any[], totalCalories: number, time: string }>);
  };

  // Calculate macros and total calories
  const calculateNutrition = () => {
    if (!userMeals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return userMeals.reduce((acc, meal) => {
      const { food, servings } = meal;
      acc.calories += Math.round(food.calories * servings);
      acc.protein += Math.round((food.protein || 0) * servings);
      acc.carbs += Math.round((food.carbs || 0) * servings);
      acc.fat += Math.round((food.fat || 0) * servings);
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Helper functions for meal display
  const getTimeForMealType = (type: string): string => {
    switch (type) {
      case 'breakfast': return '7:30 AM';
      case 'lunch': return '12:30 PM';
      case 'dinner': return '6:30 PM';
      case 'snack': return '3:30 PM';
      default: return '';
    }
  };

  const getFoodIcon = (foodName: string): string => {
    const foodName_lower = foodName.toLowerCase();
    if (foodName_lower.includes('bread') || foodName_lower.includes('oatmeal')) return 'fas fa-bread-slice';
    if (foodName_lower.includes('banana') || foodName_lower.includes('apple') || foodName_lower.includes('fruit')) return 'fas fa-apple-alt';
    if (foodName_lower.includes('coffee')) return 'fas fa-mug-hot';
    if (foodName_lower.includes('chicken') || foodName_lower.includes('meat')) return 'fas fa-drumstick-bite';
    if (foodName_lower.includes('salad') || foodName_lower.includes('vegetable')) return 'fas fa-leaf';
    if (foodName_lower.includes('oil') || foodName_lower.includes('dressing')) return 'fas fa-wine-bottle';
    if (foodName_lower.includes('yogurt') || foodName_lower.includes('cheese')) return 'fas fa-cheese';
    if (foodName_lower.includes('almond') || foodName_lower.includes('nuts')) return 'fas fa-seedling';
    return 'fas fa-utensils';
  };

  const getFoodIconColor = (foodName: string): string => {
    const foodName_lower = foodName.toLowerCase();
    if (foodName_lower.includes('bread') || foodName_lower.includes('oatmeal')) return 'text-yellow-700';
    if (foodName_lower.includes('banana') || foodName_lower.includes('apple') || foodName_lower.includes('fruit')) return 'text-red-500';
    if (foodName_lower.includes('coffee')) return 'text-yellow-900';
    if (foodName_lower.includes('chicken') || foodName_lower.includes('meat')) return 'text-yellow-700';
    if (foodName_lower.includes('salad') || foodName_lower.includes('vegetable')) return 'text-green-500';
    if (foodName_lower.includes('oil') || foodName_lower.includes('dressing')) return 'text-green-700';
    if (foodName_lower.includes('yogurt') || foodName_lower.includes('cheese')) return 'text-yellow-400';
    if (foodName_lower.includes('almond') || foodName_lower.includes('nuts')) return 'text-green-800';
    return 'text-gray-600';
  };

  const mealsByType = getMealsByType();
  const nutrition = calculateNutrition();
  const calorieGoal = user?.dailyCalorieGoal || 2000;
  const caloriePercentage = Math.round((nutrition.calories / calorieGoal) * 100);

  return (
    <div id="nutrition-screen" className="bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Nutrition</h1>
          <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      
      {/* Today's Summary */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-medium mb-3">Daily Summary</h2>
          
          {mealsLoading ? (
            <Skeleton className="h-40 w-40 rounded-full mx-auto mb-4" />
          ) : (
            <div className="flex justify-center mb-4">
              <div className="w-40 h-40 relative">
                <svg className="w-full h-full">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#3182CE"
                    strokeWidth="10"
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * caloriePercentage / 100)}
                    transform="rotate(-90 80 80)"
                  />
                  <text x="80" y="75" textAnchor="middle" className="text-2xl font-bold">{nutrition.calories}</text>
                  <text x="80" y="95" textAnchor="middle" className="text-xs text-gray-500">of {calorieGoal} cal</text>
                </svg>
              </div>
            </div>
          )}
          
          {mealsLoading ? (
            <Skeleton className="h-20 w-full mb-4" />
          ) : (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg bg-blue-50">
                <p className="text-xs text-gray-500">Carbs</p>
                <p className="font-semibold">{nutrition.carbs}g</p>
                <p className="text-xs text-gray-500">70%</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-50">
                <p className="text-xs text-gray-500">Protein</p>
                <p className="font-semibold">{nutrition.protein}g</p>
                <p className="text-xs text-gray-500">72%</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-yellow-50">
                <p className="text-xs text-gray-500">Fats</p>
                <p className="font-semibold">{nutrition.fat}g</p>
                <p className="text-xs text-gray-500">58%</p>
              </div>
            </div>
          )}
          
          <Button className="w-full">
            Add Food
          </Button>
        </div>
      </div>
      
      {/* Today's Meals */}
      <div className="px-5 py-2">
        <h2 className="text-lg font-medium mb-3">Today's Meals</h2>
        
        {mealsLoading ? (
          <>
            <Skeleton className="h-40 w-full mb-4 rounded-2xl" />
            <Skeleton className="h-40 w-full mb-4 rounded-2xl" />
          </>
        ) : (
          <>
            {/* Breakfast */}
            {mealsByType.breakfast && (
              <MealSection
                title="Breakfast"
                icon="fas fa-coffee"
                iconColor="text-yellow-500"
                iconBg="bg-yellow-100"
                time={mealsByType.breakfast.time}
                calories={mealsByType.breakfast.totalCalories}
                foods={mealsByType.breakfast.foods}
              />
            )}
            
            {/* Lunch */}
            {mealsByType.lunch && (
              <MealSection
                title="Lunch"
                icon="fas fa-utensils"
                iconColor="text-green-500"
                iconBg="bg-green-100"
                time={mealsByType.lunch.time}
                calories={mealsByType.lunch.totalCalories}
                foods={mealsByType.lunch.foods}
              />
            )}
            
            {/* Snack */}
            {mealsByType.snack && (
              <MealSection
                title="Snack"
                icon="fas fa-apple-alt"
                iconColor="text-orange-500"
                iconBg="bg-orange-100"
                time={mealsByType.snack.time}
                calories={mealsByType.snack.totalCalories}
                foods={mealsByType.snack.foods}
              />
            )}
            
            {/* Dinner */}
            {mealsByType.dinner && (
              <MealSection
                title="Dinner"
                icon="fas fa-drumstick-bite"
                iconColor="text-red-500"
                iconBg="bg-red-100"
                time={mealsByType.dinner.time}
                calories={mealsByType.dinner.totalCalories}
                foods={mealsByType.dinner.foods}
              />
            )}

            {(!userMeals || userMeals.length === 0) && (
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <p className="text-gray-500 mb-4">No meals logged today</p>
                <Button>Add Your First Meal</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
