import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActivities, useWeightLogs, useWorkoutHistory } from "@/lib/hooks/useProgress";
import ActivityChart from "@/components/charts/ActivityChart";
import WeightChart from "@/components/charts/WeightChart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type PeriodType = "weekly" | "monthly";

export default function Progress() {
  const [period, setPeriod] = useState<PeriodType>("weekly");
  const { data: activities, isLoading: activitiesLoading } = useActivities({ period });
  const { data: weightLogs, isLoading: weightLogsLoading } = useWeightLogs();
  const { data: workoutHistory, isLoading: workoutHistoryLoading } = useWorkoutHistory();

  // Get weekly stats (mocked for now)
  const weeklyStats = {
    steps: 32546,
    stepsChange: 12,
    calories: 2345,
    caloriesChange: 8,
    activeMinutes: 185,
    activeMinutesChange: 15
  };

  return (
    <div id="progress-screen" className="bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Progress</h1>
          <div className="flex space-x-2">
            <button 
              className={`text-sm font-medium ${period === 'weekly' ? 'text-primary' : 'text-gray-400'}`}
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </button>
            <button 
              className={`text-sm font-medium ${period === 'monthly' ? 'text-primary' : 'text-gray-400'}`}
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>
      
      {/* Weekly Summary */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-medium mb-3">
            {period === "weekly" ? "Weekly" : "Monthly"} Summary
          </h2>
          
          {/* Activity Chart */}
          {activitiesLoading ? (
            <Skeleton className="h-48 w-full mb-4" />
          ) : (
            <div className="h-48 mb-4">
              <ActivityChart data={activities || []} period={period} />
            </div>
          )}
          
          {/* Weekly Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <i className="fas fa-shoe-prints text-primary text-xs"></i>
                </div>
                <span className="text-xs text-green-500">+{weeklyStats.stepsChange}%</span>
              </div>
              <h3 className="text-lg font-semibold">{weeklyStats.steps.toLocaleString()}</h3>
              <p className="text-xs text-gray-500">Weekly Steps</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <i className="fas fa-fire-alt text-secondary text-xs"></i>
                </div>
                <span className="text-xs text-green-500">+{weeklyStats.caloriesChange}%</span>
              </div>
              <h3 className="text-lg font-semibold">{weeklyStats.calories.toLocaleString()}</h3>
              <p className="text-xs text-gray-500">Calories Burned</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <i className="fas fa-stopwatch text-success text-xs"></i>
                </div>
                <span className="text-xs text-green-500">+{weeklyStats.activeMinutesChange}%</span>
              </div>
              <h3 className="text-lg font-semibold">{weeklyStats.activeMinutes}</h3>
              <p className="text-xs text-gray-500">Active Minutes</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Workout History */}
      <div className="px-5 py-2">
        <h2 className="text-lg font-medium mb-3">Workout History</h2>
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          {workoutHistoryLoading ? (
            <>
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : workoutHistory && workoutHistory.length > 0 ? (
            <>
              {workoutHistory.slice(0, 3).map((workout, index) => (
                <div 
                  key={workout.id}
                  className={cn(
                    "flex items-center py-3",
                    index < workoutHistory.length - 1 && "border-b border-gray-100"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mr-4",
                    workout.workout.category === "strength" ? "bg-primary/10" : 
                    workout.workout.category === "cardio" ? "bg-secondary/10" : 
                    "bg-accent/10"
                  )}>
                    <i className={cn(
                      workout.workout.category === "strength" ? "fas fa-dumbbell text-primary" : 
                      workout.workout.category === "cardio" ? "fas fa-running text-secondary" : 
                      "fas fa-heartbeat text-accent"
                    )}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{workout.workout.name}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center mr-3">
                        <i className="far fa-clock text-xs text-gray-400 mr-1"></i>
                        <span className="text-xs text-gray-600">{workout.duration} min</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-fire-alt text-xs text-gray-400 mr-1"></i>
                        <span className="text-xs text-gray-600">{workout.caloriesBurned} cal</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-3">
                <Button variant="ghost" className="text-primary text-sm font-medium">
                  View more history
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-4">No workout history available</p>
          )}
        </div>
      </div>
      
      {/* Weight Progress */}
      <div className="px-5 py-2">
        <h2 className="text-lg font-medium mb-3">Weight Progress</h2>
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          {weightLogsLoading ? (
            <Skeleton className="h-40 w-full mb-4" />
          ) : (
            <div className="h-40 mb-4">
              <WeightChart data={weightLogs || []} />
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Starting Weight</p>
              <p className="font-medium">
                {weightLogs && weightLogs.length > 0 
                  ? `${Math.round(weightLogs[0].weight * 2.20462)} lbs` 
                  : '-- lbs'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Weight</p>
              <p className="font-medium">
                {weightLogs && weightLogs.length > 0 
                  ? `${Math.round(weightLogs[weightLogs.length - 1].weight * 2.20462)} lbs` 
                  : '-- lbs'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Goal Weight</p>
              <p className="font-medium">
                {weightLogs && weightLogs.length > 0 
                  ? '140 lbs' 
                  : '-- lbs'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
