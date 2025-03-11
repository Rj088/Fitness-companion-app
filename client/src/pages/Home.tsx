import { useUser } from "@/lib/hooks/useUser";
import { useWorkouts } from "@/lib/hooks/useWorkouts";
import { useActivities } from "@/lib/hooks/useProgress";
import { useUserMeals } from "@/lib/hooks/useNutrition";
import CircularProgress from "@/components/CircularProgress";
import WorkoutPlan from "@/components/workout/WorkoutPlan";
import MacroSummary from "@/components/nutrition/MacroSummary";
import MealItem from "@/components/nutrition/MealItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const { data: todayActivities, isLoading: isLoadingActivities } = useActivities();
  const { data: userWorkouts, isLoading: isLoadingWorkouts } = useWorkouts({ 
    date: new Date().toISOString().split('T')[0] 
  });
  const { data: userMeals, isLoading: isLoadingMeals } = useUserMeals({ 
    date: new Date().toISOString().split('T')[0] 
  });

  // Calculate steps percentage
  const stepsPercentage = user && todayActivities 
    ? Math.round((todayActivities.steps / user.dailyStepsGoal) * 100)
    : 0;

  // Calculate calories percentage (assuming 800 calories burned daily goal)
  const caloriesPercentage = todayActivities 
    ? Math.round((todayActivities.caloriesBurned / 800) * 100)
    : 0;

  // Calculate active minutes percentage (assuming 50 minutes daily goal)
  const activeMinutesPercentage = todayActivities
    ? Math.round((todayActivities.activeMinutes / 50) * 100)
    : 0;

  // Calculate macros from meals
  const calculateMacros = () => {
    if (!userMeals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return userMeals.reduce((acc, meal) => {
      const { food, servings } = meal;
      acc.calories += food.calories * servings;
      acc.protein += (food.protein || 0) * servings;
      acc.carbs += (food.carbs || 0) * servings;
      acc.fat += (food.fat || 0) * servings;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const macros = calculateMacros();

  // Group meals by type
  const mealsByType = userMeals?.reduce((acc, meal) => {
    const type = meal.mealType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, typeof userMeals>);

  // Get today's workout
  const todayWorkout = userWorkouts && userWorkouts.length > 0 ? userWorkouts[0] : null;

  return (
    <div id="home-screen" className="bg-white pb-24">
      {/* Welcome Header */}
      <div className="px-5 pt-6 pb-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            {isLoadingUser ? (
              <>
                <Skeleton className="h-7 w-40 mb-1" />
                <Skeleton className="h-5 w-32" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">Hello, {user?.firstName || 'User'}</h1>
                <p className="text-gray-500">Let's crush your goals today!</p>
              </>
            )}
          </div>
          <div className="h-10 w-10 rounded-full bg-light flex items-center justify-center">
            <i className="fas fa-user text-gray-400"></i>
          </div>
        </div>
      </div>
      
      {/* Daily Progress */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-medium mb-3">Today's Progress</h2>
          {isLoadingActivities ? (
            <div className="flex justify-between items-center">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              {/* Steps Progress */}
              <div className="text-center">
                <CircularProgress 
                  value={stepsPercentage} 
                  size={64} 
                  strokeWidth={4} 
                  color="text-primary" 
                />
                <p className="text-xs mt-1 text-gray-500">Steps</p>
                <p className="text-sm font-medium">{todayActivities?.steps.toLocaleString()}</p>
              </div>
              
              {/* Calories Progress */}
              <div className="text-center">
                <CircularProgress 
                  value={caloriesPercentage} 
                  size={64} 
                  strokeWidth={4} 
                  color="text-secondary" 
                />
                <p className="text-xs mt-1 text-gray-500">Calories</p>
                <p className="text-sm font-medium">{todayActivities?.caloriesBurned}</p>
              </div>
              
              {/* Active Minutes Progress */}
              <div className="text-center">
                <CircularProgress 
                  value={activeMinutesPercentage} 
                  size={64} 
                  strokeWidth={4} 
                  color="text-success" 
                />
                <p className="text-xs mt-1 text-gray-500">Active Min</p>
                <p className="text-sm font-medium">{todayActivities?.activeMinutes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Today's Plan */}
      <div className="px-5 py-2">
        <h2 className="text-lg font-medium mb-3">Today's Plan</h2>
        {isLoadingWorkouts ? (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : todayWorkout ? (
          <WorkoutPlan workout={todayWorkout} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 text-center">
            <p className="text-gray-500 mb-4">No workout planned for today</p>
            <Button>Add Workout</Button>
          </div>
        )}
      </div>
      
      {/* Nutrition Summary */}
      <div className="px-5 py-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Nutrition</h2>
          <Button variant="ghost" className="text-primary text-sm font-medium p-0">Add Meal</Button>
        </div>
        {isLoadingMeals ? (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <MacroSummary
              calories={macros.calories}
              protein={macros.protein}
              carbs={macros.carbs}
              fat={macros.fat}
              calorieGoal={user?.dailyCalorieGoal || 2000}
              proteinGoal={120}
              carbsGoal={200}
              fatGoal={65}
            />
            
            {/* Today's Meals */}
            <div className="border-t border-gray-100 pt-3">
              <h3 className="font-medium text-sm mb-2">Today's Meals</h3>
              
              {mealsByType?.breakfast && mealsByType.breakfast.length > 0 && (
                <MealItem
                  icon="fas fa-coffee"
                  iconColor="text-yellow-500"
                  iconBg="bg-yellow-100"
                  title="Breakfast"
                  subtitle={`${mealsByType.breakfast.map(m => m.food.name).join(', ')} • ${mealsByType.breakfast.reduce((sum, m) => sum + m.food.calories * m.servings, 0)} cal`}
                />
              )}
              
              {mealsByType?.lunch && mealsByType.lunch.length > 0 && (
                <MealItem
                  icon="fas fa-utensils"
                  iconColor="text-green-500"
                  iconBg="bg-green-100"
                  title="Lunch"
                  subtitle={`${mealsByType.lunch.map(m => m.food.name).join(', ')} • ${mealsByType.lunch.reduce((sum, m) => sum + m.food.calories * m.servings, 0)} cal`}
                />
              )}
              
              {mealsByType?.snack && mealsByType.snack.length > 0 && (
                <MealItem
                  icon="fas fa-apple-alt"
                  iconColor="text-orange-500"
                  iconBg="bg-orange-100"
                  title="Snack"
                  subtitle={`${mealsByType.snack.map(m => m.food.name).join(', ')} • ${mealsByType.snack.reduce((sum, m) => sum + m.food.calories * m.servings, 0)} cal`}
                />
              )}

              {mealsByType?.dinner && mealsByType.dinner.length > 0 && (
                <MealItem
                  icon="fas fa-drumstick-bite"
                  iconColor="text-red-500"
                  iconBg="bg-red-100"
                  title="Dinner"
                  subtitle={`${mealsByType.dinner.map(m => m.food.name).join(', ')} • ${mealsByType.dinner.reduce((sum, m) => sum + m.food.calories * m.servings, 0)} cal`}
                />
              )}

              {(!userMeals || userMeals.length === 0) && (
                <p className="text-gray-500 text-center py-4">No meals logged today</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
