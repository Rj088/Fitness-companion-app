import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/hooks/useUser";
import { MealCard } from "@/components/nutrition/MealCard";
import AINutritionRecommendation from "@/components/nutrition/AINutritionRecommendation";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Nutrition() {
  const [selectedDay, setSelectedDay] = useState(0);
  const days = ["Today", "Yesterday", "Monday", "Sunday", "Saturday"];
  const { user } = useUser();
  const [waterGlasses, setWaterGlasses] = useState(5);
  const waterGoal = 8;

  const breakfast = {
    title: "Breakfast",
    icon: "fas fa-coffee",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
    time: "8:30 AM",
    calories: 525,
    foods: [
      { id: 1, name: "Whole Grain Toast", servingSize: "2 slices", calories: 174, protein: 6, carbs: 30, fat: 2 },
      { id: 2, name: "Scrambled Eggs", servingSize: "2 large eggs", calories: 182, protein: 13, carbs: 1, fat: 12 },
      { id: 3, name: "Apple", servingSize: "1 medium", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
    ]
  };

  const lunch = {
    title: "Lunch",
    icon: "fas fa-utensils",
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
    time: "1:15 PM",
    calories: 640,
    foods: [
      { id: 4, name: "Grilled Chicken Salad", servingSize: "1 bowl", calories: 320, protein: 30, carbs: 15, fat: 15 },
      { id: 5, name: "Whole Grain Bread", servingSize: "1 slice", calories: 80, protein: 3, carbs: 15, fat: 1 },
      { id: 6, name: "Greek Yogurt", servingSize: "1 small container", calories: 140, protein: 15, carbs: 8, fat: 4 },
      { id: 7, name: "Banana", servingSize: "1 medium", calories: 100, protein: 1, carbs: 25, fat: 0.4 }
    ]
  };

  const dinner = {
    title: "Dinner",
    icon: "fas fa-hamburger",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
    time: "7:30 PM",
    calories: 675,
    foods: [
      { id: 8, name: "Salmon Fillet", servingSize: "5 oz", calories: 280, protein: 35, carbs: 0, fat: 12 },
      { id: 9, name: "Brown Rice", servingSize: "1 cup", calories: 215, protein: 5, carbs: 45, fat: 2 },
      { id: 10, name: "Steamed Broccoli", servingSize: "1 cup", calories: 55, protein: 4, carbs: 10, fat: 0.5 },
      { id: 11, name: "Olive Oil", servingSize: "1 tbsp", calories: 120, protein: 0, carbs: 0, fat: 14 }
    ]
  };

  const addWaterGlass = () => {
    if (waterGlasses < waterGoal) {
      setWaterGlasses(waterGlasses + 1);
    }
  };

  const totalCalories = breakfast.calories + lunch.calories + dinner.calories;
  const goalCalories = 2200;
  const caloriePercentage = Math.min(Math.round((totalCalories / goalCalories) * 100), 100);

  // Calculate total macros
  const totalProtein = [...breakfast.foods, ...lunch.foods, ...dinner.foods].reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = [...breakfast.foods, ...lunch.foods, ...dinner.foods].reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = [...breakfast.foods, ...lunch.foods, ...dinner.foods].reduce((sum, food) => sum + food.fat, 0);

  // Goals
  const proteinGoal = 130;
  const carbsGoal = 275;
  const fatGoal = 73;

  const proteinPercentage = Math.min(Math.round((totalProtein / proteinGoal) * 100), 100);
  const carbsPercentage = Math.min(Math.round((totalCarbs / carbsGoal) * 100), 100);
  const fatPercentage = Math.min(Math.round((totalFat / fatGoal) * 100), 100);

  return (
    <div id="nutrition-screen" className="bg-white pb-32">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Nutrition</h1>
          <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
            <i className="fas fa-plus text-gray-500"></i>
          </Button>
        </div>

        <div className="flex space-x-3 overflow-x-auto py-1 mb-2 no-scrollbar">
          {days.map((day, index) => (
            <Button 
              key={index}
              variant={selectedDay === index ? "default" : "outline"}
              className={`py-1.5 px-4 rounded-full text-sm whitespace-nowrap ${
                selectedDay === index 
                  ? "bg-primary text-white" 
                  : "bg-light text-gray-500"
              }`}
              onClick={() => setSelectedDay(index)}
            >
              {day}
            </Button>
          ))}
        </div>

        <Card className="bg-light rounded-2xl shadow-sm border-0 p-4 mb-4">
          <CardContent className="p-0">
            <h3 className="text-sm font-medium mb-3">Daily Summary</h3>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-500">Calories</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold">{totalCalories.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 ml-1">/ {goalCalories.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full border-4 border-primary flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-gray-200" 
                    style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)` }}
                  ></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-primary" 
                    style={{ 
                      clipPath: `polygon(0 0, ${caloriePercentage}% 0, ${caloriePercentage}% 100%, 0% 100%)`,
                      transform: "rotate(-90deg)",
                      transformOrigin: "center"
                    }}
                  ></div>
                  <p className="font-semibold z-10">{caloriePercentage}%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-gray-500">Proteins</p>
                  <p className="text-xs text-gray-500">{Math.round(totalProtein)}g</p>
                </div>
                <Progress value={proteinPercentage} />
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-gray-500">Carbs</p>
                  <p className="text-xs text-gray-500">{Math.round(totalCarbs)}g</p>
                </div>
                <Progress value={carbsPercentage} />
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-gray-500">Fat</p>
                  <p className="text-xs text-gray-500">{Math.round(totalFat)}g</p>
                </div>
                <Progress value={fatPercentage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-5">
        <AINutritionRecommendation user={user} />

        <Tabs defaultValue="meals">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            <MealCard {...breakfast} />
            <MealCard {...lunch} />
            <MealCard {...dinner} />
          </TabsContent>

          <TabsContent value="water">
            <Card className="bg-white rounded-2xl shadow-sm border-0 p-4 mb-4">
              <CardContent className="p-0">
                <h3 className="font-medium mb-4">Water Tracker</h3>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-xl font-bold">{waterGlasses}</p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>

                  <div className="relative w-24 h-24">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-blue-50 flex flex-col items-center justify-center">
                        <i className="fas fa-tint text-blue-500 mb-1"></i>
                        <p className="text-sm font-medium">{Math.round((waterGlasses / waterGoal) * 100)}%</p>
                      </div>
                    </div>
                    <svg className="absolute -top-1 -left-1" width="100" height="100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="48" 
                        fill="none" 
                        stroke="#3B82F6" 
                        strokeWidth="4"
                        strokeDasharray={`${(waterGlasses / waterGoal) * 300} 300`}
                        strokeDashoffset="75"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-bold">{waterGoal}</p>
                    <p className="text-xs text-gray-500">Goal</p>
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-1 mb-4">
                  {Array.from({ length: waterGoal }).map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-16 flex items-end ${index < waterGlasses ? 'opacity-100' : 'opacity-40'}`}
                    >
                      <div 
                        className={`w-full h-12 ${index < waterGlasses ? 'bg-blue-400' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}
                        style={{ 
                          height: `${(12 - index % 3) * 8}px`,
                          minHeight: '30px'
                        }}
                      >
                        <i className={`fas fa-glass-water ${index < waterGlasses ? 'text-white' : 'text-blue-300'} text-xs`}></i>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={addWaterGlass}
                  disabled={waterGlasses >= waterGoal}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Glass
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}