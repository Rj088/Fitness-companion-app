import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserWorkout } from "@/lib/types";

interface WorkoutPlanProps {
  workout: UserWorkout;
}

export default function WorkoutPlan({ workout }: WorkoutPlanProps) {
  const [showAllExercises, setShowAllExercises] = useState(false);
  
  if (!workout.workout) {
    return <div>No workout data available</div>;
  }
  
  const { name, duration, difficulty, exercises } = workout.workout;
  const displayedExercises = showAllExercises ? exercises : exercises.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
          <i className="fas fa-dumbbell text-primary"></i>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{duration} minutes • {difficulty}</p>
        </div>
        <Button>Start</Button>
      </div>
      
      {/* Exercise List */}
      <div className="border-t border-gray-100 pt-3">
        {displayedExercises.map((exercise, index) => (
          <div key={exercise.id} className="flex items-center py-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <span className="text-xs font-medium">{index + 1}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{exercise.name}</p>
              <p className="text-xs text-gray-500">
                {exercise.sets && exercise.reps 
                  ? `${exercise.sets} sets x ${exercise.reps} reps` 
                  : exercise.duration 
                    ? `${Math.floor(exercise.duration / 60)} min ${exercise.duration % 60} sec`
                    : 'Complete exercise'
                }
              </p>
            </div>
          </div>
        ))}
        
        {exercises.length > 3 && (
          <div className="text-center mt-2">
            <button 
              className="text-primary text-sm font-medium"
              onClick={() => setShowAllExercises(!showAllExercises)}
            >
              {showAllExercises ? "Show less" : "View all exercises"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const WorkoutCard = ({ workout }: { workout: any }) => {
  const { name, description, imageUrl, duration, caloriesBurned, difficulty } = workout;
  
  // Function to determine difficulty level UI
  const getDifficultyDots = (level: string) => {
    switch(level.toLowerCase()) {
      case 'beginner':
        return (
          <div className="flex space-x-1">
            <div className="h-2 w-8 bg-primary rounded-full"></div>
            <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
          </div>
        );
      case 'intermediate':
        return (
          <div className="flex space-x-1">
            <div className="h-2 w-8 bg-primary rounded-full"></div>
            <div className="h-2 w-8 bg-primary rounded-full"></div>
            <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
          </div>
        );
      case 'advanced':
        return (
          <div className="flex space-x-1">
            <div className="h-2 w-8 bg-primary rounded-full"></div>
            <div className="h-2 w-8 bg-primary rounded-full"></div>
            <div className="h-2 w-8 bg-primary rounded-full"></div>
          </div>
        );
      default:
        return (
          <div className="flex space-x-1">
            <div className="h-2 w-8 bg-primary rounded-full"></div>
            <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-40 bg-gray-200 relative">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
          <div className="flex items-center mb-1">
            <i className="fas fa-fire-alt mr-1 text-accent"></i>
            <span className="text-xs">{caloriesBurned} calories</span>
            <div className="mx-2 w-1 h-1 bg-white rounded-full"></div>
            <i className="far fa-clock mr-1"></i>
            <span className="text-xs">{duration} min</span>
          </div>
          <h3 className="font-semibold text-lg">{name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          {getDifficultyDots(difficulty)}
          <span className="text-xs text-gray-500">{difficulty}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <Button className="w-full">
          Start Workout
        </Button>
      </div>
    </div>
  );
};

export const RecentWorkout = ({ workout }: { workout: any }) => {
  const { name, category } = workout;
  const completedDateText = workout.completedDate ? formatRelativeTime(workout.completedDate) : "";
  
  // Get icon based on workout category
  const getIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'strength': return 'fas fa-dumbbell text-primary';
      case 'cardio': return 'fas fa-running text-secondary';
      case 'hiit': return 'fas fa-heartbeat text-accent';
      case 'flexibility': return 'fas fa-child text-green-500';
      default: return 'fas fa-dumbbell text-primary';
    }
  };
  
  // Get background based on workout category
  const getBgColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'strength': return 'bg-primary/10';
      case 'cardio': return 'bg-secondary/10';
      case 'hiit': return 'bg-accent/10';
      case 'flexibility': return 'bg-green-100';
      default: return 'bg-primary/10';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
      <div className={`w-12 h-12 rounded-full ${getBgColor(category)} flex items-center justify-center mr-4`}>
        <i className={getIcon(category)}></i>
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-gray-500">
          {completedDateText} • {workout.duration} min • {workout.caloriesBurned} cal
        </p>
      </div>
      <button className="text-gray-400">
        <i className="fas fa-redo"></i>
      </button>
    </div>
  );
};

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
}
