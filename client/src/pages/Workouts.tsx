import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAllWorkouts } from "@/lib/hooks/useWorkouts";
import { WorkoutCard, RecentWorkout } from "@/components/workout/WorkoutPlan";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/hooks/useUser";
import AIWorkoutRecommendation from "@/components/workout/AIWorkoutRecommendation";

type Category = "all" | "strength" | "cardio" | "flexibility" | "hiit" | "chest" | "back" | "biceps" | "crossfit";

export default function Workouts() {
  const [category, setCategory] = useState<Category>("all");
  const [activeTab, setActiveTab] = useState<string>("discover");
  const { data: workouts, isLoading } = useAllWorkouts(category !== "all" ? category : undefined);
  const { data: user } = useUser();

  // Get recent workouts (simplified for demo)
  const recentWorkouts = workouts?.slice(0, 2).map(workout => ({
    ...workout,
    completedDate: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000)
  }));

  // Filter workouts by keyword search in name and description
  const getWorkoutsByKeyword = (keyword: string) => {
    if (!workouts) return [];
    return workouts.filter(
      workout => 
        workout.name.toLowerCase().includes(keyword.toLowerCase()) || 
        (workout.description && workout.description.toLowerCase().includes(keyword.toLowerCase()))
    );
  };

  // Get workouts by specialized categories
  const chestWorkouts = getWorkoutsByKeyword("chest");
  const backWorkouts = getWorkoutsByKeyword("back");
  const bicepsWorkouts = getWorkoutsByKeyword("biceps");
  const crossfitWorkouts = getWorkoutsByKeyword("crossfit");
  
  // Find AI workout recommendations
  const aiWorkouts = workouts?.filter(workout => workout.name.includes("AI") || workout.name.includes("Smart"));

  return (
    <div id="workout-screen" className="bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Workouts</h1>
          <button className="w-10 h-10 rounded-full bg-light flex items-center justify-center">
            <i className="fas fa-filter text-gray-500"></i>
          </button>
        </div>
      </div>
      
      {/* Main tabs */}
      <div className="px-5 mb-2">
        <Tabs defaultValue="discover" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-3 mb-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="ai">AI Suggest</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            {/* Workout Categories */}
            <div className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide">
              <Button
                variant={category === "all" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("all")}
              >
                All Workouts
              </Button>
              <Button
                variant={category === "strength" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "strength" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("strength")}
              >
                Strength
              </Button>
              <Button
                variant={category === "cardio" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "cardio" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("cardio")}
              >
                Cardio
              </Button>
              <Button
                variant={category === "flexibility" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "flexibility" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("flexibility")}
              >
                Flexibility
              </Button>
              <Button
                variant={category === "hiit" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "hiit" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("hiit")}
              >
                HIIT
              </Button>
            </div>
              
            {/* Recommended Workouts */}
            <div className="py-4">
              <h2 className="text-lg font-medium mb-3">Recommended For You</h2>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              ) : workouts && workouts.length > 0 ? (
                <div className="space-y-4">
                  {workouts.slice(0, 2).map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                  <p className="text-gray-500">No workouts available</p>
                </div>
              )}
            </div>
              
            {/* Recent Workouts */}
            <div className="py-4">
              <h2 className="text-lg font-medium mb-3">Your Recent Workouts</h2>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ) : recentWorkouts && recentWorkouts.length > 0 ? (
                <div className="space-y-3">
                  {recentWorkouts.map((workout) => (
                    <RecentWorkout key={workout.id} workout={workout} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                  <p className="text-gray-500">No recent workouts</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            {/* Specialized Categories */}
            <div className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide">
              <Button
                variant={category === "chest" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "chest" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("chest")}
              >
                Chest
              </Button>
              <Button
                variant={category === "back" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "back" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("back")}
              >
                Back
              </Button>
              <Button
                variant={category === "biceps" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "biceps" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("biceps")}
              >
                Biceps
              </Button>
              <Button
                variant={category === "crossfit" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "crossfit" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("crossfit")}
              >
                CrossFit
              </Button>
            </div>
            
            {/* Category-specific workouts */}
            <div className="py-4">
              <h2 className="text-lg font-medium mb-3">
                {category === "chest" ? "Chest Workouts" : 
                 category === "back" ? "Back Workouts" : 
                 category === "biceps" ? "Biceps Workouts" : 
                 category === "crossfit" ? "CrossFit Workouts" : 
                 "Specialized Workouts"}
              </h2>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              ) : (
                <div className="space-y-4">
                  {category === "chest" && chestWorkouts.length > 0 ? (
                    chestWorkouts.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} />
                    ))
                  ) : category === "back" && backWorkouts.length > 0 ? (
                    backWorkouts.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} />
                    ))
                  ) : category === "biceps" && bicepsWorkouts.length > 0 ? (
                    bicepsWorkouts.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} />
                    ))
                  ) : category === "crossfit" && crossfitWorkouts.length > 0 ? (
                    crossfitWorkouts.map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} />
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                      <p className="text-gray-500">No workouts available in this category</p>
                      <Button 
                        onClick={() => setActiveTab("discover")}
                        className="mt-3"
                      >
                        Browse All Workouts
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            {/* Workout Categories for AI Tab */}
            <div className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide">
              <Button
                variant={category === "strength" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "strength" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("strength")}
              >
                Strength
              </Button>
              <Button
                variant={category === "cardio" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "cardio" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("cardio")}
              >
                Cardio
              </Button>
              <Button
                variant={category === "flexibility" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "flexibility" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("flexibility")}
              >
                Flexibility
              </Button>
              <Button
                variant={category === "hiit" ? "default" : "outline"}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  category === "hiit" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCategory("hiit")}
              >
                HIIT
              </Button>
            </div>
            
            {/* AI Workout Recommendation */}
            <AIWorkoutRecommendation 
              user={user} 
              aiWorkouts={aiWorkouts}
              isLoading={isLoading}
              selectedCategory={category as 'strength' | 'cardio' | 'flexibility' | 'hiit'}
            />
            
            {/* Personalized for You */}
            <div className="py-2">
              <h2 className="text-lg font-medium mb-3">Personalized for You</h2>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              ) : workouts ? (
                <div className="space-y-4">
                  {workouts
                    .filter(w => w.difficulty === user?.fitnessLevel)
                    .slice(0, 2)
                    .map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} />
                    ))
                  }
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                  <p className="text-gray-500">No personalized workouts available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
