import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAllWorkouts } from "@/lib/hooks/useWorkouts";
import { WorkoutCard, RecentWorkout } from "@/components/workout/WorkoutPlan";
import { Skeleton } from "@/components/ui/skeleton";

type Category = "all" | "strength" | "cardio" | "flexibility" | "hiit";

export default function Workouts() {
  const [category, setCategory] = useState<Category>("all");
  const { data: workouts, isLoading } = useAllWorkouts(category !== "all" ? category : undefined);

  // Get recent workouts (simplified for demo)
  const recentWorkouts = workouts?.slice(0, 2).map(workout => ({
    ...workout,
    completedDate: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000)
  }));

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
      
      {/* Workout Categories */}
      <div className="px-5">
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
      </div>
      
      {/* Recommended Workouts */}
      <div className="px-5 py-4">
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
      <div className="px-5 py-4">
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
    </div>
  );
}
