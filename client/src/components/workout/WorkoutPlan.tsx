import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserWorkout } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Clock, ArrowRight, CheckCircle, Redo, PlayCircle, Bookmark } from "lucide-react";

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
          <Dumbbell className="h-6 w-6 text-primary" />
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
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState(0);

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Workout removed from saved" : "Workout saved",
      description: saved ? "Workout has been removed from your saved list" : "Workout has been added to your saved list",
      variant: saved ? "destructive" : "default",
    });
  };

  const startWorkout = () => {
    setIsStarted(true);
    setShowDetails(true);
    toast({
      title: "Workout Started",
      description: "Let's crush this workout! Follow the exercises in sequence.",
      variant: "default",
    });
  };

  const nextExercise = () => {
    if (currentExercise < (workout.exercises?.length || 0) - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseProgress(0);
    } else {
      // Workout complete
      setIsStarted(false);
      setCurrentExercise(0);
      setExerciseProgress(0);
      setShowDetails(false);
      toast({
        title: "Workout Complete!",
        description: "Great job! You've completed your workout.",
        variant: "default",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="relative h-40 overflow-hidden">
          <img src={workout.imageUrl} alt={workout.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div>
              <div className="flex items-center mb-1">
                <span className="text-xs font-medium text-white bg-blue-500 rounded-full px-2 py-0.5 mr-2">{workout.category}</span>
                <span className="text-xs font-medium text-white bg-orange-500 rounded-full px-2 py-0.5">{workout.difficulty}</span>
              </div>
              <h3 className="text-white font-semibold">{workout.name}</h3>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <i className="fas fa-clock text-blue-500 text-xs"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium">{workout.duration} min</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                <i className="fas fa-fire text-orange-500 text-xs"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">Calories</p>
                <p className="text-sm font-medium">{workout.caloriesBurned}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <i className="fas fa-dumbbell text-purple-500 text-xs"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">Exercises</p>
                <p className="text-sm font-medium">{workout.exercises ? workout.exercises.length : 0}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workout.description}</p>
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-primary text-white py-2 rounded-xl text-sm hover:bg-primary/90"
              onClick={startWorkout}
            >
              <i className="fas fa-play-circle mr-2"></i>
              Start Workout
            </Button>
            <Button
              variant="outline"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center p-0"
              onClick={handleSave}
            >
              <i className={`${saved ? 'fas fa-bookmark text-blue-500' : 'far fa-bookmark text-gray-400'}`}></i>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{workout.name}</DialogTitle>
          </DialogHeader>

          {isStarted && workout.exercises && workout.exercises.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">
                    {workout.exercises[currentExercise].name}
                  </h3>
                  <span className="text-sm text-blue-700">
                    {currentExercise + 1}/{workout.exercises.length}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{workout.exercises[currentExercise].sets} sets</span>
                  <span>{workout.exercises[currentExercise].reps} reps</span>
                </div>

                <Progress value={exerciseProgress} className="h-2 mb-2" />

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setExerciseProgress(Math.min(exerciseProgress + 20, 100))}
                  >
                    <i className="fas fa-check mr-1"></i> Complete Set
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={nextExercise}
                    disabled={exerciseProgress < 100}
                  >
                    {currentExercise < workout.exercises.length - 1 ? (
                      <>Next Exercise<i className="fas fa-arrow-right ml-1"></i></>
                    ) : (
                      <>Finish Workout<i className="fas fa-flag-checkered ml-1"></i></>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg divide-y">
                {workout.exercises.map((exercise, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 ${index === currentExercise ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        index < currentExercise 
                          ? 'bg-green-100 text-green-500' 
                          : index === currentExercise 
                            ? 'bg-blue-100 text-blue-500' 
                            : 'bg-gray-100 text-gray-500'
                      }`}>
                        {index < currentExercise ? (
                          <i className="fas fa-check text-xs"></i>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className={index < currentExercise ? 'line-through text-gray-400' : ''}>
                        {exercise.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {exercise.sets}×{exercise.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">{workout.description}</p>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <i className="fas fa-clock text-blue-500 mb-1"></i>
                  <p className="text-sm font-medium">{workout.duration} min</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <i className="fas fa-fire text-orange-500 mb-1"></i>
                  <p className="text-sm font-medium">{workout.caloriesBurned}</p>
                  <p className="text-xs text-gray-500">Calories</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <i className="fas fa-dumbbell text-purple-500 mb-1"></i>
                  <p className="text-sm font-medium">{workout.difficulty}</p>
                  <p className="text-xs text-gray-500">Level</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 font-medium border-b">
                  Exercises
                </div>
                <div className="divide-y">
                  {workout.exercises?.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <span>{exercise.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {exercise.sets}×{exercise.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <i className="far fa-bookmark mr-2"></i>
                  Save for Later
                </Button>
                <Button onClick={startWorkout}>
                  <i className="fas fa-play-circle mr-2"></i>
                  Start Workout
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

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