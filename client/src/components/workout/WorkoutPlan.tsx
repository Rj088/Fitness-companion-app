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
  const { name, description, imageUrl, duration, caloriesBurned, difficulty, category, exercises = [] } = workout;
  
  // Function to determine category icon and colors
  const getCategoryInfo = (category: string) => {
    // Convert category to lowercase for case-insensitive matching
    const cat = category?.toLowerCase() || 'strength';
    
    // Check for specific workout types based on name/description
    if (name?.toLowerCase().includes('chest') || description?.toLowerCase().includes('chest')) {
      return { icon: 'fas fa-dumbbell', color: 'text-blue-600', bg: 'bg-blue-100', label: 'Chest' };
    }
    if (name?.toLowerCase().includes('back') || description?.toLowerCase().includes('back')) {
      return { icon: 'fas fa-dumbbell', color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Back' };
    }
    if (name?.toLowerCase().includes('bicep') || description?.toLowerCase().includes('bicep')) {
      return { icon: 'fas fa-dumbbell', color: 'text-purple-600', bg: 'bg-purple-100', label: 'Biceps' };
    }
    if (name?.toLowerCase().includes('crossfit') || description?.toLowerCase().includes('crossfit')) {
      return { icon: 'fas fa-fire-alt', color: 'text-red-600', bg: 'bg-red-100', label: 'CrossFit' };
    }
    if (name?.toLowerCase().includes('ai') || name?.toLowerCase().includes('smart')) {
      return { icon: 'fas fa-robot', color: 'text-blue-500', bg: 'bg-blue-100', label: 'AI Generated' };
    }
    
    // Default mappings based on general categories
    switch(cat) {
      case 'strength': 
        return { icon: 'fas fa-dumbbell', color: 'text-primary', bg: 'bg-primary/10', label: 'Strength' };
      case 'cardio': 
        return { icon: 'fas fa-running', color: 'text-secondary', bg: 'bg-secondary/10', label: 'Cardio' };
      case 'flexibility': 
        return { icon: 'fas fa-child', color: 'text-green-500', bg: 'bg-green-100', label: 'Flexibility' };
      case 'hiit': 
        return { icon: 'fas fa-heartbeat', color: 'text-accent', bg: 'bg-accent/10', label: 'HIIT' };
      default:
        return { icon: 'fas fa-dumbbell', color: 'text-primary', bg: 'bg-primary/10', label: 'Workout' };
    }
  };
  
  // Function to determine difficulty level UI
  const getDifficultyDots = (level: string) => {
    switch(level?.toLowerCase()) {
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

  const categoryInfo = getCategoryInfo(category);
  const fallbackImage = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={imageUrl || fallbackImage} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
          <div className="flex items-center mb-1">
            <i className="fas fa-fire-alt mr-1 text-accent"></i>
            <span className="text-xs">{caloriesBurned || '250'} calories</span>
            <div className="mx-2 w-1 h-1 bg-white rounded-full"></div>
            <i className="far fa-clock mr-1"></i>
            <span className="text-xs">{duration || '30'} min</span>
          </div>
          <h3 className="font-semibold text-lg">{name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          {getDifficultyDots(difficulty)}
          <div className="flex items-center">
            <i className={`${categoryInfo.icon} ${categoryInfo.color} mr-1`}></i>
            <span className="text-xs text-gray-500">{categoryInfo.label}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{description || `A great ${categoryInfo.label.toLowerCase()} workout to improve your fitness.`}</p>
        
        {exercises.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <i className="fas fa-list-ul mr-1"></i>
              <span>Exercise summary</span>
            </div>
            <div className="text-xs text-gray-700">
              {exercises.slice(0, 3).map((ex: any, idx: number) => (
                <span key={idx} className="inline-block mr-2 mb-1 bg-gray-100 px-2 py-1 rounded-full">
                  {ex.name}
                </span>
              ))}
              {exercises.length > 3 && (
                <span className="inline-block text-primary">
                  +{exercises.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <Button className="w-full">
          Start Workout
        </Button>
      </div>
    </div>
  );
};

export const RecentWorkout = ({ workout }: { workout: any }) => {
  const { name, category, description } = workout;
  const completedDateText = workout.completedDate ? formatRelativeTime(workout.completedDate) : "";
  
  // Get icon and colors based on category or specialized workouts
  const getCategoryInfo = () => {
    // Check for specific workout types based on name/description
    if (name?.toLowerCase().includes('chest') || description?.toLowerCase().includes('chest')) {
      return { icon: 'fas fa-dumbbell', color: 'text-blue-600', bg: 'bg-blue-100' };
    }
    if (name?.toLowerCase().includes('back') || description?.toLowerCase().includes('back')) {
      return { icon: 'fas fa-dumbbell', color: 'text-indigo-600', bg: 'bg-indigo-100' };
    }
    if (name?.toLowerCase().includes('bicep') || description?.toLowerCase().includes('bicep')) {
      return { icon: 'fas fa-dumbbell', color: 'text-purple-600', bg: 'bg-purple-100' };
    }
    if (name?.toLowerCase().includes('crossfit') || description?.toLowerCase().includes('crossfit')) {
      return { icon: 'fas fa-fire-alt', color: 'text-red-600', bg: 'bg-red-100' };
    }
    if (name?.toLowerCase().includes('ai') || name?.toLowerCase().includes('smart')) {
      return { icon: 'fas fa-robot', color: 'text-blue-500', bg: 'bg-blue-100' };
    }
    
    // Default categories
    const cat = category?.toLowerCase() || 'strength';
    switch(cat) {
      case 'strength': return { icon: 'fas fa-dumbbell', color: 'text-primary', bg: 'bg-primary/10' };
      case 'cardio': return { icon: 'fas fa-running', color: 'text-secondary', bg: 'bg-secondary/10' };
      case 'hiit': return { icon: 'fas fa-heartbeat', color: 'text-accent', bg: 'bg-accent/10' };
      case 'flexibility': return { icon: 'fas fa-child', color: 'text-green-500', bg: 'bg-green-100' };
      default: return { icon: 'fas fa-dumbbell', color: 'text-primary', bg: 'bg-primary/10' };
    }
  };
  
  const categoryInfo = getCategoryInfo();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
      <div className={`w-12 h-12 rounded-full ${categoryInfo.bg} flex items-center justify-center mr-4`}>
        <i className={`${categoryInfo.icon} ${categoryInfo.color}`}></i>
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-gray-500">
          {completedDateText} • {workout.duration || 30} min • {workout.caloriesBurned || 250} cal
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
